export default function LinkExpiredIllustration() {
  return (
    <div className="relative w-20 h-20 mb-6">
      <span className="absolute -top-2 -left-3 w-3 h-3 rounded-full bg-rose-200/80 blur-[1px]" />
      <span className="absolute -top-3 right-1 w-2.5 h-2.5 rounded-full bg-orange-200/80 blur-[1px]" />
      <span className="absolute top-1/2 -left-4 w-2 h-2 rounded-full bg-teal-200/80" />
      <span className="absolute -bottom-2 -right-3 w-3 h-3 rounded-full bg-rose-300/70 blur-[1px]" />
      <span className="absolute bottom-1 -left-2 w-2 h-2 rounded-full bg-amber-200/70" />

      <div className="relative w-20 h-20 rounded-2xl bg-linear-to-br from-slate-400 to-slate-600 shadow-lg flex items-center justify-center">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <path
            d="M9 15V11a8 8 0 0 1 16 0v4"
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="6" y="14" width="22" height="16" rx="5" fill="#1e293b" />
          <circle cx="17" cy="20" r="2.2" fill="#94a3b8" />
          <rect x="15.8" y="21.5" width="2.4" height="4" rx="1" fill="#94a3b8" />
        </svg>
      </div>
    </div>
  );
}
