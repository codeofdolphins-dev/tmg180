import {
  LayoutDashboard,
  User,
  NotebookPen,
  CalendarDays,
  Search,
  HelpCircle,
  Lock,
  Info,
  ChevronRight,
  Heart,
  Clock,
  MessageCircle,
  MapPin,
  Languages,
  Sparkles,
} from 'lucide-react';
import Button from '../components/ui/Button';

import { useRoleNav } from '../navigation/useRoleNav';
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

const SUPPORT_FOCUS = [
  'Daily living',
  'Mobility & transport',
  'Communication',
  'Social participation',
  'Self-care',
  'Learning & employment',
  'Health & wellbeing',
  'Safety',
];

const AVAILABILITY = ['Morning', 'Afternoon', 'Evening', 'Weekdays', 'Weekends', 'Flexible'];

const COMMUNICATION_FORMAT = [
  'Phone',
  'Email',
  'Website',
  'Plain language',
  'Written information',
  'Visual information',
];

const SETTING = ['In-person', 'Online', 'Local area', 'Travel support'];

const LANGUAGES = ['English', 'Bengali', 'Hindi', 'Other +'];

const RELATIONAL_STYLE = [
  'Calm',
  'Trauma-aware',
  'Bilingual',
  'Lived experience',
  'Structured',
  'Patient',
  'Quiet communication',
];

function NavItem({ icon: Icon, label, active }) {
  const go = useRoleNav('participant');
  return (
    <button
      onClick={() => go(label)}
      className={`w-full flex items-center gap-2.5 text-sm px-3 py-2.5 text-left transition-colors ${
        active
          ? 'bg-brand-700 text-white font-medium rounded-full'
          : 'text-slate-600 hover:bg-slate-100 rounded-lg'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

function Chip({ label }) {
  return (
    <button className="text-sm px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
      {label}
    </button>
  );
}

function SectionCard({ icon: Icon, iconTone, title, subtitle, options }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-center gap-2.5 mb-1">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconTone}`}
        >
          <Icon size={15} />
        </div>
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      </div>
      {subtitle && <p className="text-xs text-slate-500 mb-4 ml-10.5">{subtitle}</p>}
      <div className={`flex flex-wrap gap-2 ${subtitle ? '' : 'mt-4'}`}>
        {options.map((o) => (
          <Chip key={o} label={o} />
        ))}
      </div>
    </div>
  );
}

export default function SessionPreferences() {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center shrink-0 text-white font-bold">
            T
          </div>
          <div>
            <div className="text-base font-black tracking-wider text-brand-700 leading-none">
              TMG180
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Participant Portal</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'My Profile'} />
          ))}
        </nav>

        <div className="mt-auto pt-4 flex flex-col gap-1">
          {BOTTOM_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <User size={12} />
              <span>My Profile</span>
              <ChevronRight size={12} />
              <span className="font-semibold text-brand-600 tracking-wide">
                PREFERENCES
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">Session Preferences</h1>
              <p className="text-sm text-slate-500 mt-1">
                Set preferences for your filters and planning.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-purple-50 rounded-full px-4 py-3">
              <Info size={16} className="text-brand-600 shrink-0" />
              <p className="text-sm text-slate-700">
                These preferences help you filter and plan. You choose who to contact
                directly.
              </p>
            </div>

            <SectionCard
              icon={Heart}
              iconTone="bg-sky-100 text-sky-600"
              title="Support Focus"
              subtitle="Areas you are currently focusing on."
              options={SUPPORT_FOCUS}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SectionCard
                icon={Clock}
                iconTone="bg-purple-100 text-brand-600"
                title="General Availability"
                options={AVAILABILITY}
              />
              <SectionCard
                icon={MessageCircle}
                iconTone="bg-emerald-100 text-emerald-600"
                title="Communication Format"
                options={COMMUNICATION_FORMAT}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SectionCard
                icon={MapPin}
                iconTone="bg-sky-100 text-sky-600"
                title="Setting"
                options={SETTING}
              />
              <SectionCard
                icon={Languages}
                iconTone="bg-purple-100 text-brand-600"
                title="Languages"
                options={LANGUAGES}
              />
            </div>

            <SectionCard
              icon={Sparkles}
              iconTone="bg-slate-200 text-slate-700"
              title="Relational Style"
              subtitle="Qualities that help you feel supported and comfortable."
              options={RELATIONAL_STYLE}
            />

            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" className="w-auto! px-5! py-2.5!">
                Save Draft
              </Button>
              <Button variant="primary" className="w-auto! px-5! py-2.5!">
                Save Preferences
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
