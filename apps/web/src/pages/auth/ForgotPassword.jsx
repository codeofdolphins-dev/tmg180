import { Key, Mail, ArrowRight, ArrowLeft, LoaderCircle, TriangleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { isValidEmail } from '@tmg180/shared';
import { useForgotPassword } from '../hooks/auth';
import { PUBLIC_PATHS } from '../routes/paths';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async ({ email }) => {
    try {
      await forgotPassword.mutateAsync(email);
      // The API answers the same way whether or not the address is registered,
      // so the next screen is the same either way.
      navigate(PUBLIC_PATHS.checkEmail, { state: { email } });
    } catch {
      // forgotPassword.error renders in the banner below.
    }
  };

  const busy = isSubmitting || forgotPassword.isPending;

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

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {forgotPassword.error && (
            <div
              role="alert"
              className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-4 py-3 text-sm mb-5"
            >
              <TriangleAlert size={16} className="shrink-0 mt-0.5" />
              <span>{forgotPassword.error.message}</span>
            </div>
          )}

          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3.5 py-3 focus-within:border-brand-600 transition-colors">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="hello@tmg180.com"
                className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
                {...register('email', {
                  required: 'Enter your email address.',
                  validate: (value) => isValidEmail(value) || 'Enter a valid email address.',
                })}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-600 mt-1.5">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-brand-600 to-fuchsia-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg py-3.5 mb-5 transition-opacity"
          >
            {busy ? <LoaderCircle size={16} className="animate-spin" /> : null}
            {busy ? 'Sending…' : 'Send reset link'}
            {!busy && <ArrowRight size={16} />}
          </button>
        </form>

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
