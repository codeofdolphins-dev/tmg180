import WorkerDashboard from '../../pages/worker/WorkerDashboard';
import WorkerOnboarding from '../../pages/worker/WorkerOnboarding';
import WorkerProfile from '../../pages/worker/WorkerProfile';
import WorkerSettings from '../../pages/worker/WorkerSettings';
import Calendar from '../../pages/worker/Calendar';
import ParticipantsISupport from '../../pages/worker/ParticipantsISupport';
import NoConsentAccess from '../../pages/worker/NoConsentAccess';
import WorkerDailyLogList from '../../pages/worker/WorkerDailyLogList';
import DailyLogForm from '../../pages/worker/DailyLogForm';
import WorkerDailyLogDetail from '../../pages/worker/WorkerDailyLogDetail';
import ApprovedSnapshots from '../../pages/worker/ApprovedSnapshots';
import WorkerSnapshotDetail from '../../pages/worker/WorkerSnapshotDetail';
import EmptyExport from '../../pages/worker/EmptyExport';
import LearningHub from '../../pages/worker/LearningHub';
import LearningHubResource from '../../pages/worker/LearningHubResource';
import Resources from '../../pages/worker/Resources';
import WorkerGovernanceStanding from '../../pages/worker/WorkerGovernanceStanding';
import GovernanceItemDetail from '../../pages/worker/GovernanceItemDetail';
import HelpCentre from '../../pages/worker/HelpCentre';
import EmptyFavourites from '../../pages/worker/EmptyFavourites';
import PermissionDeniedWorker from '../../pages/worker/PermissionDeniedWorker';
import { WORKER_PATHS as P, rel } from '../paths';

/**
 * Worker Workspace — self-employed support workers.
 * These render inside WorkerLayout (shared fixed sidebar + top bar).
 */
export const workerRoutes = [
  { path: rel(P.dashboard), element: <WorkerDashboard /> },
  { path: rel(P.onboarding), element: <WorkerOnboarding /> },
  { path: rel(P.profile), element: <WorkerProfile /> },
  { path: rel(P.settings), element: <WorkerSettings /> },
  { path: rel(P.calendar), element: <Calendar /> },
  { path: rel(P.participants), element: <ParticipantsISupport /> },
  { path: rel(P.noConsent), element: <NoConsentAccess /> },
  { path: rel(P.dailyLogs), element: <WorkerDailyLogList /> },
  { path: rel(P.dailyLogNew), element: <DailyLogForm /> },
  { path: rel(P.dailyLogEdit), element: <DailyLogForm /> },
  { path: rel(P.dailyLogDetail), element: <WorkerDailyLogDetail /> },
  { path: rel(P.snapshots), element: <ApprovedSnapshots /> },
  { path: rel(P.snapshotDetail), element: <WorkerSnapshotDetail /> },
  { path: rel(P.exportsEmpty), element: <EmptyExport /> },
  { path: rel(P.learningHub), element: <LearningHub /> },
  { path: rel(P.learningHubResource), element: <LearningHubResource /> },
  { path: rel(P.resources), element: <Resources /> },
  { path: rel(P.governance), element: <WorkerGovernanceStanding /> },
  { path: rel(P.governanceItem), element: <GovernanceItemDetail /> },
  { path: rel(P.help), element: <HelpCentre /> },
  { path: rel(P.favouritesEmpty), element: <EmptyFavourites /> },
];

/** Full-screen states that intentionally render without the workspace chrome. */
export const workerStandaloneRoutes = [
  { path: rel(P.permissionDenied), element: <PermissionDeniedWorker /> },
];
