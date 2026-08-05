import {
  LayoutDashboard,
  Calendar,
  Users,
  NotebookPen,
  TrendingUp,
  Folder,
  GraduationCap,
  ShieldCheck,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  Bell,
  CheckCircle2,
  ClipboardClock,
  CalendarCheck,
  BookOpenCheck,
  FolderCheck,
  UserRoundCheck,
  Info,
  CircleAlert,
  Gavel,
  ListX,
  ListChecks,
  Clock,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';

import { useRoleNav } from '../../navigation/useRoleNav';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Calendar', icon: Calendar },
  { label: 'Participants I support', icon: Users },
  { label: 'Daily Logs', icon: NotebookPen },
  { label: 'Monthly Snapshots', icon: TrendingUp },
  { label: 'Resources', icon: Folder },
  { label: 'Learning Hub', icon: GraduationCap },
  { label: 'Governance Standing', icon: ShieldCheck },
  { label: 'Settings', icon: Settings },
  { label: 'Help Centre', icon: HelpCircle },
];

const SUMMARY_CARDS = [
  {
    icon: CheckCircle2,
    iconTone: 'text-[#7800ce]',
    badge: 'Excellent',
    badgeTone: 'bg-[#6ffbbe] text-[#002113]',
    badgeDot: 'bg-[#005f40]',
    label: 'Overall Readiness',
    value: '14 / 16 Items',
    glow: 'bg-[#ddb8ff]/20',
  },
  {
    icon: ClipboardClock,
    iconTone: 'text-[#2170e4]',
    badge: '2 Pending',
    badgeTone: 'bg-[#d8e2ff] text-[#001a42]',
    label: 'Awaiting Review',
    value: 'Documents',
    glow: 'bg-[#adc6ff]/20',
  },
  {
    icon: CalendarCheck,
    iconTone: 'text-[#007a53]',
    badge: 'Next: Nov 15',
    badgeTone: 'bg-[#d3e4fe] text-[#4d4354]',
    label: 'Next Renewal Milestone',
    value: 'First Aid Cert',
    glow: 'bg-[#4edea3]/20',
  },
];

const ACKNOWLEDGEMENT_ROWS = [
  {
    icon: Info,
    title: 'Privacy & Data Handling Acknowledgement',
    sub: 'Last updated October 2023',
    badge: 'Completed',
    badgeTone: 'bg-[#6ffbbe] text-[#002113]',
    buttonTone: 'bg-[#d3e4fe] text-[#7800ce]',
  },
  {
    icon: CircleAlert,
    title: 'Incident and Complaint Process',
    sub: 'Annual acknowledgement required',
    badge: 'Needs review',
    badgeTone: 'bg-[#d8e2ff] text-[#001a42]',
    buttonTone: 'bg-[#7800ce] text-white',
  },
];

const DOCUMENT_ROWS = [
  {
    icon: Gavel,
    title: 'Mandatory Policies',
    sub: 'Code of Conduct, Worker Safety',
    badge: 'Completed',
    badgeTone: 'bg-[#6ffbbe] text-[#002113]',
    buttonTone: 'bg-[#d3e4fe] text-[#0058be]',
  },
  {
    icon: ListX,
    title: 'Practice Standards',
    sub: 'Core support guidelines',
    badge: 'Not completed yet',
    badgeTone: 'bg-[#d3e4fe] text-[#4d4354]',
    buttonTone: 'bg-[#d3e4fe] text-[#0058be]',
  },
];

const READINESS_ROWS = [
  {
    icon: ListChecks,
    title: 'Worker Onboarding Pathway',
    sub: 'Foundation training modules',
    badge: 'Completed',
    badgeTone: 'bg-[#6ffbbe] text-[#002113]',
    buttonTone: 'bg-[#d3e4fe] text-[#005f40]',
  },
];

const RENEWALS = [
  {
    badge: 'Due soon',
    badgeTone: 'bg-[#f0dbff] text-[#6800b4]',
    dotTone: 'bg-[#f0dbff]',
    title: 'First Aid Certification',
    expires: 'Expires: Nov 15, 2023',
    action: 'Update Details',
    actionTone: 'text-[#7800ce]',
  },
  {
    badge: 'Next year',
    badgeTone: 'bg-[#d3e4fe] text-[#4d4354]',
    dotTone: 'bg-[#dce9ff]',
    title: 'NDIS Worker Screening',
    expires: 'Expires: Mar 22, 2024',
    action: 'Review',
    actionTone: 'text-[#4d4354]',
  },
  {
    badge: 'Next year',
    badgeTone: 'bg-[#d3e4fe] text-[#4d4354]',
    dotTone: 'bg-[#dce9ff]',
    title: 'Working with Children Check',
    expires: 'Expires: Aug 10, 2024',
    action: 'Review',
    actionTone: 'text-[#4d4354]',
  },
];

function NavItem({ icon: Icon, label, active }) {
  const go = useRoleNav('worker');
  return (
    <button
      onClick={() => go(label)}
      className={`relative w-full flex items-center gap-3 text-sm px-4 py-3 text-left rounded-full transition-colors ${
        active
          ? 'bg-[#7800ce]/10 text-[#7800ce] font-bold'
          : 'text-[#4d4354] font-medium hover:bg-slate-100'
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#7800ce] rounded-full" />
      )}
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}

function SectionCard({ icon: Icon, iconTone, title, rows }) {
  return (
    <div className="bg-white/90 rounded-[48px] overflow-hidden shadow-sm shadow-purple-100/40">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconTone}`}
        >
          <Icon size={18} />
        </div>
        <h3 className="text-2xl font-semibold text-[#0b1c30]">{title}</h3>
      </div>
      <div className="p-2">
        {rows.map((row) => (
          <div
            key={row.title}
            className="flex items-center justify-between gap-4 rounded-[32px] px-4 py-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-4 min-w-0">
              <row.icon size={18} className="text-[#4d4354] shrink-0" />
              <div className="min-w-0">
                <p className="text-base font-medium text-[#0b1c30]">{row.title}</p>
                <p className="text-xs font-semibold text-[#4d4354] mt-0.5">
                  {row.sub}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${row.badgeTone}`}
              >
                {row.badge}
              </span>
              <button
                className={`text-sm font-medium px-5 py-2 rounded-full ${row.buttonTone}`}
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WorkerGovernanceStanding() {
  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-800">
      <aside className="w-72 shrink-0 bg-white/80 border-r border-slate-100 flex flex-col py-6 px-6 overflow-y-auto">
        <div className="mb-6">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-[#7800ce] text-sm font-bold flex items-center justify-center ring-2 ring-purple-200 mb-4">
            AW
          </div>
          <h2 className="text-2xl font-semibold text-[#7800ce]">Welcome back</h2>
          <p className="text-sm font-medium text-[#4d4354] mt-1">
            Your dashboard is ready
          </p>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-[#7800ce] text-white text-sm font-medium rounded-full py-3 mb-8 hover:bg-[#6800b4] transition-colors">
          <Plus size={14} />
          New Log Entry
        </button>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              {...item}
              active={item.label === 'Governance Standing'}
            />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <NavItem icon={LogOut} label="Sign Out" />
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 shrink-0 bg-[#f8f9ff]/80 flex items-center justify-between px-10">
          <h1 className="text-2xl font-bold text-[#7800ce]">
            Governance Standing
          </h1>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#4d4354] hover:bg-slate-100 transition-colors">
              <Bell size={18} />
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#4d4354] hover:bg-slate-100 transition-colors">
              <Settings size={18} />
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center ml-2 ring-1 ring-slate-200">
              AW
            </div>
          </div>
        </header>

        <main className="flex-1 bg-[#f8f9ff]/50 px-10 py-10">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <h2 className="text-5xl font-bold text-[#0b1c30]">
                Governance Standing
              </h2>
              <p className="text-lg text-[#4d4354]">
                Your own documents, acknowledgements, and readiness items.
                Maintained securely in your account.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SUMMARY_CARDS.map((card) => (
                <div
                  key={card.label}
                  className="relative overflow-hidden bg-white/80 rounded-[48px] p-6 shadow-sm shadow-purple-100/40"
                >
                  <div
                    className={`absolute -top-10 -right-2 w-32 h-32 rounded-full blur-2xl pointer-events-none ${card.glow}`}
                  />
                  <div className="relative flex items-center justify-between mb-8">
                    <card.icon size={24} className={card.iconTone} />
                    <span
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${card.badgeTone}`}
                    >
                      {card.badgeDot && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${card.badgeDot}`}
                        />
                      )}
                      {card.badge}
                    </span>
                  </div>
                  <div className="relative">
                    <p className="text-base text-[#4d4354]">{card.label}</p>
                    <p className="text-[32px] font-semibold text-[#0b1c30] leading-tight mt-1">
                      {card.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
              <div className="flex flex-col gap-8">
                <SectionCard
                  icon={BookOpenCheck}
                  iconTone="bg-[#f0dbff] text-[#7800ce]"
                  title="Required Acknowledgements"
                  rows={ACKNOWLEDGEMENT_ROWS}
                />
                <SectionCard
                  icon={FolderCheck}
                  iconTone="bg-[#d8e2ff] text-[#2170e4]"
                  title="Document Status"
                  rows={DOCUMENT_ROWS}
                />
                <SectionCard
                  icon={UserRoundCheck}
                  iconTone="bg-[#6ffbbe] text-[#005f40]"
                  title="Professional Readiness"
                  rows={READINESS_ROWS}
                />
              </div>

              <div className="bg-[#eff4ff]/60 rounded-[48px] p-6">
                <div className="flex items-start gap-2 mb-8">
                  <Clock size={20} className="text-[#0b1c30] mt-1.5 shrink-0" />
                  <h3 className="text-2xl font-semibold text-[#0b1c30] leading-tight">
                    Upcoming Renewals
                  </h3>
                </div>

                <div className="ml-2 border-l border-[#d3e4fe] pl-6 flex flex-col gap-8">
                  {RENEWALS.map((item) => (
                    <div key={item.title} className="relative">
                      <span
                        className={`absolute -left-8 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${item.dotTone}`}
                      />
                      <span
                        className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full ${item.badgeTone}`}
                      >
                        {item.badge}
                      </span>
                      <p className="text-base font-medium text-[#0b1c30] mt-1.5 leading-snug">
                        {item.title}
                      </p>
                      <p className="text-xs font-semibold text-[#4d4354] mt-1.5">
                        {item.expires}
                      </p>
                      <button
                        className={`flex items-center gap-1 text-sm font-medium mt-1.5 ${item.actionTone}`}
                      >
                        {item.action}
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#d3e4fe] mt-6 pt-5 flex items-start gap-3">
                  <BadgeCheck size={15} className="text-[#4d4354] mt-0.5 shrink-0" />
                  <p className="text-xs font-semibold text-[#4d4354] leading-relaxed">
                    All other credentials are up to date.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
