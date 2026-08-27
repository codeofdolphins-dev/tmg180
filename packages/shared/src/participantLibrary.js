/**
 * Participant Library — the readings a participant can open from the portal.
 *
 * Structure: Instructions.pdf (UI Drift Fix, 6 Jun 2026)
 * `library_information_architecture` — two tabs, "Core Library" and "Optional
 * Reading (collapsed)"; AI retrieval scope is the Core Library only. The
 * Master Document Map classes the documents below as DISPLAY content that
 * "goes inside the platform for workers and participants to read".
 *
 * Copy: every published body block is verbatim from its source document
 * (client document set, 27 Aug 2026; mirrors in md/sources-2026-08-27/). A
 * reading whose source is not yet fit for participant display carries
 * `status: 'awaiting_content'` and says so — nothing is written in its place.
 *
 * Block kinds: `h2` (a heading in the source), `p` (a paragraph), `list`
 * (the source's bullet or line list, items verbatim).
 */

export const PARTICIPANT_LIBRARIES = {
  CORE: 'core',
  OPTIONAL: 'optional',
};

export const PARTICIPANT_LIBRARY_TABS = [
  { key: PARTICIPANT_LIBRARIES.CORE, label: 'Core Library' },
  { key: PARTICIPANT_LIBRARIES.OPTIONAL, label: 'Optional Reading' },
];

export const PARTICIPANT_READING_STATUS = {
  PUBLISHED: 'published',
  AWAITING_CONTENT: 'awaiting_content',
};

const h2 = (text) => ({ kind: 'h2', text });
const p = (text) => ({ kind: 'p', text });
const list = (items) => ({ kind: 'list', items });

/**
 * CASE NOTE INTRODUCTION INSTRUCTIONS — "What participants and workers read
 * before completing any note … Goes in the Learning Hub and at the top of
 * every note screen" (Master Document Map #10). The closing section
 * "Relational Structure Guidance for Developers" is addressed to developers
 * and is not participant reading; it is left out here and nowhere else.
 */
const RELATIONAL_EVIDENCE_NOTES_BODY = [
  h2('Purpose of These Notes'),
  p('These notes are not about judging you.'),
  p('They are not about trying to “catch you out,” prove failure, or reduce your life to symptoms.'),
  p('They exist to help build a clearer picture over time of:'),
  list([
    'what everyday life actually feels like',
    'what support helps',
    'what becomes harder during stress, illness, overload, burnout, or change',
    'how your capacity fluctuates',
    'what recovery costs look like',
    'and what support makes participation possible',
  ]),
  p('The NDIS increasingly expects participants to understand and explain their own functional impacts over time.'),
  p('For many people, especially people with psychosocial disability, neurodivergence, trauma histories, chronic illness, pain, fatigue, or fluctuating capacity, this can be very difficult to explain from memory alone.'),
  p('These notes help build that picture gradually.'),
  p('Nothing here is about perfection.'),
  p('A harder day does not mean failure.'),
  p('Needing support does not mean you are doing something wrong.'),
  p('Improvement with support does not mean support is no longer needed.'),
  p('The goal is not to remove your voice.'),
  p('The goal is to help organise patterns over time so your experience becomes easier to understand, explain, and evidence when needed.'),

  h2('How These Notes Work'),
  p('Workers'),
  p('Workers complete a short structured support note after a session.'),
  p('The purpose is not to write long reports.'),
  p('The purpose is to capture:'),
  list([
    'what support was needed',
    'what affected the participant that day',
    'what support looked like',
    'what changed as a result',
    'and whether anything was different from usual patterns',
  ]),
  p('Notes should stay:'),
  list(['respectful', 'neutral', 'non-shaming', 'practical', 'and focused on impact first']),
  p('Avoid:'),
  list([
    'pathologising language',
    'assumptions',
    'judgment',
    'unnecessary clinical wording',
    'or writing “about” the participant rather than with respect to their experience',
  ]),
  p('Participants'),
  p('Participants may also complete check-ins or reflections if they wish.'),
  p('This is optional.'),
  p('You do not need to explain yourself perfectly.'),
  p('You are not expected to use professional language.'),
  p('Your own words matter.'),
  p('Over time, these notes can help identify:'),
  list([
    'recurring patterns',
    'triggers',
    'recovery costs',
    'support effectiveness',
    'participation changes',
    'and what helps maintain stability',
  ]),

  h2('Important Principles'),
  p('Capacity Can Fluctuate'),
  p('Some people have stable support needs.'),
  p('Others experience significant fluctuation depending on:'),
  list([
    'stress',
    'burnout',
    'sensory load',
    'pain',
    'fatigue',
    'trauma responses',
    'health',
    'environment',
    'or life events',
  ]),
  p('Fluctuation is real.'),
  p('A participant may:'),
  list(['appear capable one day', 'and need significantly more support another day.']),
  p('This does not automatically mean regression or lack of effort.'),
  p('Support Changes Outcomes'),
  p('If participation improves with support, this reflects support working.'),
  p('It does not automatically mean impairment has disappeared.'),
  p('Many participants can participate more consistently because:'),
  list([
    'support reduced recovery cost',
    'tasks were scaffolded',
    'overwhelm was reduced',
    'routines were stabilised',
    'or safety/support needs were met',
  ]),
  p('These notes help show that relationship over time.'),

  h2('Tone Expectations for All Notes'),
  p('Use:'),
  list([
    'everyday language',
    'impact-first descriptions',
    'relational wording',
    'participant dignity',
    'practical observations',
    'short structured responses',
  ]),
  p('Avoid:'),
  list([
    'diagnostic speculation',
    'labelling',
    'exaggerated language',
    'emotionally loaded wording',
    'deficit-only framing',
    'or language that removes participant autonomy',
  ]),
  p('Instead of:'),
  p('“participant was non-compliant”'),
  p('Use:'),
  p('“participant appeared overwhelmed and unable to continue the task today”'),
  p('Instead of:'),
  p('“participant failed to regulate emotions”'),
  p('Use:'),
  p('“participant became distressed during increased stress and required reduced demands and calm support”'),

  h2('What These Notes Build Over Time'),
  p('When completed consistently, these notes help create:'),
  list([
    'longitudinal evidence',
    'functional pattern tracking',
    'support frequency mapping',
    'recovery cost visibility',
    'fluctuation evidence',
    'sustainability tracking',
    'participation outcomes',
    'support effectiveness evidence',
    'and participant-owned summaries',
  ]),
  p('This means reassessments do not rely only on memory.'),
  p('The system gradually builds a clearer picture over time.'),
];

export const PARTICIPANT_READINGS = [
  {
    slug: 'relational-evidence-notes',
    library: PARTICIPANT_LIBRARIES.CORE,
    status: PARTICIPANT_READING_STATUS.PUBLISHED,
    title: 'TMG180 — Relational Evidence Notes',
    subtitle: 'Participant-Owned Longitudinal Support Mapping',
    source: 'CASE NOTE INTRODUCTION INSTRUCTIONS',
    /** The first line of the document, used as the card's one-line summary. */
    summary: 'These notes are not about judging you.',
    body: RELATIONAL_EVIDENCE_NOTES_BODY,
  },
  {
    slug: 'participant-information-and-rights',
    library: PARTICIPANT_LIBRARIES.CORE,
    status: PARTICIPANT_READING_STATUS.AWAITING_CONTENT,
    title: 'Participant and Public Information and Rights Statement',
    subtitle: 'Mandatory Policy 5',
    source: 'TMG180 Mandatory Policies Governance Controlled Manual v1.0 (21 June 2026)',
    summary:
      'What TMG180 is, what it is not, and what rights and limits apply to participants and the public.',
    body: null,
  },
  {
    slug: 'consent-and-information-handling',
    library: PARTICIPANT_LIBRARIES.CORE,
    status: PARTICIPANT_READING_STATUS.AWAITING_CONTENT,
    title: 'Consent and Information Handling',
    subtitle: 'Mandatory Policy 4',
    source: 'TMG180 Mandatory Policies Governance Controlled Manual v1.0 (21 June 2026)',
    summary:
      'How consent is obtained, recorded, respected and withdrawn, and how information is handled.',
    body: null,
  },
];

/**
 * Why two readings wait: the Mandatory Policies manual's own control block
 * says "Working Governance Draft — requires legal review, terminology review
 * and source-currency review before formal adoption", and its text uses a
 * term the Final Override bans from the interface. It is shown here once a
 * participant-facing edition is signed off, not before.
 */
export const PARTICIPANT_READING_AWAITING_NOTE =
  'This document is part of the TMG180 governance manual. Its participant-facing edition is being finalised and will appear here once it is signed off.';

export const PARTICIPANT_READING_SLUGS = PARTICIPANT_READINGS.map((reading) => reading.slug);

export const participantReading = (slug) =>
  PARTICIPANT_READINGS.find((reading) => reading.slug === slug) ?? null;

export const participantReadingsIn = (library) =>
  PARTICIPANT_READINGS.filter((reading) => reading.library === library);

/**
 * The blocks under one `h2` heading of a published reading — used to put the
 * relevant part of a reading at the top of a screen (Master Map #10: the
 * introduction sits "at the top of every note screen").
 */
export function participantReadingSection(slug, heading) {
  const reading = participantReading(slug);
  if (!reading?.body) return [];
  const start = reading.body.findIndex((block) => block.kind === 'h2' && block.text === heading);
  if (start < 0) return [];
  const rest = reading.body.slice(start + 1);
  const end = rest.findIndex((block) => block.kind === 'h2');
  return end < 0 ? rest : rest.slice(0, end);
}
