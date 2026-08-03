import { useState } from 'react';
import {
  LayoutDashboard,
  User,
  NotebookPen,
  CalendarDays,
  Search,
  HelpCircle,
  Lock,
  Network,
  BookOpen,
  PenLine,
  ArrowRight,
} from 'lucide-react';

import { useRoleNav } from '../navigation/useRoleNav';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'My Profile', icon: User },
  { label: 'Daily Log', icon: NotebookPen },
  { label: 'Monthly Snapshot', icon: CalendarDays },
  { label: 'Browse Directory', icon: Search },
  { label: 'Help Centre', icon: HelpCircle },
  { label: 'Privacy & Sharing', icon: Lock },
];

const TABS = ['Core Library', 'Optional Reading'];

const SECTIONS = [
  {
    title: 'Personal Profile',
    tag: '(FCA baseline)',
    icon: User,
    iconTone: 'bg-slate-200 text-slate-600',
    accent: 'text-brand-600',
    guides: [
      {
        icon: BookOpen,
        readTime: '3 min read',
        title: 'Quick guide',
        desc: 'Get started with setting up your essential profile details.',
      },
      {
        icon: Network,
        readTime: '5 min read',
        title: 'How to update your profile',
        desc: 'Step-by-step instructions for keeping your information...',
      },
    ],
  },
  {
    title: 'Daily Support Evidence Log',
    tag: '',
    icon: NotebookPen,
    iconTone: 'bg-emerald-100 text-emerald-600',
    accent: 'text-emerald-600',
    guides: [
      {
        icon: BookOpen,
        readTime: '4 min read',
        title: 'Quick guide',
        desc: 'Learn the basics of logging your daily support efficiently.',
      },
      {
        icon: PenLine,
        readTime: '8 min read',
        title: 'Writing support evidence',
        desc: 'Tips and examples for writing clear, helpful daily logs.',
      },
    ],
  },
];

function NavItem({ icon: Icon, label, active }) {
  const go = useRoleNav('participant');
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

function GuideCard({ icon: Icon, iconTone, readTime, title, desc, accent }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconTone}`}
        >
          <Icon size={17} />
        </div>
        <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          {readTime}
        </span>
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-4">{desc}</p>
      <button
        className={`flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity ${accent}`}
      >
        Open guide
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

export default function Library() {
  const [activeTab, setActiveTab] = useState('Core Library');

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-4 overflow-y-auto">
        <div className="mb-6 px-2">
          <div className="text-2xl font-black tracking-wider text-brand-700 leading-none">
            TMG180
          </div>
          <div className="text-sm text-slate-400 mt-1">Participant Portal</div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'Help Centre'} />
          ))}
        </nav>

        <div className="mt-auto pt-4 flex items-center gap-2.5 px-2 border-t border-slate-100">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-sky-300 to-brand-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 leading-none">
              Participant
            </p>
            <button className="text-xs text-slate-400 hover:text-slate-600 mt-1 transition-colors">
              View account
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Library</h1>
              <p className="text-sm text-slate-500 mt-1">
                Helpful guides, templates and resources for using your
                participant-owned portal.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-3">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search library..."
                className="bg-transparent outline-none text-sm text-slate-500 placeholder:text-slate-400 flex-1"
              />
            </div>

            <div className="flex items-center gap-6 border-b border-slate-200">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm pb-3 -mb-px border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'text-brand-700 font-medium border-brand-600'
                      : 'text-slate-400 border-transparent hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {SECTIONS.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${section.iconTone}`}
                  >
                    <section.icon size={15} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {section.title}
                    {section.tag && (
                      <span className="text-sm font-normal text-slate-400 ml-1.5">
                        {section.tag}
                      </span>
                    )}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.guides.map((g) => (
                    <GuideCard
                      key={g.title}
                      {...g}
                      iconTone={section.iconTone}
                      accent={section.accent}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
