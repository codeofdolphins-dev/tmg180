import { BookOpenText, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { participantReadingSection } from '@tmg180/shared';
import { participantLibraryPath } from '../../routes/paths';
import ReadingBlocks from './ReadingBlocks';

const READING_SLUG = 'relational-evidence-notes';

/**
 * The Case Note Introduction at the top of a note screen (Master Document Map
 * #10: "What participants and workers read before completing any note … at
 * the top of every note screen"). Shows the document's "Purpose of These
 * Notes" section verbatim, collapsed by default so the note itself stays the
 * focus, with the way to the full reading in the Library.
 */
export default function NoteIntroduction() {
  const blocks = participantReadingSection(READING_SLUG, 'Purpose of These Notes');
  if (blocks.length === 0) return null;
  return (
    <details className="group bg-white/80 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-4">
        <span className="flex items-center gap-3">
          <BookOpenText size={18} className="text-brand-600 shrink-0" />
          <span className="text-base font-semibold text-slate-900">Before you write: the purpose of these notes</span>
        </span>
        <ChevronDown size={18} className="text-slate-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-6 pb-6 flex flex-col gap-4">
        <ReadingBlocks blocks={blocks} compact />
        <Link
          to={participantLibraryPath.reading(READING_SLUG)}
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Read the full introduction in the Library
        </Link>
      </div>
    </details>
  );
}
