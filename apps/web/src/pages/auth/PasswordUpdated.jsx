import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_PATHS } from '../../routes/paths';

export default function PasswordUpdated() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-brand-100 via-indigo-50 to-sky-100 flex items-center justify-center px-6 font-sans text-slate-800">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.08)] p-8 text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-emerald-400 blur-xl opacity-40" />
          <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <Check size={32} strokeWidth={3} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">Password updated</h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-7">
          Your account is secure. You can now access TMG180 with your new
          credentials.
        </p>

        <button
          onClick={() => navigate(PUBLIC_PATHS.signIn)}
          className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-800 text-white text-sm font-semibold rounded-full px-6 py-3 transition-colors"
        >
          Return to Sign In
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
