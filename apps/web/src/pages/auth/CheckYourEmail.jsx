import { useState } from 'react';
import { MailCheck, LoaderCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../lib/apiClient';
import { PUBLIC_PATHS } from '../../routes/paths';

export default function CheckYourEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent'
  const [failure, setFailure] = useState(null);

  // Carried from Forgot Password. Someone landing here directly still sees a
  // sensible screen, just without the address.
  const email = location.state?.email ?? null;

  const resend = async () => {
    setStatus('sending');
    setFailure(null);
    try {
      await api.auth.forgotPassword(email);
      setStatus('sent');
    } catch (error) {
      setFailure(error);
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-100 via-indigo-50 to-purple-50 flex flex-col font-sans text-slate-800">
      <div className="p-6">
        <span className="text-xl font-bold text-brand-600">TMG180</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.08)] p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mb-5">
            <MailCheck size={26} className="text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-3">
            Check your email
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            {email ? (
              <>
                If <span className="font-medium text-slate-700">{email}</span> has an account,
                we&apos;ve sent a reset link. Please follow the instructions to continue.
              </>
            ) : (
              <>
                We sent a reset link to your email address. Please follow the instructions to
                continue.
              </>
            )}
          </p>

          <button
            onClick={() => navigate(PUBLIC_PATHS.signIn)}
            className="w-full bg-linear-to-r from-brand-600 to-fuchsia-600 hover:opacity-90 text-white text-sm font-semibold rounded-full py-3.5 transition-opacity"
          >
            Return to Sign In
          </button>

          <div className="w-full border-t border-slate-100 mt-6 pt-5">
            {status === 'sent' ? (
              <p className="text-sm text-emerald-600">Sent. Check your inbox again in a moment.</p>
            ) : (
              <p className="text-sm text-slate-500">
                Didn&apos;t receive the email?{' '}
                <button
                  type="button"
                  disabled={!email || status === 'sending'}
                  onClick={resend}
                  className="font-medium text-brand-600 hover:text-brand-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1"
                >
                  {status === 'sending' && <LoaderCircle size={13} className="animate-spin" />}
                  Click to resend
                </button>
              </p>
            )}
            {failure && (
              <p role="alert" className="text-xs text-rose-600 mt-2">
                {failure.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 py-6">
        <span>© 2024 TMG180. All rights reserved.</span>
        <span className="flex items-center gap-6">
          <button className="hover:text-slate-600 transition-colors">
            Privacy Policy
          </button>
          <button className="hover:text-slate-600 transition-colors">
            Help Center
          </button>
        </span>
      </footer>
    </div>
  );
}
