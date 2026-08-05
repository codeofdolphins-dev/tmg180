import {
  Plus,
  LayoutDashboard,
  Settings,
  UserCircle,
  LifeBuoy,
  LogOut,
  Search,
  Bell,
  HelpCircle,
  User,
  Shield,
  Laptop,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  Info,
  Check,
} from 'lucide-react';

import { useRoleNav } from '../navigation/useRoleNav';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Settings', icon: Settings },
  { label: 'Admin Profile', icon: UserCircle },
];

const MODULES = [
  {
    icon: CheckCircle2,
    title: 'Governance Admin',
    desc: 'Full system configuration.',
  },
  {
    icon: CheckCircle2,
    title: 'Policy Management',
    desc: 'Draft, review, and publish.',
  },
  {
    icon: Clock,
    title: 'Incident Tickets',
    desc: 'Review and resolve escalations.',
  },
  {
    icon: ClipboardCheck,
    title: 'Consent Audit Metadata',
    desc: 'View governance logs.',
  },
];

const NOTIFICATIONS = [
  {
    title: 'System Alerts',
    desc: 'Critical infrastructure and maintenance notices.',
    checked: true,
  },
  {
    title: 'Governance Updates',
    desc: 'Policy changes and governance requirement updates.',
    checked: true,
  },
  {
    title: 'Security Activity',
    desc: 'Unusual login attempts or permission changes.',
    checked: false,
  },
];

function NavItem({ icon: Icon, label, active }) {
  const go = useRoleNav('admin');
  return (
    <button
      onClick={() => go(label)}
      className={`w-full flex items-center gap-2.5 text-sm px-3 py-2.5 text-left transition-colors ${
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

function CardHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <Icon size={16} className="text-brand-600" />
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function Toggle({ defaultChecked }) {
  return (
    <button
      className={`relative w-10 h-5.5 rounded-full shrink-0 transition-colors ${
        defaultChecked ? 'bg-brand-600' : 'bg-slate-200'
      }`}
      style={{ height: '22px' }}
    >
      <span
        className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-all ${
          defaultChecked ? 'left-5' : 'left-0.5'
        }`}
        style={{ width: '18px', height: '18px' }}
      />
    </button>
  );
}

export default function AdminProfile() {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-4 overflow-y-auto">
        <div className="flex items-center gap-2.5 mb-5 px-1">
          <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center shrink-0 text-white font-bold">
            T
          </div>
          <div>
            <div className="text-base font-black tracking-wider text-brand-700 leading-none">
              TMG180
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Governance Portal</div>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium rounded-full py-2.5 mb-4 transition-colors">
          <Plus size={16} />
          <span>New Entry</span>
        </button>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'Admin Profile'} />
          ))}
        </nav>

        <div className="mt-auto pt-4 flex flex-col gap-1 border-t border-slate-100">
          <NavItem icon={LifeBuoy} label="Support" />
          <NavItem icon={LogOut} label="Sign Out" />
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 flex-1 max-w-sm">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Global Search"
              className="bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400 flex-1"
            />
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 border border-white" />
            </button>
            <button className="text-slate-500 hover:text-slate-700 transition-colors">
              <HelpCircle size={18} />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                  alt="Alex Rivera"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-none">
                  Alex Rivera
                </p>
                <p className="text-xs text-slate-400 mt-1">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Profile</h1>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                Manage your administrative credentials, governance permissions, and
                system notification preferences within the secure environment.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 items-start">
              <div className="flex flex-col gap-4">
                <div className="bg-linear-to-br from-purple-50/70 to-white border border-slate-200 rounded-2xl p-6">
                  <CardHeader icon={User} title="Profile Information" />
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                        alt="Alex Rivera"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Alex Rivera"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue="alex.r@tmg180.org"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          defaultValue="+1 (555) 019-2834"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">
                          Timezone
                        </label>
                        <select className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-600">
                          <option>Eastern Time (ET)</option>
                          <option>Central Time (CT)</option>
                          <option>Mountain Time (MT)</option>
                          <option>Pacific Time (PT)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button className="text-sm font-medium text-brand-700 bg-purple-100 hover:bg-purple-200 rounded-full px-5 py-2 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <CardHeader icon={Shield} title="Security Settings" />

                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Password</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Last changed 45 days ago
                      </p>
                    </div>
                    <button className="text-sm font-medium text-slate-700 border border-slate-200 rounded-full px-4 py-2 hover:bg-slate-50 transition-colors shrink-0">
                      Change Password
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-800">
                          Two-factor Authentication (2FA)
                        </p>
                        <span className="text-[10px] font-medium text-brand-700 bg-purple-100 px-2 py-0.5 rounded-full">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    <Toggle defaultChecked />
                  </div>

                  <div className="pt-4">
                    <p className="text-sm font-medium text-slate-800 mb-3">
                      Recent Active Sessions
                    </p>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-slate-400">
                          <th className="font-medium pb-2">Device</th>
                          <th className="font-medium pb-2">Location</th>
                          <th className="font-medium pb-2">Last Active</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-slate-100">
                          <td className="py-2.5">
                            <div className="flex items-center gap-2 text-slate-700">
                              <Laptop size={14} className="text-slate-400" />
                              MacBook Pro (Current)
                            </div>
                          </td>
                          <td className="py-2.5 text-slate-500">Seattle, WA</td>
                          <td className="py-2.5 text-emerald-600 font-medium">Just now</td>
                        </tr>
                        <tr className="border-t border-slate-100">
                          <td className="py-2.5">
                            <div className="flex items-center gap-2 text-slate-700">
                              <Smartphone size={14} className="text-slate-400" />
                              iPhone 14 Pro
                            </div>
                          </td>
                          <td className="py-2.5 text-slate-500">Seattle, WA</td>
                          <td className="py-2.5 text-slate-500">Yesterday, 4:20 PM</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-6">
                  <ShieldCheck
                    size={90}
                    strokeWidth={1}
                    className="absolute -top-2 -right-4 text-purple-100"
                  />
                  <h2 className="relative text-base font-bold text-slate-900 mb-2">
                    Role &amp; Access
                  </h2>
                  <span className="relative inline-block text-xs font-medium text-brand-700 bg-purple-100 px-2.5 py-1 rounded-full mb-3">
                    Super Admin
                  </span>
                  <p className="relative text-sm text-slate-500 mb-4 leading-relaxed">
                    Your current role grants access to the following governance
                    modules:
                  </p>
                  <div className="relative flex flex-col gap-3">
                    {MODULES.map((m) => (
                      <div key={m.title} className="flex items-start gap-2.5">
                        <m.icon size={15} className="text-brand-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {m.title}
                          </p>
                          <p className="text-xs text-slate-400">{m.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <CardHeader icon={Info} title="Account Details" />
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Member Since</span>
                      <span className="text-slate-800 font-medium">Oct 12, 2022</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Last Login</span>
                      <span className="text-slate-800 font-medium">
                        Today, 08:45 AM
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Account Status</span>
                      <span className="text-xs font-medium text-white bg-emerald-500 px-2.5 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <CardHeader icon={Bell} title="Notifications" />
                  <div className="flex flex-col gap-4">
                    {NOTIFICATIONS.map((n) => (
                      <div key={n.title} className="flex items-start gap-2.5">
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            n.checked ? 'bg-brand-600' : 'border-2 border-slate-200'
                          }`}
                        >
                          {n.checked && <Check size={11} className="text-white" />}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {n.title}
                          </p>
                          <p className="text-xs text-slate-400 leading-snug">
                            {n.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
