import { FUNCTIONAL_DOMAINS } from './dailyLog.js';
import { SESSION_PREFERENCE_GROUPS } from './sessionPreferences.js';

/**
 * Worker profile — what a worker writes about themselves, and what the
 * participant directory shows of it.
 *
 * The contract is the Override register (P3-01…P3-04, P4-01…P4-04, WF-06):
 * the worker introduces themselves as a person first, through seven
 * plain-language prompts; résumé details (support areas, availability,
 * location, languages, experience, credentials) are *supporting* content
 * that renders below or behind. Ratings do not exist anywhere (R-06), and
 * availability is never part of a directory list — only of one profile's
 * detail (R-04). The directory is browse + direct contact, never booking.
 *
 * The prompt labels are verbatim from the seed (Handoff v1.1 §Priority 3).
 * The helper texts are NOT — seed_bundle_final_override_v1.json has never
 * reached this repo, so these are provisional and need Sue's sign-off.
 */

export const WORKER_PROFILE_PROMPTS = [
  {
    key: 'relational_intro',
    label: 'A little about me',
    helper: 'Who you are and how you came to this work, in your own words.',
    kind: 'text',
    readLabel: 'A little about me',
  },
  {
    key: 'natural_support_style',
    label: 'How I naturally support people',
    helper: 'The way you tend to work alongside someone — your rhythm, not a method.',
    kind: 'text',
    readLabel: 'Natural Support Style',
  },
  {
    key: 'communication_style',
    label: 'How I usually communicate',
    helper: 'A few short phrases — for example "Patient & attentive", "Uses visual aids".',
    kind: 'list',
    readLabel: 'Communication',
  },
  {
    key: 'preferred_environments',
    label: 'Where I do my best support work',
    helper: 'The settings where support tends to go well for you — home, community, outdoors, online.',
    kind: 'text',
    readLabel: 'Where I do my best support work',
  },
  {
    key: 'interests',
    label: 'Things I enjoy',
    helper: 'A few interests, so people can see what you might have in common.',
    kind: 'list',
    readLabel: 'Interests',
  },
  {
    key: 'participants_appreciate',
    label: 'What people often appreciate about working with me',
    helper: 'Short phrases in your own words — these are yours, not ratings or feedback.',
    kind: 'list',
    readLabel: 'What I bring to support',
  },
  {
    key: 'boundaries_and_fit',
    label: 'The kind of working relationship that suits me best',
    helper: 'What helps a working relationship go well for you, and what does not suit you.',
    kind: 'text',
    readLabel: 'Best Working Relationship',
  },
];

export const WORKER_PROFILE_PROMPT_KEYS = WORKER_PROFILE_PROMPTS.map((prompt) => prompt.key);

/**
 * Beyond the seven prompts the relational profile carries two more things
 * from the same seed table: a one-line philosophy (the quote on the directory
 * card and under the name on the profile) and relational tags.
 */
export const WORKER_PROFILE_TEXT_KEYS = WORKER_PROFILE_PROMPTS.filter((p) => p.kind === 'text').map(
  (p) => p.key
);
export const WORKER_PROFILE_LIST_KEYS = WORKER_PROFILE_PROMPTS.filter((p) => p.kind === 'list').map(
  (p) => p.key
);

/**
 * One support-area vocabulary for the worker profile, the directory filter
 * and the worker's daily log: the nine functional domains. The frames
 * disagree with each other (the directory mock shows five areas, the worker
 * profile frame eight, the log nine) — like FUNCTIONAL_DOMAINS itself this
 * needs Sue/Saf's ruling, and a different list is a change here and nowhere
 * else.
 */
export const SUPPORT_AREAS = FUNCTIONAL_DOMAINS;
export const SUPPORT_AREA_KEYS = SUPPORT_AREAS.map((area) => area.key);
export const supportAreaLabel = (key) =>
  SUPPORT_AREAS.find((area) => area.key === key)?.label ?? key;

/**
 * Relational tags share the participant's "Relational Style" vocabulary so
 * what a participant says they look for and what a worker says about
 * themselves are the same words.
 */
export const RELATIONAL_TAGS =
  SESSION_PREFERENCE_GROUPS.find((group) => group.key === 'relational_style')?.options ?? [];

/** Weekly availability — the design-system grid (`3233:59`): AM/PM × Mon–Sun. */
export const AVAILABILITY_DAYS = [
  { key: 'mon', label: 'Mon', short: 'MON', weekend: false },
  { key: 'tue', label: 'Tue', short: 'TUE', weekend: false },
  { key: 'wed', label: 'Wed', short: 'WED', weekend: false },
  { key: 'thu', label: 'Thu', short: 'THU', weekend: false },
  { key: 'fri', label: 'Fri', short: 'FRI', weekend: false },
  { key: 'sat', label: 'Sat', short: 'SAT', weekend: true },
  { key: 'sun', label: 'Sun', short: 'SUN', weekend: true },
];
export const AVAILABILITY_PERIODS = [
  { key: 'am', label: 'AM' },
  { key: 'pm', label: 'PM' },
];
/** 'mon_am' … 'sun_pm' — what the supporting-details row stores. */
export const AVAILABILITY_SLOTS = AVAILABILITY_DAYS.flatMap((day) =>
  AVAILABILITY_PERIODS.map((period) => `${day.key}_${period.key}`)
);

export const WORKER_PROFILE_STATUS = { DRAFT: 'draft', PUBLISHED: 'published' };

export const WORKER_PROFILE_LIMITS = {
  maxDisplayName: 120,
  maxText: 2000,
  maxPhilosophy: 200,
  maxListItems: 12,
  maxListItem: 60,
  maxLocation: 120,
  maxLanguages: 10,
  maxLanguage: 40,
  maxExperienceYears: 60,
  maxContact: 255,
};

/**
 * The non-coordination notice (P3-04 / P4-04). One wording everywhere — the
 * v2 Mandatory Notice bar's (`3233:23`). It renders on the directory and
 * wherever a worker's contact preference shows.
 */
export const CONTACT_NOTICE =
  'TMG180 does not coordinate services. Participants contact workers directly using their preferred contact method.';

/** "8 Years Exp." on the card meta line — null when the worker has not said. */
export function experienceLabel(years) {
  if (years === null || years === undefined || Number.isNaN(Number(years))) return null;
  const n = Number(years);
  if (n < 1) return 'Under a year';
  return `${n} ${n === 1 ? 'Year' : 'Years'} Exp.`;
}

const isBlank = (value) => value === undefined || value === null || String(value).trim() === '';

function checkText(errors, key, value, max, label) {
  if (value === undefined || value === null) return;
  if (typeof value !== 'string') errors[key] = `${label} must be text.`;
  else if (value.length > max) errors[key] = `${label} must be ${max} characters or fewer.`;
}

function checkList(errors, key, value, { maxItems, maxItem, label, allowed }) {
  if (value === undefined || value === null) return;
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    errors[key] = `${label} must be a list of short phrases.`;
    return;
  }
  if (value.length > maxItems) {
    errors[key] = `${label} can hold at most ${maxItems} items.`;
    return;
  }
  if (value.some((item) => item.trim() === '' || item.length > maxItem)) {
    errors[key] = `Each item in ${label.toLowerCase()} must be 1–${maxItem} characters.`;
    return;
  }
  if (allowed && value.some((item) => !allowed.includes(item))) {
    errors[key] = `${label} must use the offered options.`;
  }
}

/**
 * Field validation for PATCH /worker/profile. Partial input welcome —
 * undefined means "leave alone". Returns key → message; {} when valid.
 *
 * `fields` is the flat wire shape: the seven prompt keys, `supportPhilosophy`,
 * `valuesTags`, `displayName`, `supportAreas`, `availability`, `locationArea`,
 * `languages`, `experienceYears`, `contactPreference`, `optIn`.
 */
export function validateWorkerProfileFields(fields = {}) {
  const errors = {};
  const L = WORKER_PROFILE_LIMITS;

  checkText(errors, 'displayName', fields.displayName, L.maxDisplayName, 'Display name');
  for (const prompt of WORKER_PROFILE_PROMPTS) {
    if (prompt.kind === 'text') {
      checkText(errors, prompt.key, fields[prompt.key], L.maxText, prompt.label);
    } else {
      checkList(errors, prompt.key, fields[prompt.key], {
        maxItems: L.maxListItems,
        maxItem: L.maxListItem,
        label: prompt.label,
      });
    }
  }
  checkText(errors, 'supportPhilosophy', fields.supportPhilosophy, L.maxPhilosophy, 'Your one-line philosophy');
  checkList(errors, 'valuesTags', fields.valuesTags, {
    maxItems: RELATIONAL_TAGS.length,
    maxItem: L.maxListItem,
    label: 'Relational tags',
    allowed: RELATIONAL_TAGS,
  });

  checkList(errors, 'supportAreas', fields.supportAreas, {
    maxItems: SUPPORT_AREA_KEYS.length,
    maxItem: L.maxListItem,
    label: 'Support areas',
    allowed: SUPPORT_AREA_KEYS,
  });
  checkList(errors, 'availability', fields.availability, {
    maxItems: AVAILABILITY_SLOTS.length,
    maxItem: L.maxListItem,
    label: 'Availability',
    allowed: AVAILABILITY_SLOTS,
  });
  checkText(errors, 'locationArea', fields.locationArea, L.maxLocation, 'Location');
  checkList(errors, 'languages', fields.languages, {
    maxItems: L.maxLanguages,
    maxItem: L.maxLanguage,
    label: 'Languages',
  });
  if (fields.experienceYears !== undefined && fields.experienceYears !== null) {
    const years = Number(fields.experienceYears);
    if (!Number.isInteger(years) || years < 0 || years > L.maxExperienceYears) {
      errors.experienceYears = `Years of experience must be a whole number from 0 to ${L.maxExperienceYears}.`;
    }
  }
  checkText(errors, 'contactPreference', fields.contactPreference, L.maxContact, 'Contact preference');
  if (fields.optIn !== undefined && typeof fields.optIn !== 'boolean') {
    errors.optIn = 'Directory opt-in must be true or false.';
  }
  return errors;
}

/**
 * Publication readiness (R-07): `directory_published` requires
 * `onboarding_complete AND opt_in`, and a profile is "publishable on
 * relational content alone" (P3-01). So the one hard requirement is the
 * first prompt — a person has introduced themselves — plus the explicit
 * opt-in. Support areas and availability are onboarding steps the worker is
 * guided through, not publish blockers; the governance-acknowledgement step
 * joins the list when Governance Standing is built.
 *
 * `profile` is the flat wire shape (see validateWorkerProfileFields).
 */
export function workerProfileReadiness(profile = {}) {
  const steps = [
    {
      key: 'profile_details',
      label: 'Add profile details',
      done: !isBlank(profile.relational_intro),
      required: true,
    },
    {
      key: 'support_areas',
      label: 'Add support areas',
      done: Array.isArray(profile.supportAreas) && profile.supportAreas.length > 0,
      required: false,
    },
    {
      key: 'availability',
      label: 'Add availability',
      done: Array.isArray(profile.availability) && profile.availability.length > 0,
      required: false,
    },
    {
      key: 'opt_in',
      label: 'Publish profile opt-in',
      done: profile.optIn === true,
      required: true,
    },
  ];
  const missing = steps.filter((step) => step.required && !step.done).map((step) => step.key);
  return {
    steps,
    completed: steps.filter((step) => step.done).length,
    total: steps.length,
    onboardingComplete: steps.filter((s) => s.key !== 'opt_in').every((s) => !s.required || s.done),
    canPublish: missing.length === 0,
    missing,
  };
}
