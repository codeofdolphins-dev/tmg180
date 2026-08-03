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
  Users,
  PersonStanding,
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

const DECISIONS_PLACEHOLDER =
  'For example: I like time to think, written information, talking things through with someone I trust, or seeing all my options.';

const ANYTHING_ELSE_PLACEHOLDER =
  'Tell us anything else that helps you feel confident when making choices.';

const INVOLVED_OPTIONS = [
  'My Family',
  'Legal Guardian',
  'Close Friends',
  'My Care Coordinator',
];

const PREFERENCE_CHIPS = [
  { label: 'Speed', selected: false },
  { label: 'Having all details', selected: true },
  { label: 'Quiet reflection', selected: false },
  { label: 'Expert advice', selected: false },
  { label: 'Family consensus', selected: false },
];

const INFO_PARAGRAPHS = [
  'Your safety and support information belongs to you.',
  "Share only what you're comfortable sharing.",
  'You can update this information whenever your support needs or emergency contacts change.',
];

const HELP_PARAGRAPHS = [
  'There are no right or wrong answers.',
  'Tell us what helps you feel safe and supported.',
  'You can update this information whenever your preferences change.',
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

export default function ProfileDecisionMaking() {
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
                Decision Making
              </h1>
              <p className="text-base text-[#434655] max-w-2xl">
                Help us understand how you like to make choices and who you'd like to
                support you in your journey.
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
                      Decision Support
                    </h2>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium text-[#434655]">
                        What helps you make important decisions?
                      </p>
                      <div className="rounded-lg border border-slate-300 bg-white p-4 min-h-26.5">
                        <p className="text-base text-[#6b7280]">{DECISIONS_PLACEHOLDER}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <p className="text-sm font-medium text-[#434655]">
                        Who should be involved in big decisions?
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {INVOLVED_OPTIONS.map((label) => (
                          <div
                            key={label}
                            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-4"
                          >
                            <span className="w-4.5 h-4.5 rounded-sm border border-slate-400 bg-white shrink-0" />
                            <span className="text-base text-[#0b1c30]">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-purple-600/10 flex items-center justify-center shrink-0">
                      <PersonStanding size={20} className="text-brand-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#0b1c30]">
                      Decision Preferences
                    </h2>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <p className="text-sm font-medium text-[#434655]">
                        When making a choice, I value:
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {PREFERENCE_CHIPS.map(({ label, selected }) => (
                          <button
                            key={label}
                            className={`rounded-full px-5 py-2.5 text-base transition-colors ${
                              selected
                                ? 'bg-brand-600 text-white hover:bg-brand-700'
                                : 'bg-white border border-slate-300 text-[#434655] hover:bg-slate-50'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium text-[#434655]">
                        Is there anything else that helps you make decisions?
                      </p>
                      <div className="rounded-lg border border-slate-300 bg-white p-4 min-h-26.5">
                        <p className="text-base text-[#6b7280]">
                          {ANYTHING_ELSE_PLACEHOLDER}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="flex flex-col gap-6">
                <section className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-bold text-brand-600 mb-4">
                    Personal Profile Status
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="bg-[#c3f3d7] rounded-full px-4 py-1.5 text-base font-medium text-[#05603a]">
                      Completed
                    </span>
                    <span className="text-lg text-[#434655]">11/11</span>
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
                      <p key={p} className="text-base text-[#854d0e]">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-8 flex items-center justify-between">
              <button onClick={() => navigate(PARTICIPANT_PATHS.profileSafetySupport)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-base text-[#434655] hover:bg-slate-50 transition-colors">
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
