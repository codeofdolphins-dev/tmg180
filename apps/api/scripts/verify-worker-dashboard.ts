/**
 * Live verification of the worker dashboard's two data sources:
 *   GET  /worker/credentials  ·  PATCH /worker/credentials/:type
 *   GET  /worker/daily-logs
 *
 * Runs against the dev API (:4000) and the local DB. Creates a throwaway worker
 * account (and a throwaway participant), seeds logs/consents through Prisma
 * (the worker write side is not built yet), asserts the rules, and removes
 * what it seeded — the worker account itself is kept so the dashboard can be
 * eyeballed afterwards.
 *
 *   cd apps/api && pnpm exec tsx --env-file=.env scripts/verify-worker-dashboard.ts
 */
import {
  CONSENT_STATUS,
  CREDENTIAL_STATUS,
  DAILY_LOG_AUTHOR_ROLE,
  DAILY_LOG_STATUS,
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
const TODAY = day(0);

async function main() {
  console.log('\nWorker dashboard — live verification\n');

  // --- accounts -----------------------------------------------------------
  const stamp = Date.now();
  const workerEmail = `dash.worker.${stamp}@tmg180.test`;
  const otherWorkerEmail = `dash.other.${stamp}@tmg180.test`;
  const signUp = (email: string) =>
    call('POST', '/auth/sign-up', {
      body: {
        full_name: 'Dash Worker',
        email,
        password: 'Worker1234!',
        role: 'worker',
        consents: { terms_and_privacy: true, platform_provider_disclosure: true },
      },
    });
  const w = await signUp(workerEmail);
  const o = await signUp(otherWorkerEmail);
  check('worker accounts created', w.status === 201 && o.status === 201, [w.json.message, o.json.message]);
  const workerToken: string = w.json.data.accessToken;
  const workerId: number = w.json.data.user.id;
  const otherToken: string = o.json.data.accessToken;
  const otherId: number = o.json.data.user.id;

  const participantEmail = `dash.participant.${stamp}@tmg180.test`;
  const p = await call('POST', '/auth/sign-up', {
    body: {
      full_name: 'Dash Participant',
      email: participantEmail,
      password: 'Participant1!',
      role: 'participant',
      consents: { terms_and_privacy: true, platform_provider_disclosure: true },
    },
  });
  check('participant account created', p.status === 201, p.json.message);
  const participantToken: string = p.json.data.accessToken;
  const participantId: number = p.json.data.user.id;
  const participantName: string = p.json.data.user.name;

  // --- separation ---------------------------------------------------------
  console.log('\nSeparation');
  for (const path of ['/worker/credentials', '/worker/daily-logs']) {
    const anon = await call('GET', path);
    check(`${path} without a token → 401`, anon.status === 401 && anon.json.success === false);
    const asParticipant = await call('GET', path, { token: participantToken });
    check(`${path} as participant → 403 JSON`, asParticipant.status === 403 && asParticipant.json.success === false);
  }
  const patchAsParticipant = await call('PATCH', '/worker/credentials/first_aid', {
    token: participantToken,
    body: { expiresAt: day(10) },
  });
  check('PATCH credentials as participant → 403', patchAsParticipant.status === 403);

  // --- credentials --------------------------------------------------------
  console.log('\nCredentials');
  const c0 = await call('GET', `/worker/credentials?today=${TODAY}`, { token: workerToken });
  check('GET credentials → 200', c0.status === 200, c0.json.message);
  check(
    'fresh worker gets one row per shared type, in shared order',
    JSON.stringify(c0.json.data.credentials.map((c: any) => c.type)) === JSON.stringify(WORKER_CREDENTIAL_KEYS)
  );
  check(
    'all needs_review with no dates',
    c0.json.data.credentials.every((c: any) => c.status === CREDENTIAL_STATUS.NEEDS_REVIEW && c.daysLeft === null)
  );
  check('summary counts 4 needs_review, no next', c0.json.data.summary.needsReview === 4 && c0.json.data.summary.next === null);
  check('rows exist in tmg_worker_credentials', (await prisma.workerCredential.count({ where: { worker_id: workerId } })) === 4);
  const cAgain = await call('GET', `/worker/credentials?today=${TODAY}`, { token: workerToken });
  check('second read does not duplicate rows', (await prisma.workerCredential.count({ where: { worker_id: workerId } })) === 4 && cAgain.status === 200);
  check('each credential carries the shared label', c0.json.data.credentials.find((c: any) => c.type === 'first_aid')?.label === 'First Aid Certification');

  const badToday = await call('GET', '/worker/credentials?today=19-08-2026', { token: workerToken });
  check('today=not-a-date → 400', badToday.status === 400);

  const dueSoon = await call('PATCH', `/worker/credentials/first_aid?today=${TODAY}`, {
    token: workerToken,
    body: { expiresAt: day(10), reference: 'FA-123' },
  });
  const fa = dueSoon.json.data?.credentials.find((c: any) => c.type === 'first_aid');
  check('expiry in 10 days → due_soon, daysLeft 10', dueSoon.status === 200 && fa?.status === CREDENTIAL_STATUS.DUE_SOON && fa?.daysLeft === 10, fa);
  check('reference stored', fa?.reference === 'FA-123');
  check('summary.next is first_aid', dueSoon.json.data.summary.next?.type === 'first_aid' && dueSoon.json.data.summary.dueSoon === 1);

  const expired = await call('PATCH', `/worker/credentials/wwcc?today=${TODAY}`, { token: workerToken, body: { expiresAt: day(-3) } });
  const ww = expired.json.data?.credentials.find((c: any) => c.type === 'wwcc');
  check('expiry 3 days ago → expired, daysLeft -3', ww?.status === CREDENTIAL_STATUS.EXPIRED && ww?.daysLeft === -3, ww);

  const fine = await call('PATCH', `/worker/credentials/public_liability_insurance?today=${TODAY}`, {
    token: workerToken,
    body: { issuedAt: day(-100), expiresAt: day(200) },
  });
  const pli = fine.json.data?.credentials.find((c: any) => c.type === 'public_liability_insurance');
  check('expiry in 200 days → up_to_date', pli?.status === CREDENTIAL_STATUS.UP_TO_DATE && pli?.daysLeft === 200 && pli?.issuedAt === day(-100));
  check('summary: 1 up to date, 1 due soon, 1 expired, 1 needs review, not all in order',
    fine.json.data.summary.upToDate === 1 && fine.json.data.summary.dueSoon === 1 && fine.json.data.summary.expired === 1 && fine.json.data.summary.needsReview === 1 && fine.json.data.summary.allInOrder === false);
  check('summary.next is still the soonest future expiry (first_aid), not the expired one', fine.json.data.summary.next?.type === 'first_aid');

  const boundary = await call('PATCH', `/worker/credentials/ndis_worker_screening?today=${TODAY}`, { token: workerToken, body: { expiresAt: day(30) } });
  const nds = boundary.json.data?.credentials.find((c: any) => c.type === 'ndis_worker_screening');
  check('expiry in exactly 30 days → due_soon (boundary inclusive)', nds?.status === CREDENTIAL_STATUS.DUE_SOON && nds?.daysLeft === 30);
  const boundary2 = await call('PATCH', `/worker/credentials/ndis_worker_screening?today=${TODAY}`, { token: workerToken, body: { expiresAt: day(31) } });
  check('expiry in 31 days → up_to_date', boundary2.json.data?.credentials.find((c: any) => c.type === 'ndis_worker_screening')?.status === CREDENTIAL_STATUS.UP_TO_DATE);

  const invalidDate = await call('PATCH', '/worker/credentials/first_aid', { token: workerToken, body: { expiresAt: 'soon' } });
  check('expiresAt "soon" → 400 with field error', invalidDate.status === 400 && invalidDate.json.data?.expiresAt, invalidDate.json);
  const inverted = await call('PATCH', '/worker/credentials/first_aid', { token: workerToken, body: { issuedAt: day(5), expiresAt: day(1) } });
  check('expiry before issue → 400 on expiresAt', inverted.status === 400 && inverted.json.data?.expiresAt);
  const unknownType = await call('PATCH', '/worker/credentials/forklift_licence', { token: workerToken, body: { expiresAt: day(5) } });
  check('unknown credential type → 404', unknownType.status === 404);
  const longRef = await call('PATCH', '/worker/credentials/first_aid', { token: workerToken, body: { reference: 'x'.repeat(256) } });
  check('reference over 255 chars → 400', longRef.status === 400 && longRef.json.data?.reference);

  const cleared = await call('PATCH', `/worker/credentials/wwcc?today=${TODAY}`, { token: workerToken, body: { expiresAt: '' } });
  check('clearing the expiry → needs_review again', cleared.json.data?.credentials.find((c: any) => c.type === 'wwcc')?.status === CREDENTIAL_STATUS.NEEDS_REVIEW);

  const otherView = await call('GET', `/worker/credentials?today=${TODAY}`, { token: otherToken });
  check('another worker sees their own untouched set, not this one', otherView.json.data.credentials.every((c: any) => c.status === CREDENTIAL_STATUS.NEEDS_REVIEW));

  // --- daily logs ---------------------------------------------------------
  console.log('\nDaily logs (read side)');
  const empty = await call('GET', '/worker/daily-logs', { token: workerToken });
  check('fresh worker → []', empty.status === 200 && Array.isArray(empty.json.data) && empty.json.data.length === 0);

  const consent = await prisma.consent.create({
    data: {
      participant_id: participantId,
      worker_id: workerId,
      consent_type: 'worker_access',
      status: CONSENT_STATUS.ACTIVE,
      granted_at: new Date(),
      can_add_daily_note: true,
      can_view_snapshot: true,
    },
  });
  const mk = (data: Record<string, unknown>) =>
    prisma.dailyNoteStructured.create({
      data: {
        participant_id: participantId,
        author_id: workerId,
        author_role: DAILY_LOG_AUTHOR_ROLE.WORKER,
        worker_id: workerId,
        session_date: new Date(`${TODAY}T00:00:00Z`),
        status: DAILY_LOG_STATUS.DRAFT,
        ...data,
      },
    });
  const todayDraft = await mk({
    start_time: new Date('1970-01-01T09:00:00Z'),
    end_time: new Date('1970-01-01T11:00:00Z'),
    service_type: 'In-home support',
    domain_tags: ['daily_living'],
  });
  const yesterdaySubmitted = await mk({
    session_date: new Date(`${day(-1)}T00:00:00Z`),
    start_time: new Date('1970-01-01T14:00:00Z'),
    status: DAILY_LOG_STATUS.SUBMITTED,
    submitted_at: new Date(),
    is_locked: true,
    goal_ids: [1, 2],
  });
  await prisma.dailyNoteAddendum.create({
    data: { note_id: yesterdaySubmitted.id, added_by: workerId, added_by_role: 'worker', addendum_text: 'Forgot to add…' },
  });
  const olderSubmitted = await mk({
    session_date: new Date(`${day(-5)}T00:00:00Z`),
    status: DAILY_LOG_STATUS.SUBMITTED,
    submitted_at: new Date(),
    is_locked: true,
  });
  // Noise that must never surface in this worker's list:
  const participantOwn = await prisma.dailyNoteStructured.create({
    data: {
      participant_id: participantId,
      author_id: participantId,
      author_role: DAILY_LOG_AUTHOR_ROLE.PARTICIPANT,
      session_date: new Date(`${TODAY}T00:00:00Z`),
      status: DAILY_LOG_STATUS.DRAFT,
    },
  });
  const otherWorkers = await prisma.dailyNoteStructured.create({
    data: {
      participant_id: participantId,
      author_id: otherId,
      author_role: DAILY_LOG_AUTHOR_ROLE.WORKER,
      worker_id: otherId,
      session_date: new Date(`${TODAY}T00:00:00Z`),
      status: DAILY_LOG_STATUS.DRAFT,
    },
  });

  const all = await call('GET', '/worker/daily-logs', { token: workerToken });
  check('lists exactly the worker\'s own three logs', all.status === 200 && all.json.data.length === 3, all.json.data?.map((l: any) => l.id));
  check('newest session first', all.json.data.map((l: any) => l.id).join(',') === [todayDraft.id, yesterdaySubmitted.id, olderSubmitted.id].join(','));
  const first = all.json.data[0];
  check('summary carries participant name', first.participant?.id === participantId && first.participant?.name === participantName, first.participant);
  check('times and service type round-trip', first.sessionDate === TODAY && first.startTime === '09:00' && first.endTime === '11:00' && first.serviceType === 'In-home support');
  check('consentActive true while the grant is active', all.json.data.every((l: any) => l.consentActive === true));
  const second = all.json.data[1];
  check('addenda counted on the submitted log', second.addendaCount === 1 && second.status === DAILY_LOG_STATUS.SUBMITTED && second.goalIds.length === 2);
  check('no private-narrative or long-text fields in the summary', !('impactText' in first) && !('privateNarrative' in first) && !('participantVoice' in first));
  check('participant-authored log about the same person is not in the worker list', !all.json.data.some((l: any) => l.id === participantOwn.id));
  check('another worker\'s log is not in the list', !all.json.data.some((l: any) => l.id === otherWorkers.id));

  const todays = await call('GET', `/worker/daily-logs?from=${TODAY}&to=${TODAY}`, { token: workerToken });
  check('from=to=today → just today\'s log', todays.json.data.length === 1 && todays.json.data[0].id === todayDraft.id);
  const submitted = await call('GET', '/worker/daily-logs?status=submitted', { token: workerToken });
  check('status=submitted → the two submitted logs', submitted.json.data.length === 2 && submitted.json.data.every((l: any) => l.status === 'submitted'));
  const limited = await call('GET', '/worker/daily-logs?limit=1', { token: workerToken });
  check('limit=1 → one row, the newest', limited.json.data.length === 1 && limited.json.data[0].id === todayDraft.id);
  const range = await call('GET', `/worker/daily-logs?from=${day(-6)}&to=${day(-2)}`, { token: workerToken });
  check('date range → only the 5-day-old log', range.json.data.length === 1 && range.json.data[0].id === olderSubmitted.id);
  check('limit=0 → 400', (await call('GET', '/worker/daily-logs?limit=0', { token: workerToken })).status === 400);
  check('limit=abc → 400', (await call('GET', '/worker/daily-logs?limit=abc', { token: workerToken })).status === 400);
  check('from=not-a-date → 400', (await call('GET', '/worker/daily-logs?from=yesterday', { token: workerToken })).status === 400);
  check('status=locked → 400', (await call('GET', '/worker/daily-logs?status=locked', { token: workerToken })).status === 400);

  const otherList = await call('GET', '/worker/daily-logs', { token: otherToken });
  check('the other worker sees only their own single log', otherList.json.data.length === 1 && otherList.json.data[0].id === otherWorkers.id);
  check('…and with no consent, consentActive is false', otherList.json.data[0].consentActive === false);

  await prisma.consent.update({ where: { id: consent.id }, data: { status: CONSENT_STATUS.REVOKED, revoked_at: new Date() } });
  const afterRevoke = await call('GET', '/worker/daily-logs', { token: workerToken });
  check('after revocation the logs stay in the worker\'s history…', afterRevoke.json.data.length === 3);
  check('…but consentActive drops to false', afterRevoke.json.data.every((l: any) => l.consentActive === false));

  // --- cleanup ------------------------------------------------------------
  const logIds = [todayDraft.id, yesterdaySubmitted.id, olderSubmitted.id, participantOwn.id, otherWorkers.id];
  await prisma.dailyNoteAddendum.deleteMany({ where: { note_id: { in: logIds } } });
  await prisma.dailyNoteStructured.deleteMany({ where: { id: { in: logIds } } });
  await prisma.consent.deleteMany({ where: { id: consent.id } });
  await prisma.workerCredential.deleteMany({ where: { worker_id: otherId } });
  await prisma.refreshToken.deleteMany({ where: { user_id: otherId } });
  await prisma.auditLog.deleteMany({ where: { actor_id: otherId } });
  await prisma.user.delete({ where: { id: otherId } });
  await prisma.refreshToken.deleteMany({ where: { user_id: participantId } });
  await prisma.auditLog.deleteMany({ where: { actor_id: participantId } });
  await prisma.user.delete({ where: { id: participantId } });

  console.log(`\n${passed} passed, ${failed} failed. Kept worker ${workerEmail} / Worker1234! (credentials set) for a look at the dashboard.\n`);
  await prisma.$disconnect();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
