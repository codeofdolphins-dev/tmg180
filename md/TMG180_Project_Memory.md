# TMG180 Project Memory (Claude session context)

Living context file maintained by Claude Code across working sessions. This is the **canonical copy** — the assistant's private memory holds only a pointer here. Update this file (not the private memory) as the build progresses.

Last updated: 2026-08-17 (design reference section — 12 Aug Figma handover).

## What TMG180 is

TMG180 ("The Middle Ground 180") is a relationally governed NDIS disability support platform — governance infrastructure, **not** a provider, employer, marketplace, or clinical system. Three personas:

- **Participant Portal** — participant-owned records, browse verified workers, direct contact only
- **Worker Workspace** — self-employed support workers (evidence logs, onboarding, governance standing)
- **Platform Governance** — metadata-only admin (never record content)

Core domain: participant-owned append-only evidence chain — Personal Profile / FCA intake (internal `FCA_BASELINE`; participant UI says "My Personal Profile", 11 sections) → Daily Support Evidence Logs (need 1–3 linked goals + functional domain tags to finalise) → Monthly Snapshots (mandatory non-linear fluctuation statement, participant approves, then locked, addendum-only). Consent-gated access throughout; Australian Privacy Act 1988 / NDB compliance language.

## Codebase status (as of 2026-08-03, post gap-build)

- **69 screens** built: React 19 + Vite 8 + Tailwind v4 + lucide-react + react-router 7, plain JSX (no TS), **pnpm** as package manager, oxlint. Every screen was built against the pre-12-Aug design; the frame → page mapping and what each screen still needs vs the current design are in [frontend/TMG180_Figma_Reference.md](frontend/TMG180_Figma_Reference.md) (§2 mapping, §5 gaps).
- Still unbuilt by design: state variants (snapshot Generating/Locked/Addendum, submitted daily-log states), separate worker Help Centre, 8 mobile layouts. Not built at all vs the current design: participant check-in (M-04), Overview + What Matters To Me profile sections, Create Account success/email-taken states.
- **Role-based navigation is live (2026-08-03 refactor)** — the `PageSwitcher` dev overlay was removed and replaced with real auth-flow + sidebar navigation (see "App architecture" below). Most pages still hardcode mock data; auth + participant profile are backend-powered.
- Git repo initialised; `main` is the only branch.
- Spec docs converted to markdown live in this folder — start with [INDEX.md](INDEX.md).

## Monorepo layout (2026-08-03 conversion)

Converted from a single-package bun repo to a **pnpm workspace**. All frontend paths below are now relative to `apps/web/` — `src/routes/paths.js` means `apps/web/src/routes/paths.js`.

```
apps/web/         the 69 screens, unchanged (moved wholesale via git mv)
apps/api/         Express 5 + Postgres, mounted at /api/v1
packages/shared/        ROLES + evidence-chain rules (canFinaliseDailyLog, isAddendumOnly)
packages/terminology/   registry client t() + banned-term guard (mirrors tmg_banned_terms)
packages/api-client/    bearer-token fetch client, pluggable token store
md/               specs (unmoved)
```

- **Why pnpm over bun**: user's call; strict `node_modules` (no phantom deps) and familiarity from a previous project. `bun.lock` deleted, `pnpm-lock.yaml` committed. **Never add `shamefully-hoist`** — a failing import means the dependency belongs in that package's `package.json`.
- **Workspace packages are unbuilt ESM** — they export `./src/index.js` directly, so there is no build ordering to manage. Vite and Node both consume them as-is.
- **oxlint moved to the root** (`.oxlintrc.json` stayed at root, oxlint is now a root devDependency); `pnpm lint` covers the whole workspace.
- **Dev**: `pnpm dev` runs web (:5173) + api (:4000) in parallel; Vite proxies `/api` → `:4000` so the browser is same-origin and needs no CORS preflight.
- **Mobile readiness**: API is versioned (`/api/v1`) and uses **bearer access + refresh tokens, not cookies**, specifically so React Native can reuse `@tmg180/api-client` unchanged — only the token store swaps (localStorage → expo-secure-store). CORS allows requests with no `Origin` (mobile) and allowlists browser origins from `CORS_ORIGINS`.
- **Response envelope (since 2026-08-17, Jiten's backend refactor)**: every response is `{ statusCode, message, data, success }` — success `{ statusCode: 200, message: 'log in successful', data: {...}, success: true }`, failure `{ message: 'Email not registered!!!', statusCode: 400, data: null, success: false }` (`ApiResponse` / `ApiError` + `catchResponse` in `apps/api/src/utils/apiResponse.ts`; no `code` field). `apps/web/src/lib/apiClient.js` unwraps `data` on success and throws `ApiError(status, message, data)` on failure; endpoints not yet wrapped (profile, terminology, verify-reset-token) pass through as raw payloads. Sign-up body field is `full_name` (not `name`).

### API status (scaffold only)

Built: `/health`, `/auth/sign-in`, `/auth/refresh`, `/auth/sign-out`, `/auth/me`, `/terminology`. Everything on the 22-item register is still unbuilt. Known gaps deliberately left as marked seams:

- **No users table exists in the 21 net-new `tmg_*` tables.** `auth.routes.js` assumes `users(id, email, password_hash, full_name, role)` from the pre-existing platform schema — confirm the real names with Deb before the first migration.
- **Sign-out is client-side only** — no refresh-token revocation list yet. Acceptable for the mock phase, not for launch.
- **NDIS functional domain codes are not enumerated in canon** (`domain_tags` is untyped `VARCHAR(50)[]`). `FUNCTIONAL_DOMAINS` in `packages/shared` is deliberately `null` rather than a guessed list — load from the API once ruled on.
- No migrations tooling chosen yet; `md/TMG180_New_Database_Tables.md` holds the DDL.

Web still runs entirely on hardcoded mock data — `apps/web/src/lib/apiClient.js` exists and is wired to the auth store's `signOut`, but no page calls it yet.

## App architecture (2026-08-03 refactor)

- **Global state**: zustand 5 (chosen over Redux for footprint). `src/store/authStore.js` — persisted (`localStorage: tmg180-auth`, schema v2) session `{ user, roles, role, isAuthenticated, status, error }` with `signIn / signUp / selectRole / signOut / clearError`. `roles` = what the account holds (backend-issued); `role` = workspace currently open, always a member of `roles`. `ROLES` enum: `participant | worker | admin`. See "Auth" below.
- **Routes segregated by role, one file each** in `src/routes/`: `publicRoutes.jsx` (auth flow + role selection + link-expired/error), `participantRoutes.jsx` (26), `workerRoutes.jsx` (20), `adminRoutes.jsx` (14). Paths are role-prefixed (`/participant/*`, `/worker/*`, `/admin/*`) with **`src/routes/paths.js` as the single source of truth**. `AppRoutes.jsx` composes them under `RequireRole` guard branches (`src/routes/RequireRole.jsx`): unauthenticated → `/sign-in`, no role → `/role-selection`, wrong role → own dashboard; `/` = `RootRedirect`, `*` → `/error`. HelpCentre is registered under both participant and worker prefixes (single built page for two frames).
- **Navigation flow**: Sign In → (multi-role only) workspace chooser → `selectRole(role)` → role dashboard. Two chooser pages exist (RoleSelection, ChooseWorkspace) but neither is currently reachable — sign-in lands on `roles[0]`; the design (D-01) wants ONE dynamic chooser. Full auth loop wired (forgot → check email → reset → updated → sign-in).
- **Sidebar wiring**: pages keep their own Figma-faithful sidebars; navigation resolves **by label** via `src/navigation/navMaps.js` (label → path per role, `Sign Out`/`Logout` clears session) + `useRoleNav(role)` hook (`src/navigation/useRoleNav.js`). Unmapped labels are intentional no-ops (screen not built). 42 pages + the 3 shared sidebars are wired; also: profile hub section cards, Previous/Continue chain across the 11 profile sections (hub-order), back-buttons on detail pages, empty-state CTAs, View Profile cards, permission-denied `Go back`.
- **Known mapping judgement calls**: hub card "My support network" → Decision Making section page (confirmed by R-01: My support network folds into decision_making); worker "Daily Logs" lands on the empty-state page (`EmptyDailyLogs`) until a real list screen exists; admin "Reports" → Add New Report.

## Auth (build started 2026-08-03)

**Canon is near-silent on auth** — the Final Override register says nothing about it (the 12 Aug Build Guide now specifies Create Account M-01 and password rules); the Gaps Analysis lists an unwritten "Cybersecurity and Privacy Specification" (MFA, AES-256 at rest, TLS, 72-hour breach notification) as HIGH. There is **no users table** in the 21 net-new `tmg_*` tables. So auth is infrastructure we own, built to the Technical Brief §7 constraint that the three data layers are *architecturally separated, not just permission-gated*.

Decisions taken with Jiten (2026-08-03):

1. **Roles are backend-issued, never user-chosen.** Previously any signed-in user could click "Enter Admin" on Role Selection. Now `roles[]` comes from the account; Role Selection / Choose Workspace only render workspaces the account holds; one role skips the picker entirely; `selectRole()` refuses anything outside `roles` and returns `false`.
2. **No auth DB tables until the backend phase.** Accounts are served by a mock backend in `apps/web/src/services/auth/` that mirrors the future API's payloads and error codes exactly.
3. **Sign-up screens will be built** (participant + worker; admin is provisioned, never self-served — `SELF_SIGNUP_ROLES` in `@tmg180/shared`). The Create Account frames now exist in the current Figma (M-01, 5 states — see the Figma reference).

Layout:

- `packages/shared/src/auth.js` — the contract both sides read: `PASSWORD_RULES` (8 chars + a number or symbol, wording taken from the Create New Password screen), `checkPassword`, `AUTH_ERROR` codes, `sortRoles / landingRole / canUseRole`, `ACCOUNT_STATUS`, `SELF_SIGNUP_ROLES`. Password rules live here so a form and the server can never disagree.
- `apps/web/src/services/auth/` — `index.js` is the seam (`VITE_AUTH_BACKEND=api` switches it); `mockAuthBackend.js` (localStorage `tmg180-mock-accounts`, seeded demo logins, non-plaintext digest, ~350ms latency); `apiAuthBackend.js` (over `/api/v1/auth`; unbuilt endpoints throw `not_implemented` rather than faking success); `AuthError.js`.
- Route guards: `RequireRole` also checks the open workspace against `roles`; new `RequireSession` puts the two workspace pickers behind a session (they were reachable signed-out).
- API `toPublicUser` now returns `roles: [role]` alongside `role`, so moving to multi-role later isn't a breaking change.

Demo logins (dev only, listed on the sign-in screen): `alex@tmg180.test` / `Participant1`, `sam@tmg180.test` / `Worker1234`, `admin@tmg180.test` / `Admin12345`, `both@tmg180.test` / `Both12345` (two workspaces — exercises the picker).

### Registration (built 2026-08-04)

Backend is now real: TypeScript + Prisma, `tmg_users` (roles array, nullable `password_hash` for invited accounts, `status`, `ndis_number`), migration `20260804060241_init` applied against local Postgres. `POST /api/v1/auth/sign-up` is live and **web is switched off the mock** (`apps/web/.env` → `VITE_AUTH_BACKEND=api`; `.env.example` committed).

**The registration principle**: registration collects the minimum to create an account — name, email, password, participant-or-worker, consent. Nothing else. The heavy data gathering is deliberately *inside* the workspace, because P1-01 specs the Personal Profile as resumable across sessions (`last_section_key`) and P1-03 defaults every answer to `participant_private`; and the approved Learning Hub wording puts worker onboarding after workspace entry. An account is not a place to accumulate participant record content (Technical Brief §7).

Decisions taken with Jiten (2026-08-04): no email verification yet (sign up straight in); Create Account collects the minimum + consent only (no NDIS number, no preferred name); **a new worker gets full workspace access immediately**. That last one cuts against the Learning Hub's "Complete onboarding to publish your profile (opt-in) and access tools" — if that copy stays, the gate has to come back. Flag to Sue.

Consent is recorded append-only in `tmg_audit_log` (`action: 'account_created'`, details carry `{id, version}` per consent + actor IP). `REGISTRATION_CONSENTS` in `@tmg180/shared` is the single source for both the checkbox label and the audit record, so an acceptance can always be tied to exact wording. **The two consent strings are provisional and need Sue's sign-off** — one is the platform-provider disclosure the Gaps Analysis marks URGENT.

Verified end to end against the live DB: 201 + session on sign-up, bcrypt `$2b$12`, versioned consent rows in the audit log; 409 `email_taken` (via the unique index, so the race is handled), 400 `weak_password` / `invalid_email` / missing-name / missing-consent (with `details.missing`), admin self-signup refused; sign-in round trip, case-insensitive email, `/me`, and refresh all good.

### Personal Profile is dynamic end-to-end (2026-08-04)

The participant My Profile section (hub + all 11 section pages) is fully backend-powered: P1-01 (one living profile, `last_section_key` resume), P1-02 (section structure — but seeded in code, see below), P1-03 (per-answer `visibility`, default `participant_private` — column exists and defaults; no UI control yet).

**Three new tables** (migration `20260804170000_participant_profile_tables`): `tmg_participant_profiles` (1:1 user; status, `last_section_key`, `completed_sections`/`total_sections`), `tmg_participant_profile_sections` (per-section status; complete is **sticky** — never demoted once earned, Jiten's call), `tmg_participant_profile_answers` (`question_key` → JSONB `value` + `visibility`). **Section/question definitions live in `packages/shared/src/profile.js`, not the DB** — same pattern as `REGISTRATION_CONSENTS`. Adding/renaming sections or questions is a seed edit, never a migration. **R-01 has now landed (12 Aug)** — the seed still holds the pre-12-Aug 11 with hyphenated keys and must move to the Override 11 (see "Design reference" → R-01), which also means a one-off remap of existing `section_key` / `last_section_key` rows. `FcaIntake` untouched: it remains the internal `FCA_BASELINE` evidence artifact, distinct from the living profile.

**API** (participant-role-only, always scoped to `req.user.id`): `GET /api/v1/participant/profile` (auto-creates on first visit) and `PATCH /api/v1/participant/profile/sections/:sectionKey` — the single write; upserts answers (empty value deletes the row), recomputes section status + profile progress + `last_section_key` in one transaction. Drafts are never blocked: validation rejects only malformed values (wrong type, not-an-option, out-of-range); completeness just decides status. Completion rule: all `required` questions answered (only `preferred_name` and `primary_aspiration` are required); a section with no required questions completes on its first answer.

**Web**: `services/profile/` (seam) + `hooks/profile.js` — `useProfile()` (one query holds the whole profile), `useSaveSection()` (response replaces the cache), `useSectionForm(key)` (RHF prefilled from saved answers, `keepDirtyValues` so refetches never wipe typing, and save actions for every Figma button idiom: `saveDraft` / `saveAndExit` / `saveAndContinue`; Previous never saves). Hub reads real progress: per-card badges, N-of-11, Continue → `last_section_key`. All previously-inert Save Draft / Next Step buttons now save; W-06's dead "Next Step" on 11/11 is now "Save & Finish" → hub. Duplicate Volunteering/Community Groups chips on Social deduplicated. Hub's inert "Save & Exit" banner button removed (nothing to save from the hub).

Verified live: create→draft→complete→sticky-complete lifecycle, steps array, toggles/selects/chips/scale, per-field 400s with details, unknown-section 404, 401 without token, 403 for worker role. Test participant with data: `flowtest@example.com` / `Password1!` (3/11 complete).

### What blocks the rest of onboarding

- **Participant profile** — resolved by the three profile tables above (2026-08-04); `FcaIntake` stays as the internal `FCA_BASELINE` derivation that the AI intake-summary endpoint and `ParticipantGoal.intake_id` depend on. Remaining work is the R-01 re-seed, not schema.
- **Worker** — nothing exists at all: P3-01 `worker_relational_profiles` (7 prompts), P3-03 `worker_profile_supporting_details`, plus governance standing and policy acknowledgements, which the DB pack never specified.
- **Participant check-in (M-04)** — Prisma model `ParticipantCheckin` → `tmg_participant_checkin` exists (intensity, impact/helped/recovery tags+notes, own_words, is_locked) but no controller/route/page. Contract per the Build Guide: `POST/GET?from=&to=/PATCH /api/participant/checkins` (ours: under `/api/v1`), participant-authenticated only, same-day PATCH until midnight, enforced in middleware.

### Auth complete, fully backend-powered (2026-08-04)

**There is no mock auth anywhere.** `mockAuthBackend.js` is deleted; `apps/web/src/services/auth/index.js` calls the API and nothing else. A screen that looks signed in without a server session is worse than one that fails loudly.

**Frontend stack from here on: react-hook-form + TanStack Query + react-select.** Applied to the auth screens only — the other ~65 screens keep their current idiom and get converted as each is worked on. (react-select isn't installed yet: no auth screen has a select. It comes in with the first screen that needs one, e.g. Pronouns on About Me.)

Split of responsibilities: **TanStack Query owns server state** (`src/hooks/auth.js` — `useSignIn / useSignUp / useForgotPassword / useResetPassword / useResetTokenCheck / useSessionSync`), **zustand owns session state only** (`user / roles / role / isAuthenticated` + `setSession / selectRole / signOut`). The store no longer holds `status` or `error` — those come from the mutation. `signOut` clears the whole query cache, so one person's data never survives into the next sign-in on a shared device.

`useSessionSync` (mounted in `App.jsx`) re-validates a persisted session against `/auth/me` on load — localStorage says who *was* signed in; only the server knows if that's still true.

API endpoints: `sign-up · sign-in · refresh · sign-out · me · forgot-password · reset-password/:token (GET verify) · reset-password (POST)`. New tables: `tmg_refresh_tokens` (opaque token, SHA-256 at rest — sign-out is now real revocation, not the old client-side no-op) and `tmg_password_resets` (single-use, one hour, hash at rest; completing a reset revokes every refresh session).

Reset link → `${APP_URL}/create-new-password?token=…`. The link is checked *before* the form renders, so a dead link lands on Link Expired rather than failing after someone types a new password. Link Expired now branches on `state.reason`: the Figma frame's copy is about participant-revoked share links, which is wrong for an expired reset link.

**No email transport is configured.** `src/services/mailer.ts` logs the reset link to the server console in development and *throws in production* — an unsent reset email must be a visible failure, not a participant silently locked out. Wiring a provider means implementing `deliver` and nothing else.

**Security deliberately deferred (Jiten's call, 2026-08-04): flow first.** Removed after building them: rate limiting on the auth routes, refresh-token rotation with replay detection, and the per-request `sessions_valid_from` check in `requireAuth`. Consequences to re-open in the security pass — `requireAuth` is stateless, so a suspended account or a reset password leaves an already-issued access token usable for up to its 15-minute TTL (revocation takes effect at refresh); there is no brute-force protection on sign-in or reset; no MFA. All of this belongs to the "Cybersecurity and Privacy Specification" the Gaps Analysis lists as unwritten and HIGH.

Verified end to end against the live database — 39 assertions across two suites: sign-up/sign-in/me, the api-client's 401→refresh→retry path, typed error codes, sign-out revoking server-side, the full reset round trip (verify → reset → single-use → old password dead → new password works), and dead tokens being cleared from storage with `onAuthLost` firing.

### Sessions and reset tokens simplified to stateless JWTs (2026-08-04)

**Jiten's call: flow first, sessions later.** `tmg_refresh_tokens` and `tmg_password_resets` — built and verified the same day (see above) — were removed one session later as unnecessary complexity for a flow that isn't live yet. Migration `20260804070000_remove_refresh_tokens_and_password_resets` drops both tables; `RefreshToken`/`PasswordReset` are gone from `schema.prisma`.

What changed: sign-in/sign-up now return a single `accessToken` (no `refreshToken`); `POST /auth/refresh` and `POST /auth/sign-out` are gone (`sign-out` is purely client-side — the token store is cleared, nothing to revoke). `services/tokens.ts` signs both the access token and the password-reset token as JWTs off the same secret (`signResetToken` / `decodeResetToken`, reset payload carries `purpose: 'password_reset'` so the two can't be swapped for each other). `forgotPassword` no longer writes a DB row — the emailed link's token *is* the proof.

Traded away, deliberately, and worth re-opening in the security pass: a reset link can't be revoked early or enforced single-use (it's valid to replay until it expires); there's no more server-side session to kill on sign-out or on password change (an already-issued access token stays usable for its 15-minute TTL regardless). `apps/web` (`@tmg180/api-client`, `authStore.js`) updated to match — `TokenStore` now only holds `accessToken`; a 401 on an authenticated call clears the token and fires `onAuthLost` directly (no refresh-and-retry).

Verified against the live DB: sign-up → forgot-password (link logged to console) → verify-token → reset-password → sign-in with the new password, `/me` with the fresh token, invalid-token rejection, and `/auth/refresh` + `/auth/sign-out` both 404 as expected.

**Open for Sue/Deb**: MFA, whether a worker may also hold a participant account, the two consent strings, and the two schema rulings above.

Fixed in passing: `ChooseWorkspace` said "TMG180 Governance Admin" — a banned term — now "TMG180 Platform Admin". **Still outstanding**: `AdminProfile.jsx:33` has a "Governance Admin" card title.

## Build authority

**Final Override bundle** (Developer Handoff v1.1, 8 July 2026) wins over earlier files; where silent, the canonical technical pack (docs 14–20 in the Master Document Map) stands. If it's not in the bundle/canon, don't invent it. Never revive withdrawn worker-matching screens. 22-item build register (P1-01…GT-04) all "Not started"; owner Deb, sign-off Sue Lowdon.

## Non-negotiables

- **Language enforced from DB**: all UI text from the terminology registry (no hardcoded strings). Banned: match/matching, tasks, assigned caseload, productivity, programs, clinical notes, ACTION REQUIRED, non-compliant, Care Management, Governance Admin, and FCA/Baseline/Assessment in participant-facing UI.
- **Boundaries**: no matching/ranking/booking/rostering — browse + direct contact only. AI is draft-only behind a human review gate. Participant voice never completed by workers. Worker private narrative (WCPS Layer A) never shared.
- **Evidence rules**: daily note cannot finalise without goals + domain tags; snapshots always carry the fluctuation statement; locked records are addendum-only, never edited.

## Database / API

21 net-new `tmg_*` Postgres tables + 3 approved AI endpoints — full DDL in [TMG180_New_Database_Tables.md](TMG180_New_Database_Tables.md). Target stack per docs: React + Vite + Node + Express + Postgres — now scaffolded in `apps/api` (see "Monorepo layout" above for what exists vs. what is still a seam).

## Frontend idiom (match, don't fight)

Screens intentionally mirror individual Figma frames — sidebars/labels/logos vary page-to-page and many pages hand-roll their own sidebar + `NavItem` copy instead of the shared `DashboardLayout`/`WorkspaceLayout`/`GovernanceLayout`. Don't "fix" this inconsistency unasked. Existing style: Tailwind utility JSX, small local components per page, `const` mock-data arrays at top of file, `brand-*` purple tokens from `src/index.css` `@theme`.

## Design reference

**Fresh start 2026-08-17 (Jiten's call): the ONLY design source is the client's 12 Aug Figma file. Everything about the previous file was retired to `md/archive/` and its exports deleted — never reference the old file key, its PNGs, its inventory or the 4 Aug audit when building.**

- **Figma:** `TMG` — key **`afqPpGbttWc85160MpjoTT`** — https://www.figma.com/design/afqPpGbttWc85160MpjoTT/TMG (read at version `2386813351910390576`, 2026-08-12). Pages: **v2 — 02+03 All Screens** (`1137:6`, 22 dev-ready frames — build from; overrides main-page frames it covers), **v2 — 01 Design System** (`0:1`), **v2 — 04 Flow Map** (`124:2`), **Final Design Main Page** (`1169:2`, 83 frames — existing screens build from here unless superseded), **zz Archive** (never).
- **Build-from document:** [TMG180_Developer_Build_Guide_2026-08-12.md](TMG180_Developer_Build_Guide_2026-08-12.md) (Saf). **Single design reference for dev:** [frontend/TMG180_Figma_Reference.md](frontend/TMG180_Figma_Reference.md) — pages + rules, every frame → built page (and which v2 frame supersedes which), verbatim v2 copy, design-system components/type/palette, sized build gaps.
- **Local exports** (all from this file): `C:\Users\Kalyan\Desktop\Office\TMG180\TMG docs\figma\` → `main-page/` (41 of 83 PNGs; 42 pending — Figma image-render quota for Jiten's token returned `Retry-After ≈ 4.6 days` on 2026-08-17, list in that folder's README; outlines for all 83 exist), `v2-screens/` (22 + Flow Map), `design-system/` (12), `outlines/` (layer + text dumps). Filename = `Frame_Name__nodeId.png`. Finish the 42 with another token or wait for the quota.
- **Access:** Figma REST API with Jiten's personal access token — provided in-session (2026-08-17), never stored on disk; ask when needed. Variables endpoint needs an Enterprise scope we lack; palette/type are recorded in the reference doc (violet-600 `#7c3aed`, slate, green/amber/red 100/700, Inter).
- **Rulings now settled by the design** (quote IDs in tickets): R-01 profile = Override 11 in fixed order `overview · about_me · how_i_communicate · what_matters_to_me · my_goals · daily_living · mobility_access · health_wellbeing · social_community · decision_making · safety_support_preferences` (Self-care → daily_living, My support network → decision_making, Learning & employment dropped — 12th-section candidate, Sue's call); R-02 dashboard = exactly 4 actions + check-in banner, no Export; R-04 availability only in worker detail; R-05 remove Admin Participant Overview; R-06 no ratings anywhere; R-07 workspace access immediate, onboarding gates only directory publication (matches our sign-up behaviour); R-08 approved "TMG180 stores no medical or treatment records." sentences; R-09 two-layer daily log + M-04 check-in; D-01 one dynamic workspace chooser; D-02 Reset Password frame superseded by Create New Password; W-01 Sign In has "Sign up"; M-01 Create Account 5 states; back-links say "Return to Sign In".
- **Open with Saf:** does the v2 visual style (flat, violet-600, Inter, 1280×960) replace the main page's "Vibrant" style (`#7800ce`, blobs, 48px radii) for existing screens? And the "delivered code" (`WorkerProfile.jsx`, `tokens.css`, `worker-profile-preview.html`) went to Deb — not in this repo; request it.
- **Known Figma slips to tell Saf** (don't copy them): "No medical records is shown" (1169:4370), "PERSONAL PROFILE (profile BASELINE)" (1169:4370), "Usual pattern Comparison" (1170:6606), "usual pattern energy" (1205:1795); 1205:612 still says "TMG180 Governance Admin"; 1169:5500 still says "Back to Login"; R-07/R-08 corrected copy lives only in v2 Row 6, not yet on the main-page frames.

## People

- **Sue Lowdon** — framework author, sign-off
- **Saf** — owner (Sol Business Consultant / We Care Disability Service)
- **Deb / Debabrata Mondal** — developer, build owner
- **Zain** — dev team
