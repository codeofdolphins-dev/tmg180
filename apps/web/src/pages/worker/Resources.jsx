import {
  Plus,
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
  Search,
  Clock,
  ArrowRight,
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
  { label: 'Governance Standing', icon: Landmark },
];

const BOTTOM_ITEMS = [
  { label: 'Settings', icon: Settings },
  { label: 'Help Centre', icon: HelpCircle },
];

const FILTERS = ['All', 'Templates', 'How-to guides', 'Policy', 'Evidence Language'];

const TAG_STYLES = {
  Templates: 'bg-purple-100 text-brand-700',
  'How-to guides': 'bg-sky-100 text-sky-700',
  Policy: 'bg-emerald-100 text-emerald-700',
  Privacy: 'bg-rose-100 text-rose-700',
};

const RESOURCES = [
  {
    tag: 'Templates',
    readTime: '5 min read',
    title: 'Daily Support Evidence Log Template',
    desc: 'A structured guide for recording daily support sessions with clarity and impact.',
  },
  {
    tag: 'How-to guides',
    readTime: '8 min read',
    title: 'Monthly Snapshot Guidance',
    desc: 'Best practices for auto-compiling logs and creating meaningful participant summaries.',
  },
  {
    tag: 'Policy',
    readTime: '12 min read',
    title: 'Support Interpretation Manual',
    desc: 'Understanding the NDIS evidence language and how to map support to functional goals.',
  },
  {
    tag: 'Privacy',
    readTime: '10 min read',
    title: 'Privacy & Consent Framework',
    desc: 'How to handle participant data securely and manage active consent effectively.',
  },
  {
    tag: 'Policy',
    readTime: '6 min read',
    title: 'Incident & Complaint Process',
    desc: 'Step-by-step documentation requirements for incidents and feedback.',
  },
  {
    tag: 'Templates',
    readTime: '15 min read',
    title: 'Independent Worker Onboarding Kit',
    desc: 'Everything you need to set up your practice boundaries and platform profile.',
  },
];

function NavItem({ icon: Icon, label, active }) {
  const go = useRoleNav('worker');
  return (
    <button
      onClick={() => go(label)}
      className={`w-full flex items-center gap-2.5 text-sm px-3 py-2.5 text-left transition-colors ${
        active
          ? 'bg-brand-700 text-white font-medium rounded-full'
          : 'text-slate-600 hover:bg-slate-100 rounded-lg'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

function ResourceCard({ tag, readTime, title, desc }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${TAG_STYLES[tag]}`}>
          {tag}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
          <Clock size={11} />
          {readTime}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed flex-1">{desc}</p>
      <button className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors mt-4 w-fit">
        Open resource
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

export default function Resources() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-purple-50 via-slate-50 to-emerald-50 font-sans text-slate-800">
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white/70">
        <span className="text-lg font-black tracking-wider text-brand-700">TMG180</span>
        <div className="flex items-center gap-4 text-slate-500">
          <button className="hover:text-slate-700 transition-colors">
            <Bell size={18} />
          </button>
          <button className="hover:text-slate-700 transition-colors">
            <Settings size={18} />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="w-56 shrink-0 bg-white/70 border-r border-slate-200 flex flex-col py-6 px-4 overflow-y-auto">
          <div className="mb-5 px-2">
            <div className="text-lg font-black tracking-wider text-brand-700 leading-none">
              TMG180
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">
              Worker Portal
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium rounded-full py-2.5 mb-4 transition-colors">
            <Plus size={16} />
            <span>New Entry</span>
          </button>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.label} {...item} active={item.label === 'Resources'} />
            ))}
          </nav>

          <div className="mt-auto pt-4 flex flex-col gap-1">
            {BOTTOM_ITEMS.map((item) => (
              <NavItem key={item.label} {...item} />
            ))}
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto flex flex-col gap-5">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Resources</h1>
              <p className="text-sm text-slate-500 mt-1">
                Templates, guides, and tools for your independent worker practice.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2.5 flex-1 min-w-[220px]">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search resources"
                  className="bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400 flex-1"
                />
              </div>
              {FILTERS.map((f) => (
                <button
                  key={f}
                  className={`text-sm px-4 py-2.5 rounded-full whitespace-nowrap transition-colors ${
                    f === 'All'
                      ? 'bg-brand-600 text-white font-medium'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {RESOURCES.map((r) => (
                <ResourceCard key={r.title} {...r} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
