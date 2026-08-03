import { Calendar } from 'lucide-react';

export default function SnapshotIllustration() {
  return (
    <div className="w-32 h-32 rounded-2xl bg-linear-to-br from-slate-400 to-indigo-300 shadow-md flex items-center justify-center mb-6">
      <div className="w-14 h-14 rounded-xl bg-rose-100 flex items-center justify-center shadow-sm">
        <Calendar size={26} className="text-rose-500" />
      </div>
    </div>
  );
}
