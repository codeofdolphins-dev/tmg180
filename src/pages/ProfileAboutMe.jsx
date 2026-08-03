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
  UserPen,
  ChevronDown,
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

function NavItem({ icon: Icon, label, active, small }) {
  const go = useRoleNav('participant');
  const tone = small
    ? 'py-2 text-xs font-bold text-[#4d4354] hover:bg-slate-100'
    : active
      ? 'py-2.5 text-sm bg-purple-600/30 text-[#7800ce] font-bold'
      : 'py-2.5 text-sm text-[#4d4354] hover:bg-slate-100';
  return (
    <button
      onClick={() => go(label)}
      className={`w-full flex items-center gap-3 px-4 text-left rounded-full transition-colors ${tone}`}
    >
      <Icon size={16} className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}

export default function ProfileAboutMe() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex bg-[#fbfbff] font-sans text-slate-800">
      <aside className="w-64 shrink-0 bg-[#f8f9ff]/70 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col py-6 px-6">
        <div className="flex items-center gap-3 mb-10 px-1">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#7800ce] to-purple-400 shadow flex items-center justify-center shrink-0">
            <Flower2 size={20} className="text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#7800ce] leading-tight">TMG180</div>
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

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 shrink-0 bg-[#f8f9ff] border-b border-slate-200/70 flex items-center justify-end px-10">
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#434655] hover:bg-white/80 transition-colors">
            <Settings size={20} />
          </button>
        </header>

        <main className="flex-1 px-10 py-8">
          <div className="max-w-238 flex flex-col gap-8">
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
                      <label className="text-base text-[#434655]">Preferred Name</label>
                      <div className="h-12 flex items-center bg-white border border-slate-300 rounded-xl px-4">
                        <span className="text-[13px] text-[#6b7280]">
                          What would you like us to call you?
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-base text-[#434655]">Pronouns</label>
                      <div className="h-12 flex items-center justify-between bg-white border border-slate-300 rounded-xl px-4">
                        <span className="text-sm text-[#0b1c30]">
                          Choose if you'd like to share
                        </span>
                        <ChevronDown size={18} className="text-[#434655] shrink-0" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-base text-[#434655]">Tell us about yourself</label>
                    <div className="h-36.5 bg-white border border-slate-300 rounded-xl p-4">
                      <p className="text-[13px] text-[#6b7280] max-w-xl">
                        Share anything you'd like us to know about yourself, your interests,
                        strengths or what matters most to you.
                      </p>
                    </div>
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
                    <span className="text-base font-medium text-[#434655] bg-[#dce9ff] rounded-full px-4 py-1.5">
                      In progress
                    </span>
                    <span className="text-lg text-[#434655]">01/11</span>
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

            <div className="flex items-center justify-between pt-6">
              <button onClick={() => navigate(PARTICIPANT_PATHS.profile)} className="flex items-center gap-2 bg-white border border-slate-200 text-[#434655] text-base rounded-full px-8 py-3 hover:bg-slate-50 transition-colors">
                <ArrowLeft size={16} />
                Previous
              </button>
              <div className="flex items-center gap-4">
                <button onClick={() => navigate(PARTICIPANT_PATHS.profile)} className="bg-white border border-brand-200 text-[#7800ce] text-base rounded-full px-8 py-3 hover:bg-brand-50 transition-colors">
                  Save &amp; Exit
                </button>
                <button onClick={() => navigate(PARTICIPANT_PATHS.profileMyGoals)} className="flex items-center gap-2 bg-[#7800ce] text-white text-base rounded-full px-8 py-3 shadow-md hover:bg-brand-700 transition-colors">
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
