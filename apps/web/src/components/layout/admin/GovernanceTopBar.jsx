import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store';
import { ADMIN_PATHS } from '../../../routes/paths';

/** "Alex Rivera" -> "AR". Falls back to the Figma persona initial. */
function initials(name) {
  if (!name) return 'A';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

/**
 * Fixed governance portal top bar — same shape as the participant and worker
 * ones. Sits to the right of the fixed sidebar; content scrolls underneath.
 * The frames' bell / search / support controls are not here: none has
 * anything behind it yet, and a live-looking control that does nothing is
 * worse than none.
 */
export default function GovernanceTopBar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <header className="print:hidden fixed top-0 left-64 right-0 z-10 h-14 flex items-center justify-end gap-3 px-10 bg-white/60 backdrop-blur-md">
      <button
        onClick={() => navigate(ADMIN_PATHS.settings)}
        aria-label="Settings"
        className="w-9 h-9 rounded-full flex items-center justify-center text-indigo-600 hover:bg-white/70 transition-colors"
      >
        <Settings size={20} />
      </button>
      <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-600 to-brand-400 ring-2 ring-white shadow flex items-center justify-center text-white text-sm font-bold">
        {initials(user?.name)}
      </div>
    </header>
  );
}
