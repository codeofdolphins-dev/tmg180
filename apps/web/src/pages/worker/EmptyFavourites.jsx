import { Search } from 'lucide-react';
import FavouriteIllustration from '../../components/ui/FavouriteIllustration';
import Button from '../../components/ui/Button';

export default function EmptyFavourites() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-slate-200/40 rounded-3xl p-10 flex flex-col items-center text-center">
        <FavouriteIllustration />

        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          No favourites yet
        </h1>

        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          When you bookmark a worker profile, it will appear here.
        </p>

        <Button variant="primary" icon={Search} className="w-auto! px-6! py-3!">
          Browse all workers
        </Button>
      </div>
    </div>
  );
}
