export default function ExportIllustration() {
  return (
    <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-slate-300 to-slate-400 shadow-inner flex items-center justify-center mb-6">
      <div className="relative w-14 h-14">
        <span className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-purple-100" />
        <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-100" />
        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-purple-50" />
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded bg-linear-to-br from-sky-300 to-amber-200 rotate-6 shadow-sm" />
      </div>
    </div>
  );
}
