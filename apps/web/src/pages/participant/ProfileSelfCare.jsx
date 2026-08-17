import {
  Heart,
  Pill,
  MessageSquareText,
  Lightbulb,
  Check,
  TriangleAlert,
} from 'lucide-react';

import ProfileSectionFooter from '../../components/participant/ProfileSectionFooter';
import { toggleInList, useSectionForm } from '../../hooks/participant/profile';

/** Values match the personal_care / medication_routine options in @tmg180/shared. */
const PERSONAL_CARE_OPTIONS = [
  { value: 'showering', label: 'Showering' },
  { value: 'dressing', label: 'Dressing' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'eating', label: 'Eating' },
  { value: 'toileting', label: 'Toileting' },
  { value: 'oral_hygiene', label: 'Oral hygiene' },
];

const MEDICATION_OPTIONS = [
  { value: 'independent', label: 'Independent' },
  { value: 'reminders', label: 'Reminders' },
  { value: 'full_assistance', label: 'Full assistance' },
  { value: 'assistance_preparing', label: 'Assistance preparing medication' },
];

const INFO_PARAGRAPHS = [
  'Your self-care information belongs to you.',
  "Share only what you're comfortable sharing.",
  'You can update this information whenever your routines or support needs change.',
];

const HELP_PARAGRAPHS = [
  'There are no right or wrong answers.',
  'Tell us about the support you use in your daily self-care routine.',
  'You can update this information whenever things change.',
];

function CheckChip({ label, checked, onToggle }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onToggle}
      className={`flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-base transition-colors ${
        checked
          ? 'border-brand-600 bg-brand-600/10 text-[#0b1c30]'
          : 'border-slate-300 bg-white text-[#0b1c30] hover:bg-slate-50'
      }`}
    >
      <span
        className={`w-4.5 h-4.5 rounded shrink-0 flex items-center justify-center ${
          checked ? 'bg-brand-600' : 'border border-slate-400 bg-white'
        }`}
      >
        {checked && <Check size={12} strokeWidth={3} className="text-white" />}
      </span>
      {label}
    </button>
  );
}

export default function ProfileSelfCare() {
  const section = useSectionForm('self-care');
  const { status, position, error } = section;
  const { register, watch, setValue } = section.form;
  const personalCare = watch('personal_care') ?? [];
  const medication = watch('medication_routine') ?? [];

  return (
    <div className="max-w-236 mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#0b1c30]">
          Self-care
        </h1>
        <p className="text-base text-[#434655] max-w-2xl">
          Help us understand your values, goals, and the support that makes a
          difference in your life.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="flex flex-col gap-6">
          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-3">
              <Heart size={22} className="text-brand-600" />
              <h2 className="text-xl font-semibold text-[#0b1c30]">Personal Care</h2>
            </div>
            <p className="text-sm font-semibold text-[#0b1c30] mb-4">
              Tell us about your daily self-care routine and any support you use.
            </p>
            <div className="flex flex-wrap gap-3">
              {PERSONAL_CARE_OPTIONS.map(({ value, label }) => (
                <CheckChip
                  key={value}
                  label={label}
                  checked={personalCare.includes(value)}
                  onToggle={() =>
                    setValue('personal_care', toggleInList(personalCare, value), {
                      shouldDirty: true,
                    })
                  }
                />
              ))}
            </div>
          </section>

          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-3">
              <Pill size={22} className="text-brand-600" />
              <h2 className="text-xl font-semibold text-[#0b1c30]">
                Medication &amp; Health Routine
              </h2>
            </div>
            <p className="text-sm font-semibold text-[#0b1c30] mb-4">
              Do you need any support with medication or daily health routines?
            </p>
            <div className="flex flex-wrap gap-3 mb-5">
              {MEDICATION_OPTIONS.map(({ value, label }) => (
                <CheckChip
                  key={value}
                  label={label}
                  checked={medication.includes(value)}
                  onToggle={() =>
                    setValue('medication_routine', toggleInList(medication, value), {
                      shouldDirty: true,
                    })
                  }
                />
              ))}
            </div>
            <textarea
              aria-label="Tell us anything else that helps with your daily routine"
              placeholder="Tell us anything else that helps with your daily routine."
              className="w-full rounded-lg border border-slate-300 bg-white p-4 min-h-30 resize-none text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-brand-600 transition-colors"
              {...register('medication_notes')}
            />
          </section>

          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquareText size={22} className="text-brand-600" />
              <h2 className="text-xl font-semibold text-[#0b1c30]">Daily Supports</h2>
            </div>
            <p className="text-sm font-semibold text-[#0b1c30] mb-4">
              Are there any routines or equipment that help you with self-care?
            </p>
            <textarea
              aria-label="Routines or equipment that help you with self-care"
              placeholder="Shower chair, grab rails, reminder apps, adaptive equipment..."
              className="w-full rounded-lg border border-slate-300 bg-white p-4 min-h-30 resize-none text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-brand-600 transition-colors"
              {...register('daily_supports')}
            />
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-brand-600 mb-4">
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
            <h3 className="text-base font-semibold text-[#006c49] mb-3">
              Your Information
            </h3>
            <div className="flex flex-col gap-3">
              {INFO_PARAGRAPHS.map((p) => (
                <p key={p} className="text-base text-[#434655]">
                  {p}
                </p>
              ))}
            </div>
          </section>

          <section className="bg-[#ffddb8] border border-orange-300 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb size={18} className="text-[#2a1700]" />
              <h3 className="text-base font-semibold text-[#2a1700]">Need Help?</h3>
            </div>
            <div className="flex flex-col gap-4">
              {HELP_PARAGRAPHS.map((p) => (
                <p key={p} className="text-sm italic text-[#653e00]">
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
