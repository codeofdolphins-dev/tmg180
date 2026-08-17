import { Speech, BrainCog, Lightbulb, TriangleAlert } from 'lucide-react';

import ProfileSectionFooter from '../../components/participant/ProfileSectionFooter';
import { useSectionForm } from '../../hooks/participant/profile';

/** Values match the preferred_communication options in @tmg180/shared. */
const COMM_METHODS = [
  {
    value: 'verbal_speech',
    title: 'Verbal Speech',
    description: 'I prefer speaking out loud and phone calls.',
  },
  {
    value: 'text_based',
    title: 'Text-Based',
    description: 'I prefer messaging, emails, or chat.',
  },
  {
    value: 'sign_language',
    title: 'Sign Language',
    description: 'ASL, BSL, or other manual languages.',
  },
  {
    value: 'aac_tools',
    title: 'AAC Tools',
    description: 'Communication boards or digital apps.',
  },
];

const HELPS_PLACEHOLDER =
  'For example:\n\n• Give me extra time to respond.\n• Use simple, direct language.\n• Speak slowly.\n• Write things down if needed.\n• Reduce background noise.';

const YOUR_INFORMATION = [
  'Your communication preferences belong to you.',
  "Share only what you're comfortable sharing.",
  'You can update this information whenever your communication needs or preferences change.',
];

const NEED_HELP = [
  'here are no right or wrong answers.',
  'Tell us what helps communication work well for you.',
  'You can update this information whenever your preferences change.',
];

function MethodOption({ title, description, selected, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex items-start gap-3 rounded-xl p-4 text-left transition-colors ${
        selected
          ? 'bg-purple-600/10 border border-brand-600'
          : 'bg-white border border-slate-200 hover:bg-slate-50'
      }`}
    >
      {selected ? (
        <span className="mt-1 w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
          <span className="w-2 h-2 rounded-full bg-white" />
        </span>
      ) : (
        <span className="mt-1 w-5 h-5 rounded-full border-2 border-slate-300 bg-white shrink-0" />
      )}
      <span>
        <span className="block text-base font-bold text-slate-900">{title}</span>
        <span className="block text-base text-slate-800">{description}</span>
      </span>
    </button>
  );
}

export default function ProfileHowICommunicate() {
  const section = useSectionForm('how-i-communicate');
  const { status, position, error } = section;
  const { register, watch, setValue } = section.form;
  const preferred = watch('preferred_communication') ?? '';

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Communication</h1>
              <p className="text-base text-slate-600 mt-2 max-w-2xl">
                Tell us how you prefer to communicate and anything that helps conversations
                feel comfortable and easy for you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_301px] gap-6 items-start">
              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="flex items-center gap-3 mb-6">
                    <Speech size={22} className="text-brand-600 shrink-0" />
                    <h2 className="text-xl font-semibold text-slate-900">
                      Preferred Communication
                    </h2>
                  </div>
                  <div role="radiogroup" aria-label="Preferred communication" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {COMM_METHODS.map(({ value, title, description }) => (
                      <MethodOption
                        key={value}
                        title={title}
                        description={description}
                        selected={preferred === value}
                        onSelect={() =>
                          setValue('preferred_communication', preferred === value ? '' : value, {
                            shouldDirty: true,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="flex items-center gap-3 mb-6">
                    <BrainCog size={22} className="text-brand-600 shrink-0" />
                    <h2 className="text-xl font-semibold text-slate-900">
                      Communication Preferences
                    </h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="communication_helps"
                        className="text-sm font-medium text-slate-600 tracking-wide"
                      >
                        Tell us what helps communication work well for you.
                      </label>
                      <textarea
                        id="communication_helps"
                        placeholder={HELPS_PLACEHOLDER}
                        className="bg-white border border-slate-300 rounded-xl p-4 h-62.5 resize-none text-base text-slate-900 placeholder:text-gray-500 outline-none focus:border-brand-600 transition-colors"
                        {...register('communication_helps')}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="additional_needs"
                        className="text-sm font-medium text-slate-600 tracking-wide"
                      >
                        Additional Communication Needs
                      </label>
                      <input
                        id="additional_needs"
                        type="text"
                        placeholder="Sensory preferences, topics to avoid, etc."
                        className="bg-white border border-slate-300 rounded-xl px-4 py-3 text-base text-slate-900 placeholder:text-gray-500 outline-none focus:border-brand-600 transition-colors"
                        {...register('additional_needs')}
                      />
                    </div>
                  </div>
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
                  <h3 className="text-base font-semibold text-[#006c49] mb-3">Your Information</h3>
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
                    <h3 className="text-base font-semibold text-[#2a1700]">Need Help?</h3>
                  </div>
                  <div className="flex flex-col gap-4">
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
