import {
  ACCOUNT_STATUS,
  GOVERNANCE_ITEMS,
  ROLES,
  WORKER_CREDENTIAL_KEYS,
  credentialStatus,
  credentialTypeLabel,
} from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { ApiError, ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { toDay } from '../utils/dbDates.js';
import { todayFrom } from './workerCredentials.controller.js';

/**
 * Platform Governance — the admin's read model over worker verification and
 * platform activity, plus the one admin write that exists: verifying a
 * worker's credential (Technical Brief §4 — the platform "verifies worker
 * eligibility documents and access conditions"; `verified_at` was the seam).
 *
 * Metadata only, per the Brief's role-separated data layers: names, counts,
 * publication state, credential dates and verification stamps. Nothing here
 * reads record *content* — no daily-note text, no snapshot narratives, no
 * profile answers.
 */

type CredentialRow = {
  id: number;
  worker_id: number;
  credential_type: string;
  issued_at: Date | null;
  expires_at: Date | null;
  verified_at: Date | null;
  reference: string | null;
};

/** The worker told us something about this credential — there is a record to verify. */
const isRecorded = (row: CredentialRow | undefined) =>
  Boolean(row && (row.issued_at || row.expires_at || row.reference));

/** The (item_key, item_version) pairs that count as "current" acknowledgements. */
const CURRENT_ACK_PAIRS = GOVERNANCE_ITEMS.map((item) => ({
  item_key: item.key,
  item_version: item.currentVersion,
}));

/** "YYYY-MM" of the day; `offset` shifts whole months (-1 = previous month). */
function monthKey(today: string, offset = 0) {
  const [year = 0, month = 1] = today.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, month - 1 + offset, 1));
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** First instant of a "YYYY-MM" month, for created_at/revoked_at range filters. */
const monthStart = (key: string) => new Date(`${key}-01T00:00:00Z`);

function shapeCredentials(rows: CredentialRow[], today: string) {
  const byType = new Map(rows.map((row) => [row.credential_type, row]));
  const credentials = WORKER_CREDENTIAL_KEYS.map((type) => {
    const row = byType.get(type);
    const expiresAt = toDay(row?.expires_at ?? null);
    const { status, daysLeft } = credentialStatus({ expiresAt }, today);
    return {
      type,
      label: credentialTypeLabel(type),
      issuedAt: toDay(row?.issued_at ?? null),
      expiresAt,
      reference: row?.reference ?? null,
      verifiedAt: row?.verified_at ?? null,
      recorded: isRecorded(row),
      status,
      daysLeft,
    };
  });
  const recorded = credentials.filter((c) => c.recorded).length;
  const verified = credentials.filter((c) => c.verifiedAt).length;
  return { credentials, summary: { recorded, verified, awaiting: recorded - verified } };
}

/** One registry row — the list entry and the PATCH response share this shape. */
function shapeWorker(
  user: { id: number; email: string; full_name: string; status: string },
  relational: { display_name: string | null; status: string; opt_in: boolean; published_at: Date | null } | null,
  acks: { item_key: string; item_version: string; acknowledged_at: Date }[],
  credentialRows: CredentialRow[],
  today: string
) {
  const currentAcks = acks.filter((ack) =>
    CURRENT_ACK_PAIRS.some(
      (pair) => pair.item_key === ack.item_key && pair.item_version === ack.item_version
    )
  );
  const lastAck = acks.reduce<Date | null>(
    (latest, ack) => (!latest || ack.acknowledged_at > latest ? ack.acknowledged_at : latest),
    null
  );
  const { credentials, summary } = shapeCredentials(credentialRows, today);
  const isPublished = relational?.status === 'published';

  return {
    id: user.id,
    name: relational?.display_name?.trim() || user.full_name,
    email: user.email,
    accountStatus: user.status,
    publication: {
      status: relational?.status ?? 'draft',
      optIn: relational?.opt_in ?? false,
      publishedAt: relational?.published_at ?? null,
      isPublished,
    },
    governance: {
      confirmed: currentAcks.length,
      total: GOVERNANCE_ITEMS.length,
      lastAcknowledgedAt: lastAck,
    },
    credentials,
    credentialSummary: summary,
  };
}

async function loadWorkerRow(workerId: number, today: string) {
  const user = await prisma.user.findFirst({
    where: { id: workerId, roles: { has: ROLES.WORKER } },
    select: { id: true, email: true, full_name: true, status: true },
  });
  if (!user) throw new ApiError(404, 'No such worker.');

  const [relational, acks, credentialRows] = await Promise.all([
    prisma.workerRelationalProfile.findUnique({
      where: { worker_id: workerId },
      select: { display_name: true, status: true, opt_in: true, published_at: true },
    }),
    prisma.workerGovernanceAcknowledgement.findMany({
      where: { worker_id: workerId },
      select: { item_key: true, item_version: true, acknowledged_at: true },
    }),
    prisma.workerCredential.findMany({ where: { worker_id: workerId } }),
  ]);
  return shapeWorker(user, relational, acks, credentialRows, today);
}

/**
 * GET /admin/overview — the numbers on the Platform Governance dashboard.
 * Every figure is a live aggregate; anything the platform cannot measure yet
 * simply is not in the payload (the screen shows it switched off, per the
 * "real or visibly switched off" rule — no invented numbers).
 */
export const overview = asyncHandler(async (req, res) => {
  try {
    const today = todayFrom(req.query as Record<string, unknown>);
    const thisMonth = monthKey(today);
    const lastMonth = monthKey(today, -1);

    const activeRole = (role: string) => ({
      roles: { has: role },
      status: ACCOUNT_STATUS.ACTIVE,
    });

    const [
      activeWorkers,
      activeParticipants,
      publishedProfiles,
      activeWorkerIds,
      credentialRows,
      consentGranted,
      consentRevoked,
      snapshotsLocked,
    ] = await Promise.all([
      prisma.user.count({ where: activeRole(ROLES.WORKER) }),
      prisma.user.count({ where: activeRole(ROLES.PARTICIPANT) }),
      prisma.workerRelationalProfile.count({
        where: { status: 'published', worker: activeRole(ROLES.WORKER) },
      }),
      prisma.user.findMany({ where: activeRole(ROLES.WORKER), select: { id: true } }),
      prisma.workerCredential.findMany({
        where: { worker: activeRole(ROLES.WORKER) },
        select: {
          id: true,
          worker_id: true,
          credential_type: true,
          issued_at: true,
          expires_at: true,
          verified_at: true,
          reference: true,
        },
      }),
      prisma.consent.count({ where: { created_at: { gte: monthStart(thisMonth) } } }),
      prisma.consent.count({ where: { revoked_at: { gte: monthStart(thisMonth) } } }),
      prisma.monthlySnapshot.count({
        where: { month_year: lastMonth, locked_at: { not: null } },
      }),
    ]);

    const ids = new Set(activeWorkerIds.map((row) => row.id));
    const acknowledged = await prisma.workerGovernanceAcknowledgement.count({
      where: { worker_id: { in: [...ids] }, OR: CURRENT_ACK_PAIRS },
    });

    const recorded = credentialRows.filter((row) => isRecorded(row)).length;
    const verified = credentialRows.filter((row) => row.verified_at).length;

    res.json(
      new ApiResponse(200, 'overview fetched', {
        today,
        workers: { active: activeWorkers, published: publishedProfiles },
        participants: { active: activeParticipants },
        governance: {
          acknowledged,
          expected: activeWorkers * GOVERNANCE_ITEMS.length,
          items: GOVERNANCE_ITEMS.length,
        },
        credentials: { recorded, verified, awaiting: recorded - verified },
        consent: { month: thisMonth, updates: consentGranted + consentRevoked },
        snapshots: { month: lastMonth, locked: snapshotsLocked, activeParticipants },
      })
    );
  } catch (error) {
    catchResponse(error, res);
  }
});

/** GET /admin/workers?today= — the registry every verification action starts from. */
export const listWorkers = asyncHandler(async (req, res) => {
  try {
    const today = todayFrom(req.query as Record<string, unknown>);

    const users = await prisma.user.findMany({
      where: { roles: { has: ROLES.WORKER } },
      select: { id: true, email: true, full_name: true, status: true },
    });
    const ids = users.map((user) => user.id);

    const [relationals, acks, credentialRows] = await Promise.all([
      prisma.workerRelationalProfile.findMany({
        where: { worker_id: { in: ids } },
        select: { worker_id: true, display_name: true, status: true, opt_in: true, published_at: true },
      }),
      prisma.workerGovernanceAcknowledgement.findMany({
        where: { worker_id: { in: ids } },
        select: { worker_id: true, item_key: true, item_version: true, acknowledged_at: true },
      }),
      prisma.workerCredential.findMany({ where: { worker_id: { in: ids } } }),
    ]);

    const relationalBy = new Map(relationals.map((row) => [row.worker_id, row]));
    const workers = users
      .map((user) =>
        shapeWorker(
          user,
          relationalBy.get(user.id) ?? null,
          acks.filter((ack) => ack.worker_id === user.id),
          credentialRows.filter((row) => row.worker_id === user.id),
          today
        )
      )
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

    res.json(new ApiResponse(200, 'workers fetched', { today, total: workers.length, workers }));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * PATCH /admin/workers/:workerId/credentials/:type  { verified: boolean }
 *
 * The admin verification act itself. Verifying stamps `verified_at`;
 * removing verification clears it. Rules:
 *   - only a credential the worker has recorded something on can be verified
 *     ("verify worker eligibility documents" — an empty row is no document);
 *   - both directions are idempotent and only audited when they change state;
 *   - the worker editing the credential later clears the stamp again
 *     (verification refers to what was on file when the admin looked).
 * Returns the worker's refreshed registry row.
 */
export const verifyCredential = asyncHandler(async (req, res) => {
  try {
    const workerId = Number(req.params.workerId);
    if (!Number.isInteger(workerId) || workerId <= 0) throw new ApiError(404, 'No such worker.');

    const type = String(req.params.type);
    if (!WORKER_CREDENTIAL_KEYS.includes(type)) throw new ApiError(404, 'No such credential.');

    const verified = (req.body ?? {}).verified;
    if (typeof verified !== 'boolean') {
      throw new ApiError(400, 'verified must be true or false.', { verified: 'Required.' });
    }

    const worker = await prisma.user.findFirst({
      where: { id: workerId, roles: { has: ROLES.WORKER } },
      select: { id: true },
    });
    if (!worker) throw new ApiError(404, 'No such worker.');

    const row = await prisma.workerCredential.findUnique({
      where: { worker_id_credential_type: { worker_id: workerId, credential_type: type } },
    });

    if (verified && !isRecorded(row ?? undefined)) {
      throw new ApiError(400, 'There is nothing recorded on this credential to verify yet.');
    }

    const changes = verified ? !row!.verified_at : Boolean(row?.verified_at);
    if (changes) {
      const saved = await prisma.workerCredential.update({
        where: { id: row!.id },
        data: { verified_at: verified ? new Date() : null },
        select: { id: true },
      });
      await prisma.auditLog.create({
        data: {
          actor_id: req.user!.id,
          actor_role: ROLES.ADMIN,
          action: verified ? 'worker_credential_verified' : 'worker_credential_verification_removed',
          target_type: 'worker_credential',
          target_id: saved.id,
          details: { workerId, credentialType: type },
        },
      });
    }

    const today = todayFrom(req.query as Record<string, unknown>);
    res.json(
      new ApiResponse(200, verified ? 'credential verified' : 'verification removed', {
        today,
        worker: await loadWorkerRow(workerId, today),
      })
    );
  } catch (error) {
    catchResponse(error, res);
  }
});
