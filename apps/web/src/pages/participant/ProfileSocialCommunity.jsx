import { Users, Shapes, Check, Lightbulb, TriangleAlert } from 'lucide-react';

import ProfileSectionFooter from '../../components/participant/ProfileSectionFooter';
import { toggleInList, useSectionForm } from '../../hooks/participant/profile';

const ACTIVITIES_PLACEHOLDER =
  'For example: spending time with friends, attending community events, playing sport, volunteering, or participating in hobbies.';

/**
 * Values match the community_activities options in @tmg180/shared. The Figma
 * frame lists Volunteering and Community Groups twice; deduplicated here.
 */
const COMMUNITY_ACTIVITIES = [
  { value: 'sport_recreation', label: 'Sport & Recreation' },
  { value: 'arts_crafts', label: 'Arts & Crafts' },
  { value: 'music', label: 'Music' },
  { value: 'reading', label: 'Reading' },
  { value: 'gardening', label: 'Gardening' },
  { value: 'volunteering', label: 'Volunteering' },
  { value: 'community_groups', label: 'Community Groups' },
  { value: 'outdoor_activities', label: 'Outdoor Activities' },
  { value: 'faith_spiritual', label: 'Faith & Spiritual Activities' },
  { value: 'other', label: 'Other' },
];

const INFO_PARAGRAPHS = [
  'Your social participation information belongs to you.',
  "Share only what you're comfortable sharing.",
  'You can update this information whenever your interests or activities change.',
];

const HELP_PARAGRAPHS = [
  'There are no right or wrong answers.',
  'Tell us about the people, activities and community connections that are important to you.',
  'You can update this information whenever things change.',
];

export default function ProfileSocialCommunity() {
  const section = useSectionForm('social-community');
  const { status, position, error } = section;
  const { register, watch, setValue } = section.form;
  const activities = watch('community_activities') ?? [];

  return (
    <div className="max-w-236 mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] leading-10 font-semibold text-[#0b1c30]">
          Social Participation
        </h1>
        <p className="text-base text-[#434655] max-w-2xl">
          Tell us about how you connect with family, friends, and your community, and
          any support that helps you participate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="flex flex-col gap-8">
          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-600/10 flex items-center justify-center shrink-0">
                <Users size={20} className="text-brand-600" />
              </div>
              <h2 className="text-2xl font-semibold text-[#0b1c30]">
                Community Participation
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <label htmlFor="spend_time_with" className="text-base text-[#434655]">
                  Tell us about the people, places and activities that are important to
                  you.
                </label>
                <input
                  id="spend_time_with"
                  type="text"
                  placeholder="Who do you usually spend time with?"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-3.5 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-brand-600 transition-colors"
                  {...register('spend_time_with')}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="enjoyed_activities" className="text-base text-[#434655]">
                  What activities do you enjoy?
                </label>
                <textarea
                  id="enjoyed_activities"
                  placeholder={ACTIVITIES_PLACEHOLDER}
                  className="rounded-lg border border-slate-300 bg-white p-4 min-h-32 resize-none text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:border-brand-600 transition-colors"
                  {...register('enjoyed_activities')}
                />
              </div>
            </div>
          </section>

          <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-4">
              <Shapes size={24} className="text-brand-600 shrink-0" />
              <h2 className="text-2xl font-semibold text-[#0b1c30]">
                Community Activities
              </h2>
            </div>
            <p className="text-base text-[#434655] mb-5">
              Select any activities or interests that are important to you
            </p>
            <div className="flex flex-wrap gap-3">
              {COMMUNITY_ACTIVITIES.map(({ value, label }) => {
                const selected = activities.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setValue('community_activities', toggleInList(activities, value), {
                        shouldDirty: true,
                      })
                    }
                    className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-base transition-colors ${
                      selected
                        ? 'bg-brand-600 text-white hover:bg-brand-700'
                        : 'bg-white border border-slate-300 text-[#434655] hover:bg-slate-50'
                    }`}
                  >
                    {label}
                    {selected && <Check size={14} strokeWidth={3} />}
                  </button>
                );
              })}
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
                <p key={p} className="text-base italic text-[#653e00]">
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
