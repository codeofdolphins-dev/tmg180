/**
 * Live verification of the Platform Governance surface:
 *   GET   /admin/overview
 *   GET   /admin/workers
 *   PATCH /admin/workers/:workerId/credentials/:type   { verified }
 * plus the worker-side rule that editing a credential clears its
 * verification stamp.
 *
 * Runs against the dev API (:4000) and the local DB. Creates throwaway
 * accounts (one admin — provisioned via Prisma, since admin is never
 * self-served — one worker, one participant), asserts every rule, and
 * removes what it created.
 *
 *   cd apps/api && pnpm exec tsx --env-file=.env scripts/verify-admin-workers.ts
 */
import { ACCOUNT_STATUS, CREDENTIAL_STATUS, GOVERNANCE_ITEMS, ROLES } from '@tmg180/shared';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/config/prisma.js';
import { env } from '../src/config/env.js';

const API = process.env.API_URL ?? 'http://localhost:4000/api/v1';

let passed = 0;
let failed = 0;
function check(label: string, ok: unknown, detail?: unknown) {
  if (ok) {
    passed += 1;
    console.log(`  ✓ ${label}`);
  } else {
    failed += 1;
    console.log(`  ✗ ${label}${detail !== undefined ? ` — ${JSON.stringify(detail)}` : ''}`);
  }
}

type Envelope<T> = { statusCode: number; message: string; data: T; success: boolean };
async function call<T = any>(
  method: string,
  path: string,
  { token, body }: { token?: string; body?: unknown } = {}
): Promise<{ status: number; json: Envelope<T> }> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json: Envelope<T>;
  try {
    json = JSON.parse(text);
  } catch {
    json = { statusCode: res.status, message: text.slice(0, 120), data: null as T, success: false };
  }
  return { status: res.status, json };
}

async function main() {
  console.log('\nPlatform Governance (admin) — live verification\n');

  const stamp = Date.now();
  const signUp = (role: string, email: string, name: string) =>
    call('POST', '/auth/sign-up', {
      body: {
        full_name: name,
        email,
        password: 'Worker1234!',
        role,
        consents: { terms_and_privacy: true, platform_provider_disclosure: true },
      },
    });

  // --- throwaway accounts --------------------------------------------------
  const w = await signUp('worker', `adm.worker.${stamp}@tmg180.test`, 'Verify Worker');
  const p = await signUp('participant', `adm.participant.${stamp}@tmg180.test`, 'Verify Participant');
  const workerToken: string = w.json.data.accessToken;
  const participantToken: string = p.json.data.accessToken;
  const workerId: number = w.json.data.user.id;
  const participantId: number = p.json.data.user.id;

  // Admin is provisioned, never signed up for — mirror prisma/seed.ts.
  const adminEmail = `adm.admin.${stamp}@tmg180.test`;
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      full_name: 'Throwaway Governance',
      password_hash: await bcrypt.hash('Governance1!', env.BCRYPT_SALT),
      roles: [ROLES.ADMIN],
      status: ACCOUNT_STATUS.ACTIVE,
    },
    select: { id: true },
  });
  const a = await call('POST', '/auth/sign-in', {
    body: { email: adminEmail, password: 'Governance1!' },
  });
  const adminToken: string = a.json.data.accessToken;
  check('provisioned admin can sign in', a.status === 200 && Boolean(adminToken));

  // --- guards --------------------------------------------------------------
  check('overview without a token is 401', (await call('GET', '/admin/overview')).status === 401);
  check(
    'overview with a worker token is 403',
    (await call('GET', '/admin/overview', { token: workerToken })).status === 403
  );
  check(
    'workers list with a participant token is 403',
    (await call('GET', '/admin/workers', { token: participantToken })).status === 403
  );
  check(
    'verification with a worker token is 403',
    (
      await call('PATCH', `/admin/workers/${workerId}/credentials/first_aid`, {
        token: workerToken,
        body: { verified: true },
      })
    ).status === 403
  );

  // --- overview ------------------------------------------------------------
  const before = (await call('GET', '/admin/overview', { token: adminToken })).json.data;
  check(
    'overview carries live aggregates',
    typeof before.workers.active === 'number' &&
      typeof before.workers.published === 'number' &&
      typeof before.participants.active === 'number' &&
      typeof before.credentials.awaiting === 'number' &&
      typeof before.consent.updates === 'number' &&
      typeof before.snapshots.locked === 'number',
    before
  );
  check(
    'governance expectation = active workers × current items',
    before.governance.expected === before.workers.active * GOVERNANCE_ITEMS.length
  );
  check(
    'snapshot coverage is judged against the previous month',
    before.snapshots.month < before.consent.month,
    before.snapshots
  );

  // --- registry ------------------------------------------------------------
  const list = (await call('GET', '/admin/workers', { token: adminToken })).json.data;
  const row = list.workers.find((entry: any) => entry.id === workerId);
  check('registry lists the new worker', Boolean(row));
  check(
    'a fresh worker: draft profile, nothing acknowledged, nothing recorded',
    row.publication.isPublished === false &&
      row.governance.confirmed === 0 &&
      row.governance.total === GOVERNANCE_ITEMS.length &&
      row.credentials.length === 4 &&
      row.credentials.every(
        (c: any) => c.status === CREDENTIAL_STATUS.NEEDS_REVIEW && !c.recorded && !c.verifiedAt
      ) &&
      row.credentialSummary.recorded === 0,
    row
  );

  // --- verification rules --------------------------------------------------
  const patch = (path: string, body: unknown) =>
    call('PATCH', path, { token: adminToken, body });

  check(
    'unknown credential type is 404',
    (await patch(`/admin/workers/${workerId}/credentials/drivers_licence`, { verified: true }))
      .status === 404
  );
  check(
    'non-boolean verified is 400',
    (await patch(`/admin/workers/${workerId}/credentials/first_aid`, { verified: 'yes' }))
      .status === 400
  );
  check(
    'verifying an empty credential is refused',
    (await patch(`/admin/workers/${workerId}/credentials/first_aid`, { verified: true })).status ===
      400
  );
  check(
    'a participant is not a worker — 404',
    (await patch(`/admin/workers/${participantId}/credentials/first_aid`, { verified: true }))
      .status === 404
  );
  check(
    'an unknown worker is 404',
    (await patch(`/admin/workers/999999999/credentials/first_aid`, { verified: true })).status ===
      404
  );

  // The worker records a credential through their own endpoint.
  const record = await call('PATCH', '/worker/credentials/first_aid?today=2026-08-25', {
    token: workerToken,
    body: { expiresAt: '2027-08-01', reference: 'FA-1234' },
  });
  check('worker records first aid', record.status === 200);

  const afterRecord = (await call('GET', '/admin/workers', { token: adminToken })).json.data;
  const recorded = afterRecord.workers
    .find((entry: any) => entry.id === workerId)
    .credentials.find((c: any) => c.type === 'first_aid');
  check(
    'admin sees the recorded credential, unverified',
    recorded.recorded &&
      recorded.status === CREDENTIAL_STATUS.UP_TO_DATE &&
      recorded.reference === 'FA-1234' &&
      recorded.verifiedAt === null
  );

  const midOverview = (await call('GET', '/admin/overview', { token: adminToken })).json.data;
  check(
    'overview counts the awaiting credential',
    midOverview.credentials.recorded === before.credentials.recorded + 1 &&
      midOverview.credentials.awaiting === before.credentials.awaiting + 1
  );

  // Verify it.
  const verified = await patch(`/admin/workers/${workerId}/credentials/first_aid`, {
    verified: true,
  });
  const verifiedRow = verified.json.data.worker.credentials.find(
    (c: any) => c.type === 'first_aid'
  );
  check(
    'verification stamps the credential and returns the fresh row',
    verified.status === 200 &&
      Boolean(verifiedRow.verifiedAt) &&
      verified.json.data.worker.credentialSummary.verified === 1 &&
      verified.json.data.worker.credentialSummary.awaiting === 0
  );

  const auditVerified = await prisma.auditLog.findMany({
    where: { actor_id: admin.id, action: 'worker_credential_verified' },
  });
  check(
    'the act is audited with the admin as actor',
    auditVerified.length === 1 &&
      auditVerified[0]!.actor_role === ROLES.ADMIN &&
      (auditVerified[0]!.details as any).workerId === workerId &&
      (auditVerified[0]!.details as any).credentialType === 'first_aid'
  );

  await patch(`/admin/workers/${workerId}/credentials/first_aid`, { verified: true });
  check(
    're-verifying is idempotent and not re-audited',
    (await prisma.auditLog.count({
      where: { actor_id: admin.id, action: 'worker_credential_verified' },
    })) === 1
  );

  // The stamp reaches the participant-facing credential view.
  const ownProfile = (await call('GET', '/worker/profile', { token: workerToken })).json.data;
  const publicCredential = ownProfile.credentials.find((c: any) => c.type === 'first_aid');
  check(
    'the public credential view carries verifiedAt',
    Boolean(publicCredential && publicCredential.verifiedAt)
  );

  // Editing what was verified takes the stamp off.
  await call('PATCH', '/worker/credentials/first_aid?today=2026-08-25', {
    token: workerToken,
    body: { expiresAt: '2028-01-01' },
  });
  const afterEdit = (await call('GET', '/admin/workers', { token: adminToken })).json.data;
  const editedRow = afterEdit.workers
    .find((entry: any) => entry.id === workerId)
    .credentials.find((c: any) => c.type === 'first_aid');
  check('a worker edit clears the verification stamp', editedRow.verifiedAt === null);

  // Re-verify, then remove verification explicitly.
  await patch(`/admin/workers/${workerId}/credentials/first_aid`, { verified: true });
  const removed = await patch(`/admin/workers/${workerId}/credentials/first_aid`, {
    verified: false,
  });
  const removedRow = removed.json.data.worker.credentials.find((c: any) => c.type === 'first_aid');
  check(
    'removing verification clears the stamp',
    removed.status === 200 && removedRow.verifiedAt === null
  );
  check(
    'the removal is audited once',
    (await prisma.auditLog.count({
      where: { actor_id: admin.id, action: 'worker_credential_verification_removed' },
    })) === 1
  );
  await patch(`/admin/workers/${workerId}/credentials/first_aid`, { verified: false });
  check(
    're-removing is idempotent and not re-audited',
    (await prisma.auditLog.count({
      where: { actor_id: admin.id, action: 'worker_credential_verification_removed' },
    })) === 1
  );

  const endOverview = (await call('GET', '/admin/overview', { token: adminToken })).json.data;
  check(
    'the overview settles back: one more recorded, none verified',
    endOverview.credentials.recorded === before.credentials.recorded + 1 &&
      endOverview.credentials.verified === before.credentials.verified
  );

  // --- cleanup ------------------------------------------------------------
  for (const id of [workerId, participantId, admin.id]) {
    await prisma.workerGovernanceAcknowledgement.deleteMany({ where: { worker_id: id } });
    await prisma.workerGovernanceNote.deleteMany({ where: { worker_id: id } });
    await prisma.workerLearningProgress.deleteMany({ where: { worker_id: id } });
    await prisma.workerCredential.deleteMany({ where: { worker_id: id } });
    await prisma.workerRelationalProfile.deleteMany({ where: { worker_id: id } });
    await prisma.workerProfileSupportingDetails.deleteMany({ where: { worker_id: id } });
    await prisma.refreshToken.deleteMany({ where: { user_id: id } });
    await prisma.auditLog.deleteMany({ where: { actor_id: id } });
    await prisma.user.delete({ where: { id } });
  }

  console.log(`\n${passed} passed, ${failed} failed. Throwaway accounts removed.\n`);
  await prisma.$disconnect();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
