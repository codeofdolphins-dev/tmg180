import type { Request } from 'express';
import {
  ACCOUNT_STATUS,
  CONSENT_PERMISSIONS,
  CONSENT_STATUS,
  CONSENT_TYPE_WORKER_ACCESS,
  ROLES,
  WORKER_PROFILE_STATUS,
  DEFAULT_PREFERENCES,
  PRIVACY_AUDIT_ACTION_KEYS,
  validateConsentPermissions,
  validatePreferences,
} from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { ApiError, ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Privacy & Sharing (participant layer).
 *
 * The consent record is append-only, which is the whole reason it is worth
 * anything: changing what a worker can see writes a *new* row and marks the old
 * one superseded, and revoking stamps the row rather than deleting it. Nothing
 * below updates a grant's permissions in place, so "who could see what, when"
 * can always be reconstructed.
 *
 * Preferences are separate and are only defaults — they say what a grant may
 * include, never that anything is shared.
 */

const PERMISSION_BY_KEY = Object.fromEntries(
  CONSENT_PERMISSIONS.map((permission) => [permission.key, permission.column])
) as Record<string, string>;

type ConsentRow = {
  id: number;
  worker_id: number | null;
  consent_type: string;
  status: string;
  granted_at: Date | null;
  revoked_at: Date | null;
  revoked_reason: string | null;
  can_view_intake: boolean | null;
  can_view_snapshot: boolean | null;
  can_add_daily_note: boolean | null;
  can_view_checkins: boolean | null;
  superseded_by: number | null;
  created_at: Date;
  updated_at: Date;
  worker?: {
    id: number;
    full_name: string;
    email: string;
    relational_profile?: { display_name: string | null } | null;
  } | null;
};

const toConsent = (row: ConsentRow) => ({
  id: row.id,
  workerId: row.worker_id,
  workerName:
    row.worker?.relational_profile?.display_name?.trim() ||
    row.worker?.full_name ||
    'A worker who has since left TMG180',
  consentType: row.consent_type,
  status: row.status,
  grantedAt: row.granted_at,
  revokedAt: row.revoked_at,
  revokedReason: row.revoked_reason,
  supersededBy: row.superseded_by,
  updatedAt: row.updated_at,
  permissions: {
    canViewSnapshot: row.can_view_snapshot ?? false,
    canViewProfile: row.can_view_intake ?? false,
    canAddDailyNote: row.can_add_daily_note ?? false,
    canViewCheckins: row.can_view_checkins ?? false,
  },
});

const asInet = (value?: string) =>
  value && /^[0-9a-fA-F.:]+$/.test(value) ? value.replace(/^::ffff:/, '') : null;

function writeAudit(
  req: Request,
  entry: { actorId: number; action: string; targetId?: number; details?: object }
) {
  return prisma.auditLog.create({
    data: {
      actor_id: entry.actorId,
      actor_role: ROLES.PARTICIPANT,
      action: entry.action,
      target_type: 'consent',
      target_id: entry.targetId ?? null,
      details: entry.details ?? undefined,
      ip_address: asInet(req.ip),
    },
  });
}

// The worker's name as the participant knows it: the display name they chose
// for the directory when they set one, the account name otherwise — the same
// rule the directory card uses, so one person never shows under two names.
const consentInclude = {
  worker: {
    select: {
      id: true,
      full_name: true,
      email: true,
      relational_profile: { select: { display_name: true } },
    },
  },
} as const;

/** Preferences row, created on first read so the screen always has one. */
async function loadPreferences(participantId: number) {
  const row = await prisma.participantPrivacySettings.upsert({
    where: { participant_id: participantId },
    create: { participant_id: participantId, preferences: DEFAULT_PREFERENCES },
    update: {},
  });
  // Stored values win, defaults fill the gaps — a preference added later is
  // simply off (or its default) for everyone who has not seen it yet.
  return { ...DEFAULT_PREFERENCES, ...((row.preferences ?? {}) as Record<string, boolean>) };
}

/**
 * GET /participant/privacy
 *
 * One request for the whole screen: preferences, every consent record (active
 * and historical), and the audit entries a participant is meant to read.
 */
export const getPrivacy = asyncHandler(async (req, res) => {
  // Query values arrive as strings — anything but the literal 'true' keeps
  // the screen's default of the 10 most recent entries.
  const allAuditList = req.query.allAuditList === 'true';
  try {
    const participantId = req.user!.id;

    const [preferences, consents, audit] = await Promise.all([
      loadPreferences(participantId),
      prisma.consent.findMany({
        where: { participant_id: participantId },
        include: consentInclude,
        orderBy: [{ updated_at: 'desc' }, { id: 'desc' }],
      }),
      prisma.auditLog.findMany({
        where: { actor_id: participantId, action: { in: [...PRIVACY_AUDIT_ACTION_KEYS] } },
        orderBy: { created_at: 'desc' },
        ...(!allAuditList && { take: 10 }),
      }),
    ]);

    res.json(
      new ApiResponse(200, 'privacy fetched', {
        preferences,
        consents: (consents as ConsentRow[]).map(toConsent),
        audit: audit.map((entry) => ({
          id: Number(entry.id),
          action: entry.action,
          details: entry.details,
          createdAt: entry.created_at,
        })),
      })
    );
  } catch (error) {
    catchResponse(error, res);
  }
});

/** PATCH /participant/privacy/preferences — partial updates welcome. */
export const savePreferences = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const changes = (req.body ?? {}) as Record<string, boolean>;

    const errors = validatePreferences(changes);
    if (Object.keys(errors).length > 0) {
      throw new ApiError(400, 'That privacy preference could not be saved.', errors);
    }

    const current = await loadPreferences(participantId);
    const preferences = { ...current, ...changes };

    await prisma.participantPrivacySettings.update({
      where: { participant_id: participantId },
      data: { preferences },
    });

    // Each switch is logged by name: the audit log is where a participant
    // checks what they changed and when.
    for (const [key, value] of Object.entries(changes)) {
      if (current[key] === value) continue;
      await writeAudit(req, {
        actorId: participantId,
        action: 'privacy_preference_changed',
        details: { preference: key, enabled: value },
      });
    }

    res.json(new ApiResponse(200, 'preferences saved', preferences));
  } catch (error) {
    catchResponse(error, res);
  }
});

async function loadOwnConsent(id: number, participantId: number) {
  const consent = await prisma.consent.findFirst({
    where: { id, participant_id: participantId },
    include: consentInclude,
  });
  if (!consent) throw new ApiError(404, 'No such consent record.');
  return consent as unknown as ConsentRow;
}

const numericId = (value: string) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new ApiError(404, 'No such consent record.');
  return id;
};

/**
 * POST /participant/privacy/consents  { workerId, permissions }
 *
 * The grant — the one verb this screen was missing. The participant names a
 * worker and says which areas they may see; the row is created active with
 * those exact permissions and nothing else. The worker sees the person in
 * "Participants I support" on their next request. There is no acceptance
 * step on the worker's side: canon is that the participant decides.
 *
 * Who can be granted to: any worker with a *published* directory profile —
 * the same list the participant browses, so "who is this" is always
 * answerable. One active grant per worker at a time: a second attempt is a
 * 409 pointing at the existing one (edit or revoke that instead). A revoked
 * grant can be followed by a fresh one; the old row stays in history.
 */
export const grantConsent = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const body = (req.body ?? {}) as { workerId?: unknown; permissions?: Record<string, boolean> };

    const workerId = Number(body.workerId);
    if (!Number.isInteger(workerId) || workerId <= 0) {
      throw new ApiError(400, 'Choose a worker to share with.', { workerId: 'Choose a worker.' });
    }
    const permissions = body.permissions ?? {};
    const errors = validateConsentPermissions(permissions);
    if (Object.keys(errors).length > 0) {
      throw new ApiError(400, 'Those permissions could not be saved.', errors);
    }
    if (!Object.values(permissions).some(Boolean)) {
      throw new ApiError(400, 'Choose at least one area to share.', {
        permissions: 'Tick at least one area — otherwise there is nothing to grant.',
      });
    }

    const worker = await prisma.user.findFirst({
      where: {
        id: workerId,
        status: ACCOUNT_STATUS.ACTIVE,
        roles: { has: ROLES.WORKER },
        relational_profile: { status: WORKER_PROFILE_STATUS.PUBLISHED, opt_in: true },
      },
      select: { id: true },
    });
    if (!worker) {
      throw new ApiError(404, 'That worker is not in the directory.', {
        workerId: 'Only workers with a published profile can be given access.',
      });
    }

    const existing = await prisma.consent.findFirst({
      where: { participant_id: participantId, worker_id: workerId, status: CONSENT_STATUS.ACTIVE },
      select: { id: true },
    });
    if (existing) {
      throw new ApiError(409, 'This worker already has access. Change or remove it from the list instead.', {
        consentId: existing.id,
      });
    }

    const columns = Object.fromEntries(
      Object.entries(permissions).map(([key, value]) => [PERMISSION_BY_KEY[key]!, value])
    );
    const created = await prisma.consent.create({
      data: {
        participant_id: participantId,
        worker_id: workerId,
        consent_type: CONSENT_TYPE_WORKER_ACCESS,
        status: CONSENT_STATUS.ACTIVE,
        granted_at: new Date(),
        ...columns,
      },
      include: consentInclude,
    });

    await writeAudit(req, {
      actorId: participantId,
      action: 'consent_granted',
      targetId: created.id,
      details: { workerId, granted: Object.keys(permissions).filter((k) => permissions[k]) },
    });

    res.status(201).json(new ApiResponse(201, 'access granted', toConsent(created as unknown as ConsentRow)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * PATCH /participant/privacy/consents/:id
 *
 * Changing a grant supersedes it: the old row is stamped and pointed at a new
 * active row carrying the new permissions. The history stays readable, which is
 * what an append-only consent record is for.
 */
export const updateConsent = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const existing = await loadOwnConsent(numericId(req.params.id as string), participantId);

    if (existing.status !== CONSENT_STATUS.ACTIVE) {
      throw new ApiError(
        409,
        'This consent record is no longer active, so it cannot be changed. Grant access again instead.'
      );
    }

    const permissions = (req.body ?? {}) as Record<string, boolean>;
    const errors = validateConsentPermissions(permissions);
    if (Object.keys(errors).length > 0) {
      throw new ApiError(400, 'Those permissions could not be saved.', errors);
    }

    const columns = Object.fromEntries(
      Object.entries(permissions).map(([key, value]) => [PERMISSION_BY_KEY[key]!, value])
    );

    const replacement = await prisma.$transaction(async (tx) => {
      const created = await tx.consent.create({
        data: {
          participant_id: participantId,
          worker_id: existing.worker_id,
          consent_type: existing.consent_type,
          status: CONSENT_STATUS.ACTIVE,
          granted_at: new Date(),
          can_view_intake: existing.can_view_intake,
          can_view_snapshot: existing.can_view_snapshot,
          can_add_daily_note: existing.can_add_daily_note,
          can_view_checkins: existing.can_view_checkins,
          ...columns,
        },
        include: consentInclude,
      });

      await tx.consent.update({
        where: { id: existing.id },
        data: { status: CONSENT_STATUS.SUPERSEDED, superseded_by: created.id },
      });

      return created;
    });

    await writeAudit(req, {
      actorId: participantId,
      action: 'consent_updated',
      targetId: replacement.id,
      details: { workerId: existing.worker_id, changed: Object.keys(permissions) },
    });

    res.json(new ApiResponse(200, 'consent updated', toConsent(replacement as unknown as ConsentRow)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * POST /participant/privacy/consents/:id/revoke
 *
 * Revoking stamps the record — it is never deleted. A participant can revoke
 * without giving a reason; asking why someone withdrew consent as a condition
 * of withdrawing it would be its own kind of pressure.
 */
export const revokeConsent = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const existing = await loadOwnConsent(numericId(req.params.id as string), participantId);

    if (existing.status === CONSENT_STATUS.REVOKED) {
      throw new ApiError(409, 'This access has already been removed.');
    }
    if (existing.status !== CONSENT_STATUS.ACTIVE) {
      throw new ApiError(409, 'This consent record is no longer active.');
    }

    const { reason } = (req.body ?? {}) as { reason?: string };
    if (reason !== undefined && (typeof reason !== 'string' || reason.length > 500)) {
      throw new ApiError(400, 'That reason could not be saved.', {
        reason: 'Must be text up to 500 characters.',
      });
    }

    const revoked = await prisma.consent.update({
      where: { id: existing.id },
      data: {
        status: CONSENT_STATUS.REVOKED,
        revoked_at: new Date(),
        revoked_reason: reason?.trim() || null,
        can_view_intake: false,
        can_view_snapshot: false,
        can_add_daily_note: false,
        can_view_checkins: false,
      },
      include: consentInclude,
    });

    await writeAudit(req, {
      actorId: participantId,
      action: 'consent_revoked',
      targetId: revoked.id,
      details: { workerId: existing.worker_id, reason: reason?.trim() || null },
    });

    res.json(new ApiResponse(200, 'access removed', toConsent(revoked as unknown as ConsentRow)));
  } catch (error) {
    catchResponse(error, res);
  }
});
