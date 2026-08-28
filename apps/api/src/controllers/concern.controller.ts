import type { Request } from 'express';
import {
  CONCERN_LIMITS,
  CONCERN_STATUS,
  CONCERN_STATUS_KEYS,
  ROLES,
  canSubmitConcern,
  validateConcernResponse,
} from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { ApiError, ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { asInet } from '../utils/clientInfo.js';

/**
 * Concerns, complaints and feedback — Mandatory Policy 2's platform-level
 * ticket ("Complaint ticket; response record; referral/escalation record").
 *
 * Append-only. The ticket a participant raises is never edited, by them or by
 * governance; everything after it is a response row with an author and a
 * time, and governance's decisions (acknowledged, referred, closed) are stamps
 * on the ticket, not rewrites of it. That is what makes it a record.
 *
 * Two surfaces, two roles:
 *   participant — raise, read their own, add a follow-up to an open one.
 *   admin (Platform Governance) — read all, respond, move the status, refer.
 * There is deliberately no worker surface: a concern about a worker is not
 * shown to the worker by the platform. Policy 2: "Information is shared only
 * where necessary to understand the concern, respond appropriately, meet
 * legal obligations."
 */

const TARGET_TYPE = 'concern';

const responsesInclude = {
  responses: { orderBy: { created_at: 'asc' as const } },
} as const;

type ConcernRow = NonNullable<
  Awaited<ReturnType<typeof prisma.concern.findFirst<{ include: typeof responsesInclude }>>>
>;

function toConcern(row: ConcernRow, extra: { author?: { name: string; role: string } } = {}) {
  return {
    id: row.id,
    kind: row.kind,
    category: row.category,
    relatesTo: row.relates_to,
    about: row.about ?? '',
    description: row.description,
    whatWouldHelp: row.what_would_help ?? '',
    status: row.status,
    acknowledgedAt: row.acknowledged_at,
    referredTo: row.referred_to ?? '',
    referredAt: row.referred_at,
    closedAt: row.closed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    responsesCount: row.responses.length,
    responses: row.responses.map((response) => ({
      id: response.id,
      authorRole: response.author_role,
      text: response.text,
      createdAt: response.created_at,
    })),
    ...(extra.author ? { raisedBy: extra.author } : {}),
  };
}

function writeAudit(
  req: Request,
  entry: { actorId: number; actorRole: string; action: string; targetId: number; details?: object }
) {
  return prisma.auditLog.create({
    data: {
      actor_id: entry.actorId,
      actor_role: entry.actorRole,
      action: entry.action,
      target_type: TARGET_TYPE,
      target_id: entry.targetId,
      details: entry.details ?? undefined,
      ip_address: asInet(req.ip),
    },
  });
}

const numericId = (value: string) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new ApiError(404, 'No such concern.');
  return id;
};

const text = (value: unknown, max = CONCERN_LIMITS.maxText) =>
  typeof value === 'string' && value.trim() !== '' ? value.trim().slice(0, max) : null;

/* ----------------------------- participant ----------------------------- */

/** GET /participant/concerns — newest first. */
export const listConcerns = asyncHandler(async (req, res) => {
  try {
    const concerns = await prisma.concern.findMany({
      where: { raised_by: req.user!.id },
      include: responsesInclude,
      orderBy: [{ created_at: 'desc' }],
    });
    res.json(new ApiResponse(200, 'concerns fetched', concerns.map((row) => toConcern(row))));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * POST /participant/concerns
 *
 * Received the moment it saves — there is no draft, because "no one is
 * required to use legal language or formal wording" and a concern someone has
 * managed to write down should not then be asked to be finished.
 */
export const raiseConcern = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const body = (req.body ?? {}) as Record<string, unknown>;
    const fields = {
      kind: body.kind,
      category: body.category,
      relatesTo: body.relatesTo,
      about: body.about,
      description: body.description,
      whatWouldHelp: body.whatWouldHelp,
    };

    const { ok, errors } = canSubmitConcern(fields as never);
    if (!ok) throw new ApiError(400, 'Some parts of this need another look.', errors);

    const created = await prisma.concern.create({
      data: {
        raised_by: participantId,
        raised_by_role: ROLES.PARTICIPANT,
        kind: fields.kind as string,
        category: fields.category as string,
        relates_to: fields.relatesTo as string,
        about: text(fields.about, CONCERN_LIMITS.maxAbout),
        description: text(fields.description)!,
        what_would_help: text(fields.whatWouldHelp),
        status: CONCERN_STATUS.RECEIVED,
      },
      include: responsesInclude,
    });

    await writeAudit(req, {
      actorId: participantId,
      actorRole: ROLES.PARTICIPANT,
      action: 'concern_raised',
      targetId: created.id,
      details: { kind: created.kind, category: created.category, relatesTo: created.relates_to },
    });

    res.status(201).json(new ApiResponse(201, 'concern received', toConcern(created)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/** GET /participant/concerns/:id */
export const getConcern = asyncHandler(async (req, res) => {
  try {
    const concern = await prisma.concern.findFirst({
      where: { id: numericId(req.params.id as string), raised_by: req.user!.id },
      include: responsesInclude,
    });
    if (!concern) throw new ApiError(404, 'No such concern.');
    res.json(new ApiResponse(200, 'concern fetched', toConcern(concern)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/** POST /participant/concerns/:id/responses — a follow-up, in the participant's words. */
export const addConcernFollowUp = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const concern = await prisma.concern.findFirst({
      where: { id: numericId(req.params.id as string), raised_by: participantId },
      include: responsesInclude,
    });
    if (!concern) throw new ApiError(404, 'No such concern.');

    const body = (req.body ?? {}) as { text?: string };
    const errors = validateConcernResponse({ text: body.text }, { status: concern.status });
    if (Object.keys(errors).length > 0) {
      throw new ApiError(concern.status === CONCERN_STATUS.CLOSED ? 409 : 400, errors.text!, errors);
    }

    await prisma.concernResponse.create({
      data: {
        concern_id: concern.id,
        author_id: participantId,
        author_role: ROLES.PARTICIPANT,
        text: text(body.text)!,
      },
    });

    const updated = await prisma.concern.findUniqueOrThrow({
      where: { id: concern.id },
      include: responsesInclude,
    });
    res.status(201).json(new ApiResponse(201, 'follow-up added', toConcern(updated)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/* -------------------------------- admin -------------------------------- */

const authorInclude = {
  ...responsesInclude,
  author: { select: { full_name: true } },
} as const;

type AdminConcernRow = NonNullable<
  Awaited<ReturnType<typeof prisma.concern.findFirst<{ include: typeof authorInclude }>>>
>;

const toAdminConcern = (row: AdminConcernRow) =>
  toConcern(row, { author: { name: row.author.full_name, role: row.raised_by_role } });

/** GET /admin/concerns?status= — every ticket, newest first. Open ones by default. */
export const listAllConcerns = asyncHandler(async (req, res) => {
  try {
    const { status } = req.query as { status?: string };
    if (status && status !== 'all' && !CONCERN_STATUS_KEYS.includes(status)) {
      throw new ApiError(400, 'Not a concern status.', { status: 'Not one of the allowed options.' });
    }
    const where =
      status === 'all'
        ? {}
        : status
          ? { status }
          : { status: { not: CONCERN_STATUS.CLOSED } };

    const concerns = await prisma.concern.findMany({
      where,
      include: authorInclude,
      orderBy: [{ created_at: 'desc' }],
    });
    res.json(new ApiResponse(200, 'concerns fetched', concerns.map(toAdminConcern)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/** GET /admin/concerns/:id */
export const getConcernForGovernance = asyncHandler(async (req, res) => {
  try {
    const concern = await prisma.concern.findUnique({
      where: { id: numericId(req.params.id as string) },
      include: authorInclude,
    });
    if (!concern) throw new ApiError(404, 'No such concern.');
    res.json(new ApiResponse(200, 'concern fetched', toAdminConcern(concern)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * PATCH /admin/concerns/:id  body: { status?, response?, referredTo? }
 *
 * Governance's three moves, in one call so a response and the status it
 * implies land together: a response with no status is `responded`; a
 * `referredTo` with no status is `referred`. First acknowledgement and
 * closure are stamped once and never moved.
 */
export const updateConcern = asyncHandler(async (req, res) => {
  try {
    const adminId = req.user!.id;
    const concern = await prisma.concern.findUnique({
      where: { id: numericId(req.params.id as string) },
      include: authorInclude,
    });
    if (!concern) throw new ApiError(404, 'No such concern.');

    const body = (req.body ?? {}) as { status?: string; response?: string; referredTo?: string };
    const response = text(body.response);
    const referredTo = text(body.referredTo, 255);

    let status = body.status;
    if (status !== undefined && !CONCERN_STATUS_KEYS.includes(status)) {
      throw new ApiError(400, 'Not a concern status.', { status: 'Not one of the allowed options.' });
    }
    if (!status && referredTo) status = CONCERN_STATUS.REFERRED;
    if (!status && response) status = CONCERN_STATUS.RESPONDED;
    if (!status && !response && !referredTo) {
      throw new ApiError(400, 'Nothing to change.', {
        status: 'Give a status, a response or a referral.',
      });
    }

    const now = new Date();
    const updated = await prisma.$transaction(async (tx) => {
      if (response) {
        await tx.concernResponse.create({
          data: { concern_id: concern.id, author_id: adminId, author_role: ROLES.ADMIN, text: response },
        });
      }
      return tx.concern.update({
        where: { id: concern.id },
        data: {
          status,
          ...(status !== CONCERN_STATUS.RECEIVED && !concern.acknowledged_at
            ? { acknowledged_at: now }
            : {}),
          ...(referredTo ? { referred_to: referredTo, referred_at: now } : {}),
          ...(status === CONCERN_STATUS.CLOSED && !concern.closed_at ? { closed_at: now } : {}),
        },
        include: authorInclude,
      });
    });

    await writeAudit(req, {
      actorId: adminId,
      actorRole: ROLES.ADMIN,
      action: 'concern_updated',
      targetId: concern.id,
      details: { from: concern.status, to: updated.status, responded: Boolean(response), referredTo },
    });

    res.json(new ApiResponse(200, 'concern updated', toAdminConcern(updated)));
  } catch (error) {
    catchResponse(error, res);
  }
});
