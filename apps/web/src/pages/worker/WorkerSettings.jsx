import {
  ShieldCheck,
  Plus,
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
  Search,
  Bell,
  User,
  Palette,
  CalendarCheck,
  Shield,
  MapPin,
  Globe,
  Link as LinkIcon,
  Monitor,
  Smartphone,
  X,
  CheckCircle2,
} from 'lucide-react';
import Button from '../../components/ui/Button';

import { useRoleNav } from '../../navigation/useRoleNav';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Calendar', icon: Calendar },
  { label: 'Participants I support', icon: Users },
  { label: 'Daily Logs', icon: NotebookPen },
  { label: 'Monthly Snapshots', icon: TrendingUp },
  { label: 'Resources', icon: Folder },
  { label: 'Learning Hub', icon: GraduationCap },
  { label: 'Governance Standing', icon: Landmark },
  { label: 'Settings', icon: Settings },
  { label: 'Help Centre', icon: HelpCircle },
];

function NavItem({ icon: Icon, label, active }) {
  const go = useRoleNav('worker');
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

function Chip({ label, selected, checkmark }) {
  return (
    <button
      className={`inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border transition-colors ${
        selected
          ? 'bg-brand-600 border-brand-600 text-white font-medium'
          : 'bg-white border-slate-200 text-slate-500'
      }`}
    >
      {checkmark && selected && <CheckCircle2 size={13} />}
      {label}
    </button>
  );
}

function CardHeader({ icon: Icon, iconTone, title }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconTone}`}
      >
        <Icon size={15} />
      </div>
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
    </div>
  );
}

export default function WorkerSettings() {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center shrink-0">
            <ShieldCheck size={15} className="text-white" />
          </div>
          <div>
            <div className="text-base font-black tracking-wider text-brand-700 leading-none">
              TMG180
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Worker Portal</div>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium rounded-full py-2.5 mb-4 transition-colors">
          <Plus size={16} />
          <span>New Entry</span>
        </button>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'Settings'} />
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-end gap-4 px-6 py-4 text-slate-500">
          <button className="hover:text-slate-700 transition-colors">
            <Search size={18} />
          </button>
          <button className="hover:text-slate-700 transition-colors">
            <Bell size={18} />
          </button>
          <button className="hover:text-slate-700 transition-colors">
            <Settings size={18} />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        <main className="flex-1 px-6 pb-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
              <p className="text-sm text-slate-500 mt-1">
                2 preferences and define your professional profile.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4 items-start">
              <div className="flex flex-col gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <CardHeader icon={User} iconTone="bg-sky-100 text-sky-600" title="Account Details" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Alex"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Morgan"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-600"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="alex.morgan@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        defaultValue="+1 (555) 123-4567"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        Timezone
                      </label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-600">
                        <option>Pacific Time (PT)</option>
                        <option>Mountain Time (MT)</option>
                        <option>Central Time (CT)</option>
                        <option>Eastern Time (ET)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <CardHeader
                    icon={Palette}
                    iconTone="bg-purple-100 text-brand-600"
                    title="Professional Profile"
                  />

                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-full overflow-hidden shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                        alt="Alex Morgan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Profile Picture</p>
                      <p className="text-xs text-slate-400 mb-1.5">
                        JPG, GIF or PNG. Max size of 5MB.
                      </p>
                      <button className="text-xs font-medium text-brand-600 border border-purple-200 rounded-full px-3 py-1 hover:bg-purple-50 transition-colors">
                        Upload new photo
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        Professional Bio
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Share a little about your experience and approach..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        Support Areas
                      </label>
                      <div className="flex flex-wrap items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        {['Mental Health', 'Skill Building'].map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 bg-purple-100 px-2.5 py-1 rounded-full"
                          >
                            {tag}
                            <X size={11} className="cursor-pointer" />
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="Add area..."
                          className="bg-transparent outline-none text-sm text-slate-500 placeholder:text-slate-400 flex-1 min-w-[80px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">
                          Primary Location
                        </label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5">
                          <MapPin size={14} className="text-slate-400 shrink-0" />
                          <span className="text-sm text-slate-700">Vancouver, BC</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">
                          Languages
                        </label>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5">
                          <Globe size={14} className="text-slate-400 shrink-0" />
                          <span className="text-sm text-slate-700">English, French</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">
                        Personal Website or Portfolio (Optional)
                      </label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5">
                        <LinkIcon size={14} className="text-slate-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="https://"
                          className="bg-transparent outline-none text-sm text-slate-500 placeholder:text-slate-400 flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <CardHeader
                    icon={CalendarCheck}
                    iconTone="bg-emerald-100 text-emerald-600"
                    title="Availability"
                  />
                  <p className="text-xs text-slate-500 -mt-2 mb-4">
                    Set your general working schedule preferences.
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Weekdays</p>
                      <p className="text-xs text-slate-400">Mon - Fri</p>
                    </div>
                    <Toggle defaultChecked />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Weekends</p>
                      <p className="text-xs text-slate-400">Sat - Sun</p>
                    </div>
                    <Toggle />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Chip label="Morning" selected />
                    <Chip label="Afternoon" selected checkmark />
                    <Chip label="Evening" />
                    <Chip label="Flexible" selected checkmark />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <CardHeader
                    icon={Bell}
                    iconTone="bg-purple-100 text-brand-600"
                    title="Notifications"
                  />
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800">Email Updates</p>
                        <p className="text-xs text-slate-400 leading-snug">
                          Receive summary reports of your logged activities.
                        </p>
                      </div>
                      <Toggle defaultChecked />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800">Reminders</p>
                        <p className="text-xs text-slate-400 leading-snug">
                          Get prompted to complete missing daily logs.
                        </p>
                      </div>
                      <Toggle defaultChecked />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800">Snapshot Access</p>
                        <p className="text-xs text-slate-400 leading-snug">
                          Alerts when new monthly snapshots are published.
                        </p>
                      </div>
                      <Toggle defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <CardHeader
                    icon={Shield}
                    iconTone="bg-rose-100 text-rose-600"
                    title="Security & Privacy"
                  />

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Password</p>
                      <p className="text-xs text-slate-400">Last changed 3 months ago</p>
                    </div>
                    <button className="text-xs font-medium text-slate-600 border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-50 transition-colors">
                      Update
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        Two-Factor Authentication
                      </p>
                      <p className="text-xs text-slate-400 leading-snug">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    <Toggle />
                  </div>

                  <p className="text-xs font-medium text-slate-500 mb-2">Active Sessions</p>
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-start gap-2.5">
                      <Monitor size={15} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-slate-700">Mac OS • Safari</p>
                        <p className="text-xs text-emerald-600">
                          Vancouver, CA • Current session
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Smartphone size={15} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-slate-700">iOS • TMG180 App</p>
                        <p className="text-xs text-slate-400">Active 2 hours ago</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-slate-500 mb-1">Consent &amp; Data</p>
                  <button className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors">
                    Review Privacy Policy →
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                Cancel
              </button>
              <Button variant="primary" className="w-auto! px-5! py-2.5!">
                Save changes
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
