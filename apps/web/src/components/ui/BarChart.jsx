export default function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-2 h-32 border-b border-slate-200 px-1">
      {data.map((d) => (
        <div
          key={d.label}
          className="group relative flex-1 flex flex-col items-center justify-end h-full"
        >
          <div className="pointer-events-none absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap">
            {d.value}
          </div>
          <div
            className="w-full max-w-[18px] rounded-t bg-brand-600 group-hover:bg-brand-800 transition-colors"
            style={{ height: `${(d.value / max) * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
}
