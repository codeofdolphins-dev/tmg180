import {
  User,
  Info,
  ChevronRight,
  Heart,
  Clock,
  MessageCircle,
  MapPin,
  Languages,
  Sparkles,
} from 'lucide-react';
import Button from '../../components/ui/Button';

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
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
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
              <h1 className="text-3xl font-bold text-slate-900">Session Preferences</h1>
              <p className="text-base text-slate-500 mt-1">
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
  );
}
