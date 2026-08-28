import { createHash, randomBytes } from 'node:crypto';
import type { Request } from 'express';
import {
  DEFAULT_PREFERENCES,
  ROLES,
  SHARE_LINK_STATUS,
  SNAPSHOT_STATUS,
  monthLabel,
  shareAudienceLabel,
  shareLinkStatus,
  validateShareLinkFields,
} from '@tmg180/shared';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { snapshotFields } from '../services/snapshotRead.js';
import { statsForSourceLogs } from '../services/snapshotStats.js';
import { ApiError, ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { asInet } from '../utils/clientInfo.js';

/**
 * Time-limited share links to an approved Monthly Snapshot — the external
 * access layer for Template C9 (see snapshotShare.js for the rules).
 *
 * Two halves in one file because they are two ends of the same object:
 *
 *   Participant side — create, list, revoke. Only a locked snapshot, only
 *   while the `allow_share_links` preference is on, and every action written
 *   to `tmg_audit_log` under the participant.
 *
 *   Public side — one GET, no session. The token is the whole credential:
 *   its SHA-256 is looked up, the row must be active and unexpired, and the
 *   open is counted on the row and recorded in the audit log with no actor.
 *   That record is what the participant reads back as their access log.
 *
 * The token itself is returned once, on creation, inside the URL. It is not
 * stored and cannot be shown again: a participant who loses it revokes the
 * link and makes another, which is also the right answer to "who has this?".
 */

const TARGET_TYPE = 'snapshot_share_link';
const OPEN_ACTION = 'snapshot_link_opened';

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

const linkUrl = (token: string) => `${env.appUrl}/share/snapshot/${token}`;

type LinkRow = NonNullable<Awaited<ReturnType<typeof prisma.snapshotShareLink.findFirst>>>;

function toLink(row: LinkRow, extra: { monthYear?: string } = {}) {
  const status = shareLinkStatus({ status: row.status, expiresAt: row.expires_at });
  return {
    id: row.id,
    snapshotId: row.snapshot_id,
    monthYear: extra.monthYear,
    monthLabel: extra.monthYear ? monthLabel(extra.monthYear) : undefined,
    audience: row.audience,
    audienceLabel: shareAudienceLabel(row.audience),
    allowDownload: row.allow_download,
    status,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    revokedAt: row.revoked_at,
    lastOpenedAt: row.last_opened_at,
    openCount: row.open_count,
  };
}

function writeAudit(
  req: Request,
  entry: { actorId: number | null; actorRole: string; action: string; targetId: number; details?: object }
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

const numericId = (value: string, what: string) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new ApiError(404, `No such ${what}.`);
  return id;
};

async function loadOwnLockedSnapshot(id: number, participantId: number) {
  const snapshot = await prisma.monthlySnapshot.findFirst({
    where: { id, participant_id: participantId },
  });
  if (!snapshot) throw new ApiError(404, 'No such snapshot.');
  if (snapshot.status !== SNAPSHOT_STATUS.LOCKED) {
    throw new ApiError(400, 'Only an approved snapshot can be shared. Approve it first.');
  }
  return snapshot;
}

/** The `allow_share_links` preference, with the default filling a never-saved row. */
async function shareLinksAllowed(participantId: number) {
  const row = await prisma.participantPrivacySettings.findUnique({
    where: { participant_id: participantId },
  });
  const preferences = { ...DEFAULT_PREFERENCES, ...((row?.preferences ?? {}) as Record<string, boolean>) };
  return preferences.allow_share_links === true;
}

/** The access log for a set of links: every open, creation and revocation, newest first. */
async function eventsFor(linkIds: number[]) {
  if (linkIds.length === 0) return [];
  const rows = await prisma.auditLog.findMany({
    where: { target_type: TARGET_TYPE, target_id: { in: linkIds } },
    orderBy: { created_at: 'desc' },
  });
  return rows.map((row) => ({
    id: Number(row.id),
    linkId: row.target_id,
    action: row.action,
    actorRole: row.actor_role,
    details: row.details,
    createdAt: row.created_at,
  }));
}

/**
 * GET /participant/share-links — every link the participant has made, newest
 * first, across all their snapshots. The Privacy & Sharing rail.
 */
export const listShareLinks = asyncHandler(async (req, res) => {
  try {
    const links = await prisma.snapshotShareLink.findMany({
      where: { participant_id: req.user!.id },
      include: { snapshot: { select: { month_year: true } } },
      orderBy: [{ created_at: 'desc' }],
    });
    res.json(
      new ApiResponse(
        200,
        'share links fetched',
        links.map((row) => toLink(row, { monthYear: row.snapshot.month_year }))
      )
    );
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * GET /participant/snapshots/:id/share-links — this snapshot's links and its
 * access log, plus whether links may be created at all right now.
 */
export const listSnapshotShareLinks = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const snapshot = await prisma.monthlySnapshot.findFirst({
      where: { id: numericId(req.params.id as string, 'snapshot'), participant_id: participantId },
    });
    if (!snapshot) throw new ApiError(404, 'No such snapshot.');

    const [links, allowed] = await Promise.all([
      prisma.snapshotShareLink.findMany({
        where: { snapshot_id: snapshot.id },
        orderBy: [{ created_at: 'desc' }],
      }),
      shareLinksAllowed(participantId),
    ]);
    const events = await eventsFor(links.map((link) => link.id));

    res.json(
      new ApiResponse(200, 'share links fetched', {
        allowed,
        locked: snapshot.status === SNAPSHOT_STATUS.LOCKED,
        links: links.map((row) => toLink(row, { monthYear: snapshot.month_year })),
        events,
      })
    );
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * POST /participant/snapshots/:id/share-links
 *   body: { expiresInDays, audience, allowDownload }
 *
 * The one place a token exists in the clear: it is generated, hashed for the
 * row, and returned inside `url`. It is not logged.
 */
export const createShareLink = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const snapshot = await loadOwnLockedSnapshot(
      numericId(req.params.id as string, 'snapshot'),
      participantId
    );

    if (!(await shareLinksAllowed(participantId))) {
      throw new ApiError(
        403,
        'Time-limited export links are switched off in your Privacy & Sharing preferences. Turn them on there first.'
      );
    }

    const body = (req.body ?? {}) as {
      expiresInDays?: number | string;
      audience?: string;
      allowDownload?: boolean;
    };
    const errors = validateShareLinkFields(body);
    if (Object.keys(errors).length > 0) {
      throw new ApiError(400, 'Some parts of this link need another look.', errors);
    }

    const days = Number(body.expiresInDays);
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + days * 86_400_000);

    const created = await prisma.snapshotShareLink.create({
      data: {
        snapshot_id: snapshot.id,
        participant_id: participantId,
        token_hash: hashToken(token),
        audience: body.audience!,
        allow_download: body.allowDownload === true,
        status: SHARE_LINK_STATUS.ACTIVE,
        expires_at: expiresAt,
      },
    });

    await writeAudit(req, {
      actorId: participantId,
      actorRole: ROLES.PARTICIPANT,
      action: 'snapshot_link_created',
      targetId: created.id,
      details: {
        snapshotId: snapshot.id,
        monthYear: snapshot.month_year,
        audience: created.audience,
        expiresAt,
        allowDownload: created.allow_download,
      },
    });

    res.status(201).json(
      new ApiResponse(201, 'share link created', {
        ...toLink(created, { monthYear: snapshot.month_year }),
        url: linkUrl(token),
      })
    );
  } catch (error) {
    catchResponse(error, res);
  }
});

/** POST /participant/share-links/:linkId/revoke — final; a new link is a new row. */
export const revokeShareLink = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const link = await prisma.snapshotShareLink.findFirst({
      where: { id: numericId(req.params.linkId as string, 'link'), participant_id: participantId },
      include: { snapshot: { select: { month_year: true } } },
    });
    if (!link) throw new ApiError(404, 'No such link.');
    if (link.status === SHARE_LINK_STATUS.REVOKED) {
      throw new ApiError(409, 'This link has already been revoked.');
    }

    const revoked = await prisma.snapshotShareLink.update({
      where: { id: link.id },
      data: { status: SHARE_LINK_STATUS.REVOKED, revoked_at: new Date() },
    });

    await writeAudit(req, {
      actorId: participantId,
      actorRole: ROLES.PARTICIPANT,
      action: 'snapshot_link_revoked',
      targetId: link.id,
      details: { snapshotId: link.snapshot_id, monthYear: link.snapshot.month_year, audience: link.audience },
    });

    res.json(
      new ApiResponse(200, 'share link revoked', toLink(revoked, { monthYear: link.snapshot.month_year }))
    );
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * GET /public/snapshot-share/:token — no session.
 *
 * Every failure is the same 404 with the same words. A link that never
 * existed, one that has expired and one the participant revoked must be
 * indistinguishable from outside: the difference is the participant's
 * business, and the token is the only thing the caller has shown us.
 */
export const openSharedSnapshot = asyncHandler(async (req, res) => {
  try {
    const token = String(req.params.token ?? '');
    const gone = () =>
      new ApiError(
        404,
        'This link is not available. It may have expired or been withdrawn by the person who shared it.'
      );

    if (!/^[A-Za-z0-9_-]{32,64}$/.test(token)) throw gone();

    const link = await prisma.snapshotShareLink.findUnique({
      where: { token_hash: hashToken(token) },
      include: {
        snapshot: {
          include: {
            participant: { select: { full_name: true } },
            addenda: { orderBy: { created_at: 'desc' } },
          },
        },
      },
    });
    if (!link || shareLinkStatus({ status: link.status, expiresAt: link.expires_at }) !== SHARE_LINK_STATUS.ACTIVE) {
      throw gone();
    }
    const { snapshot } = link;
    // Belt and braces: a link only ever points at a locked snapshot, but the
    // snapshot is the thing being shown, so it is the thing that is checked.
    if (snapshot.status !== SNAPSHOT_STATUS.LOCKED) throw gone();

    const now = new Date();
    const [stats] = await Promise.all([
      statsForSourceLogs(snapshot.generated_from_notes),
      prisma.snapshotShareLink.update({
        where: { id: link.id },
        data: { last_opened_at: now, open_count: { increment: 1 } },
      }),
      writeAudit(req, {
        actorId: null,
        actorRole: 'public',
        action: OPEN_ACTION,
        targetId: link.id,
        details: { snapshotId: snapshot.id, monthYear: snapshot.month_year, audience: link.audience },
      }),
    ]);

    res.json(
      new ApiResponse(200, 'shared snapshot', {
        participantName: snapshot.participant.full_name,
        monthYear: snapshot.month_year,
        monthLabel: monthLabel(snapshot.month_year),
        lockedAt: snapshot.locked_at,
        approvedAt: snapshot.participant_approved_at,
        sourceLogsCount: snapshot.generated_from_notes.length,
        sourceCheckInsCount: snapshot.generated_from_checkins.length,
        audience: link.audience,
        audienceLabel: shareAudienceLabel(link.audience),
        allowDownload: link.allow_download,
        expiresAt: link.expires_at,
        ...snapshotFields(snapshot),
        nonlinearStatement: snapshot.nonlinear_statement,
        stats,
        addenda: snapshot.addenda.map((addendum) => ({
          id: addendum.id,
          text: addendum.addendum_text,
          reason: addendum.reason,
          authorRole: addendum.added_by_role,
          createdAt: addendum.created_at,
        })),
      })
    );
  } catch (error) {
    catchResponse(error, res);
  }
});
