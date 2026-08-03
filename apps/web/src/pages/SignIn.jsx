import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { PUBLIC_PATHS } from '../routes/paths';

export default function SignIn() {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);

  const handleSignIn = () => {
    signIn();
    navigate(PUBLIC_PATHS.roleSelection);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-100 via-indigo-50 to-purple-50 flex items-center justify-center px-6 font-sans text-slate-800">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.08)] p-8">
        <h1 className="text-2xl font-bold text-brand-600 text-center">TMG180</h1>
        <p className="text-sm text-slate-500 text-center mt-1 mb-7">
          Welcome back to your account.
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-3">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <button
                onClick={() => navigate(PUBLIC_PATHS.forgotPassword)}
                className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-3">
              <Lock size={16} className="text-slate-400 shrink-0" />
              <input
                type="password"
                placeholder="Enter your password"
                className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
              />
            </div>
          </div>

          <button
            onClick={handleSignIn}
            className="w-full bg-linear-to-r from-brand-600 to-fuchsia-600 hover:opacity-90 text-white text-sm font-semibold rounded-full py-3.5 mt-2 transition-opacity"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
