import { Outlet } from 'react-router-dom';
import WorkerSidebar from './WorkerSidebar';
import WorkerTopBar from './WorkerTopBar';

/**
 * Shared chrome for every worker workspace screen — the worker twin of
 * ParticipantLayout, same geometry so the two workspaces feel like one
 * product. Rendered once as a layout route; pages render inside <Outlet />
 * and provide content only.
 *
 * Sidebar (w-64) and top bar (h-14) are fixed — only the page content
 * scrolls. main's pt-22 = top bar height + the dashboard's original pt-2.
 */
export default function WorkerLayout() {
  return (
    <div className="worker-workspace min-h-screen bg-white font-sans text-slate-800">
      <div className="pointer-events-none fixed inset-0 overflow-hidden print:hidden">
        <div className="absolute -top-24 -left-32 w-160 h-160 rounded-full bg-[#f0dbff] blur-3xl opacity-70" />
        <div className="absolute top-142 left-160 w-3xl h-192 rounded-full bg-[#d8e2ff] blur-3xl opacity-70" />
      </div>

      <WorkerSidebar />
      <WorkerTopBar />

      <div className="relative pl-64 print:pl-0">
        <main className="px-10 pt-22 pb-16 print:px-0 print:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
