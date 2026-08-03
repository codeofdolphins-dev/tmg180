import {
  Flower2,
  LayoutDashboard,
  User,
  List,
  Calendar,
  ShieldCheck,
  Plus,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { ROLES } from '../../store';
import { useRoleNav } from '../../navigation/useRoleNav';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Profile', icon: User },
  { label: 'Daily Log', icon: List },
  { label: 'Monthly Snapshot', icon: Calendar },
  { label: 'Browse Directory', icon: ShieldCheck },
];

export default function Sidebar({
  portalLabel,
  activeItem = 'Browse Directory',
  role = ROLES.PARTICIPANT,
}) {
  const go = useRoleNav(role);
  return (
    <aside className="w-56 shrink-0 bg-white rounded-3xl shadow-sm m-4 flex flex-col justify-between py-6 px-4">
      <div>
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center shrink-0">
            <Flower2 size={16} className="text-white" />
          </div>
          <div>
            <div className="text-lg font-black tracking-wider text-brand-700 leading-none">
              TMG180
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{portalLabel}</div>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium rounded-full py-2.5 mb-6 transition-colors">
          <Plus size={16} />
          <span>New Entry</span>
        </button>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map(({ label, icon: Icon }) => {
            const active = label === activeItem;
            return (
              <button
                key={label}
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
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-1">
        <button
          onClick={() => go('Help')}
          className="flex items-center gap-2.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg px-3 py-2.5 text-left transition-colors"
        >
          <HelpCircle size={16} />
          <span>Help</span>
        </button>
        <button
          onClick={() => go('Logout')}
          className="flex items-center gap-2.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg px-3 py-2.5 text-left transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
