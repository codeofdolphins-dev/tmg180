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
  /** A snapshot share link — the only signed-out page that shows a record. */
  snapshotShare: '/share/snapshot/:token',
};

export const PARTICIPANT_PATHS = {
  root: '/participant',
  dashboard: '/participant/dashboard',
  profile: '/participant/profile',
  profilePrint: '/participant/profile/print',
  profileSection: '/participant/profile/:sectionSlug',
  dailyLog: '/participant/daily-log',
  dailyLogNew: '/participant/daily-log/new',
  dailyLogDetail: '/participant/daily-log/:id',
  dailyLogEdit: '/participant/daily-log/:id/edit',
  checkIns: '/participant/check-ins',
  checkInNew: '/participant/check-ins/new',
  checkInDetail: '/participant/check-ins/:id',
  snapshot: '/participant/snapshot',
  snapshotExports: '/participant/snapshot/exports',
  snapshotDetail: '/participant/snapshot/:id',
  snapshotReview: '/participant/snapshot/:id/review',
  browseWorkers: '/participant/browse-workers',
  browseWorkersProfile: '/participant/browse-workers/:workerId',
  library: '/participant/library',
  libraryReading: '/participant/library/:slug',
  concerns: '/participant/concerns',
  concernNew: '/participant/concerns/new',
  concernDetail: '/participant/concerns/:id',
  supportFit: '/participant/support-fit',
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

/** Personal Profile → one section's page; key is a canonical section key. */
export const participantProfilePath = {
  section: (key) => `/participant/profile/${key.replace(/_/g, '-')}`,
};

/** One log has three URLs: read it, edit its draft, or start a new one. */
export const participantDailyLogPath = {
  detail: (id) => `/participant/daily-log/${id}`,
  edit: (id) => `/participant/daily-log/${id}/edit`,
  new: () => PARTICIPANT_PATHS.dailyLogNew,
};

/**
 * A check-in has two URLs, not three: it is locked the moment it saves, so
 * there is no edit state to route to.
 */
export const participantCheckInPath = {
  detail: (id) => `/participant/check-ins/${id}`,
  new: () => PARTICIPANT_PATHS.checkInNew,
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

/**
 * Learning Hub → one reading; the slug is a LEARNING_RESOURCE_SLUGS value.
 *
 * A reading is one library shared by the Learning Hub and the governance
 * items that point at it. `fromItem` records which governance item sent the
 * worker here so the reading can offer the way back — a worker who opened a
 * reading in order to confirm an item should land back on that item, not in
 * the Hub they never chose to visit.
 */
export const workerLearningPath = {
  resource: (slug, fromItem) =>
    fromItem
      ? `/worker/learning-hub/resource/${slug}?from=${encodeURIComponent(fromItem)}`
      : `/worker/learning-hub/resource/${slug}`,
};

/** A raised concern has a read URL; there is no edit URL because it is never edited. */
export const participantConcernPath = {
  detail: (id) => `/participant/concerns/${id}`,
  new: () => PARTICIPANT_PATHS.concernNew,
};

/** Library → one reading; the slug is a PARTICIPANT_READING_SLUGS value. */
export const participantLibraryPath = {
  reading: (slug) => `/participant/library/${slug}`,
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
