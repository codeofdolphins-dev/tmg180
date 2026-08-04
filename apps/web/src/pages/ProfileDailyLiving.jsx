import {
  Sun,
  PersonStanding,
  Utensils,
  ShoppingBag,
  BrushCleaning,
  Bus,
  Check,
  Lightbulb,
  TriangleAlert,
} from 'lucide-react';

import ProfileSectionFooter from '../components/ProfileSectionFooter';
import { toggleInList, useSectionForm } from '../hooks/profile';

const MORNING_PLACEHOLDER =
  'For example:\n\n• I usually wake up around 7am.\n• I prepare breakfast independently.\n• I need help getting dressed.';

const EVENING_PLACEHOLDER =
  'For example:\n\n• I usually go to bed around 10pm.\n• I like a quiet room.\n• I need reminders to take my medication.';

/** Values match the daily_activities options in @tmg180/shared. */
const ACTIVITIES = [
  { value: 'meal_preparation', label: 'Meal Preparation', icon: Utensils },
  { value: 'community_access', label: 'Community Access', icon: ShoppingBag },
  { value: 'household_chores', label: 'Household Chores', icon: BrushCleaning },
  { value: 'public_transport', label: 'Public Transport', icon: Bus },
];

const INFO_PARAGRAPHS = [
  'The information you share belongs to you.',
  "Share only what you're comfortable sharing.",
  'You can update this section whenever your routines change.',
];

const HELP_PARAGRAPHS = [
  'There are no right or wrong answers.',
  'Describe your routine in your own words.',
  'You can update this information whenever things change.',
];

function RoutineField({ label, placeholder, ...field }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={field.name} className="text-base text-[#434655]">
        {label}
      </label>
      <textarea
        id={field.name}
        placeholder={placeholder}
        className="rounded-lg border border-slate-300 bg-white p-3.5 min-h-43 resize-none text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-brand-600 transition-colors"
        {...field}
      />
    </div>
  );
}

function ActivityTile({ icon: Icon, label, checked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={`flex items-center justify-between rounded-xl border px-4 py-4 text-left transition-colors ${
        checked ? 'bg-[#006c49]/5 border-emerald-700' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={checked ? 'text-emerald-800' : 'text-emerald-900'} />
        <span className="text-base text-[#0b1c30]">{label}</span>
      </div>
      {checked ? (
        <span className="w-4.5 h-4.5 rounded bg-brand-600 flex items-center justify-center shrink-0">
          <Check size={12} strokeWidth={3} className="text-white" />
        </span>
      ) : (
        <span className="w-4 h-4 rounded border border-slate-300 bg-white shrink-0" />
      )}
    </button>
  );
}

export default function ProfileDailyLiving() {
  const section = useSectionForm('daily-living');
  const { status, position, error } = section;
  const { register, watch, setValue } = section.form;
  const selected = watch('daily_activities') ?? [];

  return (
    <div className="max-w-236 mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-[32px] leading-10 font-semibold text-[#0b1c30]">
                Daily Living
              </h1>
              <p className="text-base text-[#434655] max-w-2xl">
                Tell us about your daily routines, what works well for you, and any support
                you use in everyday life.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
              <div className="flex flex-col gap-6">
                <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Sun size={22} className="text-brand-600" />
                    <h2 className="text-2xl font-semibold text-[#0b1c30]">Daily Routine</h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    <RoutineField
                      label="Tell us about your morning routine."
                      placeholder={MORNING_PLACEHOLDER}
                      {...register('morning_routine')}
                    />
                    <RoutineField
                      label="Tell us about your evening routine."
                      placeholder={EVENING_PLACEHOLDER}
                      {...register('evening_routine')}
                    />
                  </div>
                </section>

                <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
                  <div className="flex items-start gap-3 mb-4">
                    <PersonStanding size={22} className="text-brand-600 shrink-0 mt-1.5" />
                    <h2 className="text-2xl font-semibold text-[#0b1c30]">
                      Tell us which daily activities you do independently and where you use
                      support.
                    </h2>
                  </div>
                  <p className="text-base text-[#434655] mb-5">
                    Select areas where you value your independence the most, and where you
                    welcome support.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ACTIVITIES.map(({ value, label, icon }) => (
                      <ActivityTile
                        key={value}
                        icon={icon}
                        label={label}
                        checked={selected.includes(value)}
                        onToggle={() =>
                          setValue('daily_activities', toggleInList(selected, value), {
                            shouldDirty: true,
                          })
                        }
                      />
                    ))}
                  </div>
                </section>
              </div>

              <div className="flex flex-col gap-6">
                <section className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-bold text-brand-600 mb-4">
                    Personal Profile Status
                  </h3>
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-4 py-1.5 text-base font-medium ${
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
                    <span className="text-lg text-[#434655]">{position}</span>
                  </div>
                </section>

                <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-6">
                  <h3 className="text-base font-bold text-[#006c49] mb-3">
                    Your Information
                  </h3>
                  <div className="flex flex-col gap-3">
                    {INFO_PARAGRAPHS.map((p) => (
                      <p key={p} className="text-base text-[#434655]">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>

                <section className="bg-[#ffddb8] border border-orange-300 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Lightbulb size={18} className="text-[#2a1700]" />
                    <h3 className="text-base font-bold text-[#2a1700]">Need Help?</h3>
                  </div>
                  <div className="flex flex-col gap-4">
                    {HELP_PARAGRAPHS.map((p) => (
                      <p key={p} className="text-sm italic text-[#653e00]">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
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
