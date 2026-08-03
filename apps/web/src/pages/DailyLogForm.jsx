import { useState } from 'react';
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
  Clock,
  Link2,
  Sparkles,
  BarChart2,
  ClipboardList,
  ChevronDown,
  Play,
} from 'lucide-react';
import Button from '../components/ui/Button';

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

const BOTTOM_ITEMS = [
  { label: 'Settings', icon: Settings },
  { label: 'Help Centre', icon: HelpCircle },
];

const FUNCTIONAL_DOMAINS = [
  'Daily living',
  'Mobility & transport',
  'Communication',
  'Social participation',
  'Self-care',
  'Learning & employment',
  'Health & wellbeing',
  'Safety',
  'Support network',
];

const BASELINE_OPTIONS = [
  'Better than baseline',
  'Same as baseline',
  'Variable today',
  'Below baseline today',
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

function CardHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <Icon size={15} className="text-brand-600" />
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function Chip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
        selected
          ? 'bg-brand-600 border-brand-600 text-white font-medium'
          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );
}

export default function DailyLogForm() {
  const [domain, setDomain] = useState('Communication');
  const [baseline, setBaseline] = useState('Same as baseline');
  const [writingMode, setWritingMode] = useState('Plain language');

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6 px-1">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
              alt="Worker avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-base font-black tracking-wider text-brand-700 leading-none">
              TMG180 Portal
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Worker Portal</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'Daily Logs'} />
          ))}
        </nav>

        <div className="mt-auto pt-4 flex flex-col gap-1 border-t border-slate-100">
          {BOTTOM_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-end gap-4 px-6 py-4 text-slate-500">
          <button className="hover:text-slate-700 transition-colors">
            <Search size={18} />
          </button>
          <button className="hover:text-slate-700 transition-colors">
            <Bell size={18} />
          </button>
          <button className="hover:text-slate-700 transition-colors">
            <HelpCircle size={18} />
          </button>
        </header>

        <main className="flex-1 px-6 pb-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
                  SJ
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 leading-none">
                    Sarah Jenkins
                  </p>
                  <p className="text-xs text-slate-400 mt-1">TMG-821</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
                <CheckCircle2 size={12} />
                Consent Active
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Daily Support Evidence Log
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                Document your support session. Focus on functional impacts, outcomes,
                and progress towards goals.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4 items-start">
              <div className="flex flex-col gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <CardHeader icon={Clock} title="Session Details" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        Date
                      </label>
                      <input
                        type="text"
                        placeholder="mm/dd/yyyy"
                        className="w-full bg-white border border-slate-300 rounded-full px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        Start Time
                      </label>
                      <input
                        type="text"
                        placeholder="--:--"
                        className="w-full bg-white border border-slate-300 rounded-full px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        End Time
                      </label>
                      <input
                        type="text"
                        placeholder="--:--"
                        className="w-full bg-white border border-slate-300 rounded-full px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <CardHeader icon={Link2} title="Link to Goals" />
                  <p className="text-xs text-slate-500 mb-3">
                    Select 1-3 FCA goals relevant to today's support.
                  </p>
                  <button className="w-full flex items-center justify-between bg-white border border-slate-300 rounded-full px-4 py-2.5 text-sm text-slate-400">
                    Select linked goals...
                    <ChevronDown size={15} />
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <CardHeader icon={Sparkles} title="Functional Domains" />
                  <p className="text-xs text-slate-500 mb-3">
                    Select all areas engaged during the session.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {FUNCTIONAL_DOMAINS.map((d) => (
                      <Chip
                        key={d}
                        label={d}
                        selected={domain === d}
                        onClick={() => setDomain(d)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Function-first impacts
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe how the participant's function was impacted today..."
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Support delivered
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Detail the specific supports provided..."
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Outcome / participation snapshot
                    </label>
                    <textarea
                      rows={2}
                      placeholder="What was the outcome? How did they participate?"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600 resize-none"
                    />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <CardHeader icon={BarChart2} title="Baseline Comparison" />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {BASELINE_OPTIONS.map((b) => (
                      <Chip
                        key={b}
                        label={b}
                        selected={baseline === b}
                        onClick={() => setBaseline(b)}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <CardHeader icon={ClipboardList} title="Additional Context" />
                  <span className="text-xs text-slate-400 ml-6">(Optional)</span>
                  <div className="flex flex-col gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        Participant voice
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Quotes or specific feedback from the participant..."
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        Safety / incident note
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Any safety observations (non-urgent)..."
                        className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                      <Sparkles size={15} className="text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Help me write this
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Refine your notes into professional phrasing. Uses your saved
                    inputs only.
                  </p>

                  <div className="flex flex-col gap-2 mb-4">
                    {['Plain language', 'NDIS evidence language', 'Both (Balanced)'].map(
                      (opt) => (
                        <label
                          key={opt}
                          className="flex items-center justify-between text-sm text-slate-700 bg-slate-50 rounded-lg px-3.5 py-2.5 cursor-pointer"
                        >
                          {opt}
                          <input
                            type="radio"
                            name="writingMode"
                            checked={writingMode === opt}
                            onChange={() => setWritingMode(opt)}
                            className="accent-brand-600"
                          />
                        </label>
                      )
                    )}
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 text-brand-700 text-sm font-medium rounded-full py-2.5 transition-colors">
                    <Sparkles size={14} />
                    Generate Draft
                  </button>
                </div>

                <Button variant="primary" icon={Play} className="w-full!">
                  Submit Log
                </Button>
                <Button variant="outline" className="w-full!">
                  Save Draft
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
