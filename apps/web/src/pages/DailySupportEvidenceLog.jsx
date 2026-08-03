import {
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  User,
  NotebookPen,
  CalendarDays,
  Search,
  HelpCircle,
  Lock,
  Info,
  Target,
  Users,
  Heart,
  Zap,
  ClipboardList,
  CheckCircle2,
  TrendingUp,
  ArrowUp,
  Edit3,
  History,
  Save,
  Clock,
} from 'lucide-react';
import Button from '../components/ui/Button';

import { useRoleNav } from '../navigation/useRoleNav';
const NAV_ITEMS = [
  { label: 'Logout', icon: LogOut },
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'My Profile', icon: User },
  { label: 'Daily Log', icon: NotebookPen },
  { label: 'Monthly Snapshot', icon: CalendarDays },
  { label: 'Browse Directory', icon: Search },
  { label: 'Help Centre', icon: HelpCircle },
  { label: 'Privacy & Sharing', icon: Lock },
];

const FUNCTIONAL_DOMAINS = [
  { label: 'Social', icon: Users },
  { label: 'Self-Care', icon: Heart },
  { label: 'Mobility', icon: Zap },
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

export default function DailySupportEvidenceLog() {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center shrink-0">
            <ShieldCheck size={15} className="text-white" />
          </div>
          <div>
            <div className="text-base font-black tracking-wider text-brand-700 leading-none">
              TMG180
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Participant Portal</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'Daily Log'} />
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-snug">
                  Daily Support Evidence Log
                </h1>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full mt-2">
                  <CheckCircle2 size={12} />
                  Submitted
                </span>
              </div>

              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shrink-0">
                <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center shrink-0">
                  AR
                </div>
                <div className="pr-3 border-r border-slate-200">
                  <p className="text-sm font-semibold text-slate-800 leading-none">
                    Alex Rivera
                  </p>
                  <p className="text-xs text-slate-400 mt-1">TMD-8825-XP</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <CalendarDays size={14} className="text-slate-400" />
                  Thursday, Oct 24, 2024
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white border-l-4 border-brand-500 border-y border-r border-slate-200 rounded-xl p-4">
              <Info size={16} className="text-brand-600 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-700">
                This log has been submitted. You can add a note if something needs to be
                included or clarified.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4 items-start">
              <div className="flex flex-col gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target size={16} className="text-brand-600" />
                    <h2 className="text-sm font-bold text-slate-900">Focus Areas</h2>
                  </div>

                  <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-2">
                    Goals Linked
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="text-sm font-medium text-brand-700 bg-purple-50 px-3 py-1.5 rounded-full">
                      Community Participation
                    </span>
                    <span className="text-sm font-medium text-brand-700 bg-purple-50 px-3 py-1.5 rounded-full">
                      Independence in Daily Living
                    </span>
                  </div>

                  <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-2">
                    Functional Domains
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {FUNCTIONAL_DOMAINS.map((d) => (
                      <span
                        key={d.label}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-700 bg-sky-50 px-3 py-1.5 rounded-full"
                      >
                        <d.icon size={13} />
                        {d.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ClipboardList size={16} className="text-sky-600" />
                    <h2 className="text-sm font-bold text-slate-900">Support Details</h2>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-2">
                        Impacts / Challenges
                      </p>
                      <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 text-sm text-slate-600">
                        Needed extra time for morning routine due to fatigue.
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-2">
                        Support Provided
                      </p>
                      <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 text-sm text-slate-600">
                        Guided verbal prompts for task sequencing.
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-2">
                        Outcome
                      </p>
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3 text-sm text-emerald-800">
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                        Successfully attended community art class.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="relative overflow-hidden bg-linear-to-br from-purple-200 via-purple-100 to-white rounded-2xl p-5">
                  <User
                    size={90}
                    strokeWidth={1}
                    className="absolute -top-3 -right-3 text-white/40"
                  />
                  <h3 className="relative text-sm font-bold text-fuchsia-700 mb-3">
                    Participant Voice
                  </h3>
                  <div className="relative bg-white rounded-xl rounded-tl-none p-4 text-sm text-slate-700 italic">
                    "I felt proud of finishing my painting."
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={15} className="text-sky-600" />
                    <h3 className="text-sm font-bold text-sky-700">
                      Baseline Comparison
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <ArrowUp size={14} />
                    </div>
                    <span className="text-sm text-slate-600">Better than baseline</span>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-2">Notes &amp; Addendums</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Edit3 size={15} className="text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-900">Add Note</h3>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">
                      Note Content
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter additional information or clarification..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">
                      Reason for Note
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Omitted detail, clarification"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3.5 py-2.5 text-xs text-slate-400">
                    <Clock size={12} className="shrink-0" />
                    Auto-populated with current date and time upon saving.
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-1">
                    <button className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                      Cancel
                    </button>
                    <Button variant="primary" icon={Save} className="w-auto! px-4! py-2!">
                      Save Note
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <History size={15} className="text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-900">History</h3>
                </div>

                <div className="relative pl-4">
                  <div className="absolute left-1 top-1.5 bottom-0 w-px bg-slate-200" />
                  <div className="relative flex flex-col gap-1">
                    <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-brand-500 ring-4 ring-purple-100" />
                    <p className="text-xs text-slate-400">Oct 25, 2024 • 09:15 AM</p>
                    <p className="text-xs font-semibold text-brand-600">
                      Reason: Clarification
                    </p>
                    <div className="bg-slate-50 rounded-lg px-3.5 py-3 text-sm text-slate-600 mt-1 leading-relaxed">
                      Participant mentioned later in the day that the art class made
                      them feel more connected to the community than usual.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
