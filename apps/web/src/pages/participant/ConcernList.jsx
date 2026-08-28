import {
  ChevronRight,
  CirclePlus,
  ExternalLink,
  LoaderCircle,
  MessageSquareWarning,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  CONCERN_EXTERNAL_BODIES,
  CONCERN_NO_RETALIATION,
  CONCERN_STATUS,
  concernCategoryLabel,
  concernKindLabel,
  concernStatusLabel,
} from '@tmg180/shared';
import { formatShortDate } from '../../lib/dates';
import { useConcerns } from '../../hooks/participant/concerns';
import { participantConcernPath, PARTICIPANT_PATHS } from '../../routes/paths';

/**
 * Raise a concern — the participant's tickets under Mandatory Policy 2
 * ("Complaints, Concerns and Feedback"), newest first.
 *
 * Two things sit on this screen at all times, not only once something is
 * raised: the policy's protection from retaliation, and the external bodies a
 * participant may go to directly. Policy 5: "TMG180 Governance Administration
 * does not discourage or restrict external complaints." Putting the
 * regulator's name behind a form would.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

const STATUS_TONE = {
  [CONCERN_STATUS.RECEIVED]: 'bg-amber-50 text-amber-700',
  [CONCERN_STATUS.ACKNOWLEDGED]: 'bg-sky-50 text-sky-700',
  [CONCERN_STATUS.IN_REVIEW]: 'bg-sky-50 text-sky-700',
  [CONCERN_STATUS.RESPONDED]: 'bg-emerald-50 text-emerald-700',
  [CONCERN_STATUS.REFERRED]: 'bg-indigo-50 text-indigo-700',
  [CONCERN_STATUS.CLOSED]: 'bg-slate-100 text-slate-600',
};

export function ConcernStatusChip({ status }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${
        STATUS_TONE[status] ?? 'bg-slate-100 text-slate-600'
      }`}
    >
      {concernStatusLabel(status)}
    </span>
  );
}

/** The two things that never leave the screen. Shared with the form and the detail. */
export function ConcernSafeguards() {
  return (
    <div className="flex flex-col gap-4">
      <section className={CARD}>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-brand-600" />
          <h2 className="text-base font-semibold text-slate-900">Protection from retaliation</h2>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {CONCERN_NO_RETALIATION.map((line) => (
            <p key={line} className="text-sm text-slate-600 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </section>

      <section className={CARD}>
        <div className="flex items-center gap-2">
          <ExternalLink size={16} className="text-brand-600" />
          <h2 className="text-base font-semibold text-slate-900">You can always go directly to</h2>
        </div>
        <ul className="mt-3 list-disc pl-5 flex flex-col gap-1.5 text-sm text-slate-600">
          {CONCERN_EXTERNAL_BODIES.map((body) => (
            <li key={body}>{body}</li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          Raising something here does not replace those pathways, and TMG180 does not discourage
          or restrict them. If there is immediate risk, contact emergency services first.
        </p>
      </section>
    </div>
  );
}

function ConcernRow({ concern, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="w-full text-left bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-semibold text-slate-900">
              {concernKindLabel(concern.kind)} · {concernCategoryLabel(concern.category)}
            </h2>
            <ConcernStatusChip status={concern.status} />
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Raised {formatShortDate(concern.createdAt)}
            {concern.responsesCount > 0 &&
              ` · ${concern.responsesCount} ${concern.responsesCount === 1 ? 'response' : 'responses'}`}
          </p>
        </div>
        <ChevronRight size={18} className="text-slate-400 shrink-0 mt-1" />
      </div>
      <p className="mt-4 text-sm text-slate-600 line-clamp-2">{concern.description}</p>
    </button>
  );
}

export default function ConcernList() {
  const navigate = useNavigate();
  const { data: concerns, isLoading, error } = useConcerns();

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Raise a concern</h1>
          <p className="text-base text-slate-600 mt-2 max-w-2xl">
            A concern, a complaint or feedback about the platform or about support — raised
            early, in your own words, without fear, blame or retaliation. Raising a concern is
            not a sign of failure.
          </p>
        </div>
        <button
          onClick={() => navigate(PARTICIPANT_PATHS.concernNew)}
          className="flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 shadow-md hover:bg-brand-700 transition-colors shrink-0"
        >
          <CirclePlus size={16} />
          Raise a concern
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="flex flex-col gap-4">
          {isLoading && (
            <div className="flex items-center gap-3 text-slate-500 bg-white/80 rounded-xl p-6">
              <LoaderCircle size={18} className="animate-spin" />
              Loading…
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
              <TriangleAlert size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">We couldn&rsquo;t load your concerns.</p>
                <p className="text-sm mt-1">{error.message}</p>
              </div>
            </div>
          )}

          {concerns?.length === 0 && (
            <div className="bg-white/80 rounded-xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <MessageSquareWarning size={26} />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mt-6">Nothing raised yet</h2>
              <p className="text-base text-slate-600 mt-2 max-w-md mx-auto">
                If something feels unsafe, confusing or not right, you can raise it here. You do
                not need formal wording, and you do not need to be sure whose issue it is.
              </p>
              <button
                onClick={() => navigate(PARTICIPANT_PATHS.concernNew)}
                className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 mt-6 shadow-md hover:bg-brand-700 transition-colors"
              >
                <CirclePlus size={16} />
                Raise a concern
              </button>
            </div>
          )}

          {concerns?.length > 0 &&
            concerns.map((concern) => (
              <ConcernRow
                key={concern.id}
                concern={concern}
                onOpen={() => navigate(participantConcernPath.detail(concern.id))}
              />
            ))}
        </div>

        <ConcernSafeguards />
      </div>
    </div>
  );
}
