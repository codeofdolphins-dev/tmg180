import { useEffect } from 'react';
import {
  CalendarDays,
  Gauge,
  HandHeart,
  BatteryLow,
  MessageSquareQuote,
  Target,
  SendHorizontal,
  TriangleAlert,
  X,
} from 'lucide-react';
import { Controller } from 'react-hook-form';
import {
  CHECKIN_GOAL_TAGS,
  CHECKIN_HELPED_TAGS,
  CHECKIN_IMPACT_TAGS,
  CHECKIN_INTENSITY_SCALE,
  CHECKIN_LIMITS,
  CHECKIN_OWN_WORDS_PROMPT,
  CHECKIN_PERIODS,
  CHECKIN_RECOVERY_LEVELS,
} from '@tmg180/shared';
import DateField from '../../components/ui/DateField';
import { useCheckInForm } from '../../hooks/participant/checkIns';
import { toggleInList } from '../../hooks/participant/dailyLog';

/**
 * Participant Check-in — Template B (Longitudinal Evidence Templates v2.0,
 * client set 28 Aug 2026). The seven blocks below are B1–B7 in the template's
 * order and wording.
 *
 * This is the participant's own account and nobody else's: there is no worker
 * layer of this screen, and the template rules out a worker completing it.
 * There is also no draft — saving locks the record — so the screen has one
 * action, not the log form's Save/Submit pair.
 *
 * Everything past B1 and B2 is optional. "Takes 30–60 seconds. You can do more
 * if you want to."
 */

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-2 text-sm text-[#ba1a1a] flex items-center gap-1.5">
      <TriangleAlert size={13} className="shrink-0" />
      {message}
    </p>
  );
}

function Block({ icon: Icon, title, description, children }) {
  return (
    <section className="bg-[#f8f9ff] rounded-4xl p-8">
      <div className="flex items-center gap-3">
        <Icon size={19} className="text-[#005f40]" />
        <h2 className="text-xl font-semibold text-[#0b1c30]">{title}</h2>
      </div>
      {description && <p className="mt-2 text-base text-[#4d4354]">{description}</p>}
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </section>
  );
}

function Chip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`px-4 py-2.25 rounded-full text-sm text-left transition-colors ${
        selected
          ? 'bg-[#007a53] text-white shadow-sm'
          : 'bg-[#e5eeff] text-[#0b1c30] hover:bg-[#d7e4ff]'
      }`}
    >
      {children}
    </button>
  );
}

function Notes({ id, label, register, rows = 3, placeholder }) {
  return (
    <div>
      <label className="block text-sm text-[#4d4354]" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        {...register(id)}
        className="mt-2 w-full rounded-2xl bg-white border border-[#e5eeff] px-4 py-3 text-base text-[#0b1c30] placeholder:text-[#8c8a94] focus:outline-none focus:border-[#005f40]"
      />
    </div>
  );
}

export default function CheckInForm() {
  const { form, isSaving, error, save, cancel } = useCheckInForm();
  const { register, control, watch, setValue, clearErrors, formState } = form;
  const errors = formState.errors;

  const period = watch('period');
  const impactTags = watch('impactTags') ?? [];
  const helpedTags = watch('helpedTags') ?? [];
  const goalsTags = watch('goalsTags') ?? [];
  const recoveryLevel = watch('recoveryLevel') ?? '';
  const intensityRating = watch('intensityRating');

  const impactFull = impactTags.length >= CHECKIN_LIMITS.maxImpactTags;

  // A rule error clears the moment it is satisfied.
  useEffect(() => {
    if (impactTags.length > 0) clearErrors('impactTags');
  }, [impactTags.length, clearErrors]);

  const toggleImpact = (key) => {
    if (impactFull && !impactTags.includes(key)) return;
    setValue('impactTags', toggleInList(impactTags, key), { shouldDirty: true });
  };

  return (
    <div className="flex flex-col gap-12 max-w-250 mx-auto pb-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0b1c30] leading-tight">Check-in</h1>
        <p className="text-base text-[#434655] mt-2 max-w-2xl">
          Your own experience, in your own words. This is your record — it sits alongside
          the support logs to build a complete picture. There are no right or wrong
          answers; what matters is what is true for you.
        </p>
        <p className="text-sm text-[#4d4354] mt-3 max-w-2xl">
          Takes 30&ndash;60 seconds. You can do more if you want to. Once you save it, a
          check-in stays as you wrote it — if something changes, add another one.
        </p>
      </div>

      <Block
        icon={CalendarDays}
        title="Check-in basics"
        description="This check-in is about:"
      >
        <div>
          <div className="flex flex-wrap gap-3">
            {CHECKIN_PERIODS.map((option) => (
              <Chip
                key={option.key}
                selected={period === option.key}
                onClick={() => setValue('period', option.key, { shouldDirty: true })}
              >
                {option.label}
              </Chip>
            ))}
          </div>
          <FieldError message={errors.period?.message} />
        </div>

        <div>
          <label className="block text-sm text-[#4d4354] mb-2" htmlFor="checkinDate">
            Date
          </label>
          <Controller
            name="checkinDate"
            control={control}
            render={({ field }) => (
              // A check-in is about a period that has happened.
              <DateField
                id="checkinDate"
                value={field.value}
                onChange={field.onChange}
                maxDate={new Date()}
              />
            )}
          />
          <FieldError message={errors.checkinDate?.message} />
        </div>
      </Block>

      <Block
        icon={Gauge}
        title="What showed up most for you"
        description={`Choose what was most present this period. Pick 1–${CHECKIN_LIMITS.maxImpactTags}.`}
      >
        <div>
          <div className="flex flex-wrap gap-3">
            {CHECKIN_IMPACT_TAGS.map((tag) => {
              const selected = impactTags.includes(tag.key);
              return (
                <Chip key={tag.key} selected={selected} onClick={() => toggleImpact(tag.key)}>
                  {tag.label}
                </Chip>
              );
            })}
          </div>
          {impactFull && (
            <p className="mt-2 text-sm text-[#4d4354]">
              That&rsquo;s {CHECKIN_LIMITS.maxImpactTags} — unpick one to choose something
              else.
            </p>
          )}
          <FieldError message={errors.impactTags?.message} />
        </div>

        <Notes
          id="impactNotes"
          label="Anything else showing up:"
          register={register}
          placeholder="Optional"
        />
      </Block>

      <Block
        icon={Gauge}
        title="How strong was it overall?"
        description="Rate the overall intensity of what showed up this period. A lower number is not a failure — it is information."
      >
        <div className="flex flex-col gap-2">
          {CHECKIN_INTENSITY_SCALE.map((step) => {
            const selected = intensityRating === step.value;
            return (
              <button
                key={step.value}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  setValue('intensityRating', selected ? null : step.value, {
                    shouldDirty: true,
                  })
                }
                className={`flex items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors ${
                  selected
                    ? 'bg-[#007a53] text-white shadow-sm'
                    : 'bg-[#e5eeff] text-[#0b1c30] hover:bg-[#d7e4ff]'
                }`}
              >
                <span className="text-lg font-bold w-5 shrink-0">{step.value}</span>
                <span className="text-sm">{step.label}</span>
              </button>
            );
          })}
        </div>
        <FieldError message={errors.intensityRating?.message} />
      </Block>

      <Block
        icon={HandHeart}
        title="What helped"
        description="Tick anything that made a difference."
      >
        <div className="flex flex-wrap gap-3">
          {CHECKIN_HELPED_TAGS.map((tag) => (
            <Chip
              key={tag.key}
              selected={helpedTags.includes(tag.key)}
              onClick={() =>
                setValue('helpedTags', toggleInList(helpedTags, tag.key), { shouldDirty: true })
              }
            >
              {tag.label}
            </Chip>
          ))}
        </div>
        <Notes
          id="helpedNotes"
          label="What else helped:"
          register={register}
          placeholder="Optional"
        />
      </Block>

      <Block
        icon={BatteryLow}
        title="Recovery cost"
        description="After getting through this period, how much recovery did you need?"
      >
        <div className="flex flex-col gap-2">
          {CHECKIN_RECOVERY_LEVELS.map((level) => {
            const selected = recoveryLevel === level.key;
            return (
              <button
                key={level.key}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  setValue('recoveryLevel', selected ? '' : level.key, { shouldDirty: true })
                }
                className={`rounded-2xl px-4 py-3 text-left text-sm transition-colors ${
                  selected
                    ? 'bg-[#007a53] text-white shadow-sm'
                    : 'bg-[#e5eeff] text-[#0b1c30] hover:bg-[#d7e4ff]'
                }`}
              >
                {level.label}
              </button>
            );
          })}
        </div>
        <Notes
          id="recoveryNotes"
          label="Anything you want to add about recovery:"
          register={register}
          placeholder="Optional"
        />
      </Block>

      <Block
        icon={MessageSquareQuote}
        title="In my own words"
        description="This is your space. Write whatever you want people to understand about this period — or leave it blank."
      >
        <Notes
          id="ownWords"
          label={CHECKIN_OWN_WORDS_PROMPT}
          register={register}
          rows={6}
          placeholder="Optional"
        />
      </Block>

      <Block
        icon={Target}
        title="Goals check-in"
        description="Optional — how did your NDIS goals connect to this period?"
      >
        <div className="flex flex-wrap gap-3">
          {CHECKIN_GOAL_TAGS.map((tag) => (
            <Chip
              key={tag.key}
              selected={goalsTags.includes(tag.key)}
              onClick={() =>
                setValue('goalsTags', toggleInList(goalsTags, tag.key), { shouldDirty: true })
              }
            >
              {tag.label}
            </Chip>
          ))}
        </div>
        <Notes
          id="goalsNotes"
          label="Anything about your goals this period:"
          register={register}
          placeholder="Optional"
        />
      </Block>

      {error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-2xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn&rsquo;t save your check-in.</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={cancel}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm text-[#0b1c30] hover:bg-[#e5eeff] transition-colors"
        >
          <X size={16} />
          Cancel
        </button>
        <button
          type="button"
          onClick={save}
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 shadow-md hover:bg-brand-700 transition-colors disabled:opacity-60"
        >
          <SendHorizontal size={16} />
          {isSaving ? 'Saving…' : 'Save check-in'}
        </button>
      </div>
    </div>
  );
}
