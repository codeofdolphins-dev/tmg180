/**
 * The Daily Support Evidence Log contract (R-09, participant layer).
 *
 * This file is to the daily log what profile.js is to the Personal Profile:
 * the single definition both the web forms and the API validate against, so a
 * client can never submit a log the server would reject — and the server never
 * has to trust the client's word on the evidence rules.
 *
 * Two layers exist (Build Guide §5) and both are built on this contract. The
 * structured fields are shared; a worker-authored log adds the participant
 * voice, a public safety note, where/how the support happened, and the private
 * WCPS narrative (`privateNarrative`) — which the API returns only to the
 * worker who wrote it and never to anyone else. Pass `{ layer }` to the
 * validators to get the right comparison vocabulary and field set.
 *
 * Wire shape (camelCase; the API maps to/from the snake_case columns):
 *   { id, status, sessionDate, startTime, endTime, goalIds, domainTags,
 *     impactText, supportText, outcomeText, comparison, additionalNotes,
 *     authorRole, submittedAt, createdAt, updatedAt, addenda: [...] }
 *   worker layer adds: { participant: { id, name }, consentActive, serviceType,
 *     location, participantVoice, safetyNote, privateNarrative }
 */

import { GOAL_LINK_HELPER_CODES, NDIS_BUCKET_KEYS, RN_RATIONALE_TAG_KEYS } from './goalLinkHelper.js';

export const DAILY_LOG_STATUS = {
  DRAFT: 'draft',
  /** Submitted is final: the record is locked and addendum-only from here. */
  SUBMITTED: 'submitted',
};

export const DAILY_LOG_AUTHOR_ROLE = {
  PARTICIPANT: 'participant',
  WORKER: 'worker',
};

/**
 * Functional domain tags.
 *
 * Canon does not enumerate the NDIS domain codes — `domain_tags` is an untyped
 * VARCHAR(50)[] in the DB pack — so this list is taken from the built screens
 * (worker log frame `1169:3172`, which carries the full set; the participant
 * frame `1169:825` shows four of them) and deliberately mirrors the profile
 * sections. It needs a ruling before launch: if the real code list differs,
 * this array and a data migration of `domain_tags` are the only changes.
 */
// The six NDIS functional capacity domains, verbatim from "goal mapping
// examples" §2 (client document set, 27 Aug 2026); Learning Hub module 4 asks
// "which NDIS functional areas were involved? (1-3, mandatory)". This replaces
// the nine-item list that had been lifted from a Figma frame.
export const FUNCTIONAL_DOMAINS = [
  { key: 'mobility', label: 'Mobility' },
  { key: 'communication', label: 'Communication' },
  { key: 'social_interaction', label: 'Social interaction' },
  { key: 'learning', label: 'Learning' },
  { key: 'self_care', label: 'Self-care' },
  { key: 'self_management', label: 'Self-management' },
];

export const FUNCTIONAL_DOMAIN_KEYS = FUNCTIONAL_DOMAINS.map((domain) => domain.key);

/**
 * "Compared to your usual pattern, how did things go during this period?"
 *
 * Stored in `baseline_comparison` — an internal column name kept for schema
 * continuity. "Baseline" is banned in participant-facing text, so the labels
 * here say "usual", and nothing renders the column name.
 */
export const USUAL_PATTERN_COMPARISONS = [
  { key: 'better_than_usual', label: 'Better than usual' },
  { key: 'same_as_usual', label: 'Same as usual' },
  { key: 'variable', label: 'Variable' },
  { key: 'below_usual', label: 'Below usual' },
];

export const COMPARISON_KEYS = USUAL_PATTERN_COMPARISONS.map((option) => option.key);

/**
 * The worker's version of the same question — "compared with this person's
 * usual pattern, what did today's support look like?" — as the worker log
 * frame (1169:3172) phrases it and the DB pack's comment on the column lists
 * it (typical, more_support, less_support, different_support). Same column,
 * different vocabulary: a worker describes the support level, a participant
 * describes their own day. Neither label says "baseline".
 */
export const SUPPORT_LEVEL_COMPARISONS = [
  { key: 'typical', label: 'Typical' },
  { key: 'more_support', label: 'More support needed' },
  { key: 'less_support', label: 'Less support needed' },
  { key: 'different_support', label: 'Different support needed' },
];

export const SUPPORT_LEVEL_COMPARISON_KEYS = SUPPORT_LEVEL_COMPARISONS.map((option) => option.key);

/** Which comparison vocabulary a layer writes. */
export const comparisonKeysFor = (layer) =>
  layer === DAILY_LOG_AUTHOR_ROLE.WORKER ? SUPPORT_LEVEL_COMPARISON_KEYS : COMPARISON_KEYS;

/** Free-text fields by layer — the worker layer writes more of them. */
const PARTICIPANT_TEXT_FIELDS = ['impactText', 'supportText', 'outcomeText', 'additionalNotes'];
const WORKER_TEXT_FIELDS = [
  ...PARTICIPANT_TEXT_FIELDS,
  'participantVoice',
  'safetyNote',
  'privateNarrative',
];

export const DAILY_LOG_LIMITS = {
  minGoals: 1,
  maxGoals: 3,
  maxDomains: FUNCTIONAL_DOMAIN_KEYS.length,
  maxText: 5000,
  maxReason: 255,
  maxServiceType: 100,
  maxLocation: 255,
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

const isBlank = (value) =>
  value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

const isTextWithin = (value, max) => typeof value === 'string' && value.length <= max;

const isKeyList = (value, allowed) =>
  Array.isArray(value) && value.every((item) => allowed.includes(item));

/**
 * Shape validation only — a draft is never blocked. Saving what someone has
 * typed so far must always work, so this rejects malformed values (a date that
 * is not a date, a tag that is not a tag) and nothing else. Completeness is
 * `canSubmitDailyLog`'s job.
 *
 * @returns map of field -> message; empty object when valid.
 */
export function validateDailyLogFields(fields = {}, { layer = DAILY_LOG_AUTHOR_ROLE.PARTICIPANT } = {}) {
  const errors = {};
  const isWorker = layer === DAILY_LOG_AUTHOR_ROLE.WORKER;

  if (!isBlank(fields.sessionDate) && !DATE_PATTERN.test(fields.sessionDate)) {
    errors.sessionDate = 'Needs to be a date.';
  }
  for (const key of ['startTime', 'endTime']) {
    if (!isBlank(fields[key]) && !TIME_PATTERN.test(fields[key])) {
      errors[key] = 'Needs to be a time like 09:00.';
    }
  }

  if (fields.goalIds !== undefined) {
    const goalIds = fields.goalIds;
    const valid =
      Array.isArray(goalIds) &&
      goalIds.every((id) => Number.isInteger(id)) &&
      goalIds.length <= DAILY_LOG_LIMITS.maxGoals;
    if (!valid) {
      errors.goalIds = `Choose up to ${DAILY_LOG_LIMITS.maxGoals} goals from your plan.`;
    } else if (new Set(goalIds).size !== goalIds.length) {
      errors.goalIds = 'The same goal is listed twice.';
    }
  }

  if (fields.domainTags !== undefined && !isKeyList(fields.domainTags, FUNCTIONAL_DOMAIN_KEYS)) {
    errors.domainTags = 'Contains a domain tag that is not allowed.';
  }

  // Goal Link Helper pack (v1.1): bucket, optional grouping, optional rationale tags.
  if (!isBlank(fields.ndisBucket) && !NDIS_BUCKET_KEYS.includes(fields.ndisBucket)) {
    errors.ndisBucket = 'Not one of the NDIS budget buckets.';
  }
  if (!isBlank(fields.functionalGrouping) && !GOAL_LINK_HELPER_CODES.includes(fields.functionalGrouping)) {
    errors.functionalGrouping = 'Not one of the functional groupings.';
  }
  if (fields.rnRationaleTags !== undefined && !isKeyList(fields.rnRationaleTags, RN_RATIONALE_TAG_KEYS)) {
    errors.rnRationaleTags = 'Contains a rationale tag that is not allowed.';
  }

  if (!isBlank(fields.comparison) && !comparisonKeysFor(layer).includes(fields.comparison)) {
    errors.comparison = 'Not one of the allowed options.';
  }

  for (const key of isWorker ? WORKER_TEXT_FIELDS : PARTICIPANT_TEXT_FIELDS) {
    if (!isBlank(fields[key]) && !isTextWithin(fields[key], DAILY_LOG_LIMITS.maxText)) {
      errors[key] = `Must be text up to ${DAILY_LOG_LIMITS.maxText} characters.`;
    }
  }

  if (isWorker) {
    if (!isBlank(fields.serviceType) && !isTextWithin(fields.serviceType, DAILY_LOG_LIMITS.maxServiceType)) {
      errors.serviceType = `Keep this under ${DAILY_LOG_LIMITS.maxServiceType} characters.`;
    }
    if (!isBlank(fields.location) && !isTextWithin(fields.location, DAILY_LOG_LIMITS.maxLocation)) {
      errors.location = `Keep this under ${DAILY_LOG_LIMITS.maxLocation} characters.`;
    }
  }

  return errors;
}

/**
 * The evidence rule, non-negotiable and enforced on both sides: a log cannot be
 * finalised without 1-3 linked goals, at least one functional domain tag and
 * (Goal Link Helper pack) an NDIS budget bucket.
 * A session date is added because a log with no date is not evidence of a day.
 *
 * @returns {{ ok: boolean, errors: Record<string, string> }}
 */
export function canSubmitDailyLog(log = {}, options = {}) {
  const errors = validateDailyLogFields(log, options);
  const isWorker = options.layer === DAILY_LOG_AUTHOR_ROLE.WORKER;
  const goalIds = log.goalIds ?? [];
  const domainTags = log.domainTags ?? [];

  if (isBlank(log.sessionDate)) {
    errors.sessionDate = 'Add the date this support happened.';
  }
  if (!errors.goalIds && (goalIds.length < DAILY_LOG_LIMITS.minGoals || goalIds.length > DAILY_LOG_LIMITS.maxGoals)) {
    errors.goalIds = isWorker
      ? `Link between ${DAILY_LOG_LIMITS.minGoals} and ${DAILY_LOG_LIMITS.maxGoals} of the participant's goals before you submit.`
      : `Link between ${DAILY_LOG_LIMITS.minGoals} and ${DAILY_LOG_LIMITS.maxGoals} of your goals before you submit.`;
  }
  if (!errors.domainTags && domainTags.length < 1) {
    errors.domainTags = 'Choose at least one area of daily life this support touched.';
  }
  // Goal Link Helper spec: "Every Support Evidence Log must link to … (2) a budget bucket".
  if (!errors.ndisBucket && isBlank(log.ndisBucket)) {
    errors.ndisBucket = 'Choose the NDIS budget bucket this support sits in — Core, Capacity Building or Capital.';
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

/** Submitted logs are locked: addendum-only, never edited. */
export function isDailyLogLocked(log) {
  return log?.status === DAILY_LOG_STATUS.SUBMITTED;
}

/** An addendum needs words; the reason is offered but never demanded. */
export function validateAddendum({ text, reason } = {}) {
  const errors = {};
  if (isBlank(text)) errors.text = 'Write the note you want to add.';
  else if (!isTextWithin(text, DAILY_LOG_LIMITS.maxText)) {
    errors.text = `Must be text up to ${DAILY_LOG_LIMITS.maxText} characters.`;
  }
  if (!isBlank(reason) && !isTextWithin(reason, DAILY_LOG_LIMITS.maxReason)) {
    errors.reason = `Must be text up to ${DAILY_LOG_LIMITS.maxReason} characters.`;
  }
  return errors;
}

export const domainLabel = (key) =>
  FUNCTIONAL_DOMAINS.find((domain) => domain.key === key)?.label ?? key;

export const comparisonLabel = (key) =>
  [...USUAL_PATTERN_COMPARISONS, ...SUPPORT_LEVEL_COMPARISONS].find((option) => option.key === key)
    ?.label ?? null;
