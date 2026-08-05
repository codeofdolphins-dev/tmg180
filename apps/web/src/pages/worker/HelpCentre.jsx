import {
  Search,
  Monitor,
  FileEdit,
  Users,
  BarChart2,
  Shield,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';
import WorkspaceLayout from '../../components/layout/worker/WorkspaceLayout';
import { WORKSPACE_NAV_ITEMS_LOWER, WORKSPACE_HELP_ICON } from '../../components/layout/worker/WorkspaceSidebar';

const LOWER_NAV_ITEMS = WORKSPACE_NAV_ITEMS_LOWER.filter((item) => item.label !== 'Help');
const BOTTOM_NAV_ITEMS = [{ label: 'Help', icon: WORKSPACE_HELP_ICON }];

const TOPICS = [
  {
    title: 'Worker Workspace',
    desc: 'Navigating your dashboard, settings, and general workspace features.',
    icon: Monitor,
    tone: 'bg-violet-600',
  },
  {
    title: 'Daily Support Evidence Logs',
    desc: 'Creating, editing, and managing your daily documentation effectively.',
    icon: FileEdit,
    tone: 'bg-blue-600',
  },
  {
    title: 'Participants I support',
    desc: 'Understanding participant profiles, goals and support networks.',
    icon: Users,
    tone: 'bg-emerald-600',
  },
  {
    title: 'Monthly Snapshots',
    desc: 'Generating and reviewing monthly summaries and outcome tracking.',
    icon: BarChart2,
    tone: 'bg-violet-500',
  },
  {
    title: 'Governance Standing',
    desc: 'Maintaining governance, understanding policies, and quality standards.',
    icon: Shield,
    tone: 'bg-rose-500',
  },
  {
    title: 'Resources and Learning Hub',
    desc: 'Accessing training materials, templates, and professional development.',
    icon: GraduationCap,
    tone: 'bg-purple-600',
  },
];

const FAQS = [
  'How do I create a Daily Support Evidence Log?',
  'How do goals link to logs?',
  'What can I see when a participant gives consent?',
  'How do approved Monthly Snapshots work?',
  'How do I update my worker profile?',
  'What is Governance Standing?',
];

function TopicCard({ title, desc, icon: Icon, tone }) {
  return (
    <div className="relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white ${tone}`}
      >
        <Icon size={20} />
      </div>
      <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      <div
        className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10 ${tone}`}
      />
    </div>
  );
}

export default function HelpCentre() {
  return (
    <WorkspaceLayout
      portalLabel="Worker Workspace"
      activeItem="Help"
      lowerNavItems={LOWER_NAV_ITEMS}
      bottomNavItems={BOTTOM_NAV_ITEMS}
      showParticipantsPlaceholder={false}
      newEntryPosition="top"
      topBar
      showSearch={false}
      avatar="icon"
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-600 mb-2">Help Centre</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Find guidance for your worker workspace, evidence logs, governance items
            and resources.
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
          <h2 className="text-xl font-bold text-slate-900 text-center mb-4">
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
            All data entered into the TMG180 Worker Workspace must comply with the
            Australian Privacy Act 1988 (APPs). Ensure you are aware of your
            obligations regarding the handling of sensitive personal information.
            In the event of a suspected data issue, notify immediately to the
            Governance section outlined Notifiable Data Breaches scheme protocols.
          </p>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
