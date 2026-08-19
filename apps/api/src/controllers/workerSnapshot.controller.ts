import {
  CONSENT_STATUS,
  ROLES,
  SNAPSHOT_ACCESS,
  SNAPSHOT_STATUS,
  isMonthKey,
  monthLabel,
  showsNarrative,
  snapshotAccessLabel,
  snapshotAccessLevel,
} from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { assertConsent } from '../middleware/consent.js';
import { statsForSourceLogs, type SnapshotStats } from '../services/snapshotStats.js';
import { ApiError, ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { asInet } from '../utils/clientInfo.js';

/**
 * Approved Monthly Snapshots, worker layer (Figma 1169:3455).
 *
 * Read-only, end of story. A snapshot belongs to the participant who approved
 * it; nothing here writes to one, and there is no worker addendum — the locked
 * record is theirs, and a worker with something to add writes their own daily
 * log. The only row this file creates is the audit entry recording the view.
 *
 * Three rules, in order:
 *   - **Locked only.** A draft is the participant's review, not evidence. It
 *     does not exist on this surface at any consent level.
 *   - **Consent, per request.** Visible only while the participant holds an
 *     *active* grant carrying `can_view_snapshot`. Revocation takes effect on
 *     the next call — the list closes and an open snapshot 403s. Unlike the
 *     worker's own daily logs, nothing here survives revocation: this is the
 *     participant's record, not the worker's.
 *   - **The grant decides how much.** `snapshotAccessLevel` reads the flag set:
 *     a snapshot-only grant is "Summary only" and gets the month's shape (the
 *     counts, the areas engaged, the non-linear statement); a grant that also
 *     carries the Personal Profile is "Full shared" and reaches the words the
 *     participant wrote, the goals they named and any addenda. The label on the
 *     frame is therefore true of what is on screen.
 *
 * Every open is recorded as `snapshot_viewed` in `tmg_audit_log` — where the
 * frame's "Last viewed" comes from, and what a participant would be shown if
 * they ever ask who has read their month.
 */

const VIEW_ACTION = 'snapshot_viewed';
const TARGET_TYPE = 'monthly_snapshot';

const snapshotInclude = {
  participant: { select: { id: true, full_name: true } },
  _count: { select: { addenda: true } },
} as const;

type SnapshotRow = NonNullable<
  Awaited<ReturnType<typeof prisma.monthlySnapshot.findFirst<{ include: typeof snapshotInclude }>>>
>;

type AddendumRow = {
  id: number;
  addendum_text: string;
  reason: string | null;
  added_by_role: string | null;
  created_at: Date;
};

/** Wire field -> column, for the narrative a "Full shared" grant reaches. */
const NARRATIVE_COLUMNS = {
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
  impairmentLinkage: 'impairment_linkage',
  goalLinkage: 'goal_linkage',
} as const;

/**
 * The worker's active grants that reach approved snapshots, newest first and
 * one per participant. Supersession should already guarantee one, but the list
 * must not show a person twice.
 */
async function snapshotGrants(workerId: number) {
  const consents = await prisma.consent.findMany({
    where: { worker_id: workerId, status: CONSENT_STATUS.ACTIVE, can_view_snapshot: true },
    orderBy: { created_at: 'desc' },
  });

  const byParticipant = new Map<number, (typeof consents)[number]>();
  for (const consent of consents) {
    if (!byParticipant.has(consent.participant_id)) {
      byParticipant.set(consent.participant_id, consent);
    }
  }
  return byParticipant;
}

const accessOf = (consent: { can_view_snapshot: boolean | null; can_view_intake: boolean | null }) =>
  snapshotAccessLevel({
    canViewSnapshot: consent.can_view_snapshot ?? false,
    canViewProfile: consent.can_view_intake ?? false,
  }) ?? SNAPSHOT_ACCESS.SUMMARY;

/** List shape: one card on the Approved Snapshots screen. */
function toSummary(row: SnapshotRow, access: string, lastViewedAt: Date | null) {
  return {
    id: row.id,
    participant: { id: row.participant.id, name: row.participant.full_name },
    monthYear: row.month_year,
    monthLabel: monthLabel(row.month_year),
    status: row.status,
    approvedAt: row.participant_approved_at,
    lockedAt: row.locked_at,
    logsCount: row.generated_from_notes.length,
    addendaCount: row._count.addenda,
    participationDomains: row.participation_domains,
    access,
    accessLabel: snapshotAccessLabel(access),
    // The frame's "Last viewed" — this worker's own reads, nobody else's.
    lastViewedAt,
  };
}

/**
 * Detail shape. What a "Summary only" grant reaches stops at the month's
 * shape; the narrative, the goal wording and the addenda need the fuller
 * grant, and the fields come back explicitly null rather than quietly missing
 * so the screen can say what is withheld and why.
 */
function toDetail(
  row: SnapshotRow,
  access: string,
  stats: SnapshotStats,
  addenda: AddendumRow[],
  lastViewedAt: Date | null,
  viewCount: number
) {
  const full = showsNarrative(access);
  const { goals, ...sharedStats } = stats;

  return {
    ...toSummary(row, access, lastViewedAt),
    viewCount,
    // Canon: the fluctuation statement travels with every snapshot, at every
    // access level. A month read without it reads as regression.
    nonlinearStatement: row.nonlinear_statement,
    stats: {
      ...sharedStats,
      goalsCount: goals.length,
      // Goal wording is the participant's own writing; it sits behind the same
      // permission their Personal Profile does.
      goals: full ? goals : null,
    },
    narrative: full
      ? Object.fromEntries(
          Object.entries(NARRATIVE_COLUMNS).map(([wire, column]) => [
            wire,
            (row as unknown as Record<string, string | null>)[column] ?? '',
          ])
        )
      : null,
    addenda: full
      ? addenda.map((addendum) => ({
          id: addendum.id,
          text: addendum.addendum_text,
          reason: addendum.reason,
          authorRole: addendum.added_by_role,
          createdAt: addendum.created_at,
        }))
      : null,
  };
}

const numericId = (value: string) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new ApiError(404, 'No such snapshot.');
  return id;
};

/** This worker's own reads of these snapshots — the latest per snapshot. */
async function lastViewedBySnapshot(workerId: number, snapshotIds: number[]) {
  if (snapshotIds.length === 0) return new Map<number, Date>();
  const rows = await prisma.auditLog.groupBy({
    by: ['target_id'],
    where: {
      actor_id: workerId,
      actor_role: ROLES.WORKER,
      action: VIEW_ACTION,
      target_type: TARGET_TYPE,
      target_id: { in: snapshotIds },
    },
    _max: { created_at: true },
  });
  return new Map(
    rows
      .filter((row) => row.target_id !== null && row._max.created_at !== null)
      .map((row) => [row.target_id!, row._max.created_at!])
  );
}

/**
 * GET /worker/snapshots?participantId=&month=
 *
 * Every locked snapshot belonging to a participant who currently lets this
 * worker see one, newest month first. No grants means an empty list, not an
 * error — a worker nobody has consented to has an empty screen, which is the
 * correct answer.
 */
export const listWorkerSnapshots = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const { participantId, month } = req.query as { participantId?: string; month?: string };

    if (month !== undefined && month !== '' && !isMonthKey(month)) {
      throw new ApiError(400, 'Choose a month to filter by.', {
        month: 'Needs to be a month like 2026-08.',
      });
    }

    let wanted: number | undefined;
    if (participantId !== undefined && participantId !== '') {
      wanted = Number(participantId);
      if (!Number.isInteger(wanted) || wanted < 1) {
        throw new ApiError(400, 'That is not a participant.', {
          participantId: 'Needs to be a whole number.',
        });
      }
    }

    const grants = await snapshotGrants(workerId);
    // Filtering to someone who has not consented is an empty list, never a
    // 403 — the filter must not become a way to ask whether a person exists.
    const participantIds = [...grants.keys()].filter((id) => wanted === undefined || id === wanted);
    if (participantIds.length === 0) {
      res.json(new ApiResponse(200, 'snapshots fetched', []));
      return;
    }

    const snapshots = await prisma.monthlySnapshot.findMany({
      where: {
        participant_id: { in: participantIds },
        status: SNAPSHOT_STATUS.LOCKED,
        ...(month ? { month_year: month } : {}),
      },
      include: snapshotInclude,
      orderBy: [{ month_year: 'desc' }, { participant_id: 'asc' }, { version: 'desc' }],
    });

    const lastViewed = await lastViewedBySnapshot(
      workerId,
      snapshots.map((row) => row.id)
    );

    res.json(
      new ApiResponse(
        200,
        'snapshots fetched',
        snapshots.map((row) =>
          toSummary(row, accessOf(grants.get(row.participant_id)!), lastViewed.get(row.id) ?? null)
        )
      )
    );
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * GET /worker/snapshots/:id
 *
 * The read, and the record of it. `assertConsent` runs before anything is
 * serialised, so a revoked grant closes the snapshot mid-session. A draft or an
 * unknown id is a 404 — it does not exist on this surface; a locked snapshot
 * the worker has no grant for is the consent gate's 403 `consent_required`,
 * the same answer every participant-owned surface gives and the one the web
 * turns into "Access not available".
 *
 * "Last viewed" is read *before* this view is written, so the screen can say
 * when the worker last opened it rather than "just now", every time.
 */
export const getWorkerSnapshot = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const id = numericId(req.params.id as string);

    const snapshot = await prisma.monthlySnapshot.findFirst({
      where: { id, status: SNAPSHOT_STATUS.LOCKED },
      include: snapshotInclude,
    });
    if (!snapshot) throw new ApiError(404, 'No such snapshot.');

    const consent = await assertConsent(workerId, snapshot.participant_id, 'canViewSnapshot');
    const access = accessOf(consent);

    const viewWhere = {
      actor_id: workerId,
      actor_role: ROLES.WORKER,
      action: VIEW_ACTION,
      target_type: TARGET_TYPE,
      target_id: snapshot.id,
    };

    const [stats, addenda, views] = await Promise.all([
      statsForSourceLogs(snapshot.generated_from_notes),
      showsNarrative(access)
        ? prisma.snapshotAddendum.findMany({
            where: { snapshot_id: snapshot.id },
            orderBy: { created_at: 'desc' },
          })
        : Promise.resolve([] as AddendumRow[]),
      prisma.auditLog.aggregate({
        where: viewWhere,
        _max: { created_at: true },
        _count: { _all: true },
      }),
    ]);

    await prisma.auditLog.create({
      data: {
        ...viewWhere,
        details: { monthYear: snapshot.month_year, access, consentId: consent.id },
        ip_address: asInet(req.ip),
      },
    });

    res.json(
      new ApiResponse(
        200,
        'snapshot fetched',
        toDetail(snapshot, access, stats, addenda, views._max.created_at ?? null, views._count._all)
      )
    );
  } catch (error) {
    catchResponse(error, res);
  }
});
