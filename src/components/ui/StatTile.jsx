const ICON_BG = {
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  neutral: 'bg-slate-100 text-slate-500',
  brand: 'bg-purple-50 text-brand-600',
};

export default function StatTile({ icon: Icon, value, label, tone = 'neutral' }) {
  return (
    <div className="flex items-center gap-3 border border-slate-200 rounded-xl p-4 bg-white">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${ICON_BG[tone]}`}
      >
        <Icon size={18} />
      </div>
      <div>
        <p className="text-lg font-bold text-slate-900 leading-none">
          {value}
        </p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
}
