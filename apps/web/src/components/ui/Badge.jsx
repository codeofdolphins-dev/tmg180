const VARIANTS = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  danger: 'bg-rose-50 text-rose-700 border-rose-100',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  brand: 'bg-purple-50 text-brand-600 border-purple-100',
  info: 'bg-sky-50 text-sky-700 border-sky-100',
};

export default function Badge({ variant = 'neutral', icon: Icon, children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${VARIANTS[variant]}`}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}
