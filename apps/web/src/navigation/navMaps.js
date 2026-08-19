import { ROLES } from '../store';
import { PARTICIPANT_PATHS, WORKER_PATHS, ADMIN_PATHS } from '../routes/paths';

/**
 * Sidebar label -> route path, per role.
 * Admin pages still render their own sidebars with hardcoded labels (mirroring
 * individual Figma frames), so their navigation resolves by label. Labels not
 * listed here are intentional no-ops (screen not built yet).
 *
 * The participant and worker workspaces no longer go through this map: each has
 * one shared layout route (ParticipantLayout / WorkerLayout) whose sidebar
 * navigates by path and derives the active item from the URL. WORKER_NAV is kept
 * for the generic `layout/Sidebar.jsx` until the admin side gets the same treatment.
 */

export const SIGN_OUT = Symbol('sign-out');

const PARTICIPANT_NAV = {
  Dashboard: PARTICIPANT_PATHS.dashboard,
  'My Profile': PARTICIPANT_PATHS.profile,
  Profile: PARTICIPANT_PATHS.profile,
  'Daily Log': PARTICIPANT_PATHS.dailyLog,
  'Monthly Snapshot': PARTICIPANT_PATHS.snapshot,
  'Browse Directory': PARTICIPANT_PATHS.browseWorkers,
  'Verified Profiles Directory': PARTICIPANT_PATHS.browseWorkers,
  Library: PARTICIPANT_PATHS.library,
  'Session Preferences': PARTICIPANT_PATHS.preferences,
  Preferences: PARTICIPANT_PATHS.preferences,
  'Privacy & Sharing': PARTICIPANT_PATHS.privacySharing,
  'Help Centre': PARTICIPANT_PATHS.help,
  Help: PARTICIPANT_PATHS.help,
  Logout: SIGN_OUT,
  'Sign Out': SIGN_OUT,
};

const WORKER_NAV = {
  Dashboard: WORKER_PATHS.dashboard,
  Calendar: WORKER_PATHS.calendar,
  'Participants I support': WORKER_PATHS.participants,
  'Daily Logs': WORKER_PATHS.dailyLogs,
  'Daily Log': WORKER_PATHS.dailyLogs,
  'Monthly Snapshots': WORKER_PATHS.snapshots,
  'Monthly Snapshot': WORKER_PATHS.snapshots,
  Resources: WORKER_PATHS.resources,
  'Learning Hub': WORKER_PATHS.learningHub,
  'Governance Standing': WORKER_PATHS.governance,
  Settings: WORKER_PATHS.settings,
  'My Profile': WORKER_PATHS.profile,
  Profile: WORKER_PATHS.profile,
  'Help Centre': WORKER_PATHS.help,
  'Help Center': WORKER_PATHS.help,
  Help: WORKER_PATHS.help,
  Logout: SIGN_OUT,
  'Sign Out': SIGN_OUT,
};

const ADMIN_NAV = {
  Dashboard: ADMIN_PATHS.dashboard,
  'Workers Report': ADMIN_PATHS.workersReport,
  'Support Workers': ADMIN_PATHS.workersReport,
  'Governance Standing': ADMIN_PATHS.governanceStanding,
  Governance: ADMIN_PATHS.governanceStanding,
  Policies: ADMIN_PATHS.policies,
  Incidents: ADMIN_PATHS.incidents,
  'Participant Overview': ADMIN_PATHS.participantOverview,
  Participants: ADMIN_PATHS.participantOverview,
  'Participant Directory': ADMIN_PATHS.participantOverview,
  'Consent Audit Log': ADMIN_PATHS.consentAuditLog,
  'Audit Logs': ADMIN_PATHS.consentAuditLog,
  Reports: ADMIN_PATHS.reportNew,
  Settings: ADMIN_PATHS.settings,
  'Admin Profile': ADMIN_PATHS.profile,
  Logout: SIGN_OUT,
  'Sign Out': SIGN_OUT,
};

export const NAV_BY_ROLE = {
  [ROLES.PARTICIPANT]: PARTICIPANT_NAV,
  [ROLES.WORKER]: WORKER_NAV,
  [ROLES.ADMIN]: ADMIN_NAV,
};
