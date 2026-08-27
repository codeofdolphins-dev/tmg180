import { useAuthStore } from '../../../store';

/** "Andrew Joseph" -> "AJ". Falls back to the Figma persona initial. */
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
 * Fixed participant portal top bar (Figma: Participant Dashboard frame).
 * Sits to the right of the fixed sidebar; content scrolls underneath.
 * Search is intentionally not here yet — it will be added portal-wide later.
 */
export default function ParticipantTopBar() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="print:hidden fixed top-0 left-64 right-0 z-10 h-14 flex items-center justify-end gap-3 px-10 bg-white/60 backdrop-blur-md">
      <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-600 to-purple-400 ring-2 ring-white shadow flex items-center justify-center text-white text-sm font-bold">
        {initials(user?.name)}
      </div>
    </header>
  );
}
