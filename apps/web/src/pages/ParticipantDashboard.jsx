import {
  LayoutDashboard,
  User,
  NotebookPen,
  CalendarDays,
  Search,
  HelpCircle,
  Lock,
  Settings,
  ArrowRight,
  TrendingUp,
  Files,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useRoleNav } from '../navigation/useRoleNav';
import { PARTICIPANT_PATHS } from '../routes/paths';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'My Profile', icon: User },
  { label: 'Daily Log', icon: NotebookPen },
  { label: 'Monthly Snapshot', icon: CalendarDays },
  { label: 'Verified Profiles Directory', icon: Search },
];

const BOTTOM_ITEMS = [
  { label: 'Help Centre', icon: HelpCircle },
  { label: 'Privacy & Sharing', icon: Lock },
];

const SNAPSHOT_BARS = [29, 43, 58, 48, 72, 82, 67];

function NavItem({ icon: Icon, label, active, wide }) {
  const go = useRoleNav('participant');
  return (
    <button
      onClick={() => go(label)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-full transition-colors ${
        wide ? 'text-base' : 'text-sm'
      } ${
        active
          ? 'bg-purple-600/30 text-brand-700 font-semibold'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={17} className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}

export default function ParticipantDashboard() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex bg-white font-sans text-slate-800">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-32 w-160 h-160 rounded-full bg-[#f0dbff] blur-3xl opacity-70" />
        <div className="absolute top-142 left-160 w-3xl h-192 rounded-full bg-[#d8e2ff] blur-3xl opacity-70" />
      </div>

      <aside className="relative w-64 shrink-0 bg-[#f8f9ff]/70 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col py-6 px-6">
        <div className="mb-10 px-2">
          <div className="text-2xl font-bold text-brand-600 leading-tight">TMG180</div>
          <div className="text-sm font-medium text-slate-500 mt-1">Participant Portal</div>
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'Dashboard'} />
          ))}
        </nav>

        <div className="mt-auto pt-6 flex flex-col gap-2">
          {BOTTOM_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} wide />
          ))}
        </div>
      </aside>

      <div className="relative flex-1 flex flex-col">
        <header className="flex items-center justify-end gap-3 px-10 py-5">
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-indigo-600 hover:bg-white/70 transition-colors">
            <Settings size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-600 to-purple-400 ring-2 ring-white shadow flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
        </header>

        <main className="flex-1 px-10 pb-16 pt-2">
          <div className="max-w-236 flex flex-col gap-16">
            <div>
              <h1 className="text-5xl font-bold text-slate-900">Welcome back, Alex.</h1>
              <p className="text-lg text-slate-500 mt-4 max-w-2xl leading-relaxed">
                This is your personal space to record your experiences, reflect on your
                progress, and build evidence over time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative flex flex-col bg-white/70 rounded-[48px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
                <div className="w-12 h-12 rounded-xl bg-[#ece8ff] flex items-center justify-center mb-5">
                  <User size={22} className="text-brand-600" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                  Personal Profile
                </h2>
                <p className="text-base text-slate-600 mb-4">Continue where you left off.</p>
                <span className="w-fit text-xs font-medium text-slate-600 bg-[#dce9ff] rounded-full px-3 py-1">
                  In progress
                </span>
                <div className="mt-auto pt-6">
                  <button
                    onClick={() => navigate(PARTICIPANT_PATHS.profile)}
                    className="w-full border border-[#004ac6] text-[#004ac6] text-base font-medium rounded-xl py-3 hover:bg-blue-50 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>

              <div className="relative overflow-hidden flex flex-col rounded-[48px] p-8 bg-linear-to-br from-purple-100 via-purple-50 to-white shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
                <div className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-[#7800ce] opacity-30 blur-2xl" />
                <div className="relative w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-5">
                  <NotebookPen size={22} className="text-brand-600" />
                </div>
                <h2 className="relative text-[32px] leading-tight font-semibold text-slate-900 mb-2">
                  Today's Daily Log
                </h2>
                <p className="relative text-base text-slate-600 mb-6">
                  Record today's support activities and experiences. These entries help build
                  your monthly support evidence over time.
                </p>
                <button
                  onClick={() => navigate(PARTICIPANT_PATHS.dailyLog)}
                  className="relative mt-auto w-fit flex items-center gap-2 bg-brand-600 text-white text-base font-medium rounded-xl px-6 py-3 hover:bg-brand-700 transition-colors"
                >
                  Start Check-in
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="relative flex flex-col rounded-[48px] p-8 bg-linear-to-br from-emerald-100 via-emerald-50 to-teal-50 shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
                <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center mb-4">
                  <TrendingUp size={18} className="text-emerald-700" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">Monthly Snapshot</h2>
                <p className="text-base text-slate-600 mb-6">
                  Review your monthly support summary before approving it.
                </p>
                <div className="mt-auto flex items-end gap-2 h-24.25">
                  {SNAPSHOT_BARS.map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-full bg-[#4edea3]"
                      style={{ height: `${height}px` }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative flex flex-col items-center text-center rounded-[48px] p-8 bg-linear-to-br from-rose-50 via-orange-50 to-purple-50 shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
                <div className="w-16 h-16 rounded-full bg-white/60 shadow-sm flex items-center justify-center mb-5">
                  <Files size={26} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                  Browse verified worker profiles
                </h2>
                <p className="text-base text-slate-600 mb-6 max-w-xs">
                  Use filters to find the right fit. You choose who to contact.
                </p>
                <button className="mt-auto w-full border border-[#004ac6] text-[#004ac6] text-base font-medium rounded-xl py-3 hover:bg-blue-50 transition-colors">
                  Browse Directory
                </button>
              </div>

              <div className="relative flex flex-col items-start gap-6 rounded-[48px] p-10 bg-linear-to-br from-rose-50 via-purple-50 to-rose-100 shadow-[0_8px_30px_rgb(0,0,0,0.05)] lg:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <NotebookPen size={22} className="text-rose-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                      Export Snapshot
                    </h2>
                    <p className="text-base text-slate-600 max-w-md">
                      Download or securely share approved monthly snapshots.
                    </p>
                  </div>
                </div>
                <button className="w-fit flex items-center gap-2 bg-brand-600 text-white text-base font-medium rounded-xl px-16 py-3 hover:bg-brand-700 transition-colors">
                  Export
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
