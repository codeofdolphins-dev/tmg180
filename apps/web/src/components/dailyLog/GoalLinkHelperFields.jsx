import { TriangleAlert } from 'lucide-react';
import {
  GOAL_LINK_HELPER,
  NDIS_BUCKETS,
  RN_RATIONALE_TAGS,
  goalLinkHelperEntry,
  goalLinkSuggestions,
} from '@tmg180/shared';
import Select from '../ui/Select';

/**
 * The Goal Link Helper fields on a Support Evidence Log (Goal Link Helper
 * Developer Spec v1.1): `ndis_bucket` (Core / Capacity Building / Capital,
 * required to submit), `tmg_functional_grouping` (optional — choosing one
 * prefills the suggested bucket and rationale tags, which the person may then
 * change) and `rn_rationale_tags` (optional). The grouping's goal-link and
 * functional-barrier prompts from the helper table show as guidance once one
 * is chosen. Shared by the participant and worker log forms.
 */

const toggle = (list = [], value) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-2 text-sm text-[#ba1a1a] flex items-center gap-1.5">
      <TriangleAlert size={13} className="shrink-0" />
      {message}
    </p>
  );
}

export default function GoalLinkHelperFields({ watch, setValue, errors = {} }) {
  const bucket = watch('ndisBucket') ?? '';
  const grouping = watch('functionalGrouping') ?? '';
  const tags = watch('rnRationaleTags') ?? [];
  const entry = goalLinkHelperEntry(grouping);

  const groupingOptions = GOAL_LINK_HELPER.map((row) => ({
    value: row.code,
    label: `${row.grouping} — ${row.domain}`,
  }));

  const chooseGrouping = (code) => {
    setValue('functionalGrouping', code ?? '', { shouldDirty: true });
    const suggestion = goalLinkSuggestions(code);
    if (suggestion) {
      setValue('ndisBucket', suggestion.bucket, { shouldDirty: true });
      setValue('rnRationaleTags', suggestion.rationaleTags, { shouldDirty: true });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="block text-sm font-bold text-[#0b1c30]" htmlFor="functionalGrouping">
          Functional grouping <span className="font-normal text-[#4d4354]">(optional)</span>
        </label>
        <p className="mt-1 text-sm text-[#4d4354]">
          A suggestion to start from — it fills in the bucket and rationale tags below, which you can change.
        </p>
        <Select
          inputId="functionalGrouping"
          aria-label="Functional grouping"
          className="mt-3"
          value={groupingOptions.find((option) => option.value === grouping) ?? null}
          options={groupingOptions}
          onChange={(option) => chooseGrouping(option?.value ?? '')}
          isClearable
          isSearchable
          placeholder="Choose the closest grouping…"
        />
        {entry && (
          <dl className="mt-3 bg-white/70 rounded-2xl px-4 py-3 text-sm flex flex-col gap-2">
            <div>
              <dt className="font-semibold text-[#0b1c30]">Common goal links</dt>
              <dd className="text-[#4d4354]">{entry.goalLinks}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#0b1c30]">Functional barrier</dt>
              <dd className="text-[#4d4354]">{entry.barrier}</dd>
            </div>
          </dl>
        )}
        <FieldError message={errors.functionalGrouping?.message} />
      </div>

      <div>
        <span className="block text-sm font-bold text-[#0b1c30]">
          NDIS budget bucket <span className="text-[#ba1a1a]">*</span>
        </span>
        <div className="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="NDIS budget bucket">
          {NDIS_BUCKETS.map((option) => {
            const selected = bucket === option.key;
            return (
              <button
                key={option.key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setValue('ndisBucket', option.key, { shouldDirty: true })}
                className={`px-4 py-2.25 rounded-full text-sm transition-colors ${
                  selected
                    ? 'bg-[#005f40] text-white shadow-sm'
                    : 'bg-[#e5eeff] text-[#0b1c30] hover:bg-[#d7e4ff]'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <FieldError message={errors.ndisBucket?.message} />
      </div>

      <div>
        <span className="block text-sm font-bold text-[#0b1c30]">
          Reasonable &amp; necessary rationale tags{' '}
          <span className="font-normal text-[#4d4354]">(optional)</span>
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {RN_RATIONALE_TAGS.map((tag) => {
            const selected = tags.includes(tag.key);
            return (
              <button
                key={tag.key}
                type="button"
                aria-pressed={selected}
                onClick={() => setValue('rnRationaleTags', toggle(tags, tag.key), { shouldDirty: true })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selected
                    ? 'bg-[#007a53] text-white'
                    : 'bg-white border border-slate-200 text-[#0b1c30] hover:bg-slate-50'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
        <FieldError message={errors.rnRationaleTags?.message} />
      </div>
    </div>
  );
}
