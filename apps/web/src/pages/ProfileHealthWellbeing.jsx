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
  Move,
  Smile,
  Angry,
  Frown,
  Meh,
  Laugh,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Mail,
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

const SHARE_PLACEHOLDER =
  'Share anything that helps us understand your day-to-day health or wellbeing.';

const CURRENT_SUPPORT = [
  'Medication',
  'Physiotherapy',
  'Psychology',
  'Occupational Therapy',
  'Exercise Plan',
  'Support Worker',
  'Other',
];

const MOODS = [
  { label: 'Very unhappy', icon: Angry, tone: 'text-red-600', selected: false },
  { label: 'Unhappy', icon: Frown, tone: 'text-amber-700', selected: false },
  { label: 'Okay', icon: Meh, tone: 'text-brand-600', selected: true },
  { label: 'Good', icon: Smile, tone: 'text-emerald-600', selected: false },
  { label: 'Great', icon: Laugh, tone: 'text-teal-600', selected: false },
];

const INFO_PARAGRAPHS = [
  'our health and wellbeing information belongs to you.',
  "Share only what you're comfortable sharing.",
  'You can update this information whenever your health or support needs change.',
];

const HELP_PARAGRAPHS = [
  'There are no right or wrong answers.',
  "Share only what you're feel comfortable sharing about your health and wellbeing.",
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

function TextareaField({ label, labelTone }) {
  return (
    <div className="flex flex-col gap-2">
      <p className={`text-sm font-medium ${labelTone}`}>{label}</p>
      <div className="rounded-lg border border-slate-300 bg-white p-4 min-h-26.5">
        <p className="text-base text-[#6b7280]">{SHARE_PLACEHOLDER}</p>
      </div>
    </div>
  );
}

export default function ProfileHealthWellbeing() {
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
                Health &amp; Wellbeing
              </h1>
              <p className="text-base text-[#434655] max-w-2xl">
                Tell us about your health, wellbeing, and any support that helps you stay
                healthy and participate in everyday life.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_275px] gap-6 items-start">
              <div className="flex flex-col gap-8">
                <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-purple-600/10 flex items-center justify-center shrink-0">
                      <Move size={20} className="text-brand-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#0b1c30]">
                      Physical Health &amp; Daily Wellbeing
                    </h2>
                  </div>

                  <div className="flex flex-col gap-8">
                    <TextareaField
                      label="Do you have any health conditions that affect your daily life?"
                      labelTone="text-[#434655]"
                    />

                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium text-[#0b1c30]">Current Support</p>
                      <div className="flex flex-wrap gap-2">
                        {CURRENT_SUPPORT.map((label) => (
                          <button
                            key={label}
                            className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 hover:bg-slate-50 transition-colors"
                          >
                            <span className="w-4.75 h-4.75 rounded-sm border border-slate-400 bg-white shrink-0" />
                            <span className="text-base text-[#434655]">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <TextareaField label="Anything else?" labelTone="text-[#434655]" />
                  </div>
                </section>

                <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Smile size={20} className="text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#0b1c30]">
                      Emotional Wellbeing
                    </h2>
                  </div>

                  <p className="text-sm font-medium text-[#434655] mb-2">
                    How have you been feeling recently?
                  </p>
                  <div className="flex gap-2">
                    {MOODS.map(({ label, icon: Icon, tone, selected }) => (
                      <button
                        key={label}
                        aria-label={label}
                        className={`w-14 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          selected
                            ? 'bg-purple-600/10 border border-brand-600'
                            : 'bg-[#e5eeff] hover:bg-[#d8e6ff]'
                        }`}
                      >
                        <Icon size={20} className={tone} />
                      </button>
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
                    <span className="text-lg text-[#434655]">09/11</span>
                  </div>
                </section>

                <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-6">
                  <h3 className="text-base font-bold text-[#006c49] mb-3">
                    Your Information
                  </h3>
                  <div className="flex flex-col gap-3">
                    {INFO_PARAGRAPHS.map((p) => (
                      <p key={p} className="text-base text-[#494453]">
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
                      <p key={p} className="text-base text-[#854d0e]">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-8 flex items-center justify-between">
              <button onClick={() => navigate(PARTICIPANT_PATHS.profileLearningEmployment)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-base text-[#434655] hover:bg-slate-50 transition-colors">
                <ArrowLeft size={16} />
                Previous
              </button>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-base font-bold text-[#434655] hover:bg-slate-50 transition-colors">
                  <Mail size={18} />
                  Save Draft
                </button>
                <button className="flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-3 text-base font-bold text-white hover:bg-brand-700 transition-colors">
                  Next Step
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
