/**
 * Live verification of Governance Standing and the Learning Hub:
 *   GET   /worker/governance
 *   GET   /worker/governance/items/:key
 *   POST  /worker/governance/items/:key/acknowledge
 *   PATCH /worker/governance/items/:key/note
 *   GET   /worker/learning
 *   GET   /worker/learning/resources/:slug
 *   PATCH /worker/learning/resources/:slug
 *
 * Runs against the dev API (:4000) and the local DB. Creates throwaway
 * accounts, asserts the rules — append-only acknowledgement, per-version
 * standing, worker isolation, no reading of unpublished content — and removes
 * what it created. The first worker account is kept so the two screens can be
 * eyeballed afterwards.
 *
 *   cd apps/api && pnpm exec tsx --env-file=.env scripts/verify-worker-governance-learning.ts
 */
import {
  GOVERNANCE_ITEMS,
  GOVERNANCE_ITEM_STATUS,
  LEARNING_RESOURCES,
  LEARNING_RESOURCE_STATUS,
  WORKER_CREDENTIAL_KEYS,
} from '@tmg180/shared';
import { prisma } from '../src/config/prisma.js';

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

const day = (offset: number) => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
};

const PUBLISHED = LEARNING_RESOURCES.filter((r) => r.status === LEARNING_RESOURCE_STATUS.PUBLISHED);
const PENDING = LEARNING_RESOURCES.filter((r) => r.status !== LEARNING_RESOURCE_STATUS.PUBLISHED);

async function main() {
  console.log('\nWorker Governance Standing + Learning Hub — live verification\n');

  // --- accounts -----------------------------------------------------------
  const stamp = Date.now();
  const signUp = (email: string, role: string) =>
    call('POST', '/auth/sign-up', {
      body: {
        full_name: role === 'worker' ? 'Gov Worker' : 'Gov Participant',
        email,
        password: 'Worker1234!',
        role,
        consents: { terms_and_privacy: true, platform_provider_disclosure: true },
      },
    });

  const workerEmail = `gov.worker.${stamp}@tmg180.test`;
  const w = await signUp(workerEmail, 'worker');
  const o = await signUp(`gov.other.${stamp}@tmg180.test`, 'worker');
  const p = await signUp(`gov.participant.${stamp}@tmg180.test`, 'participant');
  check('accounts created', w.status === 201 && o.status === 201 && p.status === 201, [
    w.json.message,
    o.json.message,
    p.json.message,
  ]);
  const token: string = w.json.data.accessToken;
  const workerId: number = w.json.data.user.id;
  const otherToken: string = o.json.data.accessToken;
  const otherId: number = o.json.data.user.id;
  const participantToken: string = p.json.data.accessToken;
  const participantId: number = p.json.data.user.id;

  // --- guards -------------------------------------------------------------
  console.log('\nGuards');
  check('governance without a token → 401', (await call('GET', '/worker/governance')).status === 401);
  check(
    'governance with a participant token → 403',
    (await call('GET', '/worker/governance', { token: participantToken })).status === 403
  );
  check(
    'learning with a participant token → 403',
    (await call('GET', '/worker/learning', { token: participantToken })).status === 403
  );

  // --- governance: a fresh worker ----------------------------------------
  console.log('\nGovernance Standing — a worker who has confirmed nothing');
  const fresh = await call('GET', '/worker/governance', { token });
  check('GET /worker/governance → 200', fresh.status === 200, fresh.json.message);
  const standing = fresh.json.data;
  check('every catalogue item is listed', standing.items.length === GOVERNANCE_ITEMS.length, standing.items.length);
  check('three groups', standing.groups.length === 3);
  check(
    'nothing is confirmed yet',
    standing.items.every((item: any) => item.status === GOVERNANCE_ITEM_STATUS.NOT_STARTED)
  );
  check('awaitingReview counts them all', standing.summary.awaitingReview === GOVERNANCE_ITEMS.length);
  check(
    'credentials come back with the standing',
    standing.credentials.length === WORKER_CREDENTIAL_KEYS.length
  );
  check(
    'readiness counts items + credentials',
    standing.summary.readiness.total === GOVERNANCE_ITEMS.length + WORKER_CREDENTIAL_KEYS.length &&
      standing.summary.readiness.inOrder === 0,
    standing.summary.readiness
  );
  check('nothing reads as a rating', !('score' in standing.summary) && !('grade' in standing.summary));
  check('allInOrder is false', standing.summary.allInOrder === false);

  // --- one item -----------------------------------------------------------
  console.log('\nOne governance item');
  const KEY = 'mandatory_policies';
  const before = await call('GET', `/worker/governance/items/${KEY}`, { token });
  check('GET one item → 200', before.status === 200, before.json.message);
  check('status is not_started', before.json.data.status === GOVERNANCE_ITEM_STATUS.NOT_STARTED);
  check('the overview and points come with it', Boolean(before.json.data.item.overview) && before.json.data.item.points.length > 0);
  check(
    'history heads with the current version, pending',
    before.json.data.history.length === 1 &&
      before.json.data.history[0].current === true &&
      before.json.data.history[0].acknowledgedAt === null
  );
  check('no note yet', before.json.data.note === null);
  check('an unknown item → 404', (await call('GET', '/worker/governance/items/not_a_thing', { token })).status === 404);

  // --- acknowledging ------------------------------------------------------
  console.log('\nAcknowledging (append-only, per version)');
  const acked = await call('POST', `/worker/governance/items/${KEY}/acknowledge`, { token });
  check('POST acknowledge → 200', acked.status === 200, acked.json.message);
  check('status is confirmed', acked.json.data.status === GOVERNANCE_ITEM_STATUS.CONFIRMED);
  check('it records the version read', acked.json.data.acknowledgedVersion === 'v1');
  check('history shows the confirmation', acked.json.data.history[0].acknowledgedAt !== null);

  await call('POST', `/worker/governance/items/${KEY}/acknowledge`, { token });
  const rows = await prisma.workerGovernanceAcknowledgement.count({
    where: { worker_id: workerId, item_key: KEY },
  });
  check('confirming twice writes one row, not two', rows === 1, rows);
  check(
    'there is no route that un-acknowledges',
    (await call('DELETE', `/worker/governance/items/${KEY}/acknowledge`, { token })).status === 404
  );

  const afterAck = await call('GET', '/worker/governance', { token });
  check(
    'standing moves by exactly one',
    afterAck.json.data.summary.items.confirmed === 1 &&
      afterAck.json.data.summary.awaitingReview === GOVERNANCE_ITEMS.length - 1,
    afterAck.json.data.summary
  );

  // A version bump: an older confirmation must survive and the item must come
  // back for review rather than reading as done.
  await prisma.workerGovernanceAcknowledgement.create({
    data: { worker_id: workerId, item_key: 'practice_standards', item_version: 'v0' },
  });
  const superseded = await call('GET', '/worker/governance/items/practice_standards', { token });
  check(
    'an older version confirmed → needs_review',
    superseded.json.data.status === GOVERNANCE_ITEM_STATUS.NEEDS_REVIEW,
    superseded.json.data.status
  );
  check(
    'the old confirmation stays in history under the current one',
    superseded.json.data.history.length === 2 &&
      superseded.json.data.history[0].current === true &&
      superseded.json.data.history[0].acknowledgedAt === null &&
      superseded.json.data.history[1].version === 'v0' &&
      superseded.json.data.history[1].acknowledgedAt !== null,
    superseded.json.data.history
  );

  // --- private notes ------------------------------------------------------
  console.log('\nPersonal notes');
  const noted = await call('PATCH', `/worker/governance/items/${KEY}/note`, {
    token,
    body: { note: 'Re-read section 4 before the next plan review.' },
  });
  check('PATCH note → 200', noted.status === 200, noted.json.message);
  check('the note comes back', noted.json.data.note?.startsWith('Re-read section 4'));
  check('the standing list knows a note exists', (await call('GET', '/worker/governance', { token })).json.data.items.find((i: any) => i.key === KEY)?.hasNote === true);
  check(
    'a note over the limit → 400',
    (await call('PATCH', `/worker/governance/items/${KEY}/note`, { token, body: { note: 'x'.repeat(2001) } }))
      .status === 400
  );
  check(
    'PATCH with no note field → 400',
    (await call('PATCH', `/worker/governance/items/${KEY}/note`, { token, body: {} })).status === 400
  );
  const cleared = await call('PATCH', `/worker/governance/items/${KEY}/note`, { token, body: { note: '' } });
  check('an empty note clears it', cleared.json.data.note === null);
  const restored = await call('PATCH', `/worker/governance/items/${KEY}/note`, {
    token,
    body: { note: 'Ask about the updated safety wording.' },
  });
  check('and it can be written again', restored.json.data.note !== null);

  // --- renewals -----------------------------------------------------------
  console.log('\nRenewals share the credential dates');
  await call('PATCH', `/worker/credentials/first_aid?today=${day(0)}`, {
    token,
    body: { issuedAt: day(-300), expiresAt: day(10) },
  });
  const withRenewal = await call('GET', '/worker/governance', { token });
  check(
    'the soonest expiry becomes the next milestone',
    withRenewal.json.data.summary.nextRenewal?.type === 'first_aid' &&
      withRenewal.json.data.summary.nextRenewal?.daysLeft === 10,
    withRenewal.json.data.summary.nextRenewal
  );
  check(
    'a due-soon credential does not count as in order',
    withRenewal.json.data.credentials.find((c: any) => c.type === 'first_aid')?.status === 'due_soon'
  );

  // --- isolation ----------------------------------------------------------
  console.log('\nAnother worker sees none of it');
  const theirs = await call('GET', `/worker/governance/items/${KEY}`, { token: otherToken });
  check('their item is untouched', theirs.json.data.status === GOVERNANCE_ITEM_STATUS.NOT_STARTED);
  check('their history is empty of confirmations', theirs.json.data.history[0].acknowledgedAt === null);
  check('they cannot see the note', theirs.json.data.note === null);

  // --- learning hub -------------------------------------------------------
  console.log('\nLearning Hub');
  const hub = await call('GET', '/worker/learning', { token });
  check('GET /worker/learning → 200', hub.status === 200, hub.json.message);
  check('every reading is listed', hub.json.data.resources.length === LEARNING_RESOURCES.length);
  check('five modules, two libraries', hub.json.data.modules.length === 5 && hub.json.data.libraries.length === 2);
  check(
    'the split between published and still-to-come is reported',
    hub.json.data.summary.published === PUBLISHED.length &&
      hub.json.data.summary.awaitingContent === PENDING.length,
    hub.json.data.summary
  );
  check('nothing read yet', hub.json.data.summary.completed === 0 && hub.json.data.summary.saved === 0);
  check(
    'the list carries no bodies',
    hub.json.data.resources.every((r: any) => !('body' in r))
  );

  const SLUG = 'monthly-snapshot-guidance';
  const opened = await call('GET', `/worker/learning/resources/${SLUG}`, { token });
  check('GET one reading → 200', opened.status === 200, opened.json.message);
  check('it has a body', Boolean(opened.json.data.resource.body?.overview?.length));
  check('opening it is recorded', opened.json.data.resource.progress.openCount === 1);
  check(
    'related readings are all published',
    opened.json.data.related.length > 0 &&
      opened.json.data.related.every((r: any) =>
        PUBLISHED.some((published) => published.slug === r.slug)
      )
  );
  check(
    'it does not suggest itself',
    opened.json.data.related.every((r: any) => r.slug !== SLUG)
  );
  const reopened = await call('GET', `/worker/learning/resources/${SLUG}`, { token });
  check('re-opening counts again', reopened.json.data.resource.progress.openCount === 2);

  check(
    'a reading whose text is still to come cannot be opened → 409',
    (await call('GET', `/worker/learning/resources/${PENDING[0].slug}`, { token })).status === 409
  );
  check(
    'an unknown slug → 404',
    (await call('GET', '/worker/learning/resources/not-a-reading', { token })).status === 404
  );

  console.log('\nReading progress');
  const saved = await call('PATCH', `/worker/learning/resources/${SLUG}`, { token, body: { saved: true } });
  check('PATCH saved → 200', saved.status === 200 && saved.json.data.progress.savedAt !== null);
  const done = await call('PATCH', `/worker/learning/resources/${SLUG}`, { token, body: { completed: true } });
  check('PATCH completed → 200', done.status === 200 && done.json.data.progress.completedAt !== null);
  check('saving survives marking as read', done.json.data.progress.savedAt !== null);
  const hubAfter = await call('GET', '/worker/learning', { token });
  check(
    'the hub counts it',
    hubAfter.json.data.summary.completed === 1 && hubAfter.json.data.summary.saved === 1,
    hubAfter.json.data.summary
  );
  const undone = await call('PATCH', `/worker/learning/resources/${SLUG}`, { token, body: { completed: false } });
  check('marking as read undoes', undone.json.data.progress.completedAt === null);
  await call('PATCH', `/worker/learning/resources/${SLUG}`, { token, body: { completed: true } });

  check(
    'PATCH with nothing to change → 400',
    (await call('PATCH', `/worker/learning/resources/${SLUG}`, { token, body: {} })).status === 400
  );
  check(
    'PATCH with a non-boolean → 400',
    (await call('PATCH', `/worker/learning/resources/${SLUG}`, { token, body: { saved: 'yes' } })).status === 400
  );
  check(
    'progress cannot be recorded against unpublished content → 409',
    (await call('PATCH', `/worker/learning/resources/${PENDING[0].slug}`, { token, body: { saved: true } }))
      .status === 409
  );

  const theirHub = await call('GET', '/worker/learning', { token: otherToken });
  check(
    'another worker has their own progress',
    theirHub.json.data.summary.completed === 0 && theirHub.json.data.summary.saved === 0
  );

  // --- cleanup ------------------------------------------------------------
  for (const id of [otherId, participantId]) {
    await prisma.workerGovernanceAcknowledgement.deleteMany({ where: { worker_id: id } });
    await prisma.workerGovernanceNote.deleteMany({ where: { worker_id: id } });
    await prisma.workerLearningProgress.deleteMany({ where: { worker_id: id } });
    await prisma.workerCredential.deleteMany({ where: { worker_id: id } });
    await prisma.refreshToken.deleteMany({ where: { user_id: id } });
    await prisma.auditLog.deleteMany({ where: { actor_id: id } });
    await prisma.user.delete({ where: { id } });
  }

  console.log(
    `\n${passed} passed, ${failed} failed. Kept worker ${workerEmail} / Worker1234! for a look at ` +
      `/worker/governance and /worker/learning-hub.\n`
  );
  await prisma.$disconnect();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
