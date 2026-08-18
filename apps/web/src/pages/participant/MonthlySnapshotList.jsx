import {
  CalendarDays,
  Lock,
  PenLine,
  Sparkles,
  LoaderCircle,
  TriangleAlert,
  ChevronRight,
  MessageSquarePlus,
  Download,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SNAPSHOT_STATUS, monthLabel } from '@tmg180/shared';
import { formatShortDate } from '../../lib/dates';
import {
  useGenerateSnapshot,
  useSnapshotMonths,
  useSnapshots,
} from '../../hooks/participant/snapshot';
import { PARTICIPANT_PATHS, participantSnapshotPath } from '../../routes/paths';

/**
 * Monthly Snapshot — the months you can compile, and the ones you already have.
 *
 * The design has the snapshot itself (draft, generating, locked, addendum) but
 * no screen listing months, so this is built in the portal's idiom and flagged
 * to Saf. It exists because a snapshot is usually written after the month has
 * ended: without it, only the current month would ever be reachable.
 */

function StatusChip({ status }) {
  if (status === SNAPSHOT_STATUS.LOCKED) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
        <Lock size={11} />
        Approved and locked
      </span>
    );
  }
  if (status === SNAPSHOT_STATUS.DRAFT) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700">
        <PenLine size={11} />
        Draft — your review
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
      Not compiled yet
    </span>
  );
}

export default function MonthlySnapshotList() {
  const navigate = useNavigate();
  const months = useSnapshotMonths();
  const snapshots = useSnapshots();
  const generate = useGenerateSnapshot();

  const byMonth = new Map((snapshots.data ?? []).map((snapshot) => [snapshot.monthYear, snapshot]));
  const isLoading = months.isLoading || snapshots.isLoading;
  const error = months.error ?? snapshots.error;

  const open = (snapshot) =>
    navigate(
      snapshot.status === SNAPSHOT_STATUS.LOCKED
        ? participantSnapshotPath.detail(snapshot.id)
        : participantSnapshotPath.review(snapshot.id)
    );

  const compile = async (monthYear) => {
    const snapshot = await generate.mutateAsync(monthYear).catch(() => null);
    if (snapshot) navigate(participantSnapshotPath.review(snapshot.id));
  };

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Monthly Snapshot</h1>
          <p className="text-base text-slate-600 mt-2 max-w-2xl">
            Your month, summarised from your own daily logs — you approve what&rsquo;s in
            it. Once you approve a snapshot it is locked, and anything you add after that
            is kept alongside it as a note.
          </p>
        </div>
        <button
          onClick={() => navigate(PARTICIPANT_PATHS.snapshotExports)}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-6 py-3 hover:bg-slate-50 transition-colors shrink-0"
        >
          <Download size={16} />
          Exports
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 text-slate-500 bg-white/80 rounded-xl p-6">
          <LoaderCircle size={18} className="animate-spin" />
          Loading your snapshots…
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn&rsquo;t load your snapshots.</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {generate.error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <p className="text-sm">{generate.error.message}</p>
        </div>
      )}

      {months.data?.length === 0 && !isLoading && (
        <div className="bg-white/80 rounded-xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-brand-600 flex items-center justify-center mx-auto">
            <CalendarDays size={26} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mt-6">
            No snapshots to compile yet
          </h2>
          <p className="text-base text-slate-600 mt-2 max-w-md mx-auto">
            A snapshot is built from your submitted daily logs. Once you have submitted a
            log, the month it belongs to will appear here.
          </p>
          <button
            onClick={() => navigate(PARTICIPANT_PATHS.dailyLog)}
            className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 mt-6 shadow-md hover:bg-brand-700 transition-colors"
          >
            Go to my daily logs
          </button>
        </div>
      )}

      {months.data?.length > 0 && (
        <div className="flex flex-col gap-4">
          {months.data.map((month) => {
            const snapshot = byMonth.get(month.monthYear);
            const compiling = generate.isPending && generate.variables === month.monthYear;

            return (
              <div
                key={month.monthYear}
                className="bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {monthLabel(month.monthYear)}
                      </h2>
                      <StatusChip status={month.status} />
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {month.logsCount} {month.logsCount === 1 ? 'log' : 'logs'} submitted
                      {snapshot?.lockedAt && ` · approved ${formatShortDate(snapshot.lockedAt)}`}
                      {snapshot?.addendaCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 ml-2">
                          <MessageSquarePlus size={12} />
                          {snapshot.addendaCount}{' '}
                          {snapshot.addendaCount === 1 ? 'note' : 'notes'}
                        </span>
                      )}
                    </p>
                  </div>

                  {snapshot ? (
                    <button
                      onClick={() => open(snapshot)}
                      className="flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-2.5 shadow-md hover:bg-brand-700 transition-colors shrink-0"
                    >
                      {snapshot.status === SNAPSHOT_STATUS.LOCKED ? 'View snapshot' : 'Continue review'}
                      <ChevronRight size={15} />
                    </button>
                  ) : (
                    <button
                      onClick={() => compile(month.monthYear)}
                      disabled={compiling}
                      className="flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-2.5 shadow-md hover:bg-brand-700 disabled:opacity-50 transition-colors shrink-0"
                    >
                      {compiling ? (
                        <LoaderCircle size={15} className="animate-spin" />
                      ) : (
                        <Sparkles size={15} />
                      )}
                      {compiling ? 'Compiling…' : 'Compile snapshot'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
