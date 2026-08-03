import {
  ArrowLeft,
  ChevronDown,
  CircleCheck,
  Info,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  Save,
  Activity,
  Calendar,
} from 'lucide-react';
import GovernanceLayout from '../components/layout/GovernanceLayout';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import TicketStatTile from '../components/ui/TicketStatTile';
import Avatar from '../components/ui/Avatar';
import Timeline from '../components/ui/Timeline';
import { useNavigate } from 'react-router-dom';
import { ADMIN_PATHS } from '../routes/paths';

const ACTIVITY = [
  {
    title: 'Status Updated',
    detail: 'Ticket moved to In review',
    date: 'Today, 09:30 AM • System Automation',
    dotClass: 'bg-sky-500',
  },
  {
    title: 'Assigned',
    detail: 'Assigned to Sarah Jenkins',
    date: 'Yesterday, 2:45 PM • Manager Assignment',
    dotClass: 'bg-brand-600',
  },
  {
    title: 'Ticket Created',
    detail: 'Submitted via Support Portal',
    date: 'Oct 24, 2023, 10:12 AM',
    dotClass: 'bg-slate-300',
  },
];

export default function TicketDetail() {
  const navigate = useNavigate();
  return (
    <GovernanceLayout
      portalLabel="Governance Portal"
      activeItem="Incidents"
      searchPlaceholder="Search governance hub..."
      showSupport={false}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(ADMIN_PATHS.incidents)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Incidents
          </button>
          <div className="flex items-center gap-2">
            <Button variant="outline" icon={ChevronDown} iconPosition="right" className="w-auto! px-4! py-2!">
              Update status
            </Button>
            <Button variant="primary" icon={CircleCheck} className="w-auto! px-4! py-2!">
              Close ticket
            </Button>
          </div>
        </div>

        <div className="bg-slate-200/40 rounded-2xl p-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="neutral">TIC-8842</Badge>
              <Badge variant="success" icon={Info}>
                Complaint
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              Facility Access Dispute
            </h1>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                Created: Oct 24, 2023
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                Last updated: 2 hours ago
              </span>
            </div>
          </div>
          <Badge variant="info">Needs review</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TicketStatTile icon={Info} tone="blue" label="Current Status" value="In review" />
          <TicketStatTile
            avatarSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            label="Assigned To"
            value="Sarah Jenkins"
            subLabel="Governance Team"
          />
          <TicketStatTile icon={CheckCircle2} tone="purple" label="Priority Level" value="Elevated" />
          <TicketStatTile icon={Clock} tone="neutral" label="Days Open" value="3 days" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-start">
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={15} className="text-brand-600" />
                <h2 className="text-sm font-semibold text-slate-800">
                  Ticket Summary
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                A report was submitted regarding a discrepancy in facility
                access protocols at the Downtown Hub. The submitter indicated
                that their approved governance access credential was not
                recognized by the automated entry system during standard
                operating hours (09:00 AM).
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                The issue appears isolated to Gate B, as subsequent entry
                through Gate A was successful. The submitter requests a
                review of the credential synchronization between the central
                governance database and the local facility security system.
              </p>

              <div className="bg-purple-50/70 border-l-4 border-brand-600 rounded-r-lg p-4">
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  Impact Statement
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Delayed entry to scheduled governance briefing session by
                  15 minutes. Minor operational friction.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Submitter Context
                </p>
                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Role</span>
                    <span className="text-slate-700 font-medium">
                      Community Liaison
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">System ID</span>
                    <span className="text-slate-700 font-medium">USR-992-K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Department</span>
                    <span className="text-slate-700 font-medium">Outreach</span>
                  </div>
                </div>
              </div>

              <div className="relative bg-white border border-slate-200 rounded-xl p-5 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage:
                      'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)',
                    backgroundSize: '14px 14px',
                  }}
                />
                <p className="relative text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Location Details
                </p>
                <div className="relative flex flex-col gap-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Facility</span>
                    <span className="text-slate-700 font-medium">
                      Downtown Hub
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Specific Area</span>
                    <span className="text-slate-700 font-medium">
                      Gate B Entrance
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">System Version</span>
                    <span className="text-slate-700 font-medium">v2.4.1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <Lock size={14} className="text-brand-600" />
                <h2 className="text-sm font-semibold text-slate-800">
                  Internal Notes
                </h2>
              </div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                These notes are only visible to Governance Administrators.
              </p>
              <textarea
                placeholder="Add observations or sync updates..."
                rows={3}
                className="w-full text-sm text-slate-600 placeholder:text-slate-400 border border-slate-200 rounded-lg p-3 outline-none resize-none mb-3"
              />
              <Button variant="secondary" icon={Save} fullWidth className="mb-4 text-sm!">
                Save note
              </Button>

              <div className="flex items-start gap-2.5 pt-3 border-t border-slate-100">
                <Avatar name="Sarah Jenkins" size={6} />
                <div className="min-w-0">
                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">Sarah Jenkins</span>{' '}
                    <span className="text-slate-400">Yesterday, 4:15 PM</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Initiated a manual sync for USR-992-K credential profile.
                    Awaiting overnight batch process to confirm resolution at
                    Gate B.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={14} className="text-brand-600" />
                <h2 className="text-sm font-semibold text-slate-800">
                  Activity Log
                </h2>
              </div>
              <Timeline items={ACTIVITY} />
            </div>
          </div>
        </div>
      </div>
    </GovernanceLayout>
  );
}
