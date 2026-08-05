import PlatformGovernanceDashboard from '../../pages/admin/PlatformGovernanceDashboard';
import WorkersReport from '../../pages/admin/WorkersReport';
import ReportDetail from '../../pages/admin/ReportDetail';
import AddNewReport from '../../pages/admin/AddNewReport';
import GovernanceStanding from '../../pages/admin/GovernanceStanding';
import Policies from '../../pages/admin/Policies';
import PolicyVersionDetail from '../../pages/admin/PolicyVersionDetail';
import IncidentsComplaints from '../../pages/admin/IncidentsComplaints';
import TicketDetail from '../../pages/admin/TicketDetail';
import ParticipantOverview from '../../pages/admin/ParticipantOverview';
import ConsentAuditLog from '../../pages/admin/ConsentAuditLog';
import SettingsPage from '../../pages/admin/SettingsPage';
import AdminProfile from '../../pages/admin/AdminProfile';
import PermissionDeniedAdmin from '../../pages/admin/PermissionDeniedAdmin';
import { ADMIN_PATHS as P, rel } from '../paths';

/** Platform Governance — metadata-only admin portal. */
export const adminRoutes = [
  { path: rel(P.dashboard), element: <PlatformGovernanceDashboard /> },
  { path: rel(P.workersReport), element: <WorkersReport /> },
  { path: rel(P.reportDetail), element: <ReportDetail /> },
  { path: rel(P.reportNew), element: <AddNewReport /> },
  { path: rel(P.governanceStanding), element: <GovernanceStanding /> },
  { path: rel(P.policies), element: <Policies /> },
  { path: rel(P.policyVersionDetail), element: <PolicyVersionDetail /> },
  { path: rel(P.incidents), element: <IncidentsComplaints /> },
  { path: rel(P.ticketDetail), element: <TicketDetail /> },
  { path: rel(P.participantOverview), element: <ParticipantOverview /> },
  { path: rel(P.consentAuditLog), element: <ConsentAuditLog /> },
  { path: rel(P.settings), element: <SettingsPage /> },
  { path: rel(P.profile), element: <AdminProfile /> },
  { path: rel(P.permissionDenied), element: <PermissionDeniedAdmin /> },
];
