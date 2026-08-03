/**
 * Registry-banned vocabulary. The authoritative list lives in
 * `tmg_banned_terms`; this mirror exists so violations can be caught in a
 * lint/test pass without a DB round-trip. Keep the two in sync — the DB wins.
 *
 * `participantFacingOnly` terms are legitimate in internal/admin contexts
 * (e.g. the intake record is `FCA_BASELINE` in the schema) but must never
 * surface in participant-facing UI.
 */
export const BANNED_TERMS = [
  { term: 'match', participantFacingOnly: false },
  { term: 'matching', participantFacingOnly: false },
  { term: 'tasks', participantFacingOnly: false },
  { term: 'assigned caseload', participantFacingOnly: false },
  { term: 'productivity', participantFacingOnly: false },
  { term: 'programs', participantFacingOnly: false },
  { term: 'clinical notes', participantFacingOnly: false },
  { term: 'ACTION REQUIRED', participantFacingOnly: false },
  { term: 'non-compliant', participantFacingOnly: false },
  { term: 'Care Management', participantFacingOnly: false },
  { term: 'Governance Admin', participantFacingOnly: false },
  { term: 'FCA', participantFacingOnly: true },
  { term: 'Baseline', participantFacingOnly: true },
  { term: 'Assessment', participantFacingOnly: true },
];

/**
 * @param {string} text
 * @param {{ participantFacing?: boolean }} [opts]
 * @returns {string[]} the banned terms found, empty if clean
 */
export function findBannedTerms(text, opts = {}) {
  if (!text) return [];
  const participantFacing = opts.participantFacing ?? true;

  return BANNED_TERMS.filter((entry) => {
    if (entry.participantFacingOnly && !participantFacing) return false;
    return new RegExp(`\\b${escapeRegExp(entry.term)}\\b`, 'i').test(text);
  }).map((entry) => entry.term);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
