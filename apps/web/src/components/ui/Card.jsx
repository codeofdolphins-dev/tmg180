export default function Card({ className = '', children }) {
  return (
    <div
      className={`relative w-full bg-white/60 backdrop-blur-md rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/50 flex flex-col items-center text-center ${className}`}
    >
      {children}
    </div>
  );
}
