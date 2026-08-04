import {
  Plus,
  CircleCheck,
  Circle,
  Sparkle,
  Lightbulb,
  TriangleAlert,
  X,
} from 'lucide-react';

import { useFieldArray } from 'react-hook-form';
import ProfileSectionFooter from '../components/ProfileSectionFooter';
import { useSectionForm } from '../hooks/profile';

const GOAL_EXAMPLES = [
  '• Becoming more independent at home',
  '• Finding a job',
  '• Travelling independently',
  '• Improving communication',
];

const YOUR_INFORMATION = [
  'Your Personal Profile belongs to you.',
  "Share only what you're comfortable sharing.",
  'You can save your progress and update it whenever you choose.',
];

const NEED_HELP = [
  "Start with one goal that's meaningful to you.",
  'Small steps are often the easiest way to make progress.',
];

export default function ProfileMyGoals() {
  const section = useSectionForm('my-goals', {
    // A blank step row is scaffolding, not an answer.
    transform: (answers) => ({
      ...answers,
      goal_steps: (answers.goal_steps ?? []).filter((step) => step.text?.trim()),
    }),
  });
  const { status, position, error } = section;
  const { register, control, setValue, watch } = section.form;
  const steps = useFieldArray({ control, name: 'goal_steps' });

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
            <div>
              <h1 className="text-[32px] font-semibold text-slate-900">My Goals</h1>
              <p className="text-base text-slate-600 mt-2 max-w-2xl">
                Tell us about the goals that are important to you and what you would like to
                work towards. Your goals can change over time, and you can update them
                whenever you need.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_301px] gap-6 items-start">
              <div className="flex flex-col gap-6">
                <div className="bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="text-sm font-medium text-slate-600 tracking-wide">
                    Primary Aspiration
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-900 mt-2 mb-4">
                    What are you currently working towards?
                  </h2>
                  <textarea
                    aria-label="What are you currently working towards?"
                    placeholder={['For example:', ...GOAL_EXAMPLES].join('\n')}
                    className="w-full bg-white border border-slate-300 rounded-lg p-4 h-58 resize-none text-base text-slate-900 placeholder:text-gray-500 outline-none focus:border-brand-600 transition-colors"
                    {...register('primary_aspiration')}
                  />
                </div>

                <div className="bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-slate-900">
                      Steps Towards My Goal
                    </h2>
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
                      const done = watch(`goal_steps.${index}.done`) ?? false;
                      return (
                        <div
                          key={field.id}
                          className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg px-4 py-3"
                        >
                          <button
                            type="button"
                            aria-label={done ? 'Mark step as not done' : 'Mark step as done'}
                            onClick={() => setValue(`goal_steps.${index}.done`, !done, { shouldDirty: true })}
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
                            {...register(`goal_steps.${index}.text`)}
                          />
                          <button
                            type="button"
                            aria-label="Remove step"
                            onClick={() => steps.remove(index)}
                            className="text-slate-300 hover:text-slate-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="relative overflow-hidden bg-[#0b1c30] rounded-2xl p-8">
                  <Sparkle
                    size={150}
                    className="absolute -right-4 top-8 text-white/10"
                    strokeWidth={1}
                  />
                  <h2 className="relative text-2xl font-semibold text-white">Remember</h2>
                  <p className="relative text-base text-[#b4c5ff] mt-2">
                    Goals can change over time.
                    <br />
                    Update this section whenever your priorities change.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="text-sm font-bold text-brand-600 tracking-wide">
                    Personal Profile Status
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span
                      className={`text-base font-medium rounded-full px-4 py-1.5 ${
                        status === 'complete'
                          ? 'text-[#006c49] bg-emerald-100'
                          : 'text-slate-600 bg-[#dce9ff]'
                      }`}
                    >
                      {status === 'complete'
                        ? 'Completed'
                        : status === 'in_progress'
                          ? 'In progress'
                          : 'Not started'}
                    </span>
                    <span className="text-lg text-slate-600">{position}</span>
                  </div>
                </div>

                <div className="bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h3 className="text-base font-bold text-[#006c49] mb-3">Your Information</h3>
                  <div className="flex flex-col gap-4">
                    {YOUR_INFORMATION.map((line) => (
                      <p key={line} className="text-base text-slate-600">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-[#ffddb8] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Lightbulb size={18} className="text-[#2a1700] shrink-0" />
                    <h3 className="text-base font-bold text-[#2a1700]">Need Help?</h3>
                  </div>
                  <div className="flex flex-col gap-1">
                    {NEED_HELP.map((line) => (
                      <p key={line} className="text-sm italic text-[#653e00]">
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

            <ProfileSectionFooter {...section} />
    </div>
  );
}
