import ParticipantDashboard from '../../pages/participant/ParticipantDashboard';
import MyPersonalProfile from '../../pages/participant/MyPersonalProfile';
import ProfileSection from '../../pages/participant/ProfileSection';
import DailyLogList from '../../pages/participant/DailyLogList';
import ParticipantDailyLog from '../../pages/participant/ParticipantDailyLog';
import DailySupportEvidenceLog from '../../pages/participant/DailySupportEvidenceLog';
import MonthlySnapshotList from '../../pages/participant/MonthlySnapshotList';
import MonthlySnapshotReview from '../../pages/participant/MonthlySnapshotReview';
import MonthlySnapshotSummary from '../../pages/participant/MonthlySnapshotSummary';
import SnapshotExports from '../../pages/participant/SnapshotExports';
import BrowseVerifiedWorkers from '../../pages/participant/BrowseVerifiedWorkers';
import RelationalWorkerProfile from '../../pages/participant/RelationalWorkerProfile';
import Library from '../../pages/participant/Library';
import LibraryReading from '../../pages/participant/LibraryReading';
import PrivacySharing from '../../pages/participant/PrivacySharing';
import ParticipantHelpCentre from '../../pages/participant/ParticipantHelpCentre';
import PermissionDeniedParticipant from '../../pages/participant/PermissionDeniedParticipant';
import { PARTICIPANT_PATHS as P, rel } from '../paths';

/**
 * Participant Portal — participant-owned records, browse + direct contact.
 * These render inside ParticipantLayout (shared fixed sidebar + top bar).
 *
 * The Personal Profile's 11 sections share one contract-driven page
 * (Final Override P1) — the slug picks the section definition.
 */
export const participantRoutes = [
  { path: rel(P.dashboard), element: <ParticipantDashboard /> },
  { path: rel(P.profile), element: <MyPersonalProfile /> },
  { path: rel(P.profileSection), element: <ProfileSection /> },
  { path: rel(P.dailyLog), element: <DailyLogList /> },
  { path: rel(P.dailyLogNew), element: <ParticipantDailyLog /> },
  { path: rel(P.dailyLogEdit), element: <ParticipantDailyLog /> },
  { path: rel(P.dailyLogDetail), element: <DailySupportEvidenceLog /> },
  { path: rel(P.snapshot), element: <MonthlySnapshotList /> },
  { path: rel(P.snapshotExports), element: <SnapshotExports /> },
  { path: rel(P.snapshotReview), element: <MonthlySnapshotReview /> },
  { path: rel(P.snapshotDetail), element: <MonthlySnapshotSummary /> },
  { path: rel(P.browseWorkers), element: <BrowseVerifiedWorkers /> },
  { path: rel(P.browseWorkersProfile), element: <RelationalWorkerProfile /> },
  { path: rel(P.library), element: <Library /> },
  { path: rel(P.libraryReading), element: <LibraryReading /> },
  { path: rel(P.privacySharing), element: <PrivacySharing /> },
  { path: rel(P.help), element: <ParticipantHelpCentre /> },
];

/** Full-screen states that intentionally render without the portal chrome. */
export const participantStandaloneRoutes = [
  { path: rel(P.permissionDenied), element: <PermissionDeniedParticipant /> },
];
