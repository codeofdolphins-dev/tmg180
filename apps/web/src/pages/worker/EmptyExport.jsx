import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExportIllustration from '../../components/ui/ExportIllustration';
import Button from '../../components/ui/Button';
import { WORKER_PATHS } from '../../routes/paths';

export default function EmptyExport() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-[60vh] overflow-hidden rounded-3xl">
      <div className="absolute top-10 right-10 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-1/4 w-56 h-56 bg-teal-200/30 rounded-full blur-3xl" />

      <div className="relative h-full flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-200/40 rounded-3xl p-10 flex flex-col items-center text-center">
          <ExportIllustration />

          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            No export available yet
          </h1>

          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Approved and locked snapshots will appear here.
          </p>

          <Button
            variant="primary"
            icon={Eye}
            className="w-auto! px-6! py-3!"
            onClick={() => navigate(WORKER_PATHS.snapshots)}
          >
            View Monthly Snapshot
          </Button>
        </div>
      </div>
    </div>
  );
}
