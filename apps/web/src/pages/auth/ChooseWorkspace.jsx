import { User, History, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, ROLES } from '../../store';
import { DASHBOARD_BY_ROLE } from '../../routes/paths';

const WORKSPACES = [
  {
    role: ROLES.PARTICIPANT,
    label: 'Participant Portal',
    subtitle:
      'Use your free portal to build your Personal Profile and track support evidence over time.',
    linkLabel: 'Enter Portal',
    icon: User,
    iconBg: 'bg-brand-600',
    blob: 'bg-brand-300',
    accent: 'text-brand-600',
  },
  {
    role: ROLES.WORKER,
    label: 'Worker Workspace',
    subtitle:
      'Set up your self-employed worker workspace (tools, templates, governance structure).',
    linkLabel: 'Enter Workspace',
    icon: History,
    iconBg: 'bg-sky-500',
    blob: 'bg-sky-300',
    accent: 'text-sky-600',
  },
  {
    role: ROLES.ADMIN,
    // "Governance Admin" is a banned term in the terminology registry; the
    // Figma frame's wording is replaced here per the Drift Fix Pack.
    label: 'TMG180 Platform Admin',
    subtitle: 'Access high-level administrative tools, system settings and oversight.',
    linkLabel: 'Enter Admin',
    icon: ShieldCheck,
    iconBg: 'bg-emerald-500',
    blob: 'bg-emerald-300',
    accent: 'text-emerald-600',
  },
];

/** Static class names — Tailwind can't see interpolated ones. */
const COLUMNS = { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3' };

export default function ChooseWorkspace() {
  const navigate = useNavigate();
  const selectRole = useAuthStore((s) => s.selectRole);
  const held = useAuthStore((s) => s.roles);

  // Only the workspaces this account holds. Roles are issued by the backend —
  // this screen opens one, it never grants one.
  const available = WORKSPACES.filter((workspace) => held.includes(workspace.role));

  const enterWorkspace = (role) => {
    if (!selectRole(role)) return;
    navigate(DASHBOARD_BY_ROLE[role]);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-brand-50 via-sky-50 to-emerald-50 flex flex-col items-center px-6 py-16 font-sans text-slate-800">
      <h1 className="text-4xl font-bold text-brand-600 mb-2 text-center">
        Welcome to TMG180
      </h1>
      <p className="text-slate-500 text-sm mb-12 text-center">
        Choose how you'd like to experience the platform. Your journey begins here.
      </p>

      <div
        className={`grid grid-cols-1 ${COLUMNS[available.length] ?? 'sm:grid-cols-3'} gap-6 w-full max-w-5xl flex-1`}
      >
        {available.map(({ role, label, subtitle, linkLabel, icon: Icon, iconBg, blob, accent }) => (
          <div
            key={label}
            className="relative overflow-hidden flex flex-col bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
          >
            <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 ${blob}`} />

            <div
              className={`relative w-14 h-14 rounded-full flex items-center justify-center mb-6 ${iconBg}`}
            >
              <Icon size={24} className="text-white" />
            </div>
            <h2 className="relative text-xl font-bold text-slate-900 mb-2">{label}</h2>
            <p className="relative text-sm text-slate-500 mb-6 leading-relaxed flex-1">
              {subtitle}
            </p>
            <button
              onClick={() => enterWorkspace(role)}
              className={`relative flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-opacity w-fit ${accent}`}
            >
              {linkLabel}
              <ArrowRight size={15} />
            </button>
          </div>
        ))}
      </div>

      <footer className="flex flex-wrap items-center justify-center gap-6 mt-14 text-xs text-slate-400">
        <span className="font-medium text-brand-600">
          © 2024 TMG180. All rights reserved.
        </span>
        <span className="flex items-center gap-6">
          <button className="hover:text-slate-600 transition-colors">
            Privacy Policy
          </button>
          <button className="hover:text-slate-600 transition-colors">
            Terms of Service
          </button>
          <button className="hover:text-slate-600 transition-colors">
            Help Center
          </button>
        </span>
      </footer>
    </div>
  );
}
