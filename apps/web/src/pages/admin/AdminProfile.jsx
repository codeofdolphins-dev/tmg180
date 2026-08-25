import {
  Bell,
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
import Select from '../../components/ui/Select';

/**
 * Admin Profile — governance portal. Renders inside GovernanceLayout (shared
 * fixed sidebar + top bar); this file is content only, on the portal card
 * idiom shared with the participant / worker workspaces. The frame's own
 * search / bell / avatar header was dropped with the per-page chrome.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

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
    <div className="max-w-238 mx-auto flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Profile</h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl">
          Manage your administrative credentials, governance permissions, and
          system notification preferences within the secure environment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 items-start">
        <div className="flex flex-col gap-4">
          <div className="bg-linear-to-br from-purple-50/70 to-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
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
                  <Select
                    inputId="admin-timezone"
                    aria-label="Timezone"
                    look="box"
                    defaultValue={{ value: 'Eastern Time (ET)', label: 'Eastern Time (ET)' }}
                    options={[
                      'Eastern Time (ET)',
                      'Central Time (CT)',
                      'Mountain Time (MT)',
                      'Pacific Time (PT)',
                    ].map((o) => ({ value: o, label: o }))}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button className="text-sm font-medium text-brand-700 bg-purple-100 hover:bg-purple-200 rounded-full px-5 py-2 transition-colors">
                Save Changes
              </button>
            </div>
          </div>

          <div className={CARD}>
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
          <div className={`relative overflow-hidden ${CARD}`}>
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

          <div className={CARD}>
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

          <div className={CARD}>
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
  );
}
