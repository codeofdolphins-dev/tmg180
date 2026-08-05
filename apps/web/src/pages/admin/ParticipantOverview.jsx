import {
  Search,
  Bell,
  HelpCircle,
  LayoutDashboard,
  Users,
  UserCheck,
  FileCheck,
  ClipboardCheck,
  Settings,
  ShieldCheck,
  TrendingUp,
  Hourglass,
  CheckCircle2,
  FileCheck2,
  Upload,
  Download,
  MoreVertical,
} from 'lucide-react';

import { useRoleNav } from '../../navigation/useRoleNav';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Participant Directory', icon: Users },
  { label: 'Participant Overview', icon: UserCheck },
  { label: 'Personal Profile (FCA baseline)', icon: FileCheck },
  { label: 'Consent Audit Log', icon: ClipboardCheck },
  { label: 'Settings', icon: Settings },
];

const AGGREGATION = [
  { month: 'March 2024', active: '3,850', logs: '84,210', snapshots: '2,105', exports: '890' },
  { month: 'February 2024', active: '3,720', logs: '79,500', snapshots: '1,980', exports: '820' },
  { month: 'January 2024', active: '3,650', logs: '76,100', snapshots: '1,850', exports: '780' },
  { month: 'December 2023', active: '3,510', logs: '72,400', snapshots: '1,720', exports: '710' },
  { month: 'November 2023', active: '3,400', logs: '68,900', snapshots: '1,610', exports: '650' },
  { month: 'October 2023', active: '3,250', logs: '62,100', snapshots: '1,450', exports: '590' },
];

function NavItem({ icon: Icon, label, active }) {
  const go = useRoleNav('admin');
  return (
    <button
      onClick={() => go(label)}
      className={`w-full flex items-center gap-2.5 text-sm px-3 py-2.5 text-left transition-colors ${
        active
          ? 'bg-brand-700 text-white font-medium rounded-full'
          : 'text-slate-600 hover:bg-slate-100 rounded-lg'
      }`}
    >
      <Icon size={15} className="shrink-0" />
      <span className="leading-tight">{label}</span>
    </button>
  );
}

function DonutChart() {
  const segments = [
    { value: 70, color: '#6b21a8' },
    { value: 20, color: '#c4b5fd' },
    { value: 10, color: '#f1f0fa' },
  ];
  let acc = 0;
  const stops = segments
    .map((s) => {
      const start = acc;
      acc += s.value;
      return `${s.color} ${start}% ${acc}%`;
    })
    .join(', ');

  return (
    <div
      className="w-32 h-32 rounded-full flex items-center justify-center mx-auto"
      style={{ background: `conic-gradient(${stops})` }}
    >
      <div className="w-16 h-16 rounded-full bg-white" />
    </div>
  );
}

function LineChart({ data, color, dashed, fill }) {
  const width = 200;
  const height = 90;
  const max = Math.max(...data);
  const x = (i) => (i * width) / (data.length - 1);
  const y = (v) => height - (v / max) * height;

  const linePath = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
  const areaPath = `${linePath} L ${x(data.length - 1)} ${height} L ${x(0)} ${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24" preserveAspectRatio="none">
      {fill && (
        <>
          <defs>
            <linearGradient id={`fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#fill-${color.replace('#', '')})`} />
        </>
      )}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray={dashed ? '4 3' : undefined}
      />
    </svg>
  );
}

function BarChart({ data, color }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-24">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t"
          style={{ height: `${(v / max) * 100}%`, background: color }}
        />
      ))}
    </div>
  );
}

export default function ParticipantOverview() {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6 px-1">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
              alt="Admin avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-lg font-black tracking-wider text-brand-700 leading-none">
              TMG180
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">
              Admin Portal
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              {...item}
              active={item.label === 'Participant Overview'}
            />
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 flex-1 max-w-md">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search insights..."
              className="bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400 flex-1"
            />
          </div>
          <div className="flex items-center gap-4 text-slate-500 shrink-0">
            <button className="hover:text-slate-700 transition-colors">
              <Bell size={18} />
            </button>
            <button className="hover:text-slate-700 transition-colors">
              <HelpCircle size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Participant Overview</h1>
              <p className="text-sm text-slate-500 mt-1">
                Aggregated participant portal activity. No clinical data is shown.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-2.5">
              <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-800">
                <span className="font-semibold">Privacy Assured:</span> No participant
                clinical content or private record details are visible in the admin
                console.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5">
                <div className="absolute -top-6 -right-2 w-20 h-20 rounded-full bg-purple-200/70" />
                <div className="absolute -top-8 right-6 w-16 h-16 rounded-full bg-pink-200/70" />
                <p className="relative text-[10px] uppercase tracking-wide text-slate-400 mb-2">
                  Total Active Participants
                </p>
                <div className="relative flex items-center gap-2">
                  <p className="text-3xl font-bold text-slate-900">3,850</p>
                  <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                    <TrendingUp size={10} />
                    12%
                  </span>
                </div>
              </div>

              <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5">
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-sky-100" />
                <p className="relative text-[10px] uppercase tracking-wide text-slate-400 mb-2 max-w-[140px]">
                  Personal Profile (FCA baseline) Completed
                </p>
                <p className="relative text-3xl font-bold text-slate-900 mb-2">
                  3,438 <span className="text-lg font-medium text-slate-400">/ 3,850</span>
                </p>
                <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '89%' }} />
                </div>
              </div>

              <div className="flex flex-col gap-4 h-full">
                <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400 max-w-27.5">
                      Personal Profile (FCA baseline) In Progress
                    </p>
                    <div className="w-9 h-9 rounded-full bg-purple-100 text-brand-600 flex items-center justify-center shrink-0">
                      <Hourglass size={15} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">412</p>
                </div>
                <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">
                      Completion Rate
                    </p>
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={15} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">88%</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <FileCheck2 size={17} />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Monthly Snapshots Approved</p>
                  <p className="text-3xl font-bold text-slate-900">2,105</p>
                  <p className="text-xs text-slate-400">this month</p>
                </div>
                <ClipboardCheck size={72} className="absolute -bottom-4 right-4 text-slate-200" />
              </div>

              <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-brand-600 flex items-center justify-center shrink-0">
                  <Upload size={17} />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Snapshot Exports</p>
                  <p className="text-3xl font-bold text-slate-900">890</p>
                  <p className="text-xs text-slate-400">generated this month</p>
                </div>
                <Download size={72} className="absolute -bottom-4 right-4 text-purple-200" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Personal Profile (FCA baseline) Status
                  </h3>
                  <MoreVertical size={15} className="text-slate-400" />
                </div>
                <DonutChart />
                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-700" />
                    Completed
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-300" />
                    In Progress
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-100 border border-slate-200" />
                    Not Started
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Snapshot Approval Trend
                  </h3>
                  <span className="text-xs font-medium text-brand-700 bg-purple-100 px-2.5 py-1 rounded-full">
                    Last 6 Months
                  </span>
                </div>
                <LineChart
                  data={[1600, 1720, 1850, 1980, 2000, 2105]}
                  color="#3b82f6"
                  fill
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  {months.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Export Activity</h3>
                <BarChart data={[650, 710, 780, 820, 760, 890]} color="#34d399" />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  {months.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-4">
                  Directory Usage Trend
                </h3>
                <LineChart data={[1200, 1000, 1300, 1250, 1500, 1700]} color="#a855f7" dashed />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  {months.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Monthly Aggregation</h3>
                <button className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors">
                  <Download size={14} />
                  Export CSV
                </button>
              </div>
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="text-left text-xs text-slate-400">
                    <th className="font-medium pb-2">Month</th>
                    <th className="font-medium pb-2">Active Participants</th>
                    <th className="font-medium pb-2">Daily Logs Created</th>
                    <th className="font-medium pb-2">Snapshots Approved</th>
                    <th className="font-medium pb-2">Exports Generated</th>
                  </tr>
                </thead>
                <tbody>
                  {AGGREGATION.map((row) => (
                    <tr key={row.month} className="border-t border-slate-100">
                      <td className="py-2.5 text-slate-700 font-medium">{row.month}</td>
                      <td className="py-2.5 text-slate-600">{row.active}</td>
                      <td className="py-2.5 text-slate-600">{row.logs}</td>
                      <td className="py-2.5 text-slate-600">{row.snapshots}</td>
                      <td className="py-2.5 text-slate-600">{row.exports}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
