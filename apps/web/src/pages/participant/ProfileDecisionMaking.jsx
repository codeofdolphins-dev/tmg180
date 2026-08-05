import {
  Users,
  PersonStanding,
  Lightbulb,
  Check,
  TriangleAlert,
} from 'lucide-react';

import ProfileSectionFooter from '../../components/participant/ProfileSectionFooter';
import { toggleInList, useSectionForm } from '../../hooks/participant/profile';

const DECISIONS_PLACEHOLDER =
  'For example: I like time to think, written information, talking things through with someone I trust, or seeing all my options.';

const ANYTHING_ELSE_PLACEHOLDER =
  'Tell us anything else that helps you feel confident when making choices.';

/** Values match the involved_in_decisions options in @tmg180/shared. */
const INVOLVED_OPTIONS = [
  { value: 'my_family', label: 'My Family' },
  { value: 'legal_guardian', label: 'Legal Guardian' },
  { value: 'close_friends', label: 'Close Friends' },
  { value: 'care_coordinator', label: 'My Care Coordinator' },
];

/** Values match the decision_values options in @tmg180/shared. */
const PREFERENCE_CHIPS = [
  { value: 'speed', label: 'Speed' },
  { value: 'having_all_details', label: 'Having all details' },
  { value: 'quiet_reflection', label: 'Quiet reflection' },
  { value: 'expert_advice', label: 'Expert advice' },
  { value: 'family_consensus', label: 'Family consensus' },
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

export default function ProfileDecisionMaking() {
  const section = useSectionForm('decision-making');
  const { status, position, error } = section;
  const { register, watch, setValue } = section.form;
  const involved = watch('involved_in_decisions') ?? [];
  const values = watch('decision_values') ?? [];

  return (
    <div className="max-w-236 mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] leading-10 font-semibold text-[#0b1c30]">
          Decision Making
        </h1>
        <p className="text-base text-[#434655] max-w-2xl">
          Help us understand how you like to make choices and who you'd like to
          support you in your journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="flex flex-col gap-8">
          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-600/10 flex items-center justify-center shrink-0">
                <Users size={20} className="text-brand-600" />
              </div>
              <h2 className="text-2xl font-semibold text-[#0b1c30]">
                Decision Support
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="decision_helps" className="text-sm font-medium text-[#434655]">
                  What helps you make important decisions?
                </label>
                <textarea
                  id="decision_helps"
                  placeholder={DECISIONS_PLACEHOLDER}
                  className="rounded-lg border border-slate-300 bg-white p-4 min-h-26.5 resize-none text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-brand-600 transition-colors"
                  {...register('decision_helps')}
                />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-[#434655]">
                  Who should be involved in big decisions?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {INVOLVED_OPTIONS.map(({ value, label }) => {
                    const checked = involved.includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={checked}
                        onClick={() =>
                          setValue('involved_in_decisions', toggleInList(involved, value), {
                            shouldDirty: true,
                          })
                        }
                        className={`flex items-center gap-3 rounded-lg border px-4 py-4 text-left transition-colors ${
                          checked
                            ? 'border-brand-600 bg-brand-600/5'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`w-4.5 h-4.5 rounded-sm shrink-0 flex items-center justify-center ${
                            checked ? 'bg-brand-600' : 'border border-slate-400 bg-white'
                          }`}
                        >
                          {checked && <Check size={12} strokeWidth={3} className="text-white" />}
                        </span>
                        <span className="text-base text-[#0b1c30]">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-600/10 flex items-center justify-center shrink-0">
                <PersonStanding size={20} className="text-brand-600" />
              </div>
              <h2 className="text-2xl font-semibold text-[#0b1c30]">
                Decision Preferences
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-[#434655]">
                  When making a choice, I value:
                </p>
                <div className="flex flex-wrap gap-3">
                  {PREFERENCE_CHIPS.map(({ value, label }) => {
                    const selected = values.includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setValue('decision_values', toggleInList(values, value), {
                            shouldDirty: true,
                          })
                        }
                        className={`rounded-full px-5 py-2.5 text-base transition-colors ${
                          selected
                            ? 'bg-brand-600 text-white hover:bg-brand-700'
                            : 'bg-white border border-slate-300 text-[#434655] hover:bg-slate-50'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="decision_notes" className="text-sm font-medium text-[#434655]">
                  Is there anything else that helps you make decisions?
                </label>
                <textarea
                  id="decision_notes"
                  placeholder={ANYTHING_ELSE_PLACEHOLDER}
                  className="rounded-lg border border-slate-300 bg-white p-4 min-h-26.5 resize-none text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-brand-600 transition-colors"
                  {...register('decision_notes')}
                />
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
                    ? 'bg-[#c3f3d7] text-[#05603a]'
                    : 'bg-[#dce9ff] text-[#434655]'
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

      {/* Last section: continue lands back on the hub (was a dead "Next Step" — W-06). */}
      <ProfileSectionFooter {...section} continueLabel="Save & Finish" />
    </div>
  );
}
