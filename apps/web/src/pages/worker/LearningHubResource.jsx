import {
  ArrowLeft,
  Calendar,
  Users,
  Receipt,
  Landmark,
  GraduationCap,
  Settings,
  Bookmark,
  Clock,
  Download,
  Info,
  FileText,
  Shield,
} from 'lucide-react';
import Button from '../../components/ui/Button';

import { useNavigate } from 'react-router-dom';
import { useRoleNav } from '../../navigation/useRoleNav';
import { WORKER_PATHS } from '../../routes/paths';
const NAV_ITEMS = [
  { label: 'Calendar', icon: Calendar },
  { label: 'Participants I support', icon: Users },
  { label: 'Invoices', icon: Receipt },
  { label: 'Governance Standing', icon: Landmark },
  { label: 'Learning Hub', icon: GraduationCap },
  { label: 'Settings', icon: Settings },
];

const STEPS = [
  {
    title: 'Download and Save',
    desc: 'Save a master copy of this template to your device for easy access.',
  },
  {
    title: 'Daily Completion',
    desc: 'Fill out the log at the end of each shift while details are fresh. Be objective and factual.',
  },
  {
    title: 'Submission',
    desc: "Attach the completed log to relevant invoices or upload directly to the participant's portal securely.",
  },
];

const RELATED = [
  {
    tag: 'Guide',
    tagTone: 'bg-slate-100 text-slate-600',
    icon: FileText,
    iconTone: 'bg-sky-100 text-sky-600',
    title: 'Best Practices for Progress Notes',
    desc: 'Learn how to write objective, clear, and impactful progress notes.',
  },
  {
    tag: 'Policy',
    tagTone: 'bg-emerald-100 text-emerald-700',
    icon: Shield,
    iconTone: 'bg-emerald-100 text-emerald-600',
    title: 'Incident Reporting Guidelines',
    desc: 'Understanding the steps and required detail for reporting incidents.',
  },
  {
    tag: 'Template',
    tagTone: 'bg-purple-100 text-brand-700',
    icon: FileText,
    iconTone: 'bg-purple-100 text-brand-600',
    title: 'Monthly Participant Summary',
    desc: 'A template for summarizing monthly support outcomes and goals.',
  },
];

function NavItem({ icon: Icon, label, active }) {
  const go = useRoleNav('worker');
  return (
    <button
      onClick={() => go(label)}
      className={`w-full flex items-center gap-2.5 text-sm px-3 py-2.5 text-left rounded-full transition-colors ${
        active ? 'bg-teal-100 text-teal-800 font-medium' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

export default function LearningHubResource() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-4 overflow-y-auto">
        <div className="mb-6 px-2">
          <div className="text-lg font-black tracking-wider text-brand-700 leading-none">
            TMG180
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Worker Management</div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} {...item} active={item.label === 'Learning Hub'} />
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-5">
            <button
              onClick={() => navigate(WORKER_PATHS.resources)}
              className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-800 transition-colors w-fit"
            >
              <ArrowLeft size={14} />
              Back to Resources
            </button>

            <div className="relative overflow-hidden bg-purple-50/60 rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 bg-purple-100 px-2.5 py-1 rounded-full">
                      <Bookmark size={11} />
                      Template
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={11} />
                      5 min read
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Calendar size={11} />
                      Updated: June 2026
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-brand-700 leading-snug">
                    Daily Support Evidence Log template
                  </h1>
                  <p className="text-sm text-slate-600 mt-3 max-w-xl leading-relaxed">
                    A standardized template for documenting daily support activities,
                    ensuring compliance and clear communication with participants and
                    coordinators.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" icon={Bookmark} className="w-auto! px-4! py-2.5!">
                    Save resource
                  </Button>
                  <Button variant="primary" icon={Download} className="w-auto! px-4! py-2.5!">
                    Download
                  </Button>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-200/40" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4 items-start">
              <div className="flex flex-col gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h2 className="text-sm font-bold text-slate-900 mb-3">Overview</h2>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    This template provides a clear, structured format for recording
                    daily support evidence. Consistent use of this log ensures that all
                    necessary details regarding participant interaction, support
                    provided, and any incidents are accurately captured.
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Regular and accurate documentation is essential for maintaining
                    practice standing, supporting invoice claims, and most importantly,
                    ensuring the ongoing wellbeing and progress of participants.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h2 className="text-sm font-bold text-slate-900 mb-4">
                    How to use this template
                  </h2>
                  <div className="flex flex-col gap-4">
                    {STEPS.map((s, i) => (
                      <div key={s.title} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {s.title}
                          </p>
                          <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h2 className="text-sm font-bold text-slate-900 mb-4">
                    Example Structure
                  </h2>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-600 font-mono leading-relaxed">
                    <p>Date: [DD/MM/YYYY] &nbsp; Duration: [Start Time] - [End Time]</p>
                    <p className="mt-2">
                      Support Type: [e.g., Community Access, In-home Support]
                    </p>
                    <p className="mt-3">Activities Completed:</p>
                    <p className="text-slate-500">Assisted with morning routine...</p>
                    <p className="text-slate-500">Accompanied to grocery store.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center">
                  <div className="w-11 h-11 rounded-full bg-brand-600 text-white flex items-center justify-center mb-3">
                    <Download size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Ready to use?</h3>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    Download the template in Word format (.docx) to start documenting
                    your support evidence.
                  </p>
                  <Button variant="primary" className="w-full!">
                    Download .docx
                  </Button>
                </div>

                <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Info size={14} className="text-sky-600" />
                    <h3 className="text-sm font-bold text-slate-900">AI Search Notice</h3>
                  </div>
                  <p className="text-xs text-sky-900/70 leading-relaxed">
                    AI search uses Core Library only. Content is sourced directly from
                    approved platform materials.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Related resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {RELATED.map((r) => (
                  <div
                    key={r.title}
                    className="bg-white border border-slate-200 rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${r.tagTone}`}
                      >
                        {r.tag}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${r.iconTone}`}
                      >
                        <r.icon size={14} />
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{r.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
