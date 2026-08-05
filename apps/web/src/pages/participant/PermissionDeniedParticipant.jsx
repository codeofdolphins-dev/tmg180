import { Settings, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/layout/participant/TopBar';
import Card from '../../components/ui/Card';
import LockIllustration from '../../components/ui/LockIllustration';
import Button from '../../components/ui/Button';
import { PARTICIPANT_PATHS } from '../../routes/paths';

export default function PermissionDeniedParticipant() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-linear-to-br from-brand-100 via-brand-200 to-brand-300 flex flex-col font-sans text-slate-800">
      <TopBar />

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-xl">
          <LockIllustration />

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            You don&rsquo;t have access to this information
          </h1>

          <p className="text-slate-600 text-sm md:text-base max-w-md mb-8 leading-relaxed">
            This information is participant-owned and can only be viewed with
            the correct permission.
          </p>

          <div className="inline-flex items-center gap-2 bg-purple-50/80 border border-purple-100 text-brand-600 pl-1.5 pr-4 py-1.5 rounded-full text-xs font-medium mb-8">
            <span className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={12} className="text-white" />
            </span>
            <span>You own this information. You decide who sees it.</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Button
              variant="primary"
              icon={Settings}
              onClick={() => navigate(PARTICIPANT_PATHS.privacySharing)}
            >
              Open Privacy &amp; Sharing
            </Button>
            <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>
              Go back
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
