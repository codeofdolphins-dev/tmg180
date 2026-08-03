import { useState } from 'react';
import { Lock, EyeOff, Eye, ArrowRight, ArrowLeft, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_PATHS } from '../routes/paths';

const REQUIREMENTS = ['At least 8 characters', 'Contains a number or symbol'];

export default function CreateNewPassword() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-fuchsia-100 flex flex-col font-sans text-slate-800">
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.08)] p-10 text-center">
          <h1 className="text-3xl font-bold text-brand-600 mb-2">TMG180</h1>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Password</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-7">
            Your new password must be different from previously used passwords to keep
            your account secure.
          </p>

          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5">
              <Lock size={16} className="text-slate-400 shrink-0" />
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="New Password"
                className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
              />
              <button
                onClick={() => setShowNew((s) => !s)}
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              >
                {showNew ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5">
              <Lock size={16} className="text-slate-400 shrink-0" />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm Password"
                className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
              />
              <button
                onClick={() => setShowConfirm((s) => !s)}
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              >
                {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            <div className="bg-slate-50 rounded-lg px-4 py-3.5">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Password requirements:
              </p>
              <div className="flex flex-col gap-1.5">
                {REQUIREMENTS.map((r) => (
                  <div key={r} className="flex items-center gap-2 text-sm text-slate-500">
                    <Circle size={12} className="text-slate-300 shrink-0" />
                    {r}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(PUBLIC_PATHS.passwordUpdated)}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-brand-600 to-fuchsia-600 hover:opacity-90 text-white text-sm font-semibold rounded-full py-3.5 mt-6 mb-5 transition-opacity"
          >
            Update Password
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate(PUBLIC_PATHS.signIn)}
            className="w-full flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Login
          </button>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-4 px-8 py-6 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-brand-600">TMG180</span>
          <span>© 2024 TMG180. All rights reserved.</span>
        </div>
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
      </footer>
    </div>
  );
}
