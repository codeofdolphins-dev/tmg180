import {
  ChevronRight,
  FileText,
  Link2,
  ListChecks,
  AlignLeft,
  CheckCircle2,
  Save,
  Send,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

/**
 * Add New Report — governance portal. Renders inside GovernanceLayout (shared
 * fixed sidebar + top bar); this file is content only, on the portal card
 * idiom shared with the participant / worker workspaces.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

const DATA_INCLUDED = [
  'Aggregated worker metadata',
  'Aggregated participant metadata',
  'Policy versioning',
  'Consent audit metadata',
  'Incident ticket metadata',
];

function CardHeader({ icon: Icon, iconTone, title, tag }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconTone}`}
      >
        <Icon size={15} />
      </div>
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      {tag && <span className="text-xs text-slate-400">{tag}</span>}
    </div>
  );
}

export default function AddNewReport() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <FileText size={12} />
        <span>Reports</span>
        <ChevronRight size={12} />
        <span className="font-semibold text-brand-600">New</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">Add New Report</h1>
        <p className="text-base text-slate-600 mt-2">
          Create a platform-level governance report.
        </p>
      </div>

      <div className={`relative ${CARD} overflow-hidden`}>
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />
        <CardHeader
          icon={FileText}
          iconTone="bg-brand-100 text-brand-600"
          title="Report Details"
        />
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">
              Report Title
            </label>
            <input
              type="text"
              placeholder="e.g., Q3 Governance Summary"
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Briefly describe the purpose of this report..."
              className="w-full bg-sky-50/60 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
        <div className={CARD}>
          <CardHeader
            icon={Link2}
            iconTone="bg-sky-100 text-sky-600"
            title="Category & Scope"
          />
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">
                Report Category
              </label>
              <Select
                inputId="report-category"
                aria-label="Report Category"
                look="box"
                placeholder="Select category..."
                options={[
                  'Governance Summary',
                  'Compliance Review',
                  'Incident Analysis',
                ].map((o) => ({ value: o, label: o }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">
                Reporting Period
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600"
                />
                <span className="text-sm text-slate-400 shrink-0">to</span>
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600"
                />
              </div>
            </div>
          </div>
        </div>

        <div className={CARD}>
          <CardHeader
            icon={ListChecks}
            iconTone="bg-brand-100 text-brand-600"
            title="Data Included"
          />
          <div className="flex flex-col gap-3">
            {DATA_INCLUDED.map((label) => (
              <label
                key={label}
                className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 accent-brand-600"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={CARD}>
        <CardHeader
          icon={AlignLeft}
          iconTone="bg-slate-100 text-slate-500"
          title="Internal Notes"
          tag="(Optional)"
        />
        <textarea
          rows={3}
          placeholder="Add any contextual notes for other administrators..."
          className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-brand-600 resize-none"
        />
      </div>

      <div className="flex items-start gap-3 bg-sky-50 border border-sky-100 rounded-xl p-4">
        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <CheckCircle2 size={14} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Privacy Protocol Active
          </p>
          <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
            Do not include participant-owned record content or clinical details
            in admin reports. The system automatically filters sensitive data,
            but manual descriptions must adhere to privacy guidelines.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <button className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
          Cancel
        </button>
        <Button variant="outline" icon={Save} className="w-auto! px-4! py-2.5!">
          Save Draft
        </Button>
        <Button variant="primary" icon={Send} className="w-auto! px-5! py-2.5!">
          Create Report
        </Button>
      </div>
    </div>
  );
}
