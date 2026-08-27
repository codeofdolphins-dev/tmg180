import { prisma } from '../config/prisma.js';
import { ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * The goals a daily log can link to.
 *
 * Goals are derived from the Personal Profile's Participant Goals table
 * (Support Needs Tool v4 → profile section `goals`, question `goals`: one
 * row per goal, its `goal` cell "in their own words"). Answers stored under
 * the earlier shape — `primary_aspiration` + `goal_steps` — are still read
 * after the table, so nothing already recorded stops resolving. Deriving keeps
 * one source of truth: goals are edited in the profile, never here, and the
 * evidence chain still reads a real goal row with a stable id that a submitted
 * log can point at forever.
 *
 * The sync is idempotent. A goal whose text is still in the profile keeps its
 * id; one that has been rewritten or removed is deactivated rather than
 * deleted, so a log submitted against it still resolves.
 */

export const GOALS_SECTION_KEY = 'goals';
const MAX_GOALS = 41; // 20 table rows + the legacy aspiration and its 20 steps

type Answer = { question_key: string; value: unknown };

/** [...table goals, legacy aspiration, ...legacy steps] — trimmed, de-duplicated, in profile order. */
function deriveGoalTexts(answers: Answer[]) {
  const byKey = new Map(answers.map((answer) => [answer.question_key, answer.value]));
  const rows = byKey.get('goals');
  const aspiration = byKey.get('primary_aspiration');
  const steps = byKey.get('goal_steps');

  const texts: string[] = [];
  if (Array.isArray(rows)) {
    for (const row of rows) {
      const goal = (row as { goal?: unknown })?.goal;
      if (typeof goal === 'string') texts.push(goal);
    }
  }
  if (typeof aspiration === 'string') texts.push(aspiration);
  if (Array.isArray(steps)) {
    for (const step of steps) {
      const text = (step as { text?: unknown })?.text;
      if (typeof text === 'string') texts.push(text);
    }
  }

  const seen = new Set<string>();
  return texts
    .map((text) => text.trim())
    .filter((text) => {
      if (!text || seen.has(text)) return false;
      seen.add(text);
      return true;
    })
    .slice(0, MAX_GOALS);
}

/**
 * Bring `tmg_participant_goals` in line with the profile and return the
 * active goals, in order. Used by the participant's own goal picker and by a
 * consented worker's — the worker route checks consent first and then calls
 * exactly this, so both sides always see the same list.
 */
export async function syncParticipantGoals(participantId: number) {
  const profile = await prisma.participantProfile.findUnique({
    where: { participant_id: participantId },
    include: {
      sections: {
        where: { section_key: GOALS_SECTION_KEY },
        include: { answers: true },
      },
    },
  });

  const answers = (profile?.sections[0]?.answers ?? []) as Answer[];
  const wanted = deriveGoalTexts(answers);

  const existing = await prisma.participantGoal.findMany({
    where: { participant_id: participantId },
  });
  const byText = new Map(existing.map((goal) => [goal.goal_text, goal]));

  await prisma.$transaction(async (tx) => {
    for (const [index, text] of wanted.entries()) {
      const order = index + 1;
      const match = byText.get(text);
      if (!match) {
        await tx.participantGoal.create({
          data: { participant_id: participantId, goal_text: text, goal_order: order },
        });
      } else if (match.goal_order !== order || match.is_active !== true) {
        await tx.participantGoal.update({
          where: { id: match.id },
          data: { goal_order: order, is_active: true },
        });
      }
    }

    // Rewritten or removed in the profile: keep the row (a submitted log may
    // point at it), just take it out of the picker.
    const stale = existing.filter((goal) => goal.is_active && !wanted.includes(goal.goal_text));
    if (stale.length > 0) {
      await tx.participantGoal.updateMany({
        where: { id: { in: stale.map((goal) => goal.id) } },
        data: { is_active: false },
      });
    }
  });

  const goals = await prisma.participantGoal.findMany({
    where: { participant_id: participantId, is_active: true },
    orderBy: [{ goal_order: 'asc' }, { id: 'asc' }],
  });
  return goals.map((goal) => ({ id: goal.id, text: goal.goal_text, order: goal.goal_order }));
}

/** GET /participant/goals */
export const listGoals = asyncHandler(async (req, res) => {
  try {
    res.json(new ApiResponse(200, 'goals fetched', await syncParticipantGoals(req.user!.id)));
  } catch (error) {
    catchResponse(error, res);
  }
});
