export default function LockIllustration() {
  return (
    <div className="relative w-24 h-24 mb-6">
      <span className="absolute top-2 left-1 w-1.5 h-1.5 rounded-full bg-white/80" />
      <span className="absolute top-6 -left-1 w-1 h-1 rounded-full bg-white/70" />
      <span className="absolute bottom-5 right-0 w-1.5 h-1.5 rounded-full bg-amber-100/80" />
      <span className="absolute bottom-2 right-6 w-1 h-1 rounded-full bg-white/70" />

      <div className="w-24 h-24 rounded-full bg-brand-100/70 flex items-center justify-center shadow-inner">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          className="drop-shadow-md"
        >
          <defs>
            <linearGradient id="lockBg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#f9b8d4" />
              <stop offset="1" stopColor="#a3d3ba" />
            </linearGradient>
            <linearGradient id="lockShackle" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#99f6e4" />
              <stop offset="1" stopColor="#14b8a6" />
            </linearGradient>
            <linearGradient id="lockBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#b3ddc8" />
              <stop offset="1" stopColor="#0a7a52" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#lockBg)" />
          <path
            d="M22 30V24a10 10 0 0 1 20 0v6"
            stroke="url(#lockShackle)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="17" y="29" width="30" height="23" rx="7" fill="url(#lockBody)" />
          <circle cx="32" cy="38" r="3.2" fill="#04301f" />
          <rect x="30.2" y="40" width="3.6" height="6" rx="1.5" fill="#04301f" />
        </svg>
      </div>
    </div>
  );
}
