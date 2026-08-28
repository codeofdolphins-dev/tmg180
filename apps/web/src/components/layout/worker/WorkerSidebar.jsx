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
  Plus,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WORKER_PATHS as P, PUBLIC_PATHS } from '../../../routes/paths';
import { useAuthStore } from '../../../store';

/**
 * Fixed worker workspace sidebar — the one sidebar every worker screen shares.
 *
 * The 14 worker frames each drew their own variant (label "Worker Portal" /
 * "Worker Workspace" / "Your Independent Space", CTA top or bottom, Help vs
 * Help Centre). The item set is the same on all of them, so that set is what
 * ships here, in the participant sidebar's idiom so the two workspaces read as
 * one product. Sub-label follows the v2 workspace chooser ("Worker Workspace").
 *
 * The active item derives from the URL, so subpages highlight their section
 * (e.g. /worker/governance/item highlights "Governance Standing").
 */

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: P.dashboard },
  { label: 'Calendar', icon: Calendar, path: P.calendar },
  { label: 'Participants I support', icon: Users, path: P.participants },
  {
    label: 'Daily Logs',
    icon: NotebookPen,
    path: P.dailyLogs,
    match: [P.dailyLogs, P.dailyLogNew],
  },
  {
    label: 'Monthly Snapshots',
    icon: TrendingUp,
    path: P.snapshots,
    match: [P.snapshots, P.exportsEmpty],
  },
  { label: 'Resources', icon: Folder, path: P.resources },
  { label: 'Learning Hub', icon: GraduationCap, path: P.learningHub },
  { label: 'Governance Standing', icon: Landmark, path: P.governance },
];

const BOTTOM_ITEMS = [
  {
    label: 'Settings',
    icon: Settings,
    path: P.settings,
    match: [P.settings, P.profile],
  },
  { label: 'Help Centre', icon: HelpCircle, path: P.help },
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

export default function WorkerSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const signOut = useAuthStore((s) => s.signOut);

  const logout = () => {
    signOut();
    navigate(PUBLIC_PATHS.signIn, { replace: true });
  };

  return (
    <aside className="print:hidden fixed inset-y-0 left-0 z-20 w-64 bg-[#f8f9ff]/70 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col py-6 px-6 overflow-y-auto">
      <div className="mb-6 px-2">
        <div className="text-2xl font-bold text-brand-600 leading-tight">TMG180</div>
        <div className="text-sm font-medium text-slate-500 mt-1">Worker Workspace</div>
      </div>

      {/* The workspace's primary action — on most worker frames it sits in the sidebar. */}
      <button
        onClick={() => navigate(P.dailyLogNew)}
        className="mb-6 w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-full py-3 shadow-md transition-colors"
      >
        <Plus size={16} />
        <span>New Support Entry</span>
      </button>

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
