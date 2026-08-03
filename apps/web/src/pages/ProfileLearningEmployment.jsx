import {
  LayoutDashboard,
  User,
  NotebookPen,
  CalendarDays,
  Search,
  HelpCircle,
  Lock,
  Settings,
  Flower2,
  GraduationCap,
  Briefcase,
  HandHeart,
  Coffee,
  Ban,
  Check,
  Lightbulb,
  ArrowLeft,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useRoleNav } from '../navigation/useRoleNav';
import { PARTICIPANT_PATHS } from '../routes/paths';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'My Profile', icon: User },
  { label: 'Daily Log', icon: NotebookPen },
  { label: 'Monthly Snapshot', icon: CalendarDays },
  { label: 'Browse Directory', icon: Search },
];

const BOTTOM_ITEMS = [
  { label: 'Help Centre', icon: HelpCircle },
  { label: 'Privacy & Sharing', icon: Lock },
];

const SITUATIONS = [
  { label: 'Studying', helper: 'Full-time or part-time', icon: GraduationCap, selected: false },
  { label: 'Working', helper: 'Paid employment', icon: Briefcase, selected: true },
  { label: 'Looking for work', helper: 'Actively searching', icon: Search, selected: false },
  { label: 'Volunteering', helper: 'Unpaid community work', icon: HandHeart, selected: false },
  { label: 'Retired', helper: 'Finished professional life', icon: Coffee, selected: false },
  { label: 'Exploring options', helper: 'None of the above', icon: Ban, selected: false },
];

const GOALS_PLACEHOLDER = [
  'Complete a course',
  'Find a part-time job',
  'Gain confidence at work',
  'Improve my reading or computer skills',
  'Volunteer in my community',
];

const SUPPORT_CHIPS = [
  { label: 'Finding Employment', selected: true },
  { label: 'Interview Preparation', selected: false },
  { label: 'Workplace Adjustments', selected: false },
  { label: 'Study Support', selected: true },
  { label: 'Training', selected: false },
  { label: 'Career Planning', selected: false },
  { label: 'Building Confidence', selected: false },
  { label: 'Time Management', selected: false },
  { label: 'Travel to Work', selected: false },
  { label: 'Volunteering', selected: false },
  { label: 'Digital Skills', selected: false },
  { label: 'Other', selected: false },
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

function NavItem({ icon: Icon, label, active, small }) {
  const go = useRoleNav('participant');
  return (
    <button
      onClick={() => go(label)}
      className={`w-full flex items-center gap-3 px-4 text-left rounded-full transition-colors ${
        small ? 'py-2 text-xs font-bold' : 'py-3 text-sm'
      } ${
        active
          ? 'bg-purple-600/30 text-brand-700 font-bold'
          : 'text-[#4d4354] hover:bg-slate-100'
      }`}
    >
      <Icon size={small ? 15 : 17} className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}

function SituationTile({ icon: Icon, label, helper, selected }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center text-center gap-2 rounded-xl border px-4 py-7 ${
        selected ? 'bg-brand-600/10 border-brand-600 border-2' : 'bg-white border-slate-300'
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
    </div>
  );
}

function SupportChip({ label, selected }) {
  return (
    <button
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
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex bg-[#f8f9ff] font-sans text-slate-800">
      <aside className="w-64 shrink-0 bg-[#f8f9ff]/70 backdrop-blur-sm border-r border-slate-100 flex flex-col py-6 px-6">
        <div className="flex items-center gap-3 mb-10 px-1">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-600 to-purple-500 shadow flex items-center justify-center shrink-0">
            <Flower2 size={20} className="text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-brand-600 leading-none">TMG180</div>
            <div className="text-xs font-bold text-[#4d4354] mt-1">Participant Portal</div>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'My Profile'} />
          ))}
        </nav>

        <div className="mt-auto pt-6 flex flex-col gap-1">
          {BOTTOM_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} small />
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 bg-[#f8f9ff] border-b border-slate-200/70 flex items-center justify-end px-10">
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#434655] hover:bg-white transition-colors">
            <Settings size={20} />
          </button>
        </header>

        <main className="flex-1 px-10 py-8">
          <div className="max-w-236 flex flex-col gap-8">
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {SITUATIONS.map((s) => (
                      <SituationTile key={s.label} {...s} />
                    ))}
                  </div>
                </section>

                <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
                  <h2 className="text-2xl font-semibold text-[#0b1c30] mb-3">Your Goals</h2>
                  <p className="text-sm text-[#434655] mb-4">
                    What would you like to achieve over the next 12 months?
                  </p>
                  <div className="rounded-lg border border-slate-300 bg-white p-4 min-h-48">
                    <p className="text-base text-[#6b7280]">For example:</p>
                    <ul className="mt-1 flex flex-col gap-1.5">
                      {GOALS_PLACEHOLDER.map((g) => (
                        <li key={g} className="flex items-start gap-2 text-base text-[#6b7280]">
                          <span className="mt-2 w-1 h-1 rounded-full bg-[#6b7280] shrink-0" />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
                  <h2 className="text-2xl font-semibold text-[#0b1c30] mb-3">
                    Support I'd Like
                  </h2>
                  <p className="text-base text-[#434655] mb-5">
                    Select any areas where you'd like additional support.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {SUPPORT_CHIPS.map((c) => (
                      <SupportChip key={c.label} {...c} />
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
                  <div className="rounded-lg border border-slate-300 bg-white p-4 min-h-36">
                    <p className="text-base text-[#6b7280]">
                      Tell us about any skills, qualifications, strengths or interests
                      you'd like to develop.
                    </p>
                  </div>
                </section>
              </div>

              <div className="flex flex-col gap-6">
                <section className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-bold text-brand-600 mb-4">
                    Personal Profile Status
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="bg-[#dce9ff] rounded-full px-4 py-1.5 text-base font-medium text-[#434655]">
                      In progress
                    </span>
                    <span className="text-lg text-[#434655]">08/11</span>
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

            <div className="border-t border-slate-200 pt-8 flex items-center justify-between">
              <button onClick={() => navigate(PARTICIPANT_PATHS.profileSelfCare)} className="flex items-center gap-2 px-4 py-3 text-base text-[#434655] hover:text-[#0b1c30] transition-colors">
                <ArrowLeft size={16} />
                Previous
              </button>
              <button onClick={() => navigate(PARTICIPANT_PATHS.profileHealthWellbeing)} className="rounded-lg bg-brand-600 px-10 py-3 text-base font-semibold text-white hover:bg-brand-700 transition-colors">
                Continue
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
