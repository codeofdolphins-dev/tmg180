import {
  Download,
  Plus,
  FolderOpen,
  Eye,
  CheckCircle2,
  Clock,
  SlidersHorizontal,
  MoreVertical,
  Settings,
  UserCircle,
} from 'lucide-react';
import GovernanceLayout from '../components/layout/GovernanceLayout';
import { GOV_NAV_ITEMS } from '../components/layout/GovernanceSidebar';
import Button from '../components/ui/Button';

const NAV_ITEMS = [...GOV_NAV_ITEMS, { label: 'Settings', icon: Settings }];
const BOTTOM_ITEMS = [{ label: 'Admin Profile', icon: UserCircle }];

const STATS = [
  {
    label: 'Open Tickets',
    value: '24',
    icon: FolderOpen,
    bg: 'bg-emerald-800/10',
    iconBg: 'bg-white',
    iconColor: 'text-emerald-700',
  },
  {
    label: 'Needs Review',
    value: '12',
    icon: Eye,
    bg: 'bg-rose-800/10',
    iconBg: 'bg-white',
    iconColor: 'text-rose-600',
  },
  {
    label: 'Resolved',
    value: '156',
    icon: CheckCircle2,
    bg: 'bg-purple-800/10',
    iconBg: 'bg-white',
    iconColor: 'text-brand-600',
  },
  {
    label: 'Average Response Time',
    value: '4.2h',
    icon: Clock,
    bg: 'bg-slate-500/10',
    iconBg: 'bg-white',
    iconColor: 'text-sky-700',
  },
];

const STATUS_STYLES = {
  'Needs review': 'bg-rose-100 text-rose-700',
  Open: 'bg-emerald-100 text-emerald-700',
  'In review': 'bg-sky-100 text-sky-700',
  Resolved: 'bg-purple-100 text-brand-700',
};

const TICKETS = [
  {
    id: 'TCK-892',
    type: 'Complaint',
    created: 'Oct 24, 2023',
    role: 'Participant',
    status: 'Needs review',
    updated: '2 hours ago',
    admin: 'Sarah Jenkins',
  },
  {
    id: 'TCK-891',
    type: 'Incident',
    created: 'Oct 23, 2023',
    role: 'Worker',
    status: 'Open',
    updated: '1 day ago',
    admin: 'Unassigned',
  },
  {
    id: 'TCK-885',
    type: 'General Inquiry',
    created: 'Oct 20, 2023',
    role: 'Supervisor',
    status: 'In review',
    updated: '3 days ago',
    admin: 'Mark Davis',
  },
  {
    id: 'TCK-870',
    type: 'Incident',
    created: 'Oct 15, 2023',
    role: 'Participant',
    status: 'Resolved',
    updated: 'Oct 18, 2023',
    admin: 'Sarah Jenkins',
  },
];

function StatCard({ label, value, icon: Icon, bg, iconBg, iconColor }) {
  return (
    <div className={`rounded-xl p-4 ${bg}`}>
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center mb-6 ${iconBg} ${iconColor}`}
      >
        <Icon size={16} />
      </div>
      <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function IncidentsComplaints() {
  return (
    <GovernanceLayout
      portalLabel="Admin Portal"
      activeItem="Incidents"
      navItems={NAV_ITEMS}
      bottomItems={BOTTOM_ITEMS}
      showLogo={false}
      uppercaseLabel={false}
      searchPlaceholder="Search..."
      showHelp
      showSupport={false}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Incidents &amp; Complaints</h1>
            <p className="text-sm text-slate-500 mt-1">
              Governance-level incident and complaint tickets.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" icon={Download} className="w-auto! px-4! py-2.5!">
              Export metadata
            </Button>
            <Button variant="primary" icon={Plus} className="w-auto! px-5! py-2.5!">
              Create ticket
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Recent Tickets</h3>
            <div className="flex items-center gap-3 text-slate-400">
              <button className="hover:text-slate-600 transition-colors">
                <SlidersHorizontal size={16} />
              </button>
              <button className="hover:text-slate-600 transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400">
                <th className="font-medium pb-2">Ticket ID</th>
                <th className="font-medium pb-2">Type</th>
                <th className="font-medium pb-2">Created date</th>
                <th className="font-medium pb-2">Submitted by role</th>
                <th className="font-medium pb-2">Status</th>
                <th className="font-medium pb-2">Last updated</th>
                <th className="font-medium pb-2">Assigned admin</th>
              </tr>
            </thead>
            <tbody>
              {TICKETS.map((t) => (
                <tr key={t.id} className="border-t border-slate-100">
                  <td className="py-3 text-slate-700 font-semibold">{t.id}</td>
                  <td className="py-3 text-slate-600">{t.type}</td>
                  <td className="py-3 text-slate-500">{t.created}</td>
                  <td className="py-3 text-slate-600">{t.role}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[t.status]}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{t.updated}</td>
                  <td className="py-3 text-slate-600">{t.admin}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-400">Showing 1 to 4 of 24 entries</p>
            <div className="flex items-center gap-1.5 text-sm">
              <button className="text-slate-400 px-2 py-1 hover:text-slate-600 transition-colors">
                Prev
              </button>
              <button className="w-7 h-7 rounded-full bg-brand-600 text-white font-medium">
                1
              </button>
              <button className="w-7 h-7 rounded-full text-slate-600 hover:bg-slate-100 transition-colors">
                2
              </button>
              <button className="w-7 h-7 rounded-full text-slate-600 hover:bg-slate-100 transition-colors">
                3
              </button>
              <button className="text-slate-600 px-2 py-1 hover:text-slate-900 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </GovernanceLayout>
  );
}
