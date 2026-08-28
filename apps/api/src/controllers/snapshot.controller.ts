import type { Request } from 'express';
import {
  DAILY_LOG_AUTHOR_ROLE,
  DAILY_LOG_STATUS,
  NONLINEAR_STATEMENT,
  ROLES,
  SNAPSHOT_STATUS,
  canApproveSnapshot,
  isMonthKey,
  monthLabel,
  validateSnapshotAddendum,
  validateSnapshotFields,
} from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import {
  SNAPSHOT_CHOICE_COLUMNS,
  SNAPSHOT_FIELD_COLUMNS,
  SNAPSHOT_TAG_COLUMNS,
  snapshotFields,
  type SnapshotChoiceField,
  type SnapshotTagField,
  type SnapshotWireField,
} from '../services/snapshotRead.js';
import { statsForSourceLogs, type SnapshotStats } from '../services/snapshotStats.js';
import { ApiError, ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * The Monthly Snapshot (participant layer).
 *
 * A snapshot is compiled from the month's *submitted* daily logs, reviewed by
 * the participant, and locked by their approval. After that it is addendum-only
 * — no route below writes to a locked snapshot, which is the same append-only
 * rule the daily log follows and the reason the chain is worth anything at a
 * plan review.
 *
 * Generation is deterministic, not AI: the numbers come from counting what the
 * logs say. The narrative belongs to the participant. When the approved AI
 * draft endpoint lands it pre-fills the same fields behind a human review gate,
 * and nothing here has to change.
 */

const snapshotInclude = {
  addenda: { orderBy: { created_at: 'desc' } },
} as const;

type SnapshotRow = NonNullable<Awaited<ReturnType<typeof prisma.monthlySnapshot.findFirst>>> & {
  addenda?: {
    id: number;
    addendum_text: string;
    reason: string | null;
    added_by_role: string;
    created_at: Date;
  }[];
};

/** The column maps live in services/snapshotRead.ts — shared with the share-link reader. */
const FIELD_COLUMNS = SNAPSHOT_FIELD_COLUMNS;
const TAG_COLUMNS = SNAPSHOT_TAG_COLUMNS;
const CHOICE_COLUMNS = SNAPSHOT_CHOICE_COLUMNS;

type WireField = SnapshotWireField;
type TagField = SnapshotTagField;
type ChoiceField = SnapshotChoiceField;

const toDay = (value: Date | null | undefined) =>
  value ? value.toISOString().slice(0, 10) : null;

/** First and last instant of a "YYYY-MM", as calendar dates. */
function monthRange(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number);
  return {
    from: new Date(Date.UTC(year!, month! - 1, 1)),
    // Day 0 of the next month is the last day of this one.
    to: new Date(Date.UTC(year!, month!, 0)),
  };
}

function toSummary(row: SnapshotRow) {
  return {
    id: row.id,
    monthYear: row.month_year,
    monthLabel: monthLabel(row.month_year),
    status: row.status,
    version: row.version,
    sourceLogIds: row.generated_from_notes,
    sourceCheckInIds: row.generated_from_checkins,
    generatedAt: row.generated_at,
    approvedAt: row.participant_approved_at,
    lockedAt: row.locked_at,
    exportedAt: row.exported_at,
    addendaCount: row.addenda?.length ?? 0,
    updatedAt: row.updated_at,
  };
}

function toDetail(row: SnapshotRow, stats: SnapshotStats) {
  return {
    ...toSummary(row),
    ...snapshotFields(row),
    nonlinearStatement: row.nonlinear_statement,
    stats,
    addenda: (row.addenda ?? []).map((addendum) => ({
      id: addendum.id,
      text: addendum.addendum_text,
      reason: addendum.reason,
      authorRole: addendum.added_by_role,
      createdAt: addendum.created_at,
    })),
  };
}

const asInet = (value?: string) =>
  value && /^[0-9a-fA-F.:]+$/.test(value) ? value.replace(/^::ffff:/, '') : null;

function writeAudit(
  req: Request,
  entry: { actorId: number; action: string; targetId: number; details?: object }
) {
  return prisma.auditLog.create({
    data: {
      actor_id: entry.actorId,
      actor_role: ROLES.PARTICIPANT,
      action: entry.action,
      target_type: 'monthly_snapshot',
      target_id: entry.targetId,
      details: entry.details ?? undefined,
      ip_address: asInet(req.ip),
    },
  });
}

const numericId = (value: string) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new ApiError(404, 'No such snapshot.');
  return id;
};

async function loadOwnSnapshot(id: number, participantId: number) {
  const snapshot = await prisma.monthlySnapshot.findFirst({
    where: { id, participant_id: participantId },
    include: snapshotInclude,
  });
  if (!snapshot) throw new ApiError(404, 'No such snapshot.');
  return snapshot;
}

/** The submitted logs a snapshot for this month is built from. */
function loadMonthLogs(participantId: number, monthKey: string) {
  const { from, to } = monthRange(monthKey);
  return prisma.dailyNoteStructured.findMany({
    where: {
      author_id: participantId,
      author_role: DAILY_LOG_AUTHOR_ROLE.PARTICIPANT,
      status: DAILY_LOG_STATUS.SUBMITTED,
      session_date: { gte: from, lte: to },
    },
    orderBy: { session_date: 'desc' },
  });
}

/**
 * The month's check-ins — the other half of what Template C is generated from.
 * Every check-in is locked on save, so there is no draft to exclude.
 */
function loadMonthCheckIns(participantId: number, monthKey: string) {
  const { from, to } = monthRange(monthKey);
  return prisma.participantCheckin.findMany({
    where: { participant_id: participantId, checkin_date: { gte: from, lte: to } },
    orderBy: { checkin_date: 'desc' },
    select: { id: true },
  });
}

const detailFor = async (row: SnapshotRow) =>
  toDetail(row, await statsForSourceLogs(row.generated_from_notes));

function readFields(body: unknown) {
  const fields = (body ?? {}) as Record<string, unknown>;
  const errors = validateSnapshotFields(fields);
  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, 'Some parts of this snapshot need another look.', errors);
  }
  const text = (Object.entries(fields) as [WireField, string][])
    .filter(([key]) => key in FIELD_COLUMNS)
    .map(([key, value]) => [FIELD_COLUMNS[key], value ?? null] as const);

  const tags = (Object.entries(fields) as [TagField, string[]][])
    .filter(([key]) => key in TAG_COLUMNS)
    .map(([key, value]) => [TAG_COLUMNS[key], value ?? []] as const);

  const choices = (Object.entries(fields) as [ChoiceField, string][])
    .filter(([key]) => key in CHOICE_COLUMNS)
    .map(([key, value]) => [CHOICE_COLUMNS[key], value || null] as const);

  return Object.fromEntries([...text, ...tags, ...choices]);
}

/** GET /participant/snapshots — newest month first. */
export const listSnapshots = asyncHandler(async (req, res) => {
  try {
    const snapshots = await prisma.monthlySnapshot.findMany({
      where: { participant_id: req.user!.id },
      include: snapshotInclude,
      orderBy: [{ month_year: 'desc' }, { version: 'desc' }],
    });
    res.json(new ApiResponse(200, 'snapshots fetched', snapshots.map(toSummary)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * GET /participant/snapshots/months — which months can be compiled.
 *
 * Every month the participant has submitted logs for, with the snapshot's
 * status where one exists. Without this the list screen could only offer "this
 * month", and a snapshot is usually written after the month has ended.
 */
export const listSnapshotMonths = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;

    const logs = await prisma.dailyNoteStructured.findMany({
      where: {
        author_id: participantId,
        author_role: DAILY_LOG_AUTHOR_ROLE.PARTICIPANT,
        status: DAILY_LOG_STATUS.SUBMITTED,
      },
      select: { session_date: true },
    });

    const counts: Record<string, number> = {};
    for (const log of logs) {
      const key = toDay(log.session_date)!.slice(0, 7);
      counts[key] = (counts[key] ?? 0) + 1;
    }

    const snapshots = await prisma.monthlySnapshot.findMany({
      where: { participant_id: participantId },
      select: { id: true, month_year: true, status: true },
    });
    const byMonth = new Map(snapshots.map((snapshot) => [snapshot.month_year, snapshot]));

    const months = Object.entries(counts)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([monthYear, logsCount]) => ({
        monthYear,
        monthLabel: monthLabel(monthYear),
        logsCount,
        snapshotId: byMonth.get(monthYear)?.id ?? null,
        status: byMonth.get(monthYear)?.status ?? null,
      }));

    res.json(new ApiResponse(200, 'snapshot months fetched', months));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * POST /participant/snapshots  body: { monthYear }
 *
 * Compiles (or recompiles) the draft for a month. Recompiling refreshes the
 * source logs and the counts but never touches what the participant wrote —
 * regenerating must not cost someone their words.
 */
export const generateSnapshot = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const { monthYear } = (req.body ?? {}) as { monthYear?: string };

    if (!isMonthKey(monthYear)) {
      throw new ApiError(400, 'Choose a month to compile.', {
        monthYear: 'Needs to be a month like 2026-08.',
      });
    }

    const existing = await prisma.monthlySnapshot.findFirst({
      where: { participant_id: participantId, month_year: monthYear! },
      include: snapshotInclude,
    });

    if (existing?.status === SNAPSHOT_STATUS.LOCKED) {
      throw new ApiError(
        409,
        `${monthLabel(monthYear!)} has already been approved and locked. Add a note to it instead.`
      );
    }

    const [logs, checkIns] = await Promise.all([
      loadMonthLogs(participantId, monthYear!),
      loadMonthCheckIns(participantId, monthYear!),
    ]);
    if (logs.length === 0 && checkIns.length === 0) {
      throw new ApiError(
        400,
        `There are no daily logs or check-ins for ${monthLabel(monthYear!)} yet. A snapshot is built from those, so there is nothing to compile.`
      );
    }

    // The source ids and the timestamp are all generation touches — the tag
    // banks and every narrative field stay the participant's, so recompiling a
    // month never costs someone what they already said about it.
    const generated = {
      generated_from_notes: logs.map((log) => log.id),
      generated_from_checkins: checkIns.map((checkIn) => checkIn.id),
      generated_at: new Date(),
      status: SNAPSHOT_STATUS.DRAFT,
    };

    const snapshot = existing
      ? await prisma.monthlySnapshot.update({
          where: { id: existing.id },
          data: generated,
          include: snapshotInclude,
        })
      : await prisma.monthlySnapshot.create({
          data: {
            participant_id: participantId,
            month_year: monthYear!,
            version: 1,
            nonlinear_statement: NONLINEAR_STATEMENT,
            ...generated,
          },
          include: snapshotInclude,
        });

    res
      .status(existing ? 200 : 201)
      .json(new ApiResponse(existing ? 200 : 201, 'snapshot compiled', await detailFor(snapshot)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/** GET /participant/snapshots/:id */
export const getSnapshot = asyncHandler(async (req, res) => {
  try {
    const snapshot = await loadOwnSnapshot(numericId(req.params.id as string), req.user!.id);
    res.json(new ApiResponse(200, 'snapshot fetched', await detailFor(snapshot)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/** PATCH /participant/snapshots/:id — save the narrative. Draft only. */
export const saveSnapshot = asyncHandler(async (req, res) => {
  try {
    const existing = await loadOwnSnapshot(numericId(req.params.id as string), req.user!.id);
    if (existing.status === SNAPSHOT_STATUS.LOCKED) {
      throw new ApiError(
        409,
        'This snapshot is approved and locked, so it can no longer be edited. Add a note to it instead.'
      );
    }

    const saved = await prisma.monthlySnapshot.update({
      where: { id: existing.id },
      data: readFields(req.body),
      include: snapshotInclude,
    });

    res.json(new ApiResponse(200, 'snapshot saved', await detailFor(saved)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * POST /participant/snapshots/:id/approve
 *
 * Saves and locks in one call, so a snapshot can never be locked holding
 * something other than what was on screen when it was approved. This is the
 * participant's approval — nobody else can give it, and it cannot be undone.
 */
export const approveSnapshot = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const existing = await loadOwnSnapshot(numericId(req.params.id as string), participantId);

    const fields = readFields(req.body);
    const { ok, errors } = canApproveSnapshot({
      status: existing.status ?? undefined,
      nonlinearStatement: existing.nonlinear_statement,
      sourceLogIds: existing.generated_from_notes,
      sourceCheckInIds: existing.generated_from_checkins,
    });
    if (!ok) throw new ApiError(existing.status === SNAPSHOT_STATUS.LOCKED ? 409 : 400, errors[0]!);

    const now = new Date();
    const locked = await prisma.monthlySnapshot.update({
      where: { id: existing.id },
      data: {
        ...fields,
        status: SNAPSHOT_STATUS.LOCKED,
        participant_approved: true,
        participant_approved_at: now,
        locked_at: now,
      },
      include: snapshotInclude,
    });

    await writeAudit(req, {
      actorId: participantId,
      action: 'snapshot_approved',
      targetId: locked.id,
      details: {
        monthYear: locked.month_year,
        sourceLogs: locked.generated_from_notes.length,
        sourceCheckIns: locked.generated_from_checkins.length,
      },
    });

    res.json(new ApiResponse(200, 'snapshot approved and locked', await detailFor(locked)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/** POST /participant/snapshots/:id/addenda — the only write a locked one takes. */
export const addSnapshotAddendum = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const snapshot = await loadOwnSnapshot(numericId(req.params.id as string), participantId);

    if (snapshot.status !== SNAPSHOT_STATUS.LOCKED) {
      throw new ApiError(
        400,
        'This snapshot is still a draft — edit it directly rather than adding a note.'
      );
    }

    const { text, reason } = (req.body ?? {}) as { text?: string; reason?: string };
    const errors = validateSnapshotAddendum({ text, reason });
    if (Object.keys(errors).length > 0) {
      throw new ApiError(400, 'This note needs another look.', errors);
    }

    await prisma.snapshotAddendum.create({
      data: {
        snapshot_id: snapshot.id,
        added_by: participantId,
        added_by_role: ROLES.PARTICIPANT,
        addendum_text: text!.trim(),
        reason: reason?.trim() || null,
      },
    });

    await writeAudit(req, {
      actorId: participantId,
      action: 'snapshot_addendum_added',
      targetId: snapshot.id,
      details: { reason: reason?.trim() || null },
    });

    const updated = await loadOwnSnapshot(snapshot.id, participantId);
    res.status(201).json(new ApiResponse(201, 'note added', await detailFor(updated)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * POST /participant/snapshots/:id/export  body: { format }
 *
 * Records that an export happened. The document itself is produced by the
 * browser's print dialog, so nothing leaves the participant's machine — but a
 * plan-review document going out is worth a row in the audit log.
 */
export const recordSnapshotExport = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const snapshot = await loadOwnSnapshot(numericId(req.params.id as string), participantId);

    if (snapshot.status !== SNAPSHOT_STATUS.LOCKED) {
      throw new ApiError(400, 'Only an approved snapshot can be exported.');
    }

    const { format } = (req.body ?? {}) as { format?: string };
    const exportFormat = format === 'print' || format === 'pdf' ? format : 'pdf';

    const updated = await prisma.monthlySnapshot.update({
      where: { id: snapshot.id },
      data: { exported_at: new Date(), export_format: exportFormat },
      include: snapshotInclude,
    });

    await writeAudit(req, {
      actorId: participantId,
      action: 'snapshot_exported',
      targetId: snapshot.id,
      details: { format: exportFormat, monthYear: snapshot.month_year },
    });

    res.json(new ApiResponse(200, 'export recorded', await detailFor(updated)));
  } catch (error) {
    catchResponse(error, res);
  }
});
