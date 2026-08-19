/**
 * Live verification of the worker profile + participant directory:
 *   GET/PATCH /worker/profile · POST /worker/profile/publish · …/unpublish
 *   GET /participant/directory?location=&supportArea= · GET /participant/directory/:workerId
 *
 * Runs against the dev API (:4000) and the local DB. Creates throwaway
 * accounts (two workers, one participant), drives the profile through
 * draft → published → unpublished, asserts every directory rule (published
 * only, alphabetical, no availability/contact in the list, filters,
 * detail with availability + credentials, 404s, role guards), and removes
 * what it created.
 *
 *   cd apps/api && pnpm exec tsx --env-file=.env scripts/verify-worker-directory.ts
 */
import { CONSENT_STATUS } from '@tmg180/shared';
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

async function main() {
  console.log('\nWorker profile + directory — live verification\n');

  const stamp = Date.now();
  const signUp = (role: string, email: string, name: string) =>
    call('POST', '/auth/sign-up', {
      body: { full_name: name, email, password: 'Worker1234!', role, consents: { terms_and_privacy: true, platform_provider_disclosure: true } },
    });
  // Names chosen so alphabetical order is testable and unique to this run.
  const loc = `Testville ${stamp}, VIC`;
  const a = await signUp('worker', `dir.zed.${stamp}@tmg180.test`, `Zed Directory${stamp}`);
  const b = await signUp('worker', `dir.abe.${stamp}@tmg180.test`, `Abe Directory${stamp}`);
  const p = await signUp('participant', `dir.participant.${stamp}@tmg180.test`, 'Jordan Participant');
  check('accounts created', [a, b, p].every((r) => r.status === 201), [a, b, p].map((r) => r.json.message));
  const zedToken: string = a.json.data.accessToken;
  const zedId: number = a.json.data.user.id;
  const abeToken: string = b.json.data.accessToken;
  const abeId: number = b.json.data.user.id;
  const participantToken: string = p.json.data.accessToken;
  const participantId: number = p.json.data.user.id;

  // --- worker: own profile -----------------------------------------------
  console.log('\nWorker profile');
  const fresh = await call('GET', '/worker/profile', { token: zedToken });
  check('GET /worker/profile creates both rows and returns a draft', fresh.status === 200 && fresh.json.data.publication.status === 'draft' && fresh.json.data.publication.optIn === false, fresh.json);
  check('readiness: intro + opt-in missing, cannot publish', fresh.json.data.readiness.canPublish === false && fresh.json.data.readiness.missing.includes('profile_details') && fresh.json.data.readiness.missing.includes('opt_in'));
  check('name falls back to the account name', fresh.json.data.name === `Zed Directory${stamp}`);
  check('participant token → 403 on /worker/profile', (await call('GET', '/worker/profile', { token: participantToken })).status === 403);
  check('anonymous → 401', (await call('GET', '/worker/profile')).status === 401);

  const bad = await call('PATCH', '/worker/profile', {
    token: zedToken,
    body: { supportAreas: ['not_an_area'], availability: ['mon_night'], valuesTags: ['Bossy'], experienceYears: 99, supportPhilosophy: 'x'.repeat(300), interests: 'gardening' },
  });
  check('PATCH with bad fields → 400 per field', bad.status === 400 && ['supportAreas', 'availability', 'valuesTags', 'experienceYears', 'supportPhilosophy', 'interests'].every((k) => bad.json.data?.[k]), bad.json);

  const notReady = await call('POST', '/worker/profile/publish', { token: zedToken });
  check('publish before intro/opt-in → 400 not_ready with missing keys', notReady.status === 400 && notReady.json.data?.reason === 'not_ready' && Array.isArray(notReady.json.data?.missing), notReady.json);

  const saved = await call('PATCH', '/worker/profile', {
    token: zedToken,
    body: {
      relational_intro: 'I have supported people for years and I listen first.',
      natural_support_style: 'Calm and steady.',
      communication_style: ['Plain language', 'Patient'],
      interests: ['Chess'],
      participants_appreciate: ['Reliable'],
      boundaries_and_fit: 'Regular days suit me.',
      supportPhilosophy: 'Listen first.',
      valuesTags: ['Calm'],
      supportAreas: ['daily_living', 'communication'],
      availability: ['mon_am', 'tue_pm'],
      locationArea: loc,
      languages: ['English'],
      experienceYears: 4,
      contactPreference: 'Email me.',
    },
  });
  check('PATCH saves relational + supporting fields', saved.status === 200 && saved.json.data.fields.relational_intro.startsWith('I have') && saved.json.data.fields.availability.length === 2 && saved.json.data.fields.locationArea === loc && saved.json.data.experienceLabel === '4 Years Exp.', saved.json);
  check('readiness now only waits on opt-in', saved.json.data.readiness.missing.length === 1 && saved.json.data.readiness.missing[0] === 'opt_in');
  check('onboarding steps 1–3 done, opt-in not', saved.json.data.readiness.steps.filter((s: any) => s.done).length === 3);

  // --- account name (Settings > Account details) ---------------------------
  console.log('\nAccount name');
  const blankName = await call('PATCH', '/auth/me', { token: zedToken, body: { full_name: '  ' } });
  check('PATCH /auth/me with a blank name → 400 on full_name', blankName.status === 400 && blankName.json.data?.full_name, blankName.json);
  const longName = await call('PATCH', '/auth/me', { token: zedToken, body: { full_name: 'x'.repeat(300) } });
  check('…and an over-long name → 400', longName.status === 400);
  check('anonymous rename → 401', (await call('PATCH', '/auth/me', { body: { full_name: 'Nope' } })).status === 401);
  const renamed = await call('PATCH', '/auth/me', { token: zedToken, body: { full_name: `  Zed Renamed${stamp}  ` } });
  check('a valid rename trims and returns the account', renamed.status === 200 && renamed.json.data.name === `Zed Renamed${stamp}`, renamed.json);
  check('…and the profile falls back to the new account name', (await call('GET', '/worker/profile', { token: zedToken })).json.data.name === `Zed Renamed${stamp}`);

  const renameBack = await call('PATCH', '/auth/me', { token: zedToken, body: { full_name: `Zed Directory${stamp}` } });
  check('renamed back for the ordering checks below', renameBack.status === 200);

  // --- participant: nothing published yet -----------------------------------
  console.log('\nDirectory before publishing');
  const none = await call('GET', `/participant/directory?location=${encodeURIComponent(loc)}`, { token: participantToken });
  check('unpublished worker is not listed', none.status === 200 && none.json.data.workers.every((w: any) => w.workerId !== zedId), none.json);
  const detail404 = await call('GET', `/participant/directory/${zedId}`, { token: participantToken });
  check('unpublished worker detail → 404', detail404.status === 404);
  check('worker token → 403 on /participant/directory', (await call('GET', '/participant/directory', { token: zedToken })).status === 403);
  check('unknown support area → 400', (await call('GET', '/participant/directory?supportArea=nope', { token: participantToken })).status === 400);
  check('garbage id → 404', (await call('GET', '/participant/directory/abc', { token: participantToken })).status === 404);

  // --- publish -------------------------------------------------------------
  console.log('\nPublishing');
  const optIn = await call('PATCH', '/worker/profile', { token: zedToken, body: { optIn: true } });
  check('opt-in saved and canPublish true', optIn.status === 200 && optIn.json.data.publication.optIn === true && optIn.json.data.readiness.canPublish === true);
  check('opt-in alone does not publish', optIn.json.data.publication.isPublished === false);
  const published = await call('POST', '/worker/profile/publish', { token: zedToken });
  check('publish → published with publishedAt', published.status === 200 && published.json.data.publication.isPublished && published.json.data.publication.publishedAt, published.json);
  const publishedAt = published.json.data.publication.publishedAt;
  const again = await call('POST', '/worker/profile/publish', { token: zedToken });
  check('publishing again keeps the original publishedAt', again.json.data.publication.publishedAt === publishedAt);
  check('audit row written', (await prisma.auditLog.count({ where: { actor_id: zedId, action: 'worker_profile_published' } })) === 1);

  // Second worker: published too, same location, different area; no availability/contact.
  await call('PATCH', '/worker/profile', { token: abeToken, body: { relational_intro: 'Hello, I am Abe.', optIn: true, locationArea: loc.toLowerCase(), supportAreas: ['social_community'], displayName: `Abe Shown${stamp}` } });
  const abePub = await call('POST', '/worker/profile/publish', { token: abeToken });
  check('second worker published on relational content alone (no areas/availability needed)', abePub.status === 200 && abePub.json.data.publication.isPublished, abePub.json);

  // --- participant: directory list ----------------------------------------
  console.log('\nDirectory list');
  const list = await call('GET', `/participant/directory?location=${encodeURIComponent(loc)}`, { token: participantToken });
  const ours = list.json.data.workers.filter((w: any) => [zedId, abeId].includes(w.workerId));
  check('both published workers listed (location filter is case-insensitive)', list.status === 200 && ours.length === 2, list.json.data.workers.map((w: any) => w.name));
  check('alphabetical by shown name (display name wins)', ours[0].name === `Abe Shown${stamp}` && ours[1].name === `Zed Directory${stamp}`, ours.map((w: any) => w.name));
  const zedCard = ours.find((w: any) => w.workerId === zedId);
  check('card carries philosophy, location, experience, support areas, tags', zedCard.philosophy === 'Listen first.' && zedCard.location === loc && zedCard.experienceLabel === '4 Years Exp.' && zedCard.supportAreas.length === 2 && zedCard.supportAreas[0].label === 'Daily living' && zedCard.relationalTags[0] === 'Calm', zedCard);
  check('card has NO availability, contact, credentials, languages or email (R-04)', ['availability', 'contactPreference', 'credentials', 'languages', 'email', 'rating'].every((k) => !(k in zedCard)), Object.keys(zedCard));
  check('notice travels with the payload', typeof list.json.data.contactNotice === 'string' && list.json.data.contactNotice.startsWith('TMG180 does not coordinate'));
  check('filters offer this location and daily_living', list.json.data.filters.locations.includes(loc) && list.json.data.filters.supportAreas.some((a: any) => a.key === 'daily_living'));
  const byArea = await call('GET', `/participant/directory?location=${encodeURIComponent(loc)}&supportArea=communication`, { token: participantToken });
  check('support-area filter narrows to Zed', byArea.json.data.workers.length === 1 && byArea.json.data.workers[0].workerId === zedId, byArea.json.data.workers);
  const both = await call('GET', `/participant/directory?location=${encodeURIComponent(loc)}&supportArea=social_community`, { token: participantToken });
  check('…and to Abe for social_community', both.json.data.workers.length === 1 && both.json.data.workers[0].workerId === abeId);
  const all = await call('GET', '/participant/directory', { token: participantToken });
  check('unfiltered list includes both and is sorted overall', all.json.data.workers.some((w: any) => w.workerId === zedId) && all.json.data.workers.every((w: any, i: number, arr: any[]) => i === 0 || arr[i - 1].name.localeCompare(w.name, 'en') <= 0));
  const offeredKeys = new Set(all.json.data.workers.flatMap((w: any) => w.supportAreas.map((a: any) => a.key)));
  check('filter areas are exactly the areas someone published offers', all.json.data.filters.supportAreas.every((a: any) => offeredKeys.has(a.key)) && [...offeredKeys].every((k) => all.json.data.filters.supportAreas.some((a: any) => a.key === k)), { offered: [...offeredKeys], filters: all.json.data.filters.supportAreas.map((a: any) => a.key) });

  // --- participant: detail --------------------------------------------------
  console.log('\nDirectory detail');
  const detail = await call('GET', `/participant/directory/${zedId}`, { token: participantToken });
  const d = detail.json.data;
  check('detail → 200 with relational content', detail.status === 200 && d.relational.relational_intro.startsWith('I have') && d.relational.communication_style.length === 2 && d.relational.participants_appreciate[0] === 'Reliable', detail.json);
  check('detail carries availability grid (R-04: here only)', Array.isArray(d.supportingDetails.availability) && d.supportingDetails.availability.length === 7 && d.supportingDetails.availability[0].slots.am === true && d.supportingDetails.availability[1].slots.pm === true && d.supportingDetails.availabilitySet === true, d.supportingDetails.availability);
  check('detail carries contact preference + notice', d.supportingDetails.contactPreference === 'Email me.' && d.contactNotice.startsWith('TMG180 does not coordinate'));
  check('no credentials recorded → empty list', Array.isArray(d.credentials) && d.credentials.length === 0);
  check('no consent yet → consent.active false', d.consent.active === false);
  check('no rating fields anywhere', !('rating' in d) && !('reviews' in d));

  // Credentials + consent appear once they exist.
  await prisma.workerCredential.upsert({
    where: { worker_id_credential_type: { worker_id: zedId, credential_type: 'first_aid' } },
    create: { worker_id: zedId, credential_type: 'first_aid', expires_at: new Date('2030-01-01T00:00:00Z'), verified_at: new Date('2025-01-01T00:00:00Z') },
    update: { expires_at: new Date('2030-01-01T00:00:00Z'), verified_at: new Date('2025-01-01T00:00:00Z') },
  });
  await prisma.workerCredential.upsert({
    where: { worker_id_credential_type: { worker_id: zedId, credential_type: 'wwcc' } },
    create: { worker_id: zedId, credential_type: 'wwcc', reference: 'WWC123' },
    update: { reference: 'WWC123' },
  });
  const consent = await prisma.consent.create({
    data: { participant_id: participantId, worker_id: zedId, consent_type: 'worker_access', status: CONSENT_STATUS.ACTIVE, granted_at: new Date(), can_view_snapshot: true },
  });
  const detail2 = await call('GET', `/participant/directory/${zedId}`, { token: participantToken });
  check('credential with dates listed with status; dateless one omitted', detail2.json.data.credentials.length === 1 && detail2.json.data.credentials[0].type === 'first_aid' && detail2.json.data.credentials[0].status === 'up_to_date' && detail2.json.data.credentials[0].verifiedAt, detail2.json.data.credentials);
  check('active consent shows as consent.active true', detail2.json.data.consent.active === true);
  const ownPreview = await call('GET', '/worker/profile', { token: zedToken });
  check('worker preview shows the same public credentials', ownPreview.json.data.credentials.length === 1 && ownPreview.json.data.credentials[0].type === 'first_aid');

  // --- unpublish / opt-out --------------------------------------------------
  console.log('\nUnpublishing');
  const unpub = await call('POST', '/worker/profile/unpublish', { token: zedToken });
  check('unpublish → draft, content kept, opt-in kept', unpub.status === 200 && unpub.json.data.publication.status === 'draft' && unpub.json.data.publication.publishedAt === null && unpub.json.data.fields.relational_intro.startsWith('I have') && unpub.json.data.publication.optIn === true, unpub.json);
  check('unpublished worker gone from the list', !(await call('GET', `/participant/directory?location=${encodeURIComponent(loc)}`, { token: participantToken })).json.data.workers.some((w: any) => w.workerId === zedId));
  check('…and detail → 404', (await call('GET', `/participant/directory/${zedId}`, { token: participantToken })).status === 404);
  const optOut = await call('PATCH', '/worker/profile', { token: abeToken, body: { optIn: false } });
  check('opting out of a published profile unpublishes it', optOut.json.data.publication.optIn === false && optOut.json.data.publication.isPublished === false, optOut.json.data.publication);
  check('…so Abe is gone too', !(await call('GET', `/participant/directory?location=${encodeURIComponent(loc)}`, { token: participantToken })).json.data.workers.some((w: any) => w.workerId === abeId));
  check('publish while opted out → 400 not_ready (opt_in)', (await call('POST', '/worker/profile/publish', { token: abeToken })).json.data?.missing?.includes('opt_in'));
  check('audit: unpublish rows (explicit + opt-out)', (await prisma.auditLog.count({ where: { action: 'worker_profile_unpublished', actor_id: { in: [zedId, abeId] } } })) === 2);

  // Suspended account never lists even when published.
  await call('PATCH', '/worker/profile', { token: abeToken, body: { optIn: true } });
  await call('POST', '/worker/profile/publish', { token: abeToken });
  await prisma.user.update({ where: { id: abeId }, data: { status: 'suspended' } });
  check('suspended account is not listed even when published', !(await call('GET', `/participant/directory?location=${encodeURIComponent(loc)}`, { token: participantToken })).json.data.workers.some((w: any) => w.workerId === abeId));

  // --- cleanup ---------------------------------------------------------------
  await prisma.consent.delete({ where: { id: consent.id } });
  await prisma.auditLog.deleteMany({ where: { actor_id: { in: [zedId, abeId, participantId] } } });
  await prisma.workerCredential.deleteMany({ where: { worker_id: { in: [zedId, abeId] } } });
  await prisma.workerProfileSupportingDetails.deleteMany({ where: { worker_id: { in: [zedId, abeId] } } });
  await prisma.workerRelationalProfile.deleteMany({ where: { worker_id: { in: [zedId, abeId] } } });
  await prisma.refreshToken.deleteMany({ where: { user_id: { in: [zedId, abeId, participantId] } } });
  await prisma.user.deleteMany({ where: { id: { in: [zedId, abeId, participantId] } } });

  console.log(`\n${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
