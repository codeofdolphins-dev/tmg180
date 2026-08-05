import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  Users,
  NotebookPen,
  TrendingUp,
  Folder,
  GraduationCap,
  Landmark,
  Settings,
  HelpCircle,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Clock,
  MapPin,
  Video,
  CheckCircle2,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useRoleNav } from '../navigation/useRoleNav';
import { WORKER_PATHS } from '../routes/paths';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Calendar', icon: CalendarIcon },
  { label: 'Participants I support', icon: Users },
  { label: 'Daily Logs', icon: NotebookPen },
  { label: 'Monthly Snapshots', icon: TrendingUp },
  { label: 'Resources', icon: Folder },
  { label: 'Learning Hub', icon: GraduationCap },
  { label: 'Governance Standing', icon: Landmark },
  { label: 'Settings', icon: Settings },
  { label: 'Help Centre', icon: HelpCircle },
];

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const CALENDAR_ROWS = [
  [null, null, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, null, null],
];

const DAY_INDICATORS = {
  8: ['bg-emerald-400'],
  10: ['bg-violet-500'],
  15: ['bg-emerald-400', 'bg-violet-500'],
};

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

function DayCell({ day }) {
  if (!day) return <div className="aspect-square" />;

  const selected = day === 15;
  const indicators = DAY_INDICATORS[day];

  return (
    <div
      className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-1.5 border transition-colors ${
        selected
          ? 'border-brand-500 bg-purple-50'
          : 'border-transparent hover:bg-slate-50'
      }`}
    >
      <span className="text-sm text-slate-700">{day}</span>
      {indicators && (
        <div className="flex gap-0.5 w-6 h-1">
          {indicators.map((c, i) => (
            <span key={i} className={`flex-1 rounded-full ${c}`} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Calendar() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center shrink-0 text-white font-bold">
            T
          </div>
          <div>
            <div className="text-base font-black tracking-wider text-brand-700 leading-none">
              TMG180
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">
              Worker Portal
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'Calendar'} />
          ))}
        </nav>

        <div className="mt-auto pt-4 flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-brand-400 to-fuchsia-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-900 leading-none">
              Alex Mercer
            </p>
            <p className="text-xs text-slate-400 mt-1">Worker</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-end gap-4 px-6 py-4 text-brand-600">
          <button className="hover:text-brand-800 transition-colors">
            <Bell size={18} />
          </button>
          <button className="w-8 h-8 rounded-full border-2 border-brand-600 flex items-center justify-center">
            <User size={16} />
          </button>
        </header>

        <main className="flex-1 px-6 pb-6">
          <div className="max-w-6xl mx-auto flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
              <p className="text-sm text-slate-500 mt-1">
                View your upcoming support sessions and check-ins.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 items-start">
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <button className="text-sm font-medium text-brand-600 border border-purple-200 rounded-full px-4 py-1.5 hover:bg-purple-50 transition-colors">
                      Today
                    </button>
                    <div className="flex items-center gap-2">
                      <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <ChevronLeft size={18} />
                      </button>
                      <h2 className="text-base font-bold text-slate-900 w-32 text-center">
                        October 2023
                      </h2>
                      <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center bg-slate-100 rounded-full p-1 text-sm">
                    <button className="px-3.5 py-1.5 rounded-full bg-white shadow-sm font-medium text-slate-800">
                      Month
                    </button>
                    <button className="px-3.5 py-1.5 rounded-full text-slate-500">
                      Week
                    </button>
                    <button className="px-3.5 py-1.5 rounded-full text-slate-500">
                      List
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {WEEKDAYS.map((d) => (
                    <div
                      key={d}
                      className="text-center text-xs font-medium text-slate-400 pb-2"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1">
                  {CALENDAR_ROWS.map((row, i) => (
                    <div key={i} className="grid grid-cols-7 gap-1">
                      {row.map((day, j) => (
                        <DayCell key={j} day={day} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 bg-purple-50 rounded-2xl p-4">
                  <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                    <Lightbulb size={15} className="text-white" />
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Daily Support Evidence Logs can be added after a support session.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Agenda</h2>
                  <span className="text-xs font-medium text-brand-700 bg-purple-100 px-2.5 py-1 rounded-full">
                    Oct 15
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-900">Liam</h3>
                    <span className="text-xs font-medium text-brand-700 bg-purple-100 px-2.5 py-0.5 rounded-full shrink-0">
                      Upcoming
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      10:00 AM - 11:30 AM
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-400" />
                      Community Centre Library
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <CheckCircle2 size={13} />
                      Active consent
                    </div>
                  </div>
                  <button className="w-full bg-brand-600 hover:bg-brand-800 text-white text-sm font-medium rounded-full py-2.5 transition-colors">
                    Open support tools
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-900">Emma</h3>
                    <span className="text-xs font-medium text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full shrink-0">
                      Completed
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      1:00 PM - 2:00 PM
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Video size={13} className="text-slate-400" />
                      Online Check-in
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Log draft in progress
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(WORKER_PATHS.dailyLogNew)}
                    className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-brand-600 text-sm font-medium rounded-full py-2.5 transition-colors"
                  >
                    Continue Daily Log
                  </button>
                </div>

                <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-900">Noah</h3>
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full shrink-0">
                      Completed
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      Yesterday, 3:30 PM
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <CheckCircle2 size={13} />
                      Log submitted
                    </div>
                  </div>
                  <button className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-full py-2.5 transition-colors">
                    View details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
