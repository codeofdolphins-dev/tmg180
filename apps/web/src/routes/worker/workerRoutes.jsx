import WorkerDashboard from '../pages/WorkerDashboard';
import WorkerOnboarding from '../pages/WorkerOnboarding';
import WorkerProfile from '../pages/WorkerProfile';
import WorkerSettings from '../pages/WorkerSettings';
import Calendar from '../pages/Calendar';
import ParticipantsISupport from '../pages/ParticipantsISupport';
import NoConsentAccess from '../pages/NoConsentAccess';
import EmptyDailyLogs from '../pages/EmptyDailyLogs';
import DailyLogForm from '../pages/DailyLogForm';
import ApprovedSnapshots from '../pages/ApprovedSnapshots';
import EmptyMonthlySnapshot from '../pages/EmptyMonthlySnapshot';
import EmptyExport from '../pages/EmptyExport';
import LearningHub from '../pages/LearningHub';
import LearningHubResource from '../pages/LearningHubResource';
import Resources from '../pages/Resources';
import WorkerGovernanceStanding from '../pages/WorkerGovernanceStanding';
import GovernanceItemDetail from '../pages/GovernanceItemDetail';
import HelpCentre from '../pages/HelpCentre';
import EmptyFavourites from '../pages/EmptyFavourites';
import PermissionDeniedWorker from '../pages/PermissionDeniedWorker';
import { WORKER_PATHS as P, rel } from './paths';

/** Worker Workspace — self-employed support workers. */
export const workerRoutes = [
  { path: rel(P.dashboard), element: <WorkerDashboard /> },
  { path: rel(P.onboarding), element: <WorkerOnboarding /> },
  { path: rel(P.profile), element: <WorkerProfile /> },
  { path: rel(P.settings), element: <WorkerSettings /> },
  { path: rel(P.calendar), element: <Calendar /> },
  { path: rel(P.participants), element: <ParticipantsISupport /> },
  { path: rel(P.noConsent), element: <NoConsentAccess /> },
  { path: rel(P.dailyLogs), element: <EmptyDailyLogs /> },
  { path: rel(P.dailyLogNew), element: <DailyLogForm /> },
  { path: rel(P.snapshots), element: <ApprovedSnapshots /> },
  { path: rel(P.snapshotsEmpty), element: <EmptyMonthlySnapshot /> },
  { path: rel(P.exportsEmpty), element: <EmptyExport /> },
  { path: rel(P.learningHub), element: <LearningHub /> },
  { path: rel(P.learningHubResource), element: <LearningHubResource /> },
  { path: rel(P.resources), element: <Resources /> },
  { path: rel(P.governance), element: <WorkerGovernanceStanding /> },
  { path: rel(P.governanceItem), element: <GovernanceItemDetail /> },
  { path: rel(P.help), element: <HelpCentre /> },
  { path: rel(P.favouritesEmpty), element: <EmptyFavourites /> },
  { path: rel(P.permissionDenied), element: <PermissionDeniedWorker /> },
];
