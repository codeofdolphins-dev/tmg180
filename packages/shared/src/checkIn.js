/**
 * The Participant Check-in contract (Template B).
 *
 * Longitudinal Evidence Templates v2.0 (client set, 28 Aug 2026) specifies
 * three templates that build the evidence chain together: A — Support Event
 * Log (worker, per session, `dailyLog.js`), B — Participant Check-in (this
 * file), C — Monthly Snapshot Summary (`snapshot.js`). B is the participant's
 * own account, "completed by the participant — weekly, after a support period,
 * or whenever they choose", and it sits *alongside* the worker log rather than
 * inside it: a worker can never complete it, and nothing in it is filtered
 * through worker observation.
 *
 * `tmg_participant_checkin` was built from the earlier DB pack and matches this
 * template field for field, so this module adds the vocabularies the table's
 * untyped text/array columns were always waiting for — no migration.
 *
 * Two rules from the template drive the shape here:
 *   - "There are no right or wrong answers — what matters is what is true for
 *     you." Everything past B1/B2 is optional; a check-in someone had 30
 *     seconds for is still a check-in.
 *   - `is_locked` defaults true. A check-in has no draft state: the
 *     participant's words are the record the moment they save them, and the
 *     record is append-only from there.
 *
 * Wire shape (camelCase; the API maps to/from the snake_case columns):
 *   { id, period, checkinDate, impactTags, impactNotes, intensityRating,
 *     helpedTags, helpedNotes, recoveryLevel, recoveryNotes, ownWords,
 *     goalsTags, goalsNotes, isLocked, createdAt }
 */

/** B1 — "This check-in is about:". Stored in `checkin_period`. */
export const CHECKIN_PERIODS = [
  { key: 'this_week', label: 'This week' },
  { key: 'today', label: 'Today' },
  { key: 'after_support', label: 'After a support period' },
];

export const CHECKIN_PERIOD_KEYS = CHECKIN_PERIODS.map((period) => period.key);

/**
 * B2 — "What showed up most for you". Functional impacts in the participant's
 * own vocabulary, not diagnoses; "Something positive — good period" is one of
 * them, which is why picking at least one is never a demand to report a bad
 * week. The template says "Pick 1–3".
 */
export const CHECKIN_IMPACT_TAGS = [
  { key: 'overwhelm', label: 'Overwhelm / cognitive load' },
  { key: 'shutdown', label: 'Shutdown or freeze' },
  { key: 'fatigue', label: 'Fatigue / low battery' },
  { key: 'pain', label: 'Pain' },
  { key: 'executive_function', label: 'Executive function — starting or planning things' },
  { key: 'mobility', label: 'Mobility or balance' },
  { key: 'sleep', label: 'Sleep impact' },
  { key: 'social_withdrawal', label: 'Social withdrawal or isolation' },
  { key: 'admin_load', label: 'Admin load or paperwork overload' },
  { key: 'emotional_intensity', label: 'Emotional intensity — anxiety, distress, low mood' },
  { key: 'something_positive', label: 'Something positive — good period' },
  { key: 'other', label: 'Other — describe below' },
];

export const CHECKIN_IMPACT_TAG_KEYS = CHECKIN_IMPACT_TAGS.map((tag) => tag.key);

/**
 * B3 — "How strong was it overall?", 0–4 with the template's wording. Stored in
 * `intensity_rating`. Optional: a rating is information, not a score, and the
 * template is explicit that a lower number is not a failure.
 */
export const CHECKIN_INTENSITY_SCALE = [
  { value: 0, label: 'None / not present' },
  { value: 1, label: 'Mild / noticeable but manageable' },
  { value: 2, label: 'Moderate / affected my day' },
  { value: 3, label: 'High / significantly affected my functioning' },
  { value: 4, label: 'Severe / I struggled to manage' },
];

export const CHECKIN_INTENSITY_MIN = 0;
export const CHECKIN_INTENSITY_MAX = 4;

/** B4 — "What helped". Tick anything that made a difference. */
export const CHECKIN_HELPED_TAGS = [
  { key: 'support_person', label: 'My support person' },
  { key: 'pacing_rest', label: 'Pacing or rest' },
  { key: 'structure_planning', label: 'Structure or planning' },
  { key: 'low_demand', label: 'Low-demand environment' },
  { key: 'sensory_breaks', label: 'Sensory breaks' },
  { key: 'advocacy_admin', label: 'Advocacy or admin help' },
  { key: 'health_supports', label: 'Health supports — medication, therapy, physio' },
  { key: 'trusted_connection', label: 'Connection with someone I trust' },
  { key: 'outdoors', label: 'Time outdoors' },
  { key: 'routine', label: 'Routine' },
  { key: 'nothing_helped', label: 'Nothing helped much this period' },
  { key: 'other', label: 'Other — describe below' },
];

export const CHECKIN_HELPED_TAG_KEYS = CHECKIN_HELPED_TAGS.map((tag) => tag.key);

/**
 * B5 — "Recovery cost". The invisible half of participation, and the reason
 * the monthly snapshot can show a recovery-cost trend at all.
 */
export const CHECKIN_RECOVERY_LEVELS = [
  { key: 'none', label: 'No extra recovery needed — I bounced back' },
  { key: 'a_little', label: 'A little recovery needed — back to usual fairly quickly' },
  { key: 'a_lot', label: 'A lot of recovery needed — took significant time or rest' },
  { key: 'days', label: 'Days to recover — this period took a lot out of me' },
];

export const CHECKIN_RECOVERY_LEVEL_KEYS = CHECKIN_RECOVERY_LEVELS.map((level) => level.key);

/** B7 — "Goals check-in". Optional throughout; goals are never demanded here. */
export const CHECKIN_GOAL_TAGS = [
  { key: 'progress', label: 'I made progress toward a goal' },
  { key: 'maintained', label: 'I maintained something important despite difficulty' },
  { key: 'out_of_reach', label: 'A goal felt out of reach this period' },
  { key: 'needs_updating', label: 'My goals feel like they need updating' },
  { key: 'not_sure', label: 'I am not sure — I need help thinking about this' },
];

export const CHECKIN_GOAL_TAG_KEYS = CHECKIN_GOAL_TAGS.map((tag) => tag.key);

/**
 * B6 — the participant's own space, and the one field the template describes
 * rather than prompts: "Write whatever you want people to understand about
 * this period — or leave it blank."
 */
export const CHECKIN_OWN_WORDS_PROMPT = 'What I want people to understand is...';

export const CHECKIN_LIMITS = {
  minImpactTags: 1,
  maxImpactTags: 3,
  maxNotes: 5000,
};

const CHECKIN_TEXT_FIELDS = ['impactNotes', 'helpedNotes', 'recoveryNotes', 'goalsNotes', 'ownWords'];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isBlank = (value) =>
  value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

const isKeyList = (value, allowed) =>
  Array.isArray(value) && value.every((item) => allowed.includes(item));

/**
 * Shape validation only — rejects values that are not the thing they claim to
 * be, and nothing else. Completeness is `canSubmitCheckIn`'s job.
 *
 * @returns map of field -> message; empty object when valid.
 */
export function validateCheckInFields(fields = {}) {
  const errors = {};

  if (!isBlank(fields.period) && !CHECKIN_PERIOD_KEYS.includes(fields.period)) {
    errors.period = 'Not one of the allowed options.';
  }
  if (!isBlank(fields.checkinDate) && !DATE_PATTERN.test(fields.checkinDate)) {
    errors.checkinDate = 'Needs to be a date.';
  }

  if (fields.impactTags !== undefined) {
    if (!isKeyList(fields.impactTags, CHECKIN_IMPACT_TAG_KEYS)) {
      errors.impactTags = 'Contains an option that is not allowed.';
    } else if (fields.impactTags.length > CHECKIN_LIMITS.maxImpactTags) {
      errors.impactTags = `Choose up to ${CHECKIN_LIMITS.maxImpactTags}.`;
    } else if (new Set(fields.impactTags).size !== fields.impactTags.length) {
      errors.impactTags = 'The same option is listed twice.';
    }
  }
  if (fields.helpedTags !== undefined && !isKeyList(fields.helpedTags, CHECKIN_HELPED_TAG_KEYS)) {
    errors.helpedTags = 'Contains an option that is not allowed.';
  }
  if (fields.goalsTags !== undefined && !isKeyList(fields.goalsTags, CHECKIN_GOAL_TAG_KEYS)) {
    errors.goalsTags = 'Contains an option that is not allowed.';
  }

  if (fields.intensityRating !== undefined && fields.intensityRating !== null) {
    const rating = fields.intensityRating;
    const valid =
      Number.isInteger(rating) &&
      rating >= CHECKIN_INTENSITY_MIN &&
      rating <= CHECKIN_INTENSITY_MAX;
    if (!valid) {
      errors.intensityRating = `Choose a number from ${CHECKIN_INTENSITY_MIN} to ${CHECKIN_INTENSITY_MAX}.`;
    }
  }

  if (!isBlank(fields.recoveryLevel) && !CHECKIN_RECOVERY_LEVEL_KEYS.includes(fields.recoveryLevel)) {
    errors.recoveryLevel = 'Not one of the allowed options.';
  }

  for (const key of CHECKIN_TEXT_FIELDS) {
    if (isBlank(fields[key])) continue;
    if (typeof fields[key] !== 'string' || fields[key].length > CHECKIN_LIMITS.maxNotes) {
      errors[key] = `Must be text up to ${CHECKIN_LIMITS.maxNotes} characters.`;
    }
  }

  return errors;
}

/**
 * A check-in saves straight to the record, so this is the only gate. It asks
 * for the three things without which the entry could not be read back later —
 * what period it covers, what date, and at least one of the twelve things that
 * showed up ("Pick 1–3", B2). Everything the template marks optional stays
 * optional.
 *
 * @returns {{ ok: boolean, errors: Record<string, string> }}
 */
export function canSubmitCheckIn(checkIn = {}) {
  const errors = validateCheckInFields(checkIn);
  const impactTags = checkIn.impactTags ?? [];

  if (isBlank(checkIn.period)) {
    errors.period = 'Choose what this check-in is about.';
  }
  if (isBlank(checkIn.checkinDate)) {
    errors.checkinDate = 'Add the date this check-in covers.';
  }
  if (!errors.impactTags && impactTags.length < CHECKIN_LIMITS.minImpactTags) {
    errors.impactTags = 'Choose at least one thing that showed up for you.';
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

/**
 * Saved check-ins are locked (`is_locked` defaults true): this is the
 * participant's voice at a point in time, and rewriting it later would make it
 * something else. Corrections are made by adding another check-in.
 */
export function isCheckInLocked(checkIn) {
  return checkIn?.isLocked !== false;
}

const labelOf = (options, key) => options.find((option) => option.key === key)?.label ?? key;

export const checkInPeriodLabel = (key) => labelOf(CHECKIN_PERIODS, key);
export const checkInImpactLabel = (key) => labelOf(CHECKIN_IMPACT_TAGS, key);
export const checkInHelpedLabel = (key) => labelOf(CHECKIN_HELPED_TAGS, key);
export const checkInRecoveryLabel = (key) => labelOf(CHECKIN_RECOVERY_LEVELS, key);
export const checkInGoalLabel = (key) => labelOf(CHECKIN_GOAL_TAGS, key);

/** @returns the 0–4 wording, or '' when nothing was rated. */
export const checkInIntensityLabel = (value) =>
  CHECKIN_INTENSITY_SCALE.find((step) => step.value === value)?.label ?? '';
