import { Lock, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import IconTile from '../components/ui/IconTile';
import Button from '../components/ui/Button';

export default function PermissionDeniedAdmin() {
  const navigate = useNavigate();
  return (
    <DashboardLayout portalLabel="Admin Console" activeItem="Browse Directory" role="admin">
      <Card className="max-w-sm bg-white/90">
        <IconTile icon={Lock} size="sm" tone="neutral" variant="circle" />

        <h1 className="text-lg font-bold text-slate-900 mb-3">
          You don&rsquo;t have access to this information
        </h1>

        <p className="text-slate-500 text-sm mb-5 leading-relaxed">
          This information is participant-owned and can only be viewed with
          the correct permission.
        </p>

        <div className="w-full flex items-center gap-2.5 bg-blue-50/70 border border-blue-100 rounded-xl px-4 py-3 mb-6">
          <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <Info size={12} className="text-white" />
          </span>
          <p className="text-xs text-slate-600 text-left leading-relaxed">
            Admin views metadata only. Record content is not shown.
          </p>
        </div>

        <Button variant="ghost" onClick={() => navigate(-1)}>Go back</Button>
      </Card>
    </DashboardLayout>
  );
}
