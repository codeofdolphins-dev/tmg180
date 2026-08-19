import { useMemo, useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  LoaderCircle,
  TriangleAlert,
  NotebookPen,
  X,
  MessageSquarePlus,
  CalendarRange,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SNAPSHOT_ACCESS } from '@tmg180/shared';
import Select from '../../components/ui/Select';
import { formatRelativeTime, formatShortDate } from '../../lib/dates';
import { useWorkerSnapshots } from '../../hooks/worker/snapshot';
import { WORKER_PATHS, workerSnapshotPath } from '../../routes/paths';

/**
 * Approved Monthly Snapshots (Figma 1169:3455), on the UI scale.
 *
 * Every locked snapshot belonging to a participant who currently lets this
 * worker see one. Nothing on this screen writes: a worker reads an approved
 * month, they never add to it — that record is the participant's, and a worker
 * with something to say writes their own daily log.
 *
 * The frame's third filter is Status ("Approved & Locked"). It has one value by
 * definition — a draft is the participant's review and never reaches this
 * surface — so it renders as a fixed statement rather than a control that
 * cannot change anything.
 *
 * The two empty-state frames (1205:1457 "No snapshot yet", 1205:1210 "No export
 * available yet") are folded in below as this screen's own empty state, which
 * is why they are no longer routes of their own.
 */

/** Stable per person, so the same participant keeps the same colour between visits. */
const AVATAR_TONES = [
  'bg-purple-100 text-brand-700',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
];

const toneFor = (id) => AVATAR_TONES[Math.abs(Number(id) || 0) % AVATAR_TONES.length];

const initialsOf = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || '?';

function AccessChip({ snapshot }) {
  const full = snapshot.access === SNAPSHOT_ACCESS.FULL;
  return (
    <span
      title={
        full
          ? 'This grant also covers their Personal Profile, so you can read what they wrote.'
          : 'This grant covers approved snapshots only — the month’s shape, not their written words.'
      }
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
        full ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
      }`}
    >
      {snapshot.accessLabel}
    </span>
  );
}

function SnapshotCard({ snapshot, onOpen }) {
  return (
    <div className="bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 ${toneFor(
              snapshot.participant.id
            )}`}
          >
            {initialsOf(snapshot.participant.name)}
          </div>
          <div className="min-w-0">
            {/* Wraps rather than truncates — a person's name is not metadata
                to be clipped (Gaps §5 asks worker views to use names, not ids). */}
            <h2 className="text-lg font-semibold text-slate-900 leading-tight">
              {snapshot.participant.name}
            </h2>
            <p className="text-sm text-slate-500 mt-1">{snapshot.monthLabel}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 shrink-0">
          <Lock size={11} />
          Locked
        </span>
      </div>

      <dl className="mt-5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <dt className="text-sm text-slate-500">Consent level</dt>
          <dd>
            <AccessChip snapshot={snapshot} />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <dt className="text-sm text-slate-500">Last viewed</dt>
          <dd className="text-sm text-slate-900">
            {snapshot.lastViewedAt ? formatRelativeTime(snapshot.lastViewedAt) : 'Never'}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-sm text-slate-500">Approved</dt>
          <dd className="text-sm text-slate-900">{formatShortDate(snapshot.lockedAt)}</dd>
        </div>
      </dl>

      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-4">
        <span>
          Compiled from {snapshot.logsCount}{' '}
          {snapshot.logsCount === 1 ? 'daily log' : 'daily logs'}
        </span>
        {snapshot.addendaCount > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <MessageSquarePlus size={12} />
            {snapshot.addendaCount} {snapshot.addendaCount === 1 ? 'note' : 'notes'} added
          </span>
        )}
      </p>

      <button
        onClick={onOpen}
        className="mt-5 w-full flex items-center justify-center gap-2 bg-purple-50 text-brand-700 text-sm font-medium rounded-full py-3 hover:bg-purple-100 transition-colors"
      >
        <Eye size={16} />
        View snapshot
      </button>
    </div>
  );
}

export default function ApprovedSnapshots() {
  const navigate = useNavigate();
  const [participantId, setParticipantId] = useState('');
  const [month, setMonth] = useState('');

  // Unfiltered, so the filters always offer everything this worker can reach —
  // narrowing to one person must not empty the month list. React Query serves
  // both from one request while no filter is set.
  const all = useWorkerSnapshots();
  const filtered = useWorkerSnapshots({
    ...(participantId ? { participantId } : {}),
    ...(month ? { month } : {}),
  });

  const isLoading = all.isLoading || filtered.isLoading;
  const error = all.error ?? filtered.error;
  const snapshots = filtered.data ?? [];
  const hasFilter = Boolean(participantId || month);

  const { people, months } = useMemo(() => {
    const rows = all.data ?? [];
    const byPerson = new Map();
    const byMonth = new Map();
    for (const row of rows) {
      byPerson.set(String(row.participant.id), row.participant.name);
      byMonth.set(row.monthYear, row.monthLabel);
    }
    return {
      people: [...byPerson]
        .map(([value, label]) => ({ value, label }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      months: [...byMonth]
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([value, label]) => ({ value, label })),
    };
  }, [all.data]);

  const clearFilters = () => {
    setParticipantId('');
    setMonth('');
  };

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Approved Monthly Snapshots</h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl">
          View participant-approved snapshots within your permissions.
        </p>
      </div>

      <div className="flex items-start gap-4 bg-sky-50 rounded-xl p-6">
        <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
          <ShieldCheck size={19} />
        </div>
        <div>
          <p className="text-sm text-slate-700 leading-relaxed">
            Access is controlled by participant consent. You are viewing snapshots shared
            securely.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            A snapshot is read-only and belongs to the participant who approved it. Opening one
            is recorded, so they can always see who has read their month.
          </p>
        </div>
      </div>

      {(all.data?.length ?? 0) > 0 && (
        <div className="bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-wrap items-end gap-4">
          <div className="w-full sm:w-72">
            <label className="block text-sm text-slate-600 mb-2" htmlFor="filterParticipant">
              Participant
            </label>
            <Select
              look="box"
              inputId="filterParticipant"
              isClearable
              placeholder="All accessible participants"
              options={people}
              value={people.find((option) => option.value === participantId) ?? null}
              onChange={(option) => setParticipantId(option?.value ?? '')}
            />
          </div>

          <div className="w-full sm:w-56">
            <label className="block text-sm text-slate-600 mb-2" htmlFor="filterMonth">
              Month
            </label>
            <Select
              look="box"
              inputId="filterMonth"
              isClearable
              placeholder="All months"
              options={months}
              value={months.find((option) => option.value === month) ?? null}
              onChange={(option) => setMonth(option?.value ?? '')}
            />
          </div>

          <div className="w-full sm:w-56">
            <p className="text-sm text-slate-600 mb-2">Status</p>
            {/* min-h matches the Select control, so the three labels line up. */}
            <p className="flex items-center gap-2 min-h-12.5 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-4">
              <Lock size={13} className="shrink-0" />
              Approved &amp; locked only
            </p>
          </div>

          {hasFilter && (
            <button
              onClick={clearFilters}
              className="ml-auto inline-flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full bg-purple-100 text-brand-700 hover:bg-purple-200 transition-colors"
            >
              Clear filters
              <X size={13} />
            </button>
          )}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-3 text-slate-500 bg-white/80 rounded-xl p-6">
          <LoaderCircle size={18} className="animate-spin" />
          Loading approved snapshots…
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn&rsquo;t load these snapshots.</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && snapshots.length === 0 && (
        <div className="bg-white/80 rounded-xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-brand-600 flex items-center justify-center mx-auto">
            {hasFilter ? <CalendarRange size={26} /> : <NotebookPen size={26} />}
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mt-6">
            {hasFilter ? 'No snapshots match those filters' : 'No approved snapshots yet'}
          </h2>
          <p className="text-base text-slate-600 mt-2 max-w-md mx-auto">
            {hasFilter
              ? 'Try a different participant or month — only months a participant has approved and locked appear here.'
              : 'Approved and locked snapshots will appear here. A snapshot is compiled from a participant’s daily logs and only reaches you once they have approved it and their consent covers snapshots.'}
          </p>
          {hasFilter ? (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-6 py-3 mt-6 hover:bg-slate-50 transition-colors"
            >
              Clear filters
            </button>
          ) : (
            <button
              onClick={() => navigate(WORKER_PATHS.dailyLogs)}
              className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 mt-6 shadow-md hover:bg-brand-700 transition-colors"
            >
              <NotebookPen size={16} />
              View daily logs
            </button>
          )}
        </div>
      )}

      {snapshots.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {snapshots.map((snapshot) => (
            <SnapshotCard
              key={snapshot.id}
              snapshot={snapshot}
              onOpen={() => navigate(workerSnapshotPath.detail(snapshot.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
