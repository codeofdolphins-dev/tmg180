export default function Timeline({ items }) {
  return (
    <ol className="flex flex-col">
      {items.map((item, idx) => (
        <li key={item.title + idx} className="flex gap-3 pb-5 last:pb-0">
          <div className="flex flex-col items-center">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${item.dotClass || 'bg-brand-600'}`}
            />
            {idx < items.length - 1 && (
              <span className="flex-1 w-px bg-slate-200 mt-1" />
            )}
          </div>
          <div className="pb-1">
            <p className="text-sm text-slate-700 font-medium leading-snug">
              {item.title}
            </p>
            {item.detail && (
              <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">{item.date}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
