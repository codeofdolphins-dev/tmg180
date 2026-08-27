import { useEffect, useRef, useState } from 'react';
import {
  Lock,
  MessageSquarePlus,
  Download,
  Share2,
  ScrollText,
  Activity,
  PieChart,
  Quote,
  ArrowLeft,
  LoaderCircle,
  TriangleAlert,
  CalendarClock,
} from 'lucide-react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  SNAPSHOT_ADDENDUM_REASONS,
  SNAPSHOT_LAYERS,
  SNAPSHOT_STATUS,
  domainLabel,
  validateSnapshotAddendum,
} from '@tmg180/shared';
import Select from '../../components/ui/Select';
import SupportsByBucket from '../../components/snapshot/SupportsByBucket';
import { formatLogDate, formatShortDate, formatTimestamp } from '../../lib/dates';
import {
  useAddSnapshotAddendum,
  useExportSnapshot,
  useSnapshot,
} from '../../hooks/participant/snapshot';
import { PARTICIPANT_PATHS, participantSnapshotPath } from '../../routes/paths';

/**
 * An approved Monthly Snapshot (Figma 1169:1767, and 1170:6451 for the addendum
 * state — the same screen, two states, switched by the Addendum button).
 *
 * Nothing here edits the record. An addendum is appended and stamped beside it,
 * so the snapshot stays exactly as it was approved. A draft has nothing to
 * append to, so it redirects back to review.
 *
 * `print:` classes strip the chrome and the controls so "Download as PDF"
 * prints the snapshot itself. Share links and the access audit log belong to
 * the external access layer, which is unbuilt — those two actions render
 * disabled rather than being dropped from the layout.
 */

function ReadOnlyTag() {
  return (
    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
      Read-only view
    </span>
  );
}

function AddendumPanel({ snapshotId, onDone }) {
  const [text, setText] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});
  const addAddendum = useAddSnapshotAddendum(snapshotId);

  const save = async () => {
    const found = validateSnapshotAddendum({ text, reason });
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    try {
      await addAddendum.mutateAsync({ text, reason });
      setText('');
      setReason('');
      onDone?.();
    } catch {
      // addAddendum.error renders below; keep what was typed.
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] print:hidden">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
          <MessageSquarePlus size={16} className="text-white" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Add Addendum</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-2" htmlFor="addendumDate">
            Date Added
          </label>
          <input
            id="addendumDate"
            type="text"
            readOnly
            value={formatLogDate(new Date().toISOString().slice(0, 10))}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-500 mb-2" htmlFor="addendumReason">
            Reason for Addendum
          </label>
          <Select
            look="box"
            inputId="addendumReason"
            aria-label="Reason for addendum"
            isClearable
            placeholder="Select a reason..."
            options={SNAPSHOT_ADDENDUM_REASONS.map((option) => ({ value: option, label: option }))}
            value={reason ? { value: reason, label: reason } : null}
            onChange={(option) => setReason(option?.value ?? '')}
          />
          {errors.reason && <p className="text-sm text-rose-700 mt-1">{errors.reason}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-500 mb-2" htmlFor="addendumText">
            Addendum Note
          </label>
          <textarea
            id="addendumText"
            rows={4}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Share any additional details that feel important to include for this period..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600 resize-none"
          />
          {errors.text && <p className="text-sm text-rose-700 mt-1">{errors.text}</p>}
        </div>

        <p className="flex items-center gap-2 text-xs text-slate-400">
          <CalendarClock size={12} className="shrink-0" />
          Auto-populated with the current date and time upon saving.
        </p>

        {addAddendum.error && (
          <p className="flex items-start gap-2 text-sm text-rose-700">
            <TriangleAlert size={14} className="shrink-0 mt-0.5" />
            {addAddendum.error.message}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={addAddendum.isPending}
            className="bg-brand-600 text-white text-sm font-medium rounded-full px-5 py-2.5 hover:bg-brand-700 disabled:opacity-50 transition-colors"
          >
            {addAddendum.isPending ? 'Saving…' : 'Save Addendum'}
          </button>
          <button
            type="button"
            onClick={onDone}
            className="text-sm text-slate-500 hover:text-slate-700 px-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MonthlySnapshotSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const printed = useRef(false);
  const [addendumOpen, setAddendumOpen] = useState(false);
  const { data: snapshot, isLoading, error } = useSnapshot(id);
  const exportSnapshot = useExportSnapshot(id);

  // Arriving from the Exports screen's PDF button: print as soon as the
  // snapshot is on screen. The flag is cleared first so a refresh afterwards
  // does not open the dialog again.
  useEffect(() => {
    if (!snapshot || !location.state?.print || printed.current) return;
    printed.current = true;
    navigate(location.pathname, { replace: true, state: null });
    exportSnapshot.mutate();
  }, [snapshot, location, navigate, exportSnapshot]);

  if (isLoading) {
    return (
      <div className="max-w-238 mx-auto flex items-center gap-3 text-slate-500 bg-white/70 rounded-3xl p-6">
        <LoaderCircle size={18} className="animate-spin" />
        Loading your snapshot…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-238 mx-auto flex flex-col gap-4">
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-2xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn&rsquo;t open this snapshot.</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(PARTICIPANT_PATHS.snapshot)}
          className="self-start flex items-center gap-2 text-sm text-brand-600"
        >
          <ArrowLeft size={15} />
          Back to my snapshots
        </button>
      </div>
    );
  }

  // A draft is still being reviewed — there is nothing to append to yet.
  if (snapshot && snapshot.status !== SNAPSHOT_STATUS.LOCKED) {
    return <Navigate to={participantSnapshotPath.review(snapshot.id)} replace />;
  }

  const { stats } = snapshot;
  const domainEntries = Object.entries(stats.domains ?? {}).sort(([, a], [, b]) => b - a);
  const domainTotal = domainEntries.reduce((sum, [, count]) => sum + count, 0) || 1;
  const hours = Math.round(((stats.totalMinutes ?? 0) / 60) * 10) / 10;
  const written = SNAPSHOT_LAYERS.map((layer) => ({
    layer,
    fields: layer.fields.filter((field) => snapshot[field.key]?.trim()),
  })).filter((entry) => entry.fields.length > 0);

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <button
        onClick={() => navigate(PARTICIPANT_PATHS.snapshot)}
        className="self-start flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors print:hidden"
      >
        <ArrowLeft size={15} />
        Back to my snapshots
      </button>

      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-158.25">
          <h1 className="text-3xl font-semibold text-[#0b1c30]">
            {snapshot.monthLabel} Snapshot
          </h1>
          <p className="text-base text-[#4d4354] mt-2">
            A comprehensive review of your activities, reflections and milestones for the
            past month.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full mt-4">
            <Lock size={12} />
            Approved and Locked
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 print:hidden">
          <button
            onClick={() => setAddendumOpen((open) => !open)}
            className={`flex items-center gap-2 text-sm font-medium rounded-full px-5 py-2.5 transition-colors ${
              addendumOpen
                ? 'bg-purple-100 text-brand-700'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <MessageSquarePlus size={15} />
            Addendum
          </button>
          <button
            onClick={() => exportSnapshot.mutate()}
            disabled={exportSnapshot.isPending}
            className="flex items-center gap-2 bg-brand-600 text-white text-sm font-medium rounded-full px-5 py-2.5 shadow-md hover:bg-brand-700 disabled:opacity-50 transition-colors"
          >
            <Download size={15} />
            Export Snapshot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white/70 rounded-3xl p-8">
          <div className="flex items-center gap-3">
            <Activity size={19} className="text-[#7800ce]" />
            <h2 className="text-xl font-semibold text-[#0b1c30]">Core Engagement</h2>
          </div>
          <div className="mt-6 flex flex-col gap-5">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                Total hours logged
              </p>
              <p className="text-3xl font-bold text-[#0b1c30] mt-1">
                {hours}
                <span className="text-sm font-semibold text-slate-500 ml-1">hrs</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                Consistency streak
              </p>
              <p className="text-3xl font-bold text-[#0b1c30] mt-1">
                {stats.streakDays ?? 0}
                <span className="text-sm font-semibold text-slate-500 ml-1">
                  {stats.streakDays === 1 ? 'day' : 'days'}
                </span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {stats.daysLogged} {stats.daysLogged === 1 ? 'day' : 'days'} logged across the
                month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 rounded-3xl p-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <PieChart size={19} className="text-[#2170e4]" />
              <h2 className="text-xl font-semibold text-[#0b1c30]">Focus Areas</h2>
            </div>
            <ReadOnlyTag />
          </div>

          {domainEntries.length === 0 ? (
            <p className="text-sm text-slate-500 mt-6">
              No areas of daily life were tagged on this month&rsquo;s logs.
            </p>
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              {domainEntries.map(([tag, count]) => {
                const share = Math.round((count / domainTotal) * 100);
                return (
                  <div key={tag}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-[#0b1c30]">{domainLabel(tag)}</span>
                      <span className="text-sm font-semibold text-[#4d4354]">{share}%</span>
                    </div>
                    <div className="mt-1.5 h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-600 rounded-full"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Goal Link Helper roll-up — supports used this month, by NDIS budget bucket */}
      <SupportsByBucket buckets={stats.buckets ?? []} />

      <div className="bg-white/70 rounded-3xl p-8">
        <div className="flex items-center gap-3">
          <Quote size={19} className="text-[#9333ea]" />
          <h2 className="text-xl font-semibold text-[#0b1c30]">Monthly Reflection</h2>
        </div>
        <div className="mt-5 bg-white/50 rounded-2xl p-6">
          {snapshot.participantStory?.trim() ? (
            <p className="text-base text-slate-700 italic leading-relaxed whitespace-pre-wrap">
              &ldquo;{snapshot.participantStory}&rdquo;
            </p>
          ) : (
            <p className="text-sm text-slate-500">
              This snapshot was approved without a written reflection — the record below is
              what your logs show for the month.
            </p>
          )}
        </div>
      </div>

      {addendumOpen ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_366px] gap-6 items-start">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <ScrollText size={19} className="text-slate-500" />
              <h2 className="text-xl font-semibold text-[#0b1c30]">Snapshot Preview</h2>
            </div>
            {written.length === 0 ? (
              <p className="text-sm text-slate-500">
                No written sections — this snapshot is the record of the logs behind it.
              </p>
            ) : (
              written.map(({ layer, fields }) => (
                <div key={layer.key} className="bg-white rounded-2xl p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-600">
                    {layer.label}
                  </p>
                  <div className="mt-4 flex flex-col gap-4">
                    {fields.map((field) => (
                      <div key={field.key}>
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">
                          {field.label}
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed mt-1 whitespace-pre-wrap">
                          {snapshot[field.key]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <AddendumPanel snapshotId={snapshot.id} onDone={() => setAddendumOpen(false)} />
        </div>
      ) : (
        written.length > 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <ScrollText size={19} className="text-slate-500" />
              <h2 className="text-xl font-semibold text-[#0b1c30]">Snapshot Preview</h2>
            </div>
            {written.map(({ layer, fields }) => (
              <div key={layer.key} className="bg-white rounded-2xl p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-600">
                  {layer.label}
                </p>
                <div className="mt-4 flex flex-col gap-4">
                  {fields.map((field) => (
                    <div key={field.key}>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        {field.label}
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed mt-1 whitespace-pre-wrap">
                        {snapshot[field.key]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {snapshot.addenda?.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[#0b1c30]">Addendum History</h2>
          {snapshot.addenda.map((addendum) => {
            const added = new Date(addendum.createdAt);
            return (
              <div
                key={addendum.id}
                className="bg-white rounded-2xl p-5 flex gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="flex flex-col items-center justify-center bg-sky-50 rounded-xl w-14 h-14 shrink-0">
                  <span className="text-[10px] font-semibold text-sky-500 uppercase">
                    {added.toLocaleDateString('en-AU', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold text-sky-700 leading-none">
                    {added.getDate()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-800">
                    <span className="font-semibold">Added by Participant</span>
                    {addendum.reason && (
                      <>
                        <span className="text-slate-300 mx-1.5">•</span>
                        <span className="text-brand-600 font-medium">{addendum.reason}</span>
                      </>
                    )}
                  </p>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed whitespace-pre-wrap">
                    {addendum.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white/70 rounded-3xl px-8 py-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#4d4354]">
            Snapshot was locked on {formatShortDate(snapshot.lockedAt)}.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Compiled from {stats.logsCount}{' '}
            {stats.logsCount === 1
              ? 'Daily Support Evidence Log'
              : 'Daily Support Evidence Logs'}
            {snapshot.exportedAt && ` · last exported ${formatTimestamp(snapshot.exportedAt)}`}.
            TMG180 stores no medical or treatment records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <button
            onClick={() => exportSnapshot.mutate()}
            disabled={exportSnapshot.isPending}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-full px-5 py-2.5 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            <Download size={14} />
            Download as PDF
          </button>
          <button
            type="button"
            disabled
            title="Sharing links need the external access layer, which is not built yet."
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 text-sm font-medium rounded-full px-5 py-2.5 opacity-60 cursor-not-allowed"
          >
            <Share2 size={14} />
            Share time-limited link
          </button>
          <button
            type="button"
            disabled
            title="The access audit log arrives with sharing links."
            className="text-sm text-slate-400 px-2 opacity-60 cursor-not-allowed"
          >
            View audit log
          </button>
        </div>
      </div>
    </div>
  );
}
