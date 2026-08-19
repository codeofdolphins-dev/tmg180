/**
 * Learning Hub — the modules and readings behind Figma 1169:3676 (the hub) and
 * 1170:8551 (one reading).
 *
 * **The Learning Hub content map is unwritten** (Gaps §4, MEDIUM: "module
 * structure/order/completion tracking are not specced… the frames show the
 * shape; content is Sue's"). So this file carries the shape the frames give —
 * five modules, two readings each, a Core Library / Optional Reading split —
 * and splits the readings in two:
 *
 *  - `status: 'published'` — readings about how *this platform* works (what a
 *    Daily Support Evidence Log has to carry, how a Monthly Snapshot is
 *    approved, what consent lets you see). Those are ours to write and are
 *    written from canon and the built screens. They still want Sue's sign-off
 *    on wording, the same way the Help Centre answers do.
 *  - `status: 'awaiting_content'` — the four canonical manuals (Mandatory
 *    Policies, Practice Standards, Support Interpretation, Relational
 *    Discipline). Those are Sue's documents. They appear in the hub because
 *    the frame lists them, they say plainly that the text is still to come,
 *    and nothing is invented in their place.
 *
 * Adding real content is a change to `body` and `status` here and nothing else.
 *
 * The Core Library / Optional Reading split is load-bearing, not decorative:
 * the frames state twice that AI retrieval only ever reads the Core Library.
 * No AI search is built yet; when it is, it filters on `library`.
 */

export const LEARNING_LIBRARIES = {
  CORE: 'core',
  OPTIONAL: 'optional',
};

export const LEARNING_LIBRARY_TABS = [
  { key: LEARNING_LIBRARIES.CORE, label: 'Core Library' },
  { key: LEARNING_LIBRARIES.OPTIONAL, label: 'Optional Reading' },
];

export const LEARNING_RESOURCE_STATUS = {
  PUBLISHED: 'published',
  AWAITING_CONTENT: 'awaiting_content',
};

/** The kinds the frame's module cards link to. */
export const LEARNING_RESOURCE_KINDS = [
  { key: 'manual', label: 'Full manual' },
  { key: 'quick_guide', label: 'Quick guide' },
  { key: 'explainer', label: 'Explainer' },
  { key: 'framework', label: 'Full framework' },
  { key: 'how_to', label: 'How-to guide' },
  { key: 'template', label: 'Template' },
];

export const LEARNING_RESOURCE_KIND_KEYS = LEARNING_RESOURCE_KINDS.map((kind) => kind.key);

export function learningKindLabel(key) {
  return LEARNING_RESOURCE_KINDS.find((kind) => kind.key === key)?.label ?? key;
}

export const LEARNING_MODULES = [
  {
    key: 'mandatory_policies',
    title: 'Mandatory Policies',
    blurb: 'Code of Conduct and worker safety.',
  },
  {
    key: 'practice_standards',
    title: 'Practice Standards',
    blurb: 'The standards your evidence is read against.',
  },
  {
    key: 'support_interpretation',
    title: 'Support Interpretation',
    blurb: 'Turning what happened into evidence language.',
  },
  {
    key: 'relational_discipline',
    title: 'Relational Discipline',
    blurb: 'The relational practice this platform is built on.',
  },
  {
    key: 'templates_how_to',
    title: 'Templates & How-to Guides',
    blurb: 'Practical tools for daily application.',
  },
];

export const LEARNING_MODULE_KEYS = LEARNING_MODULES.map((module) => module.key);

/**
 * `action` points a reading at the screen it is about; the web app maps the
 * target onto a route. `download` is a file the platform would serve — there
 * are none yet, and a reading with `download: null` renders its download
 * control switched off rather than pretending.
 */
export const LEARNING_RESOURCES = [
  // --- Sue's canonical documents — structure only, no invented text ---------
  {
    slug: 'mandatory-policies-manual',
    moduleKey: 'mandatory_policies',
    kind: 'manual',
    library: LEARNING_LIBRARIES.CORE,
    status: LEARNING_RESOURCE_STATUS.AWAITING_CONTENT,
    title: 'Mandatory Policies — full manual',
    summary: 'The Code of Conduct and worker safety policies in full.',
    readMinutes: null,
    updatedAt: null,
    body: null,
    download: null,
    action: { target: 'governance', label: 'Go to Governance Standing' },
  },
  {
    slug: 'mandatory-policies-quick-guide',
    moduleKey: 'mandatory_policies',
    kind: 'quick_guide',
    library: LEARNING_LIBRARIES.CORE,
    status: LEARNING_RESOURCE_STATUS.AWAITING_CONTENT,
    title: 'Mandatory Policies — quick guide',
    summary: 'The short version of the same policies.',
    readMinutes: null,
    updatedAt: null,
    body: null,
    download: null,
    action: null,
  },
  {
    slug: 'practice-standards-manual',
    moduleKey: 'practice_standards',
    kind: 'manual',
    library: LEARNING_LIBRARIES.CORE,
    status: LEARNING_RESOURCE_STATUS.AWAITING_CONTENT,
    title: 'Practice Standards — full manual',
    summary: 'The core support guidelines in full.',
    readMinutes: null,
    updatedAt: null,
    body: null,
    download: null,
    action: { target: 'governance', label: 'Go to Governance Standing' },
  },
  {
    slug: 'practice-standards-quick-guide',
    moduleKey: 'practice_standards',
    kind: 'quick_guide',
    library: LEARNING_LIBRARIES.CORE,
    status: LEARNING_RESOURCE_STATUS.AWAITING_CONTENT,
    title: 'Practice Standards — quick guide',
    summary: 'The standards at a glance.',
    readMinutes: null,
    updatedAt: null,
    body: null,
    download: null,
    action: null,
  },
  {
    slug: 'support-interpretation-quick-guide',
    moduleKey: 'support_interpretation',
    kind: 'quick_guide',
    library: LEARNING_LIBRARIES.CORE,
    status: LEARNING_RESOURCE_STATUS.AWAITING_CONTENT,
    title: 'Support Interpretation — quick guide',
    summary: 'Reading a support need and describing it accurately.',
    readMinutes: null,
    updatedAt: null,
    body: null,
    download: null,
    action: null,
  },
  {
    slug: 'support-interpretation-manual',
    moduleKey: 'support_interpretation',
    kind: 'manual',
    library: LEARNING_LIBRARIES.CORE,
    status: LEARNING_RESOURCE_STATUS.AWAITING_CONTENT,
    title: 'Support Interpretation — full manual',
    summary: 'The full interpretation framework.',
    readMinutes: null,
    updatedAt: null,
    body: null,
    download: null,
    action: null,
  },
  {
    slug: 'relational-discipline-explainer',
    moduleKey: 'relational_discipline',
    kind: 'explainer',
    library: LEARNING_LIBRARIES.CORE,
    status: LEARNING_RESOURCE_STATUS.AWAITING_CONTENT,
    title: 'Relational Discipline — explainer',
    summary: 'What relational practice asks of a support worker.',
    readMinutes: null,
    updatedAt: null,
    body: null,
    download: null,
    action: null,
  },
  {
    slug: 'relational-discipline-framework',
    moduleKey: 'relational_discipline',
    kind: 'framework',
    library: LEARNING_LIBRARIES.CORE,
    status: LEARNING_RESOURCE_STATUS.AWAITING_CONTENT,
    title: 'Relational Discipline — full framework',
    summary: 'The framework in full.',
    readMinutes: null,
    updatedAt: null,
    body: null,
    download: null,
    action: null,
  },

  // --- How this workspace works — ours to write ----------------------------
  {
    slug: 'daily-support-evidence-log-template',
    moduleKey: 'templates_how_to',
    kind: 'template',
    library: LEARNING_LIBRARIES.CORE,
    status: LEARNING_RESOURCE_STATUS.PUBLISHED,
    title: 'Daily Support Evidence Log template',
    summary:
      'The structure every log follows, and a worked example of each part filled in.',
    readMinutes: 5,
    updatedAt: '2026-08-19',
    download: null,
    action: { target: 'daily_log_new', label: 'Start a log' },
    body: {
      overview: [
        'The log form in this workspace is the template — there is no document to fill in and send. Each section exists because a plan reviewer, reading the record months later, has to be able to see what support was provided and what difference it made.',
        'Work through it in order. Everything except the optional context is asked for on every log, and a log cannot be submitted until it is linked to between one and three of the participant’s own goals and at least one functional domain.',
      ],
      steps: [
        {
          title: 'Session details',
          detail:
            'The date the support happened, and the start and end times. Log the day it happened, not the day you write it up.',
        },
        {
          title: 'Goals and functional domains',
          detail:
            'Link one to three of the participant’s goals — their own words, from their Personal Profile — and tick every area of daily functioning the session touched.',
        },
        {
          title: 'The three narratives',
          detail:
            'Function-first impacts (what was hard, and how), support delivered (what you did), and the outcome (what changed, or did not). Keep them separate; a reviewer reads them as three different questions.',
        },
        {
          title: 'Compared with their usual pattern',
          detail:
            'Say whether the support needed that day was typical, more, less, or simply different. Fluctuation is the point — a run of "more support needed" days is evidence, not a failure.',
        },
        {
          title: 'Context, and what stays private',
          detail:
            'Quote the participant in their own words if they said something that matters, and record any non-urgent safety observation. Your private reflections go in the private section and are never shared with anyone.',
        },
      ],
      example: {
        title: 'A worked example',
        lines: [
          'Date: 12/08/2026   Time: 09:30 – 12:00',
          'Goals: "Get to my art class on my own"  ·  "Manage my morning routine"',
          'Domains: Daily living · Mobility & transport · Social participation',
          '',
          'Function-first impacts:',
          '  Fatigue made the morning routine slower than usual; needed two rests',
          '  between dressing and leaving the house.',
          '',
          'Support delivered:',
          '  Prompted each step of the routine verbally rather than physically.',
          '  Travelled together on the 402; participant bought their own ticket.',
          '',
          'Outcome / participation snapshot:',
          '  Arrived 10 minutes late but stayed the full class and spoke to two',
          '  other members unprompted.',
          '',
          'Compared with usual pattern: More support needed',
          'Participant voice: "I was tired but I still wanted to go."',
        ],
      },
      notes: [
        'Once you submit a log it is locked. A correction is added as an addendum, which sits beside the original — the original is never rewritten.',
      ],
    },
  },
  {
    slug: 'writing-a-daily-support-evidence-log',
    moduleKey: 'templates_how_to',
    kind: 'how_to',
    library: LEARNING_LIBRARIES.CORE,
    status: LEARNING_RESOURCE_STATUS.PUBLISHED,
    title: 'Writing function-first support evidence',
    summary:
      'How to describe what happened so it reads as evidence, not as a diagnosis or a to-do list.',
    readMinutes: 6,
    updatedAt: '2026-08-19',
    download: null,
    action: { target: 'daily_logs', label: 'Open your logs' },
    body: {
      overview: [
        'Function-first means writing about what a person could do that day, what got in the way, and what support made a difference — not about a condition, and not about what you got through.',
        'The same sentence can be written three ways. Only one of them is evidence.',
      ],
      steps: [
        {
          title: 'Describe function, never a label',
          detail:
            'Not "client is non-verbal", but "used their communication board for every exchange; typed two full sentences without prompting".',
        },
        {
          title: 'Say what changed, not what you did',
          detail:
            '"Assisted with shopping" says nothing. "Walked the aisles together while they read each list item themselves — first time without me reading it out" is a support outcome.',
        },
        {
          title: 'Be specific about the support level',
          detail:
            'Verbal prompt, physical assistance, full support, supervision only. A reviewer needs to know how much, not just that support happened.',
        },
        {
          title: 'Write what a participant could read',
          detail:
            'Everything in the structured part of a log is visible to the participant. If a sentence would be uncomfortable to read about yourself, rewrite it.',
        },
        {
          title: 'Leave the interpretation to the record',
          detail:
            'Record the day. Patterns across days are what the Monthly Snapshot is for — you do not have to draw the conclusion in a single log.',
        },
      ],
      example: {
        title: 'The same session, three ways',
        lines: [
          '✗  "Client had a bad day due to their anxiety."',
          '     A label, and a judgement. No function, no support, no outcome.',
          '',
          '✗  "Completed shopping and cleaning."',
          '     A list of what got done. Says nothing about the participant.',
          '',
          '✓  "Crowds in the shopping centre meant we left the list unfinished.',
          '     Moved to the quieter side entrance and they completed the last',
          '     four items themselves. Needed more support than a usual Tuesday."',
        ],
      },
      notes: [
        'The writing helper on the log form is not switched on yet. When it is, it will only ever produce a draft for you to edit — nothing is ever submitted on your behalf.',
      ],
    },
  },
  {
    slug: 'monthly-snapshot-guidance',
    moduleKey: 'templates_how_to',
    kind: 'how_to',
    library: LEARNING_LIBRARIES.CORE,
    status: LEARNING_RESOURCE_STATUS.PUBLISHED,
    title: 'How Monthly Snapshots are compiled and approved',
    summary:
      'What the snapshot draws from your logs, who approves it, and why it can never be edited afterwards.',
    readMinutes: 5,
    updatedAt: '2026-08-19',
    download: null,
    action: { target: 'snapshots', label: 'View approved snapshots' },
    body: {
      overview: [
        'A Monthly Snapshot is compiled from the month’s submitted logs — the participant’s own and, where they have consented, their workers’. Nobody writes it from scratch, and nobody can add something to it that was not in a log.',
        'The participant reads the draft, changes anything that does not sound like them, and approves it. Only then does it lock.',
      ],
      steps: [
        {
          title: 'It is compiled, not authored',
          detail:
            'The evidence in a snapshot is only ever as good as the logs behind it. A month of thin logs makes a thin snapshot.',
        },
        {
          title: 'Every snapshot carries the fluctuation statement',
          detail:
            'Support needs are not linear, and the snapshot says so explicitly. A month that got harder is not a month that went wrong.',
        },
        {
          title: 'The participant approves it',
          detail:
            'It is their record. They can send it back, reword it, or leave it in draft. You cannot approve one on their behalf.',
        },
        {
          title: 'Once approved, it is locked',
          detail:
            'Anything found later is added as an addendum. Nothing in the approved text is ever rewritten — that is what makes the record hold up at a plan review.',
        },
        {
          title: 'You see it only with consent',
          detail:
            'An approved snapshot appears in your workspace only if that participant has shared snapshots with you, and disappears again if they withdraw that.',
        },
      ],
      example: null,
      notes: [],
    },
  },
  {
    slug: 'consent-and-what-you-can-see',
    moduleKey: 'templates_how_to',
    kind: 'how_to',
    library: LEARNING_LIBRARIES.CORE,
    status: LEARNING_RESOURCE_STATUS.PUBLISHED,
    title: 'Consent, and what you can see',
    summary:
      'Which parts of a participant’s record open to you, who decides, and what happens when they change their mind.',
    readMinutes: 4,
    updatedAt: '2026-08-19',
    download: null,
    action: { target: 'participants', label: 'Participants I support' },
    body: {
      overview: [
        'A participant’s record is theirs. You reach parts of it because they granted consent, and consent is granted per person, per permission — never in bulk, never by the platform on their behalf.',
        'Four separate permissions exist, and a participant may grant any combination of them.',
      ],
      steps: [
        {
          title: 'Their Personal Profile',
          detail:
            'What they want you to know about how they communicate, what a good day looks like, and what support they want. Without this permission, their profile stays closed to you.',
        },
        {
          title: 'Adding a Daily Support Evidence Log',
          detail:
            'Whether you may add evidence to their record. Without it, you cannot start a log for that person at all.',
        },
        {
          title: 'Their Monthly Snapshots',
          detail:
            'Approved, locked snapshots only. Never a draft — a draft belongs to the participant until they approve it.',
        },
        {
          title: 'Their check-ins',
          detail:
            'Their own short entries about how they are going, where they have chosen to share them.',
        },
        {
          title: 'Withdrawal is immediate, and needs no reason',
          detail:
            'Access closes the moment consent is withdrawn. Logs you already wrote stay in the record — they are evidence — but the participant’s information closes to you.',
        },
      ],
      example: null,
      notes: [
        'If a screen tells you access is not available, that is a participant’s decision, not a fault. There is nothing to appeal and no one to ask on the platform.',
      ],
    },
  },
  {
    slug: 'keeping-your-governance-standing-current',
    moduleKey: 'templates_how_to',
    kind: 'how_to',
    library: LEARNING_LIBRARIES.CORE,
    status: LEARNING_RESOURCE_STATUS.PUBLISHED,
    title: 'Keeping your Governance Standing current',
    summary:
      'What Governance Standing tracks, how acknowledgements work, and why nothing there is a rating.',
    readMinutes: 4,
    updatedAt: '2026-08-19',
    download: null,
    action: { target: 'governance', label: 'Open Governance Standing' },
    body: {
      overview: [
        'Governance Standing is your own record of two things: the dated credentials you hold, and the platform items you have read and confirmed. It is held in your account and is not a score, a ranking, or something a participant sees.',
      ],
      steps: [
        {
          title: 'Credentials are dated, not judged',
          detail:
            'Record the issue and expiry dates you hold. Standing is worked out from the expiry date every time the screen loads, so it can never say "up to date" about a document that has lapsed.',
        },
        {
          title: '"Needs review" means you have not told us yet',
          detail:
            'It is not a finding against you. A credential with no dates recorded simply has nothing to check.',
        },
        {
          title: 'Acknowledgements are per version',
          detail:
            'When a document is published in a new version, the item returns to your list. Your earlier confirmation stays in its history — nothing is overwritten.',
        },
        {
          title: 'Personal notes stay private',
          detail:
            'The note on each item is yours. It is not part of the acknowledgement and nobody else can read it.',
        },
      ],
      example: null,
      notes: [],
    },
  },
  {
    slug: 'your-worker-profile-and-the-directory',
    moduleKey: 'templates_how_to',
    kind: 'how_to',
    library: LEARNING_LIBRARIES.CORE,
    status: LEARNING_RESOURCE_STATUS.PUBLISHED,
    title: 'Your profile, and appearing in the directory',
    summary:
      'What a participant sees on your profile, and why publishing is always your choice.',
    readMinutes: 5,
    updatedAt: '2026-08-19',
    download: null,
    action: { target: 'profile', label: 'Edit your profile' },
    body: {
      overview: [
        'Participants browse verified workers and contact whoever they choose. Nobody is allocated, ranked or paired by the platform — the directory is a list of people who chose to appear on it, in alphabetical order.',
        'Your workspace works fully whether you publish or not. Publishing is opt-in, and you can withdraw at any time.',
      ],
      steps: [
        {
          title: 'Write it as yourself',
          detail:
            'The profile prompts ask about how you work with people, not about qualifications. A participant is deciding whether you are someone they could get along with.',
        },
        {
          title: 'Say what you bring, plainly',
          detail:
            'Concrete beats impressive: "I am comfortable with long silences" tells a participant more than "excellent communication skills".',
        },
        {
          title: 'Keep availability honest',
          detail:
            'The grid is a guide to when you generally work, not a booking system. There is no booking or rostering anywhere on TMG180.',
        },
        {
          title: 'Publish when you are ready',
          detail:
            'You opt in, and you can unpublish at any time. Nothing in your workspace depends on it.',
        },
      ],
      example: null,
      notes: [],
    },
  },
];

export const LEARNING_RESOURCE_SLUGS = LEARNING_RESOURCES.map((resource) => resource.slug);

export function learningResource(slug) {
  return LEARNING_RESOURCES.find((resource) => resource.slug === slug) ?? null;
}

export function learningModule(key) {
  return LEARNING_MODULES.find((module) => module.key === key) ?? null;
}

export function resourcesInModule(moduleKey) {
  return LEARNING_RESOURCES.filter((resource) => resource.moduleKey === moduleKey);
}

export function resourcesInLibrary(library) {
  return LEARNING_RESOURCES.filter((resource) => resource.library === library);
}

/**
 * Up to three other readings to offer at the foot of one. Same module first,
 * then anything else published — a reading whose text is still to come is
 * never suggested as somewhere to go next.
 */
export function relatedResources(slug, limit = 3) {
  const resource = learningResource(slug);
  if (!resource) return [];
  const published = LEARNING_RESOURCES.filter(
    (other) => other.slug !== slug && other.status === LEARNING_RESOURCE_STATUS.PUBLISHED
  );
  const sameModule = published.filter((other) => other.moduleKey === resource.moduleKey);
  const rest = published.filter((other) => other.moduleKey !== resource.moduleKey);
  return [...sameModule, ...rest].slice(0, limit);
}

/** What the hub header counts, over a list of resources carrying `progress`. */
export function learningSummary(resources = []) {
  const counts = { total: resources.length, published: 0, awaitingContent: 0, completed: 0, saved: 0 };
  for (const resource of resources) {
    if (resource.status === LEARNING_RESOURCE_STATUS.PUBLISHED) counts.published += 1;
    else counts.awaitingContent += 1;
    if (resource.progress?.completedAt) counts.completed += 1;
    if (resource.progress?.savedAt) counts.saved += 1;
  }
  return counts;
}

/** PATCH /worker/learning/resources/:slug accepts these and nothing else. */
export function validateLearningProgress(fields = {}) {
  const errors = {};
  for (const key of ['saved', 'completed']) {
    const value = fields[key];
    if (value === undefined) continue;
    if (typeof value !== 'boolean') errors[key] = 'Expected true or false.';
  }
  if (fields.saved === undefined && fields.completed === undefined) {
    errors.fields = 'Nothing to change.';
  }
  return errors;
}
