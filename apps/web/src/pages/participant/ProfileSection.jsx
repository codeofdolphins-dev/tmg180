import {
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleCheck,
  Lightbulb,
  Plus,
  TriangleAlert,
  X,
} from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Controller, useFieldArray } from 'react-hook-form';
import {
  PROFILE_SECTIONS,
  PROFILE_SECTION_STATUS,
  VISIBILITY_OPTIONS,
  profileSectionBySlug,
} from '@tmg180/shared';
import ProfileSectionFooter from '../../components/participant/ProfileSectionFooter';
import DateField from '../../components/ui/DateField';
import {
  SECTION_PATHS,
  toggleInList,
  useProfile,
  useSectionForm,
} from '../../hooks/participant/profile';
import { PARTICIPANT_PATHS } from '../../routes/paths';

/**
 * One page renders every Personal Profile section straight from the contract
 * in @tmg180/shared (Final Override P1: the profile is one living document —
 * the Support Needs Tool v4's own groups, framing copy, checklists and tables,
 * in seed order).
 * Adding or changing a section is a contract edit; nothing here is bespoke.
 */

const YOUR_INFORMATION_LINES = [
  'Your Personal Profile belongs to you.',
  "Share only what you're comfortable sharing.",
  'You can save your progress and update it whenever you choose.',
];

const NEED_HELP_LINES = [
  'There are no right or wrong answers.',
  'You can tick as many or as few as feel true for you.',
  'You can save your progress and return later.',
];

function CheckItem({ label, checked, onToggle }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onToggle}
      className={`flex items-start gap-2.5 rounded-xl border px-4 py-2.5 text-left text-base transition-colors ${
        checked
          ? 'border-brand-600 bg-brand-600/10 text-[#0b1c30]'
          : 'border-slate-300 bg-white text-[#0b1c30] hover:bg-slate-50'
      }`}
    >
      <span
        className={`w-4.5 h-4.5 mt-0.5 rounded shrink-0 flex items-center justify-center ${
          checked ? 'bg-brand-600' : 'border border-slate-400 bg-white'
        }`}
      >
        {checked && <Check size={12} strokeWidth={3} className="text-white" />}
      </span>
      {label}
    </button>
  );
}

function MultiQuestion({ question, form }) {
  const selected = form.watch(question.key) ?? [];
  return (
    <div className="flex flex-col gap-3">
      <span className="text-base font-medium text-[#0b1c30]">{question.label}</span>
      {question.helper && <p className="text-sm text-[#434655]">{question.helper}</p>}
      <div className="flex flex-col gap-2">
        {question.options.map(({ value, label }) => (
          <CheckItem
            key={value}
            label={label}
            checked={selected.includes(value)}
            onToggle={() =>
              form.setValue(question.key, toggleInList(selected, value), { shouldDirty: true })
            }
          />
        ))}
      </div>
    </div>
  );
}

function TextareaQuestion({ question, form }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={question.key} className="text-base font-medium text-[#0b1c30]">
        {question.label}
      </label>
      {question.helper && <p className="text-sm text-[#434655]">{question.helper}</p>}
      <textarea
        id={question.key}
        placeholder={question.placeholder ?? 'You can write as much or as little as you like.'}
        className="h-32 resize-none bg-white border border-slate-300 rounded-xl p-4 text-sm text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-[#005f40] transition-colors"
        {...form.register(question.key)}
      />
    </div>
  );
}

function TextQuestion({ question, form }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={question.key} className="text-base font-medium text-[#0b1c30]">
        {question.label}
      </label>
      <input
        id={question.key}
        type="text"
        placeholder={question.placeholder}
        className="h-12 bg-white border border-slate-300 rounded-xl px-4 text-sm text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-[#005f40] transition-colors"
        {...form.register(question.key)}
      />
    </div>
  );
}

function SelectQuestion({ question, form }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={question.key} className="text-base font-medium text-[#0b1c30]">
        {question.label}
      </label>
      <div className="relative">
        <select
          id={question.key}
          className="w-full h-12 appearance-none bg-white border border-slate-300 rounded-xl px-4 pr-10 text-sm text-[#0b1c30] outline-none focus:border-[#005f40] transition-colors"
          {...form.register(question.key)}
        >
          <option value="">Choose if you'd like to share</option>
          {question.options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#434655] pointer-events-none"
        />
      </div>
    </div>
  );
}

function StepsQuestion({ question, form }) {
  const steps = useFieldArray({ control: form.control, name: question.key });
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-[#0b1c30]">{question.label}</span>
        <button
          type="button"
          onClick={() => steps.append({ text: '', done: false })}
          className="flex items-center gap-1 text-base text-brand-600 hover:text-brand-700 transition-colors"
        >
          <Plus size={12} className="shrink-0" />
          Add another step
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {steps.fields.length === 0 && (
          <p className="text-base text-gray-500 px-1">
            Add the small steps that will get you there.
          </p>
        )}
        {steps.fields.map((field, index) => {
          const done = form.watch(`${question.key}.${index}.done`) ?? false;
          return (
            <div
              key={field.id}
              className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg px-4 py-3"
            >
              <button
                type="button"
                aria-label={done ? 'Mark step as not done' : 'Mark step as done'}
                onClick={() =>
                  form.setValue(`${question.key}.${index}.done`, !done, { shouldDirty: true })
                }
              >
                {done ? (
                  <CircleCheck size={20} className="text-emerald-600 shrink-0" />
                ) : (
                  <Circle size={20} className="text-slate-300 shrink-0" />
                )}
              </button>
              <input
                type="text"
                placeholder="Enter your next step..."
                className="flex-1 rounded-lg px-3 py-2 text-base text-slate-900 placeholder:text-gray-500 outline-none"
                {...form.register(`${question.key}.${index}.text`)}
              />
              <button type="button" aria-label="Remove step" onClick={() => steps.remove(index)}>
                <X size={16} className="text-slate-400 hover:text-slate-600" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DateQuestion({ question, form }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={question.key} className="text-base font-medium text-[#0b1c30]">
        {question.label}
      </label>
      <Controller
        control={form.control}
        name={question.key}
        render={({ field }) => (
          <DateField
            id={question.key}
            ariaLabel={question.label}
            look="box"
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />
    </div>
  );
}

/** A table in the source document — one card per row, one field per column. */
function RowsQuestion({ question, form }) {
  const rows = useFieldArray({ control: form.control, name: question.key });
  const blank = Object.fromEntries(question.columns.map((column) => [column.key, '']));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-[#0b1c30]">{question.label}</span>
        <button
          type="button"
          onClick={() => rows.append(blank)}
          className="flex items-center gap-1 text-base text-brand-600 hover:text-brand-700 transition-colors"
        >
          <Plus size={12} className="shrink-0" />
          {question.addLabel ?? 'Add another'}
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {rows.fields.map((field, index) => (
          <div key={field.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wide text-slate-500">{index + 1}</span>
              <button type="button" aria-label="Remove row" onClick={() => rows.remove(index)}>
                <X size={16} className="text-slate-400 hover:text-slate-600" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.columns.map((column) => (
                <label key={column.key} className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#0b1c30]">{column.label}</span>
                  <textarea
                    rows={2}
                    className="resize-none bg-white border border-slate-300 rounded-xl p-3 text-sm text-[#0b1c30] outline-none focus:border-[#005f40] transition-colors"
                    {...form.register(`${question.key}.${index}.${column.key}`)}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const QUESTION_RENDERERS = {
  multi: MultiQuestion,
  textarea: TextareaQuestion,
  text: TextQuestion,
  select: SelectQuestion,
  steps: StepsQuestion,
  date: DateQuestion,
  rows: RowsQuestion,
};

/**
 * P1-03: every answer carries its own visibility and starts private. One row
 * under each answer, and a "set the whole section" row at the top of the page.
 */
function VisibilityPicker({ current, onChange }) {
  const active = VISIBILITY_OPTIONS.find((option) => option.value === current) ?? VISIBILITY_OPTIONS[0];
  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <span className="text-sm text-[#434655]">Who can see this:</span>
      {VISIBILITY_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={current === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            current === option.value
              ? 'bg-brand-600 text-white'
              : 'bg-white border border-slate-300 text-[#0b1c30] hover:bg-slate-50'
          }`}
        >
          {option.label}
        </button>
      ))}
      <span className="text-xs text-[#434655]">{active.note}</span>
    </div>
  );
}

function SectionVisibility({ onApply }) {
  return (
    <div className="bg-white/80 border border-slate-200 rounded-xl shadow-sm px-5 py-4 flex flex-col gap-2">
      <p className="text-base font-medium text-[#0b1c30]">Who can see your answers</p>
      <p className="text-sm text-[#434655]">
        Every answer starts private. You choose for each one, and you can change it whenever you
        like.
      </p>
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-sm text-[#434655]">Set every answer in this section to:</span>
        {VISIBILITY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onApply(option.value)}
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-[#0b1c30] hover:bg-slate-50 transition-colors"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function GroupCard({ group, form, visibilityOf, setVisibility }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-[#0b1c30]">{group.title}</h2>
        {group.intro?.map((line) => (
          <p key={line} className="text-base text-[#434655] leading-relaxed">
            {line}
          </p>
        ))}
      </div>
      {group.questions.map((question) => {
        const Renderer = QUESTION_RENDERERS[question.type];
        if (!Renderer) return null;
        return (
          <div key={question.key} className="flex flex-col gap-2">
            <Renderer question={question} form={form} />
            <VisibilityPicker
              current={visibilityOf(question.key)}
              onChange={(value) => setVisibility(question.key, value)}
            />
          </div>
        );
      })}
      {group.outro?.map((line) => (
        <p key={line} className="text-base text-[#434655] leading-relaxed">
          {line}
        </p>
      ))}
    </div>
  );
}

export default function ProfileSection() {
  const { sectionSlug } = useParams();
  const def = profileSectionBySlug(sectionSlug);

  if (!def) return <Navigate to={PARTICIPANT_PATHS.profile} replace />;
  return <SectionForm key={def.key} def={def} />;
}

/** The closing step's review list: every other section, and where it is up to. */
function ReviewList() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const sections = PROFILE_SECTIONS;

  const stateOf = (section) => {
    const status = profile?.sections?.[section.key]?.status;
    if (status === PROFILE_SECTION_STATUS.COMPLETE)
      return { text: 'Completed', tone: 'text-[#006c49] bg-emerald-100' };
    if (status === PROFILE_SECTION_STATUS.IN_PROGRESS)
      return { text: 'In progress', tone: 'text-[#005f40] bg-brand-100' };
    return { text: 'Not started', tone: 'text-[#434655] bg-[#dce9ff]' };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-[#0b1c30]">Your profile so far</h2>
        <p className="text-base text-[#434655] leading-relaxed">
          Open any part to add to it or change it. Nothing here is fixed — your profile grows
          over time.
        </p>
      </div>
      <div className="flex flex-col">
        {sections.map((section) => {
          const state = stateOf(section);
          return (
            <button
              key={section.key}
              onClick={() => navigate(SECTION_PATHS[section.key])}
              className="flex items-center justify-between gap-4 py-3 px-2 -mx-2 border-b border-slate-100 last:border-0 text-left rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span className="flex items-baseline gap-3 min-w-0">
                <span className="text-sm text-[#434655] tabular-nums">
                  {String(section.order).padStart(2, '0')}
                </span>
                <span className="text-base text-[#0b1c30]">{section.title}</span>
              </span>
              <span className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-medium rounded-full px-3 py-1 ${state.tone}`}>
                  {state.text}
                </span>
                <ChevronRight size={16} className="text-slate-400" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Split out so the form hook remounts cleanly when the slug changes. */
function SectionForm({ def }) {
  const section = useSectionForm(def.key, {
    // Blank step rows are scaffolding, not answers.
    transform: (answers) => {
      const cleaned = { ...answers };
      for (const question of def.questions) {
        if (question.type === 'steps' && Array.isArray(cleaned[question.key])) {
          cleaned[question.key] = cleaned[question.key].filter((step) => step.text?.trim());
        }
        // Blank table rows likewise.
        if (question.type === 'rows' && Array.isArray(cleaned[question.key])) {
          cleaned[question.key] = cleaned[question.key].filter((row) =>
            Object.values(row ?? {}).some((cell) => String(cell ?? '').trim())
          );
        }
      }
      return cleaned;
    },
  });
  const { status, position, error, isLast, form, visibilityOf, setVisibility, setSectionVisibility } =
    section;
  const hasQuestions = def.questions.length > 0;

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#0b1c30]">{def.title}</h1>
        <p className="text-base text-[#434655]">{def.description}</p>
      </div>

      <div className="grid grid-cols-[1fr_301px] gap-6 items-start">
        <div className="flex flex-col gap-8">
          {def.intro && (
            <div className="bg-white/80 border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col gap-4">
              {def.intro.map((line) => (
                <p key={line} className="text-base text-[#434655] leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          )}

          {def.review && <ReviewList />}

          {hasQuestions && <SectionVisibility onApply={setSectionVisibility} />}

          {def.groups.map((group) => (
            <GroupCard
              key={group.title}
              group={group}
              form={form}
              visibilityOf={visibilityOf}
              setVisibility={setVisibility}
            />
          ))}

          <div className="bg-white/80 border border-slate-200 rounded-xl shadow-sm px-5 py-4 flex flex-col gap-2">
            <h3 className="text-base font-semibold text-[#006c49]">Why we ask this</h3>
            <p className="text-base text-[#434655]">
              The information you share helps build your Personal Profile and provides context
              for your Daily Logs and Monthly Snapshots. Your profile grows over time.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col gap-4">
            <span className="text-sm font-bold text-[#005f40]">Personal Profile Status</span>
            <div className="flex items-center justify-between">
              <span
                className={`text-base font-medium rounded-full px-4 py-1.5 ${
                  status === 'complete'
                    ? 'text-[#006c49] bg-emerald-100'
                    : 'text-[#434655] bg-[#dce9ff]'
                }`}
              >
                {status === 'complete'
                  ? 'Completed'
                  : status === 'in_progress'
                    ? 'In progress'
                    : 'Not started'}
              </span>
              {position && <span className="text-lg text-[#434655]">{position}</span>}
            </div>
          </div>

          <div className="bg-white/80 border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col gap-2">
            <h3 className="text-base font-semibold text-[#006c49]">Your Information</h3>
            <div className="flex flex-col gap-5">
              {YOUR_INFORMATION_LINES.map((line) => (
                <p key={line} className="text-base text-[#434655]">
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="bg-[#ffddb8] rounded-2xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Lightbulb size={18} className="text-[#2a1700] shrink-0" />
              <h3 className="text-base font-semibold text-[#2a1700]">Need Help?</h3>
            </div>
            <div className="flex flex-col">
              {NEED_HELP_LINES.map((line) => (
                <p key={line} className="text-sm italic text-[#653e00] leading-5">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-4 py-3 text-sm"
        >
          <TriangleAlert size={16} className="shrink-0 mt-0.5" />
          <span>{error.message}</span>
        </div>
      )}

      <ProfileSectionFooter
        {...section}
        continueLabel={isLast ? 'Save & Finish' : 'Save & Continue'}
      />
    </div>
  );
}
