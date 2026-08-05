import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LoaderCircle, TriangleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { isValidEmail } from '@tmg180/shared';
import { useAuthStore } from '../../store';
import { PUBLIC_PATHS, DASHBOARD_BY_ROLE } from '../../routes/paths';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useAuthStore((s) => s.signIn);
  const [showPassword, setShowPassword] = useState(false);
  const [failure, setFailure] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onSubmit = async ({ email, password }) => {
    setFailure(null);
    try {
      const role = await signIn(email, password);

      // Roles are server-issued, so there is always one to land on directly.
      // Return them to the page the guard bounced them from, if it was theirs.
      const from = location.state?.from?.pathname;
      const target = from?.startsWith(`/${role}/`) ? from : DASHBOARD_BY_ROLE[role];
      navigate(target, { replace: true });
    } catch (error) {
      setFailure(error);
    }
  };

  const busy = isSubmitting;

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-100 via-indigo-50 to-purple-50 flex items-center justify-center px-6 font-sans text-slate-800">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.08)] p-8">
        <h1 className="text-2xl font-bold text-brand-600 text-center">TMG180</h1>
        <p className="text-sm text-slate-500 text-center mt-1 mb-7">
          Welcome back to your account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          {failure && (
            <div
              role="alert"
              className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-4 py-3 text-sm"
            >
              <TriangleAlert size={16} className="shrink-0 mt-0.5" />
              <span>{failure.message}</span>
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
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
                {...register('email', {
                  required: 'Enter your email address.',
                  validate: (value) => isValidEmail(value) || 'Enter a valid email address.',
                })}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-600 mt-1.5 px-1">{errors.email.message}</p>
            )}
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
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
                {...register('password', { required: 'Enter your password.' })}
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
            {errors.password && (
              <p className="text-xs text-rose-600 mt-1.5 px-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-brand-600 to-fuchsia-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-full py-3.5 mt-2 transition-opacity"
          >
            {busy && <LoaderCircle size={16} className="animate-spin" />}
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={() => navigate(PUBLIC_PATHS.signUp)}
          className="w-full text-center text-sm text-slate-500 hover:text-slate-700 transition-colors mt-5"
        >
          New to TMG180? <span className="font-medium text-brand-600">Create an account</span>
        </button>
      </div>
    </div>
  );
}
