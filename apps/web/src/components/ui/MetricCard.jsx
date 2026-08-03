const TONE_BG = {
  purple: 'bg-brand-600',
  green: 'bg-emerald-500',
  red: 'bg-rose-500',
  blue: 'bg-sky-500',
};

export default function MetricCard({ icon: Icon, tone = 'purple', label, value }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${TONE_BG[tone]}`}
      >
        <Icon size={15} className="text-white" />
      </div>
      <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
