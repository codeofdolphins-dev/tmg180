import {
  Bell,
  HelpCircle,
  LayoutDashboard,
  FileBarChart2,
  Landmark,
  ShieldCheck,
  AlertTriangle,
  Users,
  ClipboardCheck,
  LifeBuoy,
  Settings,
  User,
  LogOut,
  Download,
  Upload,
  Plus,
} from 'lucide-react';
import Button from '../components/ui/Button';

import { useRoleNav } from '../navigation/useRoleNav';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Workers Report', icon: FileBarChart2 },
  { label: 'Governance Standing', icon: Landmark },
  { label: 'Policies', icon: ShieldCheck },
  { label: 'Incidents', icon: AlertTriangle },
  { label: 'Participant Overview', icon: Users },
  { label: 'Consent Audit Log', icon: ClipboardCheck },
];

function NavItem({ icon: Icon, label, active }) {
  const go = useRoleNav('admin');
  return (
    <button
      onClick={() => go(label)}
      className={`w-full flex items-center gap-2.5 text-sm px-3 py-2.5 text-left rounded-lg transition-colors ${
        active
          ? 'bg-slate-100 text-slate-900 font-semibold'
          : 'text-slate-500 hover:bg-slate-50'
      }`}
    >
      <Icon size={16} className={active ? 'text-slate-900' : 'text-slate-400'} />
      <span>{label}</span>
    </button>
  );
}

export default function Policies() {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-5 px-3">
        <div className="flex items-center gap-2.5 mb-6 px-1">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-900">
            T
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 leading-none">TMG180</div>
            <div className="text-xs text-slate-400 mt-0.5">Governance Admin</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'Policies'} />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 pt-4">
          <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-full py-2.5 transition-colors">
            <LifeBuoy size={15} />
            <span>Help Centre</span>
          </button>

          <NavItem icon={Settings} label="Settings" active={false} />

          <div className="flex items-center gap-2.5 px-3 pt-2 border-t border-slate-100">
            <div className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center shrink-0">
              <User size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 leading-none">
                Admin Profile
              </p>
              <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 mt-1 transition-colors">
                <LogOut size={11} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-end gap-4 px-6 py-4 text-slate-500">
          <button className="relative hover:text-slate-700 transition-colors">
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 border border-white" />
          </button>
          <button className="hover:text-slate-700 transition-colors">
            <HelpCircle size={18} />
          </button>
        </header>

        <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-slate-900">Policies</h1>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                Manage policy versions, acknowledgements and governance references in a
                secure, structured space.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-end">
              <Button variant="outline" icon={Download} className="w-auto! px-4! py-2.5!">
                Export metadata
              </Button>
              <Button variant="outline" icon={Upload} className="w-auto! px-4! py-2.5!">
                Upload version
              </Button>
              <Button variant="outline" icon={Plus} className="w-auto! px-4! py-2.5!">
                Add policy
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
