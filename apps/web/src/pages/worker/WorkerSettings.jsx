import { useEffect, useState } from 'react';
import {
  Bell,
  BadgeCheck,
  CircleAlert,
  ExternalLink,
  LoaderCircle,
  Lock,
  PencilLine,
  Send,
  Shield,
  TriangleAlert,
  Undo2,
  User,
  UserRound,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  usePublishProfile,
  useUnpublishProfile,
  useUpdateAccountName,
  useWorkerProfile,
} from '../../hooks/worker/profile';
import { WORKER_PATHS } from '../../routes/paths';
import { useAuthStore } from '../../store';

/**
 * Worker Settings (Figma `1170:7043`) — the account, the state of the
 * public profile, and how TMG180 contacts you.
 *
 * The frame's "Professional Profile" card duplicates the authoring form on
 * `1170:8069` field for field. Rather than build two screens that write the
 * same rows, this card carries what settings should: whether the profile is
 * listed, what is still outstanding, and the publish / take-down controls —
 * with the writing itself one click away on Worker Profile & Availability
 * (brief decision 9).
 *
 * Frame slips carried to Saf: the sub-heading is a broken string ("2
 * preferences and define your professional profile."), and the account
 * fields use US placeholders (+1 (555)…, Vancouver BC, Pacific Time).
 *
 * Notifications, two-factor, session management and password change have no
 * backend yet, so they render where the frame puts them, visibly inactive,
 * saying so — never a live-looking control that does nothing.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';
const FIELD =
  'w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-colors';

function CardHeader({ icon: Icon, tone, title, sub }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
        <Icon size={18} />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {sub && <p className="text-sm text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/** A control the frame shows but nothing stands behind yet. */
function NotYet({ label, description }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <span className="text-xs text-slate-400 border border-slate-200 rounded-full px-3 py-1 shrink-0">
        Not yet available
      </span>
    </div>
  );
}

function AccountDetails() {
  const user = useAuthStore((state) => state.user);
  const rename = useUpdateAccountName();
  const [name, setName] = useState(user?.name ?? '');

  // The store is the authority on the account; adopt its name whenever it
  // changes underneath (another tab, a background refresh) unless the field
  // is being edited.
  useEffect(() => {
    setName((current) => (rename.isPending ? current : (user?.name ?? '')));
  }, [user?.name, rename.isPending]);

  const dirty = name.trim() !== (user?.name ?? '');
  const fieldError = rename.error?.status === 400 ? rename.error.data?.full_name : null;

  return (
    <section className={CARD}>
      <CardHeader
        icon={User}
        tone="bg-sky-50 text-sky-600"
        title="Account details"
        sub="Who you are on TMG180."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="full_name" className="block text-sm text-slate-600 mb-2">
            Your name
          </label>
          <input
            id="full_name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={FIELD}
          />
          <p className="text-xs text-slate-500 mt-1.5">
            Used across your workspace, and on your directory profile unless you set a display
            name there.
          </p>
          {fieldError && (
            <p className="flex items-center gap-1.5 text-xs text-rose-700 mt-1.5">
              <CircleAlert size={12} />
              {fieldError}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="block text-sm text-slate-600 mb-2">
            Email address
          </label>
          <input
            id="email"
            value={user?.email ?? ''}
            readOnly
            className={`${FIELD} bg-slate-50 text-slate-500 cursor-not-allowed`}
          />
          <p className="text-xs text-slate-500 mt-1.5">
            Your email is how you sign in. Changing it needs a verification step that is not
            built yet.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 mt-4 pt-2">
        <NotYet
          label="Phone number"
          description="TMG180 doesn't store a phone number for you. Participants contact you the way you describe on your profile."
        />
        <NotYet
          label="Timezone"
          description="Dates and times follow your device. A stored timezone arrives with reminders."
        />
      </div>

      {dirty && (
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => setName(user?.name ?? '')}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => rename.mutate(name.trim())}
            disabled={rename.isPending}
            className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 shadow-md hover:bg-brand-700 transition-colors disabled:opacity-60"
          >
            {rename.isPending && <LoaderCircle size={15} className="animate-spin" />}
            Save changes
          </button>
        </div>
      )}
      {rename.isSuccess && !dirty && <p className="text-xs text-emerald-700 mt-3">Name saved.</p>}
    </section>
  );
}

function ProfileCard() {
  const navigate = useNavigate();
  const { data: profile, isLoading, error } = useWorkerProfile();
  const publish = usePublishProfile();
  const unpublish = useUnpublishProfile();

  return (
    <section className={CARD}>
      <CardHeader
        icon={UserRound}
        tone="bg-purple-50 text-brand-600"
        title="Your directory profile"
        sub="What participants can read about you, and whether it is listed."
      />

      {isLoading && (
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <LoaderCircle size={16} className="animate-spin" />
          Loading your profile…
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-4 text-rose-800">
          <TriangleAlert size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">We couldn&rsquo;t load your profile.</p>
            <p className="text-xs mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {profile && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            {profile.publication.isPublished ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                <BadgeCheck size={12} />
                Listed in the directory
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700">
                <Lock size={12} />
                Not listed
              </span>
            )}
            <span className="text-sm text-slate-500">
              {profile.publication.isPublished
                ? 'Participants can find you when they browse.'
                : 'Only you can see it.'}
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mt-4">
            {profile.publication.isPublished
              ? 'Anything you change on your profile appears in the directory straight away. You can take it down whenever you like — nothing you have written is lost.'
              : 'Publishing is optional and never affects your workspace. Your logs, calendar and resources work exactly the same either way.'}
          </p>

          <ul className="flex flex-col gap-2 mt-4">
            {profile.readiness.steps.map((step) => (
              <li key={step.key} className="flex items-start gap-2 text-sm">
                <span
                  className={`w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[9px] font-bold ${
                    step.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {step.done ? '✓' : ''}
                </span>
                <span className="text-slate-700">
                  {step.label}
                  {step.required && !step.done && (
                    <span className="text-xs text-amber-700"> — needed to publish</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          {publish.error && (
            <p className="flex items-start gap-1.5 text-xs text-amber-800 bg-amber-50 rounded-lg px-3 py-2 mt-3">
              <CircleAlert size={12} className="shrink-0 mt-0.5" />
              {publish.error.message}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              type="button"
              onClick={() => navigate(WORKER_PATHS.profile)}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-6 py-3 hover:bg-slate-50 transition-colors"
            >
              <PencilLine size={15} />
              {profile.readiness.steps[0].done ? 'Edit my profile' : 'Write my profile'}
            </button>

            {profile.publication.isPublished ? (
              <button
                type="button"
                onClick={() => unpublish.mutate()}
                disabled={unpublish.isPending}
                className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-6 py-3 hover:bg-slate-50 transition-colors disabled:opacity-60"
              >
                {unpublish.isPending ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  <Undo2 size={15} />
                )}
                Take my profile down
              </button>
            ) : (
              <button
                type="button"
                onClick={() => publish.mutate()}
                disabled={publish.isPending || !profile.readiness.canPublish}
                title={
                  profile.readiness.canPublish
                    ? undefined
                    : 'Finish the steps above on your profile page first'
                }
                className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 shadow-md hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publish.isPending ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                Publish my profile
              </button>
            )}

            {profile.publication.isPublished && (
              <a
                href={`/participant/browse-workers/${profile.workerId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-brand-700 hover:underline"
              >
                <ExternalLink size={14} />
                See my public profile
              </a>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-4">{profile.contactNotice}</p>
        </>
      )}
    </section>
  );
}

export default function WorkerSettings() {
  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl">
          Your account, your directory profile, and how TMG180 contacts you.
        </p>
      </div>

      <AccountDetails />
      <ProfileCard />

      <section className={CARD}>
        <CardHeader
          icon={Bell}
          tone="bg-purple-50 text-brand-600"
          title="Notifications"
          sub="TMG180 doesn't send any of these yet — the settings arrive with them."
        />
        <div className="divide-y divide-slate-100">
          <NotYet
            label="Email updates"
            description="A summary of the support you have logged."
          />
          <NotYet
            label="Reminders"
            description="A nudge when a support session has no log yet."
          />
          <NotYet
            label="Snapshot access"
            description="When a participant approves a monthly snapshot you can see."
          />
        </div>
      </section>

      <section className={CARD}>
        <CardHeader
          icon={Shield}
          tone="bg-rose-50 text-rose-600"
          title="Security & privacy"
          sub="How your account is protected."
        />
        <div className="divide-y divide-slate-100">
          <div className="flex items-start justify-between gap-4 py-2.5">
            <div>
              <p className="text-sm font-medium text-slate-800">Password</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Reset it from the sign-in screen — we email you a link. Changing it from inside
                your workspace is not built yet.
              </p>
            </div>
          </div>
          <NotYet
            label="Two-factor authentication"
            description="An extra step at sign-in. Part of the security pass that is still to come."
          />
          <NotYet
            label="Active sessions"
            description="Signing out ends this device's session everywhere. Listing and ending other sessions individually is not built yet."
          />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mt-4">
          Your logs and private notes are yours. Participants control their own records, and you
          see them only while their consent is active.
        </p>
      </section>
    </div>
  );
}
