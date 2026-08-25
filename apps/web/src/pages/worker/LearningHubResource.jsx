import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Info,
  LoaderCircle,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import { governanceItem, learningKindLabel } from '@tmg180/shared';
import { formatShortDate } from '../../lib/dates';
import { useLearningResource, useUpdateLearningProgress } from '../../hooks/worker/learning';
import { WORKER_PATHS, workerGovernancePath, workerLearningPath } from '../../routes/paths';

/**
 * One reading — Figma 1170:8551, on the UI scale.
 *
 * The frame's "Download .docx" belongs to a world where the evidence template
 * is a Word file you fill in offline. On TMG180 the log form *is* the
 * template, so the control stays where the frame puts it, switched off and
 * saying why, and the reading's own action ("Start a log") sits beside it.
 *
 * Saving and marking as read are the worker's own bookkeeping and both undo —
 * unlike a governance acknowledgement, which is a statement of record.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

/** A reading's `action.target` names a screen; this is the only place they meet. */
const ACTION_PATH = {
  daily_log_new: WORKER_PATHS.dailyLogNew,
  daily_logs: WORKER_PATHS.dailyLogs,
  snapshots: WORKER_PATHS.snapshots,
  participants: WORKER_PATHS.participants,
  governance: WORKER_PATHS.governance,
  profile: WORKER_PATHS.profile,
};

export default function LearningHubResource() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const reading = useLearningResource(slug);
  const progress = useUpdateLearningProgress(slug);

  // A governance item can send the worker here to read before confirming
  // (`?from=<item key>`). They came to finish that item, so the way back is
  // the item — not the Hub, which they never chose to open.
  const fromItem = governanceItem(params.get('from') ?? '');

  const resource = reading.data?.resource;
  const body = resource?.body;
  const saved = Boolean(resource?.progress?.savedAt);
  const completed = Boolean(resource?.progress?.completedAt);
  const actionPath = resource?.action ? ACTION_PATH[resource.action.target] : null;

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <button
        onClick={() =>
          navigate(
            fromItem ? workerGovernancePath.item(fromItem.key) : WORKER_PATHS.learningHub
          )
        }
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors w-fit"
      >
        <ArrowLeft size={14} />
        {fromItem ? `Back to ${fromItem.title}` : 'Back to Learning Hub'}
      </button>

      {reading.isLoading && (
        <div className={`flex items-center gap-3 text-slate-500 ${CARD}`}>
          <LoaderCircle size={18} className="animate-spin" />
          Loading this reading…
        </div>
      )}
      {reading.error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn’t open this reading.</p>
            <p className="text-sm mt-1">{reading.error.message}</p>
          </div>
        </div>
      )}

      {resource && (
        <>
          <section className="bg-purple-50/60 rounded-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 bg-purple-100 px-2.5 py-1 rounded-full">
                    <Bookmark size={11} />
                    {learningKindLabel(resource.kind)}
                  </span>
                  {resource.readMinutes && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={11} />
                      {resource.readMinutes} min read
                    </span>
                  )}
                  {resource.updatedAt && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Calendar size={11} />
                      Updated {formatShortDate(resource.updatedAt)}
                    </span>
                  )}
                  {completed && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <Check size={11} />
                      Read
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mt-3">{resource.title}</h1>
                <p className="text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
                  {resource.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => progress.mutate({ saved: !saved })}
                  disabled={progress.isPending}
                  className={`inline-flex items-center gap-2 text-sm rounded-full px-4 py-2.5 border transition-colors disabled:opacity-60 ${
                    saved
                      ? 'bg-purple-100 border-purple-200 text-brand-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark size={15} />
                  {saved ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={() => progress.mutate({ completed: !completed })}
                  disabled={progress.isPending}
                  className={`inline-flex items-center gap-2 text-sm rounded-full px-4 py-2.5 transition-colors disabled:opacity-60 ${
                    completed
                      ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      : 'bg-brand-600 text-white shadow-md hover:bg-brand-700'
                  }`}
                >
                  <CheckCircle2 size={15} />
                  {completed ? 'Mark unread' : 'Mark as read'}
                </button>
              </div>
            </div>
            {progress.error && (
              <p className="text-xs text-rose-600 mt-3">{progress.error.message}</p>
            )}
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 items-start">
            <div className="flex flex-col gap-6">
              <section className={CARD}>
                <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
                {body.overview.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-slate-600 leading-relaxed mt-3">
                    {paragraph}
                  </p>
                ))}
              </section>

              {body.steps.length > 0 && (
                <section className={CARD}>
                  <h2 className="text-lg font-semibold text-slate-900">What it covers</h2>
                  <div className="flex flex-col gap-4 mt-4">
                    {body.steps.map((step, index) => (
                      <div key={step.title} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                          <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{step.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {body.example && (
                <section className={CARD}>
                  <h2 className="text-lg font-semibold text-slate-900">{body.example.title}</h2>
                  <pre className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-4 text-xs text-slate-600 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {body.example.lines.join('\n')}
                  </pre>
                </section>
              )}

              {body.notes.length > 0 && (
                <section className="bg-[#eff4ff]/70 rounded-xl p-6">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Info size={17} className="text-[#2170e4]" />
                    Worth knowing
                  </h2>
                  {body.notes.map((note) => (
                    <p key={note} className="text-sm text-slate-600 leading-relaxed mt-3">
                      {note}
                    </p>
                  ))}
                </section>
              )}
            </div>

            <div className="flex flex-col gap-6">
              {/* Read in order to confirm a governance item — close that loop
                  here rather than leaving the worker to find their way back. */}
              {fromItem && (
                <section className={`${CARD} text-center`}>
                  <div className="w-11 h-11 rounded-xl bg-purple-50 text-brand-600 flex items-center justify-center mx-auto">
                    <ShieldCheck size={19} />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 mt-3">
                    Finish confirming
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    You opened this from {fromItem.title}. Confirming happens there,
                    once you have read this.
                  </p>
                  <button
                    onClick={() => navigate(workerGovernancePath.item(fromItem.key))}
                    className="w-full bg-brand-600 text-white text-sm rounded-full py-2.5 mt-4 shadow-md hover:bg-brand-700 transition-colors"
                  >
                    Back to {fromItem.title}
                  </button>
                </section>
              )}

              {actionPath && (
                <section className={`${CARD} text-center`}>
                  <div className="w-11 h-11 rounded-xl bg-purple-50 text-brand-600 flex items-center justify-center mx-auto">
                    <ArrowRight size={19} />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 mt-3">Put it to use</h2>
                  <button
                    onClick={() => navigate(actionPath)}
                    className="w-full bg-brand-600 text-white text-sm rounded-full py-2.5 mt-4 shadow-md hover:bg-brand-700 transition-colors"
                  >
                    {resource.action.label}
                  </button>
                </section>
              )}

              <section className={CARD}>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Download size={17} className="text-slate-400" />
                  Download
                </h2>
                <button
                  disabled
                  title="No file to download"
                  className="w-full bg-slate-50 text-slate-400 text-sm rounded-full py-2.5 mt-4 cursor-not-allowed"
                >
                  Download a copy
                </button>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  There is no file to download — everything this reading describes happens in the
                  workspace itself.
                </p>
              </section>

              <section className="bg-sky-50 rounded-xl p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Info size={17} className="text-sky-600" />
                  AI search notice
                </h2>
                <p className="text-xs text-sky-900/70 leading-relaxed mt-2">
                  AI search uses Core Library only, and is not switched on yet. When it is, it will draw
                  on approved platform material and nothing else.
                </p>
              </section>
            </div>
          </div>

          {reading.data.related.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Related readings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {reading.data.related.map((other) => (
                  <button
                    key={other.slug}
                    onClick={() => navigate(workerLearningPath.resource(other.slug))}
                    className="bg-white/80 rounded-xl p-5 text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-brand-700">
                        {learningKindLabel(other.kind)}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center">
                        {other.kind === 'template' ? <FileText size={14} /> : <BookOpen size={14} />}
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug">{other.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">{other.summary}</p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
