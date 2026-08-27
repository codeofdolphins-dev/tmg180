import type { Request } from 'express';
import {
  CONSENT_STATUS,
  DAILY_LOG_AUTHOR_ROLE,
  DAILY_LOG_STATUS,
  ROLES,
  canSubmitDailyLog,
  validateAddendum,
  validateDailyLogFields,
  type DailyLogFields,
} from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { assertConsent } from '../middleware/consent.js';
import { ApiError, ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { fromClock, fromDay, isDayString, toClock, toDay } from '../utils/dbDates.js';

/**
 * The worker layer of the Daily Support Evidence Log (R-09).
 *
 * Two rows per log, written together:
 *   - `tmg_daily_note_structured` — the shared layer (author_role = 'worker',
 *     worker_id = author_id). This is what flows to the participant and their
 *     monthly snapshot.
 *   - `tmg_daily_note_private`    — WCPS Layer A: the worker's private
 *     narrative. Returned only to the worker who wrote it, in the detail
 *     shape, and never anywhere else. Not in the list, not to a participant,
 *     not to admin. (DB pack §2; Master Map doc 20.)
 *
 * Access rules, in order:
 *   - Every read is scoped to `req.user.id` as the author. A worker sees the
 *     logs they wrote and nobody else's; another worker gets a 404, never a
 *     403 that would confirm the row exists.
 *   - Every write needs an *active* consent grant from the participant with
 *     `can_add_daily_note` (assertConsent → 403 consent_required). That covers
 *     starting a log, saving it, submitting it and appending to it: each one
 *     adds evidence about a participant, which is what the grant permits.
 *     Reading your own history does not need the grant — it is your record —
 *     which is why revocation closes the form but not the list.
 *   - Submitted means locked: 409 on edit or re-submit, addendum-only after.
 */

const LAYER = { layer: DAILY_LOG_AUTHOR_ROLE.WORKER } as const;
const MAX_LIMIT = 100;

const logInclude = {
  participant: { select: { id: true, full_name: true } },
  private_note: true,
  addenda: { orderBy: { created_at: 'desc' as const } },
  _count: { select: { addenda: true } },
} as const;

type LogRow = NonNullable<
  Awaited<ReturnType<typeof prisma.dailyNoteStructured.findFirst<{ include: typeof logInclude }>>>
>;

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

/** List shape: a row in the history / a session on the calendar. No long text, no private note. */
function toSummary(row: LogRow, consentedParticipants: Set<number>) {
  return {
    id: row.id,
    status: row.status,
    sessionDate: toDay(row.session_date),
    startTime: toClock(row.start_time),
    endTime: toClock(row.end_time),
    durationMinutes: row.duration_minutes,
    serviceType: row.service_type,
    location: row.location,
    participant: { id: row.participant.id, name: row.participant.full_name },
    // Whether this participant currently lets this worker in. A log written
    // under a grant that has since been revoked stays in the worker's own
    // history, but the chip goes and the form closes.
    consentActive: consentedParticipants.has(row.participant_id),
    goalIds: row.goal_ids,
    domainTags: row.domain_tags,
    ndisBucket: row.ndis_bucket,
    functionalGrouping: row.tmg_functional_grouping_code,
    rnRationaleTags: row.rn_rationale_tags,
    addendaCount: row._count.addenda,
    submittedAt: row.submitted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Detail shape: everything the form and the read-only view render — author's eyes only. */
function toDetail(
  row: LogRow,
  goals: { id: number; goal_text: string }[],
  consentActive: boolean
) {
  return {
    ...toSummary(row, new Set(consentActive ? [row.participant_id] : [])),
    impactText: row.impact_text ?? '',
    supportText: row.support_text ?? '',
    outcomeText: row.outcome_text ?? '',
    comparison: row.baseline_comparison,
    additionalNotes: row.additional_notes ?? '',
    participantVoice: row.participant_voice ?? '',
    safetyNote: row.safety_note ?? '',
    // WCPS Layer A. This is the only place it is ever serialised.
    privateNarrative: row.private_note?.private_narrative ?? '',
    authorRole: row.author_role,
    goals: goals.map((goal) => ({ id: goal.id, text: goal.goal_text })),
    addenda: row.addenda.map((addendum) => ({
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
      actor_role: ROLES.WORKER,
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

/** Always by author — and a log that is not yours does not exist. */
async function loadOwnLog(id: number, workerId: number) {
  const log = await prisma.dailyNoteStructured.findFirst({
    where: { id, author_id: workerId, author_role: DAILY_LOG_AUTHOR_ROLE.WORKER },
    include: logInclude,
  });
  if (!log) throw new ApiError(404, 'No such daily log.');
  return log;
}

async function loadGoals(row: { goal_ids: number[] }) {
  if (row.goal_ids.length === 0) return [];
  return prisma.participantGoal.findMany({
    where: { id: { in: row.goal_ids } },
    orderBy: { goal_order: 'asc' },
  });
}

async function hasActiveConsent(workerId: number, participantId: number) {
  const count = await prisma.consent.count({
    where: { worker_id: workerId, participant_id: participantId, status: CONSENT_STATUS.ACTIVE },
  });
  return count > 0;
}

async function detailOf(log: LogRow, workerId: number) {
  const [goals, consentActive] = await Promise.all([
    loadGoals(log),
    hasActiveConsent(workerId, log.participant_id),
  ]);
  return toDetail(log, goals, consentActive);
}

/** Reads the fields off a request body and rejects malformed values — never incomplete ones. */
function readFields(body: unknown): DailyLogFields {
  const fields = (body ?? {}) as DailyLogFields;
  const errors = validateDailyLogFields(fields, LAYER);
  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, 'Some parts of this log need another look.', errors);
  }
  return fields;
}

/** Goals are the participant's own or they are not linkable. */
async function assertParticipantGoals(goalIds: number[] | undefined, participantId: number) {
  if (!goalIds || goalIds.length === 0) return;
  const owned = await prisma.participantGoal.count({
    where: { id: { in: goalIds }, participant_id: participantId },
  });
  if (owned !== goalIds.length) {
    throw new ApiError(400, 'Some parts of this log need another look.', {
      goalIds: "One of those goals is not on this participant's plan.",
    });
  }
}

const text = (value: unknown) =>
  typeof value === 'string' && value.trim() !== '' ? value : null;

/** The shared-layer columns a save writes. A missing sessionDate keeps the row's. */
const structuredData = (fields: DailyLogFields, sessionDate: Date) => ({
  session_date: fromDay(fields.sessionDate) ?? sessionDate,
  start_time: fromClock(fields.startTime),
  end_time: fromClock(fields.endTime),
  duration_minutes: durationMinutes(fields.startTime, fields.endTime),
  service_type: text(fields.serviceType),
  location: text(fields.location),
  goal_ids: fields.goalIds ?? [],
  domain_tags: fields.domainTags ?? [],
  ndis_bucket: fields.ndisBucket || null,
  tmg_functional_grouping_code: fields.functionalGrouping || null,
  rn_rationale_tags: fields.rnRationaleTags ?? [],
  impact_text: text(fields.impactText),
  support_text: text(fields.supportText),
  outcome_text: text(fields.outcomeText),
  baseline_comparison: fields.comparison || null,
  additional_notes: text(fields.additionalNotes),
  participant_voice: text(fields.participantVoice),
  safety_note: text(fields.safetyNote),
});

/** The private-layer columns — the same session facts plus the narrative. */
const privateData = (fields: DailyLogFields, sessionDate: Date) => ({
  session_date: fromDay(fields.sessionDate) ?? sessionDate,
  start_time: fromClock(fields.startTime),
  end_time: fromClock(fields.endTime),
  duration_minutes: durationMinutes(fields.startTime, fields.endTime),
  service_type: text(fields.serviceType),
  location: text(fields.location),
  private_narrative: text(fields.privateNarrative),
});

const todayUtc = () => new Date(new Date().toISOString().slice(0, 10));

/**
 * GET /worker/daily-logs?from=&to=&status=&participantId=&limit=
 *
 * Newest session first. `from` / `to` are calendar days (inclusive); `status`
 * is draft | submitted; `participantId` narrows to one person; `limit` caps
 * the page (default and max 100).
 */
export const listWorkerDailyLogs = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const query = req.query as Record<string, unknown>;

    for (const key of ['from', 'to']) {
      if (query[key] !== undefined && !isDayString(query[key])) {
        throw new ApiError(400, `${key} must be a YYYY-MM-DD date.`);
      }
    }
    const status = query.status === undefined ? undefined : String(query.status);
    if (status !== undefined && !(Object.values(DAILY_LOG_STATUS) as string[]).includes(status)) {
      throw new ApiError(400, 'status must be draft or submitted.');
    }
    let participantId: number | undefined;
    if (query.participantId !== undefined) {
      participantId = Number(query.participantId);
      if (!Number.isInteger(participantId) || participantId < 1) {
        throw new ApiError(400, 'participantId must be a whole number.');
      }
    }
    let limit = MAX_LIMIT;
    if (query.limit !== undefined) {
      limit = Number(query.limit);
      if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
        throw new ApiError(400, `limit must be a whole number between 1 and ${MAX_LIMIT}.`);
      }
    }

    const [rows, consents] = await Promise.all([
      prisma.dailyNoteStructured.findMany({
        where: {
          author_id: workerId,
          author_role: DAILY_LOG_AUTHOR_ROLE.WORKER,
          ...(status ? { status } : {}),
          ...(participantId ? { participant_id: participantId } : {}),
          ...(query.from || query.to
            ? {
                session_date: {
                  ...(query.from ? { gte: fromDay(query.from as string)! } : {}),
                  ...(query.to ? { lte: fromDay(query.to as string)! } : {}),
                },
              }
            : {}),
        },
        include: logInclude,
        orderBy: [{ session_date: 'desc' }, { start_time: 'desc' }, { created_at: 'desc' }],
        take: limit,
      }),
      prisma.consent.findMany({
        where: { worker_id: workerId, status: CONSENT_STATUS.ACTIVE },
        select: { participant_id: true },
      }),
    ]);

    const consented = new Set(consents.map((consent) => consent.participant_id));
    res.json(
      new ApiResponse(200, 'daily logs fetched', rows.map((row) => toSummary(row, consented)))
    );
  } catch (error) {
    catchResponse(error, res);
  }
});

/** GET /worker/daily-logs/:id — the author's full view, private narrative included. */
export const getWorkerDailyLog = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const log = await loadOwnLog(numericId(req.params.id as string), workerId);
    res.json(new ApiResponse(200, 'daily log fetched', await detailOf(log, workerId)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * POST /worker/daily-logs  { participantId, ...fields } — starts a draft.
 *
 * The consent gate runs before anything is written; then the private row and
 * the structured row are created in one transaction so a log can never exist
 * in one layer without the other.
 */
export const createWorkerDailyLog = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const body = (req.body ?? {}) as { participantId?: unknown } & DailyLogFields;
    const participantId = Number(body.participantId);
    if (!Number.isInteger(participantId) || participantId < 1) {
      throw new ApiError(400, 'Some parts of this log need another look.', {
        participantId: 'Choose who this support was for.',
      });
    }

    await assertConsent(workerId, participantId, 'canAddDailyNote');
    const fields = readFields(body);
    await assertParticipantGoals(fields.goalIds, participantId);

    const sessionDate = todayUtc();
    const created = await prisma.$transaction(async (tx) => {
      const privateNote = await tx.dailyNotePrivate.create({
        data: {
          worker_id: workerId,
          participant_id: participantId,
          is_locked: false,
          ...privateData(fields, sessionDate),
        },
      });
      return tx.dailyNoteStructured.create({
        data: {
          participant_id: participantId,
          author_id: workerId,
          author_role: DAILY_LOG_AUTHOR_ROLE.WORKER,
          worker_id: workerId,
          private_note_id: privateNote.id,
          status: DAILY_LOG_STATUS.DRAFT,
          is_locked: false,
          ...structuredData(fields, sessionDate),
        },
        include: logInclude,
      });
    });

    res.status(201).json(new ApiResponse(201, 'daily log created', await detailOf(created, workerId)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/** Both rows of a draft, updated together. */
async function writeDraft(log: LogRow, fields: DailyLogFields, extra: Record<string, unknown> = {}) {
  return prisma.$transaction(async (tx) => {
    if (log.private_note_id) {
      await tx.dailyNotePrivate.update({
        where: { id: log.private_note_id },
        data: { ...privateData(fields, log.session_date), ...(extra.lock ? { is_locked: true } : {}) },
      });
    } else {
      // A row that somehow lost its private note gets one back, so the
      // narrative always has somewhere to live.
      const privateNote = await tx.dailyNotePrivate.create({
        data: {
          worker_id: log.worker_id!,
          participant_id: log.participant_id,
          is_locked: Boolean(extra.lock),
          ...privateData(fields, log.session_date),
        },
      });
      extra.private_note_id = privateNote.id;
    }
    const { lock: _lock, ...columns } = extra;
    return tx.dailyNoteStructured.update({
      where: { id: log.id },
      data: { ...structuredData(fields, log.session_date), ...columns },
      include: logInclude,
    });
  });
}

/** PATCH /worker/daily-logs/:id — save a draft. Refused once submitted. */
export const saveWorkerDailyLog = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const existing = await loadOwnLog(numericId(req.params.id as string), workerId);
    if (existing.status === DAILY_LOG_STATUS.SUBMITTED) {
      throw new ApiError(
        409,
        'This log has been submitted, so it can no longer be edited. Add a note to it instead.'
      );
    }

    await assertConsent(workerId, existing.participant_id, 'canAddDailyNote');
    const fields = readFields(req.body);
    await assertParticipantGoals(fields.goalIds, existing.participant_id);

    const saved = await writeDraft(existing, fields);
    res.json(new ApiResponse(200, 'daily log saved', await detailOf(saved, workerId)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * POST /worker/daily-logs/:id/submit
 *
 * Saves and finalises in one call so a log can never be locked holding
 * anything other than what was on screen. The evidence rule (1-3 goals, at
 * least one domain tag, a session date) is the shared function the form
 * already ran; a client that skips it gets a 400 with the same messages.
 * Locks both layers.
 */
export const submitWorkerDailyLog = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const existing = await loadOwnLog(numericId(req.params.id as string), workerId);
    if (existing.status === DAILY_LOG_STATUS.SUBMITTED) {
      throw new ApiError(409, 'This log has already been submitted.');
    }

    await assertConsent(workerId, existing.participant_id, 'canAddDailyNote');
    const fields = readFields(req.body);
    await assertParticipantGoals(fields.goalIds, existing.participant_id);

    const { ok, errors } = canSubmitDailyLog(fields, LAYER);
    if (!ok) throw new ApiError(400, 'This log is not ready to submit yet.', errors);

    const submitted = await writeDraft(existing, fields, {
      lock: true,
      status: DAILY_LOG_STATUS.SUBMITTED,
      submitted_at: new Date(),
      is_locked: true,
      goal_validated: true,
      domain_validated: true,
    });

    await writeAudit(req, {
      actorId: workerId,
      action: 'daily_log_submitted',
      targetId: submitted.id,
      details: {
        participantId: submitted.participant_id,
        sessionDate: toDay(submitted.session_date),
        goalIds: submitted.goal_ids,
      },
    });

    res.json(new ApiResponse(200, 'daily log submitted', await detailOf(submitted, workerId)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * POST /worker/daily-logs/:id/addenda
 *
 * The only write a submitted log accepts. The addendum sits beside the record,
 * never inside it, so the original text stays exactly as it was submitted.
 */
export const addWorkerAddendum = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const log = await loadOwnLog(numericId(req.params.id as string), workerId);
    if (log.status !== DAILY_LOG_STATUS.SUBMITTED) {
      throw new ApiError(400, 'This log is still a draft — edit it directly rather than adding a note.');
    }

    await assertConsent(workerId, log.participant_id, 'canAddDailyNote');

    const { text: body, reason } = (req.body ?? {}) as { text?: string; reason?: string };
    const errors = validateAddendum({ text: body, reason });
    if (Object.keys(errors).length > 0) {
      throw new ApiError(400, 'This note needs another look.', errors);
    }

    await prisma.dailyNoteAddendum.create({
      data: {
        note_id: log.id,
        added_by: workerId,
        added_by_role: ROLES.WORKER,
        addendum_text: body!.trim(),
        reason: reason?.trim() || null,
      },
    });

    await writeAudit(req, {
      actorId: workerId,
      action: 'daily_log_addendum_added',
      targetId: log.id,
      details: { participantId: log.participant_id, reason: reason?.trim() || null },
    });

    const updated = await loadOwnLog(log.id, workerId);
    res.status(201).json(new ApiResponse(201, 'note added', await detailOf(updated, workerId)));
  } catch (error) {
    catchResponse(error, res);
  }
});
