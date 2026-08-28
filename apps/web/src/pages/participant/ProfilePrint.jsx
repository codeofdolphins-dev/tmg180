import { useEffect, useRef } from 'react';
import { ArrowLeft, LoaderCircle, Printer } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PROFILE_STEPS, visibilityLabel, ANSWER_VISIBILITY } from '@tmg180/shared';
import { useProfile } from '../../hooks/participant/profile';
import { PARTICIPANT_PATHS } from '../../routes/paths';
import { useAuthStore } from '../../store';

/**
 * A copy of the whole Personal Profile the participant can keep.
 *
 * The Support Needs Tool v4 lists downloading among the things the profile's
 * owner decides — "You choose: who sees it · who you share it with · whether
 * you update it · whether you download it". This is that copy: every section,
 * every answer as it was written, nothing summarised or interpreted.
 *
 * Same mechanism as the Monthly Snapshot export — the browser's own print
 * dialog, which saves as PDF everywhere — so the file is made on the
 * participant's device and sent nowhere. `print:` classes drop the controls.
 */

const answeredValue = (question, answers) => {
  const value = answers?.[question.key];
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) return value.length > 0 ? value : null;
  if (typeof value === 'string') return value.trim() ? value : null;
  return value;
};

/** Multi-select values are stored as option values; show the labels. */
const optionLabels = (question, values) =>
  values.map((value) => question.options?.find((option) => option.value === value)?.label ?? value);

function Answer({ question, value }) {
  if (question.type === 'multi') {
    return (
      <ul className="list-disc pl-5 flex flex-col gap-0.5">
        {optionLabels(question, value).map((label) => (
          <li key={label} className="text-sm text-slate-700">
            {label}
          </li>
        ))}
      </ul>
    );
  }
  if (question.type === 'select') {
    return <p className="text-sm text-slate-700">{optionLabels(question, [value])[0]}</p>;
  }
  if (question.type === 'steps') {
    return (
      <ul className="list-disc pl-5 flex flex-col gap-0.5">
        {value.map((step, index) => (
          <li key={`${step.text}-${index}`} className="text-sm text-slate-700">
            {step.text}
            {step.done ? ' — done' : ''}
          </li>
        ))}
      </ul>
    );
  }
  if (question.type === 'rows') {
    return (
      <div className="flex flex-col gap-3">
        {value.map((row, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-3 break-inside-avoid">
            {question.columns.map((column) =>
              row[column.key]?.trim() ? (
                <p key={column.key} className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">{column.label}: </span>
                  {row[column.key]}
                </p>
              ) : null
            )}
          </div>
        ))}
      </div>
    );
  }
  return <p className="text-sm text-slate-700 whitespace-pre-wrap">{value}</p>;
}

export default function ProfilePrint() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const { data: profile, isLoading } = useProfile();
  const printed = useRef(false);

  // Arriving from a "Download a copy" button: print as soon as it is on screen.
  useEffect(() => {
    if (!profile || !location.state?.print || printed.current) return;
    printed.current = true;
    const id = setTimeout(() => window.print(), 400);
    return () => clearTimeout(id);
  }, [profile, location.state]);

  if (isLoading) {
    return (
      <div className="max-w-238 mx-auto flex items-center gap-3 text-slate-500 bg-white/80 rounded-xl p-6">
        <LoaderCircle size={18} className="animate-spin" />
        Loading your profile…
      </div>
    );
  }

  const written = PROFILE_STEPS.map((step) => {
    const saved = profile?.sections?.[step.key];
    const groups = step.groups
      .map((group) => ({
        title: group.title,
        answered: group.questions
          .map((question) => ({ question, value: answeredValue(question, saved?.answers) }))
          .filter((entry) => entry.value !== null),
      }))
      .filter((group) => group.answered.length > 0);
    return { step, groups, visibility: saved?.visibility ?? {} };
  }).filter((entry) => entry.groups.length > 0);

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => navigate(PARTICIPANT_PATHS.profile)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to my profile
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-semibold rounded-full px-5 py-2.5 shadow-md hover:bg-brand-700 transition-colors"
        >
          <Printer size={16} />
          Save as PDF
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Personal Profile</h1>
        <p className="text-base text-slate-600 mt-2">
          {user?.name ? `${user.name} — ` : ''}
          your own copy, exactly as you wrote it.
        </p>
        <p className="text-sm text-slate-500 mt-1 print:hidden">
          This copy is made on your device and is not sent to anyone. Your browser&rsquo;s print
          dialog can save it as a PDF.
        </p>
      </div>

      {written.length === 0 ? (
        <div className="bg-white/80 rounded-xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-base text-slate-600">
            There is nothing to copy yet — your profile is still empty.
          </p>
        </div>
      ) : (
        written.map(({ step, groups, visibility }) => (
          <section
            key={step.key}
            className="bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] print:shadow-none print:border print:border-slate-200 break-inside-avoid"
          >
            <h2 className="text-xl font-semibold text-slate-900">{step.title}</h2>
            <div className="mt-5 flex flex-col gap-6">
              {groups.map((group) => (
                <div key={group.title} className="flex flex-col gap-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 border-b border-slate-100 pb-1">
                    {group.title}
                  </h3>
                  {group.answered.map(({ question, value }) => {
                    const shared = visibility[question.key];
                    return (
                      <div key={question.key} className="flex flex-col gap-1.5 break-inside-avoid">
                        <p className="text-sm font-semibold text-slate-900">{question.label}</p>
                        <Answer question={question} value={value} />
                        {shared && shared !== ANSWER_VISIBILITY.PRIVATE && (
                          <p className="text-xs text-slate-500">
                            Shared: {visibilityLabel(shared)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
