import { Layers } from 'lucide-react';
import { rnRationaleTagLabel } from '@tmg180/shared';

/**
 * "Supports used this month" grouped by NDIS budget bucket — the Goal Link
 * Helper spec's monthly roll-up: per bucket, the top goal links, the
 * functional-barrier phrases of the groupings that were chosen, and the
 * rationale tags selected. Counts come from the month's submitted logs; the
 * phrases are the helper table's own. Nothing here is generated.
 */
export default function SupportsByBucket({ buckets = [], className = '' }) {
  return (
    <section className={`bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${className}`}>
      <div className="flex items-center gap-3">
        <Layers size={19} className="text-[#7800ce]" />
        <h2 className="text-lg font-semibold text-slate-900">Supports used this month</h2>
      </div>
      {buckets.length === 0 ? (
        <p className="text-sm text-slate-500 mt-4">
          No log this month carried an NDIS budget bucket.
        </p>
      ) : (
        <div className="mt-5 flex flex-col gap-5">
          {buckets.map((bucket) => (
            <div key={bucket.key} className="bg-white rounded-2xl px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-900">{bucket.label}</h3>
                <span className="text-sm text-slate-500">
                  {bucket.logsCount} {bucket.logsCount === 1 ? 'log' : 'logs'}
                </span>
              </div>
              {bucket.goals.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Goal links</p>
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {bucket.goals.map((goal) => (
                      <li key={goal.id} className="text-sm text-slate-700">
                        {goal.text}
                        <span className="text-slate-400"> · {goal.logsCount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {bucket.barriers.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Functional barriers</p>
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {bucket.barriers.map((barrier) => (
                      <li key={barrier} className="text-sm text-slate-700">{barrier}</li>
                    ))}
                  </ul>
                </div>
              )}
              {bucket.rationaleTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {bucket.rationaleTags.map((tag) => (
                    <span key={tag.key} className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {rnRationaleTagLabel(tag.key)} · {tag.count}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
