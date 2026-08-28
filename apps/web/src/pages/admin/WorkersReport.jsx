import { useState } from 'react';
import {
  Users,
  BadgeCheck,
  ShieldCheck,
  AlertTriangle,
  Upload,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Undo2,
  LoaderCircle,
  Info,
} from 'lucide-react';
import { CREDENTIAL_STATUS, credentialStatusLabel } from '@tmg180/shared';
import { formatShortDate, formatRelativeTime } from '../../lib/dates';
import { useAdminWorkers, useVerifyCredential } from '../../hooks/admin/platform';

/**
 * Workers Report — the worker registry and the home of admin credential
 * verification (Technical Brief §4: the platform "verifies worker eligibility
 * documents and access conditions"). Renders inside GovernanceLayout; content
 * only, on the shared portal card idiom.
 *
 * Everything on screen is live registry data — no sample rows. A worker's
 * expanded row lists their four credentials; "Verify" stamps one, "Remove"
 * takes the stamp off, and a worker editing a credential clears its stamp
 * automatically (verification refers to what was on file). The stamp is what
 * participants see as "Verified by TMG180" on directory profiles.
 */

const CARD = 'bg-white/80 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

const STATUS_CHIP = {
  [CREDENTIAL_STATUS.UP_TO_DATE]: 'bg-emerald-50 text-emerald-700',
  [CREDENTIAL_STATUS.DUE_SOON]: 'bg-amber-50 text-amber-700',
  [CREDENTIAL_STATUS.EXPIRED]: 'bg-rose-50 text-rose-600',
  [CREDENTIAL_STATUS.NEEDS_REVIEW]: 'bg-slate-100 text-slate-500',
};

function StatCard({ label, value, icon: Icon, tone }) {
  return (
    <div className={`${CARD} p-4`}>
      <div className="flex items-start justify-between gap-2 mb-4">
        <p className="text-xs text-slate-400 leading-tight">{label}</p>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${tone}`}>
          <Icon size={13} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

/** One credential inside an expanded worker row, with its verification act. */
function CredentialRow({ worker, credential }) {
  const verify = useVerifyCredential();
  const act = (verified) =>
    verify.mutate({ workerId: worker.id, type: credential.type, verified });

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 border-t border-slate-100 first:border-t-0">
      <div className="w-56 min-w-0">
        <p className="text-sm font-medium text-slate-800">{credential.label}</p>
        {credential.reference && (
          <p className="text-xs text-slate-400 truncate">Ref: {credential.reference}</p>
        )}
      </div>

      <div className="w-44 text-xs text-slate-500">
        {credential.expiresAt ? (
          <>
            {credential.issuedAt && <>Issued {formatShortDate(credential.issuedAt)} · </>}
            Expires {formatShortDate(credential.expiresAt)}
          </>
        ) : credential.recorded ? (
          'No expiry recorded'
        ) : (
          'Nothing recorded yet'
        )}
      </div>

      <span
        className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_CHIP[credential.status]}`}
      >
        {credentialStatusLabel(credential.status)}
      </span>

      <div className="ml-auto flex items-center gap-2">
        {credential.verifiedAt ? (
          <>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <BadgeCheck size={14} />
              Verified {formatRelativeTime(credential.verifiedAt)}
            </span>
            <button
              onClick={() => act(false)}
              disabled={verify.isPending}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
            >
              {verify.isPending ? <LoaderCircle size={12} className="animate-spin" /> : <Undo2 size={12} />}
              Remove
            </button>
          </>
        ) : credential.recorded ? (
          <button
            onClick={() => act(true)}
            disabled={verify.isPending}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-full px-4 py-1.5 transition-colors disabled:opacity-50"
          >
            {verify.isPending ? (
              <LoaderCircle size={13} className="animate-spin" />
            ) : (
              <CircleCheck size={13} />
            )}
            Verify
          </button>
        ) : (
          <span className="text-xs text-slate-400">Awaiting the worker&rsquo;s details</span>
        )}
      </div>

      {verify.error && (
        <p className="w-full text-xs text-rose-600">{verify.error.message}</p>
      )}
    </div>
  );
}

function WorkerRow({ worker, open, onToggle }) {
  const { publication, governance, credentialSummary } = worker;
  return (
    <>
      <tr
        className="border-t border-slate-100 cursor-pointer hover:bg-slate-50/60 transition-colors"
        onClick={onToggle}
      >
        <td className="py-3 pr-3">
          <div className="flex items-center gap-2">
            {open ? (
              <ChevronDown size={14} className="text-slate-400 shrink-0" />
            ) : (
              <ChevronRight size={14} className="text-slate-400 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-slate-700 font-medium truncate">{worker.name}</p>
              <p className="text-xs text-slate-400 truncate">{worker.email}</p>
            </div>
          </div>
        </td>
        <td className="py-3 pr-3">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${
                worker.accountStatus !== 'active'
                  ? 'bg-rose-500'
                  : publication.isPublished
                    ? 'bg-emerald-500'
                    : 'bg-slate-400'
              }`}
            />
            {worker.accountStatus !== 'active'
              ? 'Suspended'
              : publication.isPublished
                ? 'Published'
                : 'Draft'}
          </div>
        </td>
        <td className="py-3 pr-3 text-slate-600">
          {governance.confirmed} of {governance.total}
        </td>
        <td className="py-3 pr-3">
          {credentialSummary.recorded === 0 ? (
            <span className="text-slate-400">None recorded</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-slate-600">
              <BadgeCheck
                size={14}
                className={credentialSummary.awaiting > 0 ? 'text-amber-500' : 'text-emerald-500'}
              />
              {credentialSummary.verified} of {credentialSummary.recorded} verified
            </span>
          )}
        </td>
        <td className="py-3 text-slate-500">
          {governance.lastAcknowledgedAt
            ? formatShortDate(governance.lastAcknowledgedAt.slice(0, 10))
            : '—'}
        </td>
      </tr>
      {open && (
        <tr className="border-t border-slate-100 bg-slate-50/40">
          <td colSpan={5} className="px-5 py-2">
            {credentialSummary.recorded === 0 && (
              <p className="flex items-center gap-2 text-xs text-slate-500 bg-sky-50 border border-sky-100 rounded-lg px-3 py-2 mt-2 mb-1">
                <Info size={13} className="shrink-0 text-sky-600" />
                Verification opens once this worker records their credential details in
                their own workspace (Governance Standing) — TMG180 verifies what workers
                put on file, it never records it for them.
              </p>
            )}
            {worker.credentials.map((credential) => (
              <CredentialRow key={credential.type} worker={worker} credential={credential} />
            ))}
          </td>
        </tr>
      )}
    </>
  );
}

export default function WorkersReport() {
  const { data, isLoading, error } = useAdminWorkers();
  const [openId, setOpenId] = useState(null);

  const workers = data?.workers ?? [];
  const stats = {
    active: workers.filter((w) => w.accountStatus === 'active').length,
    published: workers.filter((w) => w.publication.isPublished).length,
    awaiting: workers.reduce((sum, w) => sum + w.credentialSummary.awaiting, 0),
    verified: workers.reduce((sum, w) => sum + w.credentialSummary.verified, 0),
    acknowledged: workers.filter(
      (w) => w.governance.total > 0 && w.governance.confirmed === w.governance.total
    ).length,
  };
  const v = (value) => (isLoading ? '…' : value);

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Workers Report</h1>
          <p className="text-base text-slate-600 mt-2">
            Platform-level worker verification and governance metadata.
          </p>
        </div>
        {/* Export has nothing behind it yet — switched off, never a dead control. */}
        <button
          disabled
          title="Export is not built yet"
          className="flex items-center gap-2 text-sm font-medium text-slate-400 bg-slate-100 rounded-full px-5 py-2.5 cursor-not-allowed shrink-0"
        >
          <Upload size={15} />
          Export metadata report
          <span className="text-xs font-normal">(not yet available)</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Active workers" value={v(stats.active)} icon={Users} tone="bg-brand-100 text-brand-600" />
        <StatCard label="Profiles published" value={v(stats.published)} icon={BadgeCheck} tone="bg-sky-100 text-sky-600" />
        <StatCard label="Fully acknowledged" value={v(stats.acknowledged)} icon={ShieldCheck} tone="bg-emerald-100 text-emerald-600" />
        <StatCard label="Credentials awaiting verification" value={v(stats.awaiting)} icon={AlertTriangle} tone="bg-rose-100 text-rose-600" />
        <StatCard label="Credentials verified" value={v(stats.verified)} icon={CircleCheck} tone="bg-brand-100 text-brand-600" />
      </div>

      <div className={`${CARD} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Worker Registry</h3>
          <p className="text-xs text-slate-400">
            Open a worker to review and verify their credentials
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 py-8 justify-center text-slate-400 text-sm">
            <LoaderCircle size={16} className="animate-spin" />
            Loading the registry…
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-4 text-sm text-rose-700">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>The registry could not be loaded. {error.message}</span>
          </div>
        )}

        {!isLoading && !error && workers.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">
            No worker accounts yet — the registry fills in as workers sign up.
          </p>
        )}

        {!isLoading && !error && workers.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400">
                <th className="font-medium pb-2">Worker</th>
                <th className="font-medium pb-2">Profile Status</th>
                <th className="font-medium pb-2">Governance Items</th>
                <th className="font-medium pb-2">Credentials</th>
                <th className="font-medium pb-2">Last Ack.</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <WorkerRow
                  key={worker.id}
                  worker={worker}
                  open={openId === worker.id}
                  onToggle={() => setOpenId(openId === worker.id ? null : worker.id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
