import {
  Users,
  ShieldCheck,
  BadgeCheck,
  FilePenLine,
  CalendarCheck2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminOverview } from '../../hooks/admin/platform';
import { ADMIN_PATHS } from '../../routes/paths';

/**
 * Platform Governance Dashboard — governance portal home, on live platform
 * aggregates (GET /admin/overview). Renders inside GovernanceLayout; content
 * only, on the shared portal card idiom.
 *
 * Every number is a real aggregate — there is no sample data anywhere on
 * this screen. What the platform cannot measure yet (incident tickets) is
 * shown visibly switched off, per the "real or visibly switched off" rule.
 */

const CARD = 'bg-white/80 rounded-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

/** "2026-08" -> "August 2026". */
function monthLabel(key) {
  if (!key) return '';
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-AU', {
    month: 'long',
    year: 'numeric',
  });
}

function StatCard({ label, value, valueColor = 'text-slate-900', icon: Icon, iconBg, note, progress, progressColor, action }) {
  return (
    <div className={CARD}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 max-w-40">
          {label}
        </p>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className={`text-3xl font-bold mb-3 ${valueColor}`}>{value}</p>

      {progress !== undefined && progress !== null && (
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full ${progressColor}`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      )}
      {note && <p className="text-xs text-slate-500">{note}</p>}
      {action}
    </div>
  );
}

export default function PlatformGovernanceDashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useAdminOverview();

  const loading = isLoading || !data;
  const v = (value) => (loading ? '…' : value);

  const ackPct =
    !loading && data.governance.expected > 0
      ? Math.round((data.governance.acknowledged / data.governance.expected) * 100)
      : null;
  const snapshotPct =
    !loading && data.snapshots.activeParticipants > 0
      ? Math.round((data.snapshots.locked / data.snapshots.activeParticipants) * 100)
      : null;

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          TMG180 Platform Governance
        </h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl">
          Platform-level verification metadata, policy versioning/acknowledgements,
          and incident/complaint tickets. No service-delivery oversight.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-4 text-sm text-rose-700">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>The platform overview could not be loaded. {error.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Total Active Workers"
          value={v(data?.workers.active)}
          valueColor="text-brand-600"
          icon={Users}
          iconBg="bg-brand-100 text-brand-600"
          note={loading ? '' : `${data.workers.published} directory ${data.workers.published === 1 ? 'profile' : 'profiles'} published`}
        />
        <StatCard
          label="Total Active Participants"
          value={v(data?.participants.active)}
          valueColor="text-blue-600"
          icon={Users}
          iconBg="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Governance Acknowledgements"
          value={loading ? '…' : ackPct === null ? '—' : `${ackPct}%`}
          valueColor="text-emerald-600"
          icon={ShieldCheck}
          iconBg="bg-emerald-100 text-emerald-600"
          progress={ackPct}
          progressColor="bg-emerald-500"
          note={
            loading
              ? ''
              : ackPct === null
                ? 'No active workers yet'
                : `${data.governance.acknowledged} of ${data.governance.expected} current items acknowledged`
          }
        />
        <StatCard
          label="Credentials Awaiting Verification"
          value={v(data?.credentials.awaiting)}
          valueColor={!loading && data.credentials.awaiting > 0 ? 'text-rose-600' : 'text-slate-900'}
          icon={BadgeCheck}
          iconBg="bg-rose-100 text-rose-600"
          note={loading ? '' : `${data.credentials.verified} of ${data.credentials.recorded} recorded credentials verified`}
          action={
            <button
              onClick={() => navigate(ADMIN_PATHS.workersReport)}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-800 transition-colors"
            >
              Review in Workers Report
              <ArrowRight size={12} />
            </button>
          }
        />
        <StatCard
          label={`Monthly Snapshots — ${loading ? '' : monthLabel(data.snapshots.month)}`}
          value={v(data?.snapshots.locked)}
          valueColor="text-brand-600"
          icon={CalendarCheck2}
          iconBg="bg-brand-100 text-brand-600"
          progress={snapshotPct}
          progressColor="bg-brand-600"
          note={
            loading
              ? ''
              : `approved and locked, of ${data.snapshots.activeParticipants} active ${data.snapshots.activeParticipants === 1 ? 'participant' : 'participants'}`
          }
        />
        <StatCard
          label={`Consent Updates — ${loading ? '' : monthLabel(data.consent.month)}`}
          value={v(data?.consent.updates)}
          valueColor="text-blue-700"
          icon={FilePenLine}
          iconBg="bg-blue-100 text-blue-600"
          note={loading ? '' : 'grants and revocations this month'}
        />

        {/* Ticketing has no backing table yet — shown switched off, never faked. */}
        <div className={`${CARD} opacity-60`} aria-disabled="true">
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 max-w-40">
              Incident &amp; Complaint Tickets
            </p>
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-slate-400">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-400 mb-3">—</p>
          <p className="text-xs text-slate-400">Ticketing is not built yet — nothing is recorded.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200 pt-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
            Regulatory Compliance
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            This platform operates in strict accordance with the Australian
            Privacy Act 1988 (APPs) and the Notifiable Data Breaches (NDB)
            scheme. All data shown is aggregated for governance oversight.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 shrink-0">
          <ShieldCheck size={20} className="text-brand-600" />
          <span>
            Secure
            <br />
            Governance
            <br />
            Environment
          </span>
        </div>
      </div>
    </div>
  );
}
