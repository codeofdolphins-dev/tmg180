import { useState } from 'react';
import {
  Lock,
  EyeOff,
  Eye,
  ArrowRight,
  ArrowLeft,
  Circle,
  Check,
  LoaderCircle,
  TriangleAlert,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { checkPassword } from '@tmg180/shared';
import { useResetFlow } from '../../hooks/auth/useResetFlow';
import { PUBLIC_PATHS } from '../../routes/paths';

/** Target of the emailed reset link: /create-new-password?token=… */
export default function CreateNewPassword() {
  const navigate = useNavigate();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { isChecking, submit, error, isSaving } = useResetFlow();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { password: '', confirm: '' } });

  const password = watch('password') ?? '';
  const { rules } = checkPassword(password);

  const onSubmit = async ({ password: value }) => {
    try {
      await submit(value);
    } catch {
      // `error` from the flow renders in the banner below.
    }
  };

  const busy = isSubmitting || isSaving;

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
                  className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-4 py-3 text-sm text-left mb-5"
                >
                  <TriangleAlert size={16} className="shrink-0 mt-0.5" />
                  <span>{error.message}</span>
                </div>
              )}

              <div className="flex flex-col gap-4 text-left">
                <div>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5 focus-within:border-brand-600 transition-colors">
                    <Lock size={16} className="text-slate-400 shrink-0" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="New Password"
                      className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
                      {...register('password', {
                        required: 'Choose a new password.',
                        validate: (value) =>
                          checkPassword(value).isValid ||
                          'Password does not meet the requirements.',
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((s) => !s)}
                      aria-label={showNew ? 'Hide password' : 'Show password'}
                      className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                    >
                      {showNew ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-rose-600 mt-1.5 px-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5 focus-within:border-brand-600 transition-colors">
                    <Lock size={16} className="text-slate-400 shrink-0" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Confirm Password"
                      className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
                      {...register('confirm', {
                        required: 'Re-enter your new password.',
                        validate: (value) =>
                          value === watch('password') || 'Both passwords must match.',
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                    >
                      {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  {errors.confirm && (
                    <p className="text-xs text-rose-600 mt-1.5 px-1">{errors.confirm.message}</p>
                  )}
                </div>

                <div className="bg-slate-50 rounded-lg px-4 py-3.5">
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Password requirements:
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {rules.map((rule) => (
                      <div
                        key={rule.id}
                        className={`flex items-center gap-2 text-sm transition-colors ${
                          rule.passed ? 'text-emerald-600' : 'text-slate-500'
                        }`}
                      >
                        {rule.passed ? (
                          <Check size={12} className="shrink-0" />
                        ) : (
                          <Circle size={12} className="text-slate-300 shrink-0" />
                        )}
                        {rule.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-brand-600 to-fuchsia-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-full py-3.5 mt-6 mb-5 transition-opacity"
              >
                {busy && <LoaderCircle size={16} className="animate-spin" />}
                {busy ? 'Updating…' : 'Update Password'}
                {!busy && <ArrowRight size={16} />}
              </button>
            </form>
          )}

          <button
            onClick={() => navigate(PUBLIC_PATHS.signIn)}
            className="w-full flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Sign In
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
