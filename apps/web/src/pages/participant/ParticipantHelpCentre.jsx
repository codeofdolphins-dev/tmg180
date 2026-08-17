import {
  Search,
  Monitor,
  FileEdit,
  NotebookPen,
  BarChart2,
  Users,
  Shield,
  ChevronDown,
} from 'lucide-react';

/**
 * Participant-branded Help Centre. The original HelpCentre page is worker
 * branded ("Worker Workspace") and stays on the worker route; this page
 * mirrors its content structure with participant topics, and renders inside
 * ParticipantLayout like every other participant screen.
 */

const TOPICS = [
  {
    title: 'Your Dashboard',
    desc: 'Navigating your personal space, settings, and general portal features.',
    icon: Monitor,
    tone: 'bg-violet-600',
  },
  {
    title: 'Personal Profile',
    desc: 'Completing and updating your profile sections at your own pace.',
    icon: FileEdit,
    tone: 'bg-blue-600',
  },
  {
    title: 'Daily Logs',
    desc: 'Recording daily support activities and building your evidence over time.',
    icon: NotebookPen,
    tone: 'bg-emerald-600',
  },
  {
    title: 'Monthly Snapshots',
    desc: 'Reviewing, approving, and exporting your monthly support summaries.',
    icon: BarChart2,
    tone: 'bg-violet-500',
  },
  {
    title: 'Verified Profiles Directory',
    desc: 'Browsing verified worker profiles and choosing who to contact.',
    icon: Users,
    tone: 'bg-rose-500',
  },
  {
    title: 'Privacy & Sharing',
    desc: 'Controlling who can see your information and managing consent.',
    icon: Shield,
    tone: 'bg-purple-600',
  },
];

const FAQS = [
  'How do I complete my Daily Log?',
  'Who can see the information I record?',
  'How do I approve my Monthly Snapshot?',
  'How do I share my profile with a support worker?',
  'How do I change what a worker can access?',
  'How do I export or share an approved snapshot?',
];

function TopicCard({ title, desc, icon: Icon, tone }) {
  return (
    <div className="relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white ${tone}`}
      >
        <Icon size={20} />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      <div
        className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10 ${tone}`}
      />
    </div>
  );
}

export default function ParticipantHelpCentre() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brand-600 mb-2">Help Centre</h1>
        <p className="text-base text-slate-500 max-w-md mx-auto">
          Find guidance for your participant portal, daily logs, monthly
          snapshots and sharing controls.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-3 max-w-md mx-auto w-full">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search help topics..."
          className="bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400 flex-1"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOPICS.map((t) => (
          <TopicCard key={t.title} {...t} />
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-900 text-center mb-4">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-2">
          {FAQS.map((q) => (
            <button
              key={q}
              className="w-full flex items-center justify-between text-left bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span>{q}</span>
              <ChevronDown size={16} className="text-slate-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center text-center gap-2 pb-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
          <Shield size={13} className="text-brand-500" />
          Privacy &amp; Compliance Notice
        </div>
        <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
          Everything you record in the TMG180 Participant Portal is yours — you
          decide who sees it. All data is handled in line with the Australian
          Privacy Act 1988 (APPs). If you notice anything that doesn&rsquo;t
          look right, let us know from Privacy &amp; Sharing.
        </p>
      </div>
    </div>
  );
}
