import { useState } from 'react';
import {
  UserRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  Circle,
  LoaderCircle,
  TriangleAlert,
  ArrowLeft,
  HeartHandshake,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ROLES, REGISTRATION_CONSENTS, checkPassword, isValidEmail } from '@tmg180/shared';
import { useAuthStore } from '../../store';
import { PUBLIC_PATHS, DASHBOARD_BY_ROLE } from '../../routes/paths';

/**
 * Create Account. No Figma frame exists for this screen — TITLE.md logged its
 * absence as open question #1 and assumed auth was handled elsewhere, so this
 * follows the Sign In card idiom until a frame lands.
 *
 * Deliberately short. The Personal Profile (11 sections) and worker onboarding
 * are resumable, participant/worker-owned flows that live inside the
 * workspace — an account only needs enough to exist.
 */

const WORKSPACE_CHOICES = [
  {
    role: ROLES.PARTICIPANT,
    label: 'Participant',
    description: 'Build your Personal Profile and keep your own support evidence over time.',
    icon: UserRound,
  },
  {
    role: ROLES.WORKER,
    label: 'Support worker',
    description: 'Set up your self-employed worker workspace, tools and governance structure.',
    icon: HeartHandshake,
  },
];

export default function SignUp() {
  const navigate = useNavigate();
  const signUp = useAuthStore((s) => s.signUp);
  const [showPassword, setShowPassword] = useState(false);
  const [failure, setFailure] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', email: '', password: '', role: ROLES.PARTICIPANT, consents: {} },
  });

  const password = watch('password') ?? '';
  const selectedRole = watch('role');
  const { rules } = checkPassword(password);

  const onSubmit = async (values) => {
    setFailure(null);
    try {
      const role = await signUp(values);
      navigate(DASHBOARD_BY_ROLE[role], { replace: true });
    } catch (error) {
      setFailure(error);
    }
  };

  const busy = isSubmitting;

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-100 via-indigo-50 to-purple-50 flex items-center justify-center px-6 py-12 font-sans text-slate-800">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.08)] p-8">
        <h1 className="text-2xl font-bold text-brand-600 text-center">TMG180</h1>
        <p className="text-sm text-slate-500 text-center mt-1 mb-7">
          Create your account to get started.
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
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Full name
            </label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-3 focus-within:border-brand-600 transition-colors">
              <UserRound size={16} className="text-slate-400 shrink-0" />
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
                {...register('name', {
                  required: 'Enter your name.',
                  validate: (value) => value.trim().length > 0 || 'Enter your name.',
                })}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-rose-600 mt-1.5 px-1">{errors.name.message}</p>
            )}
          </div>

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
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-3 focus-within:border-brand-600 transition-colors">
              <Lock size={16} className="text-slate-400 shrink-0" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Create a password"
                className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
                {...register('password', {
                  required: 'Choose a password.',
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

            {/* Same rules the server enforces — @tmg180/shared owns both. */}
            <div className="flex flex-col gap-1.5 mt-3 px-1">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`flex items-center gap-2 text-xs transition-colors ${
                    rule.passed ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  {rule.passed ? <Check size={13} /> : <Circle size={13} />}
                  {rule.label}
                </div>
              ))}
            </div>
          </div>

          <fieldset className="mt-1">
            <legend className="text-sm font-medium text-slate-700 mb-2">I am joining as</legend>
            <div className="flex flex-col gap-2">
              {WORKSPACE_CHOICES.map(({ role: value, label, description, icon: Icon }) => {
                const selected = selectedRole === value;
                return (
                  <label
                    key={value}
                    className={`flex items-start gap-3 rounded-2xl border px-4 py-3 cursor-pointer transition-colors ${
                      selected
                        ? 'border-brand-600 bg-brand-600/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={value}
                      className="sr-only"
                      {...register('role', { required: true })}
                    />
                    <Icon
                      size={18}
                      className={`shrink-0 mt-0.5 ${selected ? 'text-brand-600' : 'text-slate-400'}`}
                    />
                    <span className="flex flex-col gap-0.5">
                      <span
                        className={`text-sm font-semibold ${
                          selected ? 'text-brand-600' : 'text-slate-700'
                        }`}
                      >
                        {label}
                      </span>
                      <span className="text-xs text-slate-500 leading-relaxed">{description}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="flex flex-col gap-3 mt-1">
            {REGISTRATION_CONSENTS.map((consent) => (
              <div key={consent.id}>
                <label className="flex items-start gap-2.5 text-xs text-slate-500 leading-relaxed cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 shrink-0 w-4 h-4 accent-brand-600"
                    {...register(`consents.${consent.id}`, {
                      required: consent.required
                        ? 'Please agree to continue.'
                        : false,
                    })}
                  />
                  <span>{consent.label}</span>
                </label>
                {errors.consents?.[consent.id] && (
                  <p className="text-xs text-rose-600 mt-1 pl-6.5">
                    {errors.consents[consent.id].message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-brand-600 to-fuchsia-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-full py-3.5 mt-2 transition-opacity"
          >
            {busy && <LoaderCircle size={16} className="animate-spin" />}
            {busy ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <button
          onClick={() => navigate(PUBLIC_PATHS.signIn)}
          className="w-full flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mt-5"
        >
          <ArrowLeft size={14} />
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
}
