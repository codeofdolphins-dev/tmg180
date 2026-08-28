/**
 * Raise a concern — the participant side of Mandatory Policy 2, "Complaints,
 * Concerns and Feedback" (TMG180 Mandatory Policies Governance Controlled
 * Manual v1.0, 21 June 2026), with Policy 3's incident vocabulary and
 * Policy 10's report pathway folded in.
 *
 * What is built here is the platform-level ticket the policy's own evidence
 * column names — "Complaint ticket; response record; referral/escalation
 * record" — and nothing the policy rules out: the platform "does not act as a
 * mediator for service delivery disputes", "does not adjudicate clinical
 * matters" and "does not replace formal regulatory processes". So a concern
 * about support delivery is still received (the boundary check happens after,
 * by governance, not by a form refusing it), and the external bodies are on
 * the screen at every step, never behind the platform.
 *
 * Every string a participant reads is the policy's wording. Where the policy
 * gives a list, the list is verbatim and in its order.
 *
 * Wire shape (camelCase):
 *   { id, kind, category, relatesTo, about, description, whatWouldHelp,
 *     status, acknowledgedAt, referredTo, referredAt, closedAt, createdAt,
 *     responses: [{ id, authorRole, text, createdAt }] }
 */

/** Policy 2's definitions, verbatim. */
export const CONCERN_KINDS = [
  {
    key: 'concern',
    label: 'A concern',
    description: 'Something you want understood or looked at early, before it becomes a complaint.',
  },
  {
    key: 'complaint',
    label: 'A complaint',
    description:
      'An expression of dissatisfaction, concern, or discomfort about conduct, safety, communication, or platform use.',
  },
  {
    key: 'feedback',
    label: 'Feedback',
    description:
      'Information provided with the intention of improving understanding, relationships, or systems.',
  },
];

export const CONCERN_KIND_KEYS = CONCERN_KINDS.map((kind) => kind.key);

/**
 * "Participants and workers are expected to raise:" (Policy 2), plus the two
 * pathways other policies open — bias or discriminatory conduct (Policy 10)
 * and consent or information handling (Policy 4).
 */
export const CONCERN_CATEGORIES = [
  { key: 'safety', label: 'Concerns about safety' },
  { key: 'boundaries', label: 'Boundary issues' },
  { key: 'communication', label: 'Communication difficulties' },
  { key: 'platform_processes', label: 'Platform processes' },
  { key: 'policy_clarity', label: 'Policy clarity' },
  { key: 'conduct', label: 'Conduct that feels inappropriate or uncomfortable' },
  { key: 'discrimination', label: 'Discriminatory behaviour, bias, or harm' },
  { key: 'information_handling', label: 'Consent or information handling' },
  { key: 'other', label: 'Something else' },
];

export const CONCERN_CATEGORY_KEYS = CONCERN_CATEGORIES.map((category) => category.key);

/**
 * Policy 2's two kinds of complaint, as the raiser sees it. Governance makes
 * the boundary check afterwards; a form must not refuse a service-related
 * concern, because "the platform does not manage day-to-day service delivery
 * complaints *unless there is a risk to safety or serious misconduct*" — and
 * whether there is, is not for the form to decide.
 */
export const CONCERN_RELATES_TO = [
  {
    key: 'platform',
    label: 'The platform',
    description:
      'The operation of TMG180 — platform conduct, policies, verification processes, or safety mechanisms.',
  },
  {
    key: 'service',
    label: 'Support delivery',
    description: 'Something about support delivery, between you and an independent worker.',
  },
  { key: 'unsure', label: "I'm not sure", description: 'That is fine — governance will work it out.' },
];

export const CONCERN_RELATES_TO_KEYS = CONCERN_RELATES_TO.map((option) => option.key);

/**
 * The ticket's life, in the order "How Complaints Are Handled" gives it:
 * acknowledge receipt → seek clarification → assess → respond → refer where
 * required. `closed` is the record being put away, not a verdict.
 */
export const CONCERN_STATUS = {
  RECEIVED: 'received',
  ACKNOWLEDGED: 'acknowledged',
  IN_REVIEW: 'in_review',
  RESPONDED: 'responded',
  REFERRED: 'referred',
  CLOSED: 'closed',
};

export const CONCERN_STATUS_LABELS = {
  [CONCERN_STATUS.RECEIVED]: 'Received',
  [CONCERN_STATUS.ACKNOWLEDGED]: 'Acknowledged',
  [CONCERN_STATUS.IN_REVIEW]: 'Being looked at',
  [CONCERN_STATUS.RESPONDED]: 'Responded',
  [CONCERN_STATUS.REFERRED]: 'Referred on',
  [CONCERN_STATUS.CLOSED]: 'Closed',
};

export const CONCERN_STATUS_KEYS = Object.values(CONCERN_STATUS);

/** A closed ticket takes no more responses; everything before that does. */
export const CONCERN_OPEN_STATUSES = CONCERN_STATUS_KEYS.filter(
  (status) => status !== CONCERN_STATUS.CLOSED
);

/** "Participants and workers are always free to escalate concerns directly to:" — verbatim. */
export const CONCERN_EXTERNAL_BODIES = [
  'the NDIS Quality and Safeguards Commission',
  'police or emergency services',
  'consumer or human rights bodies',
];

/** "When a complaint is received, TMG180 Governance Administration will:" — verbatim. */
export const CONCERN_HANDLING_STEPS = [
  'acknowledge receipt of the concern',
  'seek clarification where needed',
  'assess whether the issue is platform related or service related',
  'respond proportionately',
  'provide guidance or clarification',
  'take steps to protect safety',
  'refer matters to external bodies where required',
];

/** "Principles Guiding Complaints and Feedback" — verbatim. */
export const CONCERN_PRINCIPLES = [
  'raising concerns is not a sign of failure',
  'people are more likely to act ethically when they feel safe to speak',
  'complaints should be handled calmly and proportionately',
  'not all concerns require punitive action',
  'serious matters require clear escalation',
  'human context matters',
];

/** "Protection From Retaliation" — verbatim, both sentences. */
export const CONCERN_NO_RETALIATION = [
  'TMG180 Governance Administration does not tolerate retaliation against anyone who raises concerns in good faith.',
  'Raising a complaint or providing feedback will not, on its own, result in negative consequences.',
];

/** "Platform Limits" — verbatim. What the ticket cannot become. */
export const CONCERN_PLATFORM_LIMITS = [
  'does not act as a mediator for service delivery disputes',
  'does not adjudicate clinical matters',
  'does not replace formal regulatory processes',
  'does not supervise workers',
];

export const CONCERN_LIMITS = {
  maxAbout: 255,
  maxText: 5000,
};

const isBlank = (value) =>
  value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

const isTextWithin = (value, max) => typeof value === 'string' && value.length <= max;

/**
 * Shape validation only.
 *
 * @returns map of field -> message; empty object when valid.
 */
export function validateConcernFields(fields = {}) {
  const errors = {};

  if (!isBlank(fields.kind) && !CONCERN_KIND_KEYS.includes(fields.kind)) {
    errors.kind = 'Not one of the allowed options.';
  }
  if (!isBlank(fields.category) && !CONCERN_CATEGORY_KEYS.includes(fields.category)) {
    errors.category = 'Not one of the allowed options.';
  }
  if (!isBlank(fields.relatesTo) && !CONCERN_RELATES_TO_KEYS.includes(fields.relatesTo)) {
    errors.relatesTo = 'Not one of the allowed options.';
  }
  if (!isBlank(fields.about) && !isTextWithin(fields.about, CONCERN_LIMITS.maxAbout)) {
    errors.about = `Keep this under ${CONCERN_LIMITS.maxAbout} characters.`;
  }
  for (const key of ['description', 'whatWouldHelp']) {
    if (!isBlank(fields[key]) && !isTextWithin(fields[key], CONCERN_LIMITS.maxText)) {
      errors[key] = `Must be text up to ${CONCERN_LIMITS.maxText} characters.`;
    }
  }

  return errors;
}

/**
 * What a ticket cannot be received without: what kind of thing it is, what it
 * is about, and the words. "No one is required to use legal language or
 * formal wording" — so the words are checked for presence, never for form.
 *
 * @returns {{ ok: boolean, errors: Record<string, string> }}
 */
export function canSubmitConcern(concern = {}) {
  const errors = validateConcernFields(concern);

  if (isBlank(concern.kind)) errors.kind = 'Choose what this is.';
  if (isBlank(concern.category)) errors.category = 'Choose what it is about.';
  if (isBlank(concern.relatesTo)) errors.relatesTo = 'Choose who or what it relates to.';
  if (isBlank(concern.description)) {
    errors.description = 'Tell us what happened, in your own words.';
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

/** A follow-up needs words; a closed ticket takes none. */
export function validateConcernResponse({ text } = {}, concern = {}) {
  const errors = {};
  if (concern.status === CONCERN_STATUS.CLOSED) {
    errors.text = 'This one is closed. If something new has happened, raise it as a new concern.';
  } else if (isBlank(text)) {
    errors.text = 'Write the note you want to add.';
  } else if (!isTextWithin(text, CONCERN_LIMITS.maxText)) {
    errors.text = `Must be text up to ${CONCERN_LIMITS.maxText} characters.`;
  }
  return errors;
}

export const isConcernOpen = (concern) => CONCERN_OPEN_STATUSES.includes(concern?.status);

const labelOf = (options, key) => options.find((option) => option.key === key)?.label ?? key;

export const concernKindLabel = (key) => labelOf(CONCERN_KINDS, key);
export const concernCategoryLabel = (key) => labelOf(CONCERN_CATEGORIES, key);
export const concernRelatesToLabel = (key) => labelOf(CONCERN_RELATES_TO, key);
export const concernStatusLabel = (key) => CONCERN_STATUS_LABELS[key] ?? key;
