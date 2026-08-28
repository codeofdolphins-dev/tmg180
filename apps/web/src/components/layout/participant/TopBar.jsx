import { Bell, Settings } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="w-full px-8 py-4 flex items-center justify-between">
      <div className="text-2xl font-black tracking-wider text-brand-700">
        TMG180
      </div>
      <div className="flex items-center space-x-5 text-slate-700">
        <button className="hover:text-brand-700 transition-colors">
          <Bell size={20} />
        </button>
        <button className="hover:text-brand-700 transition-colors">
          <Settings size={20} />
        </button>
        <div className="w-9 h-9 rounded-full overflow-hidden border border-brand-300">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
