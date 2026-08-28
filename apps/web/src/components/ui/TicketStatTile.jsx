const TONE_BG = {
  blue: 'bg-sky-50 text-sky-600',
  purple: 'bg-brand-50 text-brand-600',
  neutral: 'bg-slate-100 text-slate-500',
};

export default function TicketStatTile({
  icon: Icon,
  avatarSrc,
  tone = 'blue',
  label,
  value,
  subLabel,
}) {
  return (
    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4">
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt=""
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
      ) : (
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${TONE_BG[tone]}`}
        >
          <Icon size={18} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
        {subLabel && (
          <p className="text-[11px] text-slate-400 mt-0.5">{subLabel}</p>
        )}
      </div>
    </div>
  );
}
