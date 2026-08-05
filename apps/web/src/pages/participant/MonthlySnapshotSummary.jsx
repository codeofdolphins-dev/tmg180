import {
  Lock,
  Info,
  Eye,
  History,
  MessageSquarePlus,
} from 'lucide-react';
import Button from '../components/ui/Button';

const PREVIEW_SECTIONS = [
  {
    label: 'Plain Language Summary',
    labelColor: 'text-fuchsia-600',
    bg: 'bg-fuchsia-50/60',
    text: 'This month showed consistent engagement with morning routines, though energy levels tapered significantly by late afternoon. The focus remained on establishing a sustainable rhythm rather than pushing for new milestones, acknowledging the cumulative fatigue from the previous transition period.',
  },
  {
    label: 'Functional Meaning',
    labelColor: 'text-blue-600',
    bg: 'bg-blue-50/60',
    text: 'Maintaining the morning routine independently 4 out of 7 days demonstrates a stabilization in core capacity. The afternoon fatigue highlights the ongoing need for flexible pacing and low-demand rest periods to prevent burnout.',
  },
  {
    label: 'NDIS Evidence Language',
    labelColor: 'text-slate-500',
    bg: 'bg-slate-100/70',
    text: 'Participant requires ongoing formal support to manage energy expenditure and prevent functional decline during the latter half of the day. Current support levels are necessary to maintain the baseline independence achieved in morning routines.',
  },
];

export default function MonthlySnapshotSummary() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Monthly Snapshot Summary
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Review your locked snapshot and append any additional context needed.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full shrink-0">
                <Lock size={12} />
                Approved and locked
              </span>
            </div>

            <div className="flex items-start gap-3 bg-white border-l-4 border-brand-500 border-y border-r border-slate-200 rounded-xl p-4">
              <Info size={16} className="text-brand-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-slate-700">
                  This snapshot is locked. You can add an addendum if something needs to
                  be included.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Capacity is not linear — variation in daily functioning does not
                  indicate regression.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-slate-500" />
                  <h2 className="text-base font-bold text-slate-900">Snapshot Preview</h2>
                </div>

                {PREVIEW_SECTIONS.map((s) => (
                  <div key={s.label} className={`rounded-xl p-5 ${s.bg}`}>
                    <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${s.labelColor}`}>
                      {s.label}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.text}</p>
                  </div>
                ))}

                <div className="flex items-center gap-2 mt-2">
                  <History size={16} className="text-slate-500" />
                  <h2 className="text-base font-bold text-slate-900">Addendum History</h2>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4">
                  <div className="flex flex-col items-center justify-center bg-sky-50 rounded-lg w-14 h-14 shrink-0">
                    <span className="text-[10px] font-semibold text-sky-500 uppercase">
                      Oct
                    </span>
                    <span className="text-lg font-bold text-sky-700 leading-none">15</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-800">
                      <span className="font-semibold">Added by Participant</span>
                      <span className="text-slate-300 mx-1.5">•</span>
                      <span className="text-brand-600 font-medium">Context</span>
                    </p>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      Wanted to note that the fatigue in week 2 was heavily influenced by
                      unexpected changes in the support worker roster, which always
                      takes extra energy to navigate.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                    <MessageSquarePlus size={15} className="text-white" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Add Addendum</h2>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">
                      Date Added
                    </label>
                    <input
                      type="text"
                      defaultValue="October 24, 2023"
                      readOnly
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">
                      Reason for Addendum
                    </label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-500 outline-none focus:border-brand-600">
                      <option>Select a reason...</option>
                      <option>Additional context</option>
                      <option>Correction</option>
                      <option>Clarification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-2">
                      Addendum Note
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share any additional details that feel important to include for this period..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="primary" className="w-auto! px-4! py-2!">
                      Save Addendum
                    </Button>
                    <Button variant="outline" className="w-auto! px-4! py-2!">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
    </div>
  );
}
