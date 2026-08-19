import { useState } from 'react';
import {
  CirclePlus,
  NotebookPen,
  Lock,
  PenLine,
  MessageSquarePlus,
  LoaderCircle,
  TriangleAlert,
  ChevronRight,
  BadgeCheck,
  ShieldOff,
  X,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DAILY_LOG_STATUS, domainLabel } from '@tmg180/shared';
import { formatLogDate, formatTimeRange } from '../../lib/dates';
import { useWorkerDailyLogs, useWorkerParticipants } from '../../hooks/worker/dailyLog';
import { WORKER_PATHS, workerDailyLogPath } from '../../routes/paths';

/**
 * The worker's Daily Support Evidence Logs, newest first — the worker layer's
 * history. The design has a form and an empty state for this screen
 * (1205:943) but no populated list, so the rows follow the participant log
 * history's idiom; the empty state is the frame's. A draft opens in the form,
 * a submitted log opens read-only. `?participant=<id>` narrows the history to
 * one person (Participants I support links here).
 */

const FILTERS = [
  { key: '', label: 'All' },
  { key: DAILY_LOG_STATUS.DRAFT, label: 'Drafts' },
  { key: DAILY_LOG_STATUS.SUBMITTED, label: 'Submitted' },
];

function StatusChip({ log }) {
  if (log.status !== DAILY_LOG_STATUS.SUBMITTED) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700">
        <PenLine size={11} />
        Draft
      </span>
    );
  }
  if (log.addendaCount > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
        <MessageSquarePlus size={11} />
        Addendum added
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
      <Lock size={11} />
      Submitted
    </span>
  );
}

function LogRow({ log, onOpen }) {
  const times = formatTimeRange(log.startTime, log.endTime);
  const where = log.serviceType || log.location;
  return (
    <button
      onClick={onOpen}
      className="w-full text-left bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-semibold text-slate-900">{log.participant.name}</h2>
            <StatusChip log={log} />
            {log.consentActive ? (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                <BadgeCheck size={12} /> Active consent
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <ShieldOff size={12} /> No active consent
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {formatLogDate(log.sessionDate)}
            {times ? ` · ${times}` : ''}
            {where ? ` · ${where}` : ''}
          </p>
        </div>
        <ChevronRight size={18} className="text-slate-400 shrink-0 mt-1" />
      </div>

      {log.domainTags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {log.domainTags.map((tag) => (
            <span key={tag} className="text-xs font-medium text-brand-700 bg-purple-50 px-3 py-1 rounded-full">
              {domainLabel(tag)}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
        <span>
          {log.goalIds?.length ?? 0} {log.goalIds?.length === 1 ? 'goal' : 'goals'} linked
        </span>
        {log.addendaCount > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <MessageSquarePlus size={12} />
            {log.addendaCount} {log.addendaCount === 1 ? 'note' : 'notes'} added
          </span>
        )}
        {log.status !== DAILY_LOG_STATUS.SUBMITTED && (
          <span className="text-amber-700">Not submitted yet</span>
        )}
      </div>
    </button>
  );
}

export default function WorkerDailyLogList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState('');
  const participantId = Number(searchParams.get('participant')) || undefined;
  const { data: logs, isLoading, error } = useWorkerDailyLogs({
    ...(status ? { status } : {}),
    ...(participantId ? { participantId } : {}),
  });
  const { data: people } = useWorkerParticipants();
  // The filter chip names the person when the grant is still active; a log
  // about someone who has since withdrawn still shows, but only by id.
  const filteredPerson = participantId
    ? (people ?? []).find((person) => person.id === participantId) ??
      logs?.find((log) => log.participant.id === participantId)?.participant
    : null;

  const open = (log) =>
    navigate(
      log.status === DAILY_LOG_STATUS.SUBMITTED
        ? workerDailyLogPath.detail(log.id)
        : workerDailyLogPath.edit(log.id)
    );

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Daily Logs</h1>
          <p className="text-base text-slate-600 mt-2 max-w-2xl">
            Your Daily Support Evidence Logs — one per support session, linked to the
            participant&rsquo;s goals. Submitted logs are locked and addendum-only.
          </p>
        </div>
        <button
          onClick={() => navigate(WORKER_PATHS.dailyLogNew)}
          className="flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 shadow-md hover:bg-brand-700 transition-colors shrink-0"
        >
          <CirclePlus size={16} />
          New Support Entry
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setStatus(filter.key)}
            aria-pressed={status === filter.key}
            className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
              status === filter.key
                ? 'bg-brand-600 text-white'
                : 'bg-white/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {filter.label}
          </button>
        ))}
        {participantId && (
          <button
            onClick={() => setSearchParams({})}
            className="inline-flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full bg-purple-100 text-brand-700 hover:bg-purple-200 transition-colors ml-auto"
            title="Show logs for everyone"
          >
            {filteredPerson?.name ?? 'One participant'}
            <X size={13} />
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 text-slate-500 bg-white/80 rounded-xl p-6">
          <LoaderCircle size={18} className="animate-spin" />
          Loading your logs…
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn&rsquo;t load your logs.</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {logs?.length === 0 && (
        <div className="bg-white/80 rounded-xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-brand-600 flex items-center justify-center mx-auto">
            <NotebookPen size={26} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mt-6">
            {participantId
              ? `No ${status ? (status === DAILY_LOG_STATUS.DRAFT ? 'draft ' : 'submitted ') : ''}logs for ${filteredPerson?.name ?? 'this participant'} yet`
              : status
                ? `No ${status === DAILY_LOG_STATUS.DRAFT ? 'draft' : 'submitted'} logs`
                : 'No daily logs yet'}
          </h2>
          <p className="text-base text-slate-600 mt-2 max-w-md mx-auto">
            When you&rsquo;re ready, you can create a Daily Support Evidence Log after
            support. Take your time, there is no rush.
          </p>
          {!status && (
            <button
              onClick={() => navigate(workerDailyLogPath.new(participantId))}
              className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 mt-6 shadow-md hover:bg-brand-700 transition-colors"
            >
              <CirclePlus size={16} />
              New Support Entry
            </button>
          )}
        </div>
      )}

      {logs?.length > 0 && (
        <div className="flex flex-col gap-4">
          {logs.map((log) => (
            <LogRow key={log.id} log={log} onOpen={() => open(log)} />
          ))}
        </div>
      )}
    </div>
  );
}
