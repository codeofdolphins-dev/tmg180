import { ExternalLink } from 'lucide-react';

export default function VersionTimeline({ items }) {
  return (
    <ol className="flex flex-col">
      {items.map((item, idx) => (
        <li key={item.version} className="flex gap-3 pb-5 last:pb-0">
          <div className="flex flex-col items-center">
            <span
              className={`w-3 h-3 rounded-full shrink-0 mt-1 ${
                item.current ? 'bg-brand-600 ring-4 ring-brand-100' : 'bg-slate-300'
              }`}
            />
            {idx < items.length - 1 && (
              <span className="flex-1 w-px bg-slate-200 mt-1" />
            )}
          </div>
          <div className="pb-1 flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p
                className={`text-sm font-medium leading-snug ${
                  item.current ? 'text-brand-700' : 'text-slate-700'
                }`}
              >
                {item.version}
              </p>
              <span className="text-[11px] text-slate-400 shrink-0 whitespace-nowrap">
                {item.date}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {item.detail}
            </p>
            {item.link && (
              <button className="text-xs text-brand-600 font-medium mt-1.5 inline-flex items-center gap-1 hover:underline">
                {item.link}
                <ExternalLink size={11} />
              </button>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
