import {
  ShieldCheck,
  KeyRound,
  Info,
  Download,
  Share,
  SlidersHorizontal,
  Share2,
  Copy,
  CheckCircle2,
} from 'lucide-react';

const EXPORT_HISTORY = [
  {
    title: 'June 2026 Snapshot',
    badge: 'Locked & Ready',
    approved: 'Approved Oct 24, 2026',
    active: false,
  },
  {
    title: 'May 2026 Snapshot',
    badge: 'Link Active',
    approved: 'Approved Sep 25, 2026 • Last Exported Oct 1, 2026',
    active: true,
  },
  {
    title: 'April 2026 Snapshot',
    badge: 'Locked & Ready',
    approved: 'Approved Aug 28, 2026',
    active: false,
  },
];

const EXPIRY_OPTIONS = [
  { label: '7 Days', selected: false },
  { label: '30 Days', selected: true },
  { label: '90 Days', selected: false },
];

const AUDIT_LOG = [
  { name: 'Dr. A. Smith (Viewed)', time: 'Oct 12, 2026 • 14:30 EST', check: true },
  { name: 'Link Generated', time: 'Oct 1, 2026 • 09:15 EST', badge: 'System' },
];

function PdfButton() {
  return (
    <button className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full px-4 py-2 text-sm text-[#0b1c30]">
      <Download size={13} />
      PDF
    </button>
  );
}

function ExportRow({ item }) {
  if (item.active) {
    return (
      <div className="relative overflow-hidden bg-[#e5eeff] rounded-[32px] p-6 flex items-start justify-between gap-6">
        <div className="absolute left-0.5 top-0.5 bottom-0.5 w-1.5 rounded-full bg-[#7800ce]" />
        <div className="pl-3">
          <div className="flex items-start gap-6">
            <h3 className="text-base font-semibold text-[#0b1c30] leading-tight max-w-[9rem]">
              {item.title}
            </h3>
            <span className="bg-[#2170e4] text-[#fefcff] text-xs font-bold leading-tight text-center px-3 py-2 rounded-full shrink-0 mt-2">
              Link
              <br />
              Active
            </span>
          </div>
          <p className="text-sm text-[#4d4354] mt-3 max-w-[19rem]">{item.approved}</p>
        </div>
        <div className="flex flex-col items-start gap-2 shrink-0 self-center">
          <PdfButton />
          <button className="flex items-center gap-2 bg-[#d3e4fe] rounded-full px-4 py-2 text-sm text-[#4d4354]">
            <SlidersHorizontal size={14} />
            Manage Sharing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 shadow-sm rounded-[32px] p-6 flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-base font-semibold text-[#0b1c30]">{item.title}</h3>
          <span className="bg-[#007a53] text-[#a3ffd0] text-xs font-bold px-2.5 py-0.5 rounded-full">
            {item.badge}
          </span>
        </div>
        <p className="text-sm text-[#4d4354] mt-1.5">{item.approved}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <PdfButton />
        <button className="flex items-center gap-2 bg-[#7800ce] rounded-full px-4 py-2 text-sm text-white">
          <Share size={14} />
          Share
        </button>
      </div>
    </div>
  );
}

export default function SnapshotExports() {
  return (
    <>
          <h1 className="text-3xl font-bold text-[#0b1c30]">Snapshot Exports</h1>
          <p className="text-base text-[#4d4354] mt-2">
            You own this information. You decide who sees it.
          </p>

          <div className="mt-16 grid grid-cols-1 xl:grid-cols-[1fr_288px] gap-6 items-start">
            <div className="flex flex-col gap-6">
              <div className="relative overflow-hidden bg-white/70 shadow-sm rounded-[32px] p-8">
                <div className="absolute -top-24 -right-10 w-64 h-64 rounded-full bg-[#ddb8ff] blur-2xl opacity-70" />
                <div className="absolute top-12 -left-24 w-64 h-64 rounded-full bg-[#adc6ff] blur-2xl opacity-70" />
                <div className="relative flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-purple-600 shadow-md flex items-center justify-center shrink-0">
                    <KeyRound size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[#0b1c30]">
                      Participant-Owned Data
                    </h2>
                    <p className="text-base text-[#4d4354] leading-relaxed mt-2">
                      You are in complete control. These monthly snapshots compile your
                      logged progress without any worker notes or external commentary.
                      You decide exactly who receives this export and for how long they
                      have access.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#d3e4fe] rounded-[32px] px-6 py-6">
                <Info size={20} className="text-[#2170e4] shrink-0" />
                <p className="text-base text-[#0b1c30]">
                  <span className="font-bold">Notice:</span> You are about to download
                  private health information. Please ensure you only share these
                  documents or links with individuals you explicitly trust.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="text-xs font-bold tracking-wider text-[#4d4354] mt-2">
                  EXPORT HISTORY
                </div>
                {EXPORT_HISTORY.map((item) => (
                  <ExportRow key={item.title} item={item} />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-white/70 shadow-sm rounded-[32px] p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-[#0b1c30]">Share May 2026</h2>
                  <div className="w-10 h-10 rounded-full bg-[#f0dbff] flex items-center justify-center shrink-0">
                    <Share2 size={18} className="text-[#7800ce]" />
                  </div>
                </div>

                <div>
                  <div className="text-sm text-[#4d4354] mb-3">Link Expiry</div>
                  <div className="bg-[#eff4ff] rounded-full p-1.5 flex items-center gap-2">
                    {EXPIRY_OPTIONS.map((option) => (
                      <button
                        key={option.label}
                        className={`flex-1 text-sm py-1.5 rounded-full ${
                          option.selected
                            ? 'bg-white font-bold text-[#7800ce] shadow-sm'
                            : 'text-[#0b1c30]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white shadow-sm rounded-full px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Download size={16} className="text-[#4d4354] shrink-0" />
                    <span className="text-sm text-[#0b1c30] leading-tight">
                      Allow PDF
                      <br />
                      Download
                    </span>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-[#7800ce] relative shrink-0">
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white shadow" />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold tracking-wider text-[#4d4354] mb-2">
                    ACTIVE SECURE LINK
                  </div>
                  <div className="flex items-stretch h-13 rounded-[26px] overflow-hidden border border-brand-300">
                    <div className="flex-1 min-w-0 bg-[#f8f9ff] px-4 flex items-center">
                      <span className="text-base text-[#0b1c30] truncate">
                        https://tmg180.app/s/mx92k-lq8w
                      </span>
                    </div>
                    <button className="w-14 bg-purple-600 flex items-center justify-center shrink-0">
                      <Copy size={20} className="text-white" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex-1 border border-[#ba1a1a]/40 text-[#ba1a1a] text-sm rounded-full py-2.5">
                    Revoke Link
                  </button>
                  <button className="flex-1 bg-[#7800ce] text-white text-sm rounded-full py-2.5">
                    Update Link
                  </button>
                </div>
              </div>

              <div className="bg-white shadow-sm rounded-[32px] p-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#2170e4]" />
                  <h2 className="text-xl font-semibold text-[#0b1c30]">Audit Log</h2>
                </div>
                <div className="mt-5 flex flex-col gap-4">
                  {AUDIT_LOG.map((entry) => (
                    <div key={entry.name} className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-[#0b1c30]">{entry.name}</div>
                        <div className="text-xs font-bold text-[#4d4354] mt-1">
                          {entry.time}
                        </div>
                      </div>
                      {entry.check ? (
                        <CheckCircle2 size={16} className="text-[#007a53] shrink-0 mt-0.5" />
                      ) : (
                        <span className="bg-[#e5eeff] text-[#4d4354] text-xs px-2 py-0.5 rounded-2xl shrink-0">
                          {entry.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
    </>
  );
}
