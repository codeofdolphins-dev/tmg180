import { MailCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_PATHS } from '../routes/paths';

export default function CheckYourEmail() {
  const navigate = useNavigate();

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
            We sent a reset link to your email address. Please follow the instructions
            to continue.
          </p>

          <button
            onClick={() => navigate(PUBLIC_PATHS.resetPassword)}
            className="w-full bg-linear-to-r from-brand-600 to-fuchsia-600 hover:opacity-90 text-white text-sm font-semibold rounded-full py-3.5 transition-opacity"
          >
            Open Email App
          </button>

          <button
            onClick={() => navigate(PUBLIC_PATHS.signIn)}
            className="text-sm font-medium text-brand-600 hover:text-brand-800 mt-4 transition-colors"
          >
            Skip, I'll confirm later
          </button>

          <div className="w-full border-t border-slate-100 mt-6 pt-5">
            <p className="text-sm text-slate-500">
              Didn't receive the email?{' '}
              <button className="font-medium text-brand-600 hover:text-brand-800 transition-colors">
                Click to resend
              </button>
            </p>
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
