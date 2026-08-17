import {
  Accessibility,
  ChevronDown,
  Map,
  Lightbulb,
  TriangleAlert,
} from 'lucide-react';

import ProfileSectionFooter from '../../components/participant/ProfileSectionFooter';
import { toggleInList, useSectionForm } from '../../hooks/participant/profile';

/** Values match the mobility_equipment options in @tmg180/shared. */
const EQUIPMENT = [
  { value: 'walker', label: 'Walker' },
  { value: 'mobility_scooter', label: 'Mobility Scooter' },
  { value: 'crutches', label: 'Crutches' },
  { value: 'orthotics', label: 'Orthotics' },
  { value: 'other', label: 'Other' },
  { value: 'none', label: 'None' },
];

const TRAVEL_OPTIONS = [
  { value: 'private_accessible_vehicle', label: 'Private Accessible Vehicle' },
  { value: 'public_transport', label: 'Public Transport' },
  { value: 'taxi_rideshare', label: 'Taxi / Rideshare' },
  { value: 'community_transport', label: 'Community Transport' },
  { value: 'walking', label: 'Walking' },
  { value: 'other', label: 'Other' },
];

const TRANSFER_OPTIONS = [
  { value: 'independent', label: 'Independent' },
  { value: 'standby_supervision', label: 'Standby Supervision' },
  { value: 'requires_1_1_assistance', label: 'Requires 1:1 Assistance' },
  { value: 'requires_2_person_assistance', label: 'Requires 2-Person Assistance' },
  { value: 'hoist_transfer', label: 'Hoist Transfer' },
];

const ACCESS_PLACEHOLDER =
  'For example:\n\n• Step-free access\n• Wide doorways\n• Accessible parking\n• Accessible toilets\n• Lift access';

const ENVIRONMENT_TOGGLES = [
  {
    key: 'avoid_stairs',
    title: 'Avoid stairs or steep inclines?',
    helper: 'Select if this helps you access places more comfortably.',
  },
  {
    key: 'rest_breaks',
    title: 'Need regular seating or rest breaks?',
    helper: 'Select if regular opportunities to rest are important to you.',
  },
];

const HELP_PARAGRAPHS = [
  'Describe your mobility needs in your own words.',
  'There are no right or wrong answers.',
  'You can update this information whenever things change.',
];

function SelectField({ label, placeholder, options, ...field }) {
  return (
    <div className="flex-1 flex flex-col gap-2">
      <label htmlFor={field.name} className="text-sm font-semibold text-[#0b1c30]">
        {label}
      </label>
      <div className="relative">
        <select
          id={field.name}
          className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm text-[#0b1c30] outline-none focus:border-brand-600 transition-colors"
          {...field}
        >
          <option value="">{placeholder}</option>
          {options.map(({ value, label: optionLabel }) => (
            <option key={value} value={value}>
              {optionLabel}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
        />
      </div>
    </div>
  );
}

function ToggleRow({ title, helper, on, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-[#e5eeff] px-4 py-4">
      <div>
        <p className="text-base font-medium text-[#0b1c30]">{title}</p>
        <p className="text-xs text-[#434655] mt-1">{helper}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={title}
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full shrink-0 transition-colors ${
          on ? 'bg-brand-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
            on ? 'right-1' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function ProfileMobilityAccess() {
  const section = useSectionForm('mobility-access');
  const { status, position, error } = section;
  const { register, watch, setValue } = section.form;
  const equipment = watch('mobility_equipment') ?? [];

  return (
    <div className="max-w-236 mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-[#0b1c30]">
                Mobility &amp; transport
              </h1>
              <p className="text-base text-[#434655] max-w-xl">
                Tell us how you get around, any mobility equipment you use, and anything
                that helps you access places safely and comfortably.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_275px] gap-6 items-start">
              <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8 flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Accessibility size={18} className="text-brand-600" />
                    <h2 className="text-xl font-semibold text-[#0b1c30]">
                      Mobility Equipment
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {EQUIPMENT.map(({ value, label }) => {
                      const active = equipment.includes(value);
                      return (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={active}
                          onClick={() =>
                            setValue('mobility_equipment', toggleInList(equipment, value), {
                              shouldDirty: true,
                            })
                          }
                          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                            active
                              ? 'bg-brand-600 text-white'
                              : 'border border-slate-300 bg-white text-[#0b1c30] hover:bg-slate-50'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="access_requirements" className="text-sm font-semibold text-[#0b1c30]">
                    Specific Access Requirements
                  </label>
                  <p className="text-xs text-[#434655]">
                    Example: Need level access, wide doorways, or specific parking
                    requirements.
                  </p>
                  <textarea
                    id="access_requirements"
                    placeholder={ACCESS_PLACEHOLDER}
                    className="rounded-xl border border-slate-300 bg-white p-4 h-79.5 mt-1 resize-none text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-brand-600 transition-colors"
                    {...register('access_requirements')}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <SelectField
                    label="Preferred Travel Method"
                    placeholder="Choose your preferred method"
                    options={TRAVEL_OPTIONS}
                    {...register('travel_method')}
                  />
                  <SelectField
                    label="Transfer Assistance"
                    placeholder="Choose what applies to you"
                    options={TRANSFER_OPTIONS}
                    {...register('transfer_assistance')}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Map size={18} className="text-brand-600" />
                    <h2 className="text-xl font-semibold text-[#0b1c30]">
                      Environmental Preferences
                    </h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    {ENVIRONMENT_TOGGLES.map(({ key, title, helper }) => {
                      const on = watch(key) ?? false;
                      return (
                        <ToggleRow
                          key={key}
                          title={title}
                          helper={helper}
                          on={on}
                          onToggle={() => setValue(key, !on, { shouldDirty: true })}
                        />
                      );
                    })}
                  </div>
                </div>
              </section>

              <div className="flex flex-col gap-6">
                <section className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-base font-semibold text-brand-600 mb-4">
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
                  <h3 className="text-base font-semibold text-[#006c49] mb-3">
                    Your Information
                  </h3>
                  <p className="text-base text-[#434655]">
                    You can update this information whenever your mobility needs or
                    preferences change.
                  </p>
                </section>

                <section className="bg-[#ffddb8] border border-orange-300 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Lightbulb size={18} className="text-[#2a1700]" />
                    <h3 className="text-base font-semibold text-[#2a1700]">Need Help?</h3>
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
