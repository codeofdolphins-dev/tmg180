import {
  SNAPSHOT_APPROVAL_STATEMENTS,
  SNAPSHOT_PARTICIPANT_INVOLVEMENT,
  SNAPSHOT_RELATIONAL_SECTIONS,
} from '@tmg180/shared';
import { toggleInList } from '../../hooks/participant/dailyLog';

/**
 * The Monthly Relational Longitudinal Snapshot's own sections (canonical
 * monthly template, client set 28 Aug 2026) — section 1's "participant
 * involved in review", the seven checkbox banks of sections 3–9, and section
 * 11's approval statements.
 *
 * Sections 2, 10 and 11's free text are not here: they are the same fields as
 * Template C2, C6 and C8, which the review screen already renders. This is
 * only what the relational template adds.
 *
 * Each section carries the template's own reason for existing (`note`) and its
 * own examples. Both are shown rather than trimmed — they are what keeps the
 * wording from drifting clinical, which is the point of the template.
 *
 * `readOnly` renders the same content as a record: chosen options as chips,
 * summaries as text, nothing chosen left out entirely.
 */

function Chips({ options, selected, onToggle, readOnly }) {
  const shown = readOnly ? options.filter((option) => selected.includes(option.key)) : options;
  if (readOnly && shown.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {shown.map((option) => {
        const on = selected.includes(option.key);
        if (readOnly) {
          return (
            <span
              key={option.key}
              className="text-sm font-medium text-brand-700 bg-brand-50 px-4 py-1.5 rounded-full"
            >
              {option.label}
            </span>
          );
        }
        return (
          <button
            key={option.key}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(option.key)}
            className={`px-4 py-2 rounded-full text-sm text-left transition-colors ${
              on
                ? 'bg-[#007a53] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e0e9ff]'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function Card({ children }) {
  return <section className="bg-white/70 rounded-3xl p-8">{children}</section>;
}

export default function RelationalSections({ values, onChange, readOnly = false }) {
  const list = (key) => values?.[key] ?? [];
  const text = (key) => values?.[key] ?? '';

  const toggle = (field, key) => onChange(field, toggleInList(list(field), key));
  const choose = (field, key) => onChange(field, values?.[field] === key ? '' : key);

  const involvement = values?.participantInvolvement ?? '';
  const approvals = list('approvalStatements');

  // In read-only, a section with neither chosen options nor a summary is not
  // an empty heading — it is a section the participant did not use.
  const sections = readOnly
    ? SNAPSHOT_RELATIONAL_SECTIONS.filter(
        (section) =>
          list(section.tagField).length > 0 ||
          text(section.summaryField).trim() ||
          (section.choiceField && values?.[section.choiceField])
      )
    : SNAPSHOT_RELATIONAL_SECTIONS;

  const showInvolvement = !readOnly || involvement;
  const showApprovals = !readOnly || approvals.length > 0;

  if (readOnly && sections.length === 0 && !showInvolvement && !showApprovals) return null;

  return (
    <div className="flex flex-col gap-6">
      {showInvolvement && (
        <Card>
          <h3 className="text-xl font-semibold text-[#0b1c30]">Summary details</h3>
          <p className="mt-1 text-sm text-[#4d4354]">Participant involved in review:</p>
          <div className="mt-4">
            <Chips
              options={SNAPSHOT_PARTICIPANT_INVOLVEMENT}
              selected={involvement ? [involvement] : []}
              onToggle={(key) => choose('participantInvolvement', key)}
              readOnly={readOnly}
            />
          </div>
        </Card>
      )}

      {sections.map((section) => (
        <Card key={section.key}>
          <h3 className="text-xl font-semibold text-[#0b1c30]">
            {section.number}. {section.title}
          </h3>

          {section.choiceField && (
            <div className="mt-4">
              <p className="text-sm font-bold text-[#0b1c30]">{section.choiceLabel}</p>
              <div className="mt-3">
                <Chips
                  options={section.choiceOptions}
                  selected={values?.[section.choiceField] ? [values[section.choiceField]] : []}
                  onToggle={(key) => choose(section.choiceField, key)}
                  readOnly={readOnly}
                />
              </div>
            </div>
          )}

          <p className="mt-4 text-sm font-bold text-[#0b1c30]">{section.question}</p>
          {section.instruction && !readOnly && (
            <p className="mt-1 text-sm text-[#4d4354]">{section.instruction}</p>
          )}
          <div className="mt-3">
            <Chips
              options={section.options}
              selected={list(section.tagField)}
              onToggle={(key) => toggle(section.tagField, key)}
              readOnly={readOnly}
            />
          </div>

          <div className="mt-5">
            <label
              className="block text-sm text-[#4d4354]"
              htmlFor={readOnly ? undefined : section.summaryField}
            >
              {section.summaryLabel}
            </label>
            {readOnly ? (
              text(section.summaryField).trim() && (
                <p className="mt-1 text-base text-[#0b1c30] whitespace-pre-wrap">
                  {text(section.summaryField)}
                </p>
              )
            ) : (
              <textarea
                id={section.summaryField}
                rows={3}
                value={text(section.summaryField)}
                onChange={(event) => onChange(section.summaryField, event.target.value)}
                className="mt-2 w-full bg-white rounded-2xl px-4 py-3 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none resize-none focus:ring-2 focus:ring-brand-600/40"
              />
            )}
          </div>

          {section.examples && !readOnly && (
            <p className="mt-3 text-sm text-[#4d4354]">
              Examples: {section.examples.join(' · ')}
            </p>
          )}
          {section.note && (
            <p className="mt-3 text-sm text-[#4d4354] italic">{section.note}</p>
          )}
        </Card>
      ))}

      {showApprovals && (
        <Card>
          <h3 className="text-xl font-semibold text-[#0b1c30]">Participant voice and approval</h3>
          <div className="mt-4">
            <Chips
              options={SNAPSHOT_APPROVAL_STATEMENTS}
              selected={approvals}
              onToggle={(key) => toggle('approvalStatements', key)}
              readOnly={readOnly}
            />
          </div>
        </Card>
      )}
    </div>
  );
}
