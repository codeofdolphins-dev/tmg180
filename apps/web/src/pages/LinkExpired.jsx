import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import LinkExpiredIllustration from '../components/ui/LinkExpiredIllustration';
import { PUBLIC_PATHS } from '../routes/paths';

export default function LinkExpired() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-100 flex flex-col items-center justify-center p-6 font-sans text-slate-800">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-10 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-rose-200/30 rounded-full blur-3xl" />

      <div className="relative w-full max-w-sm bg-white/70 backdrop-blur-md rounded-3xl border border-white/60 shadow-xl p-10 flex flex-col items-center text-center">
        <div className="text-lg font-black tracking-wider text-brand-600 mb-6">
          TMG180
        </div>

        <LinkExpiredIllustration />

        <h1 className="text-xl font-bold text-brand-600 mb-3 leading-snug">
          This share link is no longer available
        </h1>

        <p className="text-slate-600 text-sm mb-1 leading-relaxed">
          The link may have expired or been revoked by the participant.
        </p>
        <p className="text-slate-400 text-xs mb-6 leading-relaxed">
          Snapshot information is private and controlled by the participant.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <Button
            variant="gradient"
            icon={Home}
            fullWidth
            onClick={() => navigate(PUBLIC_PATHS.signIn)}
          >
            Return to TMG180
          </Button>
          <Button variant="secondary" fullWidth>
            Contact the participant directly
          </Button>
        </div>
      </div>

      <div className="relative mt-6 text-center">
        <div className="text-xs text-slate-500 space-x-3">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Help Center</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          © 2026 TMG180. Supportive, simple, and participant-first.
        </div>
      </div>
    </div>
  );
}
