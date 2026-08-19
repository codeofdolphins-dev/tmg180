/**
 * Session Preferences: what a participant looks for in support sessions
 * (Figma: participant Preferences frame).
 *
 * These are filters for planning — they grant nothing and are never shown to
 * a worker without consent, which is why they live in their own table rather
 * than on the privacy layer. `status` records whether the participant
 * considers the set finished ('saved') or still being thought about ('draft');
 * both persist the same way.
 */

export const SESSION_PREFERENCE_GROUPS = [
  {
    key: 'support_focus',
    label: 'Support Focus',
    subtitle: 'Areas you are currently focusing on.',
    options: [
      'Daily living',
      'Mobility & transport',
      'Communication',
      'Social participation',
      'Self-care',
      'Learning & employment',
      'Health & wellbeing',
      'Safety',
    ],
  },
  {
    key: 'availability',
    label: 'General Availability',
    options: ['Morning', 'Afternoon', 'Evening', 'Weekdays', 'Weekends', 'Flexible'],
  },
  {
    key: 'communication_format',
    label: 'Communication Format',
    options: [
      'Phone',
      'Email',
      'Website',
      'Plain language',
      'Written information',
      'Visual information',
    ],
  },
  {
    key: 'setting',
    label: 'Setting',
    options: ['In-person', 'Online', 'Local area', 'Travel support'],
  },
  {
    key: 'languages',
    label: 'Languages',
    // The mock's "Other +" free-text entry arrives later; until then the
    // catalog is the whole vocabulary.
    options: ['English', 'Bengali', 'Hindi'],
  },
  {
    key: 'relational_style',
    label: 'Relational Style',
    subtitle: 'Qualities that help you feel supported and comfortable.',
    options: [
      'Calm',
      'Trauma-aware',
      'Bilingual',
      'Lived experience',
      'Structured',
      'Patient',
      'Quiet communication',
    ],
  },
];

export const SESSION_PREFERENCE_GROUP_KEYS = SESSION_PREFERENCE_GROUPS.map((group) => group.key);

export const DEFAULT_SESSION_PREFERENCES = Object.fromEntries(
  SESSION_PREFERENCE_GROUPS.map((group) => [group.key, []])
);

export const SESSION_PREFERENCE_STATUS = { DRAFT: 'draft', SAVED: 'saved' };

/** @returns map of key -> message; empty object when valid. Partial input welcome. */
export function validateSessionSelections(selections = {}) {
  const errors = {};
  for (const [key, value] of Object.entries(selections)) {
    const group = SESSION_PREFERENCE_GROUPS.find((candidate) => candidate.key === key);
    if (!group) {
      errors[key] = 'Unknown preference group.';
      continue;
    }
    if (!Array.isArray(value) || value.some((item) => !group.options.includes(item))) {
      errors[key] = 'Must be a list of the offered options.';
    }
  }
  return errors;
}
