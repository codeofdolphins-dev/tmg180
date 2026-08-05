import {
  LayoutDashboard,
  Calendar,
  Users,
  NotebookPen,
  TrendingUp,
  Folder,
  GraduationCap,
  Landmark,
  Settings,
  HelpCircle,
  Plus,
  Bell,
  ShieldCheck,
  ChevronDown,
  SlidersHorizontal,
  Lock,
  Eye,
} from 'lucide-react';

import { useRoleNav } from '../../navigation/useRoleNav';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Calendar', icon: Calendar },
  { label: 'Participants I support', icon: Users },
  { label: 'Daily Logs', icon: NotebookPen },
  { label: 'Monthly Snapshots', icon: TrendingUp, active: true },
  { label: 'Resources', icon: Folder },
  { label: 'Learning Hub', icon: GraduationCap },
  { label: 'Governance Standing', icon: Landmark },
];

const BOTTOM_ITEMS = [
  { label: 'Settings', icon: Settings },
  { label: 'Help Centre', icon: HelpCircle },
];

const FILTERS = [
  { label: 'Participant', value: 'All Accessible Participants', width: 'w-72' },
  { label: 'Month', value: 'October 2023', width: 'w-56' },
  { label: 'Status', value: 'Approved & Locked', width: 'w-56' },
];

const SNAPSHOTS = [
  {
    nameLines: ['Sarah', 'Jenkins'],
    initials: 'SJ',
    avatarTone: 'bg-[#f0dbff] text-[#7800ce]',
    monthLines: ['October 2023'],
    consentLevel: 'Full Shared',
    lastViewed: '2 days ago',
  },
  {
    nameLines: ['David', 'Thompson'],
    initials: 'DT',
    avatarTone: 'bg-[#d8e2ff] text-[#2170e4]',
    monthLines: ['October 2023'],
    consentLevel: 'Summary Only',
    lastViewed: 'Never',
  },
  {
    nameLines: ['Elena', 'Rodriguez'],
    initials: 'ER',
    avatarTone: 'bg-[#6ffbbe] text-[#005236]',
    monthLines: ['September', '2023'],
    consentLevel: 'Full Shared',
    lastViewed: '1 week ago',
  },
];

function NavItem({ icon: Icon, label, active }) {
  const go = useRoleNav('worker');
  return (
    <button
      onClick={() => go(label)}
      className={`w-full flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-full text-left transition-colors ${
        active
          ? 'bg-[#9333ea] text-[#f6e6ff]'
          : 'text-[#4d4354] hover:bg-white/70'
      }`}
    >
      <Icon size={17} />
      <span>{label}</span>
    </button>
  );
}

export default function ApprovedSnapshots() {
  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-800">
      <aside className="w-64 shrink-0 bg-[#eff4ff] flex flex-col p-6">
        <div className="mb-6">
          <div className="text-2xl font-bold text-[#7800ce] leading-tight">
            TMG180
          </div>
          <p className="text-sm font-medium text-[#4d4354] mt-0.5">
            Worker Portal
          </p>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-[#9333ea] text-[#f6e6ff] text-sm font-medium rounded-full py-3 mb-6 hover:bg-[#7e22ce] transition-colors">
          <Plus size={14} />
          New Entry
        </button>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </nav>

        <div className="mt-auto pt-4 flex flex-col gap-2 border-t border-[#dde5f5]">
          {BOTTOM_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 bg-[#f8f9ff]/80 flex items-center justify-end gap-4 px-10 shrink-0">
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#4d4354] hover:bg-white">
            <Bell size={18} />
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#4d4354] hover:bg-white">
            <Settings size={19} />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-[#7800ce]/30 bg-[#f0dbff] text-[#7800ce] text-xs font-bold flex items-center justify-center">
            AM
          </div>
        </header>

        <main className="flex-1 px-10 py-8">
          <div className="mb-8">
            <h1 className="text-[32px] font-semibold text-[#0b1c30] leading-tight">
              Approved Monthly Snapshots
            </h1>
            <p className="text-lg text-[#4d4354] mt-2">
              View participant-approved snapshots within your permissions.
            </p>
          </div>

          <div className="bg-[#dce9ff] rounded-full flex items-center gap-4 p-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#2170e4] flex items-center justify-center text-white shrink-0">
              <ShieldCheck size={18} />
            </div>
            <p className="text-base text-[#0b1c30]">
              Access is controlled by participant consent. You are viewing
              snapshots shared securely.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#eef0fa] shadow-[0_10px_26px_rgba(11,28,48,0.05)] p-6 flex flex-wrap items-end gap-4 mb-8">
            {FILTERS.map((f) => (
              <div key={f.label} className={f.width}>
                <p className="text-xs font-semibold text-[#4d4354] mb-2">
                  {f.label}
                </p>
                <button className="w-full flex items-center justify-between gap-2 bg-white border border-[#e4e7f2] rounded-full px-4 py-3 text-left">
                  <span className="text-base text-[#0b1c30] truncate">
                    {f.value}
                  </span>
                  <ChevronDown size={16} className="text-[#4d4354] shrink-0" />
                </button>
              </div>
            ))}
            <button className="ml-auto flex items-center gap-2 bg-white border border-[#e4e7f2] rounded-full px-6 py-3 text-sm font-medium text-[#7800ce] hover:bg-purple-50 transition-colors">
              <SlidersHorizontal size={14} />
              Filter
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {SNAPSHOTS.map((s) => (
              <div
                key={s.initials}
                className="bg-white rounded-3xl border border-[#eef0fa] shadow-[0_10px_26px_rgba(11,28,48,0.05)] p-6 flex flex-col"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-2 ${s.avatarTone}`}
                    >
                      {s.initials}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0b1c30] leading-7">
                        {s.nameLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </h3>
                      <p className="text-sm font-medium text-[#4d4354] mt-1 leading-5">
                        {s.monthLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-[#007a53]/10 text-[#007a53] text-xs font-semibold rounded-full px-3 py-1 shrink-0">
                    <Lock size={11} />
                    Locked
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm border-b border-[#eef0fa] pb-3">
                    <span className="font-medium text-[#4d4354]">
                      Consent Level
                    </span>
                    <span className="font-medium text-[#0b1c30]">
                      {s.consentLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-b border-[#eef0fa] pb-3">
                    <span className="font-medium text-[#4d4354]">
                      Last Viewed
                    </span>
                    <span className="font-medium text-[#0b1c30]">
                      {s.lastViewed}
                    </span>
                  </div>
                </div>

                <button className="mt-auto pt-5">
                  <span className="w-full flex items-center justify-center gap-2 bg-[#e5eeff] text-[#7800ce] text-sm font-medium rounded-full py-3 hover:bg-[#d8e6ff] transition-colors">
                    <Eye size={16} />
                    View Snapshot
                  </span>
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
