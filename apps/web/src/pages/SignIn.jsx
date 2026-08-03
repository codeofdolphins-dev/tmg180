import { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LoaderCircle, TriangleAlert } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { authService, USING_MOCK_AUTH } from '../services/auth';
import { PUBLIC_PATHS, DASHBOARD_BY_ROLE } from '../routes/paths';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useAuthStore((s) => s.signIn);
  const status = useAuthStore((s) => s.status);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const submitting = status === 'submitting';

  // A stale error from a previous visit shouldn't greet the next one.
  useEffect(() => clearError, [clearError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    try {
      const { role } = await signIn(email, password);
      if (!role) {
        // More than one workspace on the account — the person chooses.
        navigate(PUBLIC_PATHS.chooseWorkspace, { replace: true });
        return;
      }
      // Return them to the page the guard bounced them from, if it was theirs.
      const from = location.state?.from?.pathname;
      const target = from?.startsWith(`/${role}/`) ? from : DASHBOARD_BY_ROLE[role];
      navigate(target, { replace: true });
    } catch {
      // The store holds the message; the banner below renders it.
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-100 via-indigo-50 to-purple-50 flex items-center justify-center px-6 font-sans text-slate-800">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.08)] p-8">
        <h1 className="text-2xl font-bold text-brand-600 text-center">TMG180</h1>
        <p className="text-sm text-slate-500 text-center mt-1 mb-7">
          Welcome back to your account.
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-4 py-3 text-sm"
            >
              <TriangleAlert size={16} className="shrink-0 mt-0.5" />
              <span>{error.message}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-3 focus-within:border-brand-600 transition-colors">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => navigate(PUBLIC_PATHS.forgotPassword)}
                className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-3 focus-within:border-brand-600 transition-colors">
              <Lock size={16} className="text-slate-400 shrink-0" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !email || !password}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-brand-600 to-fuchsia-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-full py-3.5 mt-2 transition-opacity"
          >
            {submitting && <LoaderCircle size={16} className="animate-spin" />}
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {USING_MOCK_AUTH && import.meta.env.DEV && (
          <DemoAccounts
            onPick={({ email: demoEmail, password: demoPassword }) => {
              setEmail(demoEmail);
              setPassword(demoPassword);
              clearError();
            }}
          />
        )}
      </div>
    </div>
  );
}

/** Dev-only shortcut into the mock accounts. Never rendered in a build. */
function DemoAccounts({ onPick }) {
  return (
    <div className="mt-7 border-t border-slate-100 pt-4">
      <p className="text-xs font-medium text-slate-400 mb-2">Demo accounts (dev only)</p>
      <div className="flex flex-col gap-1">
        {authService.listDemoAccounts().map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => onPick(account)}
            className="flex items-center justify-between gap-3 text-xs text-slate-500 hover:text-brand-600 transition-colors"
          >
            <span className="truncate">{account.email}</span>
            <span className="shrink-0 text-slate-400">{account.roles.join(' + ')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
