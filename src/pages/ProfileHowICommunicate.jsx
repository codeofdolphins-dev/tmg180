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
  Speech,
  BrainCog,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Mail,
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

const COMM_METHODS = [
  {
    title: 'Verbal Speech',
    description: 'I prefer speaking out loud and phone calls.',
    selected: true,
  },
  {
    title: 'Text-Based',
    description: 'I prefer messaging, emails, or chat.',
    selected: false,
  },
  {
    title: 'Sign Language',
    description: 'ASL, BSL, or other manual languages.',
    selected: false,
  },
  {
    title: 'AAC Tools',
    description: 'Communication boards or digital apps.',
    selected: false,
  },
];

const YOUR_INFORMATION = [
  'Your communication preferences belong to you.',
  "Share only what you're comfortable sharing.",
  'You can update this information whenever your communication needs or preferences change.',
];

const NEED_HELP = [
  'here are no right or wrong answers.',
  'Tell us what helps communication work well for you.',
  'You can update this information whenever your preferences change.',
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

function MethodOption({ title, description, selected }) {
  return (
    <button
      className={`flex items-start gap-3 rounded-xl p-4 text-left transition-colors ${
        selected
          ? 'bg-purple-600/10 border border-brand-600'
          : 'bg-white border border-slate-200 hover:bg-slate-50'
      }`}
    >
      {selected ? (
        <span className="mt-1 w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
          <span className="w-2 h-2 rounded-full bg-white" />
        </span>
      ) : (
        <span className="mt-1 w-5 h-5 rounded-full border-2 border-slate-300 bg-white shrink-0" />
      )}
      <span>
        <span className="block text-base font-bold text-slate-900">{title}</span>
        <span className="block text-base text-slate-800">{description}</span>
      </span>
    </button>
  );
}

export default function ProfileHowICommunicate() {
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
              <h1 className="text-[32px] font-semibold text-slate-900">Communication</h1>
              <p className="text-base text-slate-600 mt-2 max-w-2xl">
                Tell us how you prefer to communicate and anything that helps conversations
                feel comfortable and easy for you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_301px] gap-6 items-start">
              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="flex items-center gap-3 mb-6">
                    <Speech size={22} className="text-brand-600 shrink-0" />
                    <h2 className="text-2xl font-semibold text-slate-900">
                      Preferred Communication
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {COMM_METHODS.map((m) => (
                      <MethodOption key={m.title} {...m} />
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="flex items-center gap-3 mb-6">
                    <BrainCog size={22} className="text-brand-600 shrink-0" />
                    <h2 className="text-2xl font-semibold text-slate-900">
                      Communication Preferences
                    </h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-slate-600 tracking-wide">
                        Tell us what helps communication work well for you.
                      </label>
                      <div className="bg-white border border-slate-300 rounded-xl p-4 h-62.5 text-base text-gray-500">
                        <p>For example:</p>
                        <p className="mt-6">• Give me extra time to respond.</p>
                        <p>• Use simple, direct language.</p>
                        <p>• Speak slowly.</p>
                        <p>• Write things down if needed.</p>
                        <p>• Reduce background noise.</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-slate-600 tracking-wide">
                        Additional Communication Needs
                      </label>
                      <div className="bg-white border border-slate-300 rounded-xl px-4 py-3 text-base text-gray-500">
                        Sensory preferences, topics to avoid, etc.
                      </div>
                    </div>
                  </div>
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
                    <span className="text-lg text-slate-600">05/11</span>
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
                  <div className="flex flex-col gap-4">
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
              <button onClick={() => navigate(PARTICIPANT_PATHS.profileMobilityAccess)} className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-8 py-3 text-base text-slate-600 hover:bg-slate-50 transition-colors">
                <ArrowLeft size={16} />
                Previous
              </button>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-6 py-3 text-base font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  <Mail size={18} />
                  Save Draft
                </button>
                <button className="flex items-center gap-2 bg-brand-600 rounded-xl px-10 py-3 text-base font-bold text-white hover:bg-brand-700 transition-colors">
                  Next Step
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
