import { useState } from 'react';
import { ArrowRight, BookOpen, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  PARTICIPANT_LIBRARIES,
  PARTICIPANT_LIBRARY_TABS,
  PARTICIPANT_READING_STATUS,
  participantReadingsIn,
} from '@tmg180/shared';
import { participantLibraryPath } from '../../routes/paths';

/**
 * Library — Instructions.pdf `library_information_architecture`: two tabs,
 * "Core Library" and "Optional Reading"; the readings themselves are the
 * documents the Master Document Map classes as DISPLAY content for
 * participants (@tmg180/shared participantLibrary). The search filters this
 * page only — there is no search service.
 *
 * A reading whose source is still a governance draft renders as such rather
 * than with text written in its place.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

function ReadingCard({ reading, onOpen }) {
  const awaiting = reading.status === PARTICIPANT_READING_STATUS.AWAITING_CONTENT;
  return (
    <article className={`${CARD} flex flex-col`}>
      <div className="flex items-start justify-between gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-100 text-brand-600 flex items-center justify-center shrink-0">
          <BookOpen size={18} />
        </div>
        {awaiting && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            <Clock size={11} />
            Coming soon
          </span>
        )}
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mt-4">{reading.title}</h2>
      {reading.subtitle && <p className="text-sm text-slate-500 mt-1">{reading.subtitle}</p>}
      <p className="text-sm text-slate-600 leading-relaxed mt-3">{reading.summary}</p>
      <div className="mt-auto pt-5">
        <button
          onClick={onOpen}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          {awaiting ? 'About this reading' : 'Open reading'}
          <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
}

export default function Library() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(PARTICIPANT_LIBRARIES.CORE);
  const [query, setQuery] = useState('');

  const needle = query.trim().toLowerCase();
  const readings = participantReadingsIn(tab).filter(
    (reading) =>
      !needle ||
      [reading.title, reading.subtitle, reading.summary]
        .filter(Boolean)
        .some((text) => text.toLowerCase().includes(needle))
  );

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Library</h1>
      </div>

      <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <Search size={16} className="text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search this library"
          aria-label="Search this library"
          className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1"
        />
      </div>

      <div className="flex items-center gap-6 border-b border-slate-200">
        {PARTICIPANT_LIBRARY_TABS.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`text-sm pb-3 -mb-px border-b-2 transition-colors ${
              tab === item.key
                ? 'text-brand-700 font-medium border-brand-600'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {readings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {readings.map((reading) => (
            <ReadingCard
              key={reading.slug}
              reading={reading}
              onOpen={() => navigate(participantLibraryPath.reading(reading.slug))}
            />
          ))}
        </div>
      ) : (
        <div className={`${CARD} text-center py-12`}>
          <p className="text-base text-slate-600">
            {needle
              ? 'Nothing in this library matches what you typed.'
              : 'There is nothing in this library yet.'}
          </p>
        </div>
      )}
    </div>
  );
}
