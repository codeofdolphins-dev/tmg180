/**
 * Worker Governance Standing — the items behind Figma 1169:3916 (the standing
 * screen) and 1170:7877 (one item's detail).
 *
 * Two halves make up a worker's standing:
 *  - **credentials** (workerCredentials.js) — dated documents the worker holds,
 *    status derived from the expiry date;
 *  - **governance items** (here) — the acknowledgements, documents and
 *    readiness steps the platform asks a worker to read and confirm.
 *
 * The item catalogue is content, so it lives in shared config the same way
 * PROFILE_SECTIONS and WORKER_CREDENTIAL_TYPES do, not in a table: the five
 * items are the ones the frame names, and their wording describes what TMG180
 * actually does today. **Which items exist, their wording and their version
 * numbers are Sue's to rule on before launch** — the governance register is
 * listed as unwritten in the Gaps analysis. Changing this array is the whole
 * change.
 *
 * Acknowledgement is **per version and append-only**: `currentVersion` is what
 * the platform asks for now, a worker's acknowledgement records the version
 * they read, and bumping a version here moves everyone who acknowledged the
 * old one to "Needs review" while their earlier confirmation stays in history.
 * Nothing is ever edited or deleted. Standing is never a score or a rating —
 * an item is confirmed, waiting, or not started, and that is all.
 */

export const GOVERNANCE_GROUPS = [
  {
    key: 'acknowledgement',
    label: 'Required Acknowledgements',
    blurb: 'Read and confirm — once for each published version.',
  },
  {
    key: 'document',
    label: 'Document Status',
    blurb: 'The documents that set the shared standards for your practice.',
  },
  {
    key: 'readiness',
    label: 'Professional Readiness',
    blurb: 'Foundation steps for working independently on the platform.',
  },
];

export const GOVERNANCE_GROUP_KEYS = GOVERNANCE_GROUPS.map((group) => group.key);

/**
 * `cadence` is why an item can come back: `on_update` returns when a new
 * version is published, `annual` is re-confirmed each year, `once` never
 * returns unless its version changes.
 */
export const GOVERNANCE_CADENCE = {
  ONCE: 'once',
  ANNUAL: 'annual',
  ON_UPDATE: 'on_update',
};

export const GOVERNANCE_ITEMS = [
  {
    key: 'privacy_data_handling',
    group: 'acknowledgement',
    title: 'Privacy & Data Handling Acknowledgement',
    summary: 'How participant information is held, shared and protected.',
    cadence: GOVERNANCE_CADENCE.ANNUAL,
    currentVersion: 'v1',
    confirmation: 'I acknowledge how participant information is handled',
    overview:
      'Everything you can see about a participant is theirs, not yours, and reaches you only because they chose to share it. Consent decides what you can open — their Personal Profile, their Monthly Snapshots, whether you can add a Daily Support Evidence Log — and a participant can change or withdraw any of it at any time, without telling you why. Confirming this item records that you understand that arrangement.',
    points: [
      'A participant grants access, sets what it covers, and can withdraw it at any time.',
      'Your private notes stay yours; the structured part of a log is what the participant sees.',
      'Once a log or snapshot is approved it is never edited — corrections are added as an addendum.',
      'Take participant information no further than the support it was shared for.',
    ],
    resourceSlug: 'consent-and-what-you-can-see',
  },
  {
    key: 'incident_complaint_process',
    group: 'acknowledgement',
    title: 'Incident and Complaint Process',
    summary: 'Annual acknowledgement required.',
    cadence: GOVERNANCE_CADENCE.ANNUAL,
    currentVersion: 'v1',
    confirmation: 'I acknowledge the incident and complaint process',
    // The worker-facing incident pathway itself is backlog M-05 — this item
    // records the acknowledgement the frame asks for and says plainly that the
    // reporting route is not on the platform yet.
    overview:
      'Reporting obligations sit with you as an independent worker and run through the existing external channels — the NDIS Commission and, where one applies, the participant’s own provider. TMG180 does not receive, triage or hold incident reports, and there is no reporting form in this workspace. A safety observation that is not urgent can be recorded in the Safety note on a Daily Support Evidence Log; anything urgent goes to the proper channel first.',
    points: [
      'Urgent matters go to the appropriate external channel immediately — not into a log.',
      'A non-urgent safety observation belongs in the Safety note on that day’s log.',
      'Complaints from a participant about your support are theirs to raise wherever they choose.',
      'This workspace is a record of evidence, not a reporting channel.',
    ],
    resourceSlug: null,
  },
  {
    key: 'mandatory_policies',
    group: 'document',
    title: 'Mandatory Policies',
    summary: 'Code of Conduct, Worker Safety.',
    cadence: GOVERNANCE_CADENCE.ON_UPDATE,
    currentVersion: 'v1',
    confirmation: 'I acknowledge these policies',
    // Verbatim from frame 1170:7877 (its "excellent care" reads as clinical in
    // a relational product, so it says support).
    overview:
      'This acknowledgment is a gentle reminder of the shared agreements that help keep our practice environment safe, supportive, and aligned with professional standards. Reviewing these policies annually ensures we are all working with the same foundational understanding, allowing you to focus fully on providing excellent support. Take your time to review the updated guidelines below.',
    points: [
      'The Code of Conduct sets how support is offered, not what a person must accept.',
      'Worker safety runs both ways — yours and the participant’s.',
      'Read the full manual in the Learning Hub before you confirm.',
    ],
    resourceSlug: 'mandatory-policies-manual',
  },
  {
    key: 'practice_standards',
    group: 'document',
    title: 'Practice Standards',
    summary: 'Core support guidelines.',
    cadence: GOVERNANCE_CADENCE.ON_UPDATE,
    currentVersion: 'v1',
    confirmation: 'I acknowledge these practice standards',
    overview:
      'The practice standards describe how support is offered on TMG180: function-first, relational, and written in language a participant would recognise as being about them. They are the standards your Daily Support Evidence Logs and Monthly Snapshots are read against.',
    points: [
      'Describe function and impact — what changed, what helped — never a diagnosis.',
      'A participant’s own voice is quoted, never written for them.',
      'Evidence is built from what happened, not from what was planned.',
    ],
    resourceSlug: 'practice-standards-manual',
  },
  {
    key: 'onboarding_pathway',
    group: 'readiness',
    title: 'Worker Onboarding Pathway',
    summary: 'Foundation training modules.',
    cadence: GOVERNANCE_CADENCE.ONCE,
    currentVersion: 'v1',
    confirmation: 'I have worked through the onboarding pathway',
    overview:
      'The onboarding pathway is the short set of readings that gets you working confidently in this workspace: what a Daily Support Evidence Log has to carry, how a Monthly Snapshot is compiled and approved, and what consent lets you see. Completing it is what publishing your profile to the directory asks for — it never gates your own workspace.',
    points: [
      'Work through the Core Library readings in the Learning Hub.',
      'Your workspace, logs and calendar are open to you from day one either way.',
      'Publishing your profile to the participant directory stays entirely your choice.',
    ],
    resourceSlug: 'writing-a-daily-support-evidence-log',
  },
];

export const GOVERNANCE_ITEM_KEYS = GOVERNANCE_ITEMS.map((item) => item.key);

export const GOVERNANCE_ITEM_STATUS = {
  /** The current version is acknowledged. */
  CONFIRMED: 'confirmed',
  /** An earlier version was acknowledged; a newer one is published. */
  NEEDS_REVIEW: 'needs_review',
  /** Never acknowledged. */
  NOT_STARTED: 'not_started',
};

const STATUS_LABELS = {
  [GOVERNANCE_ITEM_STATUS.CONFIRMED]: 'Completed',
  [GOVERNANCE_ITEM_STATUS.NEEDS_REVIEW]: 'Needs review',
  [GOVERNANCE_ITEM_STATUS.NOT_STARTED]: 'Not completed yet',
};

export function governanceItemStatusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}

export function governanceItem(key) {
  return GOVERNANCE_ITEMS.find((item) => item.key === key) ?? null;
}

export function governanceGroup(key) {
  return GOVERNANCE_GROUPS.find((group) => group.key === key) ?? null;
}

/**
 * One item's standing, from that item's acknowledgement rows (any order).
 * Each row is `{ version, acknowledgedAt }`.
 */
export function governanceItemStatus(item, acknowledgements = []) {
  const rows = [...acknowledgements].sort((a, b) =>
    String(b.acknowledgedAt ?? '').localeCompare(String(a.acknowledgedAt ?? ''))
  );
  const current = rows.find((row) => row.version === item.currentVersion) ?? null;
  const latest = rows[0] ?? null;

  if (current) {
    return {
      status: GOVERNANCE_ITEM_STATUS.CONFIRMED,
      acknowledgedAt: current.acknowledgedAt,
      acknowledgedVersion: current.version,
    };
  }
  if (latest) {
    return {
      status: GOVERNANCE_ITEM_STATUS.NEEDS_REVIEW,
      acknowledgedAt: latest.acknowledgedAt,
      acknowledgedVersion: latest.version,
    };
  }
  return { status: GOVERNANCE_ITEM_STATUS.NOT_STARTED, acknowledgedAt: null, acknowledgedVersion: null };
}

/**
 * The numbers the three summary cards show. Standing counts governance items
 * and credentials together because that is what the screen calls "readiness" —
 * and it is a count of what is in order, never a grade.
 */
export function governanceStanding(items = [], credentials = { total: 0, upToDate: 0, next: null }) {
  const counts = { total: items.length, confirmed: 0, needsReview: 0, notStarted: 0 };
  for (const item of items) {
    if (item.status === GOVERNANCE_ITEM_STATUS.CONFIRMED) counts.confirmed += 1;
    else if (item.status === GOVERNANCE_ITEM_STATUS.NEEDS_REVIEW) counts.needsReview += 1;
    else counts.notStarted += 1;
  }
  const inOrder = counts.confirmed + (credentials.upToDate ?? 0);
  const total = counts.total + (credentials.total ?? 0);
  return {
    items: counts,
    /** Items you have not confirmed yet — what "Awaiting review" counts. */
    awaitingReview: counts.needsReview + counts.notStarted,
    readiness: { inOrder, total },
    allInOrder: total > 0 && inOrder === total,
    nextRenewal: credentials.next ?? null,
  };
}

export const GOVERNANCE_NOTE_LIMIT = 2000;

/** A personal note is private to the worker and may be cleared. */
export function validateGovernanceNote(note) {
  if (note == null || note === '') return {};
  if (typeof note !== 'string') return { note: 'A note must be text.' };
  if (note.length > GOVERNANCE_NOTE_LIMIT) {
    return { note: `Keep your note under ${GOVERNANCE_NOTE_LIMIT} characters.` };
  }
  return {};
}
