import {
  ContactRound,
  Phone,
  Heart,
  ChevronDown,
  Lightbulb,
  TriangleAlert,
} from 'lucide-react';

import ProfileSectionFooter from '../components/ProfileSectionFooter';
import { toggleInList, useSectionForm } from '../hooks/profile';

const SAFE_PLACEHOLDER =
  'For example: Speak calmly, give me extra time to respond, avoid crowded spaces, or contact a trusted person.';

/** Values match the things_to_avoid options in @tmg180/shared. */
const AVOID_CHIPS = [
  { value: 'loud_noises', label: 'Loud Noises' },
  { value: 'bright_lights', label: 'Bright Lights' },
  { value: 'crowded_spaces', label: 'Crowded Spaces' },
  { value: 'physical_touch', label: 'Physical Touch' },
  { value: 'strong_smells', label: 'Strong Smells' },
  { value: 'sudden_changes', label: 'Sudden Changes' },
  { value: 'other', label: 'Other' },
];

const AVAILABLE_OPTIONS = [
  { value: 'anytime', label: 'Anytime (24/7)' },
  { value: 'business_hours', label: 'Business hours' },
  { value: 'evenings', label: 'Evenings' },
  { value: 'weekends', label: 'Weekends' },
];

const INFO_PARAGRAPHS = [
  'Your safety and support information belongs to you.',
  "Share only what you're comfortable sharing.",
  'You can update this information whenever your support needs or emergency contacts change.',
];

const HELP_PARAGRAPHS = [
  'There are no right or wrong answers.',
  'Tell us what helps you feel safe and supported.',
  'You can update this information whenever your preferences change.',
];

function InputField({ label, placeholder, ...field }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={field.name} className="text-base text-[#0b1c30]">
        {label}
      </label>
      <input
        id={field.name}
        type="text"
        placeholder={placeholder}
        className="rounded-lg border border-slate-300 bg-white px-4 py-3.5 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-brand-600 transition-colors"
        {...field}
      />
    </div>
  );
}

export default function ProfileSafetySupport() {
  const section = useSectionForm('safety-support');
  const { status, position, error } = section;
  const { register, watch, setValue } = section.form;
  const avoid = watch('things_to_avoid') ?? [];

  return (
    <div className="max-w-236 mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] leading-10 font-semibold text-[#0b1c30]">
          Safety &amp; Support
        </h1>
        <p className="text-base text-[#434655] max-w-2xl">
          Tell us how you prefer to be supported, what helps you feel safe, and who we
          should contact if needed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="flex flex-col gap-8">
          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <ContactRound size={24} className="text-brand-600 shrink-0" />
              <h2 className="text-2xl font-semibold text-[#0b1c30]">
                Emergency Contact
              </h2>
            </div>
            <div className="flex flex-col gap-6">
              <InputField
                label="Full Name"
                placeholder="e.g. Sarah Johnson"
                {...register('contact_name')}
              />
              <InputField
                label="Relationship"
                placeholder="e.g. Spouse, Parent, Friend"
                {...register('contact_relationship')}
              />
            </div>
          </section>

          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <Phone size={22} className="text-brand-600 shrink-0" />
              <h2 className="text-2xl font-semibold text-[#0b1c30]">
                Contact Details
              </h2>
            </div>
            <div className="flex flex-col gap-6">
              <InputField
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                {...register('contact_phone')}
              />
              <div className="flex flex-col gap-2">
                <label htmlFor="contact_available" className="text-base text-[#0b1c30]">
                  Available Times
                </label>
                <div className="relative">
                  <select
                    id="contact_available"
                    className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-3.5 pr-10 text-base text-[#0b1c30] outline-none focus:border-brand-600 transition-colors"
                    {...register('contact_available')}
                  >
                    <option value="">Choose when they can be reached</option>
                    {AVAILABLE_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#434655] pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-200">
              <Heart size={24} className="text-brand-600 shrink-0" />
              <h2 className="text-2xl font-semibold text-[#0b1c30]">
                Support Preferences
              </h2>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="feels_safe" className="text-base text-[#0b1c30]">
                  What helps you feel safe and supported during difficult moments?
                </label>
                <textarea
                  id="feels_safe"
                  placeholder={SAFE_PLACEHOLDER}
                  className="rounded-lg border border-slate-300 bg-white p-4 min-h-32 resize-none text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-brand-600 transition-colors"
                  {...register('feels_safe')}
                />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-base text-[#0b1c30]">Things to Avoid (Optional)</p>
                <div className="flex flex-wrap gap-3">
                  {AVOID_CHIPS.map(({ value, label }) => {
                    const selected = avoid.includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setValue('things_to_avoid', toggleInList(avoid, value), {
                            shouldDirty: true,
                          })
                        }
                        className={`rounded-lg px-4 py-2.5 text-base transition-colors ${
                          selected
                            ? 'bg-brand-600 text-white'
                            : 'bg-[#e4e7f2] text-[#0b1c30] hover:bg-[#d8dcec]'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
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
                <p key={p} className="text-base text-[#434655]">
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
