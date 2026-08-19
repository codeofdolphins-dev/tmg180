/**
 * The Monthly Snapshot contract (the third link in the evidence chain).
 *
 * Personal Profile → Daily Support Evidence Logs → Monthly Snapshot. A snapshot
 * gathers a month of submitted logs, the participant reviews and approves it,
 * and approval locks it: from then on it is addendum-only, never edited. That
 * rule, and the mandatory non-linear functioning statement, are the two things
 * canon is least negotiable about, so both live here where the web app and the
 * API read the same definition.
 *
 * Canon has the snapshot AI-generated from logs and check-ins. That endpoint is
 * unspecced and AI is off, so generation is deterministic: the server counts
 * what the month's logs actually say (days, goals, domains, how the month
 * compared to usual) and the participant writes the words. The three layers
 * below are the Figma "language perspective" toggle and the three groups of
 * columns in tmg_monthly_snapshot — one shape, not two.
 */

export const SNAPSHOT_STATUS = {
  /** Being compiled. Our generation is synchronous, so this is rarely seen. */
  GENERATING: 'generating',
  /** Participant review: editable, not yet part of the record. */
  DRAFT: 'draft',
  /** Approved by the participant. Final, addendum-only. */
  LOCKED: 'locked',
};

/**
 * Mandatory in every snapshot (DB pack, §2). Kept identical to the column
 * default in tmg_monthly_snapshot — a snapshot that lost this sentence would
 * misrepresent fluctuation as regression, which is the whole point of it.
 */
export const NONLINEAR_STATEMENT =
  'Capacity varied across the month, consistent with non-linear functioning. Participation improved with support scaffolding. This reflects supports working, not removal of impairment.';

/**
 * The three layers, in the order the frames show them. `key` is the wire field
 * (the API maps each to its snake_case column); every field is free text the
 * participant owns and can leave empty.
 */
export const SNAPSHOT_LAYERS = [
  {
    key: 'plain_language',
    label: 'Plain language',
    description: 'Your month, in your own words.',
    fields: [
      {
        key: 'participantStory',
        label: 'How the month went',
        prompt: 'What stands out when you look back over the month?',
      },
      {
        key: 'whatMattered',
        label: 'What mattered most',
        prompt: 'What was important to you this month?',
      },
      {
        key: 'whatGotInWay',
        label: 'What got in the way',
        prompt: 'What made things harder than usual?',
      },
      { key: 'whatHelped', label: 'What helped', prompt: 'What made a difference?' },
      {
        key: 'recoveryCost',
        label: 'What it cost you',
        prompt: 'What did you need afterwards to recover?',
      },
      {
        key: 'nextMonthIntentions',
        label: 'Next month',
        prompt: 'What would you like the next month to look like?',
      },
    ],
  },
  {
    key: 'functional_meaning',
    label: 'Functional meaning',
    description: 'What the month meant for everyday functioning.',
    fields: [
      {
        key: 'mainFunctionalImpacts',
        label: 'Main functional impacts',
        prompt: 'Which parts of daily life were most affected?',
      },
      {
        key: 'frequencyPattern',
        label: 'Pattern across the month',
        prompt: 'How often did support make the difference, and when?',
      },
      {
        key: 'recoveryCostTrend',
        label: 'Recovery cost over time',
        prompt: 'Did recovery take more or less out of you as the month went on?',
      },
      {
        key: 'supportsThatHelped',
        label: 'Supports that helped',
        prompt: 'Which supports worked, and in what way?',
      },
      {
        key: 'whenSupportUnavailable',
        label: 'When support was not there',
        prompt: 'What happened on days without support?',
      },
    ],
  },
  {
    key: 'ndis_evidence',
    label: 'NDIS evidence language',
    description: 'How this month reads for a plan review.',
    fields: [
      {
        key: 'impairmentLinkage',
        label: 'Link to impairment',
        prompt: 'How do these supports relate to your impairment?',
      },
      {
        key: 'goalLinkage',
        label: 'Link to goals',
        prompt: 'How did this month move your goals along?',
      },
    ],
  },
];

export const SNAPSHOT_FIELD_KEYS = SNAPSHOT_LAYERS.flatMap((layer) =>
  layer.fields.map((field) => field.key)
);

/** The Figma addendum frame's reasons, in its order. */
export const SNAPSHOT_ADDENDUM_REASONS = ['Additional context', 'Correction', 'Clarification'];

export const SNAPSHOT_LIMITS = {
  maxText: 5000,
  maxReason: 255,
};

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export const isMonthKey = (value) => MONTH_PATTERN.test(String(value ?? ''));

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** "2026-08" -> "August 2026". */
export function monthLabel(monthKey) {
  if (!isMonthKey(monthKey)) return '';
  const [year, month] = String(monthKey).split('-');
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
}

/** The month a date falls in, as "YYYY-MM". Defaults to now. */
export function monthKeyOf(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/** The month before the given key — "2026-01" -> "2025-12". */
export function previousMonthKey(monthKey) {
  if (!isMonthKey(monthKey)) return '';
  const [year, month] = String(monthKey).split('-').map(Number);
  return month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, '0')}`;
}

const isBlank = (value) =>
  value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

/**
 * Shape validation only — every narrative field is optional, because a month
 * someone had no words for is still a month that happened.
 *
 * @returns map of field -> message; empty object when valid.
 */
export function validateSnapshotFields(fields = {}) {
  const errors = {};
  for (const [key, value] of Object.entries(fields)) {
    if (!SNAPSHOT_FIELD_KEYS.includes(key)) {
      errors[key] = 'Unknown field for a snapshot.';
      continue;
    }
    if (isBlank(value)) continue;
    if (typeof value !== 'string' || value.length > SNAPSHOT_LIMITS.maxText) {
      errors[key] = `Must be text up to ${SNAPSHOT_LIMITS.maxText} characters.`;
    }
  }
  return errors;
}

/**
 * Approval is the point of no return, so it is checked on both sides: a
 * snapshot must still be a draft, must carry the non-linear statement, and must
 * have been built from at least one submitted log — a snapshot generated from
 * nothing is not evidence of anything.
 *
 * @returns {{ ok: boolean, errors: string[] }}
 */
export function canApproveSnapshot(snapshot = {}) {
  const errors = [];
  if (snapshot.status === SNAPSHOT_STATUS.LOCKED) {
    errors.push('This snapshot has already been approved and locked.');
  }
  if (isBlank(snapshot.nonlinearStatement)) {
    errors.push('Every snapshot must carry the non-linear functioning statement.');
  }
  if ((snapshot.sourceLogIds?.length ?? 0) < 1) {
    errors.push('This snapshot has no submitted daily logs behind it yet.');
  }
  return { ok: errors.length === 0, errors };
}

/** Locked records are addendum-only, never edited. */
export function isAddendumOnly(record) {
  return record?.status === SNAPSHOT_STATUS.LOCKED;
}

/** An addendum needs words; the reason is offered but never demanded. */
export function validateSnapshotAddendum({ text, reason } = {}) {
  const errors = {};
  if (isBlank(text)) errors.text = 'Write the note you want to add.';
  else if (typeof text !== 'string' || text.length > SNAPSHOT_LIMITS.maxText) {
    errors.text = `Must be text up to ${SNAPSHOT_LIMITS.maxText} characters.`;
  }
  if (!isBlank(reason) && (typeof reason !== 'string' || reason.length > SNAPSHOT_LIMITS.maxReason)) {
    errors.reason = `Must be text up to ${SNAPSHOT_LIMITS.maxReason} characters.`;
  }
  return errors;
}

/**
 * What an approved snapshot shows a *worker* (Figma 1169:3455, "Consent Level").
 *
 * The frame offers two values and the brief derives them "from the consent's
 * flag set". A label saying "Summary only" while the whole narrative is on
 * screen would be a lie, so the level is load-bearing rather than decorative:
 *
 *   summary_only — the grant is `can_view_snapshot` alone. The worker sees the
 *     month's shape: the counts, the areas of daily life engaged, how the month
 *     compared with usual, and the non-linear statement. Not the participant's
 *     written words.
 *   full_shared  — the grant also carries `can_view_intake` ("My Personal
 *     Profile"), which is the participant's own writing. The snapshot narrative
 *     is the same kind of thing, so it travels with the same permission, along
 *     with the goals it names and any addenda.
 *
 * A grant without `can_view_snapshot` is not an access level — it is no access,
 * and the snapshot never appears at all.
 */
export const SNAPSHOT_ACCESS = {
  FULL: 'full_shared',
  SUMMARY: 'summary_only',
};

export const SNAPSHOT_ACCESS_LABELS = {
  [SNAPSHOT_ACCESS.FULL]: 'Full shared',
  [SNAPSHOT_ACCESS.SUMMARY]: 'Summary only',
};

/** @returns 'full_shared' | 'summary_only' | null when the grant does not reach snapshots. */
export function snapshotAccessLevel(permissions = {}) {
  if (permissions.canViewSnapshot !== true) return null;
  return permissions.canViewProfile === true ? SNAPSHOT_ACCESS.FULL : SNAPSHOT_ACCESS.SUMMARY;
}

export const snapshotAccessLabel = (level) => SNAPSHOT_ACCESS_LABELS[level] ?? '';

/** Whether this level reaches the participant's written words. */
export const showsNarrative = (level) => level === SNAPSHOT_ACCESS.FULL;
