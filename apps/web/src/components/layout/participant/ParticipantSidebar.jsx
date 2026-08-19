import {
  LayoutDashboard,
  User,
  NotebookPen,
  CalendarDays,
  Search,
  HelpCircle,
  Lock,
  LogOut,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PARTICIPANT_PATHS as P, PUBLIC_PATHS } from '../../../routes/paths';
import { useAuthStore } from '../../../store';

/**
 * Fixed participant portal sidebar (Figma: Participant Dashboard frame — the
 * canonical design; per-page sidebar variants were dropped for consistency).
 * The active item derives from the URL, so subpages highlight their section
 * (e.g. /participant/profile/about-me highlights "My Profile").
 */

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: P.dashboard },
  { label: 'My Profile', icon: User, path: P.profile },
  { label: 'Daily Log', icon: NotebookPen, path: P.dailyLog },
  { label: 'Monthly Snapshot', icon: CalendarDays, path: P.snapshot },
  { label: 'Verified Workers', icon: Search, path: P.browseWorkers },
];

const BOTTOM_ITEMS = [
  { label: 'Help Centre', icon: HelpCircle, path: P.help },
  { label: 'Privacy & Sharing', icon: Lock, path: P.privacySharing },
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
          ? 'bg-purple-600/30 text-brand-700 font-semibold'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={17} className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}

export default function ParticipantSidebar() {
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
        <div className="text-sm font-medium text-slate-500 mt-1">Participant Portal</div>
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
        <NavItem icon={LogOut} label="Logout" onClick={logout} wide />
      </div>
    </aside>
  );
}
