import { useState } from 'react';
import {
  ShieldCheck,
  SlidersHorizontal,
  Users,
  UserPlus,
  History,
  Link2,
  FileText,
  Info,
  CheckCircle2,
  Ban,
  LoaderCircle,
  TriangleAlert,
  X,
} from 'lucide-react';
import {
  CONSENT_PERMISSIONS,
  CONSENT_STATUS,
  PRIVACY_AUDIT_ACTIONS,
  SHARING_PREFERENCES,
  consentSummary,
} from '@tmg180/shared';
import { formatShortDate, formatTimestamp } from '../../lib/dates';
import {
  activeConsents,
  useGrantConsent,
  usePrivacy,
  useRevokeConsent,
  useSavePreferences,
  useUpdateConsent,
} from '../../hooks/participant/privacy';
import { useDirectory } from '../../hooks/participant/directory';
import { useSnapshots } from '../../hooks/participant/snapshot';
import Select from '../../components/ui/Select';

/**
 * Privacy & Sharing (Figma 1169:2326).
 *
 * Frame structure — ownership banner, sharing preferences, support team access,
 * consent audit log, and the rail of share links / export history / data
 * protection note — with the portal's type scale and card treatment
 * (md/frontend/TMG180_Participant_UI_Scale.md).
 *
 * One part of the frame has nothing behind it yet and says so instead of
 * pretending: time-limited share links need the external access layer. Grant
 * Access is real (M-09, built 19 Aug): it names a worker from the published
 * directory and creates the consent record the worker's whole workspace
 * reads — participant-only, no acceptance step, because canon is that the
 * participant decides. What is
 * real: the preferences, the consent records (reviewing and removing access,
 * both append-only), the audit log, and the export history.
 *
 * Frame slip to tell Saf: the export-history card is headed "Support Team
 * Access", a duplicate of the section above it. Titled from its layer name here.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

function Toggle({ checked, disabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full flex items-center px-0.5 shrink-0 transition-colors ${checked ? 'bg-brand-600' : 'bg-slate-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : ''
          }`}
      />
    </button>
  );
}

function Initials({ name }) {
  const initials = (name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  return (
    <div className="w-9 h-9 rounded-full bg-purple-50 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
      {initials || '?'}
    </div>
  );
}

/** Reviewing a grant rewrites it as a new record — see the controller. */
function ConsentReview({ consent, onClose }) {
  const [permissions, setPermissions] = useState(consent.permissions);
  const update = useUpdateConsent();

  const save = async () => {
    try {
      await update.mutateAsync({ id: consent.id, permissions });
      onClose();
    } catch {
      // update.error renders below.
    }
  };

  return (
    <div className="bg-slate-50 rounded-xl p-5 mt-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            What {consent.workerName} can see
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Changing this keeps the old record — your history of who could see what stays
            readable.
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-slate-400 hover:text-slate-600"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        {CONSENT_PERMISSIONS.map((permission) => (
          <label
            key={permission.key}
            className="flex items-start justify-between gap-4 bg-white rounded-lg px-4 py-3"
          >
            <span>
              <span className="block text-sm text-slate-700">{permission.label}</span>
              <span className="block text-xs text-slate-500 mt-0.5">
                {permission.description}
              </span>
            </span>
            <Toggle
              label={permission.label}
              checked={permissions[permission.key] === true}
              onChange={(value) =>
                setPermissions((current) => ({ ...current, [permission.key]: value }))
              }
            />
          </label>
        ))}
      </div>

      {update.error && (
        <p className="flex items-start gap-2 text-sm text-rose-700 mt-3">
          <TriangleAlert size={14} className="shrink-0 mt-0.5" />
          {update.error.message}
        </p>
      )}

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={save}
          disabled={update.isPending}
          className="bg-brand-600 text-white text-sm rounded-full px-5 py-2 shadow-md hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          {update.isPending ? 'Saving…' : 'Save changes'}
        </button>
        <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
          Cancel
        </button>
      </div>
    </div>
  );
}

/**
 * The grant. Who: any worker with a published profile (the same list Browse
 * Directory shows — picked from the directory so "who is this" is always
 * answerable). What: the same four areas a review edits. One active grant
 * per worker; the API says so with a 409 and the list already shows them.
 */
function GrantAccess({ existing, onClose }) {
  const [workerId, setWorkerId] = useState(null);
  const [permissions, setPermissions] = useState(
    Object.fromEntries(CONSENT_PERMISSIONS.map((p) => [p.key, false]))
  );
  const directory = useDirectory();
  const grant = useGrantConsent();

  const alreadyGranted = new Set(existing.map((consent) => consent.workerId));
  const options = (directory.data?.workers ?? []).map((worker) => ({
    value: worker.workerId,
    label: worker.name,
    meta: [worker.location, worker.experienceLabel].filter(Boolean).join(' · '),
    taken: alreadyGranted.has(worker.workerId),
  }));
  const anyArea = Object.values(permissions).some(Boolean);
  const fieldErrors = grant.error?.status === 400 ? (grant.error.data ?? {}) : {};

  const save = async () => {
    try {
      await grant.mutateAsync({ workerId, permissions });
      onClose();
    } catch {
      // grant.error renders below.
    }
  };

  return (
    <div className="bg-slate-50 rounded-xl p-5 mt-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Give a worker access</h3>
          <p className="text-xs text-slate-500 mt-1">
            Choose someone from the directory and tick what they may see. They will see your
            name in their workspace straight away; you can change or remove this at any time.
          </p>
        </div>
        <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600">
          <X size={16} />
        </button>
      </div>

      <div className="mt-4">
        <label htmlFor="grantWorker" className="block text-sm text-slate-600 mb-2">
          Worker
        </label>
        {directory.isLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <LoaderCircle size={14} className="animate-spin" />
            Loading the directory…
          </div>
        ) : options.length === 0 ? (
          <p className="text-sm text-slate-600 bg-white rounded-lg px-4 py-3">
            No worker has published a profile yet, so there is no one to choose. The worker
            you have in mind needs to publish theirs first.
          </p>
        ) : (
          <Select
            inputId="grantWorker"
            options={options}
            value={options.find((o) => o.value === workerId) ?? null}
            onChange={(option) => setWorkerId(option?.value ?? null)}
            isOptionDisabled={(option) => option.taken}
            placeholder="Choose from the directory…"
            formatOptionLabel={(option, { context }) => (
              <span className="flex items-baseline gap-2">
                <span>{option.label}</span>
                {context === 'menu' && option.meta && (
                  <span className="text-xs text-slate-500">{option.meta}</span>
                )}
                {context === 'menu' && option.taken && (
                  <span className="text-xs text-slate-400">already has access</span>
                )}
              </span>
            )}
          />
        )}
        {fieldErrors.workerId && (
          <p className="text-xs text-rose-700 mt-1.5">{fieldErrors.workerId}</p>
        )}
      </div>

      <p className="text-sm text-slate-600 mt-4 mb-2">What they may see</p>
      <div className="flex flex-col gap-2">
        {CONSENT_PERMISSIONS.map((permission) => (
          <label
            key={permission.key}
            className="flex items-start justify-between gap-4 bg-white rounded-lg px-4 py-3"
          >
            <span>
              <span className="block text-sm text-slate-700">{permission.label}</span>
              <span className="block text-xs text-slate-500 mt-0.5">{permission.description}</span>
            </span>
            <Toggle
              label={permission.label}
              checked={permissions[permission.key] === true}
              onChange={(value) =>
                setPermissions((current) => ({ ...current, [permission.key]: value }))
              }
            />
          </label>
        ))}
      </div>
      {fieldErrors.permissions && (
        <p className="text-xs text-rose-700 mt-1.5">{fieldErrors.permissions}</p>
      )}

      {grant.error && !Object.keys(fieldErrors).length && (
        <p className="flex items-start gap-2 text-sm text-rose-700 mt-3">
          <TriangleAlert size={14} className="shrink-0 mt-0.5" />
          {grant.error.message}
        </p>
      )}

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={save}
          disabled={grant.isPending || !workerId || !anyArea}
          title={!workerId ? 'Choose a worker first' : !anyArea ? 'Tick at least one area' : undefined}
          className="bg-brand-600 text-white text-sm rounded-full px-5 py-2 shadow-md hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {grant.isPending ? 'Granting…' : 'Grant access'}
        </button>
        <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
          Cancel
        </button>
      </div>
    </div>
  );
}

function ConsentRow({ consent }) {
  const [reviewing, setReviewing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const revoke = useRevokeConsent();

  return (
    <div className="border-t border-slate-100 first:border-t-0 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Initials name={consent.workerName} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">{consent.workerName}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {consentSummary(consent.permissions)} · updated{' '}
              {formatShortDate(consent.updatedAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setReviewing((open) => !open);
              setConfirming(false);
            }}
            className="text-sm text-brand-600 hover:text-brand-700 px-3 py-1.5"
          >
            Review
          </button>
          {confirming ? (
            <span className="flex items-center gap-2">
              <button
                onClick={() => revoke.mutate({ id: consent.id })}
                disabled={revoke.isPending}
                className="text-sm text-white bg-rose-600 hover:bg-rose-700 rounded-full px-4 py-1.5 disabled:opacity-50"
              >
                {revoke.isPending ? 'Removing…' : 'Yes, remove'}
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-sm text-slate-500 hover:text-slate-700 px-2"
              >
                Cancel
              </button>
            </span>
          ) : (
            <button
              onClick={() => {
                setConfirming(true);
                setReviewing(false);
              }}
              className="text-sm text-rose-600 hover:text-rose-700 px-3 py-1.5"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {confirming && (
        <p className="text-xs text-slate-500 mt-2">
          {consent.workerName} will lose access straight away. The record of what they
          could see is kept.
        </p>
      )}

      {revoke.error && (
        <p className="text-sm text-rose-700 mt-2">{revoke.error.message}</p>
      )}

      {reviewing && (
        <ConsentReview consent={consent} onClose={() => setReviewing(false)} />
      )}
    </div>
  );
}

function AuditEntry({ entry }) {
  const known = PRIVACY_AUDIT_ACTIONS[entry.action];
  const details = entry.details ?? {};
  const tone =
    known?.tone === 'revoked'
      ? 'bg-rose-50 text-rose-700'
      : known?.tone === 'completed'
        ? 'bg-slate-100 text-slate-600'
        : 'bg-emerald-50 text-emerald-700';

  const describe = () => {
    if (entry.action === 'privacy_preference_changed') {
      const preference = SHARING_PREFERENCES.find((item) => item.key === details.preference);
      return `${details.enabled ? 'Turned on' : 'Turned off'} — ${preference?.label ?? details.preference}`;
    }
    if (entry.action === 'snapshot_exported') {
      return `Exported your ${details.monthYear ?? 'monthly'} snapshot`;
    }
    return known?.label ?? entry.action;
  };

  return (
    <div className="flex items-start justify-between gap-4 border-t border-slate-100 first:border-t-0 py-3">
      <div className="min-w-0">
        <p className="text-sm text-slate-700">{describe()}</p>
        <p className="text-xs text-slate-500 mt-1">
          Action by: You · {formatTimestamp(entry.createdAt)}
        </p>
      </div>
      <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${tone}`}>
        {known?.tone === 'revoked' ? 'Removed' : known?.tone === 'completed' ? 'Completed' : 'Success'}
      </span>
    </div>
  );
}

export default function PrivacySharing() {
  const [isAllAudiListShow, setIsAllAudiListShow] = useState(false);
  const [granting, setGranting] = useState(false);


  const { data, isLoading, error } = usePrivacy({ allAuditList: isAllAudiListShow });
  const savePreferences = useSavePreferences();
  const { data: snapshots } = useSnapshots();

  const preferences = data?.preferences ?? {};
  const consents = activeConsents(data?.consents);
  const removed = (data?.consents ?? []).filter(
    (consent) => consent.status === CONSENT_STATUS.REVOKED
  );
  const exported = (snapshots ?? []).filter((snapshot) => snapshot.exportedAt);


  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Privacy &amp; Sharing</h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl">
          You control who can access your information.
        </p>
      </div>

      <div className={`${CARD} bg-linear-to-r from-purple-50 via-white/80 to-white/80`}>
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-white text-brand-600 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">You own this information.</h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-3xl">
              You decide who sees it. Your daily logs and snapshots remain private until you
              explicitly choose to share them.
            </p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 text-slate-500 bg-white/80 rounded-xl p-6">
          <LoaderCircle size={18} className="animate-spin" />
          Loading your privacy settings…
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn&rsquo;t load your privacy settings.</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-6 items-start">
          <div className="flex flex-col gap-6 min-w-0">

            {/* Sharing */}
            <section className={CARD}>
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={17} className="text-brand-600" />
                <h2 className="text-xl font-semibold text-slate-900">Sharing Preferences</h2>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Manage global settings for sharing your journey.
              </p>

              {savePreferences.error && (
                <p className="text-sm text-rose-700 mt-3">{savePreferences.error.message}</p>
              )}

              <div className="flex flex-col gap-3 mt-5">
                {SHARING_PREFERENCES.map((preference) => (
                  <div
                    key={preference.key}
                    className="flex items-start justify-between gap-4 bg-white/60 rounded-lg px-4 py-3"
                  >
                    <div>
                      <p className="text-sm text-slate-700">{preference.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {preference.description}
                      </p>
                      {preference.pending && (
                        <p className="text-xs text-slate-400 mt-1">
                          Saved as your preference — the feature it controls isn&rsquo;t
                          switched on yet.
                        </p>
                      )}
                    </div>
                    <Toggle
                      label={preference.label}
                      checked={preferences[preference.key] === true}
                      disabled={savePreferences.isPending}
                      onChange={(value) =>
                        savePreferences.mutate({ [preference.key]: value })
                      }
                    />
                  </div>
                ))}
              </div>
            </section>

            {/*  Grant Access */}
            <section className={CARD}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Users size={17} className="text-brand-600" />
                    <h2 className="text-xl font-semibold text-slate-900">
                      Support Team Access
                    </h2>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    Manage which members of your support team can view your shared
                    information.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setGranting((open) => !open)}
                  aria-expanded={granting}
                  className="flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-5 py-2.5 shadow-md hover:bg-brand-700 transition-colors shrink-0"
                >
                  <UserPlus size={15} />
                  Grant Access
                </button>
              </div>

              {granting && <GrantAccess existing={consents} onClose={() => setGranting(false)} />}

              {consents.length === 0 ? (
                <div className="bg-white/60 rounded-lg px-4 py-6 text-center mt-5">
                  <p className="text-sm text-slate-600">
                    No one has access to your information.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Everything you record is yours alone until you choose to share it. When
                    you are working with someone, use Grant Access to pick them from the
                    directory and say what they may see.
                  </p>
                </div>
              ) : (
                <div className="mt-3">
                  {consents.map((consent) => (
                    <ConsentRow key={consent.id} consent={consent} />
                  ))}
                </div>
              )}

              {removed.length > 0 && (
                <p className="text-xs text-slate-500 mt-4">
                  {removed.length} past {removed.length === 1 ? 'grant has' : 'grants have'}{' '}
                  been removed. The record is kept in your audit log below.
                </p>
              )}
            </section>

            {/* Audit */}
            <section className={CARD}>
              <div className="flex items-center gap-2">
                <History size={17} className="text-brand-600" />
                <h2 className="text-xl font-semibold text-slate-900">Consent Audit Log</h2>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                A secure record of changes to your privacy settings.
              </p>

              {data.audit.length === 0 ? (
                <p className="text-sm text-slate-500 mt-5">
                  Nothing to show yet. Changes you make to sharing will appear here.
                </p>
              ) : (
                <div className="mt-3">
                  {data.audit.map((entry) => (
                    <AuditEntry key={entry.id} entry={entry} />
                  ))}
                </div>
              )}
              <div className="flex items-center justify-center">
                <p
                  className='text-sm text-slate-600 mt-1 hover:text-blue-500 hover:underline cursor-pointer'
                  onClick={() => setIsAllAudiListShow(prev => !prev)}
                > {isAllAudiListShow ? "Show Less" : "show all" }</p>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-6">
            <section className={CARD}>
              <div className="flex items-center gap-2">
                <Link2 size={16} className="text-brand-600" />
                <h2 className="text-lg font-semibold text-slate-900">Active Share Links</h2>
              </div>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Time-limited links let someone read one snapshot without an account. They
                aren&rsquo;t switched on yet.
              </p>
              <p className="text-xs text-slate-500 mt-3">
                For now a snapshot leaves TMG180 only when you export it yourself.
              </p>
            </section>

            <section className={CARD}>
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-brand-600" />
                <h2 className="text-lg font-semibold text-slate-900">Export History</h2>
              </div>
              {exported.length === 0 ? (
                <p className="text-sm text-slate-600 mt-2">
                  You haven&rsquo;t exported a snapshot yet.
                </p>
              ) : (
                <div className="flex flex-col gap-3 mt-3">
                  {exported.map((snapshot) => (
                    <div key={snapshot.id} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-slate-700">
                          {snapshot.monthLabel} Snapshot
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Downloaded {formatShortDate(snapshot.exportedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-[#eff4ff] rounded-xl p-6">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-[#2170e4]" />
                <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">
                  Data protection commitment
                </p>
              </div>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Your data is handled in line with the Australian Privacy Act 1988 (APPs) +
                Notifiable Data Breaches scheme.
              </p>
              <p className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                <Ban size={12} className="shrink-0" />
                TMG180 stores no medical or treatment records.
              </p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
