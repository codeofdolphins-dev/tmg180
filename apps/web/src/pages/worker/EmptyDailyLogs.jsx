import { Search, CirclePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WorkspaceLayout from '../../components/layout/worker/WorkspaceLayout';
import Button from '../../components/ui/Button';
import { WORKER_PATHS } from '../../routes/paths';

export default function EmptyDailyLogs() {
  const navigate = useNavigate();
  return (
    <WorkspaceLayout portalLabel="Worker Workspace" activeItem="Daily Logs">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center h-full">
        <div className="relative mb-2">
          <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-purple-200/60 blur-sm" />
          <div className="w-56 h-56 rounded-full border-[6px] border-slate-200 overflow-hidden shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=70"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/70 rounded-full px-5 py-2.5 w-80 -mt-6 mb-8 shadow-sm">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search logs..."
            className="bg-transparent outline-none text-sm text-slate-500 placeholder:text-slate-400 flex-1"
          />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          No daily logs yet
        </h1>

        <p className="text-slate-600 text-base max-w-lg mb-8 leading-relaxed">
          When you&rsquo;re ready, you can create a Daily Support Evidence Log
          after support. Take your time, there is no rush.
        </p>

        <Button
          variant="primary"
          icon={CirclePlus}
          className="w-auto! px-6! py-3!"
          onClick={() => navigate(WORKER_PATHS.dailyLogNew)}
        >
          Start Check-in
        </Button>
      </div>
    </WorkspaceLayout>
  );
}
