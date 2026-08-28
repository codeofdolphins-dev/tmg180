import { Download, Lock, LoaderCircle, ShieldCheck, Link2Off, MessageSquarePlus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import {
  SNAPSHOT_LAYERS,
  domainLabel,
  outcomeTagLabel,
  participationAreaLabel,
} from '@tmg180/shared';
import RelationalSections from '../../components/snapshot/RelationalSections';
import SupportsByBucket from '../../components/snapshot/SupportsByBucket';
import { formatShortDate, formatTimestamp } from '../../lib/dates';
import { useSharedSnapshot } from '../../hooks/participant/shareLinks';

/**
 * A shared Monthly Snapshot — what a planner, LAC or coordinator sees when
 * they open the link a participant sent them (Template C9).
 *
 * No portal chrome, no session, nothing to click into: this is the exportable
 * evidence document, read-only, for someone who has no account and never
 * will. Everything on it was approved by the participant before it locked,
 * and the participant chose who this link was for and when it stops working.
 *
 * "Download" is the browser's print dialog, and only if the participant
 * allowed it. Every open of this page is recorded for them.
 */

const CARD = 'bg-white rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

function Tile({ value, label }) {
  return (
    <div className="bg-white/70 rounded-2xl px-4 py-4 flex-1 min-w-32">
      <p className="text-2xl font-bold text-brand-700 leading-none">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mt-2">{label}</p>
    </div>
  );
}

function Unavailable() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center p-6 font-sans">
      <div className={`${CARD} max-w-md w-full text-center py-12`}>
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
          <Link2Off size={26} />
        </div>
        <h1 className="text-xl font-semibold text-slate-900 mt-6">This link is not available</h1>
        <p className="text-base text-slate-600 mt-2">
          It may have expired or been withdrawn by the person who shared it. If you still need
          this document, ask them for a new link.
        </p>
      </div>
    </div>
  );
}

export default function SharedSnapshot() {
  const { token } = useParams();
  const { data: snapshot, isLoading, error } = useSharedSnapshot(token);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center p-6 font-sans">
        <div className="flex items-center gap-3 text-slate-500">
          <LoaderCircle size={18} className="animate-spin" />
          Opening this snapshot…
        </div>
      </div>
    );
  }

  if (error || !snapshot) return <Unavailable />;

  const { stats } = snapshot;
  const hours = Math.round(((stats.totalMinutes ?? 0) / 60) * 10) / 10;
  const domains = Object.entries(stats.domains ?? {}).sort(([, a], [, b]) => b - a);
  const domainTotal = domains.reduce((sum, [, count]) => sum + count, 0) || 1;

  const layerTags = {
    functional_meaning: (snapshot.participationDomains ?? []).map(participationAreaLabel),
    outcomes: (snapshot.outcomeTags ?? []).map(outcomeTagLabel),
  };
  const written = SNAPSHOT_LAYERS.map((layer) => ({
    layer,
    fields: layer.fields.filter((field) => snapshot[field.key]?.trim()),
    tags: layerTags[layer.key] ?? [],
  })).filter((entry) => entry.fields.length > 0 || entry.tags.length > 0);

  return (
    <div className="participant-portal min-h-screen bg-[#f8f9ff] font-sans text-slate-800">
      <div className="max-w-238 mx-auto px-6 py-10 flex flex-col gap-6">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-brand-700">TMG180 · Monthly Snapshot</p>
            <h1 className="text-3xl font-bold text-slate-900 mt-2">
              {snapshot.participantName} — {snapshot.monthLabel}
            </h1>
            <p className="text-base text-slate-600 mt-2 max-w-2xl">
              A participant-approved record of one month of support, shared with you by the
              participant for: <span className="font-semibold">{snapshot.audienceLabel}</span>.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                <Lock size={11} />
                Approved and locked {formatShortDate(snapshot.lockedAt)}
              </span>
              <span className="text-xs text-slate-500">
                This link stops working on {formatShortDate(snapshot.expiresAt)}.
              </span>
            </div>
          </div>
          {snapshot.allowDownload && (
            <button
              onClick={() => globalThis.print?.()}
              className="print:hidden flex items-center gap-2 bg-brand-600 text-white text-sm font-medium rounded-full px-5 py-2.5 shadow-md hover:bg-brand-700 transition-colors"
            >
              <Download size={14} />
              Download as PDF
            </button>
          )}
        </header>

        <section className="bg-linear-to-br from-brand-50 via-brand-50/60 to-white rounded-3xl p-8">
          <div className="flex flex-wrap gap-4">
            <Tile value={stats.daysLogged ?? 0} label="Days logged" />
            <Tile value={hours} label="Hours logged" />
            <Tile value={stats.goals?.length ?? 0} label="Goals worked on" />
            <Tile value={snapshot.sourceCheckInsCount ?? 0} label="Check-ins" />
          </div>
        </section>

        {domains.length > 0 && (
          <section className={CARD}>
            <h2 className="text-xl font-semibold text-slate-900">Areas of daily life</h2>
            <p className="text-sm text-slate-600 mt-1">
              The NDIS functional domains this month&rsquo;s support touched, counted from the logs.
            </p>
            <div className="mt-5 flex flex-col gap-4">
              {domains.map(([tag, count]) => {
                const share = Math.round((count / domainTotal) * 100);
                return (
                  <div key={tag}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-900">{domainLabel(tag)}</span>
                      <span className="text-sm font-semibold text-slate-500">{share}%</span>
                    </div>
                    <div className="mt-1.5 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-600 rounded-full" style={{ width: `${share}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <SupportsByBucket buckets={stats.buckets ?? []} />

        {stats.goals?.length > 0 && (
          <section className={CARD}>
            <h2 className="text-xl font-semibold text-slate-900">Goals this month touched</h2>
            <div className="mt-4 flex flex-col gap-3">
              {stats.goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                >
                  <p className="text-sm text-slate-900">{goal.text}</p>
                  <span className="text-xs text-slate-500 shrink-0">
                    {goal.logsCount} {goal.logsCount === 1 ? 'log' : 'logs'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="bg-brand-50 rounded-xl p-6 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-white text-brand-600 flex items-center justify-center shrink-0">
            <ShieldCheck size={19} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-brand-700 font-semibold">
              Non-linear functioning
            </p>
            <p className="text-sm text-slate-700 leading-relaxed mt-1">{snapshot.nonlinearStatement}</p>
          </div>
        </section>

        {written.length > 0 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-semibold text-slate-900">In the participant&rsquo;s own words</h2>
            {written.map(({ layer, fields, tags }) => (
              <section key={layer.key} className={CARD}>
                <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{layer.label}</p>
                {tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium text-brand-700 bg-brand-50 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex flex-col gap-4">
                  {fields.map((field) => (
                    <div key={field.key}>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">{field.label}</p>
                      <p className="text-sm text-slate-700 leading-relaxed mt-1 whitespace-pre-wrap">
                        {snapshot[field.key]}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <RelationalSections values={snapshot} readOnly />

        {snapshot.addenda?.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <MessageSquarePlus size={19} className="text-slate-500" />
              <h2 className="text-xl font-semibold text-slate-900">Notes added since approval</h2>
            </div>
            {snapshot.addenda.map((addendum) => (
              <section key={addendum.id} className={CARD}>
                <p className="text-sm text-slate-800">
                  <span className="font-semibold">Added by the participant</span>
                  {addendum.reason && (
                    <>
                      <span className="text-slate-300 mx-1.5">•</span>
                      <span className="text-brand-600 font-medium">{addendum.reason}</span>
                    </>
                  )}
                  <span className="text-slate-300 mx-1.5">•</span>
                  <span className="text-slate-500">{formatTimestamp(addendum.createdAt)}</span>
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mt-1 whitespace-pre-wrap">
                  {addendum.text}
                </p>
              </section>
            ))}
          </div>
        )}

        <footer className="bg-white rounded-xl px-6 py-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-sm text-slate-600">
            Compiled from {snapshot.sourceLogsCount}{' '}
            {snapshot.sourceLogsCount === 1 ? 'daily support evidence log' : 'daily support evidence logs'}
            {snapshot.sourceCheckInsCount > 0 &&
              ` and ${snapshot.sourceCheckInsCount} participant ${
                snapshot.sourceCheckInsCount === 1 ? 'check-in' : 'check-ins'
              }`}
            . Approved and locked by the participant on {formatShortDate(snapshot.lockedAt)}; nothing
            in it has been edited since.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Every opening of this link is recorded for the participant. TMG180 is governance
            infrastructure, not a service provider, and stores no medical or treatment records.
          </p>
        </footer>
      </div>
    </div>
  );
}
