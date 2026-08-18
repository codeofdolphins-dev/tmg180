import { useEffect } from 'react';
import {
  CircleUserRound,
  Clock,
  X,
  Target,
  PenLine,
  BarChart2,
  Sparkles,
  Info,
  StickyNote,
  SendHorizontal,
  LoaderCircle,
  TriangleAlert,
  ChevronDown,
} from 'lucide-react';
import { Controller } from 'react-hook-form';
import { Navigate, useParams } from 'react-router-dom';
import { FUNCTIONAL_DOMAINS, USUAL_PATTERN_COMPARISONS, DAILY_LOG_LIMITS } from '@tmg180/shared';
import DateField from '../../components/ui/DateField';
import Select from '../../components/ui/Select';
import TimeField from '../../components/ui/TimeField';
import { useDailyLogForm, useGoals, toggleInList } from '../../hooks/participant/dailyLog';
import { participantDailyLogPath, PARTICIPANT_PATHS } from '../../routes/paths';
import { useAuthStore } from '../../store';

/**
 * Daily Support Evidence Log — the participant layer of R-09 (Figma 1169:825).
 *
 * One screen for both a new log and an existing draft: /daily-log/new creates
 * on first save, /daily-log/:id/edit reopens one. A submitted log is locked and
 * bounces to its read-only view — the evidence chain is append-only, so this
 * form never edits a finalised record.
 *
 * The "Help me write this" panel is one of the three approved AI endpoints and
 * is not specced yet (draft-only, behind a human review gate). It renders
 * disabled rather than removed: a control that looks live but does nothing is
 * worse than one that says it is not ready.
 */

const PRIVACY_TEXT =
  'This tool only uses the dot points you provide below to generate suggestions. It does not access your broader history and complies with Australian Privacy Principles (APPs).';

const ROUGH_NOTES_PLACEHOLDER =
  '- Went to cafe\n- ordered coffee independently\n- felt overwhelmed by noise\n- support worker helped me find a quiet spot';

const AI_FORMATS = ['Plain language', 'NDIS evidence language', 'Both formats'];

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-2 text-sm text-[#ba1a1a] flex items-center gap-1.5">
      <TriangleAlert size={13} className="shrink-0" />
      {message}
    </p>
  );
}

function SessionField({ label, htmlFor, error, children }) {
  return (
    <div>
      <label className="block text-sm text-[#4d4354] mb-2" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

function RequiredLabel({ label, hint }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[#4d4354]">{label}</span>
      <span className="text-sm font-bold text-[#ba1a1a]">*</span>
      {hint && <span className="text-xs text-[#4d4354]">{hint}</span>}
    </div>
  );
}

export default function ParticipantDailyLog() {
  const { id } = useParams();
  const user = useAuthStore((s) => s.user);
  const { data: goals } = useGoals();
  const daily = useDailyLogForm(id);
  const { form, log, isLoading, isSaving, error, isLocked } = daily;
  const { register, control, watch, setValue, clearErrors, formState } = form;
  const errors = formState.errors;

  const goalIds = watch('goalIds') ?? [];
  const domainTags = watch('domainTags') ?? [];
  const comparison = watch('comparison') ?? '';
  const goalById = new Map((goals ?? []).map((goal) => [goal.id, goal]));
  const unpicked = (goals ?? []).filter((goal) => !goalIds.includes(goal.id));
  const goalsFull = goalIds.length >= DAILY_LOG_LIMITS.maxGoals;

  // A rule error clears the moment it is satisfied — the message under the
  // field should never outlive the problem it describes.
  useEffect(() => {
    if (goalIds.length > 0) clearErrors('goalIds');
    if (domainTags.length > 0) clearErrors('domainTags');
  }, [goalIds.length, domainTags.length, clearErrors]);

  if (isLocked) return <Navigate to={participantDailyLogPath.detail(log.id)} replace />;

  if (isLoading) {
    return (
      <div className="max-w-250 mx-auto flex items-center gap-3 text-slate-500 bg-[#f8f9ff] rounded-4xl p-8">
        <LoaderCircle size={18} className="animate-spin" />
        Loading your log…
      </div>
    );
  }

  const addGoal = (value) => {
    const goalId = Number(value);
    if (!goalId || goalIds.includes(goalId) || goalsFull) return;
    setValue('goalIds', [...goalIds, goalId], { shouldDirty: true });
  };

  const removeGoal = (goalId) =>
    setValue(
      'goalIds',
      goalIds.filter((value) => value !== goalId),
      { shouldDirty: true }
    );

  return (
    <>
      {/* pb clears the fixed action bar below */}
      <div className="flex flex-col gap-12 max-w-250 mx-auto pb-6">
        <div className="flex flex-col gap-4">
          <div className="inline-flex self-start items-center gap-2 bg-[#e5eeff] rounded-full pl-4 pr-5 py-2">
            <CircleUserRound size={15} className="text-[#9333ea]" />
            <span className="text-xs font-bold text-[#0b1c30]">{user?.name ?? 'My log'}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0b1c30] leading-tight">
              Daily Support Evidence Log
            </h1>
            <p className="text-base text-[#434655] mt-2 max-w-2xl">
              Record what happened during support and link it back to your goals. Take your
              time, there is no right or wrong way to write this.
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-3xl p-5 text-rose-800">
            <TriangleAlert size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Your log wasn&rsquo;t saved.</p>
              <p className="text-sm mt-1">{error.message}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0 flex flex-col gap-8">
            <section className="bg-[#f8f9ff] rounded-4xl p-8">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-[#7800ce]" />
                <h2 className="text-xl font-semibold text-[#0b1c30]">Session Details</h2>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-6">
                <SessionField
                  label="Date"
                  htmlFor="sessionDate"
                  error={errors.sessionDate?.message}
                >
                  <Controller
                    name="sessionDate"
                    control={control}
                    render={({ field }) => (
                      <DateField
                        id="sessionDate"
                        ariaLabel="Date"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                </SessionField>
                <SessionField
                  label="Start Time"
                  htmlFor="startTime"
                  error={errors.startTime?.message}
                >
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field }) => (
                      <TimeField
                        id="startTime"
                        ariaLabel="Start time"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                </SessionField>
                <SessionField label="End Time" htmlFor="endTime" error={errors.endTime?.message}>
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field }) => (
                      <TimeField
                        id="endTime"
                        ariaLabel="End time"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                </SessionField>
              </div>
            </section>

            <section className="bg-[#f8f9ff] rounded-4xl p-8">
              <div className="flex items-center gap-3">
                <Target size={20} className="text-[#007a53]" />
                <h2 className="text-xl font-semibold text-[#0b1c30]">Intent &amp; Focus</h2>
              </div>
              <div className="mt-6 flex flex-col gap-8">
                <div>
                  <RequiredLabel
                    label="Goals linked to this support"
                    hint={'(Select ' + DAILY_LOG_LIMITS.minGoals + '-' + DAILY_LOG_LIMITS.maxGoals + ' goals)'}
                  />
                  {goals?.length === 0 ? (
                    <p className="mt-3 text-sm text-[#4d4354] bg-white rounded-3xl px-4 py-3">
                      Your goals come from{' '}
                      <a
                        href={PARTICIPANT_PATHS.profileMyGoals}
                        className="text-brand-600 underline"
                      >
                        My Goals
                      </a>{' '}
                      in your Personal Profile. Add one there and it will appear here.
                    </p>
                  ) : (
                    <Select
                      inputId="goalPicker"
                      aria-label="Goals linked to this support"
                      className="mt-3"
                      // Picking adds a chip below and clears the field, so the
                      // control itself never holds a value.
                      value={null}
                      options={unpicked.map((goal) => ({ value: goal.id, label: goal.text }))}
                      onChange={(option) => addGoal(option?.value)}
                      isDisabled={goalsFull}
                      placeholder={
                        goalsFull
                          ? 'You have linked the most goals one log can carry'
                          : 'Select a goal from your plan...'
                      }
                      noOptionsMessage={() => 'Every goal on your plan is already linked.'}
                    />
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {goalIds.map((goalId) => (
                      <span
                        key={goalId}
                        className="inline-flex items-center gap-2 bg-[#9333ea]/20 rounded-full px-4 py-1.5"
                      >
                        <span className="text-xs font-bold text-[#2c0051]">
                          {goalById.get(goalId)?.text ?? 'Goal'}
                        </span>
                        <button
                          type="button"
                          aria-label="Remove goal"
                          onClick={() => removeGoal(goalId)}
                        >
                          <X size={13} className="text-[#2c0051]" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <FieldError message={errors.goalIds?.message} />
                </div>

                <hr className="border-slate-200" />

                <div>
                  <RequiredLabel
                    label="Functional domain tags"
                    hint="(Areas of daily life this support touched)"
                  />
                  <div className="mt-3 flex flex-wrap gap-3">
                    {FUNCTIONAL_DOMAINS.map((domain) => {
                      const selected = domainTags.includes(domain.key);
                      return (
                        <button
                          key={domain.key}
                          type="button"
                          aria-pressed={selected}
                          onClick={() =>
                            setValue('domainTags', toggleInList(domainTags, domain.key), {
                              shouldDirty: true,
                            })
                          }
                          className={`px-4 py-2.25 rounded-full text-sm transition-colors ${
                            selected
                              ? 'bg-[#007a53] text-white shadow-sm'
                              : 'bg-[#e5eeff] text-[#0b1c30] hover:bg-[#d7e4ff]'
                          }`}
                        >
                          {domain.label}
                        </button>
                      );
                    })}
                  </div>
                  <FieldError message={errors.domainTags?.message} />
                </div>
              </div>
            </section>

            <section className="bg-[#f8f9ff] rounded-4xl p-8">
              <div className="flex items-center gap-3">
                <PenLine size={19} className="text-[#7800ce]" />
                <h2 className="text-xl font-semibold text-[#0b1c30]">The Details</h2>
              </div>
              <p className="mt-2 text-base text-[#4d4354]">
                Describe the support in your own words. Focus on the impact and
                participation.
              </p>
              <div className="mt-6 flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0b1c30]" htmlFor="impactText">
                    Function-first impacts
                  </label>
                  <p className="mt-2 text-sm text-[#4d4354]">
                    How did this support help you manage functional challenges today?
                  </p>
                  <textarea
                    id="impactText"
                    rows={4}
                    placeholder="e.g., The support worker assisted me with navigation, which reduced my anxiety..."
                    className="mt-2 w-full bg-white rounded-3xl px-4 py-4 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none resize-none focus:ring-2 focus:ring-brand-600/40"
                    {...register('impactText')}
                  />
                  <FieldError message={errors.impactText?.message} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0b1c30]" htmlFor="supportText">
                    Support delivered
                  </label>
                  <textarea
                    id="supportText"
                    rows={3}
                    placeholder="Briefly describe what support was provided..."
                    className="mt-2 w-full bg-white rounded-3xl px-4 py-4 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none resize-none focus:ring-2 focus:ring-brand-600/40"
                    {...register('supportText')}
                  />
                  <FieldError message={errors.supportText?.message} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0b1c30]" htmlFor="outcomeText">
                    Outcome / participation snapshot
                  </label>
                  <textarea
                    id="outcomeText"
                    rows={4}
                    placeholder="What was the result? Were you able to participate more fully?"
                    className="mt-2 w-full bg-white rounded-3xl px-4 py-4 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none resize-none focus:ring-2 focus:ring-brand-600/40"
                    {...register('outcomeText')}
                  />
                  <FieldError message={errors.outcomeText?.message} />
                </div>
              </div>
            </section>

            <section className="bg-[#f8f9ff] rounded-4xl p-8">
              <BarChart2 size={20} className="text-[#7800ce]" />
              <p className="mt-2 text-base text-[#4d4354] max-w-109.5]">
                Compared to your usual pattern, how did things go during this period?
              </p>
              <div className="mt-6 bg-[#eff4ff] rounded-full p-1.25 grid grid-cols-4 items-center">
                {USUAL_PATTERN_COMPARISONS.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    aria-pressed={comparison === option.key}
                    onClick={() =>
                      setValue('comparison', comparison === option.key ? '' : option.key, {
                        shouldDirty: true,
                      })
                    }
                    className={`rounded-md px-1 py-3 text-sm text-center leading-tight transition-colors ${
                      comparison === option.key
                        ? 'bg-white shadow-sm font-bold text-[#7800ce]'
                        : 'text-[#4d4354] hover:text-[#0b1c30]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <FieldError message={errors.comparison?.message} />
            </section>
          </div>

          <div className="w-96 shrink-0 hidden xl:flex flex-col gap-6">
            <div className="relative overflow-hidden bg-[#7800ce]/5 rounded-4xl p-6">
              <div className="absolute -top-10 -right-2 w-32 h-32 rounded-full bg-[#7800ce]/20 blur-2xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Sparkles size={22} className="text-[#7800ce] shrink-0" />
                    <h3 className="text-base font-semibold text-[#7800ce]">
                      Help me write this
                    </h3>
                  </div>
                  <span title="Not switched on yet. When it is, a person reviews any drafted wording before it is saved.">
                    <Info size={20} className="text-slate-700" />
                  </span>
                </div>

                <div className="mt-4 bg-[#f8f9ff]/50 rounded-3xl p-4">
                  <p className="text-xs font-bold text-[#7800ce]">
                    Privacy First (Australian Privacy Principles)
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#4d4354] leading-relaxed">
                    {PRIVACY_TEXT}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-bold text-[#4d4354]">
                    Jot down a few rough notes here:
                  </p>
                  <textarea
                    rows={5}
                    disabled
                    aria-label="Rough notes for writing help"
                    placeholder={ROUGH_NOTES_PLACEHOLDER}
                    className="mt-2 w-full bg-white/80 rounded-3xl px-3.5 py-3 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none resize-none disabled:opacity-70"
                  />
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  {AI_FORMATS.map((label) => (
                    <button
                      key={label}
                      type="button"
                      disabled
                      className="w-full h-10.5 rounded-full bg-[#f8f9ff] border border-purple-200 text-sm text-[#7800ce] opacity-60 cursor-not-allowed"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <p className="mt-3 text-xs text-[#4d4354] text-center">
                  Writing help isn&rsquo;t switched on yet. Your own words are all this log
                  needs.
                </p>
              </div>
            </div>

            <details className="bg-[#f8f9ff] rounded-4xl px-6 py-6 group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="flex items-center gap-2">
                  <StickyNote size={20} className="text-[#0b1c30]" />
                  <span className="text-sm text-[#0b1c30]">Additional Notes (Optional)</span>
                </span>
                <ChevronDown
                  size={15}
                  className="text-slate-500 transition-transform group-open:rotate-180"
                />
              </summary>
              <textarea
                rows={4}
                aria-label="Additional notes"
                placeholder="Anything else you want on the record for this day..."
                className="mt-4 w-full bg-white rounded-3xl px-4 py-3 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none resize-none focus:ring-2 focus:ring-brand-600/40"
                {...register('additionalNotes')}
              />
              <FieldError message={errors.additionalNotes?.message} />
            </details>
          </div>
        </div>
      </div>

      {/* max-w matches the content container so the actions line up with the form */}
      <footer className="fixed bottom-0 left-64 right-0 z-10 h-18.75 flex items-center px-10 bg-[#f8f9ff]/90 border-t border-slate-200/50 backdrop-blur">
        <div className="w-full max-w-248 mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={daily.cancel}
            className="px-6 py-2.5 rounded-full text-sm text-[#4d4354] hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={daily.saveDraft}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full bg-white border border-purple-100 text-sm text-[#7800ce] disabled:opacity-50 transition-opacity"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={daily.submit}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-[#7800ce] text-sm text-white disabled:opacity-50 transition-opacity"
            >
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
