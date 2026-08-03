/**
 * Evidence-chain rules that must hold identically on web, mobile and API.
 * Keep the enforcement here so no client can finalise a record the server
 * would reject (and so the server never has to trust a client's word).
 */

export const DAILY_LOG_STATUS = {
  DRAFT: 'draft',
  FINALISED: 'finalised',
};

export const SNAPSHOT_STATUS = {
  GENERATING: 'generating',
  AWAITING_APPROVAL: 'awaiting_approval',
  LOCKED: 'locked',
};

/**
 * NDIS functional domain codes are NOT enumerated in the Final Override bundle
 * or the DB pack (`domain_tags VARCHAR(50)[]` is untyped). Load the allowed set
 * from the API rather than hardcoding a guess here — see the build register.
 * @type {string[] | null}
 */
export const FUNCTIONAL_DOMAINS = null;

/**
 * A daily support evidence log cannot be finalised without 1-3 linked goals
 * and at least one functional domain tag. Non-negotiable, enforced both sides.
 *
 * @param {{ goalIds?: string[], domainTags?: string[] }} log
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function canFinaliseDailyLog(log) {
  const errors = [];
  const goals = log?.goalIds ?? [];
  const domains = log?.domainTags ?? [];

  if (goals.length < 1 || goals.length > 3) {
    errors.push('A daily log must link between 1 and 3 participant goals.');
  }
  if (domains.length < 1) {
    errors.push('A daily log must carry at least one functional domain tag.');
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Locked records are addendum-only, never edited.
 * @param {{ status?: string }} record
 */
export function isAddendumOnly(record) {
  return record?.status === SNAPSHOT_STATUS.LOCKED;
}
