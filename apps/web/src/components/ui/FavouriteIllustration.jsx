import { Heart } from 'lucide-react';

export default function FavouriteIllustration() {
  return (
    <div className="relative w-20 h-20 mb-6">
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400" />
      <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full bg-sky-400" />
      <div className="absolute inset-2 rounded-2xl bg-brand-200/40 blur-md" />
      <div className="relative w-full h-full rounded-2xl bg-white shadow-md flex items-center justify-center">
        <Heart size={30} className="text-brand-600" />
      </div>
    </div>
  );
}
