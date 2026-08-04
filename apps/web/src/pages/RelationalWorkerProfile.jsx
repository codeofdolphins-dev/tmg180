import {
  MapPin,
  BadgeCheck,
  Heart,
  Star,
  Leaf,
  Ear,
  Clock,
  CheckCircle2,
  Calendar,
  GraduationCap,
  BriefcaseMedical,
  ShieldCheck,
} from 'lucide-react';

const INTERESTS = ['Gardening', 'Hiking Trails', 'Acoustic Music'];

const COMMUNICATION = ['Patient & Attentive', 'Uses Visual Aids', 'Soft-spoken'];

const APPRECIATIONS = [
  { icon: Leaf, label: '"Calm presence in stress"' },
  { icon: Ear, label: '"Exceptional active listening"' },
  { icon: Clock, label: '"Punctuality & reliability"' },
];

const WEEK_DAYS = [
  { day: 'MON', weekend: false, am: true, pm: false },
  { day: 'TUE', weekend: false, am: false, pm: true },
  { day: 'WED', weekend: false, am: true, pm: false },
  { day: 'THU', weekend: false, am: true, pm: false },
  { day: 'FRI', weekend: false, am: false, pm: true },
  { day: 'SAT', weekend: true, am: false, pm: false },
  { day: 'SUN', weekend: true, am: false, pm: false },
];

const SUPPORT_AREAS = ['Mobility & Physical', 'Social Community', 'Personal Living'];

const CREDENTIALS = [
  { icon: GraduationCap, title: 'Cert IV Disability Support', detail: 'Verified July 2023' },
  { icon: BriefcaseMedical, title: 'First Aid & CPR', detail: 'Expires Dec 2025' },
  { icon: ShieldCheck, title: 'Background & WWCC', detail: 'Fully Screened & Cleared' },
];

function AvailPill() {
  return (
    <span className="inline-block bg-emerald-800 text-white text-[10px] font-bold tracking-wide rounded-lg px-4 py-2.5">
      AVAIL
    </span>
  );
}

export default function RelationalWorkerProfile() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start gap-8">
              <div className="relative shrink-0">
                <div className="w-44 h-44 rounded-full bg-purple-200 ring-4 ring-white shadow flex items-center justify-center text-5xl font-bold text-brand-700">
                  SM
                </div>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-full px-3 py-1.5">
                  <BadgeCheck size={13} />
                  Active
                </span>
              </div>
              <div className="pt-4">
                <h1 className="text-5xl font-bold text-brand-600">Sarah Mitchell</h1>
                <div className="flex flex-wrap items-center gap-2.5 mt-4">
                  <span className="text-sm font-semibold text-brand-700 bg-purple-100 rounded-full px-4 py-1.5">
                    Relational Worker
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-full px-4 py-1.5">
                    <MapPin size={13} className="text-brand-600" />
                    Richmond, VIC
                  </span>
                  <span className="text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-full px-4 py-1.5">
                    8 Years Exp.
                  </span>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed mt-4 max-w-2xl">
                  "I believe that every participant deserves a support partner who listens
                  as much as they act."
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-6 items-start">
              <div className="flex flex-col gap-6">
                <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm p-7">
                  <h2 className="text-2xl font-bold text-brand-600 mb-4">
                    A little about me
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed mb-6">
                    I've spent the last 8 years working in community-based support,
                    focusing on the human side of care. My journey has taken me from group
                    home management to deeply personal 1-on-1 community participation,
                    always with the goal of fostering independence through genuine
                    connection.
                  </p>
                  <div className="bg-indigo-50/70 rounded-2xl p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2.5">
                      Natural Support Style
                    </p>
                    <p className="text-base text-slate-700 leading-relaxed">
                      I focus on <span className="font-bold">'side-by-side' support</span>{' '}
                      rather than 'over-the-shoulder.' My approach is non-directive,
                      encouraging participants to take the lead in their own daily lives.
                    </p>
                  </div>
                </div>

                <div className="bg-white border-2 border-brand-600 rounded-2xl shadow-sm p-7">
                  <div className="flex items-center gap-2.5 mb-4">
                    <Heart size={22} className="text-brand-600" />
                    <h2 className="text-2xl font-bold text-brand-600">
                      Best Working Relationship
                    </h2>
                  </div>
                  <p className="text-base text-slate-600 leading-relaxed">
                    I thrive with participants who value{' '}
                    <span className="font-bold text-slate-800">quiet companionship</span>{' '}
                    and{' '}
                    <span className="font-bold text-slate-800">gentle encouragement</span>{' '}
                    over high-energy activities. I work best in a rhythm that allows for
                    reflection and unhurried progress.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-4">
                    Interests
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => (
                      <span
                        key={interest}
                        className="text-sm font-semibold text-indigo-800 bg-indigo-100 rounded-full px-4 py-2"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-4">
                    Communication
                  </p>
                  <div className="flex flex-col gap-3">
                    {COMMUNICATION.map((item) => (
                      <span key={item} className="flex items-center gap-2.5">
                        <CheckCircle2 size={17} className="text-emerald-600 shrink-0" />
                        <span className="text-base text-slate-700">{item}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white border-2 border-emerald-700 rounded-2xl shadow-sm p-6">
                  <div className="flex items-start gap-2 mb-4">
                    <Star size={20} className="text-emerald-800 mt-1 shrink-0" />
                    <h2 className="text-xl font-bold text-emerald-800 leading-snug">
                      What participants appreciate
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {APPRECIATIONS.map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-3 bg-emerald-100/70 rounded-xl px-4 py-4"
                      >
                        <Icon size={19} className="text-emerald-800 shrink-0" />
                        <span className="text-sm font-medium text-slate-700 leading-snug">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm p-7">
              <div className="flex items-center gap-2.5 mb-6">
                <Calendar size={20} className="text-brand-600" />
                <h2 className="text-2xl font-bold text-brand-600">Weekly Availability</h2>
              </div>
              <div className="grid grid-cols-[3rem_repeat(7,1fr)] gap-y-4 items-center">
                <span />
                {WEEK_DAYS.map(({ day, weekend }) => (
                  <span
                    key={day}
                    className={`text-center text-sm font-bold ${
                      weekend ? 'text-amber-600' : 'text-slate-700'
                    }`}
                  >
                    {day}
                  </span>
                ))}
                <span className="text-sm font-bold text-slate-900">AM</span>
                {WEEK_DAYS.map(({ day, am }) => (
                  <span key={`${day}-am`} className="text-center">
                    {am && <AvailPill />}
                  </span>
                ))}
                <span className="text-sm font-bold text-slate-900">PM</span>
                {WEEK_DAYS.map(({ day, pm }) => (
                  <span key={`${day}-pm`} className="text-center">
                    {pm && <AvailPill />}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
              <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm p-7">
                <h2 className="text-2xl font-bold text-brand-600 mb-5">
                  Experience &amp; Skills
                </h2>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Support Areas
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {SUPPORT_AREAS.map((area) => (
                    <span
                      key={area}
                      className="text-sm font-semibold text-white bg-brand-700 rounded-lg px-4 py-2"
                    >
                      {area}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Languages
                    </p>
                    <p className="text-base text-slate-700 leading-relaxed">
                      English (Native), Spanish (Fluent)
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Location
                    </p>
                    <p className="text-base text-slate-700 leading-relaxed">
                      Richmond, VIC (Within 5km)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm p-7">
                <h2 className="text-2xl font-bold text-brand-600 mb-5">Credentials</h2>
                <div className="flex flex-col gap-3">
                  {CREDENTIALS.map(({ icon: Icon, title, detail }) => (
                    <div
                      key={title}
                      className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-4 py-4"
                    >
                      <Icon size={22} className="text-brand-600 shrink-0" />
                      <div>
                        <p className="text-base font-bold text-slate-900">{title}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm px-6 py-4">
              <p className="text-sm text-slate-500 text-center leading-relaxed">
                <span className="font-bold text-slate-700">Mandatory Notice:</span> TMG180
                does not coordinate services. Contact happens directly with the independent
                worker using their preferred method.
              </p>
            </div>
    </div>
  );
}
