import { ArrowRight, NotebookPen, TrendingUp, User, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_ACTIONS } from '@tmg180/shared';
import { PARTICIPANT_PATHS } from '../../routes/paths';
import { useAuthStore } from '../../store';
import { useProfile } from '../../hooks/participant/profile';

/**
 * Participant Dashboard — Final Override P2 / Handoff Mapping v1.1 §2:
 * exactly the four seeded primary actions, in seed order, with the seed's
 * label and description, and nothing else on the primary surface. Every
 * string comes from `DASHBOARD_ACTIONS` (@tmg180/shared, the seed bundle) or
 * the PERSONAL PROFILE IMPORTANT CHANGES progress line ("7 of 11 sections
 * completed"). Sue's brief for this screen: calmer — "Welcome home", not
 * "here are all your features" — so no charts, no stat rows, no decoration.
 *
 * Chrome is the participant UI scale (md/frontend/TMG180_Participant_UI_Scale.md);
 * only the icon tint varies per action.
 */

const ROUTES = {
  continue_profile: PARTICIPANT_PATHS.profile,
  daily_log: PARTICIPANT_PATHS.dailyLog,
  monthly_snapshot: PARTICIPANT_PATHS.snapshot,
  browse_workers: PARTICIPANT_PATHS.browseWorkers,
};

const ICONS = {
  continue_profile: User,
  daily_log: NotebookPen,
  monthly_snapshot: TrendingUp,
  browse_workers: Users,
};

const TINTS = {
  continue_profile: 'bg-brand-100 text-brand-600',
  daily_log: 'bg-emerald-100 text-emerald-700',
  monthly_snapshot: 'bg-sky-100 text-sky-700',
  browse_workers: 'bg-rose-100 text-rose-700',
};

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col';

function ActionCard({ action, progress, onOpen }) {
  const Icon = ICONS[action.key];
  return (
    <section className={CARD}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${TINTS[action.key]}`}>
        <Icon size={22} />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mt-5">{action.label}</h2>
      <p className="text-sm text-slate-600 mt-2">{action.description}</p>
      {progress && (
        <span className="w-fit text-xs font-medium text-slate-600 bg-[#dce9ff] rounded-full px-3 py-1 mt-3">
          {progress}
        </span>
      )}
      <div className="mt-auto pt-6">
        <button
          onClick={onOpen}
          className="inline-flex items-center gap-2 border border-brand-600 text-brand-600 text-sm font-semibold rounded-full px-5 py-2 hover:bg-brand-50 transition-colors"
        >
          Open
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

export default function ParticipantDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();

  const firstName = user?.name?.split(' ')[0];
  const completed = profile?.completedSections ?? 0;
  const total = profile?.totalSections ?? 11;
  const progress = `${completed} of ${total} sections completed`;

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-slate-900">
        {firstName ? `Welcome back, ${firstName}.` : 'Welcome back.'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {DASHBOARD_ACTIONS.map((action) => (
          <ActionCard
            key={action.key}
            action={action}
            progress={action.key === 'continue_profile' ? progress : null}
            onOpen={() => navigate(ROUTES[action.key])}
          />
        ))}
      </div>
    </div>
  );
}
