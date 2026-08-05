import {
  Search,
  GraduationCap,
  Briefcase,
  HandHeart,
  Coffee,
  Ban,
  Check,
  Lightbulb,
  TriangleAlert,
} from 'lucide-react';

import ProfileSectionFooter from '../../components/participant/ProfileSectionFooter';
import { toggleInList, useSectionForm } from '../../hooks/participant/profile';

/** Values match the current_situation options in @tmg180/shared. */
const SITUATIONS = [
  { value: 'studying', label: 'Studying', helper: 'Full-time or part-time', icon: GraduationCap },
  { value: 'working', label: 'Working', helper: 'Paid employment', icon: Briefcase },
  { value: 'looking_for_work', label: 'Looking for work', helper: 'Actively searching', icon: Search },
  { value: 'volunteering', label: 'Volunteering', helper: 'Unpaid community work', icon: HandHeart },
  { value: 'retired', label: 'Retired', helper: 'Finished professional life', icon: Coffee },
  { value: 'exploring_options', label: 'Exploring options', helper: 'None of the above', icon: Ban },
];

const GOALS_PLACEHOLDER = [
  'For example:',
  '• Complete a course',
  '• Find a part-time job',
  '• Gain confidence at work',
  '• Improve my reading or computer skills',
  '• Volunteer in my community',
].join('\n');

/** Values match the support_wanted options in @tmg180/shared. */
const SUPPORT_CHIPS = [
  { value: 'finding_employment', label: 'Finding Employment' },
  { value: 'interview_preparation', label: 'Interview Preparation' },
  { value: 'workplace_adjustments', label: 'Workplace Adjustments' },
  { value: 'study_support', label: 'Study Support' },
  { value: 'training', label: 'Training' },
  { value: 'career_planning', label: 'Career Planning' },
  { value: 'building_confidence', label: 'Building Confidence' },
  { value: 'time_management', label: 'Time Management' },
  { value: 'travel_to_work', label: 'Travel to Work' },
  { value: 'volunteering', label: 'Volunteering' },
  { value: 'digital_skills', label: 'Digital Skills' },
  { value: 'other', label: 'Other' },
];

const INFO_PARAGRAPHS = [
  'Your learning and employment information is private.',
  "Share only what you're comfortable sharing.",
  'You can update this section whenever your goals or circumstances change.',
];

const HELP_PARAGRAPHS = [
  'There are no right or wrong answers.',
  "Share only what you're comfortable sharing.",
  'You can update this information anytime.',
];

function SituationTile({ icon: Icon, label, helper, selected, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`relative flex flex-col items-center justify-center text-center gap-2 rounded-xl border px-4 py-7 transition-colors ${
        selected ? 'bg-brand-600/10 border-brand-600 border-2' : 'bg-white border-slate-300 hover:bg-slate-50'
      }`}
    >
      {selected && (
        <span className="absolute top-3 right-3 w-5.5 h-5.5 rounded-full bg-brand-600 flex items-center justify-center">
          <Check size={12} strokeWidth={3} className="text-white" />
        </span>
      )}
      <Icon size={28} className="text-brand-600" />
      <p className="text-base font-bold text-[#0b1c30]">{label}</p>
      <p className="text-sm text-[#434655]">{helper}</p>
    </button>
  );
}

function SupportChip({ label, selected, onToggle }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors ${
        selected
          ? 'bg-brand-600 text-white font-semibold'
          : 'border border-slate-300 bg-white text-[#0b1c30] hover:bg-slate-50'
      }`}
    >
      {label}
      {selected && <Check size={14} strokeWidth={3} className="shrink-0" />}
    </button>
  );
}

export default function ProfileLearningEmployment() {
  const section = useSectionForm('learning-employment');
  const { status, position, error } = section;
  const { register, watch, setValue } = section.form;
  const situation = watch('current_situation') ?? '';
  const support = watch('support_wanted') ?? [];

  return (
    <div className="max-w-236 mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] leading-10 font-semibold text-[#0b1c30]">
          Learning &amp; Employment
        </h1>
        <p className="text-base text-[#434655] max-w-2xl">
          Tell us about your learning, work or volunteering, and any support that
          helps you achieve your education or employment goals. You can update this
          information whenever your circumstances change.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="flex flex-col gap-6">
          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-[#0b1c30] mb-3">
              Current Situation
            </h2>
            <p className="text-sm text-[#434655] mb-5">
              Select the option that best describes your current situation.
            </p>
            <div role="radiogroup" aria-label="Current situation" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SITUATIONS.map(({ value, label, helper, icon }) => (
                <SituationTile
                  key={value}
                  icon={icon}
                  label={label}
                  helper={helper}
                  selected={situation === value}
                  onSelect={() =>
                    setValue('current_situation', situation === value ? '' : value, {
                      shouldDirty: true,
                    })
                  }
                />
              ))}
            </div>
          </section>

          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-[#0b1c30] mb-3">Your Goals</h2>
            <p className="text-sm text-[#434655] mb-4">
              What would you like to achieve over the next 12 months?
            </p>
            <textarea
              aria-label="What would you like to achieve over the next 12 months?"
              placeholder={GOALS_PLACEHOLDER}
              className="w-full rounded-lg border border-slate-300 bg-white p-4 min-h-48 resize-none text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-brand-600 transition-colors"
              {...register('next_12_months')}
            />
          </section>

          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-[#0b1c30] mb-3">
              Support I'd Like
            </h2>
            <p className="text-base text-[#434655] mb-5">
              Select any areas where you'd like additional support.
            </p>
            <div className="flex flex-wrap gap-3">
              {SUPPORT_CHIPS.map(({ value, label }) => (
                <SupportChip
                  key={value}
                  label={label}
                  selected={support.includes(value)}
                  onToggle={() =>
                    setValue('support_wanted', toggleInList(support, value), {
                      shouldDirty: true,
                    })
                  }
                />
              ))}
            </div>
          </section>

          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-[#0b1c30] mb-3">
              Skills I'd Like to Develop
            </h2>
            <p className="text-base text-[#434655] mb-4">
              Tell us about any skills, qualifications or interests you'd like to
              develop.
            </p>
            <textarea
              aria-label="Skills you'd like to develop"
              placeholder="Tell us about any skills, qualifications, strengths or interests you'd like to develop."
              className="w-full rounded-lg border border-slate-300 bg-white p-4 min-h-36 resize-none text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-brand-600 transition-colors"
              {...register('skills_to_develop')}
            />
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
                <p key={p} className="text-sm text-[#653e00]">
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
