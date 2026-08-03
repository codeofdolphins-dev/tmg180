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
  Search,
  Bell,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Zap,
  ChevronRight,
  ChevronDown,
  ScrollText,
  BadgeCheck,
  Handshake,
  Lightbulb,
  Network,
  FolderOpen,
  FileCode,
  FileText,
  Info,
} from 'lucide-react';

import { useRoleNav } from '../navigation/useRoleNav';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Calendar', icon: Calendar },
  { label: 'Participants I support', icon: Users },
  { label: 'Daily Logs', icon: NotebookPen },
  { label: 'Monthly Snapshots', icon: TrendingUp },
  { label: 'Resources', icon: Folder },
  { label: 'Learning Hub', icon: GraduationCap },
  { label: 'Governance Standing', icon: Landmark },
];

const MODULE_CARDS = [
  {
    title: 'Mandatory Policies',
    icon: ScrollText,
    iconTone: 'bg-[#ffdad6] text-[#a80710]',
    links: [
      { icon: BookOpen, label: 'Full manual' },
      { icon: Zap, label: 'Quick guide' },
    ],
  },
  {
    title: 'Practice Standards',
    icon: BadgeCheck,
    iconTone: 'bg-[#007a53] text-white',
    links: [
      { icon: BookOpen, label: 'Full manual' },
      { icon: Zap, label: 'Quick guide' },
    ],
  },
  {
    title: 'Support Interpretation',
    icon: Handshake,
    iconTone: 'bg-[#2170e4] text-white',
    links: [
      { icon: Zap, label: 'Quick guide' },
      { icon: BookOpen, label: 'Full manual' },
    ],
  },
  {
    title: 'Relational Discipline',
    icon: Users,
    iconTone: 'bg-[#861fdd] text-white',
    links: [
      { icon: Lightbulb, label: 'Explainer' },
      { icon: Network, label: 'Full framework' },
    ],
  },
];

const TOOL_TILES = [
  {
    title: 'How-to guides',
    desc: 'Step-by-step operational workflows.',
    icon: FileCode,
    iconTone: 'bg-[#f0dbff] text-[#7800ce]',
  },
  {
    title: 'Templates',
    desc: 'Standardized forms and documents.',
    icon: FileText,
    iconTone: 'bg-[#d8e2ff] text-[#2170e4]',
  },
];

function NavItem({ icon: Icon, label, active }) {
  const go = useRoleNav('worker');
  return (
    <button
      onClick={() => go(label)}
      className={`w-full flex items-center gap-4 text-sm font-medium px-4 py-3 text-left transition-colors ${
        active
          ? 'bg-[#9333ea] text-[#f6e6ff] rounded-xl'
          : 'text-[#4d4354] hover:bg-slate-100 rounded-xl'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}

function ResourceLink({ icon: Icon, label }) {
  return (
    <button className="w-full flex items-center justify-between bg-[#f8f9ff] hover:bg-slate-100 rounded-full px-4 py-4 transition-colors">
      <span className="flex items-center gap-3">
        <Icon size={17} className="text-[#4d4354]" />
        <span className="text-sm font-medium text-[#0b1c30]">{label}</span>
      </span>
      <ChevronRight size={15} className="text-slate-400" />
    </button>
  );
}

function ModuleCard({ title, icon: Icon, iconTone, links }) {
  return (
    <div className="bg-white/70 rounded-[48px] p-8 shadow-sm shadow-purple-100/50 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconTone}`}
        >
          <Icon size={22} />
        </div>
        <h3 className="text-xl font-semibold text-[#0b1c30] leading-tight">
          {title}
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <ResourceLink key={link.label} {...link} />
        ))}
      </div>
    </div>
  );
}

export default function LearningHub() {
  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-800">
      <aside className="w-64 shrink-0 bg-white/80 border-r border-slate-100 flex flex-col py-8 px-3 overflow-y-auto">
        <div className="flex items-center gap-3 px-3 mb-16">
          <div className="w-10 h-10 rounded-full bg-purple-100 text-[#7800ce] text-sm font-bold flex items-center justify-center shrink-0">
            AW
          </div>
          <div>
            <div className="text-2xl font-bold text-[#7800ce] leading-none">
              TMG180
            </div>
            <div className="text-xs font-semibold text-[#4d4354] tracking-wide mt-1">
              WORKER PORTAL
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              {...item}
              active={item.label === 'Learning Hub'}
            />
          ))}
        </nav>

        <div className="mt-auto pt-10 flex flex-col gap-2">
          <NavItem icon={Settings} label="Settings" />
          <NavItem icon={HelpCircle} label="Help Centre" />
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 shrink-0 bg-[#f8f9ff]/70 flex items-center justify-between px-10">
          <h1 className="text-2xl font-bold text-[#7800ce]">Worker Education</h1>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#4d4354] hover:bg-slate-100 transition-colors">
              <Search size={18} />
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#4d4354] hover:bg-slate-100 transition-colors">
              <Bell size={18} />
            </button>
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center ml-2 ring-2 ring-purple-200">
              AW
            </div>
          </div>
        </header>

        <main className="flex-1 relative overflow-hidden">
          <div className="absolute -top-72 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-purple-200/60 to-transparent blur-3xl pointer-events-none" />

          <div className="relative px-10 py-16 flex flex-col gap-10">
            <div className="flex flex-col gap-6 max-w-3xl">
              <div className="inline-flex items-center gap-3 bg-white/70 rounded-full px-5 py-2.5 shadow-sm w-fit">
                <CheckCircle2 size={16} className="text-[#7800ce]" />
                <p className="text-sm font-medium text-[#4d4354]">
                  Complete onboarding to publish your profile (opt-in) and access
                  tools.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-5xl font-bold text-[#0b1c30]">Learning Hub</h2>
                <p className="text-lg text-[#4d4354]">
                  Micro-explainers, templates, and guidance to support your
                  independent worker practice.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="bg-[#eff4ff] rounded-full p-1 flex items-center gap-2">
                <button className="bg-[#9333ea] text-[#f6e6ff] text-sm font-bold rounded-full px-6 py-2.5">
                  Core Library
                </button>
                <button className="text-[#4d4354] text-sm font-medium rounded-full px-6 py-2.5 hover:bg-white/60 transition-colors">
                  Optional Reading
                </button>
              </div>
              <div className="flex items-center gap-2 bg-[#f0dbff]/30 rounded-full px-3.5 py-1.5">
                <Sparkles size={14} className="text-[#7800ce]" />
                <span className="text-xs font-semibold text-[#7800ce]/80">
                  AI search uses Core Library only.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {MODULE_CARDS.slice(0, 3).map((card) => (
                <ModuleCard key={card.title} {...card} />
              ))}
              <ModuleCard {...MODULE_CARDS[3]} />

              <div className="md:col-span-2 bg-white/70 rounded-[48px] p-8 shadow-sm shadow-purple-100/50 flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#cbdbf5] text-[#2170e4] flex items-center justify-center shrink-0">
                    <FolderOpen size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0b1c30]">
                      Templates &amp; How-to Guides
                    </h3>
                    <p className="text-xs font-semibold text-[#4d4354] mt-1">
                      Practical tools for daily application.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {TOOL_TILES.map((tile) => (
                    <button
                      key={tile.title}
                      className="flex items-start gap-4 bg-[#f8f9ff] hover:bg-slate-100 rounded-[32px] p-5 text-left transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${tile.iconTone}`}
                      >
                        <tile.icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0b1c30]">
                          {tile.title}
                        </p>
                        <p className="text-xs font-semibold text-[#4d4354] mt-2 leading-relaxed">
                          {tile.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-8 mt-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl text-[#0b1c30]">Additional resources</h3>
                <ChevronDown size={16} className="text-[#4d4354]" />
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <Info size={12} className="text-[#4d4354]" />
                <span className="text-xs font-semibold text-[#4d4354]">
                  Optional Reading is excluded from AI retrieval.
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
