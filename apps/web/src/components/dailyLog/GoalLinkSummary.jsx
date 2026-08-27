import { bucketLabel, goalLinkHelperEntry, rnRationaleTagLabel } from '@tmg180/shared';

/**
 * The Goal Link Helper fields as recorded on a submitted log — bucket,
 * functional grouping and rationale tags — for the read-only views.
 */
export default function GoalLinkSummary({ log }) {
  const grouping = goalLinkHelperEntry(log.functionalGrouping);
  const tags = log.rnRationaleTags ?? [];
  if (!log.ndisBucket && !grouping && tags.length === 0) return null;
  return (
    <dl className="flex flex-col gap-2 text-sm">
      {log.ndisBucket && (
        <div className="flex gap-2">
          <dt className="font-semibold text-slate-700 shrink-0">NDIS budget bucket:</dt>
          <dd className="text-slate-600">{bucketLabel(log.ndisBucket)}</dd>
        </div>
      )}
      {grouping && (
        <div className="flex gap-2">
          <dt className="font-semibold text-slate-700 shrink-0">Functional grouping:</dt>
          <dd className="text-slate-600">
            {grouping.grouping} — {grouping.domain}
          </dd>
        </div>
      )}
      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <dt className="font-semibold text-slate-700 shrink-0">Rationale tags:</dt>
          <dd className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {rnRationaleTagLabel(tag)}
              </span>
            ))}
          </dd>
        </div>
      )}
    </dl>
  );
}
