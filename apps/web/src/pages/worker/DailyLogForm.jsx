import { useEffect } from 'react';
import {
  Clock,
  X,
  Link2,
  Sparkles,
  Info,
  BarChart2,
  ClipboardList,
  SendHorizontal,
  LoaderCircle,
  TriangleAlert,
  BadgeCheck,
  ShieldOff,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Controller } from 'react-hook-form';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  FUNCTIONAL_DOMAINS,
  SUPPORT_LEVEL_COMPARISONS,
  DAILY_LOG_LIMITS,
} from '@tmg180/shared';
import DateField from '../../components/ui/DateField';
import Select from '../../components/ui/Select';
import TimeField from '../../components/ui/TimeField';
import {
  useWorkerDailyLogForm,
  useWorkerParticipants,
  useParticipantGoals,
  toggleInList,
} from '../../hooks/worker/dailyLog';
import { WORKER_PATHS, workerDailyLogPath } from '../../routes/paths';

/**
 * Daily Support Evidence Log — the worker layer of R-09 (Figma 1169:3172).
 *
 * One screen for a new log and an existing draft: /daily-log/new creates on
 * first save (with ?participant=<id> preselecting who it is for), and
 * /daily-log/:id/edit reopens a draft. A submitted log is locked and bounces
 * to its read-only view.
 *
 * What is different from the participant's form, and why:
 *  - It starts with *who*: a log is about a participant who currently lets
 *    this worker add logs. The picker lists only those people, and the API
 *    refuses everything else (403 consent_required).
 *  - Goals are the participant's, read behind the same consent.
 *  - The comparison chips are the worker vocabulary from the frame (Typical /
 *    More / Less / Different support needed) — the frame's "Baseline" heading
 *    is not used; the concept is the participant's usual pattern.
 *  - "Private notes" is WCPS Layer A (DB pack §2): kept only for the worker,
 *    never shown to the participant, other workers or TMG180. The frame has
 *    no field for it; canon does, so it is here and labelled plainly.
 *  - "Help me write this" is an approved AI endpoint with no spec yet. It
 *    renders disabled rather than removed.
 */

const AI_FORMATS = ['Plain language', 'NDIS evidence language', 'Both (Balanced)'];

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-2 text-sm text-[#ba1a1a] flex items-center gap-1.5">
      <TriangleAlert size={13} className="shrink-0" />
      {message}
    </p>
  );
}

function Labelled({ label, htmlFor, hint, error, children }) {
  return (
    <div>
      <label className="block text-sm text-[#4d4354] mb-2" htmlFor={htmlFor}>
        {label}
        {hint && <span className="ml-2 text-xs text-slate-400">{hint}</span>}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

function SectionTitle({ icon: Icon, tone = 'text-[#7800ce]', children, sub }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Icon size={20} className={tone} />
        <h2 className="text-xl font-semibold text-[#0b1c30]">{children}</h2>
      </div>
      {sub && <p className="mt-2 text-sm text-[#4d4354]">{sub}</p>}
    </div>
  );
}

const TEXTAREA =
  'mt-2 w-full bg-white rounded-3xl px-4 py-4 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none resize-none focus:ring-2 focus:ring-brand-600/40';
const INPUT =
  'w-full bg-white rounded-full px-4 py-3 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:ring-2 focus:ring-brand-600/40';

function initialsOf(name) {
  return (name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function DailyLogForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const presetParticipantId = searchParams.get('participant') ?? undefined;

  const daily = useWorkerDailyLogForm(id, { participantId: presetParticipantId });
  const { form, log, isLoading, loadError, isSaving, error, consentLost, isLocked } = daily;
  const { register, control, watch, setValue, clearErrors, formState } = form;
  const errors = formState.errors;

  const participants = useWorkerParticipants();
  const participantId = id ? log?.participant?.id : Number(watch('participantId')) || null;
  const goals = useParticipantGoals(participantId);

  const goalIds = watch('goalIds') ?? [];
  const domainTags = watch('domainTags') ?? [];
  const comparison = watch('comparison') ?? '';
  const goalById = new Map((goals.data ?? []).map((goal) => [goal.id, goal]));
  const unpicked = (goals.data ?? []).filter((goal) => !goalIds.includes(goal.id));
  const goalsFull = goalIds.length >= DAILY_LOG_LIMITS.maxGoals;
  const goalsBlocked = goals.error?.status === 403;

  // A rule error clears the moment it is satisfied.
  useEffect(() => {
    if (goalIds.length > 0) clearErrors('goalIds');
    if (domainTags.length > 0) clearErrors('domainTags');
    if (participantId) clearErrors('participantId');
  }, [goalIds.length, domainTags.length, participantId, clearErrors]);

  if (isLocked) return <Navigate to={workerDailyLogPath.detail(log.id)} replace />;

  if (isLoading) {
    return (
      <div className="max-w-250 mx-auto flex items-center gap-3 text-slate-500 bg-[#f8f9ff] rounded-4xl p-8">
        <LoaderCircle size={18} className="animate-spin" />
        Loading this log…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-250 mx-auto flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-3xl p-5 text-rose-800">
        <TriangleAlert size={18} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">We couldn&rsquo;t open this log.</p>
          <p className="text-sm mt-1">{loadError.message}</p>
        </div>
      </div>
    );
  }

  const selectedParticipant = id
    ? log?.participant
    : (participants.data ?? []).find((person) => person.id === participantId);
  const consentActive = id ? log?.consentActive : Boolean(selectedParticipant);
  const noConsentedParticipants = !id && participants.data?.length === 0;
  const canWrite = !noConsentedParticipants && !consentLost;

  const addGoal = (value) => {
    const goalId = Number(value);
    if (!goalId || goalIds.includes(goalId) || goalsFull) return;
    setValue('goalIds', [...goalIds, goalId], { shouldDirty: true });
  };
  const removeGoal = (goalId) =>
    setValue('goalIds', goalIds.filter((value) => value !== goalId), { shouldDirty: true });

  // Changing who the log is about invalidates any goals picked for someone else.
  const chooseParticipant = (value) => {
    setValue('participantId', value ? String(value) : '', { shouldDirty: true });
    setValue('goalIds', [], { shouldDirty: true });
  };

  return (
    <>
      <div className="flex flex-col gap-10 max-w-250 mx-auto pb-6">
        {/* ---------- who this support was for ---------- */}
        <div className="bg-[#f8f9ff] rounded-4xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          {id || selectedParticipant ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e5eeff] text-[#0b1c30] text-sm font-bold flex items-center justify-center">
                {initialsOf(selectedParticipant?.name)}
              </div>
              <div>
                <p className="text-base font-semibold text-[#0b1c30] leading-tight">
                  {selectedParticipant?.name ?? 'Participant'}
                </p>
                <p className="text-xs text-slate-500">
                  {id ? 'This log is about this participant.' : 'Support for this participant.'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#4d4354]">Choose who this support was for to begin.</p>
          )}

          <div className="flex items-center gap-3">
            {!id && participants.data?.length > 0 && (
              <div className="min-w-64">
                <Select
                  inputId="participantId"
                  aria-label="Who was this support for?"
                  look="pill"
                  value={
                    selectedParticipant
                      ? { value: String(selectedParticipant.id), label: selectedParticipant.name }
                      : null
                  }
                  options={participants.data.map((person) => ({
                    value: String(person.id),
                    label: person.name,
                  }))}
                  onChange={(option) => chooseParticipant(option?.value)}
                  placeholder="Who was this support for?"
                />
              </div>
            )}
            {(id || selectedParticipant) &&
              (consentActive ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700">
                  <BadgeCheck size={12} />
                  Consent active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-500">
                  <ShieldOff size={12} />
                  No active consent
                </span>
              ))}
          </div>
        </div>
        <FieldError message={errors.participantId?.message} />

        <div>
          <h1 className="text-3xl font-bold text-[#0b1c30] leading-tight">
            Daily Support Evidence Log
          </h1>
          <p className="text-base text-[#434655] mt-2 max-w-2xl">
            Document your support session. Focus on functional impacts, outcomes, and
            progress towards goals.
          </p>
        </div>

        {noConsentedParticipants && (
          <div className="flex items-start gap-3 bg-[#e5eeff] rounded-3xl p-5 text-[#0b1c30]">
            <ShieldOff size={18} className="shrink-0 mt-0.5 text-[#0058be]" />
            <div>
              <p className="font-semibold">No participant has given you consent to add daily logs yet.</p>
              <p className="text-sm mt-1">
                Access is controlled by participant consent. A log can be written once a
                participant you support grants it.
              </p>
              <button
                onClick={() => navigate(WORKER_PATHS.participants)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0058be] mt-3"
              >
                Participants I support <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {consentLost && (
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-3xl p-5 text-rose-800">
            <ShieldOff size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">This participant&rsquo;s consent is no longer active, so this log can&rsquo;t be saved.</p>
              <p className="text-sm mt-1">
                What you have typed stays on screen; the saved draft is exactly as it was.
                TMG180 respects participant control over their information.
              </p>
            </div>
          </div>
        )}

        {error && !consentLost && (
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-3xl p-5 text-rose-800">
            <TriangleAlert size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">This log wasn&rsquo;t saved.</p>
              <p className="text-sm mt-1">{error.message}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0 flex flex-col gap-8">
            {/* ---------- session details ---------- */}
            <section className="bg-[#f8f9ff] rounded-4xl p-8">
              <SectionTitle icon={Clock}>Session Details</SectionTitle>
              <div className="grid grid-cols-3 gap-6 mt-6">
                <Labelled label="Date" htmlFor="sessionDate" error={errors.sessionDate?.message}>
                  <Controller
                    name="sessionDate"
                    control={control}
                    render={({ field }) => (
                      <DateField id="sessionDate" ariaLabel="Date" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                    )}
                  />
                </Labelled>
                <Labelled label="Start Time" htmlFor="startTime" error={errors.startTime?.message}>
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field }) => (
                      <TimeField id="startTime" ariaLabel="Start time" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                    )}
                  />
                </Labelled>
                <Labelled label="End Time" htmlFor="endTime" error={errors.endTime?.message}>
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field }) => (
                      <TimeField id="endTime" ariaLabel="End time" value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                    )}
                  />
                </Labelled>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-6">
                <Labelled label="Support type" htmlFor="serviceType" hint="(optional)" error={errors.serviceType?.message}>
                  <input
                    id="serviceType"
                    type="text"
                    placeholder="e.g. In-home support, Community access"
                    className={INPUT}
                    {...register('serviceType')}
                  />
                </Labelled>
                <Labelled label="Location" htmlFor="location" hint="(optional)" error={errors.location?.message}>
                  <input
                    id="location"
                    type="text"
                    placeholder="e.g. Participant's home, Community Centre Library"
                    className={INPUT}
                    {...register('location')}
                  />
                </Labelled>
              </div>
            </section>

            {/* ---------- goals ---------- */}
            <section className="bg-[#f8f9ff] rounded-4xl p-8">
              <SectionTitle
                icon={Link2}
                sub={`Select ${DAILY_LOG_LIMITS.minGoals}–${DAILY_LOG_LIMITS.maxGoals} participant goals or support purposes relevant to today's support.`}
              >
                Link to Goals
              </SectionTitle>
              <div className="mt-5">
                {!participantId ? (
                  <p className="text-sm text-[#4d4354] bg-white rounded-3xl px-4 py-3">
                    Choose who this support was for and their goals will appear here.
                  </p>
                ) : goalsBlocked ? (
                  <p className="text-sm text-[#4d4354] bg-white rounded-3xl px-4 py-3 flex items-start gap-2">
                    <ShieldOff size={15} className="shrink-0 mt-0.5 text-slate-500" />
                    This participant&rsquo;s goals aren&rsquo;t available — access is controlled by
                    participant consent.
                  </p>
                ) : goals.isLoading ? (
                  <p className="text-sm text-[#4d4354] flex items-center gap-2">
                    <LoaderCircle size={14} className="animate-spin" /> Loading goals…
                  </p>
                ) : goals.data?.length === 0 ? (
                  <p className="text-sm text-[#4d4354] bg-white rounded-3xl px-4 py-3">
                    This participant hasn&rsquo;t added goals to My Personal Profile yet. A log
                    needs at least one linked goal before it can be submitted — it can still
                    be saved as a draft.
                  </p>
                ) : (
                  <Select
                    inputId="goalPicker"
                    aria-label="Linked goals"
                    value={null}
                    options={unpicked.map((goal) => ({ value: goal.id, label: goal.text }))}
                    onChange={(option) => addGoal(option?.value)}
                    isDisabled={goalsFull}
                    placeholder={
                      goalsFull ? 'You have linked the most goals one log can carry' : 'Select linked goals...'
                    }
                    noOptionsMessage={() => 'Every goal on this plan is already linked.'}
                  />
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {goalIds.map((goalId) => (
                    <span key={goalId} className="inline-flex items-center gap-2 bg-[#9333ea]/20 rounded-full px-4 py-1.5">
                      <span className="text-xs font-bold text-[#2c0051]">{goalById.get(goalId)?.text ?? 'Goal'}</span>
                      <button type="button" aria-label="Remove goal" onClick={() => removeGoal(goalId)}>
                        <X size={13} className="text-[#2c0051]" />
                      </button>
                    </span>
                  ))}
                </div>
                <FieldError message={errors.goalIds?.message} />
              </div>
            </section>

            {/* ---------- domains ---------- */}
            <section className="bg-[#f8f9ff] rounded-4xl p-8">
              <SectionTitle icon={Sparkles} sub="Select all areas engaged during the session.">
                Functional Domains
              </SectionTitle>
              <div className="mt-5 flex flex-wrap gap-3">
                {FUNCTIONAL_DOMAINS.map((domain) => {
                  const selected = domainTags.includes(domain.key);
                  return (
                    <button
                      key={domain.key}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setValue('domainTags', toggleInList(domainTags, domain.key), { shouldDirty: true })}
                      className={`px-4 py-2.25 rounded-full text-sm transition-colors ${
                        selected ? 'bg-[#ddb8ff] text-[#2c0051] font-semibold' : 'bg-white text-[#0b1c30] hover:bg-[#efe6ff]'
                      }`}
                    >
                      {domain.label}
                    </button>
                  );
                })}
              </div>
              <FieldError message={errors.domainTags?.message} />
            </section>

            {/* ---------- the details ---------- */}
            <section className="bg-[#f8f9ff] rounded-4xl p-8 flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-[#0b1c30]" htmlFor="impactText">Function-first impacts</label>
                <textarea id="impactText" rows={4} placeholder="Describe how the participant's function was impacted today..." className={TEXTAREA} {...register('impactText')} />
                <FieldError message={errors.impactText?.message} />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0b1c30]" htmlFor="supportText">Support delivered</label>
                <textarea id="supportText" rows={3} placeholder="Detail the specific supports provided..." className={TEXTAREA} {...register('supportText')} />
                <FieldError message={errors.supportText?.message} />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0b1c30]" htmlFor="outcomeText">Outcome / participation snapshot</label>
                <textarea id="outcomeText" rows={4} placeholder="What was the outcome? How did they participate?" className={TEXTAREA} {...register('outcomeText')} />
                <FieldError message={errors.outcomeText?.message} />
              </div>
            </section>

            {/* ---------- comparison ---------- */}
            <section className="bg-[#f8f9ff] rounded-4xl p-8">
              <SectionTitle icon={BarChart2} sub="Compared with this person's usual pattern, what did today's support look like?">
                Compared with their usual pattern
              </SectionTitle>
              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                {SUPPORT_LEVEL_COMPARISONS.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    aria-pressed={comparison === option.key}
                    onClick={() => setValue('comparison', comparison === option.key ? '' : option.key, { shouldDirty: true })}
                    className={`rounded-full px-3 py-3 text-sm text-center leading-tight transition-colors ${
                      comparison === option.key
                        ? 'bg-[#7800ce] text-white font-semibold shadow-sm'
                        : 'bg-white text-[#0b1c30] hover:bg-[#efe6ff]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <FieldError message={errors.comparison?.message} />
            </section>

            {/* ---------- additional context ---------- */}
            <section className="bg-[#f8f9ff] rounded-4xl p-8">
              <SectionTitle icon={ClipboardList} tone="text-[#0b1c30]">
                Additional Context <span className="text-sm font-normal text-slate-500">(Optional)</span>
              </SectionTitle>
              <div className="mt-5 flex flex-col gap-6">
                <div>
                  <label className="block text-sm text-[#4d4354]" htmlFor="participantVoice">Participant voice</label>
                  <textarea id="participantVoice" rows={3} placeholder="Quotes or specific feedback from the participant..." className={TEXTAREA} {...register('participantVoice')} />
                  <p className="mt-2 text-xs text-slate-500">
                    Their words, as they said them — this is the one part of the log that speaks for the participant, so keep it to what they actually said or chose.
                  </p>
                  <FieldError message={errors.participantVoice?.message} />
                </div>
                <div>
                  <label className="block text-sm text-[#4d4354]" htmlFor="safetyNote">Safety / incident note</label>
                  <textarea id="safetyNote" rows={3} placeholder="Any safety observations (non-urgent)..." className={TEXTAREA} {...register('safetyNote')} />
                  <FieldError message={errors.safetyNote?.message} />
                </div>
              </div>
            </section>

            {/* ---------- private notes (WCPS Layer A) ---------- */}
            <section className="bg-white border border-slate-200 rounded-4xl p-8">
              <SectionTitle icon={Lock} tone="text-slate-700">
                Private notes <span className="text-sm font-normal text-slate-500">(never shared)</span>
              </SectionTitle>
              <p className="mt-2 text-sm text-[#4d4354]">
                Your own working notes for this session. They are kept only for you — the
                participant, other workers and TMG180 never see them, and they do not go into
                the participant&rsquo;s record or snapshot. Everything above this box is the
                shared record; this box is not.
              </p>
              <textarea
                id="privateNarrative"
                rows={4}
                placeholder="Reminders, reflections, things to follow up next time..."
                className="mt-4 w-full bg-slate-50 rounded-3xl px-4 py-4 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none resize-none focus:ring-2 focus:ring-slate-400/40"
                {...register('privateNarrative')}
              />
              <FieldError message={errors.privateNarrative?.message} />
            </section>
          </div>

          {/* ---------- rail ---------- */}
          <div className="w-80 shrink-0 hidden xl:flex flex-col gap-4 sticky top-22">
            <div className="relative overflow-hidden bg-[#7800ce]/5 rounded-4xl p-6">
              <div className="absolute -top-10 -right-2 w-32 h-32 rounded-full bg-[#7800ce]/20 blur-2xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-[#7800ce] text-white flex items-center justify-center">
                      <Sparkles size={17} />
                    </span>
                    <h3 className="text-base font-semibold text-[#0b1c30]">Help me write this</h3>
                  </div>
                  <span title="Not switched on yet. When it is, you review any drafted wording before it is saved.">
                    <Info size={18} className="text-slate-500" />
                  </span>
                </div>
                <p className="mt-3 text-sm text-[#4d4354]">Refine your notes into professional phrasing.</p>
                <p className="mt-1 text-xs text-slate-500">Uses your saved inputs only.</p>
                <div className="mt-4 flex flex-col gap-2">
                  {AI_FORMATS.map((label) => (
                    <button
                      key={label}
                      type="button"
                      disabled
                      className="w-full rounded-full bg-white border border-purple-200 py-2.5 text-sm text-[#0b1c30] opacity-60 cursor-not-allowed"
                    >
                      {label}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled
                    className="w-full rounded-full bg-[#e5eeff] py-2.5 text-sm font-semibold text-[#7800ce] opacity-60 cursor-not-allowed"
                  >
                    Generate Draft
                  </button>
                </div>
                <p className="mt-3 text-xs text-[#4d4354] text-center">
                  Writing help isn&rsquo;t switched on yet. Your own words are all this log needs.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={daily.submit}
              disabled={isSaving || !canWrite}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#7800ce] py-3.5 text-sm font-semibold text-white shadow-md disabled:opacity-50 transition-opacity"
            >
              {isSaving ? <LoaderCircle size={14} className="animate-spin" /> : <SendHorizontal size={14} />}
              Submit Log
            </button>
            <button
              type="button"
              onClick={daily.saveDraft}
              disabled={isSaving || !canWrite}
              className="w-full rounded-full bg-white border border-slate-200 py-3.5 text-sm font-semibold text-[#0b1c30] disabled:opacity-50 transition-opacity"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={daily.cancel}
              className="w-full rounded-full py-2.5 text-sm text-[#4d4354] hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Below xl the rail is hidden — the actions come back as a fixed footer. */}
      <footer className="xl:hidden fixed bottom-0 left-64 right-0 z-10 h-18.75 flex items-center px-10 bg-[#f8f9ff]/90 border-t border-slate-200/50 backdrop-blur">
        <div className="w-full max-w-248 mx-auto flex items-center justify-between">
          <button type="button" onClick={daily.cancel} className="px-6 py-2.5 rounded-full text-sm text-[#4d4354] hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <div className="flex items-center gap-4">
            <button type="button" onClick={daily.saveDraft} disabled={isSaving || !canWrite} className="px-6 py-2.5 rounded-full bg-white border border-purple-100 text-sm text-[#7800ce] disabled:opacity-50 transition-opacity">
              Save Draft
            </button>
            <button type="button" onClick={daily.submit} disabled={isSaving || !canWrite} className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-[#7800ce] text-sm text-white disabled:opacity-50 transition-opacity">
              {isSaving ? <LoaderCircle size={14} className="animate-spin" /> : null}
              Submit Log
              <SendHorizontal size={14} />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
