import { NotebookPen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WorkspaceLayout from '../components/layout/WorkspaceLayout';
import SnapshotIllustration from '../components/ui/SnapshotIllustration';
import Button from '../components/ui/Button';
import { WORKER_PATHS } from '../routes/paths';

export default function EmptyMonthlySnapshot() {
  const navigate = useNavigate();
  return (
    <WorkspaceLayout
      portalLabel="Worker Workspace"
      activeItem="Monthly Snapshots"
      topBar
      showSearch={false}
    >
      <div className="h-full flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-slate-200/40 rounded-3xl p-10 flex flex-col items-center text-center">
          <SnapshotIllustration />

          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            No snapshot yet
          </h1>

          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Your Monthly Snapshot Summary will appear after daily logs or
            check-ins are available. We&rsquo;ll cultivate your insights here
            soon.
          </p>

          <Button
            variant="primary"
            icon={NotebookPen}
            className="w-auto! px-6! py-3!"
            onClick={() => navigate(WORKER_PATHS.dailyLogs)}
          >
            View Daily Log
          </Button>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
