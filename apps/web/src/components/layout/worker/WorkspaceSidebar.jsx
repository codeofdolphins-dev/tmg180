import {
  Home,
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
  Plus,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../../store';
import { WORKER_PATHS } from '../../../routes/paths';
import { useRoleNav } from '../../../navigation/useRoleNav';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Calendar', icon: Calendar },
];

const NAV_ITEMS_LOWER = [
  { label: 'Daily Logs', icon: NotebookPen },
  { label: 'Monthly Snapshots', icon: TrendingUp },
  { label: 'Resources', icon: Folder },
  { label: 'Learning Hub', icon: GraduationCap },
  { label: 'Governance Standing', icon: Landmark },
  { label: 'Settings', icon: Settings },
  { label: 'Help', icon: HelpCircle },
];

export const WORKSPACE_NAV_ITEMS_LOWER = NAV_ITEMS_LOWER;
export const WORKSPACE_HELP_ICON = HelpCircle;

function NavButton({ label, icon: Icon, active }) {
  const go = useRoleNav(ROLES.WORKER);
  return (
    <button
      onClick={() => go(label)}
      className={`flex items-center gap-2.5 text-sm px-3 py-3 text-left transition-colors ${
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

function ParticipantsNavItem({ active, placeholder }) {
  if (active || !placeholder) {
    return <NavButton label="Participants I support" icon={Users} active={active} />;
  }
  return (
    <div className="px-3 py-3">
      <div className="flex items-start gap-2.5">
        <Users size={16} className="text-slate-500 mt-1 shrink-0" />
        <div className="flex-1 h-16 border-2 border-dashed border-slate-300 rounded-lg" />
      </div>
      <p className="text-xs text-slate-500 mt-2 ml-6.5">
        Participants I support
      </p>
    </div>
  );
}

const NewEntryButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(WORKER_PATHS.dailyLogNew)}
      className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium rounded-full py-2.5 transition-colors"
    >
      <Plus size={16} />
      <span>New Support Entry</span>
    </button>
  );
};

export default function WorkspaceSidebar({
  portalLabel = 'Worker Workspace',
  activeItem = 'Daily Logs',
  lowerNavItems = NAV_ITEMS_LOWER,
  bottomNavItems = [],
  showParticipantsPlaceholder = true,
  newEntryPosition = 'bottom',
}) {
  const go = useRoleNav(ROLES.WORKER);
  return (
    <aside className="w-56 shrink-0 bg-slate-100 border-r border-slate-200 flex flex-col py-6 px-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6 px-2">
        <div className="w-9 h-9 rounded-full bg-brand-700 flex items-center justify-center shrink-0">
          <Home size={17} className="text-white" />
        </div>
        <div>
          <div className="text-lg font-black tracking-wider text-brand-700 leading-none">
            TMG180
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{portalLabel}</div>
        </div>
      </div>

      {newEntryPosition === 'top' && (
        <div className="mb-4">
          <NewEntryButton />
        </div>
      )}

      <nav className="flex flex-col gap-2">
        {NAV_ITEMS.map((item) => (
          <NavButton key={item.label} {...item} active={item.label === activeItem} />
        ))}
      </nav>

      <ParticipantsNavItem
        active={activeItem === 'Participants I support'}
        placeholder={showParticipantsPlaceholder}
      />

      <nav className="flex flex-col gap-2 mt-2">
        {lowerNavItems.map((item) => (
          <NavButton key={item.label} {...item} active={item.label === activeItem} />
        ))}
      </nav>

      <div className="mt-auto pt-6 flex flex-col gap-3">
        {bottomNavItems.map((item) => (
          <NavButton key={item.label} {...item} active={item.label === activeItem} />
        ))}
        {newEntryPosition === 'bottom' && <NewEntryButton />}
        <button
          onClick={() => go('Sign Out')}
          className="flex items-center gap-2.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg px-3 py-2.5 text-left transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
