import { RefreshCw, Headset, Info } from 'lucide-react';
import ErrorIllustration from '../../components/ui/ErrorIllustration';
import Button from '../../components/ui/Button';

export default function SomethingWentWrong() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-100 flex items-center justify-center p-6 font-sans text-slate-800">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-10 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md bg-slate-200/50 rounded-3xl shadow-lg p-10 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-0 left-6 right-6 h-1 rounded-full bg-linear-to-r from-brand-600 to-fuchsia-500" />

        <ErrorIllustration />

        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Something went wrong
        </h1>

        <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-sm">
          Please try again. If this keeps happening, our support team is
          ready to help you sort it out.
        </p>

        <div className="flex items-center justify-center gap-3 mb-6">
          <Button variant="muted" icon={RefreshCw} disabled>
            Try again
          </Button>
          <Button variant="contact" icon={Headset}>
            Contact support
          </Button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Info size={13} />
          <span>Error Code: TS-1082</span>
        </div>
      </div>
    </div>
  );
}
