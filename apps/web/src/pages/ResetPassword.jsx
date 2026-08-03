import { useState } from 'react';
import { Lock, EyeOff, Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_PATHS } from '../routes/paths';

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-indigo-50 to-sky-100 flex flex-col items-center px-6 py-16 font-sans text-slate-800">
      <h1 className="text-3xl font-bold text-brand-600">TMG180</h1>
      <p className="text-sm text-slate-500 mt-1 mb-8">Participant Portal</p>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.08)] p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          Please create a new secure password for your account.
        </p>

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            New Password
          </label>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-3">
            <Lock size={16} className="text-slate-400 shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              defaultValue="password"
              className="bg-transparent outline-none text-sm text-slate-700 flex-1 min-w-0"
            />
            <button
              onClick={() => setShowPassword((s) => !s)}
              className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">Must be at least 8 characters.</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Confirm Password
          </label>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-3">
            <div className="relative shrink-0">
              <Lock size={16} className="text-slate-400" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
            </div>
            <input
              type="password"
              defaultValue="password"
              className="bg-transparent outline-none text-sm text-slate-700 flex-1 min-w-0"
            />
          </div>
        </div>

        <button
          onClick={() => navigate(PUBLIC_PATHS.passwordUpdated)}
          className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-brand-600 to-fuchsia-600 hover:opacity-90 text-white text-sm font-semibold rounded-full py-3.5 mb-5 transition-opacity"
        >
          Reset Password
          <ArrowRight size={16} />
        </button>

        <button
          onClick={() => navigate(PUBLIC_PATHS.signIn)}
          className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Login
        </button>
      </div>

      <p className="text-xs text-slate-400 mt-8">© 2024 TMG180. All rights reserved.</p>
    </div>
  );
}
