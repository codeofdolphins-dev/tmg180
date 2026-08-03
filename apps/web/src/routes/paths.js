import { ROLES } from '../store';

/**
 * Single source of truth for every route path in the app.
 * Portal pages are namespaced by role: /participant/*, /worker/*, /admin/*.
 */

export const PUBLIC_PATHS = {
  signIn: '/sign-in',
  forgotPassword: '/forgot-password',
  checkEmail: '/check-email',
  resetPassword: '/reset-password',
  createNewPassword: '/create-new-password',
  passwordUpdated: '/password-updated',
  roleSelection: '/role-selection',
  chooseWorkspace: '/choose-workspace',
  linkExpired: '/link-expired',
  error: '/error',
};

export const PARTICIPANT_PATHS = {
  root: '/participant',
  dashboard: '/participant/dashboard',
  profile: '/participant/profile',
  profileAboutMe: '/participant/profile/about-me',
  profileHowICommunicate: '/participant/profile/how-i-communicate',
  profileMyGoals: '/participant/profile/my-goals',
  profileDailyLiving: '/participant/profile/daily-living',
  profileMobilityAccess: '/participant/profile/mobility-access',
  profileHealthWellbeing: '/participant/profile/health-wellbeing',
  profileSocialCommunity: '/participant/profile/social-community',
  profileDecisionMaking: '/participant/profile/decision-making',
  profileSafetySupport: '/participant/profile/safety-support',
  profileLearningEmployment: '/participant/profile/learning-employment',
  profileSelfCare: '/participant/profile/self-care',
  dailyLog: '/participant/daily-log',
  dailyLogEvidence: '/participant/daily-log/evidence',
  snapshot: '/participant/snapshot',
  snapshotExports: '/participant/snapshot/exports',
  browseWorkers: '/participant/browse-workers',
  browseWorkersProfile: '/participant/browse-workers/profile',
  directory: '/participant/directory',
  directoryProfile: '/participant/directory/profile',
  library: '/participant/library',
  preferences: '/participant/preferences',
  privacySharing: '/participant/privacy-sharing',
  help: '/participant/help',
  permissionDenied: '/participant/permission-denied',
};

export const WORKER_PATHS = {
  root: '/worker',
  dashboard: '/worker/dashboard',
  onboarding: '/worker/onboarding',
  profile: '/worker/profile',
  settings: '/worker/settings',
  calendar: '/worker/calendar',
  participants: '/worker/participants',
  noConsent: '/worker/participants/no-consent',
  dailyLogs: '/worker/daily-logs',
  dailyLogNew: '/worker/daily-log/new',
  snapshots: '/worker/snapshots',
  snapshotsEmpty: '/worker/snapshots/empty',
  exportsEmpty: '/worker/exports/empty',
  learningHub: '/worker/learning-hub',
  learningHubResource: '/worker/learning-hub/resource',
  resources: '/worker/resources',
  governance: '/worker/governance',
  governanceItem: '/worker/governance/item',
  help: '/worker/help',
  favouritesEmpty: '/worker/favourites/empty',
  permissionDenied: '/worker/permission-denied',
};

export const ADMIN_PATHS = {
  root: '/admin',
  dashboard: '/admin/dashboard',
  workersReport: '/admin/workers-report',
  reportDetail: '/admin/reports/detail',
  reportNew: '/admin/reports/new',
  governanceStanding: '/admin/governance-standing',
  policies: '/admin/policies',
  policyVersionDetail: '/admin/policies/version-detail',
  incidents: '/admin/incidents',
  ticketDetail: '/admin/incidents/ticket',
  participantOverview: '/admin/participant-overview',
  consentAuditLog: '/admin/consent-audit-log',
  settings: '/admin/settings',
  profile: '/admin/profile',
  permissionDenied: '/admin/permission-denied',
};

export const DASHBOARD_BY_ROLE = {
  [ROLES.PARTICIPANT]: PARTICIPANT_PATHS.dashboard,
  [ROLES.WORKER]: WORKER_PATHS.dashboard,
  [ROLES.ADMIN]: ADMIN_PATHS.dashboard,
};

/** Strip the role prefix so path constants can be reused as nested route segments. */
export const rel = (path) => path.replace(/^\/(participant|worker|admin)\//, '');
