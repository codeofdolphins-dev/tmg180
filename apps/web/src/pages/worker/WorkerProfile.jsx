import { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  NotebookPen,
  TrendingUp,
  Folder,
  GraduationCap,
  Landmark,
  Settings,
  HelpCircle,
  Bell,
  MessageSquare,
  Info,
  Sparkles,
  Clock,
  MapPin,
  Globe,
} from 'lucide-react';
import Button from '../../components/ui/Button';

import { useRoleNav } from '../../navigation/useRoleNav';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Calendar', icon: Calendar },
  { label: 'Participants I support', icon: Users },
  { label: 'Daily Logs', icon: NotebookPen },
  { label: 'Monthly Snapshots', icon: TrendingUp },
  { label: 'Resources', icon: Folder },
  { label: 'Learning Hub', icon: GraduationCap },
  { label: 'Governance Standing', icon: Landmark },
  { label: 'Settings', icon: Settings },
  { label: 'Help Centre', icon: HelpCircle },
];

const SUPPORT_AREAS = [
  { label: 'Daily living', selected: true },
  { label: 'Mobility & transport', selected: true },
  { label: 'Communication', selected: false },
  { label: 'Social participation', selected: false },
  { label: 'Self-care', selected: false },
  { label: 'Learning & employment', selected: false },
  { label: 'Health & wellbeing', selected: true },
  { label: 'Safety', selected: false },
];

const RELATIONAL_TAGS = [
  { label: 'Calm', tone: 'brand' },
  { label: 'Trauma-aware', tone: 'neutral' },
  { label: 'Bilingual', tone: 'neutral' },
  { label: 'Lived experience', tone: 'teal' },
  { label: 'Structured support', tone: 'neutral' },
];

function NavItem({ icon: Icon, label, active }) {
  const go = useRoleNav('worker');
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

function Chip({ label, selected }) {
  return (
    <button
      className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
        selected
          ? 'bg-brand-600 border-brand-600 text-white font-medium'
          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );
}

const TAG_TONE_STYLES = {
  brand: 'bg-brand-600 border-brand-600 text-white font-medium',
  neutral: 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
  teal: 'bg-teal-50 border-teal-200 text-teal-700 font-medium',
};

function Tag({ label, tone }) {
  return (
    <button className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${TAG_TONE_STYLES[tone]}`}>
      {label}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-2">{label}</label>
      {children}
    </div>
  );
}

function Checkbox({ label, defaultChecked }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="w-4 h-4 rounded border-slate-300 accent-brand-600"
      />
      {label}
    </label>
  );
}

export default function WorkerProfile() {
  const [showBanner] = useState(true);

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-4 overflow-y-auto">
        <div className="mb-6 px-2">
          <div className="text-lg font-black tracking-wider text-brand-700 leading-none">
            TMG180
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Worker Portal</div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'Settings'} />
          ))}
        </nav>

        <div className="mt-auto pt-4 flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
              alt="Alex Mercer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 leading-none">Alex Mercer</p>
            <p className="text-xs text-slate-400 mt-1">Support Worker</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-end gap-3 px-6 py-4 text-slate-500">
          <button className="hover:text-slate-700 transition-colors">
            <Bell size={18} />
          </button>
          <button className="hover:text-slate-700 transition-colors">
            <MessageSquare size={18} />
          </button>
        </header>

        <main className="flex-1 px-6 pb-6">
          <div className="max-w-5xl mx-auto flex flex-col gap-5">
            {showBanner && (
              <div className="flex items-center gap-2 bg-purple-50 text-brand-700 text-sm rounded-full px-4 py-2.5 w-fit">
                <Info size={14} />
                Complete onboarding to publish your profile (opt-in) and access tools.
              </div>
            )}

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Worker Profile &amp; Availability
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Update the information participants can view in the Verified Profiles
                Directory.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start">
              <div className="flex flex-col gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-20 h-20 rounded-full bg-linear-to-br from-brand-500 to-fuchsia-400 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                          alt="Alex Mercer"
                          className="w-full h-full object-cover mix-blend-luminosity opacity-90"
                        />
                      </div>
                      <button className="text-xs font-medium text-brand-600 hover:text-brand-800 mt-2 transition-colors">
                        Change Photo
                      </button>
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                      <Field label="Display Name">
                        <input
                          type="text"
                          defaultValue="Alex Mercer"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-600"
                        />
                      </Field>
                      <Field label="Short Bio">
                        <textarea
                          rows={2}
                          placeholder="Share a little about yourself, your approach, and what you enjoy doing..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600 resize-none"
                        />
                      </Field>
                      <Field label="Experience Summary">
                        <textarea
                          rows={2}
                          placeholder="e.g., 5 years supporting youth and young adults."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600 resize-none"
                        />
                      </Field>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h2 className="text-sm font-bold text-slate-900 mb-1">Support Areas</h2>
                  <p className="text-xs text-slate-500 mb-4">
                    Select the areas where you offer support to participants.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUPPORT_AREAS.map((a) => (
                      <Chip key={a.label} {...a} />
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-brand-600" />
                    <h2 className="text-sm font-bold text-slate-900">Relational Tags</h2>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Keywords that describe your personal approach and environment.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {RELATIONAL_TAGS.map((t) => (
                      <Tag key={t.label} {...t} />
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={14} className="text-sky-600" />
                    <h2 className="text-sm font-bold text-slate-900">General Availability</h2>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Indicate when you are typically available to provide support.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-3">Time of Day</p>
                      <div className="flex flex-col gap-3">
                        <Checkbox label="Morning" defaultChecked />
                        <Checkbox label="Afternoon" defaultChecked />
                        <Checkbox label="Evening" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-3">Days</p>
                      <div className="flex flex-col gap-3">
                        <Checkbox label="Weekdays" defaultChecked />
                        <Checkbox label="Weekends" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h2 className="text-sm font-bold text-slate-900 mb-4">
                    Logistics &amp; Contact
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <Field label="Location / Area">
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="e.g., Northside"
                          className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
                        />
                      </div>
                    </Field>
                    <Field label="Languages Spoken">
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5">
                        <Globe size={14} className="text-slate-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="e.g., English, Spanish"
                          className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 flex-1 min-w-0"
                        />
                      </div>
                    </Field>
                    <Field label="Contact Email">
                      <input
                        type="email"
                        placeholder="hello@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600"
                      />
                    </Field>
                    <Field label="Phone Number (Optional)">
                      <input
                        type="tel"
                        placeholder="0400 000 000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600"
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-[10px] uppercase tracking-wide text-slate-400 font-medium px-1">
                  Directory Preview
                </p>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="h-16 bg-linear-to-br from-brand-200 to-fuchsia-200" />
                  <div className="px-5 pb-5 -mt-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                        alt="Alex Mercer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-2">Alex Mercer</p>
                    <p className="text-xs text-brand-600 font-medium">Support Worker</p>

                    <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                      <span className="text-[11px] bg-purple-50 text-brand-700 px-2 py-0.5 rounded-full">
                        Daily living
                      </span>
                      <span className="text-[11px] bg-purple-50 text-brand-700 px-2 py-0.5 rounded-full">
                        Social participation
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                      Hi, I&apos;m Alex, I have 5 years of experience supporting youth
                      and young adults. I focus on...
                    </p>

                    <div className="flex flex-col items-start gap-1.5 w-full mt-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-400" />
                        Northside
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-400" />
                        Weekdays (Morning, Afternoon)
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="primary" className="w-full!">
                  Publish Profile
                </Button>
                <Button variant="outline" className="w-full!">
                  Save Draft
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
