import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Heart,
  Info,
  Languages,
  LoaderCircle,
  Mail,
  ShieldCheck,
  Star,
  TriangleAlert,
  UserX,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AVAILABILITY_PERIODS, CREDENTIAL_STATUS, WORKER_PROFILE_PROMPTS } from '@tmg180/shared';
import { formatMonthYear } from '../../lib/dates';
import { useDirectoryWorker } from '../../hooks/participant/directory';
import { PARTICIPANT_PATHS } from '../../routes/paths';

/**
 * Relational Worker Profile (Figma v2 3239:95 — "corrected, F-1..F-4
 * applied"), on the participant UI scale.
 *
 * The read view of what a worker authors: identity (name, Active, the
 * Relational Worker / location / experience chips, the one-line
 * philosophy), then the relational content in the frame's order — A little
 * about me (+ Natural Support Style, + Where I do my best support work),
 * Best Working Relationship, Interests, Communication, What I bring to
 * support — and only then the supporting details: weekly availability (R-04:
 * this page and nowhere else), support areas and languages, how to get in
 * touch, credentials, and the non-coordination notice. "What I bring to
 * support" is the worker's own words about themselves, never feedback.
 *
 * A profile that is not (or no longer) published is a 404 from the API and
 * reads as "not listed" here — the directory never knows about unlisted
 * workers.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';
const H2 = 'text-xl font-semibold';
const prompt = (key) => WORKER_PROFILE_PROMPTS.find((p) => p.key === key);

const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

function Chip({ children, tone = 'purple' }) {
  const tones = {
    purple: 'bg-brand-100 text-brand-700',
    slate: 'bg-slate-100 text-slate-700',
    green: 'bg-emerald-50 text-emerald-800',
  };
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tones[tone]}`}>{children}</span>;
}

function Empty({ children }) {
  return <p className="text-sm text-slate-400 italic">{children}</p>;
}

function AvailabilityGrid({ days }) {
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-[2.5rem_repeat(7,minmax(3.25rem,1fr))] gap-2 items-center min-w-120">
        <span />
        {days.map((day) => (
          <span
            key={day.day}
            className={`text-center text-[10px] uppercase tracking-wide font-semibold ${
              day.weekend ? 'text-amber-600' : 'text-slate-400'
            }`}
          >
            {day.label}
          </span>
        ))}
        {AVAILABILITY_PERIODS.map((period) => (
          <div key={period.key} className="contents">
            <span className="text-xs font-semibold text-slate-700">{period.label}</span>
            {days.map((day) => {
              const on = day.slots[period.key];
              return (
                <span
                  key={`${day.day}-${period.key}`}
                  role="img"
                  aria-label={`${day.label} ${period.label}: ${on ? 'available' : 'not available'}`}
                  className={`h-8 rounded-lg border ${
                    on ? 'bg-emerald-50 border-emerald-600' : 'bg-slate-100 border-transparent'
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/** "Verified July 2023" / "Expires Dec 2025" / "Expired …" — what a participant should know. */
function credentialDetail(credential) {
  const parts = [];
  if (credential.verifiedAt) parts.push(`Verified ${formatMonthYear(credential.verifiedAt)}`);
  if (credential.expiresAt) {
    parts.push(
      `${credential.status === CREDENTIAL_STATUS.EXPIRED ? 'Expired' : 'Expires'} ${formatMonthYear(credential.expiresAt)}`
    );
  } else if (!credential.verifiedAt && credential.issuedAt) {
    parts.push(`Issued ${formatMonthYear(credential.issuedAt)}`);
  }
  const attention =
    credential.status === CREDENTIAL_STATUS.EXPIRED || credential.status === CREDENTIAL_STATUS.DUE_SOON;
  return { text: parts.join(' · '), tone: attention ? 'text-amber-700' : 'text-emerald-700' };
}

export default function RelationalWorkerProfile() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const { data: worker, isLoading, error } = useDirectoryWorker(workerId);

  const back = (
    <button
      onClick={() => navigate(PARTICIPANT_PATHS.browseWorkers)}
      className="inline-flex items-center gap-2 text-sm text-brand-700 hover:underline self-start"
    >
      <ArrowLeft size={15} />
      Back to directory
    </button>
  );

  if (isLoading) {
    return (
      <div className="max-w-238 mx-auto flex flex-col gap-6">
        {back}
        <div className="flex items-center gap-3 text-slate-500 bg-white/80 rounded-xl p-6">
          <LoaderCircle size={18} className="animate-spin" />
          Loading this profile…
        </div>
      </div>
    );
  }

  if (error?.status === 404) {
    return (
      <div className="max-w-238 mx-auto flex flex-col gap-6">
        {back}
        <div className="bg-white/80 rounded-xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <UserX size={26} />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mt-6">This profile isn&rsquo;t listed</h1>
          <p className="text-base text-slate-600 mt-2 max-w-md mx-auto">
            The worker may have taken their profile out of the directory. Only profiles a worker
            has chosen to publish can be viewed here.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-238 mx-auto flex flex-col gap-6">
        {back}
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn&rsquo;t load this profile.</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!worker) return null;

  const r = worker.relational;
  const details = worker.supportingDetails;
  const firstName = worker.name.split(' ')[0];
  const chips = ['Relational Worker', worker.location, worker.experienceLabel].filter(Boolean);

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      {back}

      {/* identity */}
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <div className="w-20 h-20 rounded-full bg-brand-100 ring-4 ring-white text-brand-700 flex items-center justify-center text-2xl font-semibold shrink-0">
          {initialsOf(worker.name)}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-brand-700">{worker.name}</h1>
            {worker.active && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                <BadgeCheck size={12} />
                Active
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {chips.map((chip) => (
              <Chip key={chip} tone="slate">
                {chip}
              </Chip>
            ))}
          </div>
          {worker.philosophy && (
            <p className="text-base text-slate-600 leading-relaxed mt-3 max-w-2xl">
              &ldquo;{worker.philosophy}&rdquo;
            </p>
          )}
        </div>
      </div>

      {worker.consent?.active && (
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-4">
          <ShieldCheck size={16} className="text-emerald-700 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-700 leading-relaxed">
            You currently share access with {firstName}.{' '}
            <button
              onClick={() => navigate(PARTICIPANT_PATHS.privacySharing)}
              className="text-brand-700 font-semibold hover:underline"
            >
              Review it in Privacy &amp; Sharing
            </button>
          </p>
        </div>
      )}

      {/* relational content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
        <div className="flex flex-col gap-6">
          <section className={CARD}>
            <h2 className={`${H2} text-brand-700`}>{prompt('relational_intro').readLabel}</h2>
            {r.relational_intro ? (
              <p className="text-base text-slate-600 leading-relaxed mt-3 whitespace-pre-line">
                {r.relational_intro}
              </p>
            ) : (
              <div className="mt-3">
                <Empty>{firstName} hasn&rsquo;t written an introduction yet.</Empty>
              </div>
            )}
            {r.natural_support_style && (
              <div className="bg-slate-50 rounded-xl p-4 mt-5">
                <p className="text-sm font-semibold text-slate-900">
                  {prompt('natural_support_style').readLabel}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mt-1 whitespace-pre-line">
                  {r.natural_support_style}
                </p>
              </div>
            )}
            {r.preferred_environments && (
              <div className="bg-slate-50 rounded-xl p-4 mt-3">
                <p className="text-sm font-semibold text-slate-900">
                  {prompt('preferred_environments').readLabel}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mt-1 whitespace-pre-line">
                  {r.preferred_environments}
                </p>
              </div>
            )}
          </section>

          <section className={`${CARD} border border-brand-600`}>
            <div className="flex items-center gap-2">
              <Heart size={18} className="text-brand-600" />
              <h2 className={`${H2} text-brand-700`}>{prompt('boundaries_and_fit').readLabel}</h2>
            </div>
            {r.boundaries_and_fit ? (
              <p className="text-base text-slate-600 leading-relaxed mt-3 whitespace-pre-line">
                {r.boundaries_and_fit}
              </p>
            ) : (
              <div className="mt-3">
                <Empty>Not shared yet.</Empty>
              </div>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className={CARD}>
            <h2 className={`${H2} text-brand-700`}>{prompt('interests').readLabel}</h2>
            {r.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {r.interests.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            ) : (
              <div className="mt-3">
                <Empty>Not shared yet.</Empty>
              </div>
            )}
          </section>

          <section className={CARD}>
            <h2 className={`${H2} text-brand-700`}>{prompt('communication_style').readLabel}</h2>
            {r.communication_style.length > 0 ? (
              <ul className="flex flex-col gap-2.5 mt-3">
                {r.communication_style.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3">
                <Empty>Not shared yet.</Empty>
              </div>
            )}
          </section>

          <section className={`${CARD} border border-emerald-700`}>
            <div className="flex items-center gap-2">
              <Star size={18} className="text-emerald-700" />
              <h2 className={`${H2} text-emerald-800`}>{prompt('participants_appreciate').readLabel}</h2>
            </div>
            {r.participants_appreciate.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {r.participants_appreciate.map((item) => (
                  <Chip key={item} tone="green">
                    {item}
                  </Chip>
                ))}
              </div>
            ) : (
              <div className="mt-3">
                <Empty>Not shared yet.</Empty>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-3">In {firstName}&rsquo;s own words — not ratings or reviews.</p>
          </section>
        </div>
      </div>

      {/* supporting details */}
      <section className={CARD}>
        <div className="flex items-center gap-2">
          <CalendarDays size={18} className="text-slate-700" />
          <h2 className={`${H2} text-slate-900`}>Weekly Availability</h2>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          A general pattern — you arrange times directly with {firstName}.
        </p>
        <div className="mt-4">
          {details.availabilitySet ? (
            <AvailabilityGrid days={details.availability} />
          ) : (
            <Empty>{firstName} hasn&rsquo;t shared a weekly pattern yet.</Empty>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <section className={CARD}>
          <h2 className={`${H2} text-slate-900`}>Support areas &amp; languages</h2>
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mt-4">Support areas</p>
          {details.supportAreas.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {details.supportAreas.map((area) => (
                <Chip key={area.key}>{area.label}</Chip>
              ))}
            </div>
          ) : (
            <div className="mt-2">
              <Empty>Not listed yet.</Empty>
            </div>
          )}
          <p className="text-[10px] uppercase tracking-wide text-slate-400 mt-5">Languages</p>
          {details.languages.length > 0 ? (
            <p className="flex items-center gap-2 text-sm text-slate-700 mt-2">
              <Languages size={15} className="text-slate-400" />
              {details.languages.join(', ')}
            </p>
          ) : (
            <div className="mt-2">
              <Empty>Not listed yet.</Empty>
            </div>
          )}
          {worker.relationalTags?.length > 0 && (
            <>
              <p className="text-[10px] uppercase tracking-wide text-slate-400 mt-5">Relational style</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {worker.relationalTags.map((tag) => (
                  <Chip key={tag} tone="slate">
                    {tag}
                  </Chip>
                ))}
              </div>
            </>
          )}
        </section>

        <section className={CARD}>
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-slate-700" />
            <h2 className={`${H2} text-slate-900`}>Getting in touch</h2>
          </div>
          {details.contactPreference ? (
            <p className="text-base text-slate-700 leading-relaxed mt-3 whitespace-pre-line">
              {details.contactPreference}
            </p>
          ) : (
            <div className="mt-3">
              <Empty>{firstName} hasn&rsquo;t added a preferred contact method yet.</Empty>
            </div>
          )}
          <p className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed mt-4">
            <Info size={13} className="shrink-0 mt-0.5" />
            {worker.contactNotice}
          </p>
        </section>
      </div>

      <section className={CARD}>
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-slate-700" />
          <h2 className={`${H2} text-slate-900`}>Credentials</h2>
        </div>
        {worker.credentials.length > 0 ? (
          <ul className="flex flex-col gap-3 mt-4">
            {worker.credentials.map((credential) => {
              const detail = credentialDetail(credential);
              return (
                <li key={credential.type} className="flex items-center gap-4">
                  <span className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck size={17} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{credential.label}</p>
                    {detail.text && <p className={`text-xs ${detail.tone} mt-0.5`}>{detail.text}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-4">
            <Empty>No credentials listed yet.</Empty>
          </div>
        )}
        <p className="text-xs text-slate-500 mt-4">
          Dates are recorded by the worker. &ldquo;Verified&rdquo; means TMG180 has checked the document.
        </p>
      </section>

      <div className="bg-white/80 rounded-xl px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <p className="text-sm text-slate-600 text-center leading-relaxed">{worker.contactNotice}</p>
      </div>
    </div>
  );
}
