import type { Request } from 'express';
import {
  DAILY_LOG_AUTHOR_ROLE,
  DAILY_LOG_STATUS,
  ROLES,
  canSubmitDailyLog,
  validateAddendum,
  validateDailyLogFields,
  type DailyLogFields,
} from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { ApiError, ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * The participant layer of the Daily Support Evidence Log (R-09).
 *
 * Lifecycle: create a draft, save it as often as you like, submit once. A
 * submitted log is locked — every route below refuses to write to it, and the
 * only way to add anything afterwards is an addendum, which is appended and
 * stamped rather than merged in. That is the append-only evidence rule the
 * whole chain rests on, so it is enforced here and not left to the client.
 *
 * Every query is scoped to `req.user.id` as the *author*: a participant sees
 * the logs they wrote, never a worker's log about them (that surface is
 * consent-gated and separate).
 */

const logInclude = {
  addenda: { orderBy: { created_at: 'desc' } },
} as const;

type LogRow = Awaited<ReturnType<typeof prisma.dailyNoteStructured.findFirst>>;

/** `@db.Date` columns are calendar days — never render them through a timezone. */
const toDay = (value: Date | null | undefined) =>
  value ? value.toISOString().slice(0, 10) : null;

/** `@db.Time` comes back as 1970-01-01T09:00:00Z; the wire wants "09:00". */
const toClock = (value: Date | null | undefined) =>
  value ? value.toISOString().slice(11, 16) : null;

const fromDay = (value?: string | null) => (value ? new Date(`${value}T00:00:00Z`) : null);

const fromClock = (value?: string | null) =>
  value ? new Date(`1970-01-01T${value}:00Z`) : null;

/** Minutes between start and end, so a snapshot can total support hours later. */
function durationMinutes(start?: string | null, end?: string | null) {
  if (!start || !end) return null;
  const toMinutes = (clock: string) => {
    const [hours, minutes] = clock.split(':').map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
    return hours! * 60 + minutes!;
  };
  const from = toMinutes(start);
  const to = toMinutes(end);
  if (from === null || to === null) return null;
  return to > from ? to - from : null;
}

type WireLog = ReturnType<typeof toSummary> & Record<string, unknown>;

/** List shape: enough for a row in the history, none of the long text. */
function toSummary(row: NonNullable<LogRow> & { addenda?: unknown[] }) {
  return {
    id: row.id,
    status: row.status,
    sessionDate: toDay(row.session_date),
    startTime: toClock(row.start_time),
    endTime: toClock(row.end_time),
    goalIds: row.goal_ids,
    domainTags: row.domain_tags,
    submittedAt: row.submitted_at,
    updatedAt: row.updated_at,
    addendaCount: row.addenda?.length ?? 0,
  };
}

/** Detail shape: everything the form and the read-only view render. */
function toDetail(
  row: NonNullable<LogRow> & {
    addenda?: { id: number; addendum_text: string; reason: string | null; created_at: Date; added_by_role: string }[];
  },
  goals: { id: number; goal_text: string }[]
) {
  return {
    ...toSummary(row),
    impactText: row.impact_text ?? '',
    supportText: row.support_text ?? '',
    outcomeText: row.outcome_text ?? '',
    comparison: row.baseline_comparison,
    additionalNotes: row.additional_notes ?? '',
    authorRole: row.author_role,
    createdAt: row.created_at,
    // Resolved so the read-only view never has to hold a goal list of its own.
    goals: goals.map((goal) => ({ id: goal.id, text: goal.goal_text })),
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

/** Locking a record and appending to a locked one are both audit events. */
function writeAudit(
  req: Request,
  entry: { actorId: number; action: string; targetId: number; details?: object }
) {
  return prisma.auditLog.create({
    data: {
      actor_id: entry.actorId,
      actor_role: ROLES.PARTICIPANT,
      action: entry.action,
      target_type: 'daily_note_structured',
      target_id: entry.targetId,
      details: entry.details ?? undefined,
      ip_address: asInet(req.ip),
    },
  });
}

const numericId = (value: string) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new ApiError(404, 'No such daily log.');
  return id;
};

/** Always by author — a participant reads their own logs and no one else's. */
async function loadOwnLog(id: number, participantId: number) {
  const log = await prisma.dailyNoteStructured.findFirst({
    where: { id, author_id: participantId, author_role: DAILY_LOG_AUTHOR_ROLE.PARTICIPANT },
    include: logInclude,
  });
  if (!log) throw new ApiError(404, 'No such daily log.');
  return log;
}

async function loadGoals(row: { goal_ids: number[] }) {
  if (row.goal_ids.length === 0) return [];
  const goals = await prisma.participantGoal.findMany({
    where: { id: { in: row.goal_ids } },
    orderBy: { goal_order: 'asc' },
  });
  return goals;
}

/**
 * Reads the fields off a request body and rejects malformed values. Never
 * rejects incomplete ones — a draft is allowed to be half-written.
 */
function readFields(body: unknown): DailyLogFields {
  const fields = (body ?? {}) as DailyLogFields;
  const errors = validateDailyLogFields(fields);
  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, 'Some parts of this log need another look.', errors);
  }
  return fields;
}

/** Goals are the participant's own or they are not linkable. */
async function assertOwnGoals(goalIds: number[] | undefined, participantId: number) {
  if (!goalIds || goalIds.length === 0) return;
  const owned = await prisma.participantGoal.count({
    where: { id: { in: goalIds }, participant_id: participantId },
  });
  if (owned !== goalIds.length) {
    throw new ApiError(400, 'Some parts of this log need another look.', {
      goalIds: 'One of those goals is not on your plan.',
    });
  }
}

/** A missing sessionDate falls back to what the row already has, never null. */
const writableData = (fields: DailyLogFields, sessionDate: Date) => ({
  session_date: fromDay(fields.sessionDate) ?? sessionDate,
  start_time: fromClock(fields.startTime),
  end_time: fromClock(fields.endTime),
  duration_minutes: durationMinutes(fields.startTime, fields.endTime),
  goal_ids: fields.goalIds ?? [],
  domain_tags: fields.domainTags ?? [],
  impact_text: fields.impactText ?? null,
  support_text: fields.supportText ?? null,
  outcome_text: fields.outcomeText ?? null,
  baseline_comparison: fields.comparison ?? null,
  additional_notes: fields.additionalNotes ?? null,
});

/** GET /participant/daily-logs?from=&to=&status= — newest first. */
export const listDailyLogs = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const { from, to, status } = req.query as { from?: string; to?: string; status?: string };

    const logs = await prisma.dailyNoteStructured.findMany({
      where: {
        author_id: participantId,
        author_role: DAILY_LOG_AUTHOR_ROLE.PARTICIPANT,
        ...(status ? { status } : {}),
        ...(from || to
          ? {
              session_date: {
                ...(from ? { gte: fromDay(from)! } : {}),
                ...(to ? { lte: fromDay(to)! } : {}),
              },
            }
          : {}),
      },
      include: logInclude,
      orderBy: [{ session_date: 'desc' }, { id: 'desc' }],
    });

    res.json(new ApiResponse(200, 'daily logs fetched', logs.map(toSummary)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/** GET /participant/daily-logs/:id */
export const getDailyLog = asyncHandler(async (req, res) => {
  try {
    const log = await loadOwnLog(numericId(req.params.id as string), req.user!.id);
    res.json(new ApiResponse(200, 'daily log fetched', toDetail(log, await loadGoals(log))));
  } catch (error) {
    catchResponse(error, res);
  }
});

/** POST /participant/daily-logs — starts a draft. */
export const createDailyLog = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const fields = readFields(req.body);
    await assertOwnGoals(fields.goalIds, participantId);

    const created = await prisma.dailyNoteStructured.create({
      data: {
        participant_id: participantId,
        author_id: participantId,
        author_role: DAILY_LOG_AUTHOR_ROLE.PARTICIPANT,
        status: DAILY_LOG_STATUS.DRAFT,
        is_locked: false,
        // A draft with no date yet is still a draft — default to today so the
        // row is never dateless, and the form overwrites it on the next save.
        ...writableData(fields, new Date(new Date().toISOString().slice(0, 10))),
      },
      include: logInclude,
    });

    res.status(201).json(
      new ApiResponse(201, 'daily log created', toDetail(created, await loadGoals(created)))
    );
  } catch (error) {
    catchResponse(error, res);
  }
});

/** PATCH /participant/daily-logs/:id — save a draft. Refused once submitted. */
export const saveDailyLog = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const existing = await loadOwnLog(numericId(req.params.id as string), participantId);

    if (existing.status === DAILY_LOG_STATUS.SUBMITTED) {
      throw new ApiError(
        409,
        'This log has been submitted, so it can no longer be edited. Add a note to it instead.'
      );
    }

    const fields = readFields(req.body);
    await assertOwnGoals(fields.goalIds, participantId);

    const saved = await prisma.dailyNoteStructured.update({
      where: { id: existing.id },
      data: writableData(fields, existing.session_date),
      include: logInclude,
    });

    res.json(new ApiResponse(200, 'daily log saved', toDetail(saved, await loadGoals(saved))));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * POST /participant/daily-logs/:id/submit
 *
 * Saves and finalises in one call so a log can never be locked holding
 * anything other than what was on screen. The evidence rule (1-3 goals, at
 * least one domain tag) is checked here with the same shared function the web
 * form runs — a client that skips it gets a 400 with the same messages.
 */
export const submitDailyLog = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const existing = await loadOwnLog(numericId(req.params.id as string), participantId);

    if (existing.status === DAILY_LOG_STATUS.SUBMITTED) {
      throw new ApiError(409, 'This log has already been submitted.');
    }

    const fields = readFields(req.body);
    await assertOwnGoals(fields.goalIds, participantId);

    const { ok, errors } = canSubmitDailyLog(fields);
    if (!ok) throw new ApiError(400, 'This log is not ready to submit yet.', errors);

    const submitted = await prisma.dailyNoteStructured.update({
      where: { id: existing.id },
      data: {
        ...writableData(fields, existing.session_date),
        status: DAILY_LOG_STATUS.SUBMITTED,
        submitted_at: new Date(),
        is_locked: true,
        goal_validated: true,
        domain_validated: true,
      },
      include: logInclude,
    });

    await writeAudit(req, {
      actorId: participantId,
      action: 'daily_log_submitted',
      targetId: submitted.id,
      details: { sessionDate: toDay(submitted.session_date), goalIds: submitted.goal_ids },
    });

    res.json(
      new ApiResponse(200, 'daily log submitted', toDetail(submitted, await loadGoals(submitted)))
    );
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * POST /participant/daily-logs/:id/addenda
 *
 * The only write a submitted log accepts. The addendum sits beside the record,
 * never inside it, so the original text stays exactly as it was submitted.
 */
export const addAddendum = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const log = await loadOwnLog(numericId(req.params.id as string), participantId);

    if (log.status !== DAILY_LOG_STATUS.SUBMITTED) {
      throw new ApiError(
        400,
        'This log is still a draft — edit it directly rather than adding a note.'
      );
    }

    const { text, reason } = (req.body ?? {}) as { text?: string; reason?: string };
    const errors = validateAddendum({ text, reason });
    if (Object.keys(errors).length > 0) {
      throw new ApiError(400, 'This note needs another look.', errors);
    }

    await prisma.dailyNoteAddendum.create({
      data: {
        note_id: log.id,
        added_by: participantId,
        added_by_role: ROLES.PARTICIPANT,
        addendum_text: text!.trim(),
        reason: reason?.trim() || null,
      },
    });

    await writeAudit(req, {
      actorId: participantId,
      action: 'daily_log_addendum_added',
      targetId: log.id,
      details: { reason: reason?.trim() || null },
    });

    const updated = await loadOwnLog(log.id, participantId);
    res.status(201).json(
      new ApiResponse(201, 'note added', toDetail(updated, await loadGoals(updated)))
    );
  } catch (error) {
    catchResponse(error, res);
  }
});

export type { WireLog };
