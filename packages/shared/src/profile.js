/**
 * The participant Personal Profile: section and question definitions.
 *
 * This file is the contract for the whole profile feature. The web app renders
 * its forms from it, the API validates section saves against it, and the
 * database stores answers as (question_key -> JSON value) rows — so changing a
 * section or question here is a seed edit, never a migration.
 *
 * Canon note: the section list below follows the BUILT UI, which follows the
 * Figma file (29 July 2026). The Final Override seed (8 July) instead has
 * "Overview" and "What Matters To Me" and no Learning & employment / Self-care
 * — ruling R-01 is open. When it lands, this array is the only thing to edit.
 *
 * Question types (validation semantics, not rendering — pages keep their own
 * Figma-faithful widgets):
 *   text      short string
 *   textarea  long string
 *   select    one value from `options`
 *   multi     array of values from `options` (chips / checkbox groups)
 *   toggle    boolean
 *   scale     integer from `min` to `max` (mood rating)
 *   steps     array of { text, done } (goal steps)
 */

/** P1-03: every answer carries a visibility, private by default. */
export const ANSWER_VISIBILITY = {
  PRIVATE: 'participant_private',
  SHARE_WITH_CONSENT: 'share_with_consent',
  SNAPSHOT_ONLY: 'snapshot_only',
};

export const PROFILE_SECTION_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETE: 'complete',
};

const MAX_TEXT = 255;
const MAX_TEXTAREA = 5000;
const MAX_MULTI = 50;
const MAX_STEPS = 20;

export const PROFILE_SECTIONS = [
  {
    key: 'about-me',
    order: 1,
    title: 'About me',
    questions: [
      { key: 'preferred_name', type: 'text', required: true },
      {
        key: 'pronouns',
        type: 'select',
        options: ['she-her', 'he-him', 'they-them', 'self-describe', 'prefer-not-to-say'],
      },
      { key: 'about_you', type: 'textarea' },
    ],
  },
  {
    key: 'my-goals',
    order: 2,
    title: 'My goals',
    questions: [
      { key: 'primary_aspiration', type: 'textarea', required: true },
      { key: 'goal_steps', type: 'steps' },
    ],
  },
  {
    key: 'daily-living',
    order: 3,
    title: 'Daily living',
    questions: [
      { key: 'morning_routine', type: 'textarea' },
      { key: 'evening_routine', type: 'textarea' },
      {
        key: 'daily_activities',
        type: 'multi',
        options: ['meal_preparation', 'community_access', 'household_chores', 'public_transport'],
      },
    ],
  },
  {
    key: 'mobility-access',
    order: 4,
    title: 'Mobility & transport',
    questions: [
      {
        key: 'mobility_equipment',
        type: 'multi',
        options: ['walker', 'mobility_scooter', 'crutches', 'orthotics', 'other', 'none'],
      },
      { key: 'access_requirements', type: 'textarea' },
      {
        key: 'travel_method',
        type: 'select',
        options: [
          'private_accessible_vehicle',
          'public_transport',
          'taxi_rideshare',
          'community_transport',
          'walking',
          'other',
        ],
      },
      {
        key: 'transfer_assistance',
        type: 'select',
        options: [
          'independent',
          'standby_supervision',
          'requires_1_1_assistance',
          'requires_2_person_assistance',
          'hoist_transfer',
        ],
      },
      { key: 'avoid_stairs', type: 'toggle' },
      { key: 'rest_breaks', type: 'toggle' },
    ],
  },
  {
    key: 'how-i-communicate',
    order: 5,
    title: 'Communication',
    questions: [
      {
        key: 'preferred_communication',
        type: 'select',
        options: ['verbal_speech', 'text_based', 'sign_language', 'aac_tools'],
      },
      { key: 'communication_helps', type: 'textarea' },
      { key: 'additional_needs', type: 'textarea' },
    ],
  },
  {
    key: 'social-community',
    order: 6,
    title: 'Social participation',
    questions: [
      { key: 'spend_time_with', type: 'text' },
      { key: 'enjoyed_activities', type: 'textarea' },
      {
        // The Figma frame lists Volunteering and Community Groups twice;
        // deduplicated here — flagged in the audit's copy punch list.
        key: 'community_activities',
        type: 'multi',
        options: [
          'sport_recreation',
          'arts_crafts',
          'music',
          'reading',
          'gardening',
          'volunteering',
          'community_groups',
          'outdoor_activities',
          'faith_spiritual',
          'other',
        ],
      },
    ],
  },
  {
    key: 'self-care',
    order: 7,
    title: 'Self-care',
    questions: [
      {
        key: 'personal_care',
        type: 'multi',
        options: ['showering', 'dressing', 'grooming', 'eating', 'toileting', 'oral_hygiene'],
      },
      {
        key: 'medication_routine',
        type: 'multi',
        options: ['independent', 'reminders', 'assistance_preparing', 'full_assistance'],
      },
      { key: 'medication_notes', type: 'textarea' },
      { key: 'daily_supports', type: 'textarea' },
    ],
  },
  {
    key: 'learning-employment',
    order: 8,
    title: 'Learning & employment',
    questions: [
      {
        key: 'current_situation',
        type: 'select',
        options: ['studying', 'working', 'looking_for_work', 'volunteering', 'retired', 'exploring_options'],
      },
      { key: 'next_12_months', type: 'textarea' },
      {
        key: 'support_wanted',
        type: 'multi',
        options: [
          'finding_employment',
          'interview_preparation',
          'workplace_adjustments',
          'study_support',
          'training',
          'career_planning',
          'building_confidence',
          'time_management',
          'travel_to_work',
          'volunteering',
          'digital_skills',
          'other',
        ],
      },
      { key: 'skills_to_develop', type: 'textarea' },
    ],
  },
  {
    key: 'health-wellbeing',
    order: 9,
    title: 'Health & wellbeing',
    questions: [
      { key: 'health_conditions', type: 'textarea' },
      {
        key: 'current_support',
        type: 'multi',
        options: [
          'medication',
          'physiotherapy',
          'psychology',
          'occupational_therapy',
          'exercise_plan',
          'support_worker',
          'other',
        ],
      },
      { key: 'anything_else', type: 'textarea' },
      { key: 'recent_mood', type: 'scale', min: 1, max: 5 },
    ],
  },
  {
    key: 'safety-support',
    order: 10,
    title: 'Safety',
    questions: [
      { key: 'contact_name', type: 'text' },
      { key: 'contact_relationship', type: 'text' },
      { key: 'contact_phone', type: 'text' },
      {
        key: 'contact_available',
        type: 'select',
        options: ['anytime', 'business_hours', 'evenings', 'weekends'],
      },
      { key: 'feels_safe', type: 'textarea' },
      {
        key: 'things_to_avoid',
        type: 'multi',
        options: [
          'loud_noises',
          'bright_lights',
          'crowded_spaces',
          'physical_touch',
          'strong_smells',
          'sudden_changes',
          'other',
        ],
      },
    ],
  },
  {
    key: 'decision-making',
    order: 11,
    // Hub card says "My support network" — known Figma hub/section mismatch
    // (M-12), pending ruling. The page itself is Decision Making.
    title: 'Decision making',
    questions: [
      { key: 'decision_helps', type: 'textarea' },
      {
        key: 'involved_in_decisions',
        type: 'multi',
        options: ['my_family', 'legal_guardian', 'close_friends', 'care_coordinator'],
      },
      {
        key: 'decision_values',
        type: 'multi',
        options: ['speed', 'having_all_details', 'quiet_reflection', 'expert_advice', 'family_consensus'],
      },
      { key: 'decision_notes', type: 'textarea' },
    ],
  },
];

export const PROFILE_TOTAL_SECTIONS = PROFILE_SECTIONS.length;

const SECTION_BY_KEY = new Map(PROFILE_SECTIONS.map((section) => [section.key, section]));

/** @returns the section definition, or undefined for an unknown key. */
export const profileSection = (key) => SECTION_BY_KEY.get(key);

/** The section after this one in seed order, or null at the end. */
export function nextProfileSection(key) {
  const index = PROFILE_SECTIONS.findIndex((section) => section.key === key);
  return index >= 0 ? (PROFILE_SECTIONS[index + 1] ?? null) : null;
}

/**
 * "No answer" — distinct from a falsy answer: an unticked toggle saved as
 * `false` is an explicit answer, an empty string or empty list is not.
 */
export function isEmptyAnswer(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

const isPlainString = (value, max) => typeof value === 'string' && value.length <= max;

/** @returns null when valid, otherwise a message safe to show the caller. */
export function validateAnswerValue(question, value) {
  if (isEmptyAnswer(value)) return null; // clearing an answer is always allowed
  switch (question.type) {
    case 'text':
      return isPlainString(value, MAX_TEXT) ? null : `Must be text up to ${MAX_TEXT} characters.`;
    case 'textarea':
      return isPlainString(value, MAX_TEXTAREA)
        ? null
        : `Must be text up to ${MAX_TEXTAREA} characters.`;
    case 'select':
      return question.options.includes(value) ? null : 'Not one of the allowed options.';
    case 'multi':
      if (!Array.isArray(value) || value.length > MAX_MULTI) return 'Must be a list of options.';
      return value.every((item) => question.options.includes(item))
        ? null
        : 'Contains an option that is not allowed.';
    case 'toggle':
      return typeof value === 'boolean' ? null : 'Must be true or false.';
    case 'scale':
      return Number.isInteger(value) && value >= question.min && value <= question.max
        ? null
        : `Must be a whole number between ${question.min} and ${question.max}.`;
    case 'steps':
      if (!Array.isArray(value) || value.length > MAX_STEPS) return 'Must be a list of steps.';
      return value.every(
        (step) =>
          step &&
          typeof step === 'object' &&
          !Array.isArray(step) &&
          isPlainString(step.text, MAX_TEXT) &&
          typeof step.done === 'boolean'
      )
        ? null
        : 'Each step needs text and a done flag.';
    default:
      return 'Unknown question type.';
  }
}

/**
 * Validates a section save. Unknown question keys are rejected — the client
 * and server must be reading the same definition of the section.
 *
 * @returns map of question_key -> error message; empty object when valid.
 */
export function validateSectionAnswers(section, answers = {}) {
  const errors = {};
  const questionByKey = new Map(section.questions.map((question) => [question.key, question]));
  for (const [key, value] of Object.entries(answers)) {
    const question = questionByKey.get(key);
    if (!question) {
      errors[key] = 'Unknown question for this section.';
      continue;
    }
    const error = validateAnswerValue(question, value);
    if (error) errors[key] = error;
  }
  return errors;
}

/**
 * Completion rule: every `required` question answered; a section with no
 * required questions completes on its first non-empty answer. Completion is
 * sticky — the API never demotes a complete section (Jiten, 2026-08-04).
 */
export function isSectionComplete(section, answers = {}) {
  const required = section.questions.filter((question) => question.required);
  if (required.length > 0) {
    return required.every((question) => !isEmptyAnswer(answers[question.key]));
  }
  return section.questions.some((question) => !isEmptyAnswer(answers[question.key]));
}
