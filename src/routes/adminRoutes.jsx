import PlatformGovernanceDashboard from '../pages/PlatformGovernanceDashboard';
import WorkersReport from '../pages/WorkersReport';
import ReportDetail from '../pages/ReportDetail';
import AddNewReport from '../pages/AddNewReport';
import GovernanceStanding from '../pages/GovernanceStanding';
import Policies from '../pages/Policies';
import PolicyVersionDetail from '../pages/PolicyVersionDetail';
import IncidentsComplaints from '../pages/IncidentsComplaints';
import TicketDetail from '../pages/TicketDetail';
import ParticipantOverview from '../pages/ParticipantOverview';
import ConsentAuditLog from '../pages/ConsentAuditLog';
import SettingsPage from '../pages/SettingsPage';
import AdminProfile from '../pages/AdminProfile';
import PermissionDeniedAdmin from '../pages/PermissionDeniedAdmin';
import { ADMIN_PATHS as P, rel } from './paths';

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
