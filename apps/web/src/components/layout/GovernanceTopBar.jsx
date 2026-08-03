import { Bell, HelpCircle, ChevronRight, Search, Grid3x3 } from 'lucide-react';

export default function GovernanceTopBar({
  breadcrumb = [],
  pageTitle,
  searchPlaceholder,
  showHelp = true,
  showSupport = true,
  showGrid = false,
}) {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-100">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {pageTitle && (
          <h2 className="text-lg font-bold text-brand-600 whitespace-nowrap shrink-0">
            {pageTitle}
          </h2>
        )}
        {breadcrumb.length > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            {breadcrumb.map((crumb, idx) => (
              <span key={crumb} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight size={13} />}
                <span className={idx === breadcrumb.length - 1 ? 'text-slate-600' : ''}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        )}
        {searchPlaceholder && (
          <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 flex-1 max-w-xs ml-auto">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400 flex-1"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 text-slate-500 shrink-0">
        <button className="hover:text-slate-700 transition-colors">
          <Bell size={18} />
        </button>
        {showGrid && (
          <button className="hover:text-slate-700 transition-colors">
            <Grid3x3 size={18} />
          </button>
        )}
        {showHelp && (
          <button className="hover:text-slate-700 transition-colors">
            <HelpCircle size={18} />
          </button>
        )}
        {showSupport && (
          <button className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors">
            Support
          </button>
        )}
        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="Admin avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
