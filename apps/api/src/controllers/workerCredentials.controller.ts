import {
  WORKER_CREDENTIAL_KEYS,
  credentialStatus,
  credentialSummary,
  credentialTypeLabel,
  validateCredentialFields,
} from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { ApiError, ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { fromDay, isDayString, serverToday, toDay } from '../utils/dbDates.js';

/**
 * Worker credentials — the data behind the dashboard's Governance Summary and
 * Governance Standing's renewals.
 *
 * Worker-owned (Technical Brief §7): every query is scoped to `req.user.id`
 * as the worker and nothing here reads another worker's rows. The set of
 * credential types is WORKER_CREDENTIAL_TYPES in @tmg180/shared; a row per
 * type is created on first read so the screen always shows the full set,
 * with "Needs review" meaning "you haven't told us yet", not a judgement.
 */

type CredentialRow = {
  id: number;
  credential_type: string;
  issued_at: Date | null;
  expires_at: Date | null;
  verified_at: Date | null;
  reference: string | null;
  notes: string | null;
  updated_at: Date;
};

/** The day standing is judged against — the client's, when it says; else the server's. */
export function todayFrom(query: Record<string, unknown>) {
  const value = query.today;
  if (value === undefined) return serverToday();
  if (!isDayString(value)) throw new ApiError(400, 'today must be a YYYY-MM-DD date.');
  return value;
}

function toCredential(row: CredentialRow, today: string) {
  const expiresAt = toDay(row.expires_at);
  const { status, daysLeft } = credentialStatus({ expiresAt }, today);
  return {
    type: row.credential_type,
    label: credentialTypeLabel(row.credential_type),
    issuedAt: toDay(row.issued_at),
    expiresAt,
    verifiedAt: row.verified_at,
    reference: row.reference,
    notes: row.notes,
    status,
    daysLeft,
    updatedAt: row.updated_at,
  };
}

/** Every type has a row after this; the order is the shared list's order. */
export async function loadCredentials(workerId: number, today: string) {
  await prisma.workerCredential.createMany({
    data: WORKER_CREDENTIAL_KEYS.map((credential_type) => ({ worker_id: workerId, credential_type })),
    skipDuplicates: true,
  });
  const rows = await prisma.workerCredential.findMany({ where: { worker_id: workerId } });
  const byType = new Map(rows.map((row) => [row.credential_type, row]));
  const credentials = WORKER_CREDENTIAL_KEYS.map((key) => toCredential(byType.get(key)!, today));
  return { today, credentials, summary: credentialSummary(credentials) };
}

/** GET /worker/credentials?today=YYYY-MM-DD */
export const listCredentials = asyncHandler(async (req, res) => {
  try {
    const today = todayFrom(req.query as Record<string, unknown>);
    res.json(new ApiResponse(200, 'credentials fetched', await loadCredentials(req.user!.id, today)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * PATCH /worker/credentials/:type  { issuedAt?, expiresAt?, reference?, notes? }
 *
 * The worker records what they hold; standing is recomputed from the dates on
 * the way back out. Clearing a date (null / "") takes the credential back to
 * "Needs review". Returns the full list so the screen never merges.
 */
export const updateCredential = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const type = String(req.params.type);
    if (!WORKER_CREDENTIAL_KEYS.includes(type)) throw new ApiError(404, 'No such credential.');

    const body = (req.body ?? {}) as Record<string, unknown>;
    const fields = {
      issuedAt: body.issuedAt as string | null | undefined,
      expiresAt: body.expiresAt as string | null | undefined,
      reference: body.reference as string | null | undefined,
    };
    const errors = validateCredentialFields(fields);
    if (typeof body.notes !== 'undefined' && body.notes !== null && typeof body.notes !== 'string') {
      errors.notes = 'Notes must be text.';
    }
    if (Object.keys(errors).length > 0) {
      throw new ApiError(400, 'That credential could not be saved.', errors);
    }

    // undefined = leave alone; null / "" = clear.
    const clear = (value: unknown) => value === null || value === '';
    const data = {
      issued_at: fields.issuedAt === undefined ? undefined : clear(fields.issuedAt) ? null : fromDay(fields.issuedAt),
      expires_at: fields.expiresAt === undefined ? undefined : clear(fields.expiresAt) ? null : fromDay(fields.expiresAt),
      reference: fields.reference === undefined ? undefined : clear(fields.reference) ? null : fields.reference,
      notes: body.notes === undefined ? undefined : clear(body.notes) ? null : (body.notes as string),
      // Admin verification (verified_at) attests to what was on file when the
      // admin looked. Touching the dates or reference changes what is on file,
      // so the stamp comes off and the credential goes back to the admin's
      // awaiting-verification queue. Notes are the worker's own and don't.
      ...(fields.issuedAt !== undefined ||
      fields.expiresAt !== undefined ||
      fields.reference !== undefined
        ? { verified_at: null }
        : {}),
    };

    await prisma.workerCredential.upsert({
      where: { worker_id_credential_type: { worker_id: workerId, credential_type: type } },
      create: { worker_id: workerId, credential_type: type, ...data },
      update: data,
    });

    const today = todayFrom(req.query as Record<string, unknown>);
    res.json(new ApiResponse(200, 'credential saved', await loadCredentials(workerId, today)));
  } catch (error) {
    catchResponse(error, res);
  }
});
