import {
  ArrowLeft,
  Activity,
  PieChart,
  Lock,
  LoaderCircle,
  TriangleAlert,
  Key,
  Target,
  ScrollText,
  MessageSquarePlus,
  EyeOff,
  ShieldCheck,
  History,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  SNAPSHOT_ACCESS,
  SNAPSHOT_LAYERS,
  comparisonLabel,
  domainLabel,
} from '@tmg180/shared';
import { formatRelativeTime, formatShortDate, formatTimestamp } from '../../lib/dates';
import { isConsentLost, useWorkerSnapshot } from '../../hooks/worker/snapshot';
import { WORKER_PATHS } from '../../routes/paths';
import SupportsByBucket from '../../components/snapshot/SupportsByBucket';

/**
 * One approved Monthly Snapshot, worker side — the read half of Figma
 * 1169:3455's "View Snapshot".
 *
 * Read-only and unable to be otherwise: the API offers no write on this
 * surface. Everything on screen came from the participant's own month, and
 * how much of it there is depends on their grant — a snapshot-only grant shows
 * the month's shape, a grant that also covers their Personal Profile shows what
 * they wrote. Where something is withheld the screen says so rather than
 * quietly leaving a gap.
 *
 * The non-linear functioning statement renders at every access level. A month
 * of fluctuation read without it reads as regression, which is the whole point
 * of the sentence.
 */

function Panel({ icon: Icon, tone, title, children, aside }) {
  return (
    <section className="bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
            <Icon size={19} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value, unit, note }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">
        {value}
        {unit && <span className="text-sm font-semibold text-slate-500 ml-1">{unit}</span>}
      </p>
      {note && <p className="text-xs text-slate-500 mt-1">{note}</p>}
    </div>
  );
}

/** What a "Summary only" grant does not reach, said plainly rather than left blank. */
function Withheld({ children }) {
  return (
    <div className="bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
        <EyeOff size={19} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Not shared with you</h2>
        <p className="text-sm text-slate-600 leading-relaxed mt-1">{children}</p>
      </div>
    </div>
  );
}

export default function WorkerSnapshotDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: snapshot, isLoading, error } = useWorkerSnapshot(id);

  const back = (
    <button
      onClick={() => navigate(WORKER_PATHS.snapshots)}
      className="self-start flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
    >
      <ArrowLeft size={15} />
      Back to approved snapshots
    </button>
  );

  if (isLoading) {
    return (
      <div className="max-w-238 mx-auto flex items-center gap-3 text-slate-500 bg-white/80 rounded-xl p-6">
        <LoaderCircle size={18} className="animate-spin" />
        Opening this snapshot…
      </div>
    );
  }

  // Consent went while the screen was open, or never covered snapshots. The
  // participant's decision, stated as such — not an error the worker can fix.
  if (isConsentLost(error)) {
    return (
      <div className="max-w-238 mx-auto flex flex-col gap-6">
        {back}
        <div className="bg-white/80 rounded-xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <Key size={26} />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mt-6">Access not available</h1>
          <p className="text-base text-slate-600 mt-2 max-w-md mx-auto">
            This participant-owned information is not available unless the participant has
            given consent. TMG180 respects participant control over their information.
          </p>
          <button
            onClick={() => navigate(WORKER_PATHS.participants)}
            className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 mt-6 shadow-md hover:bg-brand-700 transition-colors"
          >
            Participants I support
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-238 mx-auto flex flex-col gap-6">
        {back}
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn&rsquo;t open this snapshot.</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!snapshot) return null;

  const full = snapshot.access === SNAPSHOT_ACCESS.FULL;
  const { stats } = snapshot;
  const hours = Math.round(((stats.totalMinutes ?? 0) / 60) * 10) / 10;

  const domainEntries = Object.entries(stats.domains ?? {}).sort(([, a], [, b]) => b - a);
  const domainTotal = domainEntries.reduce((sum, [, count]) => sum + count, 0) || 1;
  const comparisonEntries = Object.entries(stats.comparisons ?? {}).sort(([, a], [, b]) => b - a);

  const written = full
    ? SNAPSHOT_LAYERS.map((layer) => ({
        layer,
        fields: layer.fields.filter((field) => snapshot.narrative?.[field.key]?.trim()),
      })).filter((entry) => entry.fields.length > 0)
    : [];

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      {back}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {snapshot.participant.name} — {snapshot.monthLabel}
          </h1>
          <p className="text-base text-slate-600 mt-2 max-w-2xl">
            An approved Monthly Snapshot, shared with you under this participant&rsquo;s
            consent. Read-only — nothing here can be edited or added to.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
              <Lock size={11} />
              Approved and locked
            </span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                full ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <ShieldCheck size={11} />
              Consent level: {snapshot.accessLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Panel icon={Activity} tone="bg-purple-50 text-brand-600" title="Core engagement">
          <div className="mt-6 flex flex-col gap-5">
            <Metric label="Total hours logged" value={hours} unit="hrs" />
            <Metric
              label="Consistency streak"
              value={stats.streakDays ?? 0}
              unit={stats.streakDays === 1 ? 'day' : 'days'}
              note={`${stats.daysLogged} ${
                stats.daysLogged === 1 ? 'day' : 'days'
              } logged across the month`}
            />
          </div>
        </Panel>

        <Panel icon={PieChart} tone="bg-sky-50 text-sky-700" title="Areas of daily life">
          {domainEntries.length === 0 ? (
            <p className="text-sm text-slate-600 leading-relaxed mt-6">
              No areas of daily life were tagged on this month&rsquo;s logs.
            </p>
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              {domainEntries.map(([tag, count]) => {
                const share = Math.round((count / domainTotal) * 100);
                return (
                  <div key={tag}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-900">{domainLabel(tag)}</span>
                      <span className="text-sm font-semibold text-slate-500">{share}%</span>
                    </div>
                    <div className="mt-1.5 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-600 rounded-full"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      {/* Goal Link Helper roll-up — supports used this month, by NDIS budget bucket */}
      <SupportsByBucket buckets={stats.buckets ?? []} />

      {comparisonEntries.length > 0 && (
        <Panel icon={History} tone="bg-amber-50 text-amber-700" title="Compared with their usual pattern">
          <p className="text-sm text-slate-600 leading-relaxed mt-4">
            How the participant described these days against their own usual pattern. Their
            answers, counted — not an assessment of progress.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {comparisonEntries.map(([key, count]) => (
              <span
                key={key}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700"
              >
                {comparisonLabel(key) ?? key} · {count}
              </span>
            ))}
          </div>
        </Panel>
      )}

      <Panel icon={Target} tone="bg-emerald-50 text-emerald-700" title="Goals this month touched">
        {stats.goalsCount === 0 ? (
          <p className="text-sm text-slate-600 leading-relaxed mt-4">
            No goals were linked to this month&rsquo;s logs.
          </p>
        ) : full ? (
          <div className="mt-5 flex flex-col gap-3">
            {stats.goals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
              >
                <p className="text-sm text-slate-900">{goal.text}</p>
                <span className="text-xs text-slate-500 shrink-0">
                  {goal.logsCount} {goal.logsCount === 1 ? 'log' : 'logs'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600 leading-relaxed mt-4">
            {stats.goalsCount} {stats.goalsCount === 1 ? 'goal was' : 'goals were'} linked to
            this month&rsquo;s logs. The wording of a goal is part of the participant&rsquo;s
            Personal Profile, which this consent does not cover.
          </p>
        )}
      </Panel>

      <div className="bg-purple-50 rounded-xl p-6 flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-white text-brand-600 flex items-center justify-center shrink-0">
          <ShieldCheck size={19} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-brand-700 font-semibold">
            Non-linear functioning
          </p>
          <p className="text-sm text-slate-700 leading-relaxed mt-1">
            {snapshot.nonlinearStatement}
          </p>
        </div>
      </div>

      {full ? (
        written.length > 0 ? (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <ScrollText size={19} className="text-slate-500" />
              <h2 className="text-xl font-semibold text-slate-900">In their own words</h2>
            </div>
            {written.map(({ layer, fields }) => (
              <div
                key={layer.key}
                className="bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-brand-600">
                  {layer.label}
                </p>
                <div className="mt-4 flex flex-col gap-4">
                  {fields.map((field) => (
                    <div key={field.key}>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        {field.label}
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mt-1 whitespace-pre-wrap">
                        {snapshot.narrative[field.key]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-lg font-semibold text-slate-900">In their own words</h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-1">
              This snapshot was approved without a written reflection. The record above is
              what the month&rsquo;s logs show.
            </p>
          </div>
        )
      ) : (
        <Withheld>
          This participant&rsquo;s consent covers approved snapshots only, so you can see the
          shape of their month but not what they wrote about it — or any notes they have
          added since. If the fuller picture would help your support, that is their decision
          to make, in Privacy &amp; Sharing.
        </Withheld>
      )}

      {full && snapshot.addenda?.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <MessageSquarePlus size={19} className="text-slate-500" />
            <h2 className="text-xl font-semibold text-slate-900">Notes added since approval</h2>
          </div>
          {snapshot.addenda.map((addendum) => (
            <div
              key={addendum.id}
              className="bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <p className="text-sm text-slate-800">
                <span className="font-semibold">Added by the participant</span>
                {addendum.reason && (
                  <>
                    <span className="text-slate-300 mx-1.5">•</span>
                    <span className="text-brand-600 font-medium">{addendum.reason}</span>
                  </>
                )}
                <span className="text-slate-300 mx-1.5">•</span>
                <span className="text-slate-500">{formatTimestamp(addendum.createdAt)}</span>
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mt-1 whitespace-pre-wrap">
                {addendum.text}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white/80 rounded-xl px-6 py-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <p className="text-sm text-slate-600">
          Approved and locked on {formatShortDate(snapshot.lockedAt)}, compiled from{' '}
          {snapshot.logsCount}{' '}
          {snapshot.logsCount === 1
            ? 'Daily Support Evidence Log'
            : 'Daily Support Evidence Logs'}
          {!full && snapshot.addendaCount > 0 && (
            <>
              {' '}
              · {snapshot.addendaCount}{' '}
              {snapshot.addendaCount === 1 ? 'note has' : 'notes have'} been added since
            </>
          )}
          .
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {snapshot.lastViewedAt
            ? `You last opened this snapshot ${formatRelativeTime(snapshot.lastViewedAt)}.`
            : 'This is the first time you have opened this snapshot.'}{' '}
          Every read is recorded for the participant. TMG180 stores no medical or treatment
          records.
        </p>
      </div>
    </div>
  );
}
