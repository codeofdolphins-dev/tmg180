import {
  Search,
  Bell,
  HelpCircle,
  Grid3x3,
  Eye,
  Upload,
  ClipboardList,
  CheckCircle2,
  Clock,
  RefreshCw,
  Settings,
  UserCircle,
} from 'lucide-react';
import GovernanceSidebar, { GOV_NAV_ITEMS } from '../components/layout/GovernanceSidebar';
import Button from '../components/ui/Button';

const NAV_ITEMS = [...GOV_NAV_ITEMS, { label: 'Settings', icon: Settings }];
const BOTTOM_ITEMS = [{ label: 'Admin Profile', icon: UserCircle }];

const STATS = [
  { label: 'Policies Active', value: '12', icon: ClipboardList, tone: 'blue' },
  { label: 'Acknowledgements Completed', value: '1,248', icon: CheckCircle2, tone: 'green' },
  { label: 'Needs Review', value: '8', icon: Clock, tone: 'amber' },
  { label: 'Due Soon', value: '15', icon: RefreshCw, tone: 'purple' },
  { label: 'Version Updates', value: '3', icon: Clock, tone: 'teal' },
];

const TONE_BG = {
  blue: 'bg-sky-100 text-sky-600',
  green: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-600',
  purple: 'bg-purple-100 text-brand-600',
  teal: 'bg-teal-100 text-teal-600',
};

const POLICY_BARS = [
  { label: 'Code of Conduct', completed: 92, pending: 8 },
  { label: 'Data Privacy', completed: 85, pending: 15 },
  { label: 'Safety', completed: 62, pending: 22 },
  { label: 'Reporting', completed: 48, pending: 32 },
  { label: 'Ethics', completed: 90, pending: 10 },
];

const ADOPTION_POINTS = [
  { label: 'Week 1', value: 5 },
  { label: 'Week 2', value: 35 },
  { label: 'Week 3', value: 62 },
  { label: 'Week 4', value: 70 },
  { label: 'Week 5', value: 82 },
  { label: 'Week 6', value: 92 },
];

const POLICIES = [
  {
    name: 'Code of Conduct',
    version: 'v2.1',
    audience: 'Workers',
    status: 'Completed',
    lastUpdated: '12 Jun 2026',
    dueDate: 'N/A',
  },
  {
    name: 'Data Privacy Policy',
    version: 'v3.0',
    audience: 'All Users',
    status: 'Needs Review',
    lastUpdated: '05 Jun 2026',
    dueDate: '30 Jun 2026',
  },
  {
    name: 'Incident Reporting',
    version: 'v1.4',
    audience: 'Workers',
    status: 'Due Soon',
    lastUpdated: '20 May 2026',
    dueDate: '25 Jun 2026',
  },
  {
    name: 'Workplace Safety',
    version: 'v2.0',
    audience: 'Workers',
    status: 'Not completed yet',
    lastUpdated: 'N/A',
    dueDate: '15 Jul 2026',
  },
];

const STATUS_STYLES = {
  Completed: 'bg-emerald-100 text-emerald-700',
  'Needs Review': 'bg-amber-100 text-amber-700',
  'Due Soon': 'bg-purple-100 text-brand-700',
  'Not completed yet': 'bg-sky-100 text-sky-700',
};

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

function AcknowledgementChart() {
  const yTicks = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between h-40 text-[9px] text-slate-400 shrink-0">
          {yTicks.map((t) => (
            <span key={t}>{t}%</span>
          ))}
        </div>
        <div className="flex-1 flex items-end justify-between gap-4 h-40 border-b border-slate-100 px-2">
          {POLICY_BARS.map((b) => (
            <div key={b.label} className="flex-1 flex flex-col items-center justify-end h-full gap-0.5">
              <div
                className="w-full max-w-9 rounded-t bg-sky-200"
                style={{ height: `${b.pending}%` }}
              />
              <div
                className="w-full max-w-9 bg-emerald-400"
                style={{ height: `${b.completed}%` }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between px-2 mt-2 pl-8">
        {POLICY_BARS.map((b) => (
          <span
            key={b.label}
            className="flex-1 text-center text-[10px] text-slate-400 -rotate-12 origin-top whitespace-nowrap"
          >
            {b.label}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Completed
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-sky-200" />
          Pending
        </div>
      </div>
    </div>
  );
}

function VersionAdoptionChart() {
  const width = 320;
  const height = 150;
  const padBottom = 18;
  const padLeft = 28;

  const x = (i) => padLeft + (i * (width - padLeft)) / (ADOPTION_POINTS.length - 1);
  const y = (v) => height - padBottom - (v / 100) * (height - padBottom);

  const linePath = ADOPTION_POINTS.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p.value)}`
  ).join(' ');
  const areaPath = `${linePath} L ${x(ADOPTION_POINTS.length - 1)} ${
    height - padBottom
  } L ${x(0)} ${height - padBottom} Z`;

  const yTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  return (
    <svg viewBox={`0 0 ${width} ${height + 14}`} className="w-full h-44">
      <defs>
        <linearGradient id="adoptionFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {yTicks.map((tick) => (
        <g key={tick}>
          <text x={0} y={y(tick) + 3} fontSize="8" fill="#94a3b8">
            {tick}%
          </text>
        </g>
      ))}

      <path d={areaPath} fill="url(#adoptionFill)" />
      <path
        d={linePath}
        fill="none"
        stroke="#7c3aed"
        strokeWidth="2"
        strokeDasharray="4 3"
      />

      {ADOPTION_POINTS.map((p, i) => (
        <text
          key={p.label}
          x={x(i)}
          y={height + 12}
          fontSize="8"
          fill="#94a3b8"
          textAnchor="middle"
        >
          {p.label}
        </text>
      ))}
    </svg>
  );
}

export default function GovernanceStanding() {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <GovernanceSidebar
        activeItem="Governance Standing"
        portalLabel="SaaS Admin Portal"
        logo="ring"
        navItems={NAV_ITEMS}
        bottomItems={BOTTOM_ITEMS}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 w-72 shrink-0">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search governance metadata..."
              className="bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400 flex-1 min-w-0"
            />
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <button className="hover:text-slate-700 transition-colors">
              <Bell size={18} />
            </button>
            <button className="hover:text-slate-700 transition-colors">
              <HelpCircle size={18} />
            </button>
            <button className="hover:text-slate-700 transition-colors">
              <Grid3x3 size={18} />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Admin avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Governance Standing</h1>
              <p className="text-sm text-slate-500 mt-1">
                Platform-level governance metadata and acknowledgement status.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" icon={Eye} className="w-auto! px-4! py-2.5!">
                View Policy
              </Button>
              <Button variant="primary" icon={Upload} className="w-auto! px-5! py-2.5!">
                Export Metadata
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4">
                Acknowledgement by Policy
              </h3>
              <AcknowledgementChart />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4">
                Version Adoption Trend
              </h3>
              <VersionAdoptionChart />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Policy Status Repository</h3>
              <button className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors">
                Filter ▾
              </button>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400">
                  <th className="font-medium pb-2">Policy / Item Name</th>
                  <th className="font-medium pb-2">Version</th>
                  <th className="font-medium pb-2">Audience</th>
                  <th className="font-medium pb-2">Acknowledgement Status</th>
                  <th className="font-medium pb-2">Last Updated</th>
                  <th className="font-medium pb-2">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {POLICIES.map((p) => (
                  <tr key={p.name} className="border-t border-slate-100">
                    <td className="py-3 text-slate-700 font-medium">{p.name}</td>
                    <td className="py-3 text-slate-500">{p.version}</td>
                    <td className="py-3 text-slate-500">{p.audience}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[p.status]}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">{p.lastUpdated}</td>
                    <td className="py-3 text-slate-500">{p.dueDate}</td>
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
