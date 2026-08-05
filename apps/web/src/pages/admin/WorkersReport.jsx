import {
  Search,
  Bell,
  HelpCircle,
  Upload,
  Users,
  BadgeCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  ArrowRight,
} from 'lucide-react';
import GovernanceSidebar from '../../components/layout/admin/GovernanceSidebar';
import Button from '../../components/ui/Button';

const STATS = [
  { label: 'Active workers', value: '1,248', icon: Users, tone: 'purple' },
  { label: 'Profiles published', value: '1,102', icon: BadgeCheck, tone: 'blue' },
  { label: 'Gov items completed', value: '98%', icon: CheckCircle2, tone: 'green' },
  { label: 'Policies needing review', value: '43', icon: AlertTriangle, tone: 'red' },
  { label: 'Verification updates', value: '156', icon: RefreshCw, tone: 'violet' },
];

const TONE_BG = {
  purple: 'bg-purple-100 text-brand-600',
  blue: 'bg-sky-100 text-sky-600',
  green: 'bg-emerald-100 text-emerald-600',
  red: 'bg-rose-100 text-rose-600',
  violet: 'bg-violet-100 text-violet-600',
};

const TREND_POINTS = [
  { month: 'May', value: 850 },
  { month: 'Jun', value: 955 },
  { month: 'Jul', value: 1000 },
  { month: 'Aug', value: 1055 },
  { month: 'Sep', value: 1090 },
  { month: 'Oct', value: 1150 },
];

const Y_TICKS = [1150, 1100, 1050, 1000, 950, 900, 850, 800];

const WORKERS = [
  {
    id: 'W-8472',
    name: 'Alex M.',
    status: 'Published',
    standing: 'Completed',
    lastAck: 'Oct 12, 2023',
  },
  {
    id: 'W-9912',
    name: 'Sam K.',
    status: 'Draft',
    standing: 'Needs Review',
    lastAck: 'Sep 05, 2023',
  },
  {
    id: 'W-2341',
    name: 'Jordan T.',
    status: 'Published',
    standing: 'Completed',
    lastAck: 'Oct 20, 2023',
  },
  {
    id: 'W-7754',
    name: 'Taylor R.',
    status: 'Published',
    standing: 'Needs Review',
    lastAck: 'Aug 14, 2023',
  },
];

function StatCard({ label, value, icon: Icon, tone }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-start justify-between gap-2 mb-4">
        <p className="text-xs text-slate-400 leading-tight">{label}</p>
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${TONE_BG[tone]}`}
        >
          <Icon size={13} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ProfileCompletionChart() {
  const width = 460;
  const height = 170;
  const padLeft = 34;
  const padBottom = 20;
  const min = 800;
  const max = 1150;

  const x = (i) =>
    padLeft + (i * (width - padLeft)) / (TREND_POINTS.length - 1);
  const y = (v) =>
    ((max - v) / (max - min)) * (height - padBottom);

  const linePath = TREND_POINTS.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p.value)}`
  ).join(' ');
  const areaPath = `${linePath} L ${x(TREND_POINTS.length - 1)} ${
    height - padBottom
  } L ${x(0)} ${height - padBottom} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height + 16}`} className="w-full h-48">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {Y_TICKS.map((tick) => (
        <g key={tick}>
          <line
            x1={padLeft}
            x2={width}
            y1={y(tick)}
            y2={y(tick)}
            stroke="#eef2f6"
            strokeWidth="1"
          />
          <text x={0} y={y(tick) + 3} fontSize="9" fill="#94a3b8">
            {tick}
          </text>
        </g>
      ))}

      <path d={areaPath} fill="url(#trendFill)" />
      <path d={linePath} fill="none" stroke="#7c3aed" strokeWidth="2.5" />

      {TREND_POINTS.map((p, i) => (
        <circle
          key={p.month}
          cx={x(i)}
          cy={y(p.value)}
          r="3.5"
          fill="#fff"
          stroke="#7c3aed"
          strokeWidth="2"
        />
      ))}

      {TREND_POINTS.map((p, i) => (
        <text
          key={p.month}
          x={x(i)}
          y={height + 12}
          fontSize="9"
          fill="#94a3b8"
          textAnchor="middle"
        >
          {p.month}
        </text>
      ))}
    </svg>
  );
}

const STANDING_SEGMENTS = [
  { label: 'Completed', value: 68, color: '#10b981' },
  { label: 'Pending', value: 20, color: '#60a5fa' },
  { label: 'Needs Review', value: 12, color: '#fca5a5' },
];

function GovernanceStandingChart() {
  let acc = 0;
  const stops = STANDING_SEGMENTS.map((s) => {
    const start = acc;
    acc += s.value;
    return `${s.color} ${start}% ${acc}%`;
  }).join(', ');

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-36 h-36 rounded-full flex items-center justify-center"
        style={{ background: `conic-gradient(${stops})` }}
      >
        <div className="w-20 h-20 rounded-full bg-white" />
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
        {STANDING_SEGMENTS.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: s.color }}
            />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusDot({ color }) {
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${color}`} />;
}

export default function WorkersReport() {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <GovernanceSidebar activeItem="Workers Report" />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 w-64 shrink-0">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search metadata..."
              className="bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400 flex-1 min-w-0"
            />
          </div>

          <div className="flex items-center gap-6">
            <h2 className="text-base font-bold text-slate-900 whitespace-nowrap">
              TMG180 Governance
            </h2>
            <div className="flex items-center gap-4 text-slate-500">
              <button className="hover:text-slate-700 transition-colors">
                <Bell size={18} />
              </button>
              <button className="hover:text-slate-700 transition-colors">
                <HelpCircle size={18} />
              </button>
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Admin avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Workers Report</h1>
              <p className="text-sm text-slate-500 mt-1">
                Platform-level worker verification and governance metadata.
              </p>
            </div>
            <Button variant="primary" icon={Upload} className="w-auto! px-5! py-2.5!">
              Export metadata report
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                Profile Completion Trend
              </h3>
              <ProfileCompletionChart />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                Governance Standing
              </h3>
              <GovernanceStandingChart />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Worker Registry</h3>
              <button className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors">
                View all records
                <ArrowRight size={14} />
              </button>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400">
                  <th className="font-medium pb-2">Worker ID</th>
                  <th className="font-medium pb-2">Display Name</th>
                  <th className="font-medium pb-2">Profile Status</th>
                  <th className="font-medium pb-2">Governance Standing</th>
                  <th className="font-medium pb-2">Last Ack.</th>
                  <th className="font-medium pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {WORKERS.map((w) => (
                  <tr key={w.id} className="border-t border-slate-100">
                    <td className="py-3 text-slate-500">{w.id}</td>
                    <td className="py-3 text-slate-700 font-medium">{w.name}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <StatusDot
                          color={
                            w.status === 'Published' ? 'bg-emerald-500' : 'bg-slate-400'
                          }
                        />
                        {w.status}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        {w.standing === 'Completed' ? (
                          <CheckCircle2 size={14} className="text-emerald-500" />
                        ) : (
                          <AlertTriangle size={14} className="text-amber-500" />
                        )}
                        <span className="text-slate-600">{w.standing}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-500">{w.lastAck}</td>
                    <td className="py-3">
                      <button className="w-7 h-7 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center hover:bg-sky-100 transition-colors">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
