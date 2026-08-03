import { Key, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_PATHS } from '../routes/paths';

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-indigo-50 to-sky-100 flex flex-col items-center px-6 py-16 font-sans text-slate-800">
      <h1 className="text-3xl font-bold text-brand-600">TMG180</h1>
      <p className="text-sm text-slate-500 mt-1 mb-8">Participant Portal</p>

      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.08)] p-8 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-brand-600 to-sky-500" />

        <div className="flex flex-col items-center text-center">
          <Key size={26} className="text-brand-600 -rotate-45 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Forgot Password</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Enter your email to receive a secure link to reset your account access.
          </p>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3.5 py-3">
            <Mail size={16} className="text-slate-400 shrink-0" />
            <input
              type="email"
              placeholder="hello@tmg180.com"
              className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
            />
          </div>
        </div>

        <button
          onClick={() => navigate(PUBLIC_PATHS.checkEmail)}
          className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-brand-600 to-fuchsia-600 hover:opacity-90 text-white text-sm font-semibold rounded-lg py-3.5 mb-5 transition-opacity"
        >
          Send reset link
          <ArrowRight size={16} />
        </button>

        <button
          onClick={() => navigate(PUBLIC_PATHS.signIn)}
          className="w-full flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={14} />
          Return to Sign In
        </button>
      </div>

      <footer className="flex flex-col items-center gap-2 mt-10 text-xs text-slate-400">
        <div className="flex items-center gap-6">
          <button className="hover:text-slate-600 transition-colors">
            Privacy Policy
          </button>
          <button className="hover:text-slate-600 transition-colors">
            Terms of Service
          </button>
          <button className="hover:text-slate-600 transition-colors">
            Help Center
          </button>
        </div>
        <p>© 2024 TMG180. All rights reserved.</p>
      </footer>
    </div>
  );
}
