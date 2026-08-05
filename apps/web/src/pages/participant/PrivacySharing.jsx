import {
  ShieldCheck,
  Shield,
  SlidersHorizontal,
  Users,
  Plus,
  History,
  CheckCircle2,
  Unlink,
  Share2,
  Ban,
  FileText,
  Info,
} from 'lucide-react';

const SHARING_PREFERENCES = [
  {
    title: 'Allow selected worker to view approved snapshots',
    description: 'Workers you’ve granted access can see your summarized monthly progress.',
    on: true,
  },
  {
    title: 'Allow selected worker to view Daily Support Evidence Logs',
    description: 'Grant detailed access to your day-to-day entries and reflections.',
    on: false,
  },
  {
    title: 'Allow time-limited export links',
    description: 'Enable creating links that automatically expire after 7 days.',
    on: true,
  },
  {
    title: 'Receive privacy reminders',
    description: 'Get monthly notifications to review who has access to your information.',
    on: true,
  },
];

const TEAM_MEMBERS = [
  {
    initials: 'SJ',
    name: 'Sarah Jenkins',
    status: 'Snapshots Only',
    updated: 'Oct 12, 2023',
    avatarClass: 'bg-[#007a53]/20 text-[#005f40]',
    pillClass: 'bg-[#007a53]/10 text-[#005f40]',
    dotClass: 'bg-[#005f40]',
  },
  {
    initials: 'DT',
    name: 'David Thompson',
    status: 'Full Access',
    updated: 'Sep 05, 2023',
    avatarClass: 'bg-purple-600/20 text-[#7800ce]',
    pillClass: 'bg-purple-600/10 text-[#7800ce]',
    dotClass: 'bg-[#7800ce]',
  },
];

const AUDIT_ENTRIES = [
  {
    icon: CheckCircle2,
    title: 'Granted access to Sarah Jenkins',
    actor: 'Action by: You',
    date: 'Oct 12, 2023, 10:45 AM',
    status: 'Success',
    statusClass: 'text-[#005f40]',
  },
  {
    icon: Unlink,
    title: 'Revoked Export Link #8A2B',
    actor: 'Action by: System (Auto-expiry)',
    date: 'Oct 10, 2023, 12:00 AM',
    status: 'Completed',
    statusClass: 'text-[#7e7386]',
  },
  {
    icon: CheckCircle2,
    title: 'Enabled Daily Log Sharing',
    actor: 'Action by: You',
    date: 'Sep 05, 2023, 02:15 PM',
    status: 'Success',
    statusClass: 'text-[#005f40]',
  },
];

const DOWNLOADS = [
  { name: 'September Summary.pdf', meta: 'Downloaded Oct 02, 2023' },
  { name: 'August Summary.pdf', meta: 'Downloaded Sep 04, 2023' },
];

function Toggle({ on }) {
  return (
    <div
      className={`w-12 h-6 rounded-full relative shrink-0 ${
        on ? 'bg-purple-600' : 'bg-[#cfc2d7]'
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow ${
          on ? 'right-1' : 'left-1'
        }`}
      />
    </div>
  );
}

export default function PrivacySharing() {
  return (
    <>
          <div className="w-11 h-12 rounded-2xl bg-[#d3e4fe] shadow-sm flex items-center justify-center">
            <ShieldCheck size={24} className="text-[#7800ce]" />
          </div>
          <h1 className="text-5xl font-bold text-[#0b1c30] mt-4">Privacy & Sharing</h1>
          <p className="text-lg text-[#4d4354] mt-3">
            You control who can access your information.
          </p>

          <div className="mt-16 flex flex-col gap-6">
            <div className="relative overflow-hidden bg-white/70 rounded-3xl border-l-4 border-[#7800ce] shadow-sm px-9 py-8 flex items-center justify-between gap-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100/70 via-white/40 to-transparent" />
              <div className="relative">
                <h2 className="text-[32px] font-bold text-[#0b1c30]">
                  You own this information.
                </h2>
                <p className="text-lg text-[#4d4354] leading-relaxed mt-2 max-w-2xl">
                  You decide who sees it. Your daily logs and snapshots remain private
                  until you explicitly choose to share them.
                </p>
              </div>
              <div className="relative w-20 h-24 rounded-full bg-white/50 shadow-lg flex items-center justify-center shrink-0">
                <Shield size={34} className="text-[#7800ce] fill-[#7800ce]" />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_288px] gap-6 items-start">
              <div className="flex flex-col gap-6">
                <section className="bg-white/70 rounded-3xl shadow-sm p-8">
                  <div className="pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal size={18} className="text-[#7800ce]" />
                      <h2 className="text-2xl font-bold text-[#0b1c30]">
                        Sharing Preferences
                      </h2>
                    </div>
                    <p className="text-base text-[#4d4354] mt-1">
                      Manage global settings for sharing your journey.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-col gap-4">
                    {SHARING_PREFERENCES.map((pref) => (
                      <div
                        key={pref.title}
                        className="bg-white/50 rounded-2xl p-4 flex items-center justify-between gap-6 shadow-xs"
                      >
                        <div>
                          <h3 className="text-sm font-bold text-[#0b1c30]">
                            {pref.title}
                          </h3>
                          <p className="text-sm text-[#4d4354] mt-1 max-w-md">
                            {pref.description}
                          </p>
                        </div>
                        <Toggle on={pref.on} />
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white/70 rounded-3xl shadow-sm p-8">
                  <div className="flex items-start justify-between gap-4 pb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <Users size={20} className="text-[#7800ce]" />
                        <h2 className="text-2xl font-bold text-[#0b1c30]">
                          Support Team Access
                        </h2>
                      </div>
                      <p className="text-base text-[#4d4354] mt-1 max-w-md">
                        Manage which members of your support team can view your shared
                        information.
                      </p>
                    </div>
                    <button className="flex items-center gap-2 bg-[#d3e4fe] text-[#2170e4] text-sm font-medium rounded-full px-4 py-2.5 shrink-0">
                      <Plus size={14} />
                      Grant Access
                    </button>
                  </div>
                  <div className="border border-slate-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#e5eeff]/50">
                          <th className="px-4 py-4 text-xs font-semibold text-[#4d4354] tracking-wide">
                            TEAM MEMBER
                          </th>
                          <th className="px-4 py-4 text-xs font-semibold text-[#4d4354] tracking-wide">
                            PERMISSION STATUS
                          </th>
                          <th className="px-4 py-4 text-xs font-semibold text-[#4d4354] tracking-wide">
                            LAST UPDATED
                          </th>
                          <th className="px-4 py-4 text-xs font-semibold text-[#4d4354] tracking-wide text-right">
                            ACTIONS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {TEAM_MEMBERS.map((member) => (
                          <tr key={member.name} className="border-t border-slate-100">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${member.avatarClass}`}
                                >
                                  {member.initials}
                                </div>
                                <span className="text-base font-medium text-[#0b1c30]">
                                  {member.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-3 py-1.5 ${member.pillClass}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${member.dotClass}`}
                                />
                                {member.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-base text-[#4d4354]">
                              {member.updated}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex flex-col items-end gap-1">
                                <button className="text-xs font-semibold text-[#0058be]">
                                  Review
                                </button>
                                <button className="text-xs font-semibold text-[#ba1a1a]">
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="bg-white/70 rounded-3xl shadow-sm p-8">
                  <div className="pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <History size={18} className="text-[#7800ce]" />
                      <h2 className="text-2xl font-bold text-[#0b1c30]">
                        Consent Audit Log
                      </h2>
                    </div>
                    <p className="text-base text-[#4d4354] mt-1">
                      A secure record of changes to your privacy settings.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-col gap-4">
                    {AUDIT_ENTRIES.map(({ icon: Icon, ...entry }) => (
                      <div
                        key={entry.title}
                        className="bg-[#d3e4fe]/30 rounded-full px-5 py-4 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={20} className="text-[#4d4354] shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-[#0b1c30]">
                              {entry.title}
                            </div>
                            <div className="text-sm text-[#4d4354]">{entry.actor}</div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-semibold text-[#4d4354]">
                            {entry.date}
                          </div>
                          <div
                            className={`text-xs font-semibold mt-0.5 ${entry.statusClass}`}
                          >
                            {entry.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full text-sm font-medium text-[#7800ce] text-center mt-6 py-2">
                    View Full Log
                  </button>
                </section>
              </div>

              <div className="flex flex-col gap-6">
                <section className="bg-white/70 rounded-3xl shadow-sm p-6">
                  <div className="flex items-start gap-2">
                    <Share2 size={18} className="text-[#7800ce] mt-1.5 shrink-0" />
                    <h2 className="text-2xl font-bold text-[#0b1c30] leading-tight">
                      Active Share Links
                    </h2>
                  </div>
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="relative overflow-hidden bg-white/60 border border-[#007a53]/40 rounded-2xl p-4">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#007a53]" />
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="inline-block bg-[#007a53]/10 text-[#005f40] text-xs font-bold px-2 py-0.5 rounded-2xl">
                            Active
                          </span>
                          <div className="text-sm font-bold text-[#0b1c30] mt-1.5">
                            September Snapshot
                          </div>
                        </div>
                        <button className="shrink-0 mt-1">
                          <Ban size={12} className="text-[#ba1a1a]" />
                        </button>
                      </div>
                      <div className="mt-3 flex flex-col gap-1 text-sm text-[#4d4354]">
                        <div className="flex items-center justify-between">
                          <span>Created:</span>
                          <span>Oct 01, 2023</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Expires:</span>
                          <span className="text-[#0058be] font-medium">Oct 08, 2023</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <button className="w-full bg-[#d3e4fe] text-[#2170e4] text-xs font-bold rounded-full py-1.5">
                          Copy Link
                        </button>
                      </div>
                    </div>

                    <div className="relative overflow-hidden bg-white/60 shadow-xs rounded-2xl p-4">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#cfc2d7]" />
                      <span className="inline-block bg-[#d3e4fe] text-[#4d4354] text-xs font-bold px-2 py-0.5 rounded-2xl">
                        Expired
                      </span>
                      <div className="text-sm font-bold text-[#0b1c30] mt-1.5">
                        August Snapshot
                      </div>
                      <div className="mt-3 flex flex-col gap-1 text-sm text-[#4d4354]">
                        <div className="flex items-center justify-between">
                          <span>Created:</span>
                          <span>Sep 01, 2023</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Expired:</span>
                          <span>Sep 08, 2023</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-white/70 rounded-3xl shadow-sm p-6">
                  <div className="flex items-start gap-2">
                    <Users size={18} className="text-[#7800ce] mt-1.5 shrink-0" />
                    <h2 className="text-2xl font-bold text-[#0b1c30] leading-tight">
                      Support Team Access
                    </h2>
                  </div>
                  <div className="mt-4 flex flex-col gap-3">
                    {DOWNLOADS.map((file) => (
                      <div key={file.name} className="flex items-center gap-3 py-1.5">
                        <div className="w-9 h-9 rounded-lg bg-[#2170e4]/10 flex items-center justify-center shrink-0">
                          <FileText size={16} className="text-[#2170e4]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#0b1c30]">
                            {file.name}
                          </div>
                          <div className="text-xs text-[#4d4354]">{file.meta}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-[#eff4ff] rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <Info size={18} className="text-[#7800ce] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-bold text-[#0b1c30] tracking-wide">
                        DATA PROTECTION COMMITMENT
                      </h3>
                      <p className="text-sm text-[#4d4354] leading-relaxed mt-2">
                        Your data is handled in compliance with the Australian Privacy
                        Act 1988 (APPs) + Notifiable Data Breaches scheme.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
    </>
  );
}
