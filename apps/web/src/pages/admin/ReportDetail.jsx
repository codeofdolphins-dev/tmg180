import {
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Download,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Clock,
  Users,
  FileText,
  TrendingUp,
  Lock,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import MetricCard from '../../components/ui/MetricCard';
import Avatar from '../../components/ui/Avatar';
import { PolicyTrendChart, IncidentRateChart } from '../../components/ui/TrendCharts';
import { useNavigate } from 'react-router-dom';
import { ADMIN_PATHS } from '../../routes/paths';

/**
 * Report Detail — governance portal. Renders inside GovernanceLayout (shared
 * fixed sidebar + top bar); this file is content only, on the portal card
 * idiom shared with the participant / worker workspaces.
 */

const CARD = 'bg-white/80 rounded-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';

const METADATA_ITEMS = [
  { icon: ShieldCheck, text: 'Worker verification records' },
  { icon: FileCheck2, text: 'Policy acknowledgement logs' },
  { icon: Clock, text: 'Consent audit timestamps' },
  { icon: AlertTriangle, text: 'Incident/complaint ticket metadata' },
  { icon: Users, text: 'Aggregated participant metadata' },
];

const EXPORTS = [
  { date: 'Jul 2, 2026 • 09:15 AM', admin: 'Sarah Jenkins', format: 'PDF' },
  { date: 'Jul 1, 2026 • 14:30 PM', admin: 'Marcus Reed', format: 'CSV' },
];

export default function ReportDetail() {
  const navigate = useNavigate();
  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            June 2026 Governance Metadata Report
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar size={14} />
            <span>Generated: July 1, 2026</span>
            <Badge variant="success" icon={CheckCircle2}>
              Finalized
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            icon={ArrowLeft}
            className="w-auto! px-4! py-2!"
            onClick={() => navigate(ADMIN_PATHS.workersReport)}
          >
            Back to reports
          </Button>
          <Button variant="outline" icon={Download} className="w-auto! px-4! py-2!">
            CSV
          </Button>
          <Button variant="primary" icon={Download} className="w-auto! px-4! py-2!">
            Download PDF
          </Button>
        </div>
      </div>

      <div className="bg-brand-50/60 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-2">
          Executive Summary
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          This finalized report provides a comprehensive overview of
          governance metadata and platform health for the June 2026
          period. It captures key metrics regarding worker verification
          status, mandatory policy acknowledgements, active incident
          ticketing, and consent audit trails, establishing a verified
          baseline for Q2 governance standing.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={ShieldCheck} tone="purple" label="Total Workers Verified" value="1,240" />
        <MetricCard icon={CheckCircle2} tone="green" label="Policy Acknowledgement" value="98.4%" />
        <MetricCard icon={AlertTriangle} tone="red" label="Open Incident Tickets" value="12" />
        <MetricCard icon={ShieldCheck} tone="blue" label="Active Consent Audits" value="45" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">
          <div className={CARD}>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400 mb-3">
              <Calendar size={13} />
              <span>Scope</span>
            </div>
            <p className="text-xs text-slate-400 mb-1">Reporting Period</p>
            <p className="text-base font-bold text-slate-900">
              June 1 – 30, 2026
            </p>
          </div>

          <div className={CARD}>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400 mb-3">
              <FileText size={13} />
              <span>Included Metadata</span>
            </div>
            <ul className="flex flex-col gap-3">
              {METADATA_ITEMS.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <Icon size={14} className="text-brand-500 mt-0.5 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={CARD}>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400 mb-4">
              <TrendingUp size={13} />
              <span>Performance Trends</span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 mb-2">
                  Policy Acknowledgement Trend
                </p>
                <PolicyTrendChart />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">
                  Incident Resolution Rate
                </p>
                <IncidentRateChart />
              </div>
            </div>
          </div>

          <div className={CARD}>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400 mb-3">
              <Download size={13} />
              <span>Export History</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400">
                  <th className="font-medium pb-2">Date &amp; Time</th>
                  <th className="font-medium pb-2">Admin</th>
                  <th className="font-medium pb-2">Format</th>
                </tr>
              </thead>
              <tbody>
                {EXPORTS.map((row) => (
                  <tr key={row.date} className="border-t border-slate-100">
                    <td className="py-2.5 text-slate-600">{row.date}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={row.admin} size={6} />
                        <span className="text-slate-700">{row.admin}</span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <Badge variant={row.format === 'PDF' ? 'brand' : 'neutral'}>
                        {row.format}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
        <Lock size={16} className="text-emerald-600 mt-0.5 shrink-0" />
        <p className="text-sm text-emerald-800">
          <span className="font-semibold">Privacy Notice:</span> This
          report contains platform-level metadata only. No
          participant-owned record content or protected health
          information is included in these aggregations.
        </p>
      </div>
    </div>
  );
}
