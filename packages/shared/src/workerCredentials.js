/**
 * Worker credentials — the "Governance Summary" on the worker dashboard and the
 * "Upcoming Renewals" on Governance Standing (frames 1169:2660 / 1169:3916).
 *
 * Canon says TMG180 "verifies worker eligibility documents and access
 * conditions" (Technical Brief §4) and the notification types in the DB pack
 * anticipate `compliance_expiry_30 / _7 / expired`, but no document enumerates
 * which credentials a worker holds. This list is the union of what the worker
 * frames show (dashboard + Governance Standing + the v2 profile read view) and,
 * like FUNCTIONAL_DOMAINS, needs a ruling before launch — a different set is a
 * change to this array and nothing else. Acknowledgements (code of conduct,
 * incident process) are a separate concept and are not credentials.
 *
 * Status is *derived* from the expiry date at read time, never stored, so a
 * credential can never show "Up to date" after its date has passed.
 */

export const WORKER_CREDENTIAL_TYPES = [
  { key: 'public_liability_insurance', label: 'Public Liability Insurance' },
  { key: 'first_aid', label: 'First Aid Certification' },
  { key: 'ndis_worker_screening', label: 'NDIS Worker Screening' },
  { key: 'wwcc', label: 'Working with Children Check' },
];

export const WORKER_CREDENTIAL_KEYS = WORKER_CREDENTIAL_TYPES.map((type) => type.key);

export const CREDENTIAL_STATUS = {
  /** Has an expiry date comfortably in the future. */
  UP_TO_DATE: 'up_to_date',
  /** Expires within CREDENTIAL_DUE_SOON_DAYS. */
  DUE_SOON: 'due_soon',
  /** Expiry date has passed. */
  EXPIRED: 'expired',
  /** Nothing recorded yet — the worker has not told us about it. */
  NEEDS_REVIEW: 'needs_review',
};

/** The DB pack's first expiry warning is at 30 days; "Due soon" means the same thing. */
export const CREDENTIAL_DUE_SOON_DAYS = 30;

const STATUS_LABELS = {
  [CREDENTIAL_STATUS.UP_TO_DATE]: 'Up to date',
  [CREDENTIAL_STATUS.DUE_SOON]: 'Due soon',
  [CREDENTIAL_STATUS.EXPIRED]: 'Expired',
  [CREDENTIAL_STATUS.NEEDS_REVIEW]: 'Needs review',
};

export function credentialTypeLabel(key) {
  return WORKER_CREDENTIAL_TYPES.find((type) => type.key === key)?.label ?? key;
}

export function credentialStatusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days from `today` to `expiresAt` (both YYYY-MM-DD); negative once past. */
export function daysUntil(expiresAt, today) {
  if (!expiresAt || !today) return null;
  const to = Date.UTC(...expiresAt.split('-').map(Number).map((n, i) => (i === 1 ? n - 1 : n)));
  const from = Date.UTC(...today.split('-').map(Number).map((n, i) => (i === 1 ? n - 1 : n)));
  if (!Number.isFinite(to) || !Number.isFinite(from)) return null;
  return Math.round((to - from) / DAY_MS);
}

/**
 * Derive a credential's standing from its dates. `today` is the caller's
 * calendar day so the server and the browser can agree on it.
 */
export function credentialStatus({ expiresAt }, today) {
  const daysLeft = daysUntil(expiresAt, today);
  if (daysLeft === null) return { status: CREDENTIAL_STATUS.NEEDS_REVIEW, daysLeft: null };
  if (daysLeft < 0) return { status: CREDENTIAL_STATUS.EXPIRED, daysLeft };
  if (daysLeft <= CREDENTIAL_DUE_SOON_DAYS) return { status: CREDENTIAL_STATUS.DUE_SOON, daysLeft };
  return { status: CREDENTIAL_STATUS.UP_TO_DATE, daysLeft };
}

/**
 * The numbers the dashboard and Governance Standing summary cards show, from
 * a list of credentials that already carry `status` / `daysLeft`.
 */
export function credentialSummary(credentials = []) {
  const counts = {
    total: credentials.length,
    upToDate: 0,
    dueSoon: 0,
    expired: 0,
    needsReview: 0,
  };
  let next = null;
  for (const credential of credentials) {
    if (credential.status === CREDENTIAL_STATUS.UP_TO_DATE) counts.upToDate += 1;
    else if (credential.status === CREDENTIAL_STATUS.DUE_SOON) counts.dueSoon += 1;
    else if (credential.status === CREDENTIAL_STATUS.EXPIRED) counts.expired += 1;
    else counts.needsReview += 1;

    // The next renewal milestone: the soonest future (or today's) expiry.
    if (credential.expiresAt && credential.daysLeft !== null && credential.daysLeft >= 0) {
      if (!next || credential.daysLeft < next.daysLeft) {
        next = { type: credential.type, expiresAt: credential.expiresAt, daysLeft: credential.daysLeft };
      }
    }
  }
  // "All in order" only when every credential is recorded and none is expired
  // or due; "Needs attention" otherwise. Never a score — this is standing, not
  // a rating.
  const allInOrder = counts.total > 0 && counts.upToDate === counts.total;
  return { ...counts, next, allInOrder };
}

/** A date is only accepted as a calendar day string. */
export function validateCredentialFields(fields = {}) {
  const errors = {};
  for (const key of ['issuedAt', 'expiresAt']) {
    const value = fields[key];
    if (value == null || value === '') continue;
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) {
      errors[key] = 'Enter a date as YYYY-MM-DD.';
    }
  }
  if (fields.reference != null && typeof fields.reference !== 'string') {
    errors.reference = 'Reference must be text.';
  } else if (typeof fields.reference === 'string' && fields.reference.length > 255) {
    errors.reference = 'Keep the reference under 255 characters.';
  }
  if (
    !errors.issuedAt &&
    !errors.expiresAt &&
    fields.issuedAt &&
    fields.expiresAt &&
    fields.expiresAt < fields.issuedAt
  ) {
    errors.expiresAt = 'Expiry cannot be before the issue date.';
  }
  return errors;
}
