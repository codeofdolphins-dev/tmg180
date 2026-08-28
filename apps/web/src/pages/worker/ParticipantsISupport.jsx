import {
  ShieldCheck,
  EyeOff,
  UserPlus,
  BadgeCheck,
  ShieldOff,
  Check,
  NotebookPen,
  CirclePlus,
  ChevronRight,
  LoaderCircle,
  TriangleAlert,
  PenLine,
  Lock,
  UserRound,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DAILY_LOG_STATUS } from '@tmg180/shared';
import { formatRelativeDay } from '../../lib/dates';
import { useWorkerDailyLogs, useWorkerParticipants } from '../../hooks/worker/dailyLog';
import { WORKER_PATHS, workerDailyLogPath } from '../../routes/paths';

/**
 * Participants I support — Figma 1169:2956, on the UI scale.
 *
 * The list *is* the consent: `/worker/participants` returns the people who
 * currently hold an active grant for this worker and nobody else, so a
 * withdrawn grant drops the person on the next load. Nothing participant-owned
 * is shown here — name, the grant itself, and what the worker's own logs say
 * about when they last supported the person.
 *
 * "Consent limited" means the grant does not let this worker add daily logs —
 * the one thing a worker does here — so the card says what they can do
 * instead. The frame's "ID: TMG-821" chip is not rendered: no such identifier
 * exists, and the Gaps Analysis asks worker-facing views not to label people
 * with numbers.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';
const RECENTLY_GRANTED_DAYS = 30;

/** Worker-facing names for the four grant flags. */
const PERMISSION_LABELS = [
  { key: 'canAddDailyNote', label: 'Daily logs' },
  { key: 'canViewSnapshot', label: 'Approved snapshots' },
  { key: 'canViewProfile', label: 'Personal Profile' },
  { key: 'canViewCheckins', label: 'Check-ins' },
];

const grantedLabels = (permissions = {}) =>
  PERMISSION_LABELS.filter((item) => permissions[item.key]).map((item) => item.label);

const isLimited = (person) => !person.consent.permissions.canAddDailyNote;

const recentlyGranted = (person) => {
  if (!person.consent.grantedAt) return false;
  const age = (Date.now() - new Date(person.consent.grantedAt).getTime()) / 86_400_000;
  return age <= RECENTLY_GRANTED_DAYS;
};

const initialsOf = (name) =>
  (name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

function StatTile({ icon: Icon, tone, label, value }) {
  return (
    <div className={`${CARD} flex items-center gap-4`}>
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}

function ParticipantCard({ person, onNewLog, onViewLogs }) {
  const limited = isLimited(person);
  const labels = grantedLabels(person.consent.permissions);
  const last = person.lastSupport;
  return (
    <div className={CARD}>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-[#e5eeff] text-[#0b1c30] text-lg font-bold flex items-center justify-center shrink-0">
          {initialsOf(person.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-semibold text-slate-900">{person.name}</h3>
            {limited ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                <ShieldOff size={11} />
                Consent limited
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-brand-100 text-brand-700">
                <BadgeCheck size={11} />
                Consent active
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {last ? (
              <>
                Last support: {formatRelativeDay(last.sessionDate)}
                {last.status === DAILY_LOG_STATUS.DRAFT ? ' (draft)' : ''}
                {person.logCount > 1 ? ` · ${person.logCount} logs` : ''}
              </>
            ) : (
              'No support logged yet'
            )}
          </p>
          <p className="text-sm text-slate-700 mt-3">
            <span className="font-semibold">Permission:</span>{' '}
            {labels.length > 0 ? labels.join(', ') : 'No areas shared yet'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-5">
        {person.consent.permissions.canAddDailyNote ? (
          <button
            onClick={() => onNewLog(person)}
            className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-semibold rounded-full px-5 py-2.5 shadow-md hover:bg-brand-700 transition-colors"
          >
            <CirclePlus size={15} />
            New evidence log
          </button>
        ) : (
          <span className="text-xs text-slate-500">
            This grant doesn&rsquo;t include adding daily logs.
          </span>
        )}
        {person.logCount > 0 && (
          <button
            onClick={() => onViewLogs(person)}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-5 py-2.5 hover:bg-slate-50 transition-colors"
          >
            View logs
            <ChevronRight size={14} />
          </button>
        )}
        {person.consent.permissions.canViewProfile && (
          <span
            title="The participant profile view for workers isn't switched on yet."
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 cursor-not-allowed"
          >
            View Profile
            <span className="text-[10px]">· not yet available</span>
          </span>
        )}
      </div>
    </div>
  );
}

function RecentLogRow({ log, onOpen }) {
  const draft = log.status !== DAILY_LOG_STATUS.SUBMITTED;
  const firstName = log.participant.name.split(' ')[0];
  return (
    <button
      onClick={onOpen}
      className="w-full text-left flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50 transition-colors"
    >
      <span
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          draft ? 'bg-brand-50 text-brand-600' : 'bg-emerald-50 text-emerald-600'
        }`}
      >
        {draft ? <PenLine size={16} /> : <Lock size={16} />}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-900 truncate">
          {draft ? 'Draft' : 'Submitted'} log for {firstName}
        </span>
        <span className="block text-xs text-slate-500">
          {formatRelativeDay(log.sessionDate)} · Daily log
        </span>
      </span>
    </button>
  );
}

export default function ParticipantsISupport() {
  const navigate = useNavigate();
  const { data: people, isLoading, error } = useWorkerParticipants();
  const recent = useWorkerDailyLogs({ limit: 3 });

  const stats = {
    active: people?.length ?? 0,
    limited: (people ?? []).filter(isLimited).length,
    recent: (people ?? []).filter(recentlyGranted).length,
  };

  const openLog = (log) =>
    navigate(
      log.status === DAILY_LOG_STATUS.SUBMITTED
        ? workerDailyLogPath.detail(log.id)
        : workerDailyLogPath.edit(log.id)
    );

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Participants I support</h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl">
          Participant-owned portal records and your own evidence logs (within your permissions).
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">
        {/* ---------- main column ---------- */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatTile icon={ShieldCheck} tone="bg-brand-50 text-brand-600" label="Total active consents" value={isLoading ? '…' : stats.active} />
            <StatTile icon={EyeOff} tone="bg-[#dce9ff] text-[#2170e4]" label="Limited access" value={isLoading ? '…' : stats.limited} />
            <StatTile icon={UserPlus} tone="bg-emerald-50 text-emerald-700" label="Recently granted" value={isLoading ? '…' : stats.recent} />
          </div>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Active Participants</h2>

            {isLoading && (
              <div className={`flex items-center gap-3 text-slate-500 ${CARD}`}>
                <LoaderCircle size={18} className="animate-spin" />
                Checking who has given you consent…
              </div>
            )}
            {error && (
              <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
                <TriangleAlert size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">We couldn&rsquo;t load your participants.</p>
                  <p className="text-sm mt-1">{error.message}</p>
                </div>
              </div>
            )}
            {people?.length === 0 && (
              <div className={`${CARD} text-center py-12`}>
                <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                  <UserRound size={26} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mt-6">No participant has given you consent yet</h3>
                <p className="text-base text-slate-600 mt-2 max-w-md mx-auto">
                  Access is controlled by participant consent. When a participant grants you
                  access to their records, they will appear here — you don&rsquo;t add them yourself.
                </p>
                <p className="text-xs text-slate-400 mt-4">
                  TMG180 respects participant control over their information.
                </p>
              </div>
            )}
            {people?.length > 0 && (
              <div className="flex flex-col gap-4">
                {people.map((person) => (
                  <ParticipantCard
                    key={person.id}
                    person={person}
                    onNewLog={(p) => navigate(workerDailyLogPath.new(p.id))}
                    onViewLogs={(p) => navigate(`${WORKER_PATHS.dailyLogs}?participant=${p.id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ---------- rail ---------- */}
        <div className="flex flex-col gap-6">
          <section className="bg-[#f3eefe] rounded-xl p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <ShieldCheck size={18} className="text-brand-600" />
              How permissions work
            </h2>
            <p className="text-sm text-slate-700 mt-3 leading-relaxed">
              Records are participant-owned. You only see information while{' '}
              <span className="text-brand-700 font-semibold">Consent active</span> status is maintained.
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <Check size={14} className="text-brand-600 shrink-0 mt-0.5" />
                Consent can be withdrawn at any time.
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-brand-600 shrink-0 mt-0.5" />
                Your evidence logs remain tied to the participant&rsquo;s core record.
              </li>
            </ul>
          </section>

          <section className={CARD}>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4">
              <NotebookPen size={18} className="text-brand-600" />
              Recent Evidence Logs
            </h2>
            {recent.isLoading && (
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <LoaderCircle size={14} className="animate-spin" /> Loading…
              </p>
            )}
            {recent.data?.length === 0 && (
              <p className="text-sm text-slate-500">No evidence logs yet.</p>
            )}
            {recent.data?.length > 0 && (
              <div className="flex flex-col gap-1 -mx-2">
                {recent.data.map((log) => (
                  <RecentLogRow key={log.id} log={log} onOpen={() => openLog(log)} />
                ))}
              </div>
            )}
            <button
              onClick={() => navigate(WORKER_PATHS.dailyLogNew)}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-800 text-sm font-semibold rounded-full py-2.5 hover:bg-slate-50 transition-colors"
            >
              <CirclePlus size={15} />
              New evidence log
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
