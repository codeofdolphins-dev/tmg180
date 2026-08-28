import { Outlet } from 'react-router-dom';
import ParticipantSidebar from './ParticipantSidebar';
import ParticipantTopBar from './ParticipantTopBar';

/**
 * Shared chrome for every participant portal screen, extracted from the
 * Participant Dashboard frame (the canonical design). Rendered once as a
 * layout route; pages render inside <Outlet /> and provide content only.
 *
 * Sidebar (w-64) and top bar (h-20) are fixed — only the page content
 * scrolls. main's pt-22 = top bar height + the dashboard's original pt-2.
 */
export default function ParticipantLayout() {
  return (
    <div className="participant-portal min-h-screen bg-white font-sans text-slate-800">
      <div className="pointer-events-none fixed inset-0 overflow-hidden print:hidden">
        <div className="absolute -top-24 -left-32 w-160 h-160 rounded-full bg-[#dcf2e6] blur-3xl opacity-70" />
        <div className="absolute top-142 left-160 w-3xl h-192 rounded-full bg-[#d8e2ff] blur-3xl opacity-70" />
      </div>

      <ParticipantSidebar />
      <ParticipantTopBar />

      <div className="relative pl-64 print:pl-0">
        <main className="px-10 pt-22 pb-16 print:px-0 print:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
