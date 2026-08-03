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
  Sun,
  PersonStanding,
  Utensils,
  ShoppingBag,
  BrushCleaning,
  Bus,
  Check,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
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

const MORNING_PLACEHOLDER =
  'For example:\n\n• I usually wake up around 7am.\n• I prepare breakfast independently.\n• I need help getting dressed.';

const EVENING_PLACEHOLDER =
  'For example:\n\n• I usually go to bed around 10pm.\n• I like a quiet room.\n• I need reminders to take my medication.';

const ACTIVITIES = [
  { label: 'Meal Preparation', icon: Utensils, checked: false },
  { label: 'Community Access', icon: ShoppingBag, checked: true },
  { label: 'Household Chores', icon: BrushCleaning, checked: true },
  { label: 'Public Transport', icon: Bus, checked: false },
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

function NavItem({ icon: Icon, label, active, small }) {
  const go = useRoleNav('participant');
  return (
    <button
      onClick={() => go(label)}
      className={`w-full flex items-center gap-3 px-4 text-left rounded-full transition-colors ${
        small ? 'py-2 text-xs font-bold' : 'py-3 text-sm'
      } ${
        active
          ? 'bg-purple-600/30 text-brand-700 font-bold'
          : 'text-[#4d4354] hover:bg-slate-100'
      }`}
    >
      <Icon size={small ? 15 : 17} className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}

function RoutineField({ label, placeholder }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-base text-[#434655]">{label}</p>
      <div className="rounded-lg border border-slate-300 bg-white p-3.5 min-h-43">
        <p className="text-base text-[#6b7280] whitespace-pre-line">{placeholder}</p>
      </div>
    </div>
  );
}

function ActivityTile({ icon: Icon, label, checked }) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-4 py-4 ${
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
    </div>
  );
}

export default function ProfileDailyLiving() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex bg-[#f8f9ff] font-sans text-slate-800">
      <aside className="w-64 shrink-0 bg-[#f8f9ff]/70 backdrop-blur-sm border-r border-slate-100 flex flex-col py-6 px-6">
        <div className="flex items-center gap-3 mb-10 px-1">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand-600 to-purple-500 shadow flex items-center justify-center shrink-0">
            <Flower2 size={20} className="text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-brand-600 leading-none">TMG180</div>
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

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 bg-[#f8f9ff] border-b border-slate-200/70 flex items-center justify-end px-10">
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#434655] hover:bg-white transition-colors">
            <Settings size={20} />
          </button>
        </header>

        <main className="flex-1 px-10 py-8">
          <div className="max-w-236 flex flex-col gap-8">
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
                    />
                    <RoutineField
                      label="Tell us about your evening routine."
                      placeholder={EVENING_PLACEHOLDER}
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
                    {ACTIVITIES.map((a) => (
                      <ActivityTile key={a.label} {...a} />
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
                    <span className="bg-[#dce9ff] rounded-full px-4 py-1.5 text-base font-medium text-[#434655]">
                      In progress
                    </span>
                    <span className="text-lg text-[#434655]">03/11</span>
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

            <div className="border-t border-slate-200 pt-8 flex items-center justify-between">
              <button onClick={() => navigate(PARTICIPANT_PATHS.profileMyGoals)} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-base text-[#434655] hover:bg-slate-50 transition-colors">
                <ArrowLeft size={16} />
                Previous
              </button>
              <div className="flex items-center gap-4">
                <button onClick={() => navigate(PARTICIPANT_PATHS.profile)} className="rounded-full border border-brand-600 bg-white px-8 py-3 text-base text-brand-600 hover:bg-brand-50 transition-colors">
                  Save &amp; Exit
                </button>
                <button onClick={() => navigate(PARTICIPANT_PATHS.profileMobilityAccess)} className="flex items-center gap-2 rounded-full bg-brand-600 px-8 py-3 text-base text-white hover:bg-brand-700 transition-colors">
                  Save &amp; Continue
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
