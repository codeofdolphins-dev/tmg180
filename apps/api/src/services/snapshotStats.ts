import { prisma } from '../config/prisma.js';
import { toDay } from '../utils/dbDates.js';

/**
 * What a month's logs actually say — the numbers under every snapshot.
 *
 * Derived on read rather than stored: the source logs are locked once
 * submitted, so these counts cannot drift, and a locked snapshot keeps
 * reporting exactly the logs it was built from even if later ones are added to
 * the same month. Generation is deterministic, not AI: the numbers come from
 * counting what the logs say, and the narrative belongs to the participant.
 *
 * One derivation, two readers — the participant reviewing their own month
 * (`snapshot.controller.ts`) and a consented worker reading the approved one
 * (`workerSnapshot.controller.ts`) must never see different totals.
 */

export type SourceLog = {
  id: number;
  session_date: Date;
  duration_minutes: number | null;
  goal_ids: number[];
  domain_tags: string[];
  baseline_comparison: string | null;
};

/** The longest run of consecutive days logged — the frame's "consistency streak". */
export function longestStreak(days: string[]) {
  if (days.length === 0) return 0;
  const sorted = [...days].sort();
  const dayNumber = (day: string) => Math.floor(Date.parse(`${day}T00:00:00Z`) / 86_400_000);

  let longest = 1;
  let current = 1;
  for (let index = 1; index < sorted.length; index += 1) {
    const gap = dayNumber(sorted[index]!) - dayNumber(sorted[index - 1]!);
    current = gap === 1 ? current + 1 : 1;
    if (current > longest) longest = current;
  }
  return longest;
}

/** Re-reads the logs a snapshot was generated from, in the same order. */
export async function loadSourceLogs(ids: number[]) {
  if (ids.length === 0) return [];
  return prisma.dailyNoteStructured.findMany({
    where: { id: { in: ids } },
    orderBy: { session_date: 'desc' },
  });
}

export async function buildStats(logs: SourceLog[]) {
  const days = new Set(logs.map((log) => toDay(log.session_date)));
  const totalMinutes = logs.reduce((sum, log) => sum + (log.duration_minutes ?? 0), 0);

  const tally = (values: string[]) => {
    const counts: Record<string, number> = {};
    for (const value of values) counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  };

  const goalCounts: Record<number, number> = {};
  // Per goal, how the participant said those days compared with their usual
  // pattern. Their own answers, tallied — not an assessment of progress.
  const goalComparisons: Record<number, Record<string, number>> = {};
  for (const log of logs) {
    for (const goalId of log.goal_ids) {
      goalCounts[goalId] = (goalCounts[goalId] ?? 0) + 1;
      if (log.baseline_comparison) {
        goalComparisons[goalId] ??= {};
        goalComparisons[goalId]![log.baseline_comparison] =
          (goalComparisons[goalId]![log.baseline_comparison] ?? 0) + 1;
      }
    }
  }

  const goalRows = Object.keys(goalCounts).length
    ? await prisma.participantGoal.findMany({
        where: { id: { in: Object.keys(goalCounts).map(Number) } },
        orderBy: { goal_order: 'asc' },
      })
    : [];

  return {
    logsCount: logs.length,
    daysLogged: days.size,
    streakDays: longestStreak([...days] as string[]),
    totalMinutes,
    domains: tally(logs.flatMap((log) => log.domain_tags)),
    comparisons: tally(
      logs.map((log) => log.baseline_comparison).filter((value): value is string => Boolean(value))
    ),
    goals: goalRows.map((goal) => ({
      id: goal.id,
      text: goal.goal_text,
      logsCount: goalCounts[goal.id] ?? 0,
      comparisons: goalComparisons[goal.id] ?? {},
    })),
    firstSessionDate: toDay(logs.at(-1)?.session_date ?? null),
    lastSessionDate: toDay(logs.at(0)?.session_date ?? null),
  };
}

export type SnapshotStats = Awaited<ReturnType<typeof buildStats>>;

/** The stats for a snapshot, straight from the ids it was generated from. */
export const statsForSourceLogs = async (ids: number[]) => buildStats(await loadSourceLogs(ids));
