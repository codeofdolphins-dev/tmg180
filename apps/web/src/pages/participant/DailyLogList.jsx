import {
  CirclePlus,
  NotebookPen,
  Lock,
  PenLine,
  MessageSquarePlus,
  LoaderCircle,
  TriangleAlert,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DAILY_LOG_STATUS, domainLabel } from '@tmg180/shared';
import { formatLogDate, formatTimeRange } from '../../lib/dates';
import { useDailyLogs } from '../../hooks/participant/dailyLog';
import { PARTICIPANT_PATHS, participantDailyLogPath } from '../../routes/paths';

/**
 * The participant's daily logs, newest first.
 *
 * No Figma frame exists for this screen — the design has the log form and a
 * worker empty state only, so a log history was unreachable. Built in the
 * participant portal idiom (the profile hub's card system) and flagged to Saf;
 * if a frame lands later, only this file changes.
 */

function StatusChip({ status }) {
  const submitted = status === DAILY_LOG_STATUS.SUBMITTED;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
        submitted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      {submitted ? <Lock size={11} /> : <PenLine size={11} />}
      {submitted ? 'Submitted' : 'Draft'}
    </span>
  );
}

function LogRow({ log, onOpen }) {
  const submitted = log.status === DAILY_LOG_STATUS.SUBMITTED;
  const times = formatTimeRange(log.startTime, log.endTime);

  return (
    <button
      onClick={onOpen}
      className="w-full text-left bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-semibold text-slate-900">
              {formatLogDate(log.sessionDate)}
            </h2>
            <StatusChip status={log.status} />
          </div>
          {times && <p className="text-sm text-slate-500 mt-1">{times}</p>}
        </div>
        <ChevronRight size={18} className="text-slate-400 shrink-0 mt-1" />
      </div>

      {log.domainTags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {log.domainTags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium text-brand-700 bg-brand-50 px-3 py-1 rounded-full"
            >
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
        {!submitted && <span className="text-amber-700">Not submitted yet</span>}
      </div>
    </button>
  );
}

export default function DailyLogList() {
  const navigate = useNavigate();
  const { data: logs, isLoading, error } = useDailyLogs();

  const open = (log) =>
    navigate(
      log.status === DAILY_LOG_STATUS.SUBMITTED
        ? participantDailyLogPath.detail(log.id)
        : participantDailyLogPath.edit(log.id)
    );

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Daily Log</h1>
          <p className="text-base text-slate-600 mt-2 max-w-2xl">
            Today&rsquo;s story, in your words. Each log records what happened during
            support and links it back to your goals. Take your time — there is no right
            or wrong way to write this.
          </p>
        </div>
        <button
          onClick={() => navigate(PARTICIPANT_PATHS.dailyLogNew)}
          className="flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 shadow-md hover:bg-brand-700 transition-colors shrink-0"
        >
          <CirclePlus size={16} />
          New log
        </button>
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
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <NotebookPen size={26} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mt-6">No daily logs yet</h2>
          <p className="text-base text-slate-600 mt-2 max-w-md mx-auto">
            When you&rsquo;re ready, you can create a Daily Support Evidence Log after
            support. Take your time, there is no rush.
          </p>
          <button
            onClick={() => navigate(PARTICIPANT_PATHS.dailyLogNew)}
            className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 mt-6 shadow-md hover:bg-brand-700 transition-colors"
          >
            <CirclePlus size={16} />
            Start a log
          </button>
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
