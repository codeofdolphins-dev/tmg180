import { ArrowLeft, Clock, FileClock } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  PARTICIPANT_READING_AWAITING_NOTE,
  PARTICIPANT_READING_DRAFT_NOTE,
  PARTICIPANT_READING_STATUS,
  participantReading,
} from '@tmg180/shared';
import ReadingBlocks from '../../components/participant/ReadingBlocks';
import { PARTICIPANT_PATHS } from '../../routes/paths';

/**
 * One Library reading, rendered verbatim from @tmg180/shared. A reading that
 * is still awaiting its participant-facing edition says so instead of showing
 * anything written in its place.
 */
const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

export default function LibraryReading() {
  const { slug } = useParams();
  const reading = participantReading(slug);
  if (!reading) return <Navigate to={PARTICIPANT_PATHS.library} replace />;

  const awaiting = reading.status === PARTICIPANT_READING_STATUS.AWAITING_CONTENT;

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <Link
        to={PARTICIPANT_PATHS.library}
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 w-fit"
      >
        <ArrowLeft size={15} />
        Back to Library
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">{reading.title}</h1>
        {reading.subtitle && <p className="text-base text-slate-600 mt-2">{reading.subtitle}</p>}
      </div>

      {awaiting ? (
        <section className={`${CARD} flex items-start gap-4`}>
          <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Clock size={18} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Coming soon</h2>
            <p className="text-sm text-slate-600 leading-relaxed mt-2">{PARTICIPANT_READING_AWAITING_NOTE}</p>
            <p className="text-xs text-slate-500 mt-3">Source: {reading.source}</p>
          </div>
        </section>
      ) : (
        <section className={CARD}>
          {reading.draft && (
            <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
              <FileClock size={16} className="text-slate-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 leading-relaxed">{PARTICIPANT_READING_DRAFT_NOTE}</p>
            </div>
          )}
          <ReadingBlocks blocks={reading.body} />
          <p className="text-xs text-slate-500 mt-8">Source: {reading.source}</p>
        </section>
      )}
    </div>
  );
}
