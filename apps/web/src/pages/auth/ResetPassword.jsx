import { useState } from 'react';
import {
  Lock,
  EyeOff,
  Eye,
  ArrowRight,
  ArrowLeft,
  LoaderCircle,
  TriangleAlert,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { checkPassword } from '@tmg180/shared';
import { useResetFlow } from '../../hooks/auth/useResetFlow';
import { PUBLIC_PATHS } from '../../routes/paths';

/**
 * The compact variant of the reset screen (a separate Figma frame from Create
 * New Password). Same flow, same hook — only the markup differs, so the two
 * can't drift apart in behaviour.
 */
export default function ResetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { isChecking, submit, error, isSaving } = useResetFlow();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { password: '', confirm: '' } });

  const onSubmit = async ({ password }) => {
    try {
      await submit(password);
    } catch {
      // `error` from the flow renders in the banner below.
    }
  };

  const busy = isSubmitting || isSaving;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-indigo-50 to-sky-100 flex flex-col items-center px-6 py-16 font-sans text-slate-800">
      <h1 className="text-3xl font-bold text-brand-600">TMG180</h1>
      <p className="text-sm text-slate-500 mt-1 mb-8">Participant Portal</p>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.08)] p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          Please create a new secure password for your account.
        </p>

        {isChecking ? (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 py-10">
            <LoaderCircle size={16} className="animate-spin" />
            Checking your link…
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-4 py-3 text-sm mb-5"
              >
                <TriangleAlert size={16} className="shrink-0 mt-0.5" />
                <span>{error.message}</span>
              </div>
            )}

            <div className="mb-5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                New Password
              </label>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-3 focus-within:border-brand-600 transition-colors">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="bg-transparent outline-none text-sm text-slate-700 flex-1 min-w-0"
                  {...register('password', {
                    required: 'Choose a new password.',
                    validate: (value) =>
                      checkPassword(value).isValid || 'Password does not meet the requirements.',
                  })}
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
              {errors.password ? (
                <p className="text-xs text-rose-600 mt-1.5">{errors.password.message}</p>
              ) : (
                <p className="text-xs text-slate-400 mt-1.5">
                  Must be at least 8 characters and contain a number or symbol.
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="confirm" className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-3 focus-within:border-brand-600 transition-colors">
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  className="bg-transparent outline-none text-sm text-slate-700 flex-1 min-w-0"
                  {...register('confirm', {
                    required: 'Re-enter your new password.',
                    validate: (value) =>
                      value === watch('password') || 'Both passwords must match.',
                  })}
                />
              </div>
              {errors.confirm && (
                <p className="text-xs text-rose-600 mt-1.5">{errors.confirm.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-brand-600 to-fuchsia-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-full py-3.5 mb-5 transition-opacity"
            >
              {busy && <LoaderCircle size={16} className="animate-spin" />}
              {busy ? 'Resetting…' : 'Reset Password'}
              {!busy && <ArrowRight size={16} />}
            </button>
          </form>
        )}

        <button
          onClick={() => navigate(PUBLIC_PATHS.signIn)}
          className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </button>
      </div>

      <p className="text-xs text-slate-400 mt-8">© 2024 TMG180. All rights reserved.</p>
    </div>
  );
}
