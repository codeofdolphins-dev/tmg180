import { Lock } from 'lucide-react';

const SIZES = {
  lg: { outer: 'w-24 h-24', inner: 'w-16 h-16 rounded-xl', icon: 32 },
  sm: { outer: 'w-16 h-16', inner: 'w-11 h-11 rounded-lg', icon: 22 },
};

const TONES = {
  brand: 'text-brand-600',
  blue: 'text-blue-600',
  neutral: 'text-slate-500',
};

export default function IconTile({
  icon: Icon = Lock,
  size = 'lg',
  tone = 'brand',
  variant = 'halo',
}) {
  const s = SIZES[size];

  if (variant === 'plain') {
    return (
      <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6">
        <Icon className={TONES[tone]} size={s.icon} />
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div className="w-16 h-16 rounded-full bg-brand-100/70 flex items-center justify-center mb-6">
        <Icon className={TONES[tone]} size={s.icon} />
      </div>
    );
  }

  return (
    <div
      className={`${s.outer} rounded-full bg-brand-100/70 flex items-center justify-center mb-6 shadow-inner`}
    >
      <div
        className={`${s.inner} bg-[#d5e9dd] flex items-center justify-center shadow-sm`}
      >
        <Icon className={TONES[tone]} size={s.icon} />
      </div>
    </div>
  );
}
