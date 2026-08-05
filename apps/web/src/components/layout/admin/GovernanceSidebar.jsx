import {
  ShieldCheck,
  LayoutDashboard,
  FileBarChart2,
  Landmark,
  AlertTriangle,
  Users,
  ClipboardCheck,
  Settings,
  UserCircle,
  HelpCircle,
  LogOut,
  LifeBuoy,
  Disc,
} from 'lucide-react';
import { ROLES } from '../../../store';
import { useRoleNav } from '../../../navigation/useRoleNav';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Workers Report', icon: FileBarChart2 },
  { label: 'Governance Standing', icon: Landmark },
  { label: 'Policies', icon: ShieldCheck },
  { label: 'Incidents', icon: AlertTriangle },
  { label: 'Participant Overview', icon: Users },
  { label: 'Consent Audit Log', icon: ClipboardCheck },
];

export const GOV_NAV_ITEMS = NAV_ITEMS;

const DEFAULT_BOTTOM_ITEMS = [
  { label: 'Settings', icon: Settings },
  { label: 'Admin Profile', icon: UserCircle },
];

export const GOV_BOTTOM_ITEMS = {
  default: DEFAULT_BOTTOM_ITEMS,
  withHelp: [
    { label: 'Settings', icon: Settings },
    { label: 'Help', icon: HelpCircle },
    { label: 'Sign Out', icon: LogOut },
  ],
};

const ACTIVE_STYLES = {
  solid: 'bg-brand-700 text-white font-medium rounded-full',
  soft: 'bg-purple-100 text-brand-700 font-medium rounded-full',
};

const HOVER_STYLES = {
  default: 'text-slate-600 hover:bg-slate-100 rounded-lg',
  gradient:
    'text-slate-600 rounded-full hover:rounded-full hover:bg-linear-to-r hover:from-purple-100 hover:to-white hover:text-brand-700 hover:font-medium',
};

function NavButton({ label, icon: Icon, active, activeStyle, hoverStyle }) {
  const go = useRoleNav(ROLES.ADMIN);
  return (
    <button
      onClick={() => go(label)}
      className={`w-full flex items-center gap-2.5 text-sm px-3 py-2.5 text-left transition-colors ${
        active ? ACTIVE_STYLES[activeStyle] : HOVER_STYLES[hoverStyle]
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

export default function GovernanceSidebar({
  portalLabel = 'Governance Portal',
  activeItem = 'Workers Report',
  navItems = NAV_ITEMS,
  bottomItems = DEFAULT_BOTTOM_ITEMS,
  showSupportPortal = false,
  logo = 'shield',
  showLogo = true,
  uppercaseLabel = true,
  activeStyle = 'solid',
  hoverStyle = 'default',
  actionButton = null,
}) {
  return (
    <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-3 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6 px-1">
        {showLogo && (logo === 'diamond' ? (
          <div className="w-7 h-7 rotate-45 border-2 border-brand-600 rounded-sm shrink-0" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-brand-700 flex items-center justify-center shrink-0">
            {logo === 'ring' ? (
              <Disc size={17} className="text-white" />
            ) : (
              <ShieldCheck size={17} className="text-white" />
            )}
          </div>
        ))}
        <div>
          <div className="text-lg font-black tracking-wider text-brand-700 leading-none">
            TMG180
          </div>
          <div
            className={`text-[10px] text-slate-400 mt-0.5 tracking-wide ${uppercaseLabel ? 'uppercase' : ''}`}
          >
            {portalLabel}
          </div>
        </div>
      </div>

      {actionButton && (
        <button className="w-full bg-linear-to-r from-brand-600 to-fuchsia-600 hover:opacity-90 text-white text-sm font-medium rounded-full py-2.5 mb-4 transition-opacity">
          {actionButton.label}
        </button>
      )}

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavButton
            key={item.label}
            {...item}
            active={item.label === activeItem}
            activeStyle={activeStyle}
            hoverStyle={hoverStyle}
          />
        ))}
      </nav>

      <div className="mt-auto pt-4 flex flex-col gap-2">
        {showSupportPortal && (
          <button className="w-full flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-brand-700 text-sm font-medium rounded-full py-2.5 transition-colors">
            <LifeBuoy size={15} />
            <span>Support Portal</span>
          </button>
        )}
        {bottomItems.map((item) => (
          <NavButton
            key={item.label}
            {...item}
            active={item.label === activeItem}
            activeStyle={activeStyle}
            hoverStyle={hoverStyle}
          />
        ))}
      </div>
    </aside>
  );
}
