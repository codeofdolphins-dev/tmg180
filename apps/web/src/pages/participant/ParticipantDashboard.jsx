import { User, NotebookPen, ArrowRight, TrendingUp, Files } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PARTICIPANT_PATHS } from '../../routes/paths';

const SNAPSHOT_BARS = [29, 43, 58, 48, 72, 82, 67];

export default function ParticipantDashboard() {
  const navigate = useNavigate();
  return (
    <div className="max-w-236 mx-auto flex flex-col gap-16">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, Alex.</h1>
        <p className="text-base text-slate-500 mt-4 max-w-2xl leading-relaxed">
          This is your personal space to record your experiences, reflect on your
          progress, and build evidence over time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative flex flex-col bg-white/70 rounded-[48px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
          <div className="w-12 h-12 rounded-xl bg-[#ece8ff] flex items-center justify-center mb-5">
            <User size={22} className="text-brand-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Personal Profile
          </h2>
          <p className="text-base text-slate-600 mb-4">Continue where you left off.</p>
          <span className="w-fit text-xs font-medium text-slate-600 bg-[#dce9ff] rounded-full px-3 py-1">
            In progress
          </span>
          <div className="mt-auto pt-6">
            <button
              onClick={() => navigate(PARTICIPANT_PATHS.profile)}
              className="w-full border border-[#004ac6] text-[#004ac6] text-base font-medium rounded-xl py-3 hover:bg-blue-50 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden flex flex-col rounded-[48px] p-8 bg-linear-to-br from-purple-100 via-purple-50 to-white shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
          <div className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-[#7800ce] opacity-30 blur-2xl" />
          <div className="relative w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-5">
            <NotebookPen size={22} className="text-brand-600" />
          </div>
          <h2 className="text-xl relative font-semibold text-slate-900 mb-2">
            Today's Daily Log
          </h2>
          <p className="relative text-base text-slate-600 mb-6">
            Record today's support activities and experiences. These entries help build
            your monthly support evidence over time.
          </p>
          <button
            onClick={() => navigate(PARTICIPANT_PATHS.dailyLog)}
            className="relative mt-auto w-fit flex items-center gap-2 bg-brand-600 text-white text-base font-medium rounded-xl px-6 py-3 hover:bg-brand-700 transition-colors"
          >
            Start Check-in
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="relative flex flex-col rounded-[48px] p-8 bg-linear-to-br from-emerald-100 via-emerald-50 to-teal-50 shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
          <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center mb-4">
            <TrendingUp size={18} className="text-emerald-700" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Monthly Snapshot</h2>
          <p className="text-base text-slate-600 mb-6">
            Review your monthly support summary before approving it.
          </p>
          <div className="mt-auto flex items-end gap-2 h-24.25">
            {SNAPSHOT_BARS.map((height, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-full bg-[#4edea3]"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
        </div>

        <div className="relative flex flex-col items-center text-center rounded-[48px] p-8 bg-linear-to-br from-rose-50 via-orange-50 to-purple-50 shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
          <div className="w-16 h-16 rounded-full bg-white/60 shadow-sm flex items-center justify-center mb-5">
            <Files size={26} className="text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">
            Browse verified worker profiles
          </h2>
          <p className="text-base text-slate-600 mb-6 max-w-xs">
            Use filters to find the right fit. You choose who to contact.
          </p>
          <button
            onClick={() => navigate(PARTICIPANT_PATHS.browseWorkers)}
            className="mt-auto w-full border border-[#004ac6] text-[#004ac6] text-base font-medium rounded-xl py-3 hover:bg-blue-50 transition-colors"
          >
            Browse Directory
          </button>
        </div>

        <div className="relative flex flex-col items-start gap-6 rounded-[48px] p-10 bg-linear-to-br from-rose-50 via-purple-50 to-rose-100 shadow-[0_8px_30px_rgb(0,0,0,0.05)] lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
              <NotebookPen size={22} className="text-rose-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Export Snapshot
              </h2>
              <p className="text-base text-slate-600 max-w-md">
                Download or securely share approved monthly snapshots.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(PARTICIPANT_PATHS.snapshotExports)}
            className="w-fit flex items-center gap-2 bg-brand-600 text-white text-base font-medium rounded-xl px-16 py-3 hover:bg-brand-700 transition-colors"
          >
            Export
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
