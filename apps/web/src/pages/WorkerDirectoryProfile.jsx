import {
  LayoutDashboard,
  User,
  NotebookPen,
  CalendarDays,
  Search,
  HelpCircle,
  Lock,
  ArrowLeft,
  Heart,
  MapPin,
  Globe,
  BookOpen,
  Tag,
  Puzzle,
  ShieldCheck,
  Languages,
  GraduationCap,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  Info,
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

const SUPPORT_AREAS = [
  'Daily living',
  'Mobility & transport',
  'Social participation',
  'Self-care',
  'Communication',
];

const RELATIONAL_TAGS = [
  { label: 'Calm', icon: null },
  { label: 'Trauma-aware', icon: ShieldCheck },
  { label: 'Bilingual', icon: Languages },
  { label: 'Lived experience', icon: Heart },
];

const AVAILABILITY = [
  { day: 'Monday', morning: true, afternoon: true, evening: false },
  { day: 'Wednesday', morning: false, afternoon: true, evening: true },
  { day: 'Friday', morning: true, afternoon: true, evening: false },
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

function CardTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={16} className="text-brand-600" />
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function AvailabilityDot({ available }) {
  return available ? (
    <CheckCircle2 size={18} className="text-emerald-500 mx-auto" />
  ) : (
    <span className="inline-block w-4.5 h-4.5 rounded-full border-2 border-slate-200 mx-auto" />
  );
}

export default function WorkerDirectoryProfile() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-4 overflow-y-auto">
        <div className="mb-6 px-2">
          <div className="text-lg font-black tracking-wider text-brand-700 leading-none">
            TMG180
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Human-Centered Support</div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'Browse Directory'} />
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
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <button
              onClick={() => navigate(PARTICIPANT_PATHS.directory)}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors w-fit"
            >
              <ArrowLeft size={14} />
              Directory
            </button>

            <div className="relative bg-white border border-slate-200 rounded-2xl p-6">
              <button className="absolute top-5 right-5 text-slate-300 hover:text-rose-400 transition-colors">
                <Heart size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                      alt="Sarah Miller"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Sarah Miller</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-1.5">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-400" />
                      Melbourne, VIC
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={13} className="text-slate-400" />
                      Mon, Wed, Fri
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Globe size={13} className="text-slate-400" />
                      English, Spanish
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4 items-start">
              <div className="flex flex-col gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <CardTitle icon={BookOpen} title="About this worker" />
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Hello! I'm Sarah, a passionate and dedicated support worker with a
                    gentle approach. I believe in fostering independence and creating a
                    warm, safe environment for the people I support. My background is in
                    community care, and I love spending time outdoors, cooking, and
                    finding creative ways to make daily routines enjoyable and
                    fulfilling.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <CardTitle icon={Tag} title="Support areas" />
                    <div className="flex flex-col gap-2 items-start">
                      {SUPPORT_AREAS.map((a) => (
                        <span
                          key={a}
                          className="text-sm font-medium text-brand-700 bg-purple-50 px-3 py-1.5 rounded-full"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <CardTitle icon={Puzzle} title="Relational tags" />
                    <div className="flex flex-col gap-2 items-start">
                      {RELATIONAL_TAGS.map((t) => (
                        <span
                          key={t.label}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-700 bg-sky-50 px-3 py-1.5 rounded-full"
                        >
                          {t.icon && <t.icon size={13} />}
                          {t.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <CardTitle icon={GraduationCap} title="Experience" />
                  <div className="flex items-start gap-2 mb-6">
                    <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-600 leading-relaxed">
                      5+ years working in community and disability support settings,
                      with a strong focus on person-centered care and mental health
                      well-being.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={15} className="text-brand-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Typical Availability
                    </h3>
                  </div>

                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-slate-400 bg-slate-50">
                        <th className="font-medium px-3 py-2 rounded-l-lg">Day</th>
                        <th className="font-medium px-3 py-2 text-center">Morning</th>
                        <th className="font-medium px-3 py-2 text-center">Afternoon</th>
                        <th className="font-medium px-3 py-2 text-center rounded-r-lg">
                          Evening
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {AVAILABILITY.map((row) => (
                        <tr key={row.day} className="border-t border-slate-100">
                          <td className="px-3 py-3 text-slate-700">{row.day}</td>
                          <td className="px-3 py-3 text-center">
                            <AvailabilityDot available={row.morning} />
                          </td>
                          <td className="px-3 py-3 text-center">
                            <AvailabilityDot available={row.afternoon} />
                          </td>
                          <td className="px-3 py-3 text-center">
                            <AvailabilityDot available={row.evening} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center">
                <div className="w-11 h-11 rounded-full bg-brand-600 flex items-center justify-center mb-3">
                  <MessageSquare size={18} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Contact</h3>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-4">
                  Outside Platform
                </p>

                <button className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-800 text-white text-sm font-medium rounded-full py-2.5 mb-2.5 transition-colors">
                  <Phone size={14} />
                  Call Sarah
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 text-sm font-medium rounded-full py-2.5 mb-4 transition-colors">
                  <Mail size={14} />
                  Send Email
                </button>

                <div className="flex items-start gap-2 text-left">
                  <Info size={13} className="text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    TMG180 does not coordinate services. Contact happens directly with
                    the worker using their preferred method.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
