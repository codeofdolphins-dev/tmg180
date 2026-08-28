import { useEffect, useState } from 'react';
import {
  KeyRound,
  Info,
  Download,
  Share2,
  Settings2,
  ShieldCheck,
  CircleCheck,
  Lock,
  Link2,
  Copy,
  Check,
  FileText,
  LoaderCircle,
  TriangleAlert,
  Eye,
  Ban,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  SHARE_LINK_AUDIT_ACTIONS,
  SHARE_LINK_DEFAULT_EXPIRY_DAYS,
  SHARE_LINK_EXPIRY_OPTIONS,
  SHARE_LINK_STATUS,
  SNAPSHOT_SHARE_AUDIENCES,
  SNAPSHOT_STATUS,
  isShareLinkOpen,
  shareLinkStatus,
  shareLinkStatusLabel,
  validateShareLinkFields,
} from '@tmg180/shared';
import Select from '../../components/ui/Select';
import { formatShortDate, formatTimestamp } from '../../lib/dates';
import {
  useCreateShareLink,
  useRevokeShareLink,
  useShareLinks,
  useSnapshotShareLinks,
} from '../../hooks/participant/shareLinks';
import { useSnapshots } from '../../hooks/participant/snapshot';
import { PARTICIPANT_PATHS, participantSnapshotPath } from '../../routes/paths';

/**
 * Snapshot Exports (Figma 1169:1940, with the R-08a copy correction).
 *
 * Export lives here, not on the dashboard (R-02). The layout follows the frame:
 * ownership notice, the export history, and the sharing panel + access log on
 * the right.
 *
 * PDF is real — it opens the snapshot and prints it, so the document is made by
 * the browser and never passes through a server. Share links are real too
 * (28 Aug 2026, Template C9): a time-limited link to one approved snapshot,
 * for one of the audiences the template names, revocable at any time, with
 * every open recorded and shown back here as the access log. The token is
 * shown once, at creation — it is not stored, so it cannot be shown again.
 */

const CARD = 'bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

/** "Kept private" is on the C9 list and is not a link. */
const LINK_AUDIENCES = SNAPSHOT_SHARE_AUDIENCES.filter((audience) => audience.key !== 'private');

function StatusBadge({ hasOpenLink }) {
  if (hasOpenLink) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-full shrink-0">
        <Link2 size={10} />
        Link active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-200/70 px-2.5 py-1 rounded-full shrink-0">
      <Lock size={10} />
      Locked &amp; Ready
    </span>
  );
}

function LinkStatusChip({ link }) {
  const status = shareLinkStatus(link);
  const tone =
    status === SHARE_LINK_STATUS.ACTIVE
      ? 'bg-sky-50 text-sky-700'
      : status === SHARE_LINK_STATUS.REVOKED
        ? 'bg-rose-50 text-rose-700'
        : 'bg-slate-100 text-slate-600';
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${tone}`}>
      {shareLinkStatusLabel(status)}
    </span>
  );
}

/** The one time the URL is on screen. Copy it or lose it. */
function FreshLink({ url, onDone }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard blocked — the field below is selectable.
    }
  };

  return (
    <div className="mt-4 bg-sky-50 border border-sky-100 rounded-xl p-3.5">
      <p className="text-xs font-semibold text-sky-800">Your new link — copy it now</p>
      <p className="text-[11px] text-sky-700 mt-1 leading-relaxed">
        For your privacy the link is not stored, so this is the only time it can be shown. If you
        lose it, revoke it and make another.
      </p>
      <input
        readOnly
        value={url}
        onFocus={(event) => event.target.select()}
        className="mt-2 w-full bg-white border border-sky-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={copy}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-brand-600 text-white text-xs font-medium rounded-full py-2 hover:bg-brand-700 transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy link'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-xs text-slate-600 hover:text-slate-900 px-3 py-2"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function SharingPanel({ snapshot }) {
  const navigate = useNavigate();
  const { data, isLoading } = useSnapshotShareLinks(snapshot.id);
  const create = useCreateShareLink(snapshot.id);
  const revoke = useRevokeShareLink(snapshot.id);

  const [expiresInDays, setExpiresInDays] = useState(SHARE_LINK_DEFAULT_EXPIRY_DAYS);
  const [audience, setAudience] = useState('');
  const [allowDownload, setAllowDownload] = useState(false);
  const [errors, setErrors] = useState({});
  const [fresh, setFresh] = useState(null);

  // A different snapshot is a different conversation.
  useEffect(() => {
    setFresh(null);
    setErrors({});
  }, [snapshot.id]);

  const openLinks = (data?.links ?? []).filter((link) => isShareLinkOpen(link));
  const pastLinks = (data?.links ?? []).filter((link) => !isShareLinkOpen(link));

  const submit = async () => {
    const fields = { expiresInDays, audience, allowDownload };
    const found = validateShareLinkFields(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    try {
      const created = await create.mutateAsync(fields);
      setFresh(created.url);
      setAudience('');
    } catch (error) {
      if (error?.data && typeof error.data === 'object') setErrors(error.data);
    }
  };

  return (
    <div className={CARD}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Share {snapshot.monthLabel}</h2>
        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
          <Share2 size={15} className="text-brand-600" />
        </div>
      </div>

      {isLoading && (
        <p className="flex items-center gap-2 text-xs text-slate-500 mt-4">
          <LoaderCircle size={13} className="animate-spin" />
          Loading…
        </p>
      )}

      {data && !data.allowed && (
        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
          <p className="text-xs font-semibold text-amber-800">Share links are switched off</p>
          <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
            Turn on &ldquo;Allow time-limited export links&rdquo; in Privacy &amp; Sharing to make
            one. Links you have already made stay as they are.
          </p>
          <button
            type="button"
            onClick={() => navigate(PARTICIPANT_PATHS.privacySharing)}
            className="mt-2 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            Open Privacy &amp; Sharing
          </button>
        </div>
      )}

      {data?.allowed && !fresh && (
        <>
          <p className="text-xs font-medium text-slate-500 mt-4">Who is this link for?</p>
          <div className="mt-2">
            <Select
              look="box"
              inputId="shareAudience"
              aria-label="Who is this link for?"
              placeholder="Choose…"
              options={LINK_AUDIENCES.map((option) => ({ value: option.key, label: option.label }))}
              value={
                audience
                  ? { value: audience, label: LINK_AUDIENCES.find((a) => a.key === audience)?.label }
                  : null
              }
              onChange={(option) => setAudience(option?.value ?? '')}
            />
            {errors.audience && <p className="text-xs text-rose-700 mt-1">{errors.audience}</p>}
          </div>

          <p className="text-xs font-medium text-slate-500 mt-4">Link Expiry</p>
          <div className="mt-2 bg-slate-100 rounded-full p-1 grid grid-cols-3">
            {SHARE_LINK_EXPIRY_OPTIONS.map((option) => (
              <button
                key={option.days}
                type="button"
                aria-pressed={expiresInDays === option.days}
                onClick={() => setExpiresInDays(option.days)}
                className={`rounded-full py-1.5 text-xs transition-colors ${
                  expiresInDays === option.days
                    ? 'bg-white shadow-sm font-semibold text-brand-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.expiresInDays && <p className="text-xs text-rose-700 mt-1">{errors.expiresInDays}</p>}

          <button
            type="button"
            role="switch"
            aria-checked={allowDownload}
            onClick={() => setAllowDownload((value) => !value)}
            className="mt-4 w-full flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-3.5 py-2.5"
          >
            <span className="flex items-center gap-2 text-xs text-slate-600">
              <Download size={13} className="text-slate-400" />
              Allow PDF Download
            </span>
            <span
              className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                allowDownload ? 'bg-brand-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white" />
            </span>
          </button>

          {create.error && !Object.keys(errors).length && (
            <p className="text-xs text-rose-700 mt-3">{create.error.message}</p>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={create.isPending}
            className="mt-4 w-full bg-brand-600 text-white text-xs font-medium rounded-full py-2.5 hover:bg-brand-700 disabled:opacity-60 transition-colors"
          >
            {create.isPending ? 'Creating…' : 'Create link'}
          </button>
        </>
      )}

      {fresh && <FreshLink url={fresh} onDone={() => setFresh(null)} />}

      {openLinks.length > 0 && (
        <>
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mt-5">Active secure links</p>
          <div className="mt-2 flex flex-col gap-2">
            {openLinks.map((link) => (
              <div key={link.id} className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-slate-700 truncate">{link.audienceLabel}</p>
                  <LinkStatusChip link={link} />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Stops working {formatShortDate(link.expiresAt)}
                  {link.allowDownload ? ' · download allowed' : ' · read only'}
                  {link.openCount > 0 &&
                    ` · opened ${link.openCount} ${link.openCount === 1 ? 'time' : 'times'}`}
                </p>
                <button
                  type="button"
                  onClick={() => revoke.mutate(link.id)}
                  disabled={revoke.isPending}
                  className="mt-2 text-xs font-medium text-rose-600 hover:text-rose-700 disabled:opacity-60"
                >
                  Revoke link
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {pastLinks.length > 0 && (
        <>
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mt-5">Past links</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {pastLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                <span className="truncate">{link.audienceLabel} · made {formatShortDate(link.createdAt)}</span>
                <LinkStatusChip link={link} />
              </div>
            ))}
          </div>
        </>
      )}

      <p className="text-xs text-slate-500 mt-4 leading-relaxed">
        A link opens this one approved snapshot, read-only, to whoever has it. Every opening is
        recorded below. You can revoke a link at any time — that is final.
      </p>
    </div>
  );
}

const EVENT_TONE = {
  success: 'text-brand-600',
  completed: 'text-emerald-500',
  revoked: 'text-rose-500',
};

function AccessLog({ snapshot }) {
  const { data } = useSnapshotShareLinks(snapshot.id);
  const events = data?.events ?? [];

  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => {
        const meta = SHARE_LINK_AUDIT_ACTIONS[event.action];
        if (!meta) return null;
        const opened = event.action === 'snapshot_link_opened';
        return (
          <div key={event.id} className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-800">
                {meta.label}
                {event.details?.audience &&
                  ` — ${SNAPSHOT_SHARE_AUDIENCES.find((a) => a.key === event.details.audience)?.label ?? ''}`}
              </p>
              <p className="text-xs text-slate-400 mt-1">{formatTimestamp(event.createdAt)}</p>
            </div>
            {opened ? (
              <Eye size={15} className={`${EVENT_TONE[meta.tone]} shrink-0 mt-0.5`} />
            ) : meta.tone === 'revoked' ? (
              <Ban size={15} className={`${EVENT_TONE[meta.tone]} shrink-0 mt-0.5`} />
            ) : (
              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                You
              </span>
            )}
          </div>
        );
      })}
      {snapshot.exportedAt && (
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-800">Exported by you</p>
            <p className="text-xs text-slate-400 mt-1">{formatTimestamp(snapshot.exportedAt)}</p>
          </div>
          <CircleCheck size={15} className="text-emerald-500 shrink-0 mt-0.5" />
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-800">Approved and locked</p>
          <p className="text-xs text-slate-400 mt-1">{formatTimestamp(snapshot.lockedAt)}</p>
        </div>
        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
          You
        </span>
      </div>
      {events.length === 0 && (
        <p className="text-xs text-slate-400 leading-relaxed">
          Who opened a shared link, and when, will appear here.
        </p>
      )}
    </div>
  );
}

export default function SnapshotExports() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: snapshots, isLoading, error } = useSnapshots();
  const { data: allLinks } = useShareLinks();

  const selectedId = Number(searchParams.get('snapshot')) || null;
  const setSelectedId = (id) => setSearchParams(id ? { snapshot: String(id) } : {}, { replace: true });

  const locked = (snapshots ?? []).filter((snapshot) => snapshot.status === SNAPSHOT_STATUS.LOCKED);
  const selected = locked.find((snapshot) => snapshot.id === selectedId) ?? null;
  const hasOpenLink = (snapshotId) =>
    (allLinks ?? []).some((link) => link.snapshotId === snapshotId && isShareLinkOpen(link));

  // "PDF" hands the snapshot to the browser's print dialog; the detail screen
  // owns the printable rendering, so it opens there and prints on arrival.
  const exportPdf = (snapshot) =>
    navigate(participantSnapshotPath.detail(snapshot.id), { state: { print: true } });

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Snapshot Exports</h1>
        <p className="text-base text-slate-500 mt-1">You own this information. You decide who sees it.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="flex flex-col gap-5">
          <div className="bg-linear-to-r from-brand-50 via-brand-50/60 to-white rounded-3xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                <KeyRound size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Participant-Owned Data</h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  You are in complete control. These monthly snapshots compile your logged
                  progress. Exports contain only what you&rsquo;ve chosen to share. TMG180 stores
                  no medical or treatment records. You decide exactly who receives this export and
                  for how long they have access.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#eff4ff] rounded-2xl p-4">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
              <Info size={13} className="text-white" />
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              <span className="font-semibold">Notice:</span> You are about to download private
              health information. Please ensure you only share these documents or links with
              individuals you explicitly trust.
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-3">Export history</p>

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
                <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                  <FileText size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-5">Nothing to export yet</h3>
                <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                  A snapshot can be exported or shared once you have approved it. Approving locks
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
                          ? 'bg-brand-50 border-l-4 border-brand-600'
                          : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {snapshot.monthLabel} Snapshot
                          </h3>
                          <StatusBadge hasOpenLink={hasOpenLink(snapshot.id)} />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Approved {formatShortDate(snapshot.lockedAt)}
                          {snapshot.exportedAt && ` • Last Exported ${formatShortDate(snapshot.exportedAt)}`}
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
                            Close
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
          {selected && <SharingPanel snapshot={selected} />}

          <div className={CARD}>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={15} className="text-brand-600" />
              <h2 className="text-base font-semibold text-slate-900">Access Log</h2>
            </div>
            {selected ? (
              <AccessLog snapshot={selected} />
            ) : (
              <p className="text-sm text-slate-500">Choose a snapshot to see what has happened to it.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
