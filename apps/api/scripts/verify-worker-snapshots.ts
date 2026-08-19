/**
 * Live verification of the worker view of Approved Monthly Snapshots:
 *   GET /worker/snapshots?participantId=&month=
 *   GET /worker/snapshots/:id
 *
 * Runs against the dev API (:4000) and the local DB. Creates throwaway
 * accounts (two workers, two participants), has the participant compile and
 * approve real snapshots through their own endpoints, seeds the consent grants
 * through Prisma (granting has no UI yet), asserts every rule, and removes
 * what it created.
 *
 *   cd apps/api && pnpm exec tsx --env-file=.env scripts/verify-worker-snapshots.ts
 */
import { CONSENT_STATUS, NONLINEAR_STATEMENT, SNAPSHOT_ACCESS } from '@tmg180/shared';
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

/** A day inside a month key, as "YYYY-MM-DD". */
const dayIn = (monthKey: string, day: number) => `${monthKey}-${String(day).padStart(2, '0')}`;

/** Two settled months, so nothing depends on today's date. */
const THIS_MONTH = '2026-05';
const LAST_MONTH = '2026-04';

async function main() {
  console.log('\nWorker approved snapshots — live verification\n');

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

  const w = await signUp('worker', `sn.worker.${stamp}@tmg180.test`, 'Snap Worker');
  const o = await signUp('worker', `sn.other.${stamp}@tmg180.test`, 'Other Worker');
  const p = await signUp('participant', `sn.participant.${stamp}@tmg180.test`, 'Robin Participant');
  const q = await signUp('participant', `sn.second.${stamp}@tmg180.test`, 'Ash Participant');
  check(
    'accounts created',
    [w, o, p, q].every((r) => r.status === 201),
    [w, o, p, q].map((r) => r.json.message)
  );

  const workerToken: string = w.json.data.accessToken;
  const workerId: number = w.json.data.user.id;
  const otherToken: string = o.json.data.accessToken;
  const otherId: number = o.json.data.user.id;
  const participantToken: string = p.json.data.accessToken;
  const participantId: number = p.json.data.user.id;
  const secondToken: string = q.json.data.accessToken;
  const secondId: number = q.json.data.user.id;

  // --- the participant's own month, built through their own endpoints -------
  console.log('\nParticipant builds two months');

  // Goals, so the snapshot has something to link to. Same derivation the
  // participant's My Goals section feeds.
  const profile = await prisma.participantProfile.create({
    data: { participant_id: participantId },
  });
  const section = await prisma.participantProfileSection.create({
    data: { profile_id: profile.id, section_key: 'my-goals', status: 'in_progress' },
  });
  await prisma.participantProfileAnswer.createMany({
    data: [
      {
        section_id: section.id,
        question_key: 'primary_aspiration',
        value: 'Get to the community garden each week',
      },
      {
        section_id: section.id,
        question_key: 'goal_steps',
        value: [{ text: 'Catch the bus on my own', done: false }],
      },
    ],
  });
  const goals = await call('GET', '/participant/goals', { token: participantToken });
  const goalIds: number[] = (goals.json.data ?? []).map((goal: any) => goal.id);
  check('participant has goals to link', goalIds.length >= 2, goals.json);

  /** One submitted participant log — the raw material a snapshot is compiled from. */
  const submitLog = async (
    token: string,
    sessionDate: string,
    domainTags: string[],
    comparison: string,
    minutes: [string, string]
  ) => {
    const draft = await call('POST', '/participant/daily-logs', { token, body: { sessionDate } });
    return call('POST', `/participant/daily-logs/${draft.json.data.id}/submit`, {
      token,
      body: {
        sessionDate,
        startTime: minutes[0],
        endTime: minutes[1],
        goalIds: [goalIds[0]],
        domainTags,
        impactText: 'Needed a hand getting out the door.',
        supportText: 'Worked through it slowly.',
        outcomeText: 'Made it to the garden.',
        comparison,
      },
    });
  };

  // THIS_MONTH: three logs across two consecutive days plus one later day.
  await submitLog(participantToken, dayIn(THIS_MONTH, 4), ['daily_living'], 'same_as_usual', ['09:00', '11:00']);
  await submitLog(participantToken, dayIn(THIS_MONTH, 5), ['daily_living', 'social_community'], 'better_than_usual', ['09:00', '10:30']);
  await submitLog(participantToken, dayIn(THIS_MONTH, 20), ['mobility_transport'], 'below_usual', ['13:00', '14:00']);
  // LAST_MONTH: one log, so the month filter has two months to choose between.
  await submitLog(participantToken, dayIn(LAST_MONTH, 12), ['self_care'], 'variable', ['10:00', '11:00']);

  const compiled = await call('POST', '/participant/snapshots', {
    token: participantToken,
    body: { monthYear: THIS_MONTH },
  });
  check('participant compiled the month', compiled.status === 201, compiled.json.message);
  const snapshotId: number = compiled.json.data.id;

  const approved = await call('POST', `/participant/snapshots/${snapshotId}/approve`, {
    token: participantToken,
    body: {
      participantStory: 'A slow month that got easier once the routine settled.',
      whatHelped: 'Someone meeting me at the gate.',
      goalLinkage: 'The garden trips are the goal, not a step towards it.',
    },
  });
  check('…approved and locked it', approved.status === 200 && approved.json.data.status === 'locked', approved.json.message);

  const older = await call('POST', '/participant/snapshots', {
    token: participantToken,
    body: { monthYear: LAST_MONTH },
  });
  const olderId: number = older.json.data.id;
  await call('POST', `/participant/snapshots/${olderId}/approve`, {
    token: participantToken,
    body: { participantStory: 'Quieter month.' },
  });

  // A draft that is never approved — it must not reach the worker at all.
  const secondProfile = await prisma.participantProfile.create({
    data: { participant_id: secondId },
  });
  const secondSection = await prisma.participantProfileSection.create({
    data: { profile_id: secondProfile.id, section_key: 'my-goals', status: 'in_progress' },
  });
  await prisma.participantProfileAnswer.create({
    data: { section_id: secondSection.id, question_key: 'primary_aspiration', value: 'Swim on Fridays' },
  });
  const secondGoals = await call('GET', '/participant/goals', { token: secondToken });
  const secondGoalIds: number[] = (secondGoals.json.data ?? []).map((goal: any) => goal.id);
  const secondDraft = await call('POST', '/participant/daily-logs', {
    token: secondToken,
    body: { sessionDate: dayIn(THIS_MONTH, 8) },
  });
  await call('POST', `/participant/daily-logs/${secondDraft.json.data.id}/submit`, {
    token: secondToken,
    body: {
      sessionDate: dayIn(THIS_MONTH, 8),
      goalIds: [secondGoalIds[0]],
      domainTags: ['health_wellbeing'],
      impactText: 'x',
      supportText: 'y',
      outcomeText: 'z',
    },
  });
  const secondCompiled = await call('POST', '/participant/snapshots', {
    token: secondToken,
    body: { monthYear: THIS_MONTH },
  });
  const secondSnapshotId: number = secondCompiled.json.data.id;
  check('second participant has a draft snapshot', secondCompiled.json.data.status === 'draft');

  // --- guards ---------------------------------------------------------------
  console.log('\nGuards');
  check('anonymous → 401', (await call('GET', '/worker/snapshots')).status === 401);
  check(
    'participant token → 403 on the worker surface',
    (await call('GET', '/worker/snapshots', { token: participantToken })).status === 403
  );
  const noGrants = await call('GET', '/worker/snapshots', { token: workerToken });
  check('no grants → empty list, not an error', noGrants.status === 200 && noGrants.json.data.length === 0, noGrants.json);
  check(
    'opening a snapshot with no grant → 403 consent_required',
    await (async () => {
      const r = await call('GET', `/worker/snapshots/${snapshotId}`, { token: workerToken });
      return r.status === 403 && r.json.data?.reason === 'consent_required';
    })()
  );
  check(
    '…and no view was recorded',
    (await prisma.auditLog.count({ where: { actor_id: workerId, action: 'snapshot_viewed' } })) === 0
  );

  // --- a grant that does not reach snapshots --------------------------------
  console.log('\nA grant without can_view_snapshot');
  const logsOnly = await prisma.consent.create({
    data: {
      participant_id: participantId,
      worker_id: workerId,
      consent_type: 'worker_access',
      status: CONSENT_STATUS.ACTIVE,
      granted_at: new Date(),
      can_view_snapshot: false,
      can_view_intake: false,
      can_add_daily_note: true,
      can_view_checkins: false,
    },
  });
  const daily = await call('GET', '/worker/snapshots', { token: workerToken });
  check('daily-note-only grant lists nothing', daily.status === 200 && daily.json.data.length === 0, daily.json.data);
  check(
    'daily-note-only grant → 403 on the snapshot',
    (await call('GET', `/worker/snapshots/${snapshotId}`, { token: workerToken })).status === 403
  );
  await prisma.consent.delete({ where: { id: logsOnly.id } });

  // --- summary-only grant ---------------------------------------------------
  console.log('\nSummary only (snapshots, not the Personal Profile)');
  const summaryGrant = await prisma.consent.create({
    data: {
      participant_id: participantId,
      worker_id: workerId,
      consent_type: 'worker_access',
      status: CONSENT_STATUS.ACTIVE,
      granted_at: new Date(),
      can_view_snapshot: true,
      can_view_intake: false,
      can_add_daily_note: false,
      can_view_checkins: false,
    },
  });

  const list = await call('GET', '/worker/snapshots', { token: workerToken });
  check('both approved months are listed', list.status === 200 && list.json.data.length === 2, list.json.data);
  check('newest month first', list.json.data[0]?.monthYear === THIS_MONTH && list.json.data[1]?.monthYear === LAST_MONTH);
  const card = list.json.data[0];
  check('card names the participant', card?.participant?.name === 'Robin Participant', card?.participant);
  check('card carries the month label', card?.monthLabel === 'May 2026', card?.monthLabel);
  check('card is locked', card?.status === 'locked');
  check('consent level reads "Summary only"', card?.access === SNAPSHOT_ACCESS.SUMMARY && card?.accessLabel === 'Summary only', card?.accessLabel);
  check('card counts the source logs', card?.logsCount === 3, card?.logsCount);
  check('last viewed is null before it is opened', card?.lastViewedAt === null, card?.lastViewedAt);
  check(
    'the other participant\'s draft is not listed',
    !list.json.data.some((row: any) => row.id === secondSnapshotId)
  );

  const summary = await call('GET', `/worker/snapshots/${snapshotId}`, { token: workerToken });
  check('summary-only read succeeds', summary.status === 200, summary.json.message);
  const s = summary.json.data;
  check('…carries the non-linear statement', s.nonlinearStatement === NONLINEAR_STATEMENT);
  check('…withholds the narrative', s.narrative === null, s.narrative);
  check('…withholds the addenda', s.addenda === null);
  check('…withholds the goal wording', s.stats.goals === null);
  check('…but says how many goals were touched', s.stats.goalsCount === 1, s.stats.goalsCount);
  check('…counts 3 logs over 3 days', s.stats.logsCount === 3 && s.stats.daysLogged === 3, s.stats);
  check('…finds the 2-day streak', s.stats.streakDays === 2, s.stats.streakDays);
  check('…totals the minutes', s.stats.totalMinutes === 270, s.stats.totalMinutes);
  check(
    '…tallies the areas of daily life',
    s.stats.domains.daily_living === 2 && s.stats.domains.social_community === 1 && s.stats.domains.mobility_transport === 1,
    s.stats.domains
  );
  check(
    '…tallies how the month compared with usual',
    s.stats.comparisons.same_as_usual === 1 && s.stats.comparisons.better_than_usual === 1 && s.stats.comparisons.below_usual === 1,
    s.stats.comparisons
  );
  check('…reports no previous view', s.lastViewedAt === null && s.viewCount === 0, { lastViewedAt: s.lastViewedAt, viewCount: s.viewCount });

  // --- the view record ------------------------------------------------------
  console.log('\nThe view record');
  const viewRow = await prisma.auditLog.findFirst({
    where: { actor_id: workerId, action: 'snapshot_viewed', target_id: snapshotId },
    orderBy: { created_at: 'desc' },
  });
  check('a snapshot_viewed row was written', Boolean(viewRow));
  check('…as the worker, against the snapshot', viewRow?.actor_role === 'worker' && viewRow?.target_type === 'monthly_snapshot');
  check('…recording the month and the access level', (viewRow?.details as any)?.monthYear === THIS_MONTH && (viewRow?.details as any)?.access === SNAPSHOT_ACCESS.SUMMARY, viewRow?.details);

  const listAfter = await call('GET', '/worker/snapshots', { token: workerToken });
  check('the list now shows when it was last viewed', Boolean(listAfter.json.data[0]?.lastViewedAt), listAfter.json.data[0]?.lastViewedAt);
  check('…and the other month is still "never"', listAfter.json.data[1]?.lastViewedAt === null);

  const second = await call('GET', `/worker/snapshots/${snapshotId}`, { token: workerToken });
  check('re-opening reports the previous view, not this one', Boolean(second.json.data.lastViewedAt) && second.json.data.viewCount === 1, {
    lastViewedAt: second.json.data.lastViewedAt,
    viewCount: second.json.data.viewCount,
  });
  check(
    'each open is one audit row',
    (await prisma.auditLog.count({ where: { actor_id: workerId, action: 'snapshot_viewed', target_id: snapshotId } })) === 2
  );

  // --- filters --------------------------------------------------------------
  console.log('\nFilters');
  const byMonth = await call('GET', `/worker/snapshots?month=${LAST_MONTH}`, { token: workerToken });
  check('month filter narrows to that month', byMonth.status === 200 && byMonth.json.data.length === 1 && byMonth.json.data[0].monthYear === LAST_MONTH, byMonth.json.data);
  const byPerson = await call('GET', `/worker/snapshots?participantId=${participantId}`, { token: workerToken });
  check('participant filter keeps their months', byPerson.json.data.length === 2);
  const byStranger = await call('GET', `/worker/snapshots?participantId=${secondId}`, { token: workerToken });
  check('filtering to a non-consenting participant is empty, not 403', byStranger.status === 200 && byStranger.json.data.length === 0, byStranger.status);
  const badMonth = await call('GET', '/worker/snapshots?month=May', { token: workerToken });
  check('a malformed month → 400 on month', badMonth.status === 400 && Boolean(badMonth.json.data?.month), badMonth.json);
  const badPerson = await call('GET', '/worker/snapshots?participantId=abc', { token: workerToken });
  check('a malformed participantId → 400', badPerson.status === 400 && Boolean(badPerson.json.data?.participantId), badPerson.json);
  const emptyParams = await call('GET', '/worker/snapshots?month=&participantId=', { token: workerToken });
  check('blank filters behave as no filter', emptyParams.status === 200 && emptyParams.json.data.length === 2);

  // --- drafts and other people ---------------------------------------------
  console.log('\nWhat is out of reach');
  const secondGrant = await prisma.consent.create({
    data: {
      participant_id: secondId,
      worker_id: workerId,
      consent_type: 'worker_access',
      status: CONSENT_STATUS.ACTIVE,
      granted_at: new Date(),
      can_view_snapshot: true,
      can_view_intake: true,
      can_add_daily_note: false,
      can_view_checkins: false,
    },
  });
  const withDraft = await call('GET', '/worker/snapshots', { token: workerToken });
  check('a consented participant\'s draft month is still not listed', withDraft.json.data.length === 2, withDraft.json.data.map((r: any) => r.monthYear));
  check(
    'opening the draft directly → 404',
    (await call('GET', `/worker/snapshots/${secondSnapshotId}`, { token: workerToken })).status === 404
  );
  await prisma.consent.delete({ where: { id: secondGrant.id } });

  check('an unknown id → 404', (await call('GET', '/worker/snapshots/99999999', { token: workerToken })).status === 404);
  check('a non-numeric id → 404', (await call('GET', '/worker/snapshots/abc', { token: workerToken })).status === 404);
  const otherWorker = await call('GET', '/worker/snapshots', { token: otherToken });
  check('another worker sees nothing', otherWorker.status === 200 && otherWorker.json.data.length === 0);
  check(
    'another worker cannot open it',
    (await call('GET', `/worker/snapshots/${snapshotId}`, { token: otherToken })).status === 403
  );

  // --- full shared ----------------------------------------------------------
  console.log('\nFull shared (the grant also covers the Personal Profile)');
  await prisma.consent.update({
    where: { id: summaryGrant.id },
    data: { can_view_intake: true },
  });
  const fullList = await call('GET', '/worker/snapshots', { token: workerToken });
  check('the card now reads "Full shared"', fullList.json.data[0]?.access === SNAPSHOT_ACCESS.FULL && fullList.json.data[0]?.accessLabel === 'Full shared', fullList.json.data[0]?.accessLabel);

  const full = await call('GET', `/worker/snapshots/${snapshotId}`, { token: workerToken });
  const f = full.json.data;
  check('the narrative is there now', f.narrative?.participantStory === 'A slow month that got easier once the routine settled.', f.narrative);
  check('…across all three layers', f.narrative?.whatHelped === 'Someone meeting me at the gate.' && f.narrative?.goalLinkage?.startsWith('The garden trips'), f.narrative);
  check('…and empty fields come back as empty strings, not missing', f.narrative?.whatGotInWay === '');
  check('goal wording is shared', Array.isArray(f.stats.goals) && f.stats.goals[0]?.text?.length > 0, f.stats.goals);
  check('…with how many logs touched it', f.stats.goals[0]?.logsCount === 3, f.stats.goals);
  check('the counts did not change with the access level', f.stats.logsCount === 3 && f.stats.totalMinutes === 270);

  // An addendum the participant adds after approval reaches a full grant.
  await call('POST', `/participant/snapshots/${snapshotId}/addenda`, {
    token: participantToken,
    body: { text: 'The bus route changed halfway through the month.', reason: 'Additional context' },
  });
  const withNote = await call('GET', `/worker/snapshots/${snapshotId}`, { token: workerToken });
  check('a participant note added after approval is shared', withNote.json.data.addenda?.length === 1, withNote.json.data.addenda);
  check('…with its reason and author', withNote.json.data.addenda[0]?.reason === 'Additional context' && withNote.json.data.addenda[0]?.authorRole === 'participant');
  check('…and the card counts it', (await call('GET', '/worker/snapshots', { token: workerToken })).json.data[0]?.addendaCount === 1);

  await prisma.consent.update({ where: { id: summaryGrant.id }, data: { can_view_intake: false } });
  const noteHidden = await call('GET', `/worker/snapshots/${snapshotId}`, { token: workerToken });
  check('back on a summary grant the note is withheld…', noteHidden.json.data.addenda === null);
  check('…though its existence is not hidden', noteHidden.json.data.addendaCount === 1);

  // --- one derivation, two readers -----------------------------------------
  // Both layers count the month through services/snapshotStats.ts. If they
  // ever disagree, a participant and their worker are reading two different
  // months under one name.
  console.log('\nThe participant and the worker see the same month');
  const own = await call('GET', `/participant/snapshots/${snapshotId}`, { token: participantToken });
  check('the participant can still read their own snapshot', own.status === 200, own.json.message);
  const mine = own.json.data.stats;
  const theirs = withNote.json.data.stats;
  check(
    'the counts match on both sides',
    mine.logsCount === theirs.logsCount &&
      mine.daysLogged === theirs.daysLogged &&
      mine.streakDays === theirs.streakDays &&
      mine.totalMinutes === theirs.totalMinutes,
    { participant: mine, worker: theirs }
  );
  check(
    'the tallies match',
    JSON.stringify(mine.domains) === JSON.stringify(theirs.domains) &&
      JSON.stringify(mine.comparisons) === JSON.stringify(theirs.comparisons)
  );
  check('the goals match', JSON.stringify(mine.goals) === JSON.stringify(theirs.goals), {
    participant: mine.goals,
    worker: theirs.goals,
  });
  check(
    'the first and last session dates match',
    mine.firstSessionDate === theirs.firstSessionDate && mine.lastSessionDate === theirs.lastSessionDate
  );
  check(
    "the participant's own narrative is untouched by any of this",
    own.json.data.participantStory === 'A slow month that got easier once the routine settled.'
  );

  // --- the snapshot is read-only -------------------------------------------
  console.log('\nRead-only by construction');
  for (const [method, path] of [
    ['POST', '/worker/snapshots'],
    ['PATCH', `/worker/snapshots/${snapshotId}`],
    ['DELETE', `/worker/snapshots/${snapshotId}`],
    ['POST', `/worker/snapshots/${snapshotId}/addenda`],
  ] as const) {
    const r = await call(method, path, { token: workerToken, body: { text: 'no' } });
    check(`${method} ${path} is not a route`, r.status === 404, r.status);
  }

  // --- revocation -----------------------------------------------------------
  console.log('\nAfter revocation');
  await prisma.consent.update({
    where: { id: summaryGrant.id },
    data: { status: CONSENT_STATUS.REVOKED, revoked_at: new Date(), can_view_snapshot: false },
  });
  const afterRevoke = await call('GET', '/worker/snapshots', { token: workerToken });
  check('the list closes', afterRevoke.status === 200 && afterRevoke.json.data.length === 0, afterRevoke.json.data);
  const openAfter = await call('GET', `/worker/snapshots/${snapshotId}`, { token: workerToken });
  check('an open snapshot closes with it', openAfter.status === 403 && openAfter.json.data?.reason === 'consent_required');
  check(
    'the refused read is not recorded as a view',
    // Five successful opens above; the 403 must not have added a sixth.
    (await prisma.auditLog.count({ where: { actor_id: workerId, action: 'snapshot_viewed', target_id: snapshotId } })) === 5
  );

  // --- cleanup --------------------------------------------------------------
  const snapshotIds = (
    await prisma.monthlySnapshot.findMany({
      where: { participant_id: { in: [participantId, secondId] } },
      select: { id: true },
    })
  ).map((row) => row.id);
  await prisma.snapshotAddendum.deleteMany({ where: { snapshot_id: { in: snapshotIds } } });
  await prisma.monthlySnapshot.deleteMany({ where: { id: { in: snapshotIds } } });

  const noteIds = (
    await prisma.dailyNoteStructured.findMany({
      where: { participant_id: { in: [participantId, secondId] } },
      select: { id: true, private_note_id: true },
    })
  );
  await prisma.dailyNoteAddendum.deleteMany({ where: { note_id: { in: noteIds.map((n) => n.id) } } });
  await prisma.dailyNoteStructured.deleteMany({ where: { id: { in: noteIds.map((n) => n.id) } } });
  await prisma.dailyNotePrivate.deleteMany({
    where: { id: { in: noteIds.map((n) => n.private_note_id!).filter(Boolean) } },
  });

  await prisma.consent.deleteMany({ where: { worker_id: { in: [workerId, otherId] } } });
  await prisma.participantGoal.deleteMany({ where: { participant_id: { in: [participantId, secondId] } } });
  for (const sectionId of [section.id, secondSection.id]) {
    await prisma.participantProfileAnswer.deleteMany({ where: { section_id: sectionId } });
  }
  await prisma.participantProfileSection.deleteMany({
    where: { id: { in: [section.id, secondSection.id] } },
  });
  await prisma.participantProfile.deleteMany({ where: { id: { in: [profile.id, secondProfile.id] } } });
  await prisma.workerCredential.deleteMany({ where: { worker_id: { in: [workerId, otherId] } } });
  for (const id of [workerId, otherId, participantId, secondId]) {
    await prisma.refreshToken.deleteMany({ where: { user_id: id } });
    await prisma.auditLog.deleteMany({ where: { actor_id: id } });
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
