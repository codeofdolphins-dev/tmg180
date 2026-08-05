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
  ShieldCheck,
  EyeOff,
  UserCheck,
  Check,
  PenLine,
  CheckCircle2,
  Plus,
  MoreHorizontal,
} from 'lucide-react';

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
];

const BOTTOM_ITEMS = [
  { label: 'Settings', icon: Settings },
  { label: 'Help Centre', icon: HelpCircle },
];

const STATS = [
  {
    label: 'Total Active Consents',
    value: '12',
    icon: ShieldCheck,
    iconTone: 'bg-purple-100 text-brand-600',
  },
  {
    label: 'Limited Access',
    value: '3',
    icon: EyeOff,
    iconTone: 'bg-sky-100 text-sky-600',
  },
  {
    label: 'Recently Granted',
    value: '2',
    icon: UserCheck,
    iconTone: 'bg-emerald-100 text-emerald-600',
  },
];

const PARTICIPANTS = [
  {
    name: 'Sarah Jenkins',
    id: 'TMG-821',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    status: 'Consent active',
    statusTone: 'bg-purple-100 text-brand-700',
    lastSupport: 'Yesterday',
    permission: 'Daily logs, Approved snapshots, Profile goals',
  },
  {
    name: 'David Thompson',
    id: 'TMG-442',
    initials: 'DT',
    status: 'Consent limited',
    statusTone: 'bg-slate-100 text-slate-500',
    lastSupport: 'Oct 12, 2026',
    permission: 'Approved snapshots only',
  },
  {
    name: 'Elena Rodriguez',
    id: 'TMG-109',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&q=80',
    status: 'Consent active',
    statusTone: 'bg-purple-100 text-brand-700',
    lastSupport: 'Oct 10, 2026',
    permission: 'Daily logs, Profile goals',
  },
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

export default function ParticipantsISupport() {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-4 overflow-y-auto">
        <div className="mb-6 px-1">
          <div className="text-lg font-black tracking-wider text-brand-700 leading-none">
            TMG180
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Worker Portal</div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              {...item}
              active={item.label === 'Participants I support'}
            />
          ))}
        </nav>

        <div className="mt-auto pt-4 flex flex-col gap-1 border-t border-slate-100">
          {BOTTOM_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Participants I support
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Participant-owned portal records and your own evidence logs (within
                your permissions).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4 items-start">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-3">
                  {STATS.map((s) => (
                    <div
                      key={s.label}
                      className="bg-white border border-slate-200 rounded-2xl p-4"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${s.iconTone}`}
                      >
                        <s.icon size={15} />
                      </div>
                      <p className="text-[9px] uppercase tracking-wide text-slate-400 mb-1">
                        {s.label}
                      </p>
                      <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                    </div>
                  ))}
                </div>

                <h2 className="text-lg font-bold text-slate-900">Active Participants</h2>

                <div className="flex flex-col gap-4">
                  {PARTICIPANTS.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5"
                    >
                      <div className="flex items-start gap-3">
                        {p.photo ? (
                          <div className="w-11 h-11 rounded-full overflow-hidden shrink-0">
                            <img
                              src={p.photo}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-sky-100 text-sky-700 text-sm font-bold flex items-center justify-center shrink-0">
                            {p.initials}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base font-bold text-slate-900">
                              {p.name}
                            </h3>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full shrink-0">
                              ID: {p.id}
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full mt-1.5 ${p.statusTone}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {p.status}
                          </span>
                          <p className="text-xs text-slate-400 mt-2">
                            Last support: {p.lastSupport}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            <span className="font-semibold text-slate-800">
                              Permission:
                            </span>{' '}
                            {p.permission}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-purple-50/70 rounded-2xl p-5">
                  <ShieldCheck size={18} className="text-brand-600 mb-2" />
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    How permissions work
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Records are participant-owned. You only see information while{' '}
                    <span className="font-semibold text-brand-700">Consent active</span>{' '}
                    status is maintained.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <Check size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                      Consent can be withdrawn at any time.
                    </div>
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <Check size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                      Your evidence logs remain tied to the participant's core record.
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900">
                      Recent Evidence Logs
                    </h3>
                    <MoreHorizontal size={16} className="text-slate-400" />
                  </div>
                  <div className="flex flex-col gap-4 mb-4">
                    <div className="flex items-start gap-2.5">
                      <PenLine size={15} className="text-brand-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Draft log for Sarah
                        </p>
                        <p className="text-xs text-slate-400">Started 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2
                        size={15}
                        className="text-emerald-600 mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Submitted log for Elena
                        </p>
                        <p className="text-xs text-slate-400">Oct 10 • Daily log</p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-full py-2.5 transition-colors">
                    <Plus size={15} />
                    New evidence log
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
