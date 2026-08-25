import { Lock, Info, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import IconTile from '../../components/ui/IconTile';
import Button from '../../components/ui/Button';

/**
 * Privacy: Permission Denied (Admin) — rendered as a standalone route (no
 * portal chrome), the same way the participant and worker permission-denied
 * screens are.
 */
export default function PermissionDeniedAdmin() {
  const navigate = useNavigate();
  return (
    <div className="governance-portal min-h-screen bg-linear-to-br from-brand-100 via-brand-200 to-brand-300 flex flex-col font-sans text-slate-800">
      <header className="w-full px-8 py-4 flex items-center">
        <div className="text-2xl font-black tracking-wider text-brand-700">TMG180</div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-xl">
          <IconTile icon={Lock} size="sm" tone="neutral" variant="circle" />

          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            You don&rsquo;t have access to this information
          </h1>

          <p className="text-base text-slate-600 max-w-md mb-5 leading-relaxed">
            This information is participant-owned and can only be viewed with
            the correct permission.
          </p>

          <div className="w-full flex items-center gap-2.5 bg-blue-50/70 border border-blue-100 rounded-xl px-4 py-3 mb-6">
            <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <Info size={12} className="text-white" />
            </span>
            <p className="text-sm text-slate-600 text-left leading-relaxed">
              Admin views metadata only. Record content is not shown.
            </p>
          </div>

          <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>
            Go back
          </Button>

          <div className="w-full border-t border-slate-200 mt-8 pt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <Lock size={11} />
            <span>TMG180 respects participant control over their information.</span>
          </div>
        </Card>
      </main>
    </div>
  );
}
