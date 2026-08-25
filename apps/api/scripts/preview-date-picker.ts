/**
 * Drives the real credential date picker on /worker/governance in a real
 * browser, to prove the month + year dropdowns render and work.
 *
 * The complaint they answer: the picker only had month arrows, so reaching a
 * credential's expiry year meant a dozen clicks. This opens the picker, checks
 * the dropdowns are there and carry a usable span of years, jumps the year
 * through the select, and screenshots the result.
 *
 * Needs the dev API (:4000) and the web dev server (:5173) up, and the cached
 * Playwright Chromium (no Playwright package — this speaks CDP directly over
 * Node's built-in WebSocket). Creates one throwaway worker and deletes it
 * again, on a crash too.
 *
 *   cd apps/api && pnpm exec tsx --env-file=.env scripts/preview-date-picker.ts
 */
import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { prisma } from '../src/config/prisma.js';

const API = process.env.API_URL ?? 'http://localhost:4000/api/v1';
const WEB = process.env.WEB_URL ?? 'http://localhost:5173';
const OUT = process.env.SHOT_DIR ?? join(process.cwd(), 'scripts', '.shots');

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

let teardown: (() => Promise<void>) | null = null;

async function main() {
  console.log('\nCredential date picker — browser preview\n');
  mkdirSync(OUT, { recursive: true });

  const stamp = Date.now();
  const email = `dp.worker.${stamp}@tmg180.test`;
  const w = await call('POST', '/auth/sign-up', {
    body: {
      full_name: 'Picker Worker',
      email,
      password: 'Worker1234!',
      role: 'worker',
      consents: { terms_and_privacy: true, platform_provider_disclosure: true },
    },
  });
  const workerId: number = w.json.data.user.id;
  console.log(`  worker #${workerId}`);

  teardown = async () => {
    await prisma.workerCredential.deleteMany({ where: { worker_id: workerId } });
    await prisma.workerGovernanceAcknowledgement.deleteMany({ where: { worker_id: workerId } });
    await prisma.workerGovernanceNote.deleteMany({ where: { worker_id: workerId } });
    await prisma.workerRelationalProfile.deleteMany({ where: { worker_id: workerId } });
    await prisma.workerProfileSupportingDetails.deleteMany({ where: { worker_id: workerId } });
    await prisma.refreshToken.deleteMany({ where: { user_id: workerId } });
    await prisma.auditLog.deleteMany({ where: { actor_id: workerId } });
    await prisma.user.delete({ where: { id: workerId } });
  };

  // --- browser -------------------------------------------------------------
  const port = 9334;
  const chrome = spawn(
    chromiumPath(),
    [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      '--no-first-run',
      '--no-default-browser-check',
      // A fresh profile per run: the accounts are throwaway, so a reused one
      // boots with the last run's token for a user that no longer exists.
      `--user-data-dir=${join(OUT, `profile-dp-${stamp}`)}`,
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
    const result = await cdp.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return result.result?.result?.value;
  };
  const shot = async (name: string, height = 1200) => {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await wait(300);
    const result = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const file = join(OUT, `${name}.png`);
    writeFileSync(file, Buffer.from(result.result.data, 'base64'));
    console.log(`    → ${file}`);
  };

  await go('/sign-in');
  const signedIn = await evaluate(`
    (async () => {
      const res = await fetch('${API}/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: '${email}', password: 'Worker1234!' }),
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

  console.log('\n  /worker/governance — open a credential form');
  await go('/worker/governance');
  const text: string = (await evaluate('document.body.innerText')) ?? '';
  expect('the page rendered', text.includes('Governance Standing'), text.slice(0, 200));
  expect('the rail is renamed', text.includes('My Credentials'));
  expect('nothing crashed', !text.includes('Something went wrong'));

  // The rail is the section that was cramped — check nothing in it wraps into
  // a taller box than its own card, and look at it before anything is open.
  const rail = await evaluate(`
    (() => {
      const heading = [...document.querySelectorAll('h2')]
        .find((h) => h.textContent.includes('My Credentials'));
      if (!heading) return 'no rail';
      const section = heading.closest('section');
      section.scrollIntoView({ block: 'center' });
      const cards = [...section.querySelectorAll(':scope > div > div')];
      return JSON.parse(JSON.stringify({
        width: Math.round(section.getBoundingClientRect().width),
        headingLines: Math.round(heading.getBoundingClientRect().height / 28),
        cards: cards.length,
        overflows: cards.some((c) => c.scrollWidth > c.clientWidth + 1),
      }));
    })()
  `);
  expect('the rail is wide enough to hold a date field', rail?.width >= 340, rail);
  expect('its heading sits on one line', rail?.headingLines === 1, rail);
  expect('every credential has its own card', rail?.cards === 4, rail);
  expect('nothing overflows its card', rail?.overflows === false, rail);
  await wait(400);
  await shot('governance-rail', 900);

  // Click the first "Record dates" link, then focus the expiry field to open
  // the calendar — exactly what a worker does.
  const opened = await evaluate(`
    (() => {
      const link = [...document.querySelectorAll('button')]
        .find((b) => b.textContent.trim().startsWith('Record dates'));
      if (!link) return 'no Record dates button';
      link.click();
      return 'clicked';
    })()
  `);
  expect('the credential form opens', opened === 'clicked', opened);
  await wait(600);

  const picked = await evaluate(`
    (() => {
      const input = document.querySelector('input#expires-public_liability_insurance')
        || document.querySelector('input[placeholder="dd/mm/yyyy"]');
      if (!input) return 'no date input';
      input.focus();
      input.click();
      return 'opened';
    })()
  `);
  expect('the calendar opens', picked === 'opened', picked);
  await wait(600);

  const header = await evaluate(`
    (() => {
      const month = document.querySelector('.react-datepicker__month-select');
      const year = document.querySelector('.react-datepicker__year-select');
      if (!month || !year) return JSON.parse(JSON.stringify({ month: !!month, year: !!year }));
      const years = [...year.options].map((o) => Number(o.value));
      return JSON.parse(JSON.stringify({
        month: true,
        year: true,
        monthCount: month.options.length,
        yearCount: years.length,
        first: years[0],
        last: years[years.length - 1],
        currentMonthVisible: !!document.querySelector('.react-datepicker__current-month')?.offsetParent,
      }));
    })()
  `);
  expect('a month dropdown is in the header', header?.month === true, header);
  expect('a year dropdown is in the header', header?.year === true, header);
  expect('the month dropdown lists twelve months', header?.monthCount === 12, header);
  expect(
    'the year dropdown spans a usable range, not 1900-2100',
    header?.yearCount > 40 && header?.yearCount < 80,
    header
  );
  const thisYear = new Date().getFullYear();
  expect(
    'the range reaches years an expiry actually falls in',
    header?.last >= thisYear + 15 && header?.first <= thisYear - 35,
    header
  );
  expect('the redundant static month line is hidden', header?.currentMonthVisible === false, header);
  await shot('date-picker-open', 900);

  // Jump the year through the select — the whole point of the change.
  const jumped = await evaluate(`
    (() => {
      const year = document.querySelector('.react-datepicker__year-select');
      if (!year) return 'no year select';
      const target = String(${thisYear} + 10);
      year.value = target;
      year.dispatchEvent(new Event('change', { bubbles: true }));
      return target;
    })()
  `);
  await wait(500);
  const afterJump = await evaluate(`
    (() => {
      const year = document.querySelector('.react-datepicker__year-select');
      const day = document.querySelector('.react-datepicker__day');
      return JSON.parse(JSON.stringify({
        year: year ? year.value : null,
        stillOpen: !!day,
      }));
    })()
  `);
  expect(
    'choosing a year jumps the calendar there in one action',
    afterJump?.year === jumped && afterJump?.stillOpen === true,
    afterJump
  );
  await shot('date-picker-year-jumped', 900);

  const errors = cdp.events
    .filter((e) => e.method === 'Log.entryAdded' && e.params?.entry?.level === 'error')
    .map((e) => `${e.params.entry.text} ${e.params.entry.url ?? ''}`.trim());
  expect('no console errors', errors.length === 0, errors);

  cdp.close();
  chrome.kill();
  await teardown();
  teardown = null;
  rmSync(join(OUT, `profile-dp-${stamp}`), { recursive: true, force: true });

  console.log(`\n  ${failed === 0 ? 'all checks passed' : `${failed} failed`}. Throwaway worker removed.\n`);
  await prisma.$disconnect();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (error) => {
  console.error(error);
  if (teardown) await teardown().catch(() => {});
  await prisma.$disconnect();
  process.exit(1);
});
