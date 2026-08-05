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
  Bell,
  Sun,
  BadgeCheck,
  MapPin,
  Video,
  ArrowRight,
  FileText,
  ChevronRight,
  UserRound,
  FilePen,
  Pencil,
  CheckCheck,
  FilePlus2,
  MoreVertical,
  CalendarCheck2,
  ShieldCheck,
  Clock,
  CircleEllipsis,
  Bookmark,
  BookOpen,
  MessagesSquare,
} from 'lucide-react';

import { useRoleNav } from '../navigation/useRoleNav';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Calendar', icon: Calendar },
  { label: 'Participants I support', icon: Users },
  { label: 'Daily Logs', icon: NotebookPen },
  { label: 'Monthly Snapshots', icon: TrendingUp },
  { label: 'Resources', icon: Folder },
  { label: 'Learning Hub', icon: GraduationCap },
  { label: 'Governance Standing', icon: Landmark },
  { label: 'Settings', icon: Settings },
  { label: 'Help Centre', icon: HelpCircle },
];

const SESSIONS = [
  {
    name: 'Sarah',
    initial: 'S',
    avatarBg: 'bg-[#007a53]',
    timeLines: ['9:00 AM -', '11:00 AM'],
    modeIcon: MapPin,
    modeLabel: 'In-home support',
    blob: 'bg-[#f0dbff]/40',
    primary: true,
  },
  {
    name: 'James',
    initial: 'J',
    avatarBg: 'bg-[#2170e4]',
    timeLines: ['2:00 PM -', '3:30 PM'],
    modeIcon: Video,
    modeLabel: 'Online session',
    blob: 'bg-[#d8e2ff]/40',
    primary: false,
  },
];

const LOGS = [
  {
    title: 'Sarah - Morning Support',
    date: 'Yesterday, 11:15 AM',
    badge: 'Draft',
    badgeTone: 'bg-[#dce9ff] text-[#4d4354]',
    badgeIcon: FilePen,
    edit: true,
  },
  {
    title: 'James - Community Access',
    date: 'Mon, 14 Oct',
    badge: 'Submitted',
    badgeTone: 'bg-[#f0dbff] text-[#2c0051]',
    badgeIcon: CheckCheck,
  },
  {
    title: 'Sarah - Goal Planning',
    date: 'Fri, 11 Oct',
    badge: 'Addendum added',
    badgeTone: 'bg-[#d8e2ff] text-[#001a42]',
    badgeIcon: FilePlus2,
  },
];

const CHECK_INS = [
  {
    month: 'OCT',
    day: '18',
    tileTone: 'bg-[#f0dbff]/40 text-[#7800ce]',
    title: 'Monthly Reflection',
    subtitle: 'Self-guided template',
  },
  {
    month: 'OCT',
    day: '25',
    tileTone: 'bg-[#dce9ff] text-[#4d4354]',
    title: 'Quarterly Strategy',
    subtitle: 'Personal workspace',
  },
];

const CREDENTIALS = [
  {
    name: 'Public Liability Insurance',
    status: 'Up to date',
    statusTone: 'text-[#007a53]',
    statusIcon: BadgeCheck,
    barColor: 'bg-[#007a53]',
    barWidth: 'w-full',
  },
  {
    name: 'First Aid Certification',
    status: 'Due soon',
    statusTone: 'text-[#861fdd]',
    statusIcon: Clock,
    barColor: 'bg-[#7800ce]',
    barWidth: 'w-4/5',
    note: 'Expires in 30 days',
  },
  {
    name: 'NDIS Worker Screening',
    status: 'Needs review',
    statusTone: 'text-[#4d4354]',
    statusIcon: CircleEllipsis,
    barColor: 'bg-[#7e7386]',
    barWidth: 'w-[10%]',
  },
];

const RESOURCES = [
  { label: 'Support Templates', icon: FileText, tone: 'text-[#7800ce]' },
  { label: 'Practice Guides', icon: BookOpen, tone: 'text-[#2170e4]' },
  { label: 'Governance Basics', icon: ShieldCheck, tone: 'text-[#007a53]' },
  { label: 'Peer Network', icon: MessagesSquare, tone: 'text-[#5b6cf0]' },
];

function NavItem({ icon: Icon, label, active }) {
  const go = useRoleNav('worker');
  return (
    <button
      onClick={() => go(label)}
      className={`w-full flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-full text-left transition-colors ${
        active
          ? 'bg-[#f0dbff]/50 text-[#7800ce]'
          : 'text-[#4d4354] hover:bg-white/70'
      }`}
    >
      <Icon size={17} />
      <span>{label}</span>
    </button>
  );
}

function SessionCard({ session }) {
  const ModeIcon = session.modeIcon;
  return (
    <div className="relative overflow-hidden bg-white rounded-[32px] p-6 border border-[#f0edf7] shadow-[0_12px_30px_rgba(120,0,206,0.06)]">
      <div
        className={`absolute -top-10 -right-6 w-32 h-32 rounded-full blur-xl ${session.blob}`}
      />
      <div className="relative flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0 ${session.avatarBg}`}
          >
            {session.initial}
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#0b1c30]">{session.name}</h4>
            {session.timeLines.map((line) => (
              <p key={line} className="text-sm text-[#4d4354] leading-5">
                {line}
              </p>
            ))}
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 bg-[#6ffbbe] text-[#005236] text-xs font-semibold rounded-full px-3 py-1.5 shrink-0">
          <BadgeCheck size={12} />
          <span className="leading-tight">
            Active
            <br />
            Consent
          </span>
        </span>
      </div>
      <div className="relative flex items-center gap-2 mt-4 text-sm text-[#4d4354]">
        <ModeIcon size={14} />
        {session.modeLabel}
      </div>
      <button
        className={`relative w-full flex items-center justify-center gap-2 text-sm font-semibold rounded-full py-3 mt-4 transition-colors ${
          session.primary
            ? 'bg-[#7800ce] text-white hover:bg-[#6600b0]'
            : 'bg-white text-[#7800ce] border border-[#e6def0] hover:bg-purple-50'
        }`}
      >
        Open support tools
        <ArrowRight size={13} />
      </button>
    </div>
  );
}

export default function WorkerDashboard() {
  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-800">
      <aside className="w-72 shrink-0 bg-[#f8f9ff]/80 border-r border-[#eef0fa] flex flex-col p-6">
        <div className="mb-8">
          <div className="text-4xl font-bold text-[#7800ce] leading-tight">
            TMG180
          </div>
          <p className="text-base text-[#4d4354] mt-1">Your Independent Space</p>
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </nav>

        <div className="mt-auto pt-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f0dbff] text-[#7800ce] text-sm font-bold flex items-center justify-center shrink-0">
            AM
          </div>
          <div>
            <p className="text-xs font-semibold text-[#4d4354] tracking-wide">
              INDEPENDENT WORKER
            </p>
            <p className="text-sm font-semibold text-[#0b1c30]">Alex M.</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-[#f8f9ff]/50 px-10 py-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold text-[#7800ce] leading-tight">
              Your self-employed worker workspace
            </h1>
            <p className="text-base text-[#4d4354] mt-1">
              Tools, templates, and governance structure — while you keep
              independence and autonomy.
            </p>
          </div>
          <button className="w-10 h-10 rounded-full bg-[#dce9ff] flex items-center justify-center text-[#4d4354] shrink-0">
            <Bell size={17} />
          </button>
        </header>

        <main className="flex-1 px-10 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8 items-start">
            <div className="flex flex-col gap-8">
              <section>
                <h3 className="flex items-center gap-2 text-2xl font-semibold text-[#0b1c30] mb-5">
                  <Sun size={22} className="text-[#7800ce]" />
                  Today’s Support Sessions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SESSIONS.map((session) => (
                    <SessionCard key={session.name} session={session} />
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-[32px] p-8 border border-[#f0edf7] shadow-[0_12px_30px_rgba(120,0,206,0.06)]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="flex items-center gap-2 text-2xl font-semibold text-[#0b1c30]">
                    <FileText size={19} className="text-[#2170e4]" />
                    Recent Daily Logs
                  </h3>
                  <button className="flex items-center gap-1 text-sm font-medium text-[#7800ce]">
                    View all
                    <ChevronRight size={13} />
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {LOGS.map((log) => (
                    <div
                      key={log.title}
                      className="bg-white border border-[#eef0fa] rounded-full px-4 py-3.5 flex items-center justify-between gap-3 shadow-[0_4px_14px_rgba(11,28,48,0.04)]"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#dce9ff] flex items-center justify-center text-[#2170e4] shrink-0">
                          <UserRound size={15} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#0b1c30] truncate">
                            {log.title}
                          </p>
                          <p className="text-sm text-[#4d4354]">{log.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full px-3 py-1 ${log.badgeTone}`}
                        >
                          <log.badgeIcon size={11} />
                          {log.badge}
                        </span>
                        <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#7800ce] hover:bg-purple-50">
                          {log.edit ? (
                            <Pencil size={15} />
                          ) : (
                            <MoreVertical size={14} className="text-[#4d4354]" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="flex flex-col gap-8">
              <section className="bg-white rounded-[32px] p-6 border border-[#f0edf7] shadow-[0_12px_30px_rgba(120,0,206,0.06)]">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-[#0b1c30] mb-4">
                  <CalendarCheck2 size={18} className="text-[#007a53]" />
                  Upcoming Check-ins
                </h3>
                <div className="flex flex-col gap-3">
                  {CHECK_INS.map((c) => (
                    <div
                      key={c.title}
                      className="flex items-center gap-4 rounded-[28px] p-3 border border-[#eef0fa]"
                    >
                      <div
                        className={`w-14 h-14 rounded-[18px] flex flex-col items-center justify-center shrink-0 ${c.tileTone}`}
                      >
                        <span className="text-xs font-semibold leading-none">
                          {c.month}
                        </span>
                        <span className="text-2xl font-semibold leading-tight">
                          {c.day}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0b1c30]">
                          {c.title}
                        </p>
                        <p className="text-sm text-[#4d4354]">{c.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-[32px] border border-[#f0edf7] shadow-[0_12px_30px_rgba(120,0,206,0.08)] overflow-hidden">
                <div className="h-1.5 bg-[#7800ce]" />
                <div className="p-6">
                  <h3 className="flex items-center gap-2 text-xl font-semibold text-[#0b1c30] mb-3">
                    <ShieldCheck size={17} className="text-[#7800ce]" />
                    Governance Summary
                  </h3>
                  <p className="text-sm text-[#4d4354] mb-5">
                    Your independent credentials and standing.
                  </p>
                  <div className="flex flex-col gap-5">
                    {CREDENTIALS.map((cred) => (
                      <div key={cred.name}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-medium text-[#0b1c30]">
                            {cred.name}
                          </p>
                          <span
                            className={`flex items-center gap-1 text-sm font-medium shrink-0 ${cred.statusTone}`}
                          >
                            <cred.statusIcon size={13} />
                            {cred.status}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-[#d3e4fe]">
                          <div
                            className={`h-2 rounded-full ${cred.barColor} ${cred.barWidth}`}
                          />
                        </div>
                        {cred.note && (
                          <p className="text-base text-[#4d4354] text-right mt-1">
                            {cred.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-[#f0dbff] text-[#2c0051] text-sm font-semibold rounded-full py-2 mt-6 hover:bg-[#e5c8fb] transition-colors">
                    Update documents
                  </button>
                </div>
              </section>

              <section className="bg-[#eef3fd] rounded-[32px] p-6">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-[#0b1c30] mb-4">
                  <Bookmark size={16} className="text-[#2170e4]" />
                  Quick Resources
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {RESOURCES.map((r) => (
                    <button
                      key={r.label}
                      className="bg-white/70 rounded-[28px] py-5 px-3 flex flex-col items-center gap-2 hover:bg-white transition-colors"
                    >
                      <r.icon size={22} className={r.tone} />
                      <span className="text-xs font-semibold text-[#0b1c30] text-center leading-snug">
                        {r.label}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
