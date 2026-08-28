import { useForm } from 'react-hook-form';
import {
  BadgeCheck,
  CircleAlert,
  Eye,
  Globe,
  Info,
  LoaderCircle,
  MapPin,
  Save,
  Send,
  TriangleAlert,
  Undo2,
} from 'lucide-react';
import {
  AVAILABILITY_DAYS,
  AVAILABILITY_PERIODS,
  RELATIONAL_TAGS,
  SUPPORT_AREAS,
  WORKER_PROFILE_LIMITS,
  WORKER_PROFILE_PROMPTS,
  experienceLabel,
} from '@tmg180/shared';
import Select from '../../components/ui/Select';
import {
  usePublishProfile,
  useSaveWorkerProfile,
  useUnpublishProfile,
  useWorkerProfile,
} from '../../hooks/worker/profile';

/**
 * Worker Profile & Availability (Figma `1170:8069`) — where a worker writes
 * the profile participants read in the directory, and publishes it.
 *
 * The frame's "Short Bio / Experience Summary" pair is replaced by the seven
 * relational prompts, which are the Override contract (P3-01/P3-02, brief
 * decision 1): the worker introduces themselves as a person, and the résumé
 * details (support areas, availability, location, languages, experience) sit
 * below as supporting content. The frame's availability checkboxes are
 * replaced by the design system's AM/PM × Mon–Sun grid (`3233:59`) because
 * that is the shape the read view renders.
 *
 * Publishing is R-07: workspace access is never gated on any of this, and a
 * profile lists only when the worker has written their introduction and
 * explicitly opted in. The rail says which of those is outstanding rather
 * than disabling the button with no explanation.
 *
 * Prompt helper texts are provisional — the seed bundle that carries the
 * approved wording has never reached this repo (Sue to sign off).
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';
const FIELD =
  'w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-colors';

function SectionTitle({ title, sub }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      {sub && <p className="text-sm text-slate-600 mt-1">{sub}</p>}
    </div>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-rose-700 mt-1.5">
      <CircleAlert size={12} />
      {message}
    </p>
  );
}

/** A fixed-vocabulary chip row — support areas, relational tags. */
function ChipPicker({ options, selected, onToggle, idOf = (o) => o, labelOf = (o) => o }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const id = idOf(option);
        const on = selected.includes(id);
        return (
          <button
            key={id}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(id)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
              on
                ? 'bg-brand-600 border-brand-600 text-white font-medium'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {labelOf(option)}
          </button>
        );
      })}
    </div>
  );
}

/** The AM/PM × Mon–Sun grid the participant's profile view renders. */
function AvailabilityPicker({ slots, onToggle }) {
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-[2.5rem_repeat(7,minmax(3.25rem,1fr))] gap-2 items-center min-w-120">
        <span />
        {AVAILABILITY_DAYS.map((day) => (
          <span
            key={day.key}
            className={`text-center text-[10px] uppercase tracking-wide font-semibold ${
              day.weekend ? 'text-amber-600' : 'text-slate-400'
            }`}
          >
            {day.short}
          </span>
        ))}
        {AVAILABILITY_PERIODS.map((period) => (
          <div key={period.key} className="contents">
            <span className="text-xs font-semibold text-slate-700">{period.label}</span>
            {AVAILABILITY_DAYS.map((day) => {
              const slot = `${day.key}_${period.key}`;
              const on = slots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  aria-pressed={on}
                  aria-label={`${day.label} ${period.label}`}
                  onClick={() => onToggle(slot)}
                  className={`h-9 rounded-lg border transition-colors ${
                    on
                      ? 'bg-emerald-50 border-emerald-600'
                      : 'bg-slate-100 border-transparent hover:border-slate-300'
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

/** Free-text phrases the worker writes themselves — no fixed vocabulary. */
function PhraseInput({ id, value, onChange, placeholder }) {
  return (
    <Select
      inputId={id}
      look="box"
      creatable
      isMulti
      value={(value ?? []).map((item) => ({ value: item, label: item }))}
      onChange={(options) => onChange((options ?? []).map((option) => option.value))}
      options={[]}
      placeholder={placeholder}
      noOptionsMessage={() => 'Type a phrase and press Enter to add it.'}
      formatCreateLabel={(input) => `Add “${input}”`}
    />
  );
}

export default function WorkerProfile() {
  const { data: profile, isLoading, error } = useWorkerProfile();
  const save = useSaveWorkerProfile();
  const publish = usePublishProfile();
  const unpublish = useUnpublishProfile();

  const form = useForm({
    // keepDirtyValues stops a background refetch wiping what someone is
    // mid-typing — but it also keeps those fields flagged dirty after they are
    // saved, so onSave re-baselines the form on the server's answer.
    values: profile?.fields,
    resetOptions: { keepDirtyValues: true },
  });
  const { register, handleSubmit, reset, watch, setValue, formState } = form;
  const values = watch();

  const serverErrors = save.error?.status === 400 ? (save.error.data ?? {}) : {};
  const errorFor = (key) => formState.errors?.[key]?.message ?? serverErrors[key];

  const toggleIn = (key, item) => {
    const current = values[key] ?? [];
    setValue(key, current.includes(item) ? current.filter((v) => v !== item) : [...current, item], {
      shouldDirty: true,
    });
  };
  const setList = (key, list) => setValue(key, list, { shouldDirty: true });

  const onSave = handleSubmit((fields) =>
    save.mutate(
      {
        ...fields,
        experienceYears:
          fields.experienceYears === '' || fields.experienceYears === null
            ? null
            : Number(fields.experienceYears),
      },
      // What was saved is no longer unsaved: clear the dirty flags against the
      // stored values, so "Publish profile" enables without a page reload.
      { onSuccess: (fresh) => reset(fresh.fields) }
    )
  );

  if (isLoading) {
    return (
      <div className="max-w-238 mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-3 text-slate-500 bg-white/80 rounded-xl p-6">
          <LoaderCircle size={18} className="animate-spin" />
          Loading your profile…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-238 mx-auto flex flex-col gap-6">
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn&rsquo;t load your profile.</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const published = profile.publication.isPublished;
  const readiness = profile.readiness;
  const publishError = publish.error?.data?.reason === 'not_ready' ? publish.error : null;
  const previewName = values.displayName?.trim() || profile.accountName;
  const previewAreas = SUPPORT_AREAS.filter((area) => (values.supportAreas ?? []).includes(area.key));
  const previewMeta = [
    'Relational Worker',
    values.locationArea,
    experienceLabel(values.experienceYears),
  ].filter(Boolean);

  return (
    <form onSubmit={onSave} className="max-w-238 mx-auto flex flex-col gap-6">
      {/* R-07 pill — approved copy, v2 3240:126 */}
      {!published && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-5 py-3">
          <span className="w-2 h-2 rounded-full bg-amber-600 mt-2 shrink-0" />
          <p className="text-sm text-amber-800">
            Complete onboarding to publish your profile to the directory — optional.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Worker Profile &amp; Availability</h1>
          <p className="text-base text-slate-600 mt-2 max-w-2xl">
            Update the information participants can see when they browse the directory. Nothing
            here is shared until you publish, and your workspace works either way.
          </p>
        </div>
        {published && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 shrink-0">
            <BadgeCheck size={12} />
            Listed in the directory
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-6 items-start">
        <div className="flex flex-col gap-6">
          {/* Identity ------------------------------------------------- */}
          <section className={CARD}>
            <SectionTitle
              title="How you appear"
              sub="The name and one line participants see first."
            />
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="displayName" className="block text-sm text-slate-600 mb-2">
                  Display name
                </label>
                <input
                  id="displayName"
                  {...register('displayName')}
                  placeholder={profile.accountName}
                  className={FIELD}
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  Leave this empty to use your account name, {profile.accountName}.
                </p>
                <FieldError message={errorFor('displayName')} />
              </div>
              <div>
                <label htmlFor="supportPhilosophy" className="block text-sm text-slate-600 mb-2">
                  Your support in one line
                </label>
                <input
                  id="supportPhilosophy"
                  {...register('supportPhilosophy')}
                  maxLength={WORKER_PROFILE_LIMITS.maxPhilosophy}
                  placeholder="e.g. Great support starts with listening."
                  className={FIELD}
                />
                <FieldError message={errorFor('supportPhilosophy')} />
              </div>
            </div>
          </section>

          {/* The seven prompts ---------------------------------------- */}
          <section className={CARD}>
            <SectionTitle
              title="About you"
              sub="Participants choose a working relationship, so these come first. Answer the ones you want to — you can add the rest later."
            />
            <div className="flex flex-col gap-5">
              {WORKER_PROFILE_PROMPTS.map((prompt) => (
                <div key={prompt.key}>
                  <label htmlFor={prompt.key} className="block text-sm font-medium text-slate-800">
                    {prompt.label}
                  </label>
                  <p className="text-xs text-slate-500 mt-0.5 mb-2">{prompt.helper}</p>
                  {prompt.kind === 'text' ? (
                    <textarea
                      id={prompt.key}
                      rows={prompt.key === 'relational_intro' ? 5 : 3}
                      {...register(prompt.key)}
                      maxLength={WORKER_PROFILE_LIMITS.maxText}
                      className={`${FIELD} resize-y`}
                    />
                  ) : (
                    <PhraseInput
                      id={prompt.key}
                      value={values[prompt.key]}
                      onChange={(list) => setList(prompt.key, list)}
                      placeholder="Type a phrase and press Enter…"
                    />
                  )}
                  <FieldError message={errorFor(prompt.key)} />
                </div>
              ))}
            </div>
          </section>

          {/* Supporting details --------------------------------------- */}
          <section className={CARD}>
            <SectionTitle
              title="Support areas"
              sub="The areas where you offer support. Participants filter the directory by these."
            />
            <ChipPicker
              options={SUPPORT_AREAS}
              selected={values.supportAreas ?? []}
              onToggle={(key) => toggleIn('supportAreas', key)}
              idOf={(area) => area.key}
              labelOf={(area) => area.label}
            />
            <FieldError message={errorFor('supportAreas')} />
          </section>

          <section className={CARD}>
            <SectionTitle
              title="Relational tags"
              sub="Words that describe your approach. Participants use the same list to say what they are looking for."
            />
            <ChipPicker
              options={RELATIONAL_TAGS}
              selected={values.valuesTags ?? []}
              onToggle={(tag) => toggleIn('valuesTags', tag)}
            />
            <FieldError message={errorFor('valuesTags')} />
          </section>

          <section className={CARD}>
            <SectionTitle
              title="General availability"
              sub="A rough pattern, not a booking calendar — participants arrange times with you directly. This shows on your profile only, never in the directory list."
            />
            <AvailabilityPicker
              slots={values.availability ?? []}
              onToggle={(slot) => toggleIn('availability', slot)}
            />
            <FieldError message={errorFor('availability')} />
          </section>

          <section className={CARD}>
            <SectionTitle title="Logistics &amp; contact" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="locationArea" className="block text-sm text-slate-600 mb-2">
                  Location / area
                </label>
                <div className="relative">
                  <MapPin
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="locationArea"
                    {...register('locationArea')}
                    placeholder="e.g. Richmond, VIC"
                    className={`${FIELD} pl-10`}
                  />
                </div>
                <FieldError message={errorFor('locationArea')} />
              </div>
              <div>
                <label htmlFor="experienceYears" className="block text-sm text-slate-600 mb-2">
                  Years of experience
                </label>
                <input
                  id="experienceYears"
                  type="number"
                  min={0}
                  max={WORKER_PROFILE_LIMITS.maxExperienceYears}
                  {...register('experienceYears')}
                  placeholder="e.g. 5"
                  className={FIELD}
                />
                <FieldError message={errorFor('experienceYears')} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="languages" className="block text-sm text-slate-600 mb-2">
                  Languages you speak
                </label>
                <PhraseInput
                  id="languages"
                  value={values.languages}
                  onChange={(list) => setList('languages', list)}
                  placeholder="e.g. English, Arabic…"
                />
                <FieldError message={errorFor('languages')} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="contactPreference" className="block text-sm text-slate-600 mb-2">
                  How you prefer to be contacted
                </label>
                <textarea
                  id="contactPreference"
                  rows={2}
                  {...register('contactPreference')}
                  maxLength={WORKER_PROFILE_LIMITS.maxContact}
                  placeholder="e.g. Email me at name@example.com — I reply within a day."
                  className={`${FIELD} resize-y`}
                />
                <p className="flex items-start gap-1.5 text-xs text-slate-500 mt-1.5">
                  <Info size={12} className="shrink-0 mt-0.5" />
                  {profile.contactNotice}
                </p>
                <FieldError message={errorFor('contactPreference')} />
              </div>
            </div>
          </section>
        </div>

        {/* Rail ------------------------------------------------------- */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-22">
          <section className={CARD}>
            <p className="text-[10px] uppercase tracking-wide text-slate-400">Directory preview</p>
            <div className="flex items-start gap-3 mt-3">
              <div className="w-11 h-11 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold shrink-0">
                {previewName
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join('')}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brand-700 truncate">{previewName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{previewMeta.join(' · ')}</p>
              </div>
            </div>
            {values.supportPhilosophy && (
              <p className="text-sm text-slate-600 leading-relaxed mt-3">
                &ldquo;{values.supportPhilosophy}&rdquo;
              </p>
            )}
            {previewAreas.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {previewAreas.map((area) => (
                  <span
                    key={area.key}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-100 text-brand-700"
                  >
                    {area.label}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-slate-500 mt-4">
              This is the card participants see. Your availability and credentials show on the
              full profile, never in the list.
            </p>
          </section>

          <section className={CARD}>
            <p className="text-sm font-semibold text-slate-900">
              {published ? 'Your profile is listed' : 'Publishing'}
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {published
                ? 'Participants can find you in the directory. Edits show there straight away.'
                : 'Publishing is your choice, and you can take your profile down at any time.'}
            </p>

            <ul className="flex flex-col gap-2 mt-4">
              {readiness.steps.map((step) => (
                <li key={step.key} className="flex items-start gap-2 text-sm">
                  <span
                    className={`w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[9px] font-bold ${
                      step.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {step.done ? '✓' : ''}
                  </span>
                  <span className={step.done ? 'text-slate-600' : 'text-slate-700'}>
                    {step.label}
                    {step.required && !step.done && (
                      <span className="text-xs text-amber-700"> — needed to publish</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <label className="flex items-start gap-2.5 mt-4 cursor-pointer">
              <input
                type="checkbox"
                {...register('optIn')}
                className="mt-0.5 w-4 h-4 accent-[#0a7a52]"
              />
              <span className="text-sm text-slate-700">
                List my profile in the participant directory
              </span>
            </label>
            <p className="text-xs text-slate-500 mt-1.5 pl-6.5">
              Save your changes to apply this. Turning it off takes a listed profile down.
            </p>

            {publishError && (
              <p className="flex items-start gap-1.5 text-xs text-amber-800 bg-amber-50 rounded-lg px-3 py-2 mt-3">
                <CircleAlert size={12} className="shrink-0 mt-0.5" />
                {publishError.message}
              </p>
            )}
            {save.error && !Object.keys(serverErrors).length && (
              <p className="text-xs text-rose-700 mt-3">{save.error.message}</p>
            )}
            {save.isSuccess && !formState.isDirty && (
              <p className="text-xs text-emerald-700 mt-3">Saved.</p>
            )}

            <div className="flex flex-col gap-2 mt-4">
              <button
                type="submit"
                disabled={save.isPending}
                className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-6 py-3 hover:bg-slate-50 transition-colors disabled:opacity-60"
              >
                {save.isPending ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}
                Save changes
              </button>

              {published ? (
                <button
                  type="button"
                  onClick={() => unpublish.mutate()}
                  disabled={unpublish.isPending}
                  className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-6 py-3 hover:bg-slate-50 transition-colors disabled:opacity-60"
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
                  disabled={publish.isPending || !readiness.canPublish || formState.isDirty}
                  title={
                    formState.isDirty
                      ? 'Save your changes first'
                      : readiness.canPublish
                        ? undefined
                        : 'Write your introduction and tick the directory box first'
                  }
                  className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 shadow-md hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {publish.isPending ? (
                    <LoaderCircle size={15} className="animate-spin" />
                  ) : (
                    <Send size={15} />
                  )}
                  Publish profile
                </button>
              )}
            </div>

            {formState.isDirty && (
              <p className="text-xs text-slate-500 mt-2">You have unsaved changes.</p>
            )}
          </section>

          <section className={CARD}>
            <p className="text-sm font-semibold text-slate-900">Credentials</p>
            {profile.credentials.length > 0 ? (
              <ul className="flex flex-col gap-1.5 mt-2">
                {profile.credentials.map((credential) => (
                  <li key={credential.type} className="flex items-center gap-2 text-sm text-slate-600">
                    <BadgeCheck size={13} className="text-emerald-600 shrink-0" />
                    {credential.label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 mt-2">
                Nothing recorded yet. Credentials you record in Governance Standing show on your
                published profile.
              </p>
            )}
          </section>

          <p className="flex items-start gap-2 text-xs text-slate-500 px-1">
            <Eye size={13} className="shrink-0 mt-0.5" />
            <span>
              Only what is on this page is shared. Your logs, your private notes and the
              participants you support are never part of your profile.
            </span>
          </p>
          <p className="flex items-start gap-2 text-xs text-slate-500 px-1">
            <Globe size={13} className="shrink-0 mt-0.5" />
            <span>{profile.contactNotice}</span>
          </p>
        </aside>
      </div>
    </form>
  );
}
