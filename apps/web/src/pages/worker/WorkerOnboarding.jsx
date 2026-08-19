import { Flag, User, MapPin, Clock, Feather, Globe, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';

const STEPS = [
  {
    number: 1,
    title: 'Add profile details',
    desc: 'Set up your basic information, bio, and contact preferences for participants.',
    icon: User,
    status: 'In progress',
    statusTone: 'brand',
    iconTone: 'solid',
    cta: 'Continue Step',
    ctaVariant: 'primary',
  },
  {
    number: 2,
    title: 'Add support areas',
    desc: 'Define your expertise, modalities, and the specific populations you support.',
    icon: MapPin,
    status: 'Not started yet',
    statusTone: 'neutral',
    iconTone: 'soft',
    cta: 'Start Step',
    ctaVariant: 'outline',
  },
  {
    number: 3,
    title: 'Add availability',
    desc: 'Set your general working hours and timezone for the calendar.',
    icon: Clock,
    status: 'Not started yet',
    statusTone: 'neutral',
    iconTone: 'soft',
    cta: 'Start Step',
    ctaVariant: 'outline',
  },
  {
    number: 4,
    title: 'Review governance items',
    desc: 'Acknowledge framework guidelines, incident reporting, and mandatory protocols.',
    icon: Feather,
    status: 'Not started yet',
    statusTone: 'neutral',
    iconTone: 'soft',
    cta: 'Start Step',
    ctaVariant: 'outline',
  },
  {
    number: 5,
    title: 'Publish profile opt-in',
    desc: 'Opt-in to make your profile visible to the broader community.',
    icon: Globe,
    status: 'Not started yet',
    statusTone: 'neutral',
    iconTone: 'soft',
    cta: 'Start Step',
    ctaVariant: 'outline',
  },
  {
    number: 6,
    title: 'Access workspace tools',
    desc: 'Unlock full access to your calendar, daily logs, and participant management.',
    icon: Lock,
    status: 'Locked',
    statusTone: 'neutral',
    iconTone: 'soft',
    cta: 'Complete previous steps',
    ctaVariant: 'outline',
    locked: true,
  },
];

function StepCard({ number, title, desc, icon: Icon, status, statusTone, iconTone, cta, ctaVariant, locked }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            iconTone === 'solid' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <Icon size={17} />
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            statusTone === 'brand' ? 'bg-purple-100 text-brand-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {status}
        </span>
      </div>

      <h3 className="text-base font-bold text-slate-900 mb-1.5">
        {number}. {title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed flex-1">{desc}</p>

      <Button
        variant={ctaVariant}
        disabled={locked}
        className={`w-full! mt-5 ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {cta}
      </Button>
    </div>
  );
}

export default function WorkerOnboarding() {
  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div className="max-w-5xl w-full mx-auto flex flex-col gap-6 flex-1">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-700 bg-purple-100 px-3 py-1 rounded-full mb-4">
            <Flag size={11} />
            WELCOME
          </span>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Set up your Worker Workspace
          </h1>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Tools, templates, and governance structure — while you keep
            independence and autonomy. Complete onboarding to publish your
            profile (opt-in) and access tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
          {STEPS.map((s) => (
            <StepCard key={s.number} {...s} />
          ))}
        </div>
      </div>
      <footer className="sticky bottom-0 bg-white border-t border-slate-200 px-8 py-4">
        <div className="max-w-5xl w-full mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 shrink-0">
              <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="#6b21a8"
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 15.5}`}
                  strokeDashoffset={`${2 * Math.PI * 15.5 * (1 - 0.15)}`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-sm text-slate-600">15% Complete</span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="w-auto! px-5! py-2.5!">
              Save and exit
            </Button>
            <Button variant="primary" className="w-auto! px-5! py-2.5!">
              Continue onboarding
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
