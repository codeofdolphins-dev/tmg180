import {
  Sun,
  BadgeCheck,
  ShieldOff,
  MapPin,
  ArrowRight,
  FileText,
  ChevronRight,
  UserRound,
  PenLine,
  Lock,
  MessageSquarePlus,
  CalendarCheck2,
  ShieldCheck,
  Bookmark,
  BookOpen,
  MessagesSquare,
  NotebookPen,
  CirclePlus,
  LoaderCircle,
  TriangleAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  CREDENTIAL_DUE_SOON_DAYS,
  CREDENTIAL_STATUS,
  DAILY_LOG_STATUS,
  credentialStatusLabel,
} from '@tmg180/shared';
import { formatLogDate, formatRelativeDay, formatTimeRange, todayValue } from '../../lib/dates';
import { useWorkerDailyLogs } from '../../hooks/worker/dailyLog';
import { useWorkerCredentials } from '../../hooks/worker/credentials';
import { WORKER_PATHS, workerDailyLogPath } from '../../routes/paths';

/**
 * Worker Workspace Dashboard — Figma 1169:2660, on the UI scale.
 *
 * Everything on it is either real or visibly switched off:
 *  - Today's Support Sessions and Recent Daily Logs read the worker's own
 *    logs (`/worker/daily-logs`). A "session" is a log dated today — there is
 *    no booking or roster concept anywhere in TMG180, so the worker's own
 *    record of support is the only honest source (see the brief, §7 decision 5).
 *  - Governance Summary reads `/worker/credentials`; standing is derived from
 *    the expiry dates, never typed in.
 *  - Upcoming Check-ins (self-guided worker reflections) and Peer Network have
 *    no spec and no data behind them, so they render inactive and say so.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';
const RECENT_LIMIT = 3;

function Loading({ children }) {
  return (
    <div className={`flex items-center gap-3 text-slate-500 ${CARD}`}>
      <LoaderCircle size={18} className="animate-spin" />
      {children}
    </div>
  );
}

function LoadError({ title, error }) {
  return (
    <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
      <TriangleAlert size={18} className="shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    </div>
  );
}

function ConsentChip({ active }) {
  return active ? (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 shrink-0">
      <BadgeCheck size={12} />
      Active consent
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-500 shrink-0">
      <ShieldOff size={12} />
      No active consent
    </span>
  );
}

function LogStatusChip({ log }) {
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

/** A support session is a log dated today; the card leads with the person. */
function SessionCard({ log, onOpen }) {
  const times = formatTimeRange(log.startTime, log.endTime);
  const where = log.serviceType || log.location;
  const initial = (log.participant.name || '?').trim()[0]?.toUpperCase();
  return (
    <div className={`flex flex-col ${CARD}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-brand-600 text-white text-lg font-bold flex items-center justify-center shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-slate-900">{log.participant.name}</h3>
            <p className="text-sm text-slate-500">{times || 'Time not recorded'}</p>
          </div>
        </div>
        <ConsentChip active={log.consentActive} />
      </div>
      {where && (
        <p className="flex items-center gap-2 text-sm text-slate-600 mt-4">
          <MapPin size={14} className="text-slate-400" />
          {where}
        </p>
      )}
      <button
        onClick={onOpen}
        className={`mt-5 w-full flex items-center justify-center gap-2 text-sm font-semibold rounded-full py-3 transition-colors ${
          log.status === DAILY_LOG_STATUS.SUBMITTED
            ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            : 'bg-brand-600 text-white shadow-md hover:bg-brand-700'
        }`}
      >
        Open support tools
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

function RecentLogRow({ log, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="w-full text-left flex items-center justify-between gap-4 bg-white border border-slate-100 rounded-xl px-4 py-3.5 hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
          <UserRound size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{log.participant.name}</p>
          <p className="text-xs text-slate-500">
            {formatRelativeDay(log.sessionDate)}
            {log.startTime ? `, ${formatTimeRange(log.startTime, null)}` : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <LogStatusChip log={log} />
        <ChevronRight size={16} className="text-slate-400" />
      </div>
    </button>
  );
}

const BAR_TONE = {
  [CREDENTIAL_STATUS.UP_TO_DATE]: { bar: 'bg-emerald-500', text: 'text-emerald-700', icon: BadgeCheck },
  [CREDENTIAL_STATUS.DUE_SOON]: { bar: 'bg-brand-600', text: 'text-brand-700', icon: CalendarCheck2 },
  [CREDENTIAL_STATUS.EXPIRED]: { bar: 'bg-rose-500', text: 'text-rose-700', icon: TriangleAlert },
  [CREDENTIAL_STATUS.NEEDS_REVIEW]: { bar: 'bg-slate-300', text: 'text-slate-500', icon: ShieldOff },
};

/** The bar is how much runway is left, not a score. */
function barWidth(credential) {
  switch (credential.status) {
    case CREDENTIAL_STATUS.UP_TO_DATE:
      return 100;
    case CREDENTIAL_STATUS.DUE_SOON:
      return Math.max(10, Math.round((credential.daysLeft / CREDENTIAL_DUE_SOON_DAYS) * 100));
    case CREDENTIAL_STATUS.EXPIRED:
      return 100;
    default:
      return 8;
  }
}

function credentialNote(credential) {
  if (credential.status === CREDENTIAL_STATUS.DUE_SOON) {
    return credential.daysLeft === 0
      ? 'Expires today'
      : `Expires in ${credential.daysLeft} ${credential.daysLeft === 1 ? 'day' : 'days'}`;
  }
  if (credential.status === CREDENTIAL_STATUS.EXPIRED) {
    const ago = Math.abs(credential.daysLeft);
    return `Expired ${ago} ${ago === 1 ? 'day' : 'days'} ago`;
  }
  if (credential.status === CREDENTIAL_STATUS.NEEDS_REVIEW) return 'Not recorded yet';
  return null;
}

function CredentialRow({ credential }) {
  const tone = BAR_TONE[credential.status] ?? BAR_TONE[CREDENTIAL_STATUS.NEEDS_REVIEW];
  const Icon = tone.icon;
  const note = credentialNote(credential);
  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-sm font-medium text-slate-900">{credential.label}</p>
        <span className={`flex items-center gap-1 text-sm font-medium shrink-0 ${tone.text}`}>
          <Icon size={13} />
          {credentialStatusLabel(credential.status)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-2 rounded-full ${tone.bar}`} style={{ width: `${barWidth(credential)}%` }} />
      </div>
      {note && <p className="text-xs text-slate-500 text-right mt-1">{note}</p>}
    </div>
  );
}

const QUICK_RESOURCES = [
  { label: 'Support Templates', icon: FileText, tone: 'text-brand-600', path: WORKER_PATHS.resources },
  { label: 'Practice Guides', icon: BookOpen, tone: 'text-[#2170e4]', path: WORKER_PATHS.learningHub },
  { label: 'Governance Basics', icon: ShieldCheck, tone: 'text-[#007a53]', path: WORKER_PATHS.governance },
  // No peer-network feature exists anywhere in canon or the build — the tile
  // stays where the frame puts it, switched off.
  { label: 'Peer Network', icon: MessagesSquare, tone: 'text-[#5b6cf0]', path: null },
];

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const today = todayValue();

  const todays = useWorkerDailyLogs({ from: today, to: today });
  const recent = useWorkerDailyLogs({ limit: RECENT_LIMIT });
  const credentials = useWorkerCredentials();

  const openLog = (log) =>
    navigate(
      log.status === DAILY_LOG_STATUS.SUBMITTED
        ? workerDailyLogPath.detail(log.id)
        : workerDailyLogPath.edit(log.id)
    );

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Your self-employed worker workspace</h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl">
          Tools, templates, and governance structure — while you keep independence and autonomy.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">
        {/* ---------- main column ---------- */}
        <div className="flex flex-col gap-6">
          <section>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                <Sun size={20} className="text-brand-600" />
                Today&rsquo;s Support Sessions
              </h2>
              <span className="text-sm text-slate-500">{formatLogDate(today)}</span>
            </div>

            {todays.isLoading && <Loading>Loading today&rsquo;s sessions…</Loading>}
            {todays.error && (
              <LoadError title="We couldn’t load today’s sessions." error={todays.error} />
            )}
            {todays.data?.length === 0 && (
              <div className={`${CARD} text-center py-10`}>
                <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                  <NotebookPen size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-4">No support sessions logged today</h3>
                <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                  A session appears here once you start a Daily Support Evidence Log for it.
                  Add one after support — there is no rush.
                </p>
                <button
                  onClick={() => navigate(WORKER_PATHS.dailyLogNew)}
                  className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 mt-5 shadow-md hover:bg-brand-700 transition-colors"
                >
                  <CirclePlus size={16} />
                  New Support Entry
                </button>
              </div>
            )}
            {todays.data?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {todays.data.map((log) => (
                  <SessionCard key={log.id} log={log} onOpen={() => openLog(log)} />
                ))}
              </div>
            )}
          </section>

          <section className={CARD}>
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                <FileText size={19} className="text-[#2170e4]" />
                Recent Daily Logs
              </h2>
              <button
                onClick={() => navigate(WORKER_PATHS.dailyLogs)}
                className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                View all
                <ChevronRight size={14} />
              </button>
            </div>

            {recent.isLoading && (
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <LoaderCircle size={16} className="animate-spin" />
                Loading your logs…
              </p>
            )}
            {recent.error && <LoadError title="We couldn’t load your logs." error={recent.error} />}
            {recent.data?.length === 0 && (
              <p className="text-sm text-slate-600">
                No daily logs yet. Your most recent three will show here once you have written some.
              </p>
            )}
            {recent.data?.length > 0 && (
              <div className="flex flex-col gap-3">
                {recent.data.map((log) => (
                  <RecentLogRow key={log.id} log={log} onOpen={() => openLog(log)} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ---------- rail ---------- */}
        <div className="flex flex-col gap-6">
          <section className={CARD} aria-disabled="true">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <CalendarCheck2 size={18} className="text-[#007a53]" />
              Upcoming Check-ins
            </h2>
            <p className="text-sm text-slate-500 mt-3">
              Self-guided check-ins aren&rsquo;t switched on yet. Nothing shows here until they are.
            </p>
          </section>

          <section className={`${CARD} border-t-4 border-brand-600`}>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <ShieldCheck size={17} className="text-brand-600" />
              Governance Summary
            </h2>
            <p className="text-sm text-slate-600 mt-1 mb-5">Your independent credentials and standing.</p>

            {credentials.isLoading && (
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <LoaderCircle size={16} className="animate-spin" />
                Checking your credentials…
              </p>
            )}
            {credentials.error && (
              <LoadError title="We couldn’t load your credentials." error={credentials.error} />
            )}
            {credentials.data && (
              <>
                <div className="flex flex-col gap-5">
                  {credentials.data.credentials.map((credential) => (
                    <CredentialRow key={credential.type} credential={credential} />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  {credentials.data.summary.allInOrder
                    ? 'Everything you have recorded is up to date.'
                    : `${credentials.data.summary.upToDate} of ${credentials.data.summary.total} up to date.`}
                </p>
              </>
            )}

            <button
              onClick={() => navigate(WORKER_PATHS.governance)}
              className="w-full bg-brand-50 text-brand-700 text-sm font-semibold rounded-full py-2.5 mt-5 hover:bg-brand-100 transition-colors"
            >
              Update documents
            </button>
          </section>

          <section className={CARD}>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4">
              <Bookmark size={16} className="text-[#2170e4]" />
              Quick Resources
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_RESOURCES.map((resource) => {
                const Icon = resource.icon;
                const enabled = Boolean(resource.path);
                return (
                  <button
                    key={resource.label}
                    onClick={enabled ? () => navigate(resource.path) : undefined}
                    disabled={!enabled}
                    title={enabled ? undefined : 'Not switched on yet'}
                    className={`rounded-xl py-5 px-3 flex flex-col items-center gap-2 transition-colors ${
                      enabled
                        ? 'bg-slate-50 hover:bg-brand-50'
                        : 'bg-slate-50/60 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <Icon size={22} className={resource.tone} />
                    <span className="text-xs font-semibold text-slate-900 text-center leading-snug">
                      {resource.label}
                    </span>
                    {!enabled && <span className="text-[10px] text-slate-500">Not yet available</span>}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
