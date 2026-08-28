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
 * what the month's logs and check-ins actually say and the participant writes
 * the words. The layers below are the Figma "language perspective" toggle and
 * the groups of columns in tmg_monthly_snapshot — one shape, not two; they run
 * C2 to C7 of Template C (Longitudinal Evidence Templates v2.0). The Monthly
 * Relational Longitudinal Snapshot's own sections sit further down, on the same
 * record — see the block above SNAPSHOT_PARTICIPANT_INVOLVEMENT.
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
    key: 'functional_domains',
    label: 'NDIS functional domains',
    description: 'The six domains a planner reads the month against.',
    fields: [
      { key: 'mobilitySummary', label: 'Mobility', prompt: 'Impact and support this month.' },
      {
        key: 'communicationSummary',
        label: 'Communication',
        prompt: 'Impact and support this month.',
      },
      {
        key: 'socialSummary',
        label: 'Social interaction',
        prompt: 'Impact and support this month.',
      },
      { key: 'selfCareSummary', label: 'Self-care', prompt: 'Impact and support this month.' },
      { key: 'learningSummary', label: 'Learning', prompt: 'Impact and support this month.' },
      {
        key: 'selfManagementSummary',
        label: 'Self-management',
        prompt: 'Impact and support this month.',
      },
    ],
  },
  {
    key: 'outcomes',
    label: 'Outcome highlights',
    description: 'Small wins count. Not about cure — about what support made possible.',
    fields: [
      {
        key: 'outcomeHighlights',
        label: 'Outcome highlights',
        prompt: 'What went well, in everyday language?',
      },
    ],
  },
  {
    key: 'ndis_evidence',
    label: 'NDIS evidence language',
    description: 'How this month reads for a plan review.',
    fields: [
      {
        key: 'impairmentCategory',
        label: 'Impairment category',
        prompt: 'From your Notice of Impairments, if you have one.',
      },
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

/** The layers' own free-text fields. `SNAPSHOT_FIELD_KEYS` below adds the relational ones. */
export const SNAPSHOT_LAYER_FIELD_KEYS = SNAPSHOT_LAYERS.flatMap((layer) =>
  layer.fields.map((field) => field.key)
);

/**
 * C3 — "Participation affected most in". The participant's own selection,
 * stored in `participation_domains`.
 *
 * Deliberately not the six NDIS functional domains: those are the C4 layer
 * above, and the counted version of them already reaches the screen as
 * `stats.domains`, tallied from the month's logs. This list is the everyday
 * shape of the month, which is a different question with a different answer.
 */
export const SNAPSHOT_PARTICIPATION_AREAS = [
  { key: 'daily_living', label: 'Daily living' },
  { key: 'community_participation', label: 'Community participation' },
  { key: 'relationships', label: 'Relationships' },
  { key: 'admin_appointments', label: 'Admin and appointments' },
  { key: 'health_routines', label: 'Health routines' },
  { key: 'work_or_study', label: 'Work or study' },
  { key: 'other', label: 'Other' },
];

export const SNAPSHOT_PARTICIPATION_AREA_KEYS = SNAPSHOT_PARTICIPATION_AREAS.map(
  (area) => area.key
);

/** C5 — outcome highlights, stored in `outcome_tags`. */
export const SNAPSHOT_OUTCOME_TAGS = [
  { key: 'consistency', label: 'More consistency in routines' },
  { key: 'safety', label: 'Improved safety or fewer near-misses' },
  { key: 'reduced_overwhelm', label: 'Reduced overwhelm or escalation frequency' },
  { key: 'faster_recovery', label: 'Faster recovery after ordinary demands' },
  {
    key: 'broader_participation',
    label: 'Broader participation range — more places or activities tolerated',
  },
  { key: 'connection', label: 'Less isolation or more connection' },
  { key: 'goal_progress', label: 'Progress toward a stated NDIS goal' },
  { key: 'maintained_stability', label: 'Maintained stability during a difficult period' },
  { key: 'other', label: 'Other — describe below' },
];

export const SNAPSHOT_OUTCOME_TAG_KEYS = SNAPSHOT_OUTCOME_TAGS.map((tag) => tag.key);

/**
 * C9 — who an approved snapshot may be exported to. Recorded with the export,
 * never acted on by the platform: "TMG180 cannot share this document without
 * participant approval", so this is the participant's record of a decision
 * they made, not a send.
 */
export const SNAPSHOT_SHARE_AUDIENCES = [
  { key: 'planner_lac', label: 'NDIS planner or LAC — for plan review or reassessment' },
  { key: 'support_coordinator', label: 'Support coordinator — for coordination of supports' },
  { key: 'allied_health', label: 'Allied health professional — for clinical context' },
  { key: 'tribunal', label: 'Tribunal or review process — as supporting evidence' },
  { key: 'private', label: 'Kept private — participant record only' },
];

export const SNAPSHOT_SHARE_AUDIENCE_KEYS = SNAPSHOT_SHARE_AUDIENCES.map(
  (audience) => audience.key
);

/* ------------------------------------------------------------------------ *
 * Monthly Relational Longitudinal Snapshot (canonical monthly template,
 * client set 28 Aug 2026) — the same monthly record, in the checkbox-led
 * relational form the template lays out.
 *
 * It is not a second artefact. Its Developer Instructions describe this exact
 * record ("aggregate patterns from daily notes, preserve participant voice,
 * track sustainability and recovery cost, support reassessment evidence"), and
 * its section 2 asks Template C2's five questions in different words, its
 * section 10 is C6 and its section 11 is C8. What it adds that C does not have
 * are the seven checkbox banks below — sections 3 to 9.
 *
 * Section 2 → the existing C2 fields, in the template's order:
 *   What felt important this month?              → whatMattered
 *   What became harder this month?               → whatGotInWay
 *   What helped most this month?                 → whatHelped
 *   What took the most energy or recovery?       → recoveryCost
 *   Continue, change, or better understand?      → nextMonthIntentions
 * ------------------------------------------------------------------------ */

/** Section 1 — "Participant involved in review". */
export const SNAPSHOT_PARTICIPANT_INVOLVEMENT = [
  { key: 'yes', label: 'Yes' },
  { key: 'no', label: 'No' },
  { key: 'worker_only', label: 'Participant preferred worker-only summary this month' },
];

/** Section 6 — "Were there fluctuations this month?". */
export const SNAPSHOT_FLUCTUATION_LEVELS = [
  { key: 'yes', label: 'Yes' },
  { key: 'no', label: 'No' },
  { key: 'mild', label: 'Mild fluctuation' },
  { key: 'significant', label: 'Significant fluctuation' },
];

/** Section 11 — "Participant Voice and Approval". */
export const SNAPSHOT_APPROVAL_STATEMENTS = [
  { key: 'reflects_my_experience', label: 'This summary reflects my experience' },
  { key: 'add_context', label: 'I would like to add context' },
  { key: 'correct_something', label: 'I would like to correct something' },
  { key: 'reviewed_with_worker', label: 'I reviewed this summary with my worker' },
  { key: 'worker_completed', label: 'I preferred a worker-completed summary this month' },
];

/**
 * Sections 3–9, verbatim. Each is one checkbox bank plus its short summary;
 * `note` is the template's own explanation of why the section exists, and
 * `examples` its own examples — both are shown, because the reason a section
 * is there is the part that keeps the wording from drifting clinical.
 */
export const SNAPSHOT_RELATIONAL_SECTIONS = [
  {
    key: 'participation_trends',
    number: 3,
    title: 'Participation and Everyday Life Trends',
    question: 'What became more manageable, consistent, or sustainable this month?',
    instruction: 'Select all that apply.',
    tagField: 'participationTrendTags',
    summaryField: 'participationTrendsSummary',
    summaryLabel: 'Short summary of participation trends:',
    options: [
      { key: 'daily_routines', label: 'Daily routines' },
      { key: 'appointments', label: 'Appointments' },
      { key: 'community_participation', label: 'Community participation' },
      { key: 'emotional_regulation', label: 'Emotional regulation' },
      { key: 'communication', label: 'Communication' },
      { key: 'relationships', label: 'Relationships' },
      { key: 'household_tasks', label: 'Household tasks' },
      { key: 'admin_or_planning', label: 'Admin or planning' },
      { key: 'self_care', label: 'Self-care' },
      { key: 'recovery_time', label: 'Recovery time' },
      { key: 'leaving_the_house', label: 'Leaving the house' },
      { key: 'reduced_isolation', label: 'Reduced isolation' },
      { key: 'increased_confidence', label: 'Increased confidence' },
      { key: 'health_routines', label: 'Health routines' },
      { key: 'other', label: 'Other' },
    ],
    examples: [
      'improved consistency with appointments',
      'increased community participation',
      'improved communication during stress',
      'reduced isolation',
      'improved recovery time',
      'more sustainable routines',
    ],
  },
  {
    key: 'ongoing_barriers',
    number: 4,
    title: 'Ongoing Functional Barriers',
    question: 'What continued to significantly affect functioning this month?',
    instruction: 'Select all that apply.',
    tagField: 'barrierTags',
    summaryField: 'barriersSummary',
    summaryLabel: 'Short summary of ongoing barriers:',
    options: [
      { key: 'overwhelm_mental_load', label: 'Overwhelm or mental load' },
      { key: 'fatigue_recovery_cost', label: 'Fatigue or high recovery cost' },
      { key: 'executive_dysfunction', label: 'Executive dysfunction' },
      { key: 'sensory_overwhelm', label: 'Sensory overwhelm' },
      { key: 'emotional_regulation', label: 'Emotional regulation difficulty' },
      { key: 'pain_physical', label: 'Pain or physical limitation' },
      { key: 'shutdown_recovery', label: 'Shutdown or recovery periods' },
      { key: 'social_exhaustion', label: 'Social exhaustion' },
      { key: 'communication_under_stress', label: 'Communication difficulty under stress' },
      { key: 'routine_disruption', label: 'Routine disruption' },
      { key: 'health_instability', label: 'Health instability' },
      { key: 'environmental_stressors', label: 'Environmental stressors' },
      { key: 'other', label: 'Other' },
    ],
    note: 'This section exists to normalise ongoing impairment and fluctuating support needs.',
  },
  {
    key: 'support_mediated',
    number: 5,
    title: 'Support-Mediated Functioning',
    question:
      'What improvements appeared connected to support consistency, pacing, accommodations, or relational safety?',
    instruction: 'Select all that apply.',
    tagField: 'supportMediatedTags',
    summaryField: 'supportMediatedSummary',
    summaryLabel: 'Short summary of what support made possible:',
    options: [
      { key: 'reduced_overwhelm', label: 'Reduced overwhelm' },
      { key: 'improved_regulation', label: 'Improved regulation' },
      { key: 'faster_recovery', label: 'Faster recovery' },
      { key: 'routine_stability', label: 'Improved routine stability' },
      { key: 'increased_participation', label: 'Increased participation' },
      { key: 'improved_communication', label: 'Improved communication' },
      { key: 'reduced_isolation', label: 'Reduced isolation' },
      { key: 'reduced_shutdown', label: 'Reduced shutdown frequency' },
      { key: 'increased_confidence', label: 'Increased confidence' },
      { key: 'improved_sustainability', label: 'Improved sustainability' },
      { key: 'reduced_cognitive_overload', label: 'Reduced cognitive overload' },
      { key: 'improved_pacing', label: 'Improved pacing' },
      { key: 'safety_or_stability', label: 'Increased safety or stability' },
      { key: 'other', label: 'Other' },
    ],
    examples: [
      'support reduced recovery cost',
      'pacing improved sustainability',
      'reduced demands prevented shutdown',
      'emotional co-regulation improved participation',
      'structure reduced overwhelm',
    ],
  },
  {
    key: 'fluctuation',
    number: 6,
    title: 'Fluctuation and Context',
    question: 'What appeared to influence fluctuations?',
    instruction: 'Select all that apply.',
    // This section asks one thing before the bank: how much the month moved.
    choiceField: 'fluctuationLevel',
    choiceLabel: 'Were there fluctuations this month?',
    choiceOptions: SNAPSHOT_FLUCTUATION_LEVELS,
    tagField: 'fluctuationInfluenceTags',
    summaryField: 'fluctuationSummary',
    summaryLabel: 'Context or pattern summary:',
    options: [
      { key: 'stress', label: 'Stress' },
      { key: 'grief_or_loss', label: 'Grief or loss' },
      { key: 'health_changes', label: 'Health changes' },
      { key: 'pain_flare', label: 'Pain flare' },
      { key: 'routine_disruption', label: 'Routine disruption' },
      { key: 'sensory_overload', label: 'Sensory overload' },
      { key: 'burnout', label: 'Burnout' },
      { key: 'increased_demands', label: 'Increased demands' },
      { key: 'reduced_support_access', label: 'Reduced support access' },
      { key: 'sleep_disruption', label: 'Sleep disruption' },
      { key: 'environmental_changes', label: 'Environmental changes' },
      { key: 'life_events', label: 'Life events' },
      { key: 'other', label: 'Other' },
    ],
    note: 'This section helps preserve context and prevent fluctuations being interpreted without relational or environmental understanding.',
  },
  {
    key: 'recovery_trends',
    number: 7,
    title: 'Recovery and Sustainability Trends',
    question: 'What was noticeable about recovery, pacing, or sustainability this month?',
    instruction: 'Select all that apply.',
    tagField: 'recoveryTrendTags',
    summaryField: 'recoveryTrendsSummary',
    summaryLabel: 'Recovery and sustainability summary:',
    options: [
      { key: 'reduced_shutdown', label: 'Reduced shutdown frequency' },
      { key: 'faster_recovery', label: 'Faster recovery after stress' },
      { key: 'improved_pacing', label: 'Improved pacing' },
      { key: 'sustainable_participation', label: 'More sustainable participation' },
      { key: 'self_awareness', label: 'Improved self-awareness' },
      { key: 'earlier_help_seeking', label: 'Earlier help-seeking' },
      { key: 'reduced_exhaustion', label: 'Reduced emotional exhaustion' },
      { key: 'routine_maintenance', label: 'Improved routine maintenance' },
      { key: 'activity_recovery_balance', label: 'Better balance between activity and recovery' },
      { key: 'regulation_capacity', label: 'Increased regulation capacity' },
      { key: 'other', label: 'Other' },
    ],
    note: 'This section captures the often invisible cost of participation and support needs over time.',
  },
  {
    key: 'goal_mapping',
    number: 8,
    title: 'Goal and Participation Mapping',
    question: 'Which areas of ordinary life became more possible or more sustainable this month?',
    instruction: 'Select all that apply.',
    tagField: 'goalMappingTags',
    summaryField: 'goalMappingSummary',
    summaryLabel: 'Participation summary:',
    options: [
      { key: 'community_access', label: 'Community access' },
      { key: 'relationships', label: 'Relationships' },
      { key: 'parenting_caring', label: 'Parenting or caring roles' },
      { key: 'creativity_hobbies', label: 'Creativity or hobbies' },
      { key: 'exercise_movement', label: 'Exercise or movement' },
      { key: 'daily_routines', label: 'Daily routines' },
      { key: 'appointments', label: 'Appointments' },
      { key: 'education_learning', label: 'Education or learning' },
      { key: 'employment_microbusiness', label: 'Employment or microbusiness goals' },
      { key: 'independent_living', label: 'Independent living' },
      { key: 'emotional_wellbeing', label: 'Emotional wellbeing' },
      { key: 'social_participation', label: 'Social participation' },
      { key: 'other', label: 'Other' },
    ],
    note: 'This section exists to demonstrate meaningful participation outcomes rather than narrow compliance-based functioning.',
  },
  {
    key: 'quality_of_life',
    number: 9,
    title: 'Quality of Life Outcomes',
    question: 'What positive changes or outcomes were noticeable this month?',
    tagField: 'qualityOfLifeTags',
    summaryField: 'qualityOfLifeSummary',
    summaryLabel: 'Optional summary:',
    options: [
      { key: 'more_consistency', label: 'More consistency' },
      { key: 'improved_safety', label: 'Improved safety' },
      { key: 'reduced_overwhelm', label: 'Reduced overwhelm' },
      { key: 'increased_participation', label: 'Increased participation' },
      { key: 'reduced_isolation', label: 'Reduced isolation' },
      { key: 'improved_confidence', label: 'Improved confidence' },
      { key: 'improved_regulation', label: 'Improved regulation' },
      { key: 'increased_sustainability', label: 'Increased sustainability' },
      { key: 'improved_recovery', label: 'Improved recovery' },
      { key: 'improved_communication', label: 'Improved communication' },
      { key: 'improved_wellbeing', label: 'Improved wellbeing' },
      { key: 'other', label: 'Other' },
    ],
  },
];

export const SNAPSHOT_RELATIONAL_SECTION_KEYS = SNAPSHOT_RELATIONAL_SECTIONS.map(
  (section) => section.key
);

/** The relational sections' summary fields — free text, same rules as the layers'. */
export const SNAPSHOT_RELATIONAL_TEXT_KEYS = SNAPSHOT_RELATIONAL_SECTIONS.map(
  (section) => section.summaryField
);

/** Single-choice fields, each with the keys it accepts. */
export const SNAPSHOT_CHOICE_FIELDS = {
  participantInvolvement: SNAPSHOT_PARTICIPANT_INVOLVEMENT.map((option) => option.key),
  fluctuationLevel: SNAPSHOT_FLUCTUATION_LEVELS.map((option) => option.key),
};

export const SNAPSHOT_CHOICE_FIELD_KEYS = Object.keys(SNAPSHOT_CHOICE_FIELDS);

/** Every free-text field on the record: the layers' (C2–C7) and the relational summaries'. */
export const SNAPSHOT_FIELD_KEYS = [
  ...SNAPSHOT_LAYER_FIELD_KEYS,
  ...SNAPSHOT_RELATIONAL_TEXT_KEYS,
];

/** Every array-valued field, each with the keys it accepts. */
export const SNAPSHOT_TAG_FIELDS = {
  participationDomains: SNAPSHOT_PARTICIPATION_AREA_KEYS,
  outcomeTags: SNAPSHOT_OUTCOME_TAG_KEYS,
  approvalStatements: SNAPSHOT_APPROVAL_STATEMENTS.map((statement) => statement.key),
  ...Object.fromEntries(
    SNAPSHOT_RELATIONAL_SECTIONS.map((section) => [
      section.tagField,
      section.options.map((option) => option.key),
    ])
  ),
};

export const SNAPSHOT_TAG_FIELD_KEYS = Object.keys(SNAPSHOT_TAG_FIELDS);

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
    const allowedTags = SNAPSHOT_TAG_FIELDS[key];
    if (allowedTags) {
      if (value === undefined || value === null) continue;
      if (!Array.isArray(value) || value.some((tag) => !allowedTags.includes(tag))) {
        errors[key] = 'Contains an option that is not allowed.';
      } else if (new Set(value).size !== value.length) {
        errors[key] = 'The same option is listed twice.';
      }
      continue;
    }
    const allowedChoices = SNAPSHOT_CHOICE_FIELDS[key];
    if (allowedChoices) {
      if (isBlank(value)) continue;
      if (!allowedChoices.includes(value)) errors[key] = 'Not one of the allowed options.';
      continue;
    }
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

const snapshotLabelOf = (options, key) =>
  options.find((option) => option.key === key)?.label ?? key;

export const participationAreaLabel = (key) =>
  snapshotLabelOf(SNAPSHOT_PARTICIPATION_AREAS, key);
export const outcomeTagLabel = (key) => snapshotLabelOf(SNAPSHOT_OUTCOME_TAGS, key);
export const shareAudienceLabel = (key) => snapshotLabelOf(SNAPSHOT_SHARE_AUDIENCES, key);
export const participantInvolvementLabel = (key) =>
  snapshotLabelOf(SNAPSHOT_PARTICIPANT_INVOLVEMENT, key);
export const fluctuationLevelLabel = (key) => snapshotLabelOf(SNAPSHOT_FLUCTUATION_LEVELS, key);
export const approvalStatementLabel = (key) =>
  snapshotLabelOf(SNAPSHOT_APPROVAL_STATEMENTS, key);

/** One relational section's option label — `sectionKey` picks the bank. */
export function relationalTagLabel(sectionKey, key) {
  const section = SNAPSHOT_RELATIONAL_SECTIONS.find((entry) => entry.key === sectionKey);
  return section ? snapshotLabelOf(section.options, key) : key;
}

export const relationalSection = (key) =>
  SNAPSHOT_RELATIONAL_SECTIONS.find((section) => section.key === key) ?? null;

/**
 * Approval is the point of no return, so it is checked on both sides: a
 * snapshot must still be a draft, must carry the non-linear statement, and must
 * have been built from something — a snapshot generated from nothing is not
 * evidence of anything.
 *
 * "Something" is a submitted daily log *or* a check-in, because Template C is
 * "generated from Template A and B logs". A participant who wrote check-ins
 * through a month nobody else recorded still has a month worth approving.
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
  const sources =
    (snapshot.sourceLogIds?.length ?? 0) + (snapshot.sourceCheckInIds?.length ?? 0);
  if (sources < 1) {
    errors.push('This snapshot has no daily logs or check-ins behind it yet.');
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
