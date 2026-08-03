import {
  LayoutDashboard,
  User,
  NotebookPen,
  CalendarDays,
  Search,
  HelpCircle,
  Lock,
  Settings,
  Flower2,
  ArrowRight,
  LayoutGrid,
  Flag,
  Home,
  Accessibility,
  Speech,
  Users,
  SquareActivity,
  Heart,
  HeartPulse,
  Shield,
  Check,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useRoleNav } from '../navigation/useRoleNav';
import { PARTICIPANT_PATHS } from '../routes/paths';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'My Profile', icon: User },
  { label: 'Daily Log', icon: NotebookPen },
  { label: 'Monthly Snapshot', icon: CalendarDays },
  { label: 'Browse Directory', icon: Search },
];

const BOTTOM_ITEMS = [
  { label: 'Help Centre', icon: HelpCircle },
  { label: 'Privacy & Sharing', icon: Lock },
];

const SECTIONS = [
  {
    variant: 'featured',
    title: 'About me',
    description: 'Tell us about yourself, your strengths, interests and what is important to you.',
    icon: LayoutGrid,
  },
  {
    variant: 'small',
    title: 'My goals',
    description: 'Share the goals that are important to you and what you would like to work towards.',
    icon: Flag,
  },
  {
    variant: 'small',
    title: 'Daily living',
    description: 'Tell us about your daily routines, household activities and any support you use.',
    icon: Home,
  },
  {
    variant: 'wide',
    title: 'Mobility & transport',
    description: 'Describe how you travel, move around and access places that are important to you.',
    icon: Accessibility,
  },
  {
    variant: 'small',
    title: 'Communication',
    description: 'Tell us how you prefer to communicate and what helps others understand you.',
    icon: Speech,
  },
  {
    variant: 'active',
    title: 'Social participation',
    description:
      'Share how you connect with family, friends and your community, and any support that helps you participate.',
    icon: Users,
  },
  {
    variant: 'small',
    title: 'Self-care',
    description:
      'Tell us about personal care activities such as dressing, bathing, eating and other daily routines.',
    icon: SquareActivity,
  },
  {
    variant: 'small',
    title: 'Learning & employment',
    description:
      'Tell us about learning, study, work or volunteering, and any support that helps you participate.',
    icon: Heart,
  },
  {
    variant: 'small',
    title: 'Health & wellbeing',
    description:
      'Share any health conditions, wellbeing needs or ongoing supports that are important for us to understand.',
    icon: HeartPulse,
  },
  {
    variant: 'small',
    title: 'Safety',
    description: 'Tell us about anything that helps you feel safe, secure and supported in everyday life.',
    icon: Shield,
  },
  {
    variant: 'small',
    title: 'My support network',
    description: 'Tell us about the people who support you and the roles they play in your life.',
    icon: Users,
  },
];

function NavItem({ icon: Icon, label, active, small }) {
  const go = useRoleNav('participant');
  const tone = small
    ? 'py-2 text-xs font-bold text-[#4d4354] hover:bg-slate-100'
    : active
      ? 'py-2.5 text-sm bg-purple-600/30 text-[#7800ce] font-bold'
      : 'py-2.5 text-sm text-[#4d4354] hover:bg-slate-100';
  return (
    <button
      onClick={() => go(label)}
      className={`w-full flex items-center gap-3 px-4 text-left rounded-full transition-colors ${tone}`}
    >
      <Icon size={16} className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}

const SECTION_PATHS = {
  'About me': PARTICIPANT_PATHS.profileAboutMe,
  'My goals': PARTICIPANT_PATHS.profileMyGoals,
  'Daily living': PARTICIPANT_PATHS.profileDailyLiving,
  'Mobility & transport': PARTICIPANT_PATHS.profileMobilityAccess,
  Communication: PARTICIPANT_PATHS.profileHowICommunicate,
  'Social participation': PARTICIPANT_PATHS.profileSocialCommunity,
  'Self-care': PARTICIPANT_PATHS.profileSelfCare,
  'Learning & employment': PARTICIPANT_PATHS.profileLearningEmployment,
  'Health & wellbeing': PARTICIPANT_PATHS.profileHealthWellbeing,
  Safety: PARTICIPANT_PATHS.profileSafetySupport,
  'My support network': PARTICIPANT_PATHS.profileDecisionMaking,
};

function SectionCard({ variant, title, description, icon: Icon, onOpen }) {
  if (variant === 'featured') {
    return (
      <div
        onClick={onOpen}
        className="col-span-2 row-span-2 flex flex-col bg-white/80 border border-slate-200 rounded-xl p-5 shadow-sm cursor-pointer"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#7800ce] flex items-center justify-center mb-4">
          <Icon size={24} className="text-white" />
        </div>
        <h3 className="text-lg font-medium text-[#0b1c30] mb-3">{title}</h3>
        <p className="text-base text-[#434655]">{description}</p>
        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="text-base text-[#006c49]">Completed</span>
          <span className="w-5 h-5 rounded-full bg-[#006c49] flex items-center justify-center">
            <Check size={12} className="text-white" strokeWidth={3} />
          </span>
        </div>
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
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-medium text-[#0b1c30]">{title}</h3>
          <p className="text-sm text-[#434655]">{description}</p>
        </div>
      </div>
    );
  }

  if (variant === 'active') {
    return (
      <div
        onClick={onOpen}
        className="col-span-2 flex flex-col bg-[#7800ce] rounded-xl p-5 shadow-lg cursor-pointer"
      >
        <div className="flex items-start justify-between mb-4">
          <Icon size={22} className="text-[#eeefff]" />
          <span className="text-[10px] font-bold tracking-wide text-[#eeefff] bg-white/20 rounded px-2 py-1">
            IN PROGRESS
          </span>
        </div>
        <h3 className="text-lg font-medium text-[#eeefff] mb-3">{title}</h3>
        <p className="text-sm text-[#eeefff]">{description}</p>
      </div>
    );
  }

  return (
    <div
      onClick={onOpen}
      className="flex flex-col bg-white border border-slate-200 rounded-xl p-5 shadow-sm cursor-pointer"
    >
      <Icon size={20} className="text-[#7800ce] mb-3" />
      <h3 className="text-lg font-medium text-[#0b1c30] mb-3">{title}</h3>
      <p className="text-sm text-[#434655]">{description}</p>
    </div>
  );
}

export default function MyPersonalProfile() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-800">
      <aside className="w-64 shrink-0 bg-[#f8f9ff]/70 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col py-6 px-6">
        <div className="flex items-center gap-3 mb-10 px-1">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#7800ce] to-purple-400 shadow flex items-center justify-center shrink-0">
            <Flower2 size={20} className="text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#7800ce] leading-tight">TMG180</div>
            <div className="text-xs font-bold text-[#4d4354] mt-1">Participant Portal</div>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'My Profile'} />
          ))}
        </nav>

        <div className="mt-auto pt-6 flex flex-col gap-1">
          {BOTTOM_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} small />
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 shrink-0 bg-[#f8f9ff] border-b border-slate-200/70 flex items-center justify-end px-10">
          <button className="text-[#434655] hover:text-slate-900 transition-colors">
            <Settings size={20} />
          </button>
        </header>

        <main className="flex-1 px-10 py-8">
          <div className="max-w-236 flex flex-col gap-8">
            <div className="flex items-start gap-6">
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-base text-[#004ac6]">Your Personal Profile</span>
                <h1 className="text-[32px] leading-10 font-semibold text-[#0b1c30]">
                  Your Personal Profile
                </h1>
                <p className="text-base text-[#434655] max-w-2xl">
                  Share information about your everyday life, what matters most to you, and the
                  supports that help you live well. You can complete your profile at your own pace
                  and return whenever you're ready.
                </p>
              </div>
              <div className="w-74.75 shrink-0 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col gap-4">
                <span className="text-base text-[#434655]">Profile Completion</span>
                <span className="w-fit text-base font-medium text-[#434655] bg-[#dce9ff] rounded-full px-4 py-1.5">
                  In progress
                </span>
              </div>
            </div>

            <div className="flex items-center gap-10 rounded-3xl bg-linear-to-br from-[#ece5fb] via-[#e9e4fa] to-[#e2e2f9] shadow-[0_18px_40px_rgb(120,0,206,0.12)] p-8">
              <div className="flex-1 flex flex-col gap-3">
                <h2 className="text-[22px] font-bold text-black">Continue Your Personal Profile</h2>
                <p className="text-base text-black">
                  Your last completed section:{' '}
                  <span className="font-semibold">Social Participation</span>
                </p>
                <p className="text-base text-black">Continue from where you left off.</p>
                <div className="flex items-center gap-4 pt-3">
                  <button className="flex items-center gap-2 bg-white text-[#004ac6] text-base font-medium rounded-full px-8 py-3 shadow-sm hover:bg-blue-50 transition-colors">
                    Continue
                    <ArrowRight size={16} />
                  </button>
                  <button className="text-[#7800ce] text-base font-medium rounded-full px-8 py-3 border border-white/60 bg-white/40 hover:bg-white/70 transition-colors">
                    Save &amp; Exit
                  </button>
                </div>
              </div>
              <div className="w-70.75 h-39.75 shrink-0 rounded-xl bg-linear-to-br from-[#2563eb] via-[#5b8def] to-[#9db8f5] shadow-md" />
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-base text-[#0b1c30]">Your Profile Sections</h2>
              <div className="grid grid-cols-4 gap-6">
                {SECTIONS.map((section) => (
                  <SectionCard
                    key={section.title}
                    {...section}
                    onOpen={() => navigate(SECTION_PATHS[section.title])}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
