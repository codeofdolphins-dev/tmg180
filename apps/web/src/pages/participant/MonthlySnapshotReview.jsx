import { useState } from 'react';
import SupportsByBucket from '../../components/snapshot/SupportsByBucket';
import {
  Lock,
  Target,
  Info,
  RefreshCw,
  LoaderCircle,
  TriangleAlert,
  ChevronDown,
  Quote,
  Scale,
} from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { SNAPSHOT_LAYERS, domainLabel, comparisonLabel } from '@tmg180/shared';
import { formatShortDate, formatTimestamp } from '../../lib/dates';
import { useGenerateSnapshot, useSnapshotForm } from '../../hooks/participant/snapshot';
import { PARTICIPANT_PATHS, participantSnapshotPath } from '../../routes/paths';

/**
 * Monthly Snapshot Summary — Draft, participant review (Figma 1169:1349).
 *
 * Laid out as the frame's bento grid: a 600px column of evidence cards beside a
 * 288px rail holding the non-linear statement, the writing helper and the
 * approval area.
 *
 * Two tiles the frame shows ("energy trend", "check-ins") need the M-04
 * check-in, which is unbuilt, and the writing helper is an unspecced AI
 * endpoint — all three render in place, visibly inactive, rather than being
 * dropped from the layout or filled with numbers nobody measured.
 *
 * Three fields are edited in their own sections rather than in the language
 * tabs, because the frame gives them dedicated cards: the two "functioning with
 * support" fields and the participant's own words.
 */

const SECTION_FIELDS = {
  withSupport: 'supportsThatHelped',
  withoutSupport: 'whenSupportUnavailable',
  voice: 'whatMattered',
};

const OWNED_ELSEWHERE = Object.values(SECTION_FIELDS);

/** "Daily living" -> "DL", "Mobility & transport" -> "M&T". */
const abbreviate = (label) =>
  label
    .split(/[\s&]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join(label.includes('&') ? '&' : '')
    .slice(0, 3);

function StatTile({ value, label, unavailable, title }) {
  return (
    <div
      title={title}
      className={`flex-1 min-w-0 rounded-2xl px-4 py-4 ${
        unavailable ? 'bg-white/40' : 'bg-white/60'
      }`}
    >
      <p
        className={`text-2xl font-bold leading-none ${
          unavailable ? 'text-slate-400' : 'text-[#7800ce]'
        }`}
      >
        {value}
      </p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#4d4354] mt-2">
        {label}
      </p>
      {unavailable && <p className="text-[10px] text-slate-400 mt-1">Not available yet</p>}
    </div>
  );
}

function Card({ children, className = '' }) {
  return <section className={`bg-white/70 rounded-3xl p-8 ${className}`}>{children}</section>;
}

export default function MonthlySnapshotReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [layerKey, setLayerKey] = useState(SNAPSHOT_LAYERS[0].key);
  const [confirming, setConfirming] = useState(false);
  const regenerate = useGenerateSnapshot();

  const review = useSnapshotForm(id);
  const { form, snapshot, isLoading, isSaving, error, isLocked } = review;
  const { register, formState } = form;
  const errors = formState.errors;

  if (isLocked) return <Navigate to={participantSnapshotPath.detail(snapshot.id)} replace />;

  if (isLoading || !snapshot) {
    return (
      <div className="max-w-238 mx-auto flex items-center gap-3 text-slate-500 bg-white/70 rounded-3xl p-8">
        <LoaderCircle size={18} className="animate-spin" />
        Compiling your snapshot…
      </div>
    );
  }

  const { stats } = snapshot;
  const layer = SNAPSHOT_LAYERS.find((entry) => entry.key === layerKey) ?? SNAPSHOT_LAYERS[0];
  const layerFields = layer.fields.filter((field) => !OWNED_ELSEWHERE.includes(field.key));
  const domains = Object.entries(stats.domains ?? {}).sort(([, a], [, b]) => b - a);
  const maxDomain = Math.max(1, ...domains.map(([, count]) => count));
  const hours = Math.round(((stats.totalMinutes ?? 0) / 60) * 10) / 10;

  /** The participant's own most-common answer for a goal, not a verdict on it. */
  const goalPattern = (goal) => {
    const entries = Object.entries(goal.comparisons ?? {});
    if (entries.length === 0) return null;
    const [key] = entries.sort(([, a], [, b]) => b - a)[0];
    return comparisonLabel(key);
  };

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-8 pb-6">
      <div className="flex flex-wrap items-start justify-between gap-8">
        <div className="max-w-150.5">
          <span className="inline-flex items-center gap-2 bg-[#d3e4fe] rounded-full px-3.5 py-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2170e4]" />
            <span className="text-xs font-semibold text-[#4d4354]">
              Draft — participant review
            </span>
          </span>
          <h1 className="text-3xl font-semibold text-[#0b1c30] mt-4">
            Monthly Snapshot Summary
          </h1>
          <p className="text-lg text-[#4d4354] mt-3">
            Review your monthly support evidence before approving and locking your
            snapshot.
          </p>
        </div>

        <button
          onClick={() => navigate(PARTICIPANT_PATHS.snapshot)}
          className="flex items-center gap-3 bg-white/80 rounded-full px-5 py-3 text-sm font-medium text-[#0b1c30] hover:bg-white transition-colors shrink-0"
        >
          {snapshot.monthLabel}
          <ChevronDown size={13} className="text-[#4d4354]" />
        </button>
      </div>

      {(error || regenerate.error) && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-2xl p-5 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <p className="text-sm">{(error ?? regenerate.error).message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-6 items-start">
        <div className="flex flex-col gap-6 min-w-0">
          {/* Section 5 — Monthly overview */}
          <section className="relative overflow-hidden bg-linear-to-br from-[#f0dbff] via-[#efe6ff] to-[#d3e4fe] rounded-3xl p-8">
            <h2 className="text-2xl font-semibold text-[#0b1c30]">
              {snapshot.monthLabel.split(' ')[0]} Overview
            </h2>
            <p className="text-base text-[#4d4354] mt-2 max-w-124.5">
              {snapshot.participantStory?.trim() ||
                'Your overview appears here once you write it below — this is the part a plan reviewer reads first.'}
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <StatTile value={stats.daysLogged} label="Days logged" />
              <StatTile value={stats.goals?.length ?? 0} label="Goals worked on" />
              <StatTile value={`${hours}`} label="Hours logged" />
              <StatTile
                value="—"
                label="Check-ins"
                unavailable
                title="Daily check-ins (M-04) are not built yet, so this month has none to count."
              />
            </div>
          </section>

          {/* Section 4 — Language perspective */}
          <Card>
            <h3 className="text-xl font-semibold text-[#0b1c30]">Language Perspective</h3>
            <p className="text-sm text-[#4d4354] mt-1">
              Adjust how evidence is presented for review. Every part is optional, and all
              of it belongs to you.
            </p>

            <div className="mt-6 bg-[#eff4ff] rounded-full p-1.25 grid grid-cols-3">
              {SNAPSHOT_LAYERS.map((entry) => (
                <button
                  key={entry.key}
                  type="button"
                  aria-pressed={entry.key === layerKey}
                  onClick={() => setLayerKey(entry.key)}
                  className={`rounded-full px-2 py-2.5 text-sm text-center leading-tight transition-colors ${
                    entry.key === layerKey
                      ? 'bg-white shadow-sm font-bold text-[#7800ce]'
                      : 'text-[#4d4354] hover:text-[#0b1c30]'
                  }`}
                >
                  {entry.label}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-5">
              {layerFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-bold text-[#0b1c30]" htmlFor={field.key}>
                    {field.label}
                  </label>
                  <p className="mt-1 text-sm text-[#4d4354]">{field.prompt}</p>
                  <textarea
                    id={field.key}
                    rows={3}
                    className="mt-2 w-full bg-white rounded-2xl px-4 py-3 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none resize-none focus:ring-2 focus:ring-brand-600/40"
                    {...register(field.key)}
                  />
                  {errors[field.key] && (
                    <p className="mt-2 text-sm text-[#ba1a1a]">{errors[field.key].message}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Goal Link Helper roll-up — supports used this month, by NDIS budget bucket */}
          <SupportsByBucket buckets={stats.buckets ?? []} />

          {/* Section 6 — Goal progress summary */}
          {stats.goals?.length > 0 && (
            <Card>
              <div className="flex items-center gap-3">
                <Target size={20} className="text-[#007a53]" />
                <h3 className="text-xl font-semibold text-[#0b1c30]">Goal Progress Summary</h3>
              </div>
              <div className="mt-6 flex flex-col gap-4">
                {stats.goals.map((goal) => {
                  const pattern = goalPattern(goal);
                  return (
                    <div key={goal.id} className="bg-white rounded-2xl px-5 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-base font-semibold text-[#0b1c30] min-w-0">
                          {goal.text}
                        </p>
                        {pattern && (
                          <span className="text-[11px] font-semibold text-[#2c0051] bg-[#9333ea]/15 px-3 py-1 rounded-full shrink-0">
                            Mostly {pattern.toLowerCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#4d4354] mt-2">
                        {goal.logsCount} {goal.logsCount === 1 ? 'log' : 'logs'} this month
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Sections 7 & 8 — Functioning with support, participant voice */}
          <Card>
            <div className="flex items-center gap-3">
              <Scale size={20} className="text-[#7800ce]" />
              <h3 className="text-xl font-semibold text-[#0b1c30]">Functioning with Support</h3>
            </div>
            <p className="text-sm text-[#4d4354] mt-1">
              Comparing capacity with and without assistance.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: SECTION_FIELDS.withSupport, label: 'With support' },
                { key: SECTION_FIELDS.withoutSupport, label: 'Without support' },
              ].map((column) => (
                <div key={column.key}>
                  <label
                    className="block text-[10px] uppercase tracking-wide text-slate-400"
                    htmlFor={column.key}
                  >
                    {column.label}
                  </label>
                  <textarea
                    id={column.key}
                    rows={5}
                    placeholder={
                      column.key === SECTION_FIELDS.withSupport
                        ? 'What was possible on the days support was there?'
                        : 'What happened on days without it?'
                    }
                    className="mt-2 w-full bg-white rounded-2xl px-4 py-3 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none resize-none focus:ring-2 focus:ring-brand-600/40"
                    {...register(column.key)}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 relative bg-[#f8f9ff] rounded-2xl p-5">
              <Quote size={20} className="text-[#9333ea]/40 absolute top-4 right-4" />
              <label
                className="block text-[10px] uppercase tracking-wide text-slate-400"
                htmlFor={SECTION_FIELDS.voice}
              >
                In my own words
              </label>
              <textarea
                id={SECTION_FIELDS.voice}
                rows={3}
                placeholder="What mattered most to you this month?"
                className="mt-2 w-full bg-white rounded-2xl px-4 py-3 text-base italic text-[#0b1c30] placeholder:text-[#6b7280] placeholder:not-italic outline-none resize-none focus:ring-2 focus:ring-brand-600/40"
                {...register(SECTION_FIELDS.voice)}
              />
              <p className="text-[11px] font-semibold text-[#7800ce] mt-2">Participant-authored</p>
            </div>
          </Card>

          {/* Section 9 — Functional domain trends */}
          {domains.length > 0 && (
            <Card>
              <h3 className="text-xl font-semibold text-[#0b1c30]">Functional Domain Trends</h3>
              <div className="mt-6 flex flex-wrap gap-6">
                {domains.map(([tag, count]) => {
                  const label = domainLabel(tag);
                  const share = Math.round((count / maxDomain) * 100);
                  return (
                    <div key={tag} className="flex flex-col items-center gap-2 w-24">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold text-[#7800ce]"
                        style={{
                          background: `conic-gradient(#7800ce ${share}%, #ede9fe ${share}% 100%)`,
                        }}
                      >
                        <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          {abbreviate(label)}
                        </span>
                      </div>
                      <p className="text-[10px] uppercase tracking-wide text-[#4d4354] text-center leading-tight">
                        {label}
                      </p>
                      <p className="text-[11px] text-slate-400 -mt-1">
                        {count} {count === 1 ? 'log' : 'logs'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Source material */}
          <Card className="py-6!">
            <h3 className="text-sm font-semibold text-[#0b1c30]">Source Material</h3>
            <p className="text-sm text-[#4d4354] mt-1">
              Generated from {stats.logsCount}{' '}
              {stats.logsCount === 1
                ? 'Daily Support Evidence Log'
                : 'Daily Support Evidence Logs'}
              {stats.firstSessionDate && stats.lastSessionDate && (
                <>
                  {' '}
                  between {formatShortDate(stats.firstSessionDate)} and{' '}
                  {formatShortDate(stats.lastSessionDate)}
                </>
              )}
              .{' '}
              {snapshot.generatedAt && `Last refreshed ${formatTimestamp(snapshot.generatedAt)}.`}{' '}
              TMG180 stores no medical or treatment records.
            </p>
            <button
              onClick={() => regenerate.mutate(snapshot.monthYear)}
              disabled={regenerate.isPending}
              className="mt-4 inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-5 py-2 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              title="Pick up any logs you have submitted since this was compiled. Your words are kept."
            >
              <RefreshCw size={14} className={regenerate.isPending ? 'animate-spin' : ''} />
              Refresh from my logs
            </button>
          </Card>
        </div>

        {/* Right rail */}
        <div className="flex flex-col gap-6">
          {/* Section 2 — Info card */}
          <div className="bg-[#eff4ff] rounded-3xl p-6">
            <Info size={18} className="text-[#2170e4]" />
            <p className="text-sm text-[#4d4354] mt-3 leading-relaxed">
              {snapshot.nonlinearStatement}
            </p>
          </div>


          {/* Section 11 — approval */}
          <div className="bg-white/70 rounded-3xl p-6 lg:sticky lg:top-24">
            <h3 className="text-xl font-semibold text-[#0b1c30]">Ready to lock?</h3>
            <p className="text-sm text-[#4d4354] mt-2 leading-relaxed">
              Once approved, this snapshot will be locked and ready to share with your
              support coordinator or NDIS planner. Nothing in it can be edited afterwards —
              you can attach a note at any time.
            </p>

            {confirming ? (
              <div className="mt-5 flex flex-col gap-2">
                <p className="text-sm font-semibold text-[#0b1c30]">
                  Approve {snapshot.monthLabel} and lock it?
                </p>
                <button
                  type="button"
                  onClick={review.approve}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#7800ce] text-sm text-white disabled:opacity-50"
                >
                  {isSaving ? (
                    <LoaderCircle size={14} className="animate-spin" />
                  ) : (
                    <Lock size={14} />
                  )}
                  Yes, approve and lock
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="w-full py-2.5 rounded-full text-sm text-[#4d4354] hover:bg-white/60"
                >
                  Not yet
                </button>
              </div>
            ) : (
              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#7800ce] text-sm text-white disabled:opacity-50"
                >
                  <Lock size={14} />
                  Approve and Lock
                </button>
                <button
                  type="button"
                  onClick={review.saveDraft}
                  disabled={isSaving}
                  className="w-full py-2.5 rounded-full bg-white border border-purple-100 text-sm text-[#7800ce] disabled:opacity-50"
                >
                  {isSaving ? 'Saving…' : 'Save as Draft'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
