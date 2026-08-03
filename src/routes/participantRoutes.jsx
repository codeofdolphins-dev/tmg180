import ParticipantDashboard from '../pages/ParticipantDashboard';
import MyPersonalProfile from '../pages/MyPersonalProfile';
import ProfileAboutMe from '../pages/ProfileAboutMe';
import ProfileHowICommunicate from '../pages/ProfileHowICommunicate';
import ProfileMyGoals from '../pages/ProfileMyGoals';
import ProfileDailyLiving from '../pages/ProfileDailyLiving';
import ProfileMobilityAccess from '../pages/ProfileMobilityAccess';
import ProfileHealthWellbeing from '../pages/ProfileHealthWellbeing';
import ProfileSocialCommunity from '../pages/ProfileSocialCommunity';
import ProfileDecisionMaking from '../pages/ProfileDecisionMaking';
import ProfileSafetySupport from '../pages/ProfileSafetySupport';
import ProfileLearningEmployment from '../pages/ProfileLearningEmployment';
import ProfileSelfCare from '../pages/ProfileSelfCare';
import ParticipantDailyLog from '../pages/ParticipantDailyLog';
import DailySupportEvidenceLog from '../pages/DailySupportEvidenceLog';
import MonthlySnapshotSummary from '../pages/MonthlySnapshotSummary';
import SnapshotExports from '../pages/SnapshotExports';
import BrowseVerifiedWorkers from '../pages/BrowseVerifiedWorkers';
import RelationalWorkerProfile from '../pages/RelationalWorkerProfile';
import WorkerDirectory from '../pages/WorkerDirectory';
import WorkerDirectoryProfile from '../pages/WorkerDirectoryProfile';
import Library from '../pages/Library';
import SessionPreferences from '../pages/SessionPreferences';
import PrivacySharing from '../pages/PrivacySharing';
import HelpCentre from '../pages/HelpCentre';
import PermissionDeniedParticipant from '../pages/PermissionDeniedParticipant';
import { PARTICIPANT_PATHS as P, rel } from './paths';

/** Participant Portal — participant-owned records, browse + direct contact. */
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
  { path: rel(P.help), element: <HelpCentre /> },
  { path: rel(P.permissionDenied), element: <PermissionDeniedParticipant /> },
];
