/**
 * Goal Link Helper — TMG180 Goal Link Helper Pack v1 (3 June 2026; client
 * document set 27 Aug 2026, mirrored in md/sources-2026-08-27/).
 *
 * The one-page spec: "Every Support Evidence Log must link to: (1) at least one
 * participant goal, and (2) a budget bucket (Core/Capacity/Capital). Optional:
 * add 1–2 R&N rationale tags (plain-language) … Load the Goal Link Helper
 * table as reference data … Use as autocomplete suggestions; do not force
 * perfect matches … if tmg_functional_grouping selected, prefill suggested
 * ndis_bucket_default and suggested rn_rationale_tags. Allow user override of
 * bucket and tags (audit: store what was selected)."
 *
 * The rows below are the pack's Postgres seed
 * (TMG180_Goal_Link_Helper_schema_and_seed_postgres_v1.sql), verbatim; the
 * same rows seed `tmg_goal_link_helper` so the table and this contract can
 * never disagree. Column names map: support_domain_code → code,
 * ndis_support_domain → domain, tmg_functional_grouping → grouping,
 * ndis_bucket_default → bucketDefault, includes_examples → examples,
 * common_goal_links_plain → goalLinks, functional_barrier_plain → barrier,
 * rn_rationale_tags (semicolon list) → rationaleTags.
 */

export const NDIS_BUCKETS = [
  { key: 'CORE', label: 'Core' },
  { key: 'CAPACITY_BUILDING', label: 'Capacity Building' },
  { key: 'CAPITAL', label: 'Capital' },
];

export const NDIS_BUCKET_KEYS = NDIS_BUCKETS.map((bucket) => bucket.key);

export const bucketLabel = (key) => NDIS_BUCKETS.find((bucket) => bucket.key === key)?.label ?? key;

const row = (code, domain, grouping, bucketDefault, examples, goalLinks, barrier, tags) => ({
  code,
  domain,
  grouping,
  bucketDefault,
  examples,
  goalLinks,
  barrier,
  rationaleTags: tags.split(';'),
});

export const GOAL_LINK_HELPER = [
  row('DL_HOME_ENV', 'Daily Living', 'Home & Environment', 'CORE', 'Household tasks, cleaning, organisation, safety', 'Maintain a safe and usable home; reduce overwhelm and shutdown; sustain routine', 'Functional capacity to maintain safe living environment; fatigue/overwhelm impacts task initiation/completion', 'safety_stability;daily_living_sustainability;reduce_overwhelm'),
  row('DL_FOOD_NUTR', 'Daily Living', 'Food & Daily Nutrition', 'CORE', 'Meal prep, food planning, eating routines', 'Maintain nutrition routines; reduce overwhelm; support health stability', 'Functional capacity to plan/prepare meals; regulation and energy constraints', 'daily_living_sustainability;health_wellbeing;reduce_overwhelm'),
  row('DL_PERSONAL_CARE', 'Daily Living', 'Personal Care', 'CORE', 'Showering, dressing, hygiene, toileting', 'Maintain hygiene and dignity; safety; sustain independence at home', 'Functional limitations in self-care tasks; requires assistance for safety/dignity', 'safety_stability;daily_living_sustainability;independence'),
  row('DL_ROUTINE_STRUCT', 'Daily Living', 'Daily Structure & Routine', 'CORE', 'Get up/bed, structuring day, reminders/prompting', 'Stabilise daily rhythm; prevent collapse/burnout; sustain participation', 'Fluctuating capacity/executive function affects routine; support enables consistency', 'daily_living_sustainability;prevent_regression;sustain_participation'),
  row('DL_COMM_TASKS', 'Daily Living', 'Community Tasks', 'CORE', 'Shopping, errands, appointments', 'Access essentials; maintain health/appointments; reduce barriers to leaving home', 'Functional capacity to complete tasks outside home; anxiety/overwhelm/fatigue barriers', 'participation_access;safety_stability;reduce_barriers'),
  row('DL_LIFE_ADMIN', 'Daily Living', 'Life Administration', 'CORE', 'Paperwork, organising daily life, basic planning', 'Keep life functioning; reduce crisis; support decision-making', 'Executive function/cognitive load barriers impact admin; support reduces overload', 'reduce_overwhelm;independence;safety_stability'),
  row('SC_LEAVING_HOME', 'Social & Community', 'Leaving the House / Showing Up', 'CORE', 'Getting out, attending appts/activities, being present', 'Increase participation; reduce avoidance; access community life', 'Anxiety/overwhelm/shutdown limit leaving home; graded support enables access', 'participation_access;reduce_barriers;prevent_regression'),
  row('SC_SOCIAL_CONN', 'Social & Community', 'Social Interaction & Connection', 'CORE', 'Conversation, relationships, trust building', 'Build/maintain relationships; reduce isolation; feel safe with people', 'Social anxiety/misinterpretation/emotional safety barriers; support scaffolds interaction', 'belonging_connection;participation_access;emotional_safety'),
  row('SC_ACTIVITIES', 'Social & Community', 'Participation in Activities', 'CORE', 'Hobbies, groups, recreation, structured activities', 'Meaningful activity; community inclusion; identity and purpose', 'Overwhelm/motivation/fear of failure limits engagement; support sustains participation', 'purpose_identity;belonging_connection;sustain_participation'),
  row('SC_NAVIGATION', 'Social & Community', 'Community Navigation', 'CORE', 'Access services, navigate environments, decisions', 'Navigate supports/services; reduce decision paralysis; increase independence', 'Cognitive overload/confusion impairs navigation; support enables decision-making', 'independence;reduce_overwhelm;participation_access'),
  row('SC_EMOT_SAFETY_PUBLIC', 'Social & Community', 'Emotional Safety in Public Spaces', 'CORE', 'Managing triggers and unpredictability outside home', 'Feel safe outside home; reduce escalation; sustain access to life', 'Nervous system regulation barriers; support provides co-regulation/safety planning', 'emotional_safety;safety_stability;participation_access'),
  row('SC_FOLLOW_THROUGH', 'Social & Community', 'Consistency & Follow-Through', 'CORE', 'Returning to activities, maintaining engagement', 'Sustain participation; reduce drop-out/burnout; build stability', 'Fatigue/overwhelm/fluctuation impact follow-through; support sustains consistency', 'sustain_participation;prevent_regression;daily_living_sustainability'),
  row('CB_LEARNING_SKILLS', 'Capacity Building', 'Learning & Skill Development', 'CAPACITY_BUILDING', 'Learning computer/daily life skills; guided learning', 'Build skills at a sustainable pace; increase confidence; reduce avoidance', 'Overwhelm/frustration tolerance/cognitive fatigue limits learning; paced support stabilises function so skills can develop', 'capacity_building;reduce_overwhelm;sustain_participation'),
  row('CB_EMPLOY_PURPOSE', 'Capacity Building', 'Employment & Purpose', 'CAPACITY_BUILDING', 'Work readiness, microbusiness, purposeful routine', 'Build purpose; economic/social participation; sustain routine', 'Consistency/anxiety/burnout/capacity fluctuation barriers; support builds sustainable participation', 'purpose_identity;capacity_building;sustain_participation'),
  row('CB_EXEC_FUNCTION', 'Capacity Building', 'Cognitive & Executive Function', 'CAPACITY_BUILDING', 'Planning, organising, follow-through, decision making', 'Increase independence and follow-through; reduce paralysis', 'Executive dysfunction/overload impairs initiation/completion; support scaffolds steps and decisions', 'capacity_building;independence;reduce_overwhelm'),
  row('CB_EMOT_REG', 'Capacity Building', 'Emotional Regulation & Stability', 'CAPACITY_BUILDING', 'Co-regulation, coping, resilience', 'Stabilise mood/response; reduce escalation; increase capacity over time', 'Nervous system regulation/trauma responses affect function; support improves stability and safety', 'emotional_safety;safety_stability;capacity_building'),
  row('CB_ROUTINE_LIFE_STRUCT', 'Capacity Building', 'Routine, Consistency & Life Structure', 'CAPACITY_BUILDING', 'Habits, routines, consistency', 'Sustain routines; reduce burnout; increase stability', 'Energy fluctuation/burnout/loss of momentum; support stabilises foundation for progress', 'daily_living_sustainability;prevent_regression;capacity_building'),
  row('CB_HEALTH_WELLBEING', 'Capacity Building', 'Health & Wellbeing', 'CAPACITY_BUILDING', 'Lifestyle stability, stress load, fatigue management', 'Maintain wellbeing; reduce stress load; sustain participation', 'Fatigue/stress reduces capacity; supports conserve energy and maintain health routines', 'health_wellbeing;sustain_participation;daily_living_sustainability'),
  row('CB_RELATIONSHIPS', 'Capacity Building', 'Relationships & Interpersonal Functioning', 'CAPACITY_BUILDING', 'Communication, boundaries, relational patterns', 'Build safe relationships; improve communication; reduce conflict patterns', 'Trust/safety/emotional regulation barriers; support scaffolds communication and boundary skills', 'belonging_connection;capacity_building;emotional_safety'),
];

export const GOAL_LINK_HELPER_CODES = GOAL_LINK_HELPER.map((entry) => entry.code);

export const goalLinkHelperEntry = (code) =>
  GOAL_LINK_HELPER.find((entry) => entry.code === code) ?? null;

/** The pack's prefill rule: a grouping suggests a bucket and its rationale tags. */
export const goalLinkSuggestions = (code) => {
  const entry = goalLinkHelperEntry(code);
  return entry ? { bucket: entry.bucketDefault, rationaleTags: entry.rationaleTags } : null;
};

/** Every rationale tag the table uses, in first-seen order. Keys are the table's own. */
export const RN_RATIONALE_TAG_KEYS = [
  ...new Set(GOAL_LINK_HELPER.flatMap((entry) => entry.rationaleTags)),
];

/** The tag keys are the pack's identifiers; shown with spaces, nothing more. */
export const rnRationaleTagLabel = (tag) => {
  const words = String(tag).replace(/_/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
};

export const RN_RATIONALE_TAGS = RN_RATIONALE_TAG_KEYS.map((key) => ({
  key,
  label: rnRationaleTagLabel(key),
}));
