import { useState } from 'react';
import {
  User,
  CalendarDays,
  Info,
  Target,
  ClipboardList,
  CheckCircle2,
  TrendingUp,
  Edit3,
  History,
  Save,
  Clock,
  ArrowLeft,
  LoaderCircle,
  TriangleAlert,
} from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  DAILY_LOG_STATUS,
  comparisonLabel,
  domainLabel,
  validateAddendum,
} from '@tmg180/shared';
import Button from '../../components/ui/Button';
import { formatLogDate, formatTimeRange, formatTimestamp } from '../../lib/dates';
import { useAddAddendum, useDailyLog } from '../../hooks/participant/dailyLog';
import { participantDailyLogPath, PARTICIPANT_PATHS } from '../../routes/paths';
import { useAuthStore } from '../../store';

/**
 * A submitted Daily Support Evidence Log, read-only (Figma 1170:6606).
 *
 * Submitted means locked: nothing on this screen edits the record. The only
 * way to change what it says is to append an addendum, which is stamped and
 * kept in the history below — the append-only rule the whole evidence chain
 * rests on. A draft has nothing to append to, so it redirects to the form.
 */

function Field({ label, value, tone = 'default' }) {
  if (!value) return null;
  const styles =
    tone === 'outcome'
      ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
      : 'bg-slate-50 border-slate-100 text-slate-600';
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-2">{label}</p>
      <div className={`flex items-start gap-2 border rounded-lg px-4 py-3 text-sm ${styles}`}>
        {tone === 'outcome' && (
          <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
        )}
        <span className="whitespace-pre-wrap">{value}</span>
      </div>
    </div>
  );
}

function AddendumForm({ logId }) {
  const [text, setText] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});
  const addAddendum = useAddAddendum(logId);

  const cancel = () => {
    setText('');
    setReason('');
    setErrors({});
  };

  const save = async () => {
    const found = validateAddendum({ text, reason });
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    try {
      await addAddendum.mutateAsync({ text, reason });
      cancel();
    } catch {
      // addAddendum.error renders below; keep what was typed.
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Edit3 size={15} className="text-slate-500" />
        <h3 className="text-base font-semibold text-slate-900">Add Note</h3>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-2" htmlFor="addendumText">
            Note Content
          </label>
          <textarea
            id="addendumText"
            rows={3}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Enter additional information or clarification..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600 resize-none"
          />
          {errors.text && <p className="text-sm text-rose-700 mt-1">{errors.text}</p>}
        </div>
        <div>
          <label
            className="block text-sm font-medium text-slate-500 mb-2"
            htmlFor="addendumReason"
          >
            Reason for Note
          </label>
          <input
            id="addendumReason"
            type="text"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="e.g. Omitted detail, clarification"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600"
          />
          {errors.reason && <p className="text-sm text-rose-700 mt-1">{errors.reason}</p>}
        </div>

        <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3.5 py-2.5 text-xs text-slate-400">
          <Clock size={12} className="shrink-0" />
          Auto-populated with current date and time upon saving.
        </div>

        {addAddendum.error && (
          <p className="flex items-start gap-2 text-sm text-rose-700">
            <TriangleAlert size={14} className="shrink-0 mt-0.5" />
            {addAddendum.error.message}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 mt-1">
          <button
            type="button"
            onClick={cancel}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
          <Button
            variant="primary"
            icon={addAddendum.isPending ? LoaderCircle : Save}
            className="w-auto! px-4! py-2!"
            disabled={addAddendum.isPending}
            onClick={save}
          >
            Save Note
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function DailySupportEvidenceLog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { data: log, isLoading, error } = useDailyLog(id);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center gap-3 text-slate-500 bg-white/80 rounded-xl p-6">
        <LoaderCircle size={18} className="animate-spin" />
        Loading this log…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn&rsquo;t open this log.</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(PARTICIPANT_PATHS.dailyLog)}
          className="self-start flex items-center gap-2 text-sm text-brand-600"
        >
          <ArrowLeft size={15} />
          Back to my logs
        </button>
      </div>
    );
  }

  // A draft has nothing to append to — it is still being written.
  if (log && log.status !== DAILY_LOG_STATUS.SUBMITTED) {
    return <Navigate to={participantDailyLogPath.edit(log.id)} replace />;
  }

  const times = formatTimeRange(log.startTime, log.endTime);
  const initials = (user?.name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">
      <button
        onClick={() => navigate(PARTICIPANT_PATHS.dailyLog)}
        className="self-start flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to my logs
      </button>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 leading-snug">
            Daily Support Evidence Log
          </h1>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full mt-2">
            <CheckCircle2 size={12} />
            Submitted
            {log.submittedAt && ` ${formatTimestamp(log.submittedAt)}`}
          </span>
        </div>

        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shrink-0">
          <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center shrink-0">
            {initials || <User size={14} />}
          </div>
          <div className="pr-3 border-r border-slate-200">
            <p className="text-sm font-semibold text-slate-800 leading-none">
              {user?.name ?? 'My log'}
            </p>
            {times && <p className="text-xs text-slate-400 mt-1">{times}</p>}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <CalendarDays size={14} className="text-slate-400" />
            {formatLogDate(log.sessionDate)}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-white border-l-4 border-brand-500 border-y border-r border-slate-200 rounded-xl p-4">
        <Info size={16} className="text-brand-600 mt-0.5 shrink-0" />
        <p className="text-sm text-slate-700">
          This log has been submitted. You can add a note if something needs to be included
          or clarified.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4 items-start">
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target size={16} className="text-brand-600" />
              <h2 className="text-xl font-semibold text-slate-900">Focus Areas</h2>
            </div>

            <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-2">
              Goals Linked
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {(log.goals ?? []).map((goal) => (
                <span
                  key={goal.id}
                  className="text-sm font-medium text-brand-700 bg-purple-50 px-3 py-1.5 rounded-full"
                >
                  {goal.text}
                </span>
              ))}
            </div>

            <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-2">
              Functional Domains
            </p>
            <div className="flex flex-wrap gap-2">
              {(log.domainTags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-700 bg-sky-50 px-3 py-1.5 rounded-full"
                >
                  {domainLabel(tag)}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList size={16} className="text-sky-600" />
              <h2 className="text-xl font-semibold text-slate-900">Support Details</h2>
            </div>

            <div className="flex flex-col gap-4">
              <Field label="Impacts / Challenges" value={log.impactText} />
              <Field label="Support Provided" value={log.supportText} />
              <Field label="Outcome" value={log.outcomeText} tone="outcome" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {log.additionalNotes && (
            <div className="relative overflow-hidden bg-linear-to-br from-purple-200 via-purple-100 to-white rounded-2xl p-5">
              <User
                size={90}
                strokeWidth={1}
                className="absolute -top-3 -right-3 text-white/40"
              />
              <h3 className="text-base relative font-semibold text-fuchsia-700 mb-3">
                In my own words
              </h3>
              <div className="relative bg-white rounded-xl rounded-tl-none p-4 text-sm text-slate-700 italic whitespace-pre-wrap">
                {log.additionalNotes}
              </div>
            </div>
          )}

          {log.comparison && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={15} className="text-sky-600" />
                <h3 className="text-base font-semibold text-sky-700">
                  Usual Pattern Comparison
                </h3>
              </div>
              <span className="text-sm text-slate-600">{comparisonLabel(log.comparison)}</span>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold text-slate-900 mt-2">Notes &amp; Addendums</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <AddendumForm logId={log.id} />

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <History size={15} className="text-slate-500" />
            <h3 className="text-base font-semibold text-slate-900">History</h3>
          </div>

          {(log.addenda ?? []).length === 0 ? (
            <p className="text-sm text-slate-500">
              No notes added yet. Anything you add here is kept alongside the log, never
              inside it.
            </p>
          ) : (
            <div className="relative pl-4 flex flex-col gap-6">
              <div className="absolute left-1 top-1.5 bottom-0 w-px bg-slate-200" />
              {log.addenda.map((addendum) => (
                <div key={addendum.id} className="relative flex flex-col gap-1">
                  <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-brand-500 ring-4 ring-purple-100" />
                  <p className="text-xs text-slate-400">{formatTimestamp(addendum.createdAt)}</p>
                  {addendum.reason && (
                    <p className="text-xs font-semibold text-brand-600">
                      Reason: {addendum.reason}
                    </p>
                  )}
                  <div className="bg-slate-50 rounded-lg px-3.5 py-3 text-sm text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">
                    {addendum.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
