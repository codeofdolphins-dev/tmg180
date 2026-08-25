/**
 * Live verification of the worker layer of the Daily Support Evidence Log:
 *   GET  /worker/participants · GET /worker/participants/:id/goals
 *   POST /worker/daily-logs · GET/PATCH /worker/daily-logs/:id
 *   POST …/submit · POST …/addenda
 *
 * Runs against the dev API (:4000) and the local DB. Creates throwaway
 * accounts (two workers, one participant), seeds the participant's goals and
 * the consent grant through Prisma (granting has no UI yet), asserts every
 * rule, and removes what it created.
 *
 *   cd apps/api && pnpm exec tsx --env-file=.env scripts/verify-worker-daily-log.ts
 */
import { CONSENT_STATUS, DAILY_LOG_STATUS } from '@tmg180/shared';
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
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
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
  console.log('\nWorker daily log — live verification\n');

  // --- accounts -----------------------------------------------------------
  const stamp = Date.now();
  const signUp = (role: string, email: string, name: string) =>
    call('POST', '/auth/sign-up', {
      body: { full_name: name, email, password: 'Worker1234!', role, consents: { terms_and_privacy: true, platform_provider_disclosure: true } },
    });
  const w = await signUp('worker', `dl.worker.${stamp}@tmg180.test`, 'Log Worker');
  const o = await signUp('worker', `dl.other.${stamp}@tmg180.test`, 'Other Worker');
  const p = await signUp('participant', `dl.participant.${stamp}@tmg180.test`, 'Jordan Participant');
  const q = await signUp('participant', `dl.stranger.${stamp}@tmg180.test`, 'Stranger Participant');
  check('accounts created', [w, o, p, q].every((r) => r.status === 201), [w, o, p, q].map((r) => r.json.message));
  const workerToken: string = w.json.data.accessToken;
  const workerId: number = w.json.data.user.id;
  const otherToken: string = o.json.data.accessToken;
  const otherId: number = o.json.data.user.id;
  const participantToken: string = p.json.data.accessToken;
  const participantId: number = p.json.data.user.id;
  const strangerId: number = q.json.data.user.id;
  const created: number[] = [];

  // Participant goals: written the way a participant really writes them —
  // through the My Goals profile section — so this also proves the save
  // derives the goal rows immediately (write-through, not read-on-demand).
  console.log('\nParticipant writes goals');
  const savedGoals = await call('PATCH', '/participant/profile/sections/goals', {
    token: participantToken,
    body: { answers: { primary_aspiration: 'Get out into the community more', goal_steps: [{ text: 'Catch the bus on my own', done: false }, { text: 'Join the Tuesday art group', done: false }] } },
  });
  check('My Goals section saves', savedGoals.status === 200, savedGoals.json);
  const goalRows = await prisma.participantGoal.findMany({ where: { participant_id: participantId, is_active: true }, orderBy: { goal_order: 'asc' } });
  check('goal rows exist immediately after the save, before anyone reads them', goalRows.length === 3 && goalRows[0].goal_text === 'Get out into the community more', goalRows.map((g) => g.goal_text));
  // A stranger's goal, to prove goals are checked against the right participant.
  const strangerGoal = await prisma.participantGoal.create({
    data: { participant_id: strangerId, goal_text: 'Someone else\'s goal', goal_order: 1 },
  });

  // --- before consent -----------------------------------------------------
  console.log('\nBefore any consent');
  const noOne = await call('GET', '/worker/participants', { token: workerToken });
  check('participants list is empty with no grants', noOne.status === 200 && noOne.json.data.length === 0);
  const goalsNoConsent = await call('GET', `/worker/participants/${participantId}/goals`, { token: workerToken });
  check('goals without consent → 403 consent_required', goalsNoConsent.status === 403 && goalsNoConsent.json.data?.reason === 'consent_required', goalsNoConsent.json);
  const createNoConsent = await call('POST', '/worker/daily-logs', { token: workerToken, body: { participantId, sessionDate: TODAY } });
  check('create without consent → 403 consent_required', createNoConsent.status === 403 && createNoConsent.json.data?.reason === 'consent_required');
  check('…and no rows were written', (await prisma.dailyNoteStructured.count({ where: { author_id: workerId } })) === 0 && (await prisma.dailyNotePrivate.count({ where: { worker_id: workerId } })) === 0);
  const createNoParticipant = await call('POST', '/worker/daily-logs', { token: workerToken, body: { sessionDate: TODAY } });
  check('create without participantId → 400 on participantId', createNoParticipant.status === 400 && createNoParticipant.json.data?.participantId);
  check('participant token → 403 on worker logs', (await call('GET', '/worker/daily-logs', { token: participantToken })).status === 403);
  check('anonymous → 401', (await call('GET', '/worker/participants')).status === 401);

  // --- grant (M-09: through the real API) -----------------------------------
  console.log('\nGranting access (POST /participant/privacy/consents)');
  const grantUnpublished = await call('POST', '/participant/privacy/consents', { token: participantToken, body: { workerId, permissions: { canAddDailyNote: true } } });
  check('grant to a worker with no published profile → 404 on workerId', grantUnpublished.status === 404 && grantUnpublished.json.data?.workerId, grantUnpublished.json);
  await call('PATCH', '/worker/profile', { token: workerToken, body: { relational_intro: 'Hello, I am the log worker.', optIn: true } });
  check('…worker publishes', (await call('POST', '/worker/profile/publish', { token: workerToken })).json.data?.publication?.isPublished === true);
  check('grant with no workerId → 400', (await call('POST', '/participant/privacy/consents', { token: participantToken, body: { permissions: { canAddDailyNote: true } } })).status === 400);
  const noAreas = await call('POST', '/participant/privacy/consents', { token: participantToken, body: { workerId, permissions: {} } });
  check('grant with no areas ticked → 400 on permissions', noAreas.status === 400 && noAreas.json.data?.permissions, noAreas.json);
  check('grant with an unknown permission key → 400', (await call('POST', '/participant/privacy/consents', { token: participantToken, body: { workerId, permissions: { canDoAnything: true } } })).status === 400);
  check('worker token cannot grant → 403', (await call('POST', '/participant/privacy/consents', { token: workerToken, body: { workerId, permissions: { canAddDailyNote: true } } })).status === 403);
  check('anonymous grant → 401', (await call('POST', '/participant/privacy/consents', { body: { workerId, permissions: { canAddDailyNote: true } } })).status === 401);
  const granted = await call('POST', '/participant/privacy/consents', { token: participantToken, body: { workerId, permissions: { canAddDailyNote: true } } });
  check('a valid grant → 201 active with exactly those permissions', granted.status === 201 && granted.json.data.status === CONSENT_STATUS.ACTIVE && granted.json.data.permissions.canAddDailyNote === true && granted.json.data.permissions.canViewProfile === false, granted.json);
  check('…named by the worker\'s account name (no display name set)', granted.json.data.workerName === 'Log Worker', granted.json.data.workerName);
  const dup = await call('POST', '/participant/privacy/consents', { token: participantToken, body: { workerId, permissions: { canViewSnapshot: true } } });
  check('a second grant to the same worker → 409 pointing at the existing one', dup.status === 409 && dup.json.data?.consentId === granted.json.data.id, dup.json);
  check('audit row consent_granted written', (await prisma.auditLog.count({ where: { actor_id: participantId, action: 'consent_granted', target_id: granted.json.data.id } })) === 1);
  const consent = { id: granted.json.data.id as number };
  // A display name on the worker's profile renames the consent row too.
  await call('PATCH', '/worker/profile', { token: workerToken, body: { displayName: 'Logan Shown' } });
  const privacyView = await call('GET', '/participant/privacy', { token: participantToken });
  check('consent row follows the worker\'s directory display name', privacyView.json.data.consents.some((c: any) => c.id === consent.id && c.workerName === 'Logan Shown'), privacyView.json.data.consents);
  await call('PATCH', '/worker/profile', { token: workerToken, body: { displayName: null } });
  // A view-only grant to the stranger: logs may not be added under it.
  const viewOnly = await prisma.consent.create({
    data: { participant_id: strangerId, worker_id: workerId, consent_type: 'worker_access', status: CONSENT_STATUS.ACTIVE, granted_at: new Date(), can_view_snapshot: true },
  });

  console.log('\nWith consent');
  const people = await call('GET', '/worker/participants', { token: workerToken });
  check('participants list shows both grants, alphabetical', people.json.data.length === 2 && people.json.data[0].name === 'Jordan Participant' && people.json.data[1].name === 'Stranger Participant', people.json.data);
  check('each carries its permissions + summary', people.json.data[0].consent.permissions.canAddDailyNote === true && people.json.data[1].consent.summary === 'Snapshots only', people.json.data.map((x: any) => x.consent));
  const goals = await call('GET', `/worker/participants/${participantId}/goals`, { token: workerToken });
  check('goals with consent → the participant\'s 3 derived goals, in order', goals.status === 200 && goals.json.data.length === 3 && goals.json.data[0].text === 'Get out into the community more', goals.json.data);
  const goalIds: number[] = goals.json.data.map((g: any) => g.id);
  const strangerGoals = await call('GET', `/worker/participants/${strangerId}/goals`, { token: workerToken });
  check('goals under a snapshots-only grant → 403 (needs canAddDailyNote or canViewProfile)', strangerGoals.status === 403);
  const viewOnlyCreate = await call('POST', '/worker/daily-logs', { token: workerToken, body: { participantId: strangerId, sessionDate: TODAY } });
  check('create under a snapshots-only grant → 403', viewOnlyCreate.status === 403);

  // --- create ---------------------------------------------------------------
  console.log('\nCreate / save');
  const createBad = await call('POST', '/worker/daily-logs', { token: workerToken, body: { participantId, sessionDate: 'yesterday', comparison: 'better_than_usual' } });
  check('malformed date + participant-vocab comparison → 400 on both fields', createBad.status === 400 && createBad.json.data?.sessionDate && createBad.json.data?.comparison, createBad.json.data);
  const wrongGoal = await call('POST', '/worker/daily-logs', { token: workerToken, body: { participantId, goalIds: [strangerGoal.id] } });
  check('a goal from another participant → 400 on goalIds', wrongGoal.status === 400 && wrongGoal.json.data?.goalIds);

  const c = await call('POST', '/worker/daily-logs', {
    token: workerToken,
    body: { participantId, sessionDate: TODAY, startTime: '09:00', endTime: '10:30', serviceType: 'In-home support', location: 'Home', privateNarrative: 'Remember to ask about the bus timetable', impactText: 'Tired after a poor night.' },
  });
  check('create → 201 with a draft', c.status === 201 && c.json.data.status === DAILY_LOG_STATUS.DRAFT, c.json);
  const logId: number = c.json.data.id;
  created.push(logId);
  check('detail carries participant, consentActive, times, service type', c.json.data.participant?.id === participantId && c.json.data.consentActive === true && c.json.data.startTime === '09:00' && c.json.data.durationMinutes === 90 && c.json.data.serviceType === 'In-home support');
  check('detail returns the private narrative to its author', c.json.data.privateNarrative === 'Remember to ask about the bus timetable');
  const row = await prisma.dailyNoteStructured.findUnique({ where: { id: logId }, include: { private_note: true } });
  check('structured row: author_role worker, worker_id = author_id, private_note_id set', row?.author_role === 'worker' && row?.worker_id === workerId && row?.author_id === workerId && row?.private_note_id !== null);
  check('private row: narrative stored in tmg_daily_note_private, not in the structured row', row?.private_note?.private_narrative === 'Remember to ask about the bus timetable' && row?.private_note?.worker_id === workerId && row?.private_note?.participant_id === participantId);

  const list = await call('GET', '/worker/daily-logs', { token: workerToken });
  const summary = list.json.data.find((l: any) => l.id === logId);
  check('list summary has no privateNarrative / impactText / participantVoice', summary && !('privateNarrative' in summary) && !('impactText' in summary) && !('participantVoice' in summary));

  const save = await call('PATCH', `/worker/daily-logs/${logId}`, {
    token: workerToken,
    body: { sessionDate: TODAY, startTime: '09:00', endTime: '11:00', goalIds: [goalIds[0], goalIds[1]], domainTags: ['daily_living'], comparison: 'more_support', participantVoice: 'I want to try the bus next week', safetyNote: 'None', privateNarrative: 'Updated private note', outcomeText: 'Made a plan.' },
  });
  check('save draft → 200 with the new values', save.status === 200 && save.json.data.goalIds.length === 2 && save.json.data.comparison === 'more_support' && save.json.data.durationMinutes === 120 && save.json.data.participantVoice === 'I want to try the bus next week' && save.json.data.privateNarrative === 'Updated private note', save.json.data);
  check('goals resolved on the detail', save.json.data.goals.length === 2 && save.json.data.goals[0].text === 'Get out into the community more');
  const privateAfter = await prisma.dailyNotePrivate.findUnique({ where: { id: row!.private_note_id! } });
  check('private row updated in step (times + narrative)', privateAfter?.private_narrative === 'Updated private note' && privateAfter?.end_time?.toISOString().slice(11, 16) === '11:00');

  const tooMany = await call('PATCH', `/worker/daily-logs/${logId}`, { token: workerToken, body: { goalIds: [goalIds[0], goalIds[1], goalIds[2], goalIds[0]] } });
  check('four goals → 400 on goalIds', tooMany.status === 400 && tooMany.json.data?.goalIds);
  const badDomain = await call('PATCH', `/worker/daily-logs/${logId}`, { token: workerToken, body: { domainTags: ['cooking'] } });
  check('unknown domain tag → 400', badDomain.status === 400 && badDomain.json.data?.domainTags);
  const longService = await call('PATCH', `/worker/daily-logs/${logId}`, { token: workerToken, body: { serviceType: 'x'.repeat(101) } });
  check('serviceType over 100 chars → 400', longService.status === 400 && longService.json.data?.serviceType);

  const peopleAfter = await call('GET', '/worker/participants', { token: workerToken });
  const jordan = peopleAfter.json.data.find((x: any) => x.id === participantId);
  check('participants list carries lastSupport (this log, today) and logCount 1', jordan?.lastSupport?.logId === logId && jordan?.lastSupport?.sessionDate === TODAY && jordan?.lastSupport?.status === 'draft' && jordan?.logCount === 1, jordan);
  check('…and null lastSupport / 0 for the person with no logs', peopleAfter.json.data.find((x: any) => x.id === strangerId)?.lastSupport === null && peopleAfter.json.data.find((x: any) => x.id === strangerId)?.logCount === 0);
  const filtered = await call('GET', `/worker/daily-logs?participantId=${participantId}`, { token: workerToken });
  check('list filtered by participantId → this log', filtered.json.data.length === 1 && filtered.json.data[0].id === logId);
  check('list filtered by a participant with no logs → []', (await call('GET', `/worker/daily-logs?participantId=${strangerId}`, { token: workerToken })).json.data.length === 0);
  check('participantId=abc → 400', (await call('GET', '/worker/daily-logs?participantId=abc', { token: workerToken })).status === 400);

  // --- isolation ------------------------------------------------------------
  console.log('\nIsolation');
  check('another worker reading this log → 404', (await call('GET', `/worker/daily-logs/${logId}`, { token: otherToken })).status === 404);
  check('another worker saving this log → 404', (await call('PATCH', `/worker/daily-logs/${logId}`, { token: otherToken, body: { impactText: 'x' } })).status === 404);
  check('another worker submitting it → 404', (await call('POST', `/worker/daily-logs/${logId}/submit`, { token: otherToken, body: {} })).status === 404);
  check('the participant cannot read it through the participant routes (403 role guard on worker, 404 on own)', (await call('GET', `/participant/daily-logs/${logId}`, { token: participantToken })).status === 404);
  const otherList = await call('GET', '/worker/daily-logs', { token: otherToken });
  check('the other worker\'s list is empty', otherList.json.data.length === 0);

  // --- submit ---------------------------------------------------------------
  console.log('\nSubmit / lock');
  const notReady = await call('POST', `/worker/daily-logs/${logId}/submit`, { token: workerToken, body: { sessionDate: TODAY, goalIds: [], domainTags: [] } });
  check('submit without goals/domains → 400 with both messages', notReady.status === 400 && notReady.json.data?.goalIds && notReady.json.data?.domainTags, notReady.json.data);
  check('…and the log is still a draft', (await prisma.dailyNoteStructured.findUnique({ where: { id: logId } }))?.status === 'draft');
  const addendumOnDraft = await call('POST', `/worker/daily-logs/${logId}/addenda`, { token: workerToken, body: { text: 'too early' } });
  check('addendum on a draft → 400', addendumOnDraft.status === 400);

  const submitted = await call('POST', `/worker/daily-logs/${logId}/submit`, {
    token: workerToken,
    body: { sessionDate: TODAY, startTime: '09:00', endTime: '11:00', goalIds: [goalIds[0]], domainTags: ['daily_living', 'communication'], comparison: 'typical', impactText: 'Final impact text', privateNarrative: 'Final private note' },
  });
  check('submit → 200, status submitted, submittedAt stamped', submitted.status === 200 && submitted.json.data.status === DAILY_LOG_STATUS.SUBMITTED && submitted.json.data.submittedAt, submitted.json);
  const lockedRow = await prisma.dailyNoteStructured.findUnique({ where: { id: logId }, include: { private_note: true } });
  check('both rows locked; goal/domain validated flags set', lockedRow?.is_locked === true && lockedRow?.private_note?.is_locked === true && lockedRow?.goal_validated === true && lockedRow?.domain_validated === true);
  check('submit saved what was on screen', lockedRow?.impact_text === 'Final impact text' && lockedRow?.private_note?.private_narrative === 'Final private note' && lockedRow?.baseline_comparison === 'typical');
  const audit = await prisma.auditLog.findFirst({ where: { action: 'daily_log_submitted', target_id: logId }, orderBy: { id: 'desc' } });
  check('audit row: daily_log_submitted by actor_role worker with participantId in details', audit?.actor_role === 'worker' && audit?.actor_id === workerId && (audit?.details as any)?.participantId === participantId);

  check('save after submit → 409', (await call('PATCH', `/worker/daily-logs/${logId}`, { token: workerToken, body: { impactText: 'nope' } })).status === 409);
  check('re-submit → 409', (await call('POST', `/worker/daily-logs/${logId}/submit`, { token: workerToken, body: {} })).status === 409);
  check('the text did not change', (await prisma.dailyNoteStructured.findUnique({ where: { id: logId } }))?.impact_text === 'Final impact text');

  // --- addenda --------------------------------------------------------------
  console.log('\nAddenda');
  const emptyNote = await call('POST', `/worker/daily-logs/${logId}/addenda`, { token: workerToken, body: { text: '   ' } });
  check('blank addendum → 400 on text', emptyNote.status === 400 && emptyNote.json.data?.text);
  const note = await call('POST', `/worker/daily-logs/${logId}/addenda`, { token: workerToken, body: { text: 'Forgot: we also phoned the bus company.', reason: 'Omitted detail' } });
  check('addendum → 201, appended with reason and worker role', note.status === 201 && note.json.data.addenda.length === 1 && note.json.data.addenda[0].reason === 'Omitted detail' && note.json.data.addenda[0].authorRole === 'worker', note.json.data?.addenda);
  check('addendaCount on the list follows', (await call('GET', '/worker/daily-logs', { token: workerToken })).json.data.find((l: any) => l.id === logId)?.addendaCount === 1);
  const auditNote = await prisma.auditLog.findFirst({ where: { action: 'daily_log_addendum_added', target_id: logId } });
  check('audit row for the addendum', auditNote?.actor_role === 'worker');

  // --- revocation -----------------------------------------------------------
  console.log('\nAfter revocation');
  const draft2 = await call('POST', '/worker/daily-logs', { token: workerToken, body: { participantId, sessionDate: day(-1) } });
  created.push(draft2.json.data.id);
  await prisma.consent.update({ where: { id: consent.id }, data: { status: CONSENT_STATUS.REVOKED, revoked_at: new Date(), can_add_daily_note: false } });
  check('participants list drops the person', !(await call('GET', '/worker/participants', { token: workerToken })).json.data.some((x: any) => x.id === participantId));
  check('own logs still readable (it is the worker\'s record)…', (await call('GET', `/worker/daily-logs/${logId}`, { token: workerToken })).status === 200);
  check('…with consentActive false', (await call('GET', `/worker/daily-logs/${logId}`, { token: workerToken })).json.data.consentActive === false);
  check('saving the remaining draft → 403 consent_required', (await call('PATCH', `/worker/daily-logs/${draft2.json.data.id}`, { token: workerToken, body: { impactText: 'x' } })).status === 403);
  check('submitting it → 403', (await call('POST', `/worker/daily-logs/${draft2.json.data.id}/submit`, { token: workerToken, body: { sessionDate: TODAY, goalIds: [goalIds[0]], domainTags: ['safety'] } })).status === 403);
  check('adding a note to the submitted log → 403', (await call('POST', `/worker/daily-logs/${logId}/addenda`, { token: workerToken, body: { text: 'late' } })).status === 403);
  check('starting a new log → 403', (await call('POST', '/worker/daily-logs', { token: workerToken, body: { participantId, sessionDate: TODAY } })).status === 403);
  check('goals → 403 again', (await call('GET', `/worker/participants/${participantId}/goals`, { token: workerToken })).status === 403);

  // --- cleanup --------------------------------------------------------------
  await prisma.dailyNoteAddendum.deleteMany({ where: { note_id: { in: created } } });
  const privateIds = (await prisma.dailyNoteStructured.findMany({ where: { id: { in: created } }, select: { private_note_id: true } })).map((r) => r.private_note_id!).filter(Boolean);
  await prisma.dailyNoteStructured.deleteMany({ where: { id: { in: created } } });
  await prisma.dailyNotePrivate.deleteMany({ where: { id: { in: privateIds } } });
  await prisma.consent.deleteMany({ where: { id: { in: [consent.id, viewOnly.id] } } });
  await prisma.workerProfileSupportingDetails.deleteMany({ where: { worker_id: { in: [workerId, otherId] } } });
  await prisma.workerRelationalProfile.deleteMany({ where: { worker_id: { in: [workerId, otherId] } } });
  await prisma.participantGoal.deleteMany({ where: { participant_id: { in: [participantId, strangerId] } } });
  await prisma.participantProfileAnswer.deleteMany({ where: { section: { profile: { participant_id: participantId } } } });
  await prisma.participantProfileSection.deleteMany({ where: { profile: { participant_id: participantId } } });
  await prisma.participantProfile.deleteMany({ where: { participant_id: participantId } });
  await prisma.workerCredential.deleteMany({ where: { worker_id: { in: [workerId, otherId] } } });
  for (const id of [workerId, otherId, participantId, strangerId]) {
    await prisma.refreshToken.deleteMany({ where: { user_id: id } });
    await prisma.auditLog.deleteMany({ where: { actor_id: id } });
    await prisma.participantPrivacySettings.deleteMany({ where: { participant_id: id } });
    await prisma.user.delete({ where: { id } });
  }

  console.log(`\n${passed} passed, ${failed} failed.\n`);
  await prisma.$disconnect();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
