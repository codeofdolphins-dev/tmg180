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
  LogOut,
  Bell,
  MessageSquare,
  ArrowLeft,
  Info,
  FileText,
  Download,
  Clock,
  PenLine,
  CheckCircle2,
} from 'lucide-react';
import Button from '../components/ui/Button';

import { useNavigate } from 'react-router-dom';
import { useRoleNav } from '../navigation/useRoleNav';
import { WORKER_PATHS } from '../routes/paths';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Calendar', icon: Calendar },
  { label: 'Participants I support', icon: Users },
  { label: 'Daily Logs', icon: NotebookPen },
  { label: 'Monthly Snapshots', icon: TrendingUp },
  { label: 'Resources', icon: Folder },
  { label: 'Learning Hub', icon: GraduationCap },
  { label: 'Governance Standing', icon: Landmark },
  { label: 'Settings', icon: Settings },
  { label: 'Help Centre', icon: HelpCircle },
];

const HISTORY = [
  {
    version: 'v2024.1 (Current)',
    status: 'Pending',
    statusColor: 'text-amber-600',
    dot: 'bg-amber-500',
    note: 'Published: Oct 01, 2024',
  },
  {
    version: 'v2023.2',
    status: 'Acknowledged',
    statusColor: 'text-emerald-600',
    dot: 'bg-emerald-500',
    note: 'Acknowledged: Nov 15, 2023',
  },
];

function NavItem({ icon: Icon, label, active }) {
  const go = useRoleNav('worker');
  return (
    <button
      onClick={() => go(label)}
      className={`flex items-center gap-2.5 text-sm px-3 py-2.5 text-left rounded-lg transition-colors ${
        active ? 'text-brand-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={16} className={active ? 'text-brand-600' : 'text-slate-400'} />
      <span>{label}</span>
    </button>
  );
}

export default function GovernanceItemDetail() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-4 overflow-y-auto">
        <div className="mb-6 px-2">
          <div className="text-lg font-black tracking-wider text-brand-700 leading-none">
            TMG180
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Worker Portal</div>
        </div>

        <div className="w-14 h-14 rounded-full bg-slate-200 mb-6 ml-2 shrink-0" />

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'Governance Standing'} />
          ))}
        </nav>

        <div className="mt-auto pt-4">
          <button className="flex items-center gap-2.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg px-3 py-2.5 text-left transition-colors w-full">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-end gap-4 px-6 py-4 text-slate-500">
          <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:text-slate-700 transition-colors">
            <Bell size={16} />
          </button>
          <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:text-slate-700 transition-colors">
            <MessageSquare size={16} />
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-5">
            <button
              onClick={() => navigate(WORKER_PATHS.governance)}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors w-fit"
            >
              <ArrowLeft size={14} />
              Back to Governance Standing
            </button>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Governance item detail
              </h1>
              <p className="text-brand-600 font-semibold mt-1">
                Mandatory Policies acknowledgement
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start">
              <div className="flex flex-col gap-4">
                <div className="bg-purple-50/60 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                      <Info size={14} className="text-white" />
                    </div>
                    <h2 className="text-sm font-bold text-slate-900">Item Overview</h2>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    This acknowledgment is a gentle reminder of the shared agreements
                    that help keep our practice environment safe, supportive, and
                    aligned with professional standards. Reviewing these policies
                    annually ensures we are all working with the same foundational
                    understanding, allowing you to focus fully on providing excellent
                    care. Take your time to review the updated guidelines below.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-sky-600" />
                      <h2 className="text-sm font-bold text-slate-900">
                        Document Preview
                      </h2>
                    </div>
                    <Button variant="outline" icon={Download} className="w-auto! px-4! py-2!">
                      Download Guide
                    </Button>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-6">
                    <div className="bg-white rounded-lg p-6 flex flex-col gap-3">
                      <div className="h-3 w-32 bg-sky-200 rounded-full" />
                      <div className="h-2.5 w-full bg-sky-100 rounded-full" />
                      <div className="h-2.5 w-11/12 bg-sky-100 rounded-full" />
                      <div className="h-2.5 w-4/5 bg-sky-100 rounded-full" />
                      <div className="h-3 w-24 bg-sky-200 rounded-full mt-2" />
                      <div className="h-2.5 w-full bg-sky-100 rounded-full" />
                      <div className="h-2.5 w-3/4 bg-sky-100 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-600 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        I acknowledge these policies
                      </p>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                        I have read and understand these policies as part of my
                        independent practice, and agree to uphold these shared
                        standards.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full mb-3">
                    <Clock size={11} />
                    Needs review
                  </span>
                  <p className="text-sm text-amber-900/80 leading-relaxed mb-4">
                    We kindly ask that you review and acknowledge this item when you
                    have a quiet moment.
                  </p>
                  <Button variant="primary" icon={CheckCircle2} className="w-full!">
                    Mark as reviewed
                  </Button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={15} className="text-slate-500" />
                    <h3 className="text-sm font-bold text-slate-900">History</h3>
                  </div>
                  <div className="flex flex-col gap-4">
                    {HISTORY.map((h) => (
                      <div key={h.version} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${h.dot}`} />
                            <span className="text-sm font-medium text-slate-800">
                              {h.version}
                            </span>
                          </div>
                          <span className={`text-xs font-medium ${h.statusColor}`}>
                            {h.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 ml-3">{h.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <PenLine size={15} className="text-slate-500" />
                    <h3 className="text-sm font-bold text-slate-900">Personal Notes</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    A private space for your own reflections or reminders.
                  </p>
                  <textarea
                    placeholder="Add a note..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-600 placeholder:text-slate-400 outline-none focus:border-brand-600 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
