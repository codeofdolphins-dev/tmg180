import { Search, Clock, ArrowRight } from 'lucide-react';

const FILTERS = ['All', 'Templates', 'How-to guides', 'Policy', 'Evidence Language'];

const TAG_STYLES = {
  Templates: 'bg-brand-100 text-brand-700',
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
    <div className="max-w-250 mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Resources</h1>
          <p className="text-sm text-slate-500 mt-1">
            Templates, guides, and tools for your independent worker practice.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2.5 flex-1 min-w-55">
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
    </div>
  );
}
