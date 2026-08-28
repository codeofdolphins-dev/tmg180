export default function ErrorIllustration() {
  return (
    <div className="w-40 h-40 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 overflow-hidden">
      <div className="relative w-28 h-20">
        <div className="absolute left-0 bottom-0 w-16 h-12 rounded-full bg-brand-300 rotate-12" />
        <div className="absolute right-0 bottom-1 w-14 h-10 rounded-full bg-teal-200" />
        <div className="absolute left-6 top-0 w-16 h-8 rounded-full bg-brand-200 -rotate-6" />
        <div className="absolute right-2 top-2 w-10 h-8 rounded-full bg-teal-300" />
      </div>
    </div>
  );
}
