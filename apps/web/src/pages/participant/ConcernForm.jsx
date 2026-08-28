import { useEffect } from 'react';
import { Info, ListChecks, SendHorizontal, TriangleAlert, X } from 'lucide-react';
import {
  CONCERN_CATEGORIES,
  CONCERN_HANDLING_STEPS,
  CONCERN_KINDS,
  CONCERN_LIMITS,
  CONCERN_PLATFORM_LIMITS,
  CONCERN_RELATES_TO,
} from '@tmg180/shared';
import { useConcernForm } from '../../hooks/participant/concerns';
import { ConcernSafeguards } from './ConcernList';

/**
 * Raise a concern — the form (Mandatory Policy 2, "Making a Complaint or
 * Providing Feedback").
 *
 * Three choices and a box. The choices are the policy's own lists; the box is
 * the participant's words, and the policy is explicit about them: "No one is
 * required to use legal language or formal wording." So the words are checked
 * for presence and never for form. There is no draft — a concern is received
 * the moment it is sent.
 *
 * What is *not* here, and why: response timeframes. The register (23 Aug
 * 2026) puts the incidents taxonomy and its statutory clocks before the M-05
 * build, and neither has been delivered. The screen says so rather than
 * promising a number nobody has set.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-2 text-sm text-[#ba1a1a] flex items-center gap-1.5">
      <TriangleAlert size={13} className="shrink-0" />
      {message}
    </p>
  );
}

function Choice({ selected, onClick, label, description }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`w-full text-left rounded-2xl px-4 py-3 transition-colors ${
        selected ? 'bg-[#007a53] text-white shadow-sm' : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e0e9ff]'
      }`}
    >
      <span className="block text-sm font-semibold">{label}</span>
      {description && (
        <span className={`block text-xs mt-1 leading-relaxed ${selected ? 'text-white/85' : 'text-[#4d4354]'}`}>
          {description}
        </span>
      )}
    </button>
  );
}

function Chip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`px-4 py-2.25 rounded-full text-sm text-left transition-colors ${
        selected ? 'bg-[#007a53] text-white shadow-sm' : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e0e9ff]'
      }`}
    >
      {children}
    </button>
  );
}

export default function ConcernForm() {
  const { form, isSaving, error, submit, cancel } = useConcernForm();
  const { register, watch, setValue, clearErrors, formState } = form;
  const errors = formState.errors;

  const kind = watch('kind');
  const category = watch('category');
  const relatesTo = watch('relatesTo');

  // A rule error clears the moment it is satisfied.
  useEffect(() => {
    if (kind) clearErrors('kind');
    if (category) clearErrors('category');
    if (relatesTo) clearErrors('relatesTo');
  }, [kind, category, relatesTo, clearErrors]);

  const choose = (field, value) => setValue(field, value, { shouldDirty: true });

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6 pb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Raise a concern</h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl">
          In your own words. You do not need to use legal language or formal wording, and you
          do not need to know whose issue it is — that is worked out after, not by you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="flex flex-col gap-6">
          <section className={CARD}>
            <h2 className="text-lg font-semibold text-slate-900">What is this?</h2>
            <div className="mt-4 flex flex-col gap-2">
              {CONCERN_KINDS.map((option) => (
                <Choice
                  key={option.key}
                  selected={kind === option.key}
                  onClick={() => choose('kind', option.key)}
                  label={option.label}
                  description={option.description}
                />
              ))}
            </div>
            <FieldError message={errors.kind?.message} />
          </section>

          <section className={CARD}>
            <h2 className="text-lg font-semibold text-slate-900">What is it about?</h2>
            <p className="text-sm text-slate-600 mt-1">Choose the closest one.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {CONCERN_CATEGORIES.map((option) => (
                <Chip
                  key={option.key}
                  selected={category === option.key}
                  onClick={() => choose('category', option.key)}
                >
                  {option.label}
                </Chip>
              ))}
            </div>
            <FieldError message={errors.category?.message} />
          </section>

          <section className={CARD}>
            <h2 className="text-lg font-semibold text-slate-900">Who or what does it relate to?</h2>
            <div className="mt-4 flex flex-col gap-2">
              {CONCERN_RELATES_TO.map((option) => (
                <Choice
                  key={option.key}
                  selected={relatesTo === option.key}
                  onClick={() => choose('relatesTo', option.key)}
                  label={option.label}
                  description={option.description}
                />
              ))}
            </div>
            <FieldError message={errors.relatesTo?.message} />

            <div className="mt-5">
              <label className="block text-sm text-[#4d4354]" htmlFor="about">
                Who or what is this about? <span className="text-slate-400">(optional)</span>
              </label>
              <input
                id="about"
                type="text"
                maxLength={CONCERN_LIMITS.maxAbout}
                placeholder="A worker's name, a screen, a policy…"
                {...register('about')}
                className="mt-2 w-full h-12.5 rounded-full bg-white border border-[#e5eeff] px-4 text-base text-[#0b1c30] placeholder:text-[#8c8a94] focus:outline-none focus:border-[#005f40]"
              />
              <FieldError message={errors.about?.message} />
            </div>
          </section>

          <section className={CARD}>
            <h2 className="text-lg font-semibold text-slate-900">What happened, or what you want understood</h2>
            <textarea
              id="description"
              rows={7}
              placeholder="Tell it the way you would tell someone you trust."
              {...register('description')}
              className="mt-4 w-full rounded-2xl bg-white border border-[#e5eeff] px-4 py-3 text-base text-[#0b1c30] placeholder:text-[#8c8a94] focus:outline-none focus:border-[#005f40]"
            />
            <FieldError message={errors.description?.message} />

            <label className="block text-sm text-[#4d4354] mt-5" htmlFor="whatWouldHelp">
              What would help, if you know? <span className="text-slate-400">(optional)</span>
            </label>
            <textarea
              id="whatWouldHelp"
              rows={3}
              placeholder="Optional"
              {...register('whatWouldHelp')}
              className="mt-2 w-full rounded-2xl bg-white border border-[#e5eeff] px-4 py-3 text-base text-[#0b1c30] placeholder:text-[#8c8a94] focus:outline-none focus:border-[#005f40]"
            />
            <FieldError message={errors.whatWouldHelp?.message} />
          </section>

          {error && (
            <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-2xl p-6 text-rose-800">
              <TriangleAlert size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">We couldn&rsquo;t send this.</p>
                <p className="text-sm mt-1">{error.message}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={cancel}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm text-[#0b1c30] hover:bg-[#e5eeff] transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 shadow-md hover:bg-brand-700 transition-colors disabled:opacity-60"
            >
              <SendHorizontal size={16} />
              {isSaving ? 'Sending…' : 'Send'}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <section className={CARD}>
            <div className="flex items-center gap-2">
              <ListChecks size={16} className="text-brand-600" />
              <h2 className="text-base font-semibold text-slate-900">What happens next</h2>
            </div>
            <p className="text-sm text-slate-600 mt-2">When a concern is received, Platform Governance will:</p>
            <ol className="mt-3 list-decimal pl-5 flex flex-col gap-1.5 text-sm text-slate-600">
              {CONCERN_HANDLING_STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Not every concern leads to disciplinary action. Some lead to clarification, learning,
              or improved understanding.
            </p>
          </section>

          <section className="bg-[#eff4ff] rounded-xl p-6">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-[#2170e4]" />
              <h2 className="text-base font-semibold text-slate-900">Response times</h2>
            </div>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              The timeframes for acknowledging and responding to a concern are set by governance
              and have not yet been published. Until they are, this screen will not promise one.
            </p>
          </section>

          <ConcernSafeguards />

          <section className={CARD}>
            <h2 className="text-base font-semibold text-slate-900">What the platform cannot do</h2>
            <ul className="mt-3 list-disc pl-5 flex flex-col gap-1.5 text-sm text-slate-600">
              {CONCERN_PLATFORM_LIMITS.map((limit) => (
                <li key={limit}>{limit}</li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 mt-3">The platform&rsquo;s role is governance, not management.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
