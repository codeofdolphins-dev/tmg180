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
  Accessibility,
  ChevronDown,
  Map,
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

const EQUIPMENT = [
  { label: 'Walker', active: true },
  { label: 'Mobility Scooter', active: false },
  { label: 'Crutches', active: false },
  { label: 'Orthotics', active: false },
  { label: 'Other', active: false },
  { label: 'None', active: false },
];

const ACCESS_PLACEHOLDER =
  'For example:\n\n• Step-free access\n• Wide doorways\n• Accessible parking\n• Accessible toilets\n• Lift access';

const ENVIRONMENT_TOGGLES = [
  {
    title: 'Avoid stairs or steep inclines?',
    helper: 'Select if this helps you access places more comfortably.',
  },
  {
    title: 'Need regular seating or rest breaks?',
    helper: 'Select if regular opportunities to rest are important to you.',
  },
];

const HELP_PARAGRAPHS = [
  'Describe your mobility needs in your own words.',
  'There are no right or wrong answers.',
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

function SelectField({ label, value }) {
  return (
    <div className="flex-1 flex flex-col gap-2">
      <p className="text-sm font-semibold text-[#0b1c30]">{label}</p>
      <div className="flex items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3">
        <span className="text-sm text-[#0b1c30]">{value}</span>
        <ChevronDown size={18} className="text-slate-500 shrink-0" />
      </div>
    </div>
  );
}

function ToggleRow({ title, helper }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-[#e5eeff] px-4 py-4">
      <div>
        <p className="text-base font-medium text-[#0b1c30]">{title}</p>
        <p className="text-xs text-[#434655] mt-1">{helper}</p>
      </div>
      <span className="relative w-12 h-6 rounded-full bg-brand-600 shrink-0">
        <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white" />
      </span>
    </div>
  );
}

export default function ProfileMobilityAccess() {
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
                Mobility &amp; transport
              </h1>
              <p className="text-lg text-[#434655] max-w-xl">
                Tell us how you get around, any mobility equipment you use, and anything
                that helps you access places safely and comfortably.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_275px] gap-6 items-start">
              <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-8 flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Accessibility size={18} className="text-brand-600" />
                    <h2 className="text-base font-semibold text-[#0b1c30]">
                      Mobility Equipment
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {EQUIPMENT.map((item) => (
                      <button
                        key={item.label}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          item.active
                            ? 'bg-brand-600 text-white'
                            : 'border border-slate-300 bg-white text-[#0b1c30] hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-[#0b1c30]">
                    Specific Access Requirements
                  </p>
                  <p className="text-xs text-[#434655]">
                    Example: Need level access, wide doorways, or specific parking
                    requirements.
                  </p>
                  <div className="rounded-xl border border-slate-300 bg-white p-4 h-79.5 mt-1">
                    <p className="text-base text-[#6b7280] whitespace-pre-line mt-25">
                      {ACCESS_PLACEHOLDER}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <SelectField
                    label="Preferred Travel Method"
                    value="Private Accessible Vehicle"
                  />
                  <SelectField label="Transfer Assistance" value="Requires 1:1 Assistance" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Map size={18} className="text-brand-600" />
                    <h2 className="text-base font-bold text-[#0b1c30]">
                      Environmental Preferences
                    </h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    {ENVIRONMENT_TOGGLES.map((t) => (
                      <ToggleRow key={t.title} {...t} />
                    ))}
                  </div>
                </div>
              </section>

              <div className="flex flex-col gap-6">
                <section className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-bold text-brand-600 mb-4">
                    Personal Profile Status
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="bg-[#dce9ff] rounded-full px-4 py-1.5 text-base font-medium text-[#434655]">
                      In progress
                    </span>
                    <span className="text-lg text-[#434655]">04/11</span>
                  </div>
                </section>

                <section className="bg-white/80 rounded-xl border border-slate-100 shadow-sm p-6">
                  <h3 className="text-base font-bold text-[#006c49] mb-3">
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
              <button onClick={() => navigate(PARTICIPANT_PATHS.profileDailyLiving)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-base text-[#434655] hover:bg-slate-50 transition-colors">
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
