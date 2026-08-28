/**
 * Time-limited share links to an approved Monthly Snapshot — the external
 * access layer for Template C9, "Export and Sharing" (Longitudinal Evidence
 * Templates v2.0):
 *
 *   "Once approved, this snapshot can be exported as a PDF and shared with:
 *    NDIS planner or LAC · Support coordinator · Allied health professional ·
 *    Tribunal or review process · Kept private. Sharing requires explicit
 *    participant consent. The participant controls who receives this
 *    document. TMG180 cannot share this document without participant approval."
 *
 * Rules that shape it:
 *   - Only a *locked* snapshot can be shared. A draft is the participant's
 *     review, not evidence, and it does not exist outside the portal.
 *   - The participant's `allow_share_links` preference must be on. The
 *     preferences "say what a grant is allowed to include" (privacy.js), and a
 *     share link is a grant to someone without an account.
 *   - A link expires on a date the participant chose at creation and can be
 *     revoked at any time; both are final. A new link is a new row.
 *   - Every open is recorded — who it was for, when — and shown back to the
 *     participant as their access log. That log is the difference between
 *     sharing a document and losing track of one.
 *
 * Wire shape (camelCase):
 *   { id, snapshotId, audience, allowDownload, status, expiresAt, createdAt,
 *     revokedAt, lastOpenedAt, openCount, url? }
 *   `url` (and the token inside it) is present on the create response only.
 */

import { SNAPSHOT_SHARE_AUDIENCE_KEYS } from './snapshot.js';

export const SHARE_LINK_STATUS = {
  ACTIVE: 'active',
  REVOKED: 'revoked',
  /** Derived, never stored: an active row whose date has passed. */
  EXPIRED: 'expired',
};

export const SHARE_LINK_STATUS_LABELS = {
  [SHARE_LINK_STATUS.ACTIVE]: 'Link active',
  [SHARE_LINK_STATUS.REVOKED]: 'Revoked',
  [SHARE_LINK_STATUS.EXPIRED]: 'Expired',
};

/**
 * The frame's three choices (Snapshot Exports, "Link Expiry"). The default is
 * the shortest: the privacy preference that switches links on describes them
 * as "links that automatically expire after 7 days".
 */
export const SHARE_LINK_EXPIRY_OPTIONS = [
  { days: 7, label: '7 Days' },
  { days: 30, label: '30 Days' },
  { days: 90, label: '90 Days' },
];

export const SHARE_LINK_EXPIRY_DAYS = SHARE_LINK_EXPIRY_OPTIONS.map((option) => option.days);

export const SHARE_LINK_DEFAULT_EXPIRY_DAYS = 7;

/** The audit actions a share link writes, and how each is said to the participant. */
export const SHARE_LINK_AUDIT_ACTIONS = {
  snapshot_link_created: { label: 'Created a share link', tone: 'success' },
  snapshot_link_opened: { label: 'Opened via a share link', tone: 'completed' },
  snapshot_link_revoked: { label: 'Revoked a share link', tone: 'revoked' },
};

export const SHARE_LINK_AUDIT_ACTION_KEYS = Object.keys(SHARE_LINK_AUDIT_ACTIONS);

/** The actual state of a link right now — what the row says, unless its date has passed. */
export function shareLinkStatus(link, now = new Date()) {
  if (!link) return null;
  if (link.status === SHARE_LINK_STATUS.REVOKED) return SHARE_LINK_STATUS.REVOKED;
  if (link.expiresAt && new Date(link.expiresAt) <= now) return SHARE_LINK_STATUS.EXPIRED;
  return SHARE_LINK_STATUS.ACTIVE;
}

export const isShareLinkOpen = (link, now) => shareLinkStatus(link, now) === SHARE_LINK_STATUS.ACTIVE;

export const shareLinkStatusLabel = (status) => SHARE_LINK_STATUS_LABELS[status] ?? status;

const isBlank = (value) =>
  value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

/**
 * Creating a link asks three things: how long, for whom, and whether the
 * reader may save a copy. "For whom" is the C9 list; "Kept private" is on it
 * and is not a link, so it is refused here rather than issuing a link to
 * nobody.
 *
 * @returns map of field -> message; empty object when valid.
 */
export function validateShareLinkFields(fields = {}) {
  const errors = {};

  if (!SHARE_LINK_EXPIRY_DAYS.includes(Number(fields.expiresInDays))) {
    errors.expiresInDays = 'Choose how long the link should last.';
  }
  if (isBlank(fields.audience)) {
    errors.audience = 'Choose who this link is for.';
  } else if (!SNAPSHOT_SHARE_AUDIENCE_KEYS.includes(fields.audience)) {
    errors.audience = 'Not one of the allowed options.';
  } else if (fields.audience === 'private') {
    errors.audience = 'A private snapshot has no link — keep it here and export it yourself.';
  }
  if (fields.allowDownload !== undefined && typeof fields.allowDownload !== 'boolean') {
    errors.allowDownload = 'Must be true or false.';
  }

  return errors;
}
