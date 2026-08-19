import { ROLES } from '../store';

/**
 * Single source of truth for every route path in the app.
 * Portal pages are namespaced by role: /participant/*, /worker/*, /admin/*.
 */

export const PUBLIC_PATHS = {
  signIn: '/sign-in',
  signUp: '/sign-up',
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
  dailyLogNew: '/participant/daily-log/new',
  dailyLogDetail: '/participant/daily-log/:id',
  dailyLogEdit: '/participant/daily-log/:id/edit',
  snapshot: '/participant/snapshot',
  snapshotExports: '/participant/snapshot/exports',
  snapshotDetail: '/participant/snapshot/:id',
  snapshotReview: '/participant/snapshot/:id/review',
  browseWorkers: '/participant/browse-workers',
  browseWorkersProfile: '/participant/browse-workers/:workerId',
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
  dailyLogDetail: '/worker/daily-log/:id',
  dailyLogEdit: '/worker/daily-log/:id/edit',
  snapshots: '/worker/snapshots',
  snapshotDetail: '/worker/snapshots/:id',
  exportsEmpty: '/worker/exports/empty',
  learningHub: '/worker/learning-hub',
  learningHubResource: '/worker/learning-hub/resource/:slug',
  resources: '/worker/resources',
  governance: '/worker/governance',
  governanceItem: '/worker/governance/item/:key',
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

/** One log has three URLs: read it, edit its draft, or start a new one. */
export const participantDailyLogPath = {
  detail: (id) => `/participant/daily-log/${id}`,
  edit: (id) => `/participant/daily-log/${id}/edit`,
  new: () => PARTICIPANT_PATHS.dailyLogNew,
};

/** The worker layer has the same three URLs per log. */
export const workerDailyLogPath = {
  detail: (id) => `/worker/daily-log/${id}`,
  edit: (id) => `/worker/daily-log/${id}/edit`,
  new: (participantId) =>
    participantId ? `${WORKER_PATHS.dailyLogNew}?participant=${participantId}` : WORKER_PATHS.dailyLogNew,
};

/** Governance Standing → one item's detail; the key is a GOVERNANCE_ITEM_KEYS value. */
export const workerGovernancePath = {
  item: (key) => `/worker/governance/item/${key}`,
};

/** Learning Hub → one reading; the slug is a LEARNING_RESOURCE_SLUGS value. */
export const workerLearningPath = {
  resource: (slug) => `/worker/learning-hub/resource/${slug}`,
};

/** Browse Directory → one published worker profile. */
export const participantDirectoryPath = {
  profile: (workerId) => `/participant/browse-workers/${workerId}`,
};

/** A worker only ever reads an approved snapshot — one URL, no edit state. */
export const workerSnapshotPath = {
  detail: (id) => `/worker/snapshots/${id}`,
};

/** A snapshot is reviewed while it is a draft, then read once it is locked. */
export const participantSnapshotPath = {
  detail: (id) => `/participant/snapshot/${id}`,
  review: (id) => `/participant/snapshot/${id}/review`,
};

export const DASHBOARD_BY_ROLE = {
  [ROLES.PARTICIPANT]: PARTICIPANT_PATHS.dashboard,
  [ROLES.WORKER]: WORKER_PATHS.dashboard,
  [ROLES.ADMIN]: ADMIN_PATHS.dashboard,
};

/** Strip the role prefix so path constants can be reused as nested route segments. */
export const rel = (path) => path.replace(/^\/(participant|worker|admin)\//, '');
