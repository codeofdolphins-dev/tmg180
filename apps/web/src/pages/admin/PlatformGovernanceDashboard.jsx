import {
  Search,
  Bell,
  HelpCircle,
  Settings,
  UserCircle,
  LifeBuoy,
  LogOut,
  ThumbsUp,
  Users,
  ShieldCheck,
  AlertTriangle,
  PieChart,
  FilePenLine,
  TrendingUp,
} from 'lucide-react';
import GovernanceSidebar, { GOV_NAV_ITEMS } from '../../components/layout/admin/GovernanceSidebar';

const NAV_ITEMS = [
  ...GOV_NAV_ITEMS,
  { label: 'Settings', icon: Settings },
  { label: 'Admin Profile', icon: UserCircle },
];

const BOTTOM_ITEMS = [
  { label: 'Support', icon: LifeBuoy },
  { label: 'Sign Out', icon: LogOut },
];

const STATS = [
  {
    label: 'Total Active Workers',
    value: '1,240',
    valueColor: 'text-brand-600',
    icon: ThumbsUp,
    iconBg: 'bg-purple-100 text-brand-600',
    trend: '+2.4% vs last month',
  },
  {
    label: 'Total Active Participants',
    value: '3,850',
    valueColor: 'text-blue-600',
    icon: Users,
    iconBg: 'bg-blue-100 text-blue-600',
    trend: '+5.1% vs last month',
  },
  {
    label: 'Policy Acknowledgements',
    value: '98.2%',
    valueColor: 'text-emerald-600',
    icon: ShieldCheck,
    iconBg: 'bg-emerald-100 text-emerald-600',
    progress: 98,
    progressColor: 'bg-emerald-500',
  },
  {
    label: 'Open Tickets',
    value: '14',
    valueColor: 'text-rose-600',
    icon: AlertTriangle,
    iconBg: 'bg-rose-100 text-rose-600',
    note: '4 high priority requiring action',
  },
  {
    label: 'Avg. Snapshot Completion',
    value: '88%',
    valueColor: 'text-brand-600',
    icon: PieChart,
    iconBg: 'bg-purple-100 text-brand-600',
    progress: 88,
    progressColor: 'bg-brand-600',
  },
  {
    label: 'Consent Updates (Month)',
    value: '412',
    valueColor: 'text-blue-700',
    icon: FilePenLine,
    iconBg: 'bg-blue-100 text-blue-600',
    note: 'Steady volume',
    noteTrend: true,
  },
];

function StatCard({ label, value, valueColor, icon: Icon, iconBg, trend, progress, progressColor, note, noteTrend }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 max-w-[140px]">
          {label}
        </p>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className={`text-3xl font-bold mb-3 ${valueColor}`}>{value}</p>

      {trend && (
        <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
          <TrendingUp size={12} />
          {trend}
        </div>
      )}
      {progress !== undefined && (
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {note && (
        <div
          className={`flex items-center gap-1 text-xs ${
            noteTrend ? 'text-emerald-600 font-medium' : 'text-slate-500'
          }`}
        >
          {noteTrend && <TrendingUp size={12} />}
          {note}
        </div>
      )}
    </div>
  );
}

export default function PlatformGovernanceDashboard() {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <GovernanceSidebar
        portalLabel="Governance Portal"
        activeItem="Dashboard"
        navItems={NAV_ITEMS}
        bottomItems={BOTTOM_ITEMS}
        showLogo={false}
        uppercaseLabel={false}
        actionButton={{ label: 'Export Report' }}
        hoverStyle="gradient"
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 w-80 shrink-0">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search governance records..."
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
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                alt="Admin avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                TMG180 Platform Governance
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                Platform-level verification metadata, policy versioning/acknowledgements,
                and incident/complaint tickets. No service-delivery oversight.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {STATS.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200 pt-6">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                  Regulatory Compliance
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  This platform operates in strict accordance with the Australian
                  Privacy Act 1988 (APPs) and the Notifiable Data Breaches (NDB)
                  scheme. All data shown is aggregated for governance oversight.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 shrink-0">
                <ShieldCheck size={20} className="text-brand-600" />
                <span>
                  Secure
                  <br />
                  Governance
                  <br />
                  Environment
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
