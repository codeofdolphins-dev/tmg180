import { User, History, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, ROLES as APP_ROLES } from '../store';
import { DASHBOARD_BY_ROLE } from '../routes/paths';

const ROLES = [
  {
    role: APP_ROLES.PARTICIPANT,
    title: 'Participant Portal',
    description:
      'Use your free portal to build your Personal Profile and track support evidence over time.',
    linkLabel: 'Enter Portal',
    icon: User,
    iconBg: 'bg-purple-600',
    iconColor: 'text-white',
    accent: 'text-brand-600',
    blob: 'bg-[#ddb8ff]',
  },
  {
    role: APP_ROLES.WORKER,
    title: 'Worker Workspace',
    description:
      'Set up your self-employed worker workspace (tools, templates, governance structure).',
    linkLabel: 'Enter Workspace',
    icon: History,
    iconBg: 'bg-[#d3e4fe]',
    iconColor: 'text-[#0058be]',
    accent: 'text-[#0058be]',
    blob: 'bg-[#adc6ff]',
  },
  {
    role: APP_ROLES.ADMIN,
    title: 'TMG180 Platform Admin',
    description:
      'Access high-level administrative tools, system settings, and overarching platform governance.',
    linkLabel: 'Enter Admin',
    icon: ShieldCheck,
    iconBg: 'bg-[#dce9ff]',
    iconColor: 'text-[#005f40]',
    accent: 'text-[#005f40]',
    blob: 'bg-[#4edea3]',
  },
];

export default function RoleSelection() {
  const navigate = useNavigate();
  const selectRole = useAuthStore((s) => s.selectRole);

  const enterPortal = (role) => {
    selectRole(role);
    navigate(DASHBOARD_BY_ROLE[role]);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-sky-100 flex flex-col items-center justify-center px-6 py-16 font-sans text-slate-800">
      <h1 className="text-5xl font-bold text-brand-600 mb-4 text-center">
        Welcome to TMG180
      </h1>
      <p className="text-lg text-slate-500 mb-14 text-center">
        Choose how you’d like to experience the platform. Your journey begins here.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-300">
        {ROLES.map(
          ({ role, title, description, linkLabel, icon: Icon, iconBg, iconColor, accent, blob }) => (
            <div
              key={title}
              className="relative overflow-hidden flex flex-col bg-white/70 rounded-[48px] p-8 min-h-81.75 shadow-[0_8px_30px_rgb(0,0,0,0.05)]"
            >
              <div
                className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl opacity-70 ${blob}`}
              />

              <div
                className={`relative w-16 h-16 rounded-full flex items-center justify-center mb-6 ${iconBg}`}
              >
                <Icon size={28} className={iconColor} />
              </div>
              <h2 className="relative text-2xl font-semibold text-slate-900 mb-3">{title}</h2>
              <p className="relative text-base text-slate-500 leading-relaxed flex-1">
                {description}
              </p>
              <button
                onClick={() => enterPortal(role)}
                className={`relative flex items-center gap-2.5 text-sm font-medium hover:opacity-80 transition-opacity w-fit mt-6 ${accent}`}
              >
                {linkLabel}
                <ArrowRight size={16} />
              </button>
            </div>
          )
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-center gap-6 mt-24 text-xs font-semibold text-slate-500">
        <span className="text-sm font-bold text-brand-600">
          © 2024 TMG180. All rights reserved.
        </span>
        <span className="flex items-center gap-4">
          <button className="hover:text-slate-700 transition-colors">Privacy Policy</button>
          <button className="hover:text-slate-700 transition-colors">Terms of Service</button>
          <button className="hover:text-slate-700 transition-colors">Help Center</button>
        </span>
      </footer>
    </div>
  );
}
