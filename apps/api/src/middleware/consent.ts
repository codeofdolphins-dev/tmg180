import type { RequestHandler } from 'express';
import { CONSENT_PERMISSIONS, CONSENT_STATUS } from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiResponse.js';
import { badRequest } from './errors.js';

/**
 * The consent gate (Build Guide §5; DB pack §3).
 *
 * A worker sees or adds participant-owned information only while the
 * participant holds an *active* `tmg_consent` grant for that worker with the
 * relevant permission switched on. Revocation or supersession takes effect on
 * the next request — there is no cache. Everything that touches a participant
 * on the worker side goes through `assertConsent` (controllers, when the
 * participant comes off a record) or `requireConsent` (routes, when the
 * participant is in the URL), so the rule lives in one place.
 *
 * Permission keys are the wire names from CONSENT_PERMISSIONS
 * (canViewProfile · canViewSnapshot · canAddDailyNote · canViewCheckins).
 * Passing several means "any of them".
 */

export const CONSENT_REQUIRED = 'consent_required';

type PermissionKey = (typeof CONSENT_PERMISSIONS)[number]['key'];

const COLUMN_BY_KEY = Object.fromEntries(
  CONSENT_PERMISSIONS.map((permission) => [permission.key, permission.column])
) as Record<string, string>;

export type ActiveConsent = {
  id: number;
  participant_id: number;
  worker_id: number | null;
  granted_at: Date | null;
  can_view_intake: boolean | null;
  can_view_snapshot: boolean | null;
  can_add_daily_note: boolean | null;
  can_view_checkins: boolean | null;
};

/** The participant's current grant to this worker, or null. */
export async function findActiveConsent(workerId: number, participantId: number) {
  return prisma.consent.findFirst({
    where: { worker_id: workerId, participant_id: participantId, status: CONSENT_STATUS.ACTIVE },
    orderBy: { created_at: 'desc' },
  });
}

export function consentAllows(consent: ActiveConsent | null, ...permissions: PermissionKey[]) {
  if (!consent) return false;
  if (permissions.length === 0) return true;
  return permissions.some((key) => {
    const column = COLUMN_BY_KEY[key];
    return column ? Boolean((consent as unknown as Record<string, unknown>)[column]) : false;
  });
}

/** The 403 every consent failure raises — the web routes it to No Consent Access. */
export const consentRequired = () =>
  new ApiError(
    403,
    "This participant-owned information is not available unless the participant has given consent.",
    { reason: CONSENT_REQUIRED }
  );

/**
 * Throws unless the worker currently holds an active grant with one of the
 * permissions. Returns the grant so callers can show what it covers.
 */
export async function assertConsent(
  workerId: number,
  participantId: number,
  ...permissions: PermissionKey[]
) {
  const consent = await findActiveConsent(workerId, participantId);
  if (!consentAllows(consent, ...permissions)) throw consentRequired();
  return consent!;
}

/**
 * Route guard for `/worker/participants/:participantId/...`. Runs after
 * requireAuth + requireRole(worker); the participant id comes from the URL.
 */
export function requireConsent(...permissions: PermissionKey[]): RequestHandler {
  return async function consentGuard(req, _res, next) {
    try {
      const participantId = Number(req.params.participantId);
      if (!Number.isInteger(participantId) || participantId < 1) {
        return next(badRequest('participantId must be a whole number.'));
      }
      const consent = await assertConsent(req.user!.id, participantId, ...permissions);
      req.consent = consent;
      next();
    } catch (error) {
      next(error);
    }
  };
}
