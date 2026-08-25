import {
  ChevronRight,
  ChevronLeft,
  Download,
  Archive,
  Upload,
  History,
  Users,
  FileEdit,
  Calendar,
  TrendingUp,
  ClipboardCheck,
  ChevronDown,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import InfoTile from '../../components/ui/InfoTile';
import VersionTimeline from '../../components/ui/VersionTimeline';

/**
 * Policy Version Detail — governance portal. Renders inside GovernanceLayout
 * (shared fixed sidebar + top bar); this file is content only, on the portal
 * card idiom shared with the participant / worker workspaces.
 */

const CARD = 'bg-white/80 rounded-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

const VERSION_HISTORY = [
  {
    version: 'v2.0 (Current)',
    date: 'June 2026',
    detail:
      'Comprehensive update to mandatory reporting requirements and new safety protocols.',
    current: true,
    link: 'View Document',
  },
  {
    version: 'v1.1',
    date: 'Aug 2025',
    detail: 'Updated Privacy Clause regarding participant data handling.',
  },
  {
    version: 'v1.0 (Initial Release)',
    date: 'Jan 2025',
    detail: 'Base mandatory policy framework established.',
  },
];

const ACK_ROWS = [
  { role: 'Senior Support Worker', id: 'USR-8492...', version: 'v2.0', date: '14 Jun 2026', status: 'Completed' },
  { role: 'Support Worker', id: 'USR-3391...', version: 'v1.1', date: '12 Sep 2025', status: 'Needs Review' },
  { role: 'Care Coordinator', id: 'USR-7720...', version: 'Pending', date: '-', status: 'Due Soon' },
  { role: 'Support Worker', id: 'USR-1094...', version: 'v2.0', date: '13 Jun 2026', status: 'Completed' },
  { role: 'New Hire', id: 'USR-9921...', version: 'Pending', date: '-', status: 'Not completed yet' },
];

const STATUS_VARIANT = {
  Completed: 'success',
  'Needs Review': 'warning',
  'Due Soon': 'info',
  'Not completed yet': 'neutral',
};

export default function PolicyVersionDetail() {
  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-2">
          <span>Policies</span>
          <ChevronRight size={13} />
          <span className="text-slate-600">Mandatory Policies</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Mandatory Policies
            </h1>
            <p className="text-base text-slate-600 max-w-lg leading-relaxed">
              Manage versions, track acknowledgements, and ensure
              governance for all support workers.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <Button variant="tint-purple" icon={Download} className="w-auto! px-4! py-2!">
                Export Metadata
              </Button>
              <Button variant="tint-red" icon={Archive} className="w-auto! px-4! py-2!">
                Archive
              </Button>
            </div>
            <Button variant="primary" icon={Upload} className="w-auto! px-4! py-2!">
              Upload New Version
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoTile
          icon={History}
          tone="purple"
          tag="Active"
          label="Current Version"
          value="v2.0"
        />
        <InfoTile
          icon={Users}
          tone="blue"
          label="Audience"
          value="All Support Workers"
        />
        <InfoTile
          icon={FileEdit}
          tone="green"
          tag="+5% this week"
          label="Acknowledgement Status"
          value="85%"
          valueSuffix="Completed"
        />
        <InfoTile
          icon={Calendar}
          tone="gray"
          label="Last Updated"
          value="12 June 2026"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 items-start">
        <div className={CARD}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} className="text-brand-600" />
            <h2 className="text-sm font-semibold text-slate-800">
              Version Timeline
            </h2>
          </div>
          <VersionTimeline items={VERSION_HISTORY} />
        </div>

        <div className={CARD}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClipboardCheck size={15} className="text-brand-600" />
              <h2 className="text-sm font-semibold text-slate-800">
                Acknowledgement Metadata
              </h2>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-50 transition-colors">
              All Statuses
              <ChevronDown size={13} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="font-medium pb-2">User Role</th>
                  <th className="font-medium pb-2">User ID</th>
                  <th className="font-medium pb-2">Version Acknowledged</th>
                  <th className="font-medium pb-2">Date</th>
                  <th className="font-medium pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {ACK_ROWS.map((row, idx) => (
                  <tr key={idx} className="border-t border-slate-100">
                    <td className="py-2.5 text-slate-700">{row.role}</td>
                    <td className="py-2.5 text-slate-500">{row.id}</td>
                    <td className="py-2.5 text-slate-700">{row.version}</td>
                    <td className="py-2.5 text-slate-500">{row.date}</td>
                    <td className="py-2.5">
                      <Badge variant={STATUS_VARIANT[row.status]}>
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">Showing 5 of 142 records</p>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">
                <ChevronLeft size={14} />
              </button>
              <button className="w-7 h-7 rounded-full bg-brand-700 text-white text-xs font-medium flex items-center justify-center">
                1
              </button>
              <button className="w-7 h-7 rounded-full text-xs text-slate-500 hover:bg-slate-50 flex items-center justify-center">
                2
              </button>
              <button className="w-7 h-7 rounded-full text-xs text-slate-500 hover:bg-slate-50 flex items-center justify-center">
                3
              </button>
              <button className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
