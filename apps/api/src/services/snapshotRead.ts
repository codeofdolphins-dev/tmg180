/**
 * The Monthly Snapshot's wire fields and the columns behind them — the one
 * place the camelCase and snake_case spellings meet.
 *
 * Three readers share it: the participant's own review and locked view
 * (`snapshot.controller.ts`), and whoever opens a share link
 * (`shareLink.controller.ts`). They must never disagree about which column a
 * field is, and a field added to Template C is added here once.
 */

/** Free text, C2–C7 plus the Monthly Relational Longitudinal Snapshot's summaries. */
export const SNAPSHOT_FIELD_COLUMNS = {
  participantStory: 'participant_story',
  whatMattered: 'what_mattered',
  whatGotInWay: 'what_got_in_way',
  whatHelped: 'what_helped',
  recoveryCost: 'recovery_cost',
  nextMonthIntentions: 'next_month_intentions',
  mainFunctionalImpacts: 'main_functional_impacts',
  frequencyPattern: 'frequency_pattern',
  recoveryCostTrend: 'recovery_cost_trend',
  supportsThatHelped: 'supports_that_helped',
  whenSupportUnavailable: 'when_support_unavailable',
  // Template C4 — the six NDIS functional domains a planner reads against.
  mobilitySummary: 'mobility_summary',
  communicationSummary: 'communication_summary',
  socialSummary: 'social_summary',
  selfCareSummary: 'selfcare_summary',
  learningSummary: 'learning_summary',
  selfManagementSummary: 'selfmanagement_summary',
  // C5 / C7.
  outcomeHighlights: 'outcome_highlights',
  impairmentCategory: 'impairment_category',
  impairmentLinkage: 'impairment_linkage',
  goalLinkage: 'goal_linkage',
  // Monthly Relational Longitudinal Snapshot, sections 3-9 — one summary each.
  participationTrendsSummary: 'participation_trends_summary',
  barriersSummary: 'barriers_summary',
  supportMediatedSummary: 'support_mediated_summary',
  fluctuationSummary: 'fluctuation_summary',
  recoveryTrendsSummary: 'recovery_trends_summary',
  goalMappingSummary: 'goal_mapping_summary',
  qualityOfLifeSummary: 'quality_of_life_summary',
} as const;

/** The array-valued fields — same trip through the reader, different type. */
export const SNAPSHOT_TAG_COLUMNS = {
  participationDomains: 'participation_domains',
  outcomeTags: 'outcome_tags',
  participationTrendTags: 'participation_trend_tags',
  barrierTags: 'barrier_tags',
  supportMediatedTags: 'support_mediated_tags',
  fluctuationInfluenceTags: 'fluctuation_influence_tags',
  recoveryTrendTags: 'recovery_trend_tags',
  goalMappingTags: 'goal_mapping_tags',
  qualityOfLifeTags: 'quality_of_life_tags',
  approvalStatements: 'approval_statements',
} as const;

/** Single-choice fields (sections 1 and 6). Blank clears them. */
export const SNAPSHOT_CHOICE_COLUMNS = {
  participantInvolvement: 'participant_involvement',
  fluctuationLevel: 'fluctuation_level',
} as const;

export type SnapshotWireField = keyof typeof SNAPSHOT_FIELD_COLUMNS;
export type SnapshotTagField = keyof typeof SNAPSHOT_TAG_COLUMNS;
export type SnapshotChoiceField = keyof typeof SNAPSHOT_CHOICE_COLUMNS;

type Row = Record<string, unknown>;

/** Every participant-written field of a snapshot row, on the wire. */
export function snapshotFields(row: object) {
  const record = row as Row;
  const text = Object.fromEntries(
    (Object.entries(SNAPSHOT_FIELD_COLUMNS) as [SnapshotWireField, string][]).map(
      ([wire, column]) => [wire, (record[column] as string | null | undefined) ?? '']
    )
  );
  const tags = Object.fromEntries(
    (Object.entries(SNAPSHOT_TAG_COLUMNS) as [SnapshotTagField, string][]).map(
      ([wire, column]) => [wire, (record[column] as string[] | null | undefined) ?? []]
    )
  );
  const choices = Object.fromEntries(
    (Object.entries(SNAPSHOT_CHOICE_COLUMNS) as [SnapshotChoiceField, string][]).map(
      ([wire, column]) => [wire, (record[column] as string | null | undefined) ?? '']
    )
  );
  return { ...text, ...tags, ...choices };
}
