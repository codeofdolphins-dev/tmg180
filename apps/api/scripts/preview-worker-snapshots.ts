/**
 * Drives the real Approved Monthly Snapshots screens in a real browser.
 *
 * The API suite proves the rules; this proves the pages render on them. It
 * creates a throwaway worker, participant, month of logs, approved snapshot and
 * consent grant, signs the worker in through the actual app, screenshots the
 * list and the detail at both consent levels, reports anything the console or
 * the error boundary produced, and then deletes every row it made. Nothing it
 * creates outlives the run — no demo data is left behind for a screen to lean
 * on.
 *
 * Needs the dev API (:4000) and the web dev server (:5173) up, and the cached
 * Playwright Chromium (no Playwright package — this speaks CDP directly over
 * Node's built-in WebSocket).
 *
 *   cd apps/api && pnpm exec tsx --env-file=.env scripts/preview-worker-snapshots.ts
 */
import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { CONSENT_STATUS } from '@tmg180/shared';
import { prisma } from '../src/config/prisma.js';

const API = process.env.API_URL ?? 'http://localhost:4000/api/v1';
const WEB = process.env.WEB_URL ?? 'http://localhost:5173';
const OUT = process.env.SHOT_DIR ?? join(process.cwd(), 'scripts', '.shots');

const MONTH = '2026-05';
const dayIn = (day: number) => `${MONTH}-${String(day).padStart(2, '0')}`;

const call = async (method: string, path: string, opts: { token?: string; body?: unknown } = {}) => {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });
  return { status: res.status, json: (await res.json()) as any };
};

/** The cached Chromium the Playwright browsers folder holds. */
function chromiumPath() {
  const root = join(homedir(), 'AppData', 'Local', 'ms-playwright');
  const dir = readdirSync(root).find((name) => name.startsWith('chromium-'));
  if (!dir) throw new Error('No cached Chromium under ' + root);
  // The folder is chrome-win on some builds, chrome-win64 on others.
  const inner = readdirSync(join(root, dir)).find((name) => name.startsWith('chrome-win'));
  if (!inner) throw new Error('No chrome-win* folder under ' + join(root, dir));
  return join(root, dir, inner, 'chrome.exe');
}

/** A minimal CDP client: one connection, awaited round trips, buffered events. */
async function connect(url: string) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let nextId = 1;
  const pending = new Map<number, (value: any) => void>();
  const events: { method: string; params: any }[] = [];

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data));
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)!(message);
      pending.delete(message.id);
    } else if (message.method) {
      events.push({ method: message.method, params: message.params });
    }
  });

  const send = (method: string, params: object = {}) =>
    new Promise<any>((resolve) => {
      const id = nextId++;
      pending.set(id, resolve);
      socket.send(JSON.stringify({ id, method, params }));
    });

  return { send, events, close: () => socket.close() };
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Set as soon as there are rows to remove, so a crash undoes them too. */
let teardown: (() => Promise<void>) | null = null;

async function main() {
  console.log('\nApproved Monthly Snapshots — browser preview\n');
  mkdirSync(OUT, { recursive: true });

  // --- throwaway data ------------------------------------------------------
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

  const w = await signUp('worker', `pv.worker.${stamp}@tmg180.test`, 'Preview Worker');
  const p = await signUp('participant', `pv.participant.${stamp}@tmg180.test`, 'Robin Participant');
  const workerId: number = w.json.data.user.id;
  const participantId: number = p.json.data.user.id;
  const participantToken: string = p.json.data.accessToken;
  console.log(`  worker #${workerId}, participant #${participantId}`);

  const profile = await prisma.participantProfile.create({ data: { participant_id: participantId } });
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
  const goalId: number = goals.json.data[0].id;

  for (const [day, tags, comparison, times] of [
    [4, ['daily_living'], 'same_as_usual', ['09:00', '11:00']],
    [5, ['daily_living', 'social_community'], 'better_than_usual', ['09:00', '10:30']],
    [20, ['mobility_transport'], 'below_usual', ['13:00', '14:00']],
  ] as [number, string[], string, [string, string]][]) {
    const draft = await call('POST', '/participant/daily-logs', {
      token: participantToken,
      body: { sessionDate: dayIn(day) },
    });
    await call('POST', `/participant/daily-logs/${draft.json.data.id}/submit`, {
      token: participantToken,
      body: {
        sessionDate: dayIn(day),
        startTime: times[0],
        endTime: times[1],
        goalIds: [goalId],
        domainTags: tags,
        impactText: 'Needed a hand getting out the door.',
        supportText: 'Worked through it slowly.',
        outcomeText: 'Made it to the garden.',
        comparison,
      },
    });
  }

  const compiled = await call('POST', '/participant/snapshots', {
    token: participantToken,
    body: { monthYear: MONTH },
  });
  const snapshotId: number = compiled.json.data.id;
  await call('POST', `/participant/snapshots/${snapshotId}/approve`, {
    token: participantToken,
    body: {
      participantStory: 'A slow month that got easier once the routine settled.',
      whatHelped: 'Someone meeting me at the gate.',
      goalLinkage: 'The garden trips are the goal, not a step towards it.',
    },
  });
  await call('POST', `/participant/snapshots/${snapshotId}/addenda`, {
    token: participantToken,
    body: { text: 'The bus route changed halfway through the month.', reason: 'Additional context' },
  });

  const grant = await prisma.consent.create({
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
  console.log('  seeded one approved May 2026 snapshot behind a summary-only grant');

  teardown = async () => {
    const snapshots = (
      await prisma.monthlySnapshot.findMany({
        where: { participant_id: participantId },
        select: { id: true },
      })
    ).map((row) => row.id);
    await prisma.snapshotAddendum.deleteMany({ where: { snapshot_id: { in: snapshots } } });
    await prisma.monthlySnapshot.deleteMany({ where: { id: { in: snapshots } } });
    const notes = await prisma.dailyNoteStructured.findMany({
      where: { participant_id: participantId },
      select: { id: true, private_note_id: true },
    });
    await prisma.dailyNoteAddendum.deleteMany({ where: { note_id: { in: notes.map((n) => n.id) } } });
    await prisma.dailyNoteStructured.deleteMany({ where: { id: { in: notes.map((n) => n.id) } } });
    await prisma.dailyNotePrivate.deleteMany({
      where: { id: { in: notes.map((n) => n.private_note_id!).filter(Boolean) } },
    });
    await prisma.consent.deleteMany({ where: { worker_id: workerId } });
    await prisma.participantGoal.deleteMany({ where: { participant_id: participantId } });
    await prisma.participantProfileAnswer.deleteMany({ where: { section_id: section.id } });
    await prisma.participantProfileSection.deleteMany({ where: { id: section.id } });
    await prisma.participantProfile.deleteMany({ where: { id: profile.id } });
    await prisma.workerCredential.deleteMany({ where: { worker_id: workerId } });
    for (const id of [workerId, participantId]) {
      await prisma.refreshToken.deleteMany({ where: { user_id: id } });
      await prisma.auditLog.deleteMany({ where: { actor_id: id } });
      await prisma.user.delete({ where: { id } });
    }
  };

  // --- browser -------------------------------------------------------------
  const port = 9333;
  const chrome = spawn(
    chromiumPath(),
    [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${join(OUT, 'profile')}`,
      '--window-size=1440,1200',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  let targets: any[] = [];
  for (let attempt = 0; attempt < 40 && targets.length === 0; attempt += 1) {
    await wait(250);
    try {
      targets = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()) as any[];
      targets = targets.filter((t) => t.type === 'page');
    } catch {
      targets = [];
    }
  }
  if (targets.length === 0) throw new Error('Chromium did not expose a page target');

  const cdp = await connect(targets[0].webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Log.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false,
  });

  const go = async (path: string) => {
    await cdp.send('Page.navigate', { url: `${WEB}${path}` });
    await wait(2500);
  };
  const evaluate = async (expression: string) => {
    const result = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return result.result?.result?.value;
  };
  const shot = async (name: string) => {
    const { height } = (await evaluate(
      'JSON.parse(JSON.stringify({ height: document.documentElement.scrollHeight }))'
    )) ?? { height: 1200 };
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: Math.min(Math.max(height, 900), 4000),
      deviceScaleFactor: 1,
      mobile: false,
    });
    await wait(300);
    const result = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const file = join(OUT, `${name}.png`);
    writeFileSync(file, Buffer.from(result.result.data, 'base64'));
    console.log(`    → ${file}`);
  };

  // Sign in through the real app so the session is exactly what the app writes.
  await go('/sign-in');
  const signedIn = await evaluate(`
    (async () => {
      const res = await fetch('${API}/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'pv.worker.${stamp}@tmg180.test', password: 'Worker1234!' }),
      });
      const body = await res.json();
      if (!body.success) return 'sign-in failed: ' + body.message;
      localStorage.setItem('tmg180-token', body.data.accessToken);
      localStorage.setItem('tmg180-refresh', body.data.refreshToken);
      localStorage.setItem('tmg180-auth', JSON.stringify({
        state: {
          user: body.data.user,
          roles: body.data.user.roles,
          role: 'worker',
          isAuthenticated: true,
        },
        version: 3,
      }));
      return 'ok';
    })()
  `);
  console.log(`  sign-in: ${signedIn}`);

  let failed = 0;
  const expect = (label: string, ok: boolean, detail?: unknown) => {
    if (ok) console.log(`  ✓ ${label}`);
    else {
      failed += 1;
      console.log(`  ✗ ${label}${detail === undefined ? '' : ` — ${JSON.stringify(detail)}`}`);
    }
  };

  console.log('\n  /worker/snapshots — summary-only grant');
  await go('/worker/snapshots');
  let text: string = (await evaluate('document.body.innerText')) ?? '';
  expect('the page rendered', text.includes('Approved Monthly Snapshots'), text.slice(0, 200));
  expect('the consent banner is there', text.includes('Access is controlled by participant consent'));
  expect('the participant and month are on the card', text.includes('Robin Participant') && text.includes('May 2026'));
  expect('the card reads Summary only', text.includes('Summary only'));
  expect('last viewed says Never', text.includes('Never'));
  expect('the note is counted', text.includes('1 note added'));
  expect('nothing crashed', !text.includes('Something went wrong'));
  await shot('worker-snapshots-list');

  console.log('\n  /worker/snapshots/:id — summary only');
  await go(`/worker/snapshots/${snapshotId}`);
  text = (await evaluate('document.body.innerText')) ?? '';
  expect('the snapshot opened', text.includes('Robin Participant — May 2026'));
  expect('the non-linear statement is on screen', text.includes('non-linear functioning'));
  // innerText applies text-transform, so the overline labels come back upper-cased.
  expect('the counts rendered', text.includes('4.5') && /consistency streak/i.test(text));
  expect('what is withheld is stated', text.includes('Not shared with you'));
  expect("the participant's words are not on screen", !text.includes('A slow month that got easier'));
  expect('the goal wording is not on screen', !text.includes('community garden'));
  await shot('worker-snapshot-summary-only');

  console.log('\n  /worker/snapshots/:id — after the grant widens to Full shared');
  await prisma.consent.update({ where: { id: grant.id }, data: { can_view_intake: true } });
  await go(`/worker/snapshots/${snapshotId}`);
  text = (await evaluate('document.body.innerText')) ?? '';
  expect('the card level flipped', text.includes('Full shared'));
  expect("the participant's words are shared now", text.includes('A slow month that got easier'));
  expect('the goal wording is shared', text.includes('community garden'));
  expect('the note added after approval is shared', text.includes('The bus route changed halfway'));
  expect('the last-viewed line reads back', text.includes('You last opened this snapshot'));
  await shot('worker-snapshot-full-shared');

  console.log('\n  /worker/snapshots/:id — after the participant revokes');
  await prisma.consent.update({
    where: { id: grant.id },
    data: { status: CONSENT_STATUS.REVOKED, revoked_at: new Date(), can_view_snapshot: false },
  });
  await go(`/worker/snapshots/${snapshotId}`);
  text = (await evaluate('document.body.innerText')) ?? '';
  expect('the screen says access is not available', text.includes('Access not available'));
  expect('…and shows nothing of the month', !text.includes('A slow month that got easier'));
  await shot('worker-snapshot-consent-lost');

  await go('/worker/snapshots');
  text = (await evaluate('document.body.innerText')) ?? '';
  expect('the list falls back to its empty state', text.includes('No approved snapshots yet'));
  await shot('worker-snapshots-empty');

  const errors = cdp.events
    .filter((event) => event.method === 'Log.entryAdded' && event.params?.entry?.level === 'error')
    .map((event) => event.params.entry.text)
    // The 403 above is the point of the revocation step — the browser logs
    // every non-2xx response, and that one is the API behaving correctly.
    // Anything the app itself logged still counts.
    .filter(
      (line: string) =>
        !/favicon|Download the React DevTools/i.test(line) &&
        !/Failed to load resource.*(403|404)/i.test(line)
    );
  expect('no console errors beyond the expected 403', errors.length === 0, errors);

  cdp.close();
  chrome.kill();

  // --- cleanup -------------------------------------------------------------
  await teardown!();
  console.log('\n  cleaned up — no rows left behind.');

  console.log(`\n${failed === 0 ? 'All checks passed.' : `${failed} failed.`}\n`);
  await prisma.$disconnect();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (error) => {
  console.error(error);
  if (teardown) {
    await teardown().catch((cleanupError) => console.error('cleanup failed', cleanupError));
    console.log('cleaned up after the failure.');
  }
  await prisma.$disconnect();
  process.exit(1);
});
