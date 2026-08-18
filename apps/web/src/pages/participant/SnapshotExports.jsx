import { useState } from 'react';
import {
  KeyRound,
  Info,
  Download,
  Share2,
  Settings2,
  ShieldCheck,
  CircleCheck,
  Lock,
  FileText,
  LoaderCircle,
  TriangleAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SNAPSHOT_STATUS } from '@tmg180/shared';
import { formatShortDate, formatTimestamp } from '../../lib/dates';
import { useSnapshots } from '../../hooks/participant/snapshot';
import { PARTICIPANT_PATHS, participantSnapshotPath } from '../../routes/paths';

/**
 * Snapshot Exports (Figma 1169:1940, with the R-08a copy correction).
 *
 * Export lives here, not on the dashboard (R-02). The layout follows the frame:
 * ownership notice, the export history, and the sharing panel + audit log on
 * the right.
 *
 * PDF is real — it opens the snapshot and prints it, so the document is made by
 * the browser and never passes through a server. Time-limited share links are
 * designed but have no backend yet (the external access layer is unbuilt), so
 * that panel renders in place with its controls disabled and says so, rather
 * than offering a link it cannot issue.
 */

const EXPIRY_OPTIONS = ['7 Days', '30 Days', '90 Days'];

/**
 * The frame also has a "Link Active" state. It is not rendered: no snapshot can
 * have a live share link until the external access layer exists, and a badge
 * claiming otherwise would be fiction on a screen about who can see what.
 */
function StatusBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-200/70 px-2.5 py-1 rounded-full shrink-0">
      <Lock size={10} />
      Locked &amp; Ready
    </span>
  );
}

export default function SnapshotExports() {
  const navigate = useNavigate();
  const { data: snapshots, isLoading, error } = useSnapshots();
  const [selectedId, setSelectedId] = useState(null);

  const locked = (snapshots ?? []).filter(
    (snapshot) => snapshot.status === SNAPSHOT_STATUS.LOCKED
  );
  const selected = locked.find((snapshot) => snapshot.id === selectedId) ?? null;

  // "PDF" hands the snapshot to the browser's print dialog; the detail screen
  // owns the printable rendering, so it opens there and prints on arrival.
  const exportPdf = (snapshot) =>
    navigate(participantSnapshotPath.detail(snapshot.id), { state: { print: true } });

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Snapshot Exports</h1>
        <p className="text-base text-slate-500 mt-1">
          You own this information. You decide who sees it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="flex flex-col gap-5">
          <div className="bg-linear-to-r from-purple-50 via-purple-50/60 to-white rounded-3xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                <KeyRound size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Participant-Owned Data
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  You are in complete control. These monthly snapshots compile your logged
                  progress. Exports contain only what you&rsquo;ve chosen to share. TMG180
                  stores no medical or treatment records. You decide exactly who receives
                  this export and for how long they have access.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#eff4ff] rounded-2xl p-4">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
              <Info size={13} className="text-white" />
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              <span className="font-semibold">Notice:</span> You are about to download
              private health information. Please ensure you only share these documents or
              links with individuals you explicitly trust.
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-3">
              Export history
            </p>

            {isLoading && (
              <div className="flex items-center gap-3 text-slate-500 bg-white rounded-2xl p-6">
                <LoaderCircle size={18} className="animate-spin" />
                Loading your snapshots…
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-2xl p-6 text-rose-800">
                <TriangleAlert size={18} className="shrink-0 mt-0.5" />
                <p className="text-sm">{error.message}</p>
              </div>
            )}

            {!isLoading && locked.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="w-14 h-14 rounded-full bg-purple-50 text-brand-600 flex items-center justify-center mx-auto">
                  <FileText size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-5">
                  Nothing to export yet
                </h3>
                <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                  A snapshot can be exported once you have approved it. Approving locks
                  the month, so what you share cannot change afterwards.
                </p>
                <button
                  onClick={() => navigate(PARTICIPANT_PATHS.snapshot)}
                  className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-2.5 mt-5 shadow-md hover:bg-brand-700 transition-colors"
                >
                  Go to my snapshots
                </button>
              </div>
            )}

            {locked.length > 0 && (
              <div className="flex flex-col gap-4">
                {locked.map((snapshot) => {
                  const isSelected = snapshot.id === selectedId;
                  return (
                    <div
                      key={snapshot.id}
                      className={`rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 transition-colors ${
                        isSelected
                          ? 'bg-purple-50 border-l-4 border-brand-600'
                          : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {snapshot.monthLabel} Snapshot
                          </h3>
                          <StatusBadge />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Approved {formatShortDate(snapshot.lockedAt)}
                          {snapshot.exportedAt &&
                            ` • Last Exported ${formatShortDate(snapshot.exportedAt)}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => exportPdf(snapshot)}
                          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-full px-4 py-2 hover:bg-slate-50 transition-colors"
                        >
                          <Download size={14} />
                          PDF
                        </button>
                        {isSelected ? (
                          <button
                            onClick={() => setSelectedId(null)}
                            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-full px-4 py-2 hover:bg-slate-50 transition-colors"
                          >
                            <Settings2 size={14} />
                            Manage Sharing
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedId(snapshot.id)}
                            className="flex items-center gap-2 bg-brand-600 text-white text-sm font-medium rounded-full px-4 py-2 hover:bg-brand-700 transition-colors"
                          >
                            <Share2 size={14} />
                            Share
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {selected && (
            <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900">
                  Share {selected.monthLabel}
                </h2>
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <Share2 size={15} className="text-brand-600" />
                </div>
              </div>

              <p className="text-xs font-medium text-slate-500 mt-4">Link Expiry</p>
              <div className="mt-2 bg-slate-100 rounded-full p-1 grid grid-cols-3">
                {EXPIRY_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    disabled
                    className={`rounded-full py-1.5 text-xs transition-colors ${
                      option === '30 Days'
                        ? 'bg-white shadow-sm font-semibold text-brand-600'
                        : 'text-slate-500'
                    } disabled:cursor-not-allowed`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-3.5 py-2.5">
                <span className="flex items-center gap-2 text-xs text-slate-600">
                  <Download size={13} className="text-slate-400" />
                  Allow PDF Download
                </span>
                <span
                  role="switch"
                  aria-checked="false"
                  aria-disabled="true"
                  className="w-10 h-5 rounded-full bg-slate-300 flex items-center px-0.5 opacity-60"
                >
                  <span className="w-4 h-4 rounded-full bg-white" />
                </span>
              </div>

              <p className="text-[10px] uppercase tracking-wide text-slate-400 mt-4">
                Active secure link
              </p>
              <div className="mt-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 truncate">
                No link issued
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="flex-1 border border-rose-200 text-rose-600 text-xs font-medium rounded-full py-2 opacity-60 cursor-not-allowed"
                >
                  Revoke Link
                </button>
                <button
                  type="button"
                  disabled
                  className="flex-1 bg-brand-600 text-white text-xs font-medium rounded-full py-2 opacity-60 cursor-not-allowed"
                >
                  Update Link
                </button>
              </div>

              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                Sharing links aren&rsquo;t switched on yet. For now a snapshot leaves
                TMG180 only when you export it yourself with PDF.
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={15} className="text-brand-600" />
              <h2 className="text-base font-semibold text-slate-900">Audit Log</h2>
            </div>

            {selected ? (
              <div className="flex flex-col gap-4">
                {selected.exportedAt && (
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-800">Exported by you</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatTimestamp(selected.exportedAt)}
                      </p>
                    </div>
                    <CircleCheck size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  </div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-800">Approved and locked</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatTimestamp(selected.lockedAt)}
                    </p>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                    You
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Who opened a shared link will appear here once sharing is switched on.
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Choose a snapshot to see what has happened to it.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
