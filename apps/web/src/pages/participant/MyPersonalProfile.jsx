import {
  ArrowRight,
  Accessibility,
  BookOpenText,
  Check,
  Flag,
  Heart,
  HeartPulse,
  Home,
  LayoutGrid,
  Scale,
  Shield,
  Speech,
  Users,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { PROFILE_SECTIONS, PROFILE_SECTION_STATUS } from '@tmg180/shared';
import { FIRST_SECTION_PATH, SECTION_PATHS, useProfile } from '../../hooks/participant/profile';

/**
 * My Personal Profile — the hub of the one living profile (Final Override P1).
 * Cards come straight from the contract in @tmg180/shared: seed order, seed
 * titles, seed plain-language descriptions. Only the icons and the layout
 * variants live here.
 */
const SECTION_ICONS = {
  overview: BookOpenText,
  about_me: LayoutGrid,
  communication: Speech,
  what_matters: Heart,
  goals: Flag,
  daily_living: Home,
  mobility_access: Accessibility,
  health_wellbeing: HeartPulse,
  social_community: Users,
  decision_making: Scale,
  safety_preferences: Shield,
};

/** Layout rhythm for the card grid; everything else is contract-driven. */
const VARIANT_BY_KEY = {
  overview: 'featured',
  what_matters: 'wide',
  health_wellbeing: 'wide',
};

const SECTIONS = PROFILE_SECTIONS.map((section) => ({
  key: section.key,
  title: section.title,
  description: section.description,
  icon: SECTION_ICONS[section.key] ?? LayoutGrid,
  variant: VARIANT_BY_KEY[section.key] ?? 'small',
}));

function StatusBadge({ status }) {
  if (status === PROFILE_SECTION_STATUS.COMPLETE) {
    return (
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="text-base text-[#006c49]">Completed</span>
        <span className="w-5 h-5 rounded-full bg-[#006c49] flex items-center justify-center">
          <Check size={12} className="text-white" strokeWidth={3} />
        </span>
      </div>
    );
  }
  if (status === PROFILE_SECTION_STATUS.IN_PROGRESS) {
    return (
      <div className="mt-auto pt-4">
        <span className="text-[10px] font-bold tracking-wide text-[#7800ce] bg-purple-600/10 rounded px-2 py-1">
          IN PROGRESS
        </span>
      </div>
    );
  }
  return null;
}

function SectionCard({ variant, title, description, icon: Icon, status, onOpen }) {
  if (variant === 'featured') {
    return (
      <div
        onClick={onOpen}
        className="col-span-2 row-span-2 flex flex-col bg-white/80 border border-slate-200 rounded-xl p-5 shadow-sm cursor-pointer"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#7800ce] flex items-center justify-center mb-4">
          <Icon size={24} className="text-white" />
        </div>
        <h3 className="text-base font-semibold text-[#0b1c30] mb-3">{title}</h3>
        <p className="text-base text-[#434655]">{description}</p>
        <StatusBadge status={status} />
      </div>
    );
  }

  if (variant === 'wide') {
    return (
      <div
        onClick={onOpen}
        className="col-span-2 flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm cursor-pointer"
      >
        <div className="w-14 h-14 rounded-full bg-purple-600/8 flex items-center justify-center shrink-0">
          <Icon size={22} className="text-[#7800ce]" />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="text-base font-semibold text-[#0b1c30]">{title}</h3>
          <p className="text-sm text-[#434655]">{description}</p>
          <StatusBadge status={status} />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onOpen}
      className="flex flex-col bg-white border border-slate-200 rounded-xl p-5 shadow-sm cursor-pointer"
    >
      <Icon size={20} className="text-[#7800ce] mb-3" />
      <h3 className="text-base font-semibold text-[#0b1c30] mb-3">{title}</h3>
      <p className="text-sm text-[#434655]">{description}</p>
      <StatusBadge status={status} />
    </div>
  );
}

export default function MyPersonalProfile() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();

  const completed = profile?.completedSections ?? 0;
  const total = profile?.totalSections ?? SECTIONS.length;
  const lastKey = profile?.lastSectionKey ?? null;
  const lastSection = SECTIONS.find((section) => section.key === lastKey) ?? null;
  const started = Boolean(lastSection);

  const isComplete = completed >= total;
  const overall = isComplete ? 'Complete' : started || completed > 0 ? 'In progress' : 'Not started';

  // Continue where you left off (P1-01); a fresh profile starts at the top.
  const continueTo = SECTION_PATHS[lastKey] ?? FIRST_SECTION_PATH;

  return (
    <div className="max-w-236 mx-auto flex flex-col gap-8">
      <div className="flex items-start gap-6">
        <div className="flex-1 flex flex-col gap-2">
          <span className="text-base text-[#004ac6]">My Personal Profile</span>
          <h1 className="text-3xl font-bold text-[#0b1c30]">
            My Personal Profile
          </h1>
          <p className="text-base text-[#434655] max-w-2xl">
            Your profile belongs to you. Your profile grows over time — every section you add
            gives meaning to your Daily Logs and Monthly Snapshots. You can complete it at your
            own pace and return whenever you're ready.
          </p>
        </div>
        <div className="w-74.75 shrink-0 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col gap-4">
          <span className="text-base text-[#434655]">Profile Completion</span>
          <span className="w-fit text-base font-medium text-[#434655] bg-[#dce9ff] rounded-full px-4 py-1.5">
            {overall}
          </span>
          <span className="text-sm text-[#434655]">
            {completed} of {total} sections completed
          </span>
        </div>
      </div>

      {/* Once every section is complete there is nothing to continue — hide the card. */}
      {!isComplete && (
      <div className="flex items-center gap-10 rounded-3xl bg-linear-to-br from-[#ece5fb] via-[#e9e4fa] to-[#e2e2f9] shadow-[0_18px_40px_rgb(120,0,206,0.12)] p-8">
        <div className="flex-1 flex flex-col gap-3">
          {/* Handoff Mapping v1.1 §3: the profile's own primary action is "Continue My
              Profile"; the dashboard's (§5) is "Continue My Personal Profile". */}
          <h2 className="text-xl font-semibold text-black">Continue My Profile</h2>
          {started ? (
            <>
              <p className="text-base text-black">
                Your last saved section: <span className="font-semibold">{lastSection.title}</span>
              </p>
              <p className="text-base text-black">Continue from where you left off.</p>
            </>
          ) : (
            <p className="text-base text-black">
              You haven't started yet — begin with the Overview.
            </p>
          )}
          <div className="flex items-center gap-4 pt-3">
            <button
              onClick={() => navigate(continueTo)}
              className="flex items-center gap-2 bg-white text-[#004ac6] text-base font-medium rounded-full px-8 py-3 shadow-sm hover:bg-blue-50 transition-colors"
            >
              {started ? 'Continue' : 'Get started'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <div className="w-70.75 h-39.75 overflow-hidden rounded-xl">
          <img src="/images/img.jpg" alt="" className='w-full h-full object-cover' />
        </div>
      </div>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-xl text-[#0b1c30] font-semibold">Your Profile Sections</h2>
        <div className="grid grid-cols-4 gap-6">
          {SECTIONS.map((section) => (
            <SectionCard
              key={section.key}
              {...section}
              status={profile?.sections?.[section.key]?.status}
              onOpen={() => navigate(SECTION_PATHS[section.key])}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
