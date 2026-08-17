import { useState } from 'react';
import {
  User,
  NotebookPen,
  Search,
  Network,
  BookOpen,
  PenLine,
  ArrowRight,
} from 'lucide-react';

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
      <h3 className="text-base font-semibold text-slate-900 mb-1.5">{title}</h3>
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
    <div className="max-w-4xl mx-auto flex flex-col gap-5">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Library</h1>
              <p className="text-base text-slate-500 mt-1">
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
                  <h2 className="text-xl font-semibold text-slate-900">
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
  );
}
