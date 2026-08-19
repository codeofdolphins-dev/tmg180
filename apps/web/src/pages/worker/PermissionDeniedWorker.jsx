import { Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import LockIllustration from '../../components/ui/LockIllustration';
import Button from '../../components/ui/Button';

/**
 * Privacy: Permission Denied (Worker) — Figma 1205:1600. Rendered as a
 * standalone route (no workspace chrome), the same way the participant
 * permission-denied screen is: the frame's own sidebar is participant-shaped
 * and was never the worker nav.
 */
export default function PermissionDeniedWorker() {
  const navigate = useNavigate();
  return (
    <div className="worker-workspace min-h-screen bg-linear-to-br from-brand-100 via-brand-200 to-brand-300 flex flex-col font-sans text-slate-800">
      <header className="w-full px-8 py-4 flex items-center">
        <div className="text-2xl font-black tracking-wider text-brand-700">TMG180</div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-xl">
          <LockIllustration />

          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            You don&rsquo;t have access to this information
          </h1>

          <p className="text-base text-slate-600 max-w-md mb-2 leading-relaxed">
            This information is participant-owned and can only be viewed with
            the correct permission.
          </p>
          <p className="text-sm text-slate-500 mb-8">
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
      </main>
    </div>
  );
}
