import { Search, Bell, MessageSquare, User } from 'lucide-react';

export default function WorkspaceTopBar({
  searchPlaceholder = 'Search...',
  avatar = 'photo',
  showSearch = true,
}) {
  return (
    <header className="flex items-center gap-4 px-6 py-4">
      {showSearch && (
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 flex-1 max-w-md">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400 flex-1"
          />
        </div>
      )}
      <div className="flex items-center gap-4 ml-auto text-brand-600">
        <button className="hover:text-brand-800 transition-colors">
          <Bell size={20} />
        </button>
        <button className="hover:text-brand-800 transition-colors">
          <MessageSquare size={20} />
        </button>
        {avatar === 'icon' ? (
          <div className="w-9 h-9 rounded-full border-2 border-brand-600 flex items-center justify-center shrink-0">
            <User size={18} className="text-brand-600" />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full overflow-hidden border border-purple-200 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </header>
  );
}
