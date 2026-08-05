import {
  LayoutDashboard,
  FileBarChart2,
  Landmark,
  ShieldCheck,
  Users,
  ClipboardCheck,
  LifeBuoy,
  LogOut,
  Calendar,
  User,
  Tag,
  ChevronDown,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { useRoleNav } from '../../navigation/useRoleNav';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Workers Report', icon: FileBarChart2 },
  { label: 'Governance', icon: Landmark },
  { label: 'Policies', icon: ShieldCheck },
  { label: 'Participants', icon: Users },
  { label: 'Consent Audit Log', icon: ClipboardCheck },
];

const RECORDS = [
  {
    time: '2024-05-12 14:30',
    participant: 'P-9821',
    worker: 'W-4410',
    action: 'Consent granted',
    permission: 'Approved snapshots',
    expiry: '2025-05-12',
    status: 'Active',
  },
  {
    time: '2024-05-12 11:15',
    participant: 'P-7723',
    worker: 'W-2109',
    action: 'Consent revoked',
    permission: 'Daily Support Evidence Logs',
    expiry: '-',
    status: 'Revoked',
  },
  {
    time: '2024-05-11 09:45',
    participant: 'P-3312',
    worker: 'W-8821',
    action: 'Share link created',
    permission: 'Export link',
    expiry: '2024-05-18',
    status: 'Active',
  },
  {
    time: '2024-05-10 16:20',
    participant: 'P-5519',
    worker: 'W-1102',
    action: 'Consent limited',
    permission: 'Profile goals',
    expiry: '2024-11-10',
    status: 'Active',
  },
  {
    time: '2024-05-09 13:05',
    participant: 'P-1204',
    worker: 'W-5523',
    action: 'Share link revoked',
    permission: 'Export link',
    expiry: '-',
    status: 'Revoked',
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

function FilterField({ icon: Icon, label, filled, dropdown }) {
  return (
    <button
      className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-full border transition-colors shrink-0 ${
        filled
          ? 'bg-purple-50 border-purple-100 text-slate-700'
          : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
      }`}
    >
      {Icon && <Icon size={14} className="shrink-0" />}
      <span className="whitespace-nowrap">{label}</span>
      {dropdown && <ChevronDown size={14} className="text-slate-400 shrink-0" />}
    </button>
  );
}

export default function ConsentAuditLog() {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-4 overflow-y-auto">
        <div className="flex items-center gap-2.5 mb-6 px-1">
          <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center shrink-0 text-white font-bold">
            G
          </div>
          <div>
            <div className="text-xs font-bold text-brand-600 leading-none">TMG180</div>
            <div className="text-base font-bold text-brand-700 leading-tight mt-0.5">
              Governance
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Admin Portal</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'Consent Audit Log'} />
          ))}
        </nav>

        <div className="mt-auto pt-4 flex flex-col gap-1 border-t border-slate-100">
          <NavItem icon={LifeBuoy} label="Support" />
          <NavItem icon={LogOut} label="Sign Out" />
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Consent Audit Log</h1>
              <p className="text-sm text-slate-500 mt-1">
                Metadata-only consent activity. Record contents are not shown.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-sky-50 border border-sky-100 rounded-xl p-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={15} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Privacy Preserved</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  This audit log shows metadata only. It does not display
                  participant-owned record content.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 overflow-x-auto">
              <div className="flex items-center gap-2 w-fit">
                <FilterField icon={Calendar} label="Date range" />
                <FilterField icon={User} label="Participant ID" filled />
                <FilterField icon={Tag} label="Worker ID" />
                <FilterField label="Action type" dropdown />
                <FilterField label="Status" dropdown />
                <button className="w-9 h-9 rounded-full bg-purple-50 text-brand-600 flex items-center justify-center hover:bg-purple-100 transition-colors shrink-0">
                  <Filter size={15} />
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 bg-slate-50">
                    <th className="font-medium px-5 py-3">Date/Time</th>
                    <th className="font-medium px-5 py-3">Participant ID</th>
                    <th className="font-medium px-5 py-3">Worker ID</th>
                    <th className="font-medium px-5 py-3">Action</th>
                    <th className="font-medium px-5 py-3">Permission Type</th>
                    <th className="font-medium px-5 py-3">Expiry</th>
                    <th className="font-medium px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {RECORDS.map((r) => (
                    <tr key={r.time + r.participant} className="border-t border-slate-100">
                      <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{r.time}</td>
                      <td className="px-5 py-4 text-slate-700 font-medium">{r.participant}</td>
                      <td className="px-5 py-4 text-slate-600">{r.worker}</td>
                      <td className="px-5 py-4 text-slate-600">{r.action}</td>
                      <td className="px-5 py-4 text-slate-600">{r.permission}</td>
                      <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{r.expiry}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                            r.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              r.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
                <p className="text-sm text-slate-400">Showing 1-5 of 142 records</p>
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                    <ChevronLeft size={15} />
                  </button>
                  <button className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
                    <ChevronRight size={15} />
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
