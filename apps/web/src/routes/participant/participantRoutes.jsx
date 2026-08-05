import ParticipantDashboard from '../../pages/participant/ParticipantDashboard';
import MyPersonalProfile from '../../pages/participant/MyPersonalProfile';
import ProfileAboutMe from '../../pages/participant/ProfileAboutMe';
import ProfileHowICommunicate from '../../pages/participant/ProfileHowICommunicate';
import ProfileMyGoals from '../../pages/participant/ProfileMyGoals';
import ProfileDailyLiving from '../../pages/participant/ProfileDailyLiving';
import ProfileMobilityAccess from '../../pages/participant/ProfileMobilityAccess';
import ProfileHealthWellbeing from '../../pages/participant/ProfileHealthWellbeing';
import ProfileSocialCommunity from '../../pages/participant/ProfileSocialCommunity';
import ProfileDecisionMaking from '../../pages/participant/ProfileDecisionMaking';
import ProfileSafetySupport from '../../pages/participant/ProfileSafetySupport';
import ProfileLearningEmployment from '../../pages/participant/ProfileLearningEmployment';
import ProfileSelfCare from '../../pages/participant/ProfileSelfCare';
import ParticipantDailyLog from '../../pages/participant/ParticipantDailyLog';
import DailySupportEvidenceLog from '../../pages/participant/DailySupportEvidenceLog';
import MonthlySnapshotSummary from '../../pages/participant/MonthlySnapshotSummary';
import SnapshotExports from '../../pages/participant/SnapshotExports';
import BrowseVerifiedWorkers from '../../pages/participant/BrowseVerifiedWorkers';
import RelationalWorkerProfile from '../../pages/participant/RelationalWorkerProfile';
import WorkerDirectory from '../../pages/participant/WorkerDirectory';
import WorkerDirectoryProfile from '../../pages/participant/WorkerDirectoryProfile';
import Library from '../../pages/participant/Library';
import SessionPreferences from '../../pages/participant/SessionPreferences';
import PrivacySharing from '../../pages/participant/PrivacySharing';
import ParticipantHelpCentre from '../../pages/participant/ParticipantHelpCentre';
import PermissionDeniedParticipant from '../../pages/participant/PermissionDeniedParticipant';
import { PARTICIPANT_PATHS as P, rel } from '../paths';

/**
 * Participant Portal — participant-owned records, browse + direct contact.
 * These render inside ParticipantLayout (shared fixed sidebar + top bar).
 */
export const participantRoutes = [
  { path: rel(P.dashboard), element: <ParticipantDashboard /> },
  { path: rel(P.profile), element: <MyPersonalProfile /> },
  { path: rel(P.profileAboutMe), element: <ProfileAboutMe /> },
  { path: rel(P.profileHowICommunicate), element: <ProfileHowICommunicate /> },
  { path: rel(P.profileMyGoals), element: <ProfileMyGoals /> },
  { path: rel(P.profileDailyLiving), element: <ProfileDailyLiving /> },
  { path: rel(P.profileMobilityAccess), element: <ProfileMobilityAccess /> },
  { path: rel(P.profileHealthWellbeing), element: <ProfileHealthWellbeing /> },
  { path: rel(P.profileSocialCommunity), element: <ProfileSocialCommunity /> },
  { path: rel(P.profileDecisionMaking), element: <ProfileDecisionMaking /> },
  { path: rel(P.profileSafetySupport), element: <ProfileSafetySupport /> },
  { path: rel(P.profileLearningEmployment), element: <ProfileLearningEmployment /> },
  { path: rel(P.profileSelfCare), element: <ProfileSelfCare /> },
  { path: rel(P.dailyLog), element: <ParticipantDailyLog /> },
  { path: rel(P.dailyLogEvidence), element: <DailySupportEvidenceLog /> },
  { path: rel(P.snapshot), element: <MonthlySnapshotSummary /> },
  { path: rel(P.snapshotExports), element: <SnapshotExports /> },
  { path: rel(P.browseWorkers), element: <BrowseVerifiedWorkers /> },
  { path: rel(P.browseWorkersProfile), element: <RelationalWorkerProfile /> },
  { path: rel(P.directory), element: <WorkerDirectory /> },
  { path: rel(P.directoryProfile), element: <WorkerDirectoryProfile /> },
  { path: rel(P.library), element: <Library /> },
  { path: rel(P.preferences), element: <SessionPreferences /> },
  { path: rel(P.privacySharing), element: <PrivacySharing /> },
  { path: rel(P.help), element: <ParticipantHelpCentre /> },
];

/** Full-screen states that intentionally render without the portal chrome. */
export const participantStandaloneRoutes = [
  { path: rel(P.permissionDenied), element: <PermissionDeniedParticipant /> },
];
