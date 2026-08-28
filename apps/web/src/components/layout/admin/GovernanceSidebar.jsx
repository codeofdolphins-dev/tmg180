import {
  LayoutDashboard,
  FileBarChart2,
  Landmark,
  ShieldCheck,
  AlertTriangle,
  Users,
  ClipboardCheck,
  Settings,
  UserCircle,
  LogOut,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_PATHS as P, PUBLIC_PATHS } from '../../../routes/paths';
import { useAuthStore } from '../../../store';

/**
 * Fixed governance portal sidebar — the one sidebar every admin screen shares,
 * in the participant / worker sidebar idiom so the three portals read as one
 * product.
 *
 * The admin frames each drew their own variant (different item sets, labels,
 * logos, active styles). The item set here is the full portal map; per-frame
 * variants were dropped for consistency, the same call made for the worker
 * workspace. The active item derives from the URL, so subpages highlight
 * their section (e.g. /admin/incidents/ticket highlights "Incidents").
 */

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: P.dashboard },
  {
    label: 'Workers Report',
    icon: FileBarChart2,
    path: P.workersReport,
    match: [P.workersReport, P.reportDetail, P.reportNew],
  },
  { label: 'Governance Standing', icon: Landmark, path: P.governanceStanding },
  { label: 'Policies', icon: ShieldCheck, path: P.policies },
  { label: 'Incidents', icon: AlertTriangle, path: P.incidents },
  { label: 'Participant Overview', icon: Users, path: P.participantOverview },
  { label: 'Consent Audit Log', icon: ClipboardCheck, path: P.consentAuditLog },
];

const BOTTOM_ITEMS = [
  { label: 'Settings', icon: Settings, path: P.settings },
  { label: 'Admin Profile', icon: UserCircle, path: P.profile },
];

function isActive(pathname, { path, match }) {
  return (match ?? [path]).some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function NavItem({ icon: Icon, label, active, wide, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-full transition-colors ${
        wide ? 'text-base' : 'text-sm'
      } ${
        active
          ? 'bg-brand-600/30 text-brand-700 font-semibold'
          : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
      }`}
    >
      <Icon size={17} className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}

export default function GovernanceSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const signOut = useAuthStore((s) => s.signOut);

  const logout = () => {
    signOut();
    navigate(PUBLIC_PATHS.signIn, { replace: true });
  };

  return (
    <aside className="print:hidden fixed inset-y-0 left-0 z-20 w-64 bg-[#f8f9ff]/70 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col py-6 px-6 overflow-y-auto">
      <div className="mb-10 px-2">
        <div className="text-2xl font-bold text-brand-600 leading-tight">TMG180</div>
        <div className="text-sm font-medium text-slate-500 mt-1">Governance Portal</div>
      </div>

      <nav className="flex flex-col gap-2">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={isActive(pathname, item)}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

      <div className="mt-auto pt-6 flex flex-col gap-2">
        {BOTTOM_ITEMS.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={isActive(pathname, item)}
            onClick={() => navigate(item.path)}
            wide
          />
        ))}
        <NavItem icon={LogOut} label="Sign Out" onClick={logout} wide />
      </div>
    </aside>
  );
}
