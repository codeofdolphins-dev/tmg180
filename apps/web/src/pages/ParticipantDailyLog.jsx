import {
  LayoutDashboard,
  User,
  NotebookPen,
  TrendingUp,
  Compass,
  HelpCircle,
  Shield,
  Search,
  Settings,
  Flower2,
  CircleUserRound,
  Clock,
  Calendar,
  ChevronDown,
  ChevronsUpDown,
  X,
  Target,
  PenLine,
  BarChart2,
  Sparkles,
  Info,
  StickyNote,
  SendHorizontal,
} from 'lucide-react';

import { useRoleNav } from '../navigation/useRoleNav';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'My Profile', icon: User },
  { label: 'Daily Log', icon: NotebookPen },
  { label: 'Monthly Snapshot', icon: TrendingUp },
  { label: 'Browse Directory', icon: Compass },
];

const BOTTOM_ITEMS = [
  { label: 'Help Centre', icon: HelpCircle },
  { label: 'Privacy & Sharing', icon: Shield },
];

const SESSION_FIELDS = [
  { label: 'Date', value: '10/24/2023', icon: Calendar },
  { label: 'Start Time', value: '09:00 AM', icon: ChevronDown },
  { label: 'End Time', value: '01:00 PM', icon: ChevronDown },
];

const DOMAIN_TAGS = [
  { label: 'Daily living', tone: 'bg-[#007a53] text-white shadow-sm' },
  { label: 'Mobility', tone: 'bg-[#e5eeff] text-[#0b1c30]' },
  { label: 'Social & Civic', tone: 'bg-[#2170e4] text-white shadow-sm' },
  { label: 'Self-care', tone: 'bg-[#e5eeff] text-[#0b1c30]' },
];

const COMPARISON_OPTIONS = [
  { label: 'Better than usual', active: false },
  { label: 'Same as usual', active: true },
  { label: 'Variable', active: false },
  { label: 'Below usual', active: false },
];

const PRIVACY_TEXT =
  'This tool only uses the dot points you provide below to generate suggestions. It does not access your broader history and complies with Australian Privacy Principles (APPs).';

const ROUGH_NOTES_PLACEHOLDER =
  '- Went to cafe\n- ordered coffee independently\n- felt overwhelmed by noise\n- support worker helped me find a quiet spot';

function NavItem({ icon: Icon, label, active }) {
  const go = useRoleNav('participant');
  return (
    <button
      onClick={() => go(label)}
      className={`w-full flex items-center gap-3 px-4 h-11 rounded-full text-sm text-left transition-colors ${
        active
          ? 'bg-[#9333ea] text-[#f6e6ff] font-bold'
          : 'text-[#4d4354] hover:bg-slate-100'
      }`}
    >
      <Icon size={17} className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}

function SessionField({ label, value, icon: Icon }) {
  return (
    <div>
      <label className="block text-sm text-[#4d4354] mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          defaultValue={value}
          className="w-full h-[50px] bg-white rounded-full pl-4 pr-10 text-base text-[#0b1c30] outline-none"
        />
        <Icon
          size={16}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
        />
      </div>
    </div>
  );
}

function FieldLabelRow({ label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[#4d4354]">{label}</span>
      <span className="text-sm font-bold text-[#ba1a1a]">*</span>
      <span className="text-xs text-[#4d4354]">(Select 1-3 goals)</span>
    </div>
  );
}

export default function ParticipantDailyLog() {
  return (
    <div className="h-screen flex bg-[#f8f6fb] font-sans text-slate-800 overflow-hidden">
      <aside className="w-72 shrink-0 p-4 pr-0 hidden lg:block">
        <div className="h-full bg-white/70 rounded-[28px] shadow-sm flex flex-col px-5 pt-8 pb-6 overflow-y-auto">
          <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 rounded-full bg-[#9333ea] flex items-center justify-center shrink-0">
              <Flower2 size={18} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#7800ce] leading-none">
                TMG180
              </div>
              <div className="text-xs font-bold text-[#4d4354] mt-1">
                Participant Portal
              </div>
            </div>
          </div>

          <nav className="mt-8 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.label} {...item} active={item.label === 'Daily Log'} />
            ))}
          </nav>

          <div className="mt-auto pt-6 flex flex-col gap-2">
            {BOTTOM_ITEMS.map((item) => (
              <NavItem key={item.label} {...item} />
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 flex items-center justify-between gap-6 px-10 bg-[#f8f9ff]/80 border-b border-slate-200/50">
          <div className="relative w-[448px] max-w-full">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7e7386]"
            />
            <input
              type="text"
              placeholder="Search TMG180"
              className="w-full h-[47px] bg-[#d3e4fe]/30 rounded-full pl-11 pr-4 text-base text-slate-700 placeholder:text-[#7e7386] outline-none"
            />
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
              <Settings size={19} />
            </button>
            <div className="w-px h-8 bg-[#cfc2d7]/30" />
            <button className="w-8 h-8 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center">
              AJ
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="px-10 py-10 flex flex-col gap-12 max-w-[992px]">
            <div className="flex flex-col gap-4">
              <div className="inline-flex self-start items-center gap-2 bg-[#e5eeff] rounded-full pl-4 pr-5 py-2">
                <CircleUserRound size={15} className="text-[#9333ea]" />
                <span className="text-xs font-bold text-[#0b1c30]">Andrew Joseph</span>
                <span className="text-xs font-bold text-[#cfc2d7]">|</span>
                <span className="text-xs text-[#4d4354]">TMG180-P-2048</span>
              </div>
              <div>
                <h1 className="text-[32px] font-bold text-[#0b1c30] leading-tight">
                  Daily Support Evidence Log
                </h1>
                <p className="text-base text-[#434655] mt-2 max-w-[672px]">
                  {"Share information about your everyday life, what matters most to you, and the supports that help you live well. You can complete your profile at your own pace and return whenever you're ready."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-1 min-w-0 flex flex-col gap-8">
                <section className="bg-[#f8f9ff] rounded-[32px] p-8">
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-[#7800ce]" />
                    <h2 className="text-2xl font-bold text-[#0b1c30]">
                      Session Details
                    </h2>
                  </div>
                  <div className="grid grid-cols-3 gap-6 mt-6">
                    {SESSION_FIELDS.map((f) => (
                      <SessionField key={f.label} {...f} />
                    ))}
                  </div>
                </section>

                <section className="bg-[#f8f9ff] rounded-[32px] p-8">
                  <div className="flex items-center gap-3">
                    <Target size={20} className="text-[#007a53]" />
                    <h2 className="text-2xl font-bold text-[#0b1c30]">
                      Intent &amp; Focus
                    </h2>
                  </div>
                  <div className="mt-6 flex flex-col gap-8">
                    <div>
                      <FieldLabelRow label="Goals linked to this support" />
                      <button className="mt-3 w-full h-[50px] bg-white rounded-full px-4 flex items-center justify-between text-base text-[#0b1c30]">
                        Select a goal from your plan...
                        <ChevronsUpDown size={18} className="text-slate-500" />
                      </button>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-2 bg-[#9333ea]/20 rounded-full px-4 py-1.5">
                          <span className="text-xs font-bold text-[#2c0051]">
                            Increase community access
                          </span>
                          <X size={13} className="text-[#2c0051]" />
                        </span>
                      </div>
                    </div>
                    <hr className="border-slate-200" />
                    <div>
                      <FieldLabelRow label="Functional domain tags" />
                      <div className="mt-3 flex flex-wrap gap-3">
                        {DOMAIN_TAGS.map((tag) => (
                          <span
                            key={tag.label}
                            className={`px-4 py-[9px] rounded-full text-sm ${tag.tone}`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-[#f8f9ff] rounded-[32px] p-8">
                  <div className="flex items-center gap-3">
                    <PenLine size={19} className="text-[#7800ce]" />
                    <h2 className="text-2xl font-bold text-[#0b1c30]">The Details</h2>
                  </div>
                  <p className="mt-2 text-base text-[#4d4354]">
                    Describe the support in your own words. Focus on the impact and
                    participation.
                  </p>
                  <div className="mt-6 flex flex-col gap-6">
                    <div>
                      <label className="block text-sm font-bold text-[#0b1c30]">
                        Function-first impacts
                      </label>
                      <p className="mt-2 text-sm text-[#4d4354]">
                        How did this support help you manage functional challenges today?
                      </p>
                      <textarea
                        rows={4}
                        placeholder="e.g., The support worker assisted me with navigation, which reduced my anxiety..."
                        className="mt-2 w-full bg-white rounded-[24px] px-4 py-4 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0b1c30]">
                        Support delivered
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Briefly describe what supports were completed..."
                        className="mt-2 w-full bg-white rounded-[24px] px-4 py-4 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0b1c30]">
                        Outcome / participation snapshot
                      </label>
                      <textarea
                        rows={4}
                        placeholder="What was the result? Were you able to participate more fully?"
                        className="mt-2 w-full bg-white rounded-[24px] px-4 py-4 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none resize-none"
                      />
                    </div>
                  </div>
                </section>

                <section className="bg-[#f8f9ff] rounded-[32px] p-8">
                  <BarChart2 size={20} className="text-[#7800ce]" />
                  <p className="mt-2 text-base text-[#4d4354] max-w-[438px]">
                    Compared to your usual routine, how did things go during this period?
                  </p>
                  <div className="mt-6 bg-[#eff4ff] rounded-full p-[5px] grid grid-cols-4 items-center">
                    {COMPARISON_OPTIONS.map((opt) => (
                      <button
                        key={opt.label}
                        className={`rounded-md px-1 py-3 text-sm text-center leading-tight ${
                          opt.active
                            ? 'bg-white shadow-sm font-bold text-[#7800ce]'
                            : 'text-[#4d4354]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <div className="w-96 shrink-0 hidden xl:flex flex-col gap-6">
                <div className="relative overflow-hidden bg-[#7800ce]/5 rounded-[32px] p-6">
                  <div className="absolute -top-10 -right-2 w-32 h-32 rounded-full bg-[#7800ce]/20 blur-2xl pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Sparkles size={22} className="text-[#7800ce] shrink-0" />
                        <h3 className="text-2xl font-bold text-[#7800ce]">
                          Help me write this
                        </h3>
                      </div>
                      <button className="text-slate-700 mt-1">
                        <Info size={20} />
                      </button>
                    </div>

                    <div className="mt-4 bg-[#f8f9ff]/50 rounded-[24px] p-4">
                      <p className="text-xs font-bold text-[#7800ce]">
                        Privacy First (APP Compliant)
                      </p>
                      <p className="mt-1 text-xs font-bold text-[#4d4354] leading-relaxed">
                        {PRIVACY_TEXT}
                      </p>
                    </div>

                    <div className="mt-5">
                      <p className="text-xs font-bold text-[#4d4354]">
                        Jot down a few rough notes here:
                      </p>
                      <textarea
                        rows={5}
                        placeholder={ROUGH_NOTES_PLACEHOLDER}
                        className="mt-2 w-full bg-white/80 rounded-[24px] px-3.5 py-3 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none resize-none"
                      />
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-xs font-bold text-[#7800ce]">
                        Privacy First (APP Compliant)
                      </p>
                      <p className="mt-1 text-xs font-bold text-[#4d4354] leading-relaxed">
                        {PRIVACY_TEXT}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <button className="w-full h-[42px] rounded-full bg-[#f8f9ff] border border-purple-200 text-sm text-[#7800ce]">
                        Plain language
                      </button>
                      <button className="w-full h-[42px] rounded-full bg-[#f8f9ff] border border-purple-200 text-sm text-[#7800ce]">
                        NDIS evidence language
                      </button>
                      <button className="w-full h-10 rounded-full bg-[#7800ce] text-sm text-white">
                        Both formats
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f8f9ff] rounded-[32px] px-6 py-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StickyNote size={20} className="text-[#0b1c30]" />
                    <span className="text-sm text-[#0b1c30]">
                      Additional Notes (Optional)
                    </span>
                  </div>
                  <ChevronDown size={15} className="text-slate-500" />
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="h-[75px] shrink-0 flex items-center justify-between px-10 bg-[#f8f9ff]/90 border-t border-slate-200/50 backdrop-blur">
          <button className="px-6 py-2.5 rounded-full text-sm text-[#4d4354] hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2.5 rounded-full bg-white border border-purple-100 text-sm text-[#7800ce]">
              Save Draft
            </button>
            <button className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-[#7800ce] text-sm text-white">
              Submit Log
              <SendHorizontal size={14} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
