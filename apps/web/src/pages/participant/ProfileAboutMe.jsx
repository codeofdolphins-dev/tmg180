import { UserPen, ChevronDown, Lightbulb, TriangleAlert } from 'lucide-react';

import ProfileSectionFooter from '../../components/participant/ProfileSectionFooter';
import { useSectionForm } from '../../hooks/participant/profile';

const YOUR_INFORMATION_LINES = [
  'Your Personal Profile belongs to you.',
  "Share only what you're comfortable sharing.",
  'You can save your progress and update it whenever you choose.',
];

const NEED_HELP_LINES = [
  'here are no right or wrong answers.',
  "Share only what you're feel comfortable sharing.",
  'You can save your progress and return later.',
];

/** Values match the pronouns options in @tmg180/shared profile definitions. */
const PRONOUN_OPTIONS = [
  { value: 'she-her', label: 'She/Her' },
  { value: 'he-him', label: 'He/Him' },
  { value: 'they-them', label: 'They/Them' },
  { value: 'self-describe', label: 'I use my own words' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export default function ProfileAboutMe() {
  const section = useSectionForm('about-me');
  const { status, position, error } = section;
  const { register } = section.form;

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-[32px] leading-10 font-semibold text-[#0b1c30]">About Me</h1>
              <p className="text-base text-[#434655]">
                Tell us a little about yourself, your strengths, interests and what is important to
                you.
              </p>
            </div>

            <div className="grid grid-cols-[1fr_301px] gap-6 items-start">
              <div className="flex flex-col gap-8">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                    <UserPen size={19} className="text-[#7800ce]" />
                    <h2 className="text-2xl font-semibold text-[#0b1c30]">About You</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="preferred_name" className="text-base text-[#434655]">
                        Preferred Name
                      </label>
                      <input
                        id="preferred_name"
                        type="text"
                        placeholder="What would you like us to call you?"
                        className="h-12 bg-white border border-slate-300 rounded-xl px-4 text-sm text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-[#7800ce] transition-colors"
                        {...register('preferred_name')}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="pronouns" className="text-base text-[#434655]">
                        Pronouns
                      </label>
                      <div className="relative">
                        <select
                          id="pronouns"
                          className="w-full h-12 appearance-none bg-white border border-slate-300 rounded-xl px-4 pr-10 text-sm text-[#0b1c30] outline-none focus:border-[#7800ce] transition-colors"
                          {...register('pronouns')}
                        >
                          <option value="">Choose if you'd like to share</option>
                          {PRONOUN_OPTIONS.map(({ value, label }) => (
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
                  <div className="flex flex-col gap-2">
                    <label htmlFor="about_you" className="text-base text-[#434655]">
                      Tell us about yourself
                    </label>
                    <textarea
                      id="about_you"
                      placeholder="Share anything you'd like us to know about yourself, your interests, strengths or what matters most to you."
                      className="h-36.5 resize-none bg-white border border-slate-300 rounded-xl p-4 text-sm text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-[#7800ce] transition-colors"
                      {...register('about_you')}
                    />
                  </div>
                </div>

                <div className="bg-white/80 border border-slate-200 rounded-xl shadow-sm px-5 py-4 flex flex-col gap-2">
                  <h3 className="text-base font-bold text-[#006c49]">Why we ask this</h3>
                  <p className="text-base text-[#434655]">
                    The information you share helps build your Personal Profile and provides
                    context for your Daily Logs and Monthly Snapshots.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col gap-4">
                  <span className="text-sm font-bold text-[#7800ce]">Personal Profile Status</span>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-base font-medium rounded-full px-4 py-1.5 ${
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
                </div>

                <div className="bg-white/80 border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col gap-2">
                  <h3 className="text-base font-bold text-[#006c49]">Your Information</h3>
                  <div className="flex flex-col gap-5">
                    {YOUR_INFORMATION_LINES.map((line) => (
                      <p key={line} className="text-base text-[#434655]">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-[#ffddb8] rounded-2xl p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Lightbulb size={18} className="text-[#2a1700] shrink-0" />
                    <h3 className="text-base font-bold text-[#2a1700]">Need Help?</h3>
                  </div>
                  <div className="flex flex-col">
                    {NEED_HELP_LINES.map((line) => (
                      <p key={line} className="text-sm italic text-[#653e00] leading-5">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
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
