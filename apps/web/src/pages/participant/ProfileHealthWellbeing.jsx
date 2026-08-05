import {
  Move,
  Smile,
  Angry,
  Frown,
  Meh,
  Laugh,
  Lightbulb,
  Check,
  TriangleAlert,
} from 'lucide-react';

import ProfileSectionFooter from '../../components/participant/ProfileSectionFooter';
import { toggleInList, useSectionForm } from '../../hooks/participant/profile';

const SHARE_PLACEHOLDER =
  'Share anything that helps us understand your day-to-day health or wellbeing.';

/** Values match the current_support options in @tmg180/shared. */
const CURRENT_SUPPORT = [
  { value: 'medication', label: 'Medication' },
  { value: 'physiotherapy', label: 'Physiotherapy' },
  { value: 'psychology', label: 'Psychology' },
  { value: 'occupational_therapy', label: 'Occupational Therapy' },
  { value: 'exercise_plan', label: 'Exercise Plan' },
  { value: 'support_worker', label: 'Support Worker' },
  { value: 'other', label: 'Other' },
];

/** recent_mood is a 1-5 scale in @tmg180/shared. */
const MOODS = [
  { value: 1, label: 'Very unhappy', icon: Angry, tone: 'text-red-600' },
  { value: 2, label: 'Unhappy', icon: Frown, tone: 'text-amber-700' },
  { value: 3, label: 'Okay', icon: Meh, tone: 'text-brand-600' },
  { value: 4, label: 'Good', icon: Smile, tone: 'text-emerald-600' },
  { value: 5, label: 'Great', icon: Laugh, tone: 'text-teal-600' },
];

const INFO_PARAGRAPHS = [
  'our health and wellbeing information belongs to you.',
  "Share only what you're comfortable sharing.",
  'You can update this information whenever your health or support needs change.',
];

const HELP_PARAGRAPHS = [
  'There are no right or wrong answers.',
  "Share only what you're feel comfortable sharing about your health and wellbeing.",
  'You can update this information whenever things change.',
];

function TextareaField({ label, labelTone, ...field }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={field.name} className={`text-sm font-medium ${labelTone}`}>
        {label}
      </label>
      <textarea
        id={field.name}
        placeholder={SHARE_PLACEHOLDER}
        className="rounded-lg border border-slate-300 bg-white p-4 min-h-26.5 resize-none text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-brand-600 transition-colors"
        {...field}
      />
    </div>
  );
}

export default function ProfileHealthWellbeing() {
  const section = useSectionForm('health-wellbeing');
  const { status, position, error } = section;
  const { register, watch, setValue } = section.form;
  const support = watch('current_support') ?? [];
  const mood = watch('recent_mood') ?? null;

  return (
    <div className="max-w-236 mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] leading-10 font-semibold text-[#0b1c30]">
          Health &amp; Wellbeing
        </h1>
        <p className="text-base text-[#434655] max-w-2xl">
          Tell us about your health, wellbeing, and any support that helps you stay
          healthy and participate in everyday life.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_275px] gap-6 items-start">
        <div className="flex flex-col gap-8">
          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-purple-600/10 flex items-center justify-center shrink-0">
                <Move size={20} className="text-brand-600" />
              </div>
              <h2 className="text-2xl font-semibold text-[#0b1c30]">
                Physical Health &amp; Daily Wellbeing
              </h2>
            </div>

            <div className="flex flex-col gap-8">
              <TextareaField
                label="Do you have any health conditions that affect your daily life?"
                labelTone="text-[#434655]"
                {...register('health_conditions')}
              />

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-[#0b1c30]">Current Support</p>
                <div className="flex flex-wrap gap-2">
                  {CURRENT_SUPPORT.map(({ value, label }) => {
                    const checked = support.includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={checked}
                        onClick={() =>
                          setValue('current_support', toggleInList(support, value), {
                            shouldDirty: true,
                          })
                        }
                        className={`flex items-center gap-2 rounded-full border px-4 py-2 transition-colors ${
                          checked
                            ? 'border-brand-600 bg-brand-600/10'
                            : 'border-slate-300 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`w-4.75 h-4.75 rounded-sm shrink-0 flex items-center justify-center ${
                            checked ? 'bg-brand-600' : 'border border-slate-400 bg-white'
                          }`}
                        >
                          {checked && <Check size={12} strokeWidth={3} className="text-white" />}
                        </span>
                        <span className="text-base text-[#434655]">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <TextareaField
                label="Anything else?"
                labelTone="text-[#434655]"
                {...register('anything_else')}
              />
            </div>
          </section>

          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Smile size={20} className="text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold text-[#0b1c30]">
                Emotional Wellbeing
              </h2>
            </div>

            <p className="text-sm font-medium text-[#434655] mb-2">
              How have you been feeling recently?
            </p>
            <div className="flex gap-2">
              {MOODS.map(({ value, label, icon: Icon, tone }) => {
                const selected = mood === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={label}
                    aria-pressed={selected}
                    onClick={() =>
                      setValue('recent_mood', selected ? null : value, { shouldDirty: true })
                    }
                    className={`w-14 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      selected
                        ? 'bg-purple-600/10 border border-brand-600'
                        : 'bg-[#e5eeff] hover:bg-[#d8e6ff]'
                    }`}
                  >
                    <Icon size={20} className={tone} />
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-bold text-brand-600 mb-4">
              Personal Profile Status
            </h3>
            <div className="flex items-center justify-between">
              <span
                className={`rounded-full px-4 py-1.5 text-base font-medium ${
                  status === 'complete'
                    ? 'text-[#006c49] bg-emerald-100'
                    : 'text-[#434655] bg-[#dce9ff]'
                }`}
              >
                {status === 'complete'
                  ? 'Completed'
                  : status === 'in_progress'
                    ? 'In progress'
                    : 'Not started'}
              </span>
              <span className="text-lg text-[#434655]">{position}</span>
            </div>
          </section>

          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-[#006c49] mb-3">
              Your Information
            </h3>
            <div className="flex flex-col gap-3">
              {INFO_PARAGRAPHS.map((p) => (
                <p key={p} className="text-base text-[#494453]">
                  {p}
                </p>
              ))}
            </div>
          </section>

          <section className="bg-[#ffddb8] border border-orange-300 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb size={18} className="text-[#2a1700]" />
              <h3 className="text-base font-bold text-[#2a1700]">Need Help?</h3>
            </div>
            <div className="flex flex-col gap-4">
              {HELP_PARAGRAPHS.map((p) => (
                <p key={p} className="text-base text-[#854d0e]">
                  {p}
                </p>
              ))}
            </div>
          </section>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-4 py-3 text-sm"
        >
          <TriangleAlert size={16} className="shrink-0 mt-0.5" />
          <span>{error.message}</span>
        </div>
      )}

      <ProfileSectionFooter {...section} />
    </div>
  );
}
