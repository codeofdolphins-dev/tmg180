const VARIANTS = {
  primary:
    'bg-brand-600 hover:bg-brand-800 text-white shadow-md shadow-brand-900/10',
  secondary: 'bg-slate-200/80 hover:bg-slate-300/80 text-slate-700',
  outline: 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700',
  ghost: 'bg-white border border-slate-200 hover:bg-slate-50 text-brand-600',
  gradient:
    'bg-linear-to-r from-brand-600 to-brand-400 hover:opacity-90 text-white shadow-md shadow-brand-900/10',
  muted: 'bg-transparent text-slate-400 cursor-not-allowed',
  contact: 'bg-slate-200/70 hover:bg-slate-300/70 text-brand-600',
  'tint-purple': 'bg-brand-100/70 hover:bg-brand-200/70 text-brand-700',
  'tint-red': 'bg-rose-100/70 hover:bg-rose-200/70 text-rose-700',
};

export default function Button({
  variant = 'primary',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium px-6 py-3 transition-all ${
        fullWidth ? 'w-full' : 'w-full sm:w-auto'
      } ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={18} />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon size={18} />}
    </button>
  );
}
