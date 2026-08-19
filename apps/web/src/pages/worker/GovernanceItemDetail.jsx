import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Info,
  LoaderCircle,
  PenLine,
  TriangleAlert,
} from 'lucide-react';
import {
  GOVERNANCE_ITEM_STATUS,
  LEARNING_RESOURCE_STATUS,
  governanceItemStatusLabel,
} from '@tmg180/shared';
import { formatTimestamp } from '../../lib/dates';
import {
  useAcknowledgeItem,
  useGovernanceItem,
  useSaveGovernanceNote,
} from '../../hooks/worker/governance';
import { WORKER_PATHS, workerLearningPath } from '../../routes/paths';

/**
 * One governance item — Figma 1170:7877, on the UI scale.
 *
 * Confirming is deliberately one-way: the checkbox arms the button, the button
 * writes an acknowledgement against the version shown, and there is nothing on
 * the screen (or in the API) that takes it back. A new version published later
 * brings the item back with its own row; the history rail below is the whole
 * record and it only ever grows.
 *
 * The Personal Notes box is the worker's own and is not part of the
 * acknowledgement — it saves separately and nobody else can read it.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

const STATUS_TONE = {
  [GOVERNANCE_ITEM_STATUS.CONFIRMED]: {
    box: 'bg-emerald-50 border-emerald-100',
    chip: 'bg-emerald-100 text-emerald-800',
    text: 'text-emerald-900/80',
  },
  [GOVERNANCE_ITEM_STATUS.NEEDS_REVIEW]: {
    box: 'bg-amber-50 border-amber-100',
    chip: 'bg-amber-100 text-amber-800',
    text: 'text-amber-900/80',
  },
  [GOVERNANCE_ITEM_STATUS.NOT_STARTED]: {
    box: 'bg-slate-50 border-slate-200',
    chip: 'bg-slate-200 text-slate-700',
    text: 'text-slate-600',
  },
};

const STATUS_PROMPT = {
  [GOVERNANCE_ITEM_STATUS.CONFIRMED]:
    'Confirmed. Nothing is waiting on you for this version — if a new one is published, it will come back here.',
  [GOVERNANCE_ITEM_STATUS.NEEDS_REVIEW]:
    'A newer version has been published since you last confirmed this. Read it through when you have a quiet moment.',
  [GOVERNANCE_ITEM_STATUS.NOT_STARTED]:
    'We kindly ask that you read and confirm this item when you have a quiet moment.',
};

function PersonalNotes({ itemKey, note, updatedAt }) {
  const [draft, setDraft] = useState(note ?? '');
  const save = useSaveGovernanceNote(itemKey);

  // The server's copy wins whenever it changes underneath us (another tab, a
  // fresh load) — but never while the worker is mid-sentence on this one.
  useEffect(() => {
    setDraft(note ?? '');
  }, [note]);

  const dirty = draft !== (note ?? '');
  const error = save.error?.data?.note ?? (save.error && !save.error.data ? save.error.message : null);

  return (
    <section className={CARD}>
      <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
        <PenLine size={16} className="text-slate-500" />
        Personal notes
      </h2>
      <p className="text-xs text-slate-500 mt-1">
        A private space for your own reflections or reminders. Not part of your acknowledgement, and
        never shown to anyone else.
      </p>
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Add a note…"
        rows={4}
        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 mt-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600 resize-none"
      />
      {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}
      <div className="flex items-center justify-between gap-3 mt-3">
        <p className="text-xs text-slate-500">
          {updatedAt ? `Saved ${formatTimestamp(updatedAt)}` : 'Not saved yet'}
        </p>
        <button
          onClick={() => save.mutate(draft.trim() === '' ? null : draft)}
          disabled={!dirty || save.isPending}
          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-5 py-2 hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          {save.isPending ? 'Please wait…' : 'Save note'}
        </button>
      </div>
    </section>
  );
}

export default function GovernanceItemDetail() {
  const { key } = useParams();
  const navigate = useNavigate();
  const detail = useGovernanceItem(key);
  const acknowledge = useAcknowledgeItem(key);
  const [checked, setChecked] = useState(false);

  const data = detail.data;
  const item = data?.item;
  const confirmed = data?.status === GOVERNANCE_ITEM_STATUS.CONFIRMED;
  const tone = STATUS_TONE[data?.status] ?? STATUS_TONE[GOVERNANCE_ITEM_STATUS.NOT_STARTED];

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <button
        onClick={() => navigate(WORKER_PATHS.governance)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors w-fit"
      >
        <ArrowLeft size={14} />
        Back to Governance Standing
      </button>

      {detail.isLoading && (
        <div className={`flex items-center gap-3 text-slate-500 ${CARD}`}>
          <LoaderCircle size={18} className="animate-spin" />
          Loading this item…
        </div>
      )}
      {detail.error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn’t open this item.</p>
            <p className="text-sm mt-1">{detail.error.message}</p>
          </div>
        </div>
      )}

      {data && (
        <>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{item.title}</h1>
            <p className="text-base text-slate-600 mt-2 max-w-2xl">{item.summary}</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">
            <div className="flex flex-col gap-6">
              <section className="bg-purple-50/60 rounded-xl p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Info size={17} className="text-brand-600" />
                  Item overview
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">{item.overview}</p>
              </section>

              <section className={CARD}>
                <h2 className="text-lg font-semibold text-slate-900">What you are confirming</h2>
                <ul className="flex flex-col gap-3 mt-4">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-purple-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} />
                      </span>
                      <span className="text-sm text-slate-600 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>

                {data.reading && (
                  <button
                    onClick={() => navigate(workerLearningPath.resource(data.reading.slug))}
                    disabled={data.reading.status !== LEARNING_RESOURCE_STATUS.PUBLISHED}
                    className="w-full sm:w-auto inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-5 py-2.5 mt-5 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    <BookOpen size={15} className="text-brand-600" />
                    {data.reading.status === LEARNING_RESOURCE_STATUS.PUBLISHED
                      ? `Read: ${data.reading.title}`
                      : `${data.reading.title} — not published yet`}
                  </button>
                )}
              </section>

              <section className={CARD}>
                {confirmed ? (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.confirmation}</p>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                        Confirmed {formatTimestamp(data.acknowledgedAt)} against {data.acknowledgedVersion}.
                        This is part of your record and cannot be withdrawn.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-600 shrink-0"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.confirmation}</p>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                          I have read and understand this as part of my independent practice, and agree
                          to uphold these shared standards.
                        </p>
                      </div>
                    </label>

                    {acknowledge.error && (
                      <p className="text-xs text-rose-600 mt-3">{acknowledge.error.message}</p>
                    )}

                    <button
                      onClick={() => acknowledge.mutate()}
                      disabled={!checked || acknowledge.isPending}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 mt-5 shadow-md hover:bg-brand-700 disabled:opacity-50 disabled:shadow-none transition-colors"
                    >
                      <CheckCircle2 size={16} />
                      {acknowledge.isPending ? 'Please wait…' : `Confirm ${item.currentVersion}`}
                    </button>
                    <p className="text-xs text-slate-500 mt-3">
                      Confirming is recorded against {item.currentVersion} and cannot be undone.
                    </p>
                  </>
                )}
              </section>
            </div>

            <div className="flex flex-col gap-6">
              <section className={`rounded-xl border p-5 ${tone.box}`}>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${tone.chip}`}>
                  <Clock size={11} />
                  {governanceItemStatusLabel(data.status)}
                </span>
                <p className={`text-sm leading-relaxed mt-3 ${tone.text}`}>{STATUS_PROMPT[data.status]}</p>
              </section>

              <section className={CARD}>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Clock size={16} className="text-slate-500" />
                  History
                </h2>
                <div className="flex flex-col gap-4 mt-4">
                  {data.history.map((entry) => (
                    <div key={entry.version} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              entry.acknowledgedAt ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {entry.version}
                          {entry.current && <span className="text-slate-400">(current)</span>}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            entry.acknowledgedAt ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          {entry.acknowledgedAt ? 'Confirmed' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 ml-3">
                        {entry.acknowledgedAt
                          ? formatTimestamp(entry.acknowledgedAt)
                          : 'Not confirmed yet'}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                  Publication dates come from the governance register and are not recorded on the
                  platform yet.
                </p>
              </section>

              <PersonalNotes itemKey={key} note={data.note} updatedAt={data.noteUpdatedAt} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
