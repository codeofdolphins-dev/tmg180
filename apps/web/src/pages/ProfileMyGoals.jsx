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
  Plus,
  CircleCheck,
  Circle,
  Sparkle,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
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

const GOAL_EXAMPLES = [
  '• Becoming more independent at home',
  '• Finding a job',
  '• Travelling independently',
  '• Improving communication',
];

const YOUR_INFORMATION = [
  'Your Personal Profile belongs to you.',
  "Share only what you're comfortable sharing.",
  'You can save your progress and update it whenever you choose.',
];

const NEED_HELP = [
  "Start with one goal that's meaningful to you.",
  'Small steps are often the easiest way to make progress.',
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
          ? 'bg-purple-600/30 text-brand-700 font-semibold'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={small ? 15 : 17} className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}

export default function ProfileMyGoals() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex bg-[#f8f9ff] font-sans text-slate-800">
      <aside className="w-64 shrink-0 bg-[#f8f9ff]/70 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col py-6 px-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-600 to-purple-400 shadow flex items-center justify-center shrink-0">
            <Flower2 size={20} className="text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-brand-600 leading-tight">TMG180</div>
            <div className="text-xs font-bold text-slate-500 mt-1">Participant Portal</div>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'My Profile'} />
          ))}
        </nav>

        <div className="mt-auto pt-6 flex flex-col gap-2">
          {BOTTOM_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} small />
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-end px-10 py-3.5">
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:bg-white/70 transition-colors">
            <Settings size={20} />
          </button>
        </header>

        <main className="flex-1 px-10 pb-12 pt-4">
          <div className="max-w-238 flex flex-col gap-6">
            <div>
              <h1 className="text-[32px] font-semibold text-slate-900">My Goals</h1>
              <p className="text-base text-slate-600 mt-2 max-w-2xl">
                Tell us about the goals that are important to you and what you would like to
                work towards. Your goals can change over time, and you can update them
                whenever you need.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_301px] gap-6 items-start">
              <div className="flex flex-col gap-6">
                <div className="bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="text-sm font-medium text-slate-600 tracking-wide">
                    Primary Aspiration
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-900 mt-2 mb-4">
                    What are you currently working towards?
                  </h2>
                  <div className="bg-white border border-slate-300 rounded-lg p-4 h-58 text-base text-gray-500">
                    <p>For example:</p>
                    {GOAL_EXAMPLES.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>

                <div className="bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-slate-900">
                      Steps Towards My Goal
                    </h2>
                    <button className="flex items-center gap-1 text-base text-brand-600 hover:text-brand-700 transition-colors">
                      <Plus size={12} className="shrink-0" />
                      + Add another step
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg px-4 py-3">
                      <CircleCheck size={20} className="text-emerald-600 shrink-0" />
                      <div className="flex-1 rounded-lg px-3 py-2 text-base text-slate-900">
                        Complete introductory module
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg px-4 py-3">
                      <Circle size={20} className="text-slate-300 shrink-0" />
                      <div className="flex-1 rounded-lg px-3 py-2 text-base text-gray-500">
                        Enter your next step...
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden bg-[#0b1c30] rounded-2xl p-8">
                  <Sparkle
                    size={150}
                    className="absolute -right-4 top-8 text-white/10"
                    strokeWidth={1}
                  />
                  <h2 className="relative text-2xl font-semibold text-white">Remember</h2>
                  <p className="relative text-base text-[#b4c5ff] mt-2">
                    Goals can change over time.
                    <br />
                    Update this section whenever your priorities change.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="text-sm font-bold text-brand-600 tracking-wide">
                    Personal Profile Status
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-base font-medium text-slate-600 bg-[#dce9ff] rounded-full px-4 py-1.5">
                      In progress
                    </span>
                    <span className="text-lg text-slate-600">02/11</span>
                  </div>
                </div>

                <div className="bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h3 className="text-base font-bold text-[#006c49] mb-3">Your Information</h3>
                  <div className="flex flex-col gap-4">
                    {YOUR_INFORMATION.map((line) => (
                      <p key={line} className="text-base text-slate-600">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-[#ffddb8] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Lightbulb size={18} className="text-[#2a1700] shrink-0" />
                    <h3 className="text-base font-bold text-[#2a1700]">Need Help?</h3>
                  </div>
                  <div className="flex flex-col gap-1">
                    {NEED_HELP.map((line) => (
                      <p key={line} className="text-sm italic text-[#653e00]">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-8 flex items-center justify-between">
              <button onClick={() => navigate(PARTICIPANT_PATHS.profileAboutMe)} className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-8 py-3 text-base text-slate-600 hover:bg-slate-50 transition-colors">
                <ArrowLeft size={16} />
                Previous
              </button>
              <div className="flex items-center gap-4">
                <button onClick={() => navigate(PARTICIPANT_PATHS.profile)} className="bg-white border border-brand-200 rounded-full px-8 py-3 text-base text-brand-600 hover:bg-purple-50 transition-colors">
                  Save &amp; Exit
                </button>
                <button onClick={() => navigate(PARTICIPANT_PATHS.profileDailyLiving)} className="flex items-center gap-2 bg-brand-600 rounded-full px-8 py-3 text-base text-white hover:bg-brand-700 transition-colors">
                  Save &amp; Continue
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
