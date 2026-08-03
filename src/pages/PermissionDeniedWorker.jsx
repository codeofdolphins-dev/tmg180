import { Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import IconTile from '../components/ui/IconTile';
import Button from '../components/ui/Button';

export default function PermissionDeniedWorker() {
  const navigate = useNavigate();
  return (
    <DashboardLayout portalLabel="Worker Portal" activeItem="Browse Directory" role="worker">
      <Card className="max-w-sm bg-white/90">
        <IconTile icon={Lock} size="sm" tone="blue" variant="plain" />

        <h1 className="text-lg font-bold text-slate-900 mb-3">
          You don&rsquo;t have access to this information
        </h1>

        <p className="text-slate-500 text-sm mb-1 leading-relaxed">
          This information is participant-owned and can only be viewed with
          the correct permission.
        </p>
        <p className="text-slate-400 text-xs mb-6">
          Access is controlled by participant consent.
        </p>

        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Go back
        </Button>

        <div className="w-full border-t border-slate-200 mt-8 pt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <Lock size={11} />
          <span>TMG180 respects participant control over their information.</span>
        </div>
      </Card>
    </DashboardLayout>
  );
}
