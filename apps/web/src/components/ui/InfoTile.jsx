const TONE_BG = {
  purple: 'bg-brand-100/70',
  blue: 'bg-sky-100/60',
  green: 'bg-emerald-100/70',
  gray: 'bg-slate-200/50',
};

const ICON_COLOR = {
  purple: 'text-brand-600',
  blue: 'text-sky-600',
  green: 'text-emerald-600',
  gray: 'text-slate-500',
};

export default function InfoTile({
  icon: Icon,
  tone = 'gray',
  tag,
  label,
  value,
  valueSuffix,
}) {
  return (
    <div className={`rounded-2xl p-4 ${TONE_BG[tone]}`}>
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center ${ICON_COLOR[tone]}`}
        >
          <Icon size={15} />
        </div>
        {tag && (
          <span className="text-[10px] font-medium text-slate-500 bg-white/70 px-2 py-0.5 rounded-full">
            {tag}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-base font-bold text-slate-900 leading-snug">
        {value}
        {valueSuffix && (
          <span className="text-xs font-normal text-slate-500 ml-1.5">
            {valueSuffix}
          </span>
        )}
      </p>
    </div>
  );
}
