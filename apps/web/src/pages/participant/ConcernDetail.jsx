import { useState } from 'react';
import { ArrowLeft, LoaderCircle, MessageSquarePlus, TriangleAlert } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ROLES,
  concernCategoryLabel,
  concernKindLabel,
  concernRelatesToLabel,
  isConcernOpen,
  validateConcernResponse,
} from '@tmg180/shared';
import { formatTimestamp } from '../../lib/dates';
import { useAddConcernFollowUp, useConcern } from '../../hooks/participant/concerns';
import { PARTICIPANT_PATHS } from '../../routes/paths';
import { ConcernSafeguards, ConcernStatusChip } from './ConcernList';

/**
 * One raised concern: what was said, what has happened since, and — while it
 * is open — a place to add to it. The original is never edited; a follow-up is
 * appended and stamped, which is what makes the thread a record.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

const authorName = (role) => (role === ROLES.PARTICIPANT ? 'You' : 'Platform Governance');

function FollowUp({ concern }) {
  const [text, setText] = useState('');
  const [fieldError, setFieldError] = useState('');
  const add = useAddConcernFollowUp(concern.id);

  const send = async () => {
    const errors = validateConcernResponse({ text }, concern);
    setFieldError(errors.text ?? '');
    if (errors.text) return;
    try {
      await add.mutateAsync(text);
      setText('');
    } catch {
      // add.error renders below; keep what was typed.
    }
  };

  return (
    <section className={CARD}>
      <div className="flex items-center gap-2">
        <MessageSquarePlus size={16} className="text-brand-600" />
        <h2 className="text-base font-semibold text-slate-900">Add to this</h2>
      </div>
      <p className="text-sm text-slate-600 mt-1">
        Something more to say, or something that has changed. It is added underneath — nothing
        above is rewritten.
      </p>
      <textarea
        rows={4}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="In your own words"
        className="mt-4 w-full rounded-2xl bg-white border border-[#e5eeff] px-4 py-3 text-base text-[#0b1c30] placeholder:text-[#8c8a94] focus:outline-none focus:border-[#005f40]"
      />
      {(fieldError || add.error) && (
        <p className="mt-2 text-sm text-[#ba1a1a] flex items-center gap-1.5">
          <TriangleAlert size={13} className="shrink-0" />
          {fieldError || add.error.message}
        </p>
      )}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={send}
          disabled={add.isPending}
          className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-2.5 shadow-md hover:bg-brand-700 transition-colors disabled:opacity-60"
        >
          {add.isPending ? 'Adding…' : 'Add'}
        </button>
      </div>
    </section>
  );
}

export default function ConcernDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: concern, isLoading, error } = useConcern(id);

  const back = (
    <button
      onClick={() => navigate(PARTICIPANT_PATHS.concerns)}
      className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
    >
      <ArrowLeft size={15} />
      All concerns
    </button>
  );

  if (isLoading) {
    return (
      <div className="max-w-238 mx-auto flex items-center gap-3 text-slate-500 bg-white/80 rounded-xl p-6">
        <LoaderCircle size={18} className="animate-spin" />
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-238 mx-auto flex flex-col gap-6">
        {back}
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn&rsquo;t open this.</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!concern) return null;

  const open = isConcernOpen(concern);

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div>
        {back}
        <div className="flex items-center gap-3 flex-wrap mt-4">
          <h1 className="text-3xl font-bold text-slate-900">
            {concernKindLabel(concern.kind)} · {concernCategoryLabel(concern.category)}
          </h1>
          <ConcernStatusChip status={concern.status} />
        </div>
        <p className="text-sm text-slate-500 mt-2">
          Raised {formatTimestamp(concern.createdAt)} · relates to{' '}
          {concernRelatesToLabel(concern.relatesTo).toLowerCase()}
          {concern.acknowledgedAt && ` · acknowledged ${formatTimestamp(concern.acknowledgedAt)}`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="flex flex-col gap-4">
          <section className={CARD}>
            <p className="text-[10px] uppercase tracking-wide text-slate-400">What you raised</p>
            {concern.about && (
              <p className="text-sm text-slate-600 mt-2">
                <span className="font-semibold text-slate-800">About:</span> {concern.about}
              </p>
            )}
            <p className="text-base text-slate-800 leading-relaxed mt-3 whitespace-pre-wrap">
              {concern.description}
            </p>
            {concern.whatWouldHelp && (
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-wide text-slate-400">What would help</p>
                <p className="text-sm text-slate-700 leading-relaxed mt-1 whitespace-pre-wrap">
                  {concern.whatWouldHelp}
                </p>
              </div>
            )}
          </section>

          {concern.referredTo && (
            <section className="bg-indigo-50 rounded-xl p-6">
              <p className="text-[10px] uppercase tracking-wide text-indigo-700 font-semibold">Referred on</p>
              <p className="text-sm text-slate-700 mt-1">
                Referred to <span className="font-semibold">{concern.referredTo}</span>
                {concern.referredAt && ` on ${formatTimestamp(concern.referredAt)}`}.
              </p>
            </section>
          )}

          {concern.responses.map((response) => (
            <section
              key={response.id}
              className={`rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${
                response.authorRole === ROLES.PARTICIPANT ? 'bg-white/80' : 'bg-brand-50'
              }`}
            >
              <p className="text-sm text-slate-800">
                <span className="font-semibold">{authorName(response.authorRole)}</span>
                <span className="text-slate-300 mx-1.5">•</span>
                <span className="text-slate-500">{formatTimestamp(response.createdAt)}</span>
              </p>
              <p className="text-sm text-slate-700 leading-relaxed mt-2 whitespace-pre-wrap">{response.text}</p>
            </section>
          ))}

          {concern.closedAt && (
            <section className="bg-slate-100 rounded-xl p-6">
              <p className="text-sm text-slate-700">
                Closed {formatTimestamp(concern.closedAt)}. If something new has happened, raise it
                as a new concern — this one stays as its record.
              </p>
            </section>
          )}

          {open && <FollowUp concern={concern} />}
        </div>

        <ConcernSafeguards />
      </div>
    </div>
  );
}
