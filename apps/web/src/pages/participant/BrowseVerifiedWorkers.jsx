import { Info, LoaderCircle, MapPin, Search, TriangleAlert, Users, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Select from '../../components/ui/Select';
import { useDirectory } from '../../hooks/participant/directory';
import { participantDirectoryPath } from '../../routes/paths';

/**
 * Browse Directory (Figma v2 3238:388 — "corrected: R-06 no ratings, R-04
 * no availability"), on the participant UI scale.
 *
 * Published worker profiles, alphabetical, filtered by location and support
 * area only. Every card leads with how the person supports (their one-line
 * philosophy, or the start of their introduction) and carries their support
 * areas; there is no rating, no sort, and no availability — that belongs to
 * the profile page. The filter choices come from the server with the
 * results, so the lists offer only values that can return someone.
 *
 * The frame's grey footer line is a designer annotation (it quotes R-06 /
 * R-04), not copy; the non-coordination notice the Override register asks
 * for on the directory (P4-04) stands there instead.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';
const CHIP = 'text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-brand-700';

const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

function WorkerRow({ worker, onOpen }) {
  const meta = ['Relational Worker', worker.location, worker.experienceLabel].filter(Boolean);
  const lead = worker.philosophy ? `“${worker.philosophy}”` : worker.introExcerpt;
  return (
    <article className={`${CARD} flex items-start gap-5`}>
      <div className="w-14 h-14 rounded-full bg-purple-100 text-brand-700 flex items-center justify-center text-lg font-semibold shrink-0">
        {initialsOf(worker.name)}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-semibold text-brand-700 leading-snug">{worker.name}</h2>
        <p className="text-sm text-slate-500 mt-1">{meta.join(' · ')}</p>
        {lead && <p className="text-sm text-slate-600 leading-relaxed mt-2">{lead}</p>}
        {worker.supportAreas.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {worker.supportAreas.map((area) => (
              <span key={area.key} className={CHIP}>
                {area.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={onOpen}
        className="shrink-0 border border-brand-600 text-brand-600 text-sm font-semibold rounded-full px-5 py-2 hover:bg-purple-50 transition-colors"
      >
        View profile
      </button>
    </article>
  );
}

/** A pill select that reads "Location: Richmond, VIC" once something is chosen. */
function FilterSelect({ prefix, placeholder, options, value, onChange, icon: Icon }) {
  const selected = options.find((option) => option.value === value) ?? null;
  return (
    <div className="w-full sm:w-72">
      <Select
        aria-label={prefix}
        options={options}
        value={selected}
        onChange={(option) => onChange(option?.value ?? '')}
        isClearable
        isSearchable={options.length > 8}
        placeholder={
          <span className="flex items-center gap-2">
            <Icon size={15} className="text-slate-400" />
            {placeholder}
          </span>
        }
        formatOptionLabel={(option, { context }) =>
          context === 'value' ? (
            <span className="flex items-center gap-2">
              <Icon size={15} className="text-brand-600" />
              <span className="text-slate-500">{prefix}:</span> {option.label}
            </span>
          ) : (
            option.label
          )
        }
      />
    </div>
  );
}

export default function BrowseVerifiedWorkers() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = searchParams.get('location') ?? '';
  const supportArea = searchParams.get('area') ?? '';
  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };
  const setLocation = (value) => setFilter('location', value);
  const setSupportArea = (value) => setFilter('area', value);
  const { data, isLoading, isFetching, error } = useDirectory({ location, supportArea });

  const workers = data?.workers ?? [];
  const filters = data?.filters;
  const filtered = Boolean(location || supportArea);
  const locationOptions = (filters?.locations ?? []).map((value) => ({ value, label: value }));
  const areaOptions = (filters?.supportAreas ?? []).map((area) => ({ value: area.key, label: area.label }));
  const clearFilters = () => setSearchParams({}, { replace: true });

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Browse Directory</h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl">
          Verified worker profiles, led by how people support — not by scores. Listed
          alphabetically.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <FilterSelect
          prefix="Location"
          placeholder="Location: all"
          icon={MapPin}
          options={locationOptions}
          value={location}
          onChange={setLocation}
        />
        <FilterSelect
          prefix="Support area"
          placeholder="Support area: all"
          icon={Search}
          options={areaOptions}
          value={supportArea}
          onChange={setSupportArea}
        />
        {filtered && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-sm text-brand-700 hover:underline sm:ml-auto"
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 text-slate-500 bg-white/80 rounded-xl p-6">
          <LoaderCircle size={18} className="animate-spin" />
          Loading the directory…
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn&rsquo;t load the directory.</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {data && workers.length > 0 && (
        <>
          <p className="text-sm text-slate-500 -mt-2" aria-live="polite">
            {data.total} {data.total === 1 ? 'profile' : 'profiles'}
            {filtered ? (data.total === 1 ? ' matches these filters' : ' match these filters') : ''}
            {isFetching ? ' · updating…' : ''}
          </p>
          <div className={`flex flex-col gap-4 ${isFetching ? 'opacity-70' : ''}`}>
            {workers.map((worker) => (
              <WorkerRow
                key={worker.workerId}
                worker={worker}
                onOpen={() => navigate(participantDirectoryPath.profile(worker.workerId))}
              />
            ))}
          </div>
        </>
      )}

      {data && workers.length === 0 && (
        <div className="bg-white/80 rounded-xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-brand-600 flex items-center justify-center mx-auto">
            <Users size={26} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mt-6">
            {filtered ? 'No profiles match these filters' : 'No published profiles yet'}
          </h2>
          <p className="text-base text-slate-600 mt-2 max-w-md mx-auto">
            {filtered
              ? 'Try a different location or support area, or clear the filters to see everyone listed.'
              : 'Workers choose whether to publish their profile here. When someone does, they will appear in this list, alphabetically.'}
          </p>
          {filtered && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-6 py-3 mt-6 hover:bg-slate-50 transition-colors"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>
      )}

      {data?.contactNotice && (
        <div className="flex items-start gap-3 bg-purple-50 border border-purple-100 rounded-xl px-5 py-4">
          <Info size={16} className="text-brand-600 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-600 leading-relaxed">{data.contactNotice}</p>
        </div>
      )}
    </div>
  );
}
