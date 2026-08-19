/**
 * Privacy & Sharing: the participant's global preferences and the per-worker
 * consent grants (Figma 1169:2326, DB pack §3).
 *
 * Two different things live here and must not be confused:
 *
 *   preferences — global defaults the participant sets for themselves. They
 *     say what a grant is *allowed* to include; they never grant anything.
 *   consents    — a record per worker, append-only. Changing a grant writes a
 *     new row that supersedes the old one, and revoking stamps the old row
 *     rather than deleting it. The point of a consent record is that it can be
 *     read back later, so nothing here ever edits history in place.
 *
 * Everything is private by default (P1-03). A participant turning nothing on is
 * a participant sharing nothing.
 */

export const SHARING_PREFERENCES = [
  {
    key: 'share_snapshots',
    label: 'Allow selected worker to view approved snapshots',
    description:
      "Workers you've granted access can see your summarized monthly progress.",
    default: false,
  },
  {
    key: 'share_daily_logs',
    label: 'Allow selected worker to view Daily Support Evidence Logs',
    description: 'Grant detailed access to your day-to-day entries and reflections.',
    default: false,
  },
  {
    key: 'allow_share_links',
    label: 'Allow time-limited export links',
    description: 'Enable creating links that automatically expire after 7 days.',
    default: false,
    /** The external access layer is unbuilt; the preference is stored, not acted on. */
    pending: true,
  },
  {
    key: 'privacy_reminders',
    label: 'Receive privacy reminders',
    description: 'Get monthly notifications to review who has access to your information.',
    // Not a sharing switch — a reminder to check what is shared, so it is on.
    default: true,
    pending: true,
  },
];

export const PREFERENCE_KEYS = SHARING_PREFERENCES.map((preference) => preference.key);

export const DEFAULT_PREFERENCES = Object.fromEntries(
  SHARING_PREFERENCES.map((preference) => [preference.key, preference.default])
);

/**
 * The one consent type the app issues today: a participant letting a named
 * worker into parts of their record. Other types (external invitations,
 * research) exist in the DDL and would each be a new value here.
 */
export const CONSENT_TYPE_WORKER_ACCESS = 'worker_access';

export const CONSENT_STATUS = {
  ACTIVE: 'active',
  /** Replaced by a newer grant; kept for the record. */
  SUPERSEDED: 'superseded',
  REVOKED: 'revoked',
};

/**
 * The columns on tmg_consent a participant actually decides. `can_view_intake`
 * is the Personal Profile — the participant-facing name never says intake.
 */
export const CONSENT_PERMISSIONS = [
  {
    key: 'canViewSnapshot',
    column: 'can_view_snapshot',
    label: 'Approved monthly snapshots',
    description: 'The summaries you have approved and locked.',
  },
  {
    key: 'canViewProfile',
    column: 'can_view_intake',
    label: 'My Personal Profile',
    description: 'What you have written about yourself and your supports.',
  },
  {
    key: 'canAddDailyNote',
    column: 'can_add_daily_note',
    label: 'Add daily support evidence logs',
    description: 'Lets this worker write logs about the support they provide you.',
  },
  {
    key: 'canViewCheckins',
    column: 'can_view_checkins',
    label: 'Daily check-ins',
    description: 'Your short daily notes, in your own words.',
  },
];

export const CONSENT_PERMISSION_KEYS = CONSENT_PERMISSIONS.map((permission) => permission.key);

/** The frame's PERMISSION STATUS column, derived from what is actually granted. */
export function consentSummary(permissions = {}) {
  const granted = CONSENT_PERMISSION_KEYS.filter((key) => permissions[key] === true);
  if (granted.length === 0) return 'No access';
  if (granted.length === CONSENT_PERMISSION_KEYS.length) return 'Full access';
  if (granted.length === 1 && permissions.canViewSnapshot) return 'Snapshots only';
  return `${granted.length} of ${CONSENT_PERMISSION_KEYS.length} areas`;
}

/** @returns map of key -> message; empty object when valid. */
export function validatePreferences(preferences = {}) {
  const errors = {};
  for (const [key, value] of Object.entries(preferences)) {
    if (!PREFERENCE_KEYS.includes(key)) errors[key] = 'Unknown privacy preference.';
    else if (typeof value !== 'boolean') errors[key] = 'Must be true or false.';
  }
  return errors;
}

/** @returns map of key -> message; empty object when valid. */
export function validateConsentPermissions(permissions = {}) {
  const errors = {};
  for (const [key, value] of Object.entries(permissions)) {
    if (!CONSENT_PERMISSION_KEYS.includes(key)) errors[key] = 'Unknown permission.';
    else if (typeof value !== 'boolean') errors[key] = 'Must be true or false.';
  }
  return errors;
}

/**
 * Which audit actions belong on the participant's own privacy log, and how each
 * is said to them. Actions not listed here are internal and stay off this
 * screen — an audit log a person cannot read is not transparency.
 */
export const PRIVACY_AUDIT_ACTIONS = {
  consent_granted: { label: 'Granted access', tone: 'success' },
  consent_updated: { label: 'Changed what a worker can see', tone: 'success' },
  consent_revoked: { label: 'Removed access', tone: 'revoked' },
  privacy_preference_changed: { label: 'Changed a sharing preference', tone: 'success' },
  snapshot_exported: { label: 'Exported a snapshot', tone: 'completed' },
  account_created: { label: 'Account created', tone: 'completed' },
};

export const PRIVACY_AUDIT_ACTION_KEYS = Object.keys(PRIVACY_AUDIT_ACTIONS);
