# TMG180 Project Memory (Claude session context)

Living context file maintained by Claude Code across working sessions. This is the **canonical copy** — the assistant's private memory holds only a pointer here. Update this file (not the private memory) as the build progresses.

Last updated: 2026-08-03.

## What TMG180 is

TMG180 ("The Middle Ground 180") is a relationally governed NDIS disability support platform — governance infrastructure, **not** a provider, employer, marketplace, or clinical system. Three personas:

- **Participant Portal** — participant-owned records, browse verified workers, direct contact only
- **Worker Workspace** — self-employed support workers (evidence logs, onboarding, governance standing)
- **Platform Governance** — metadata-only admin (never record content)

Core domain: participant-owned append-only evidence chain — Personal Profile / FCA intake (internal `FCA_BASELINE`; participant UI says "My Personal Profile", 11 sections) → Daily Support Evidence Logs (need 1–3 linked goals + functional domain tags to finalise) → Monthly Snapshots (mandatory non-linear fluctuation statement, participant approves, then locked, addendum-only). Consent-gated access throughout; Australian Privacy Act 1988 / NDB compliance language.

## Codebase status (as of 2026-08-03, post gap-build)

- **69 static screen mockups** complete: React 19 + Vite 8 + Tailwind v4 + lucide-react + react-router 7, plain JSX (no TS), **pnpm** as package manager, oxlint.
- The 23 screens missing from the Figma canonical page were built 2026-08-03 (participant dashboard/daily log/exports/privacy, worker dashboard/snapshots/learning hub/governance standing, MyPersonalProfile + 11 sections, BrowseVerifiedWorkers + RelationalWorkerProfile) — see the UPDATE note in [TMG180_Figma_Frame_Inventory.md](frontend/TMG180_Figma_Frame_Inventory.md). Built from exported PNGs + extracted text specs (`TMG docs/figma/outlines/`); banned-term substitutions were applied where Figma copy violated the registry (logged in that inventory's tables + agent reports).
- Still unbuilt by design: state variants (snapshot Generating/Locked/Addendum, submitted daily-log states), separate worker Help Centre, 8 mobile layouts.
- **Role-based navigation is live (2026-08-03 refactor)** — the `PageSwitcher` dev overlay was removed and replaced with real auth-flow + sidebar navigation (see "App architecture" below). Mock data still hardcoded per page; no backend yet.
- Git repo initialised; `main` is the only branch.
- Spec docs converted to markdown live in this folder — start with [INDEX.md](INDEX.md).
- Known Figma copy typos reproduced verbatim (flag to Sue/Deb): "here are no right or wrong answers.", "Share only what you're feel comfortable sharing.", duplicated chips on Social & Community. Also the hub's card labels ("Mobility & transport", "Social participation") differ from the section pages' own titles — mirrored as designed.

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
- Error envelope is uniform: `{ error: { code, message, details } }`; 5xx messages are scrubbed before leaving the server. `@tmg180/api-client` parses exactly this.

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
- **Navigation flow**: Sign In → Role Selection (or Choose Workspace) → `selectRole(role)` → role dashboard. Full auth loop wired (forgot → check email → reset → updated → sign-in).
- **Sidebar wiring**: pages keep their own Figma-faithful sidebars; navigation resolves **by label** via `src/navigation/navMaps.js` (label → path per role, `Sign Out`/`Logout` clears session) + `useRoleNav(role)` hook (`src/navigation/useRoleNav.js`). Unmapped labels are intentional no-ops (screen not built). 42 pages + the 3 shared sidebars are wired; also: profile hub section cards, Previous/Continue chain across the 11 profile sections (hub-order), back-buttons on detail pages, empty-state CTAs, View Profile cards, permission-denied `Go back`.
- **Known mapping judgement calls**: hub card "My support network" → Decision Making section page (no dedicated page; Figma hub/section mismatch pending Sue/Deb ruling); worker "Daily Logs" lands on the empty-state page (`EmptyDailyLogs`) until a real list screen exists; admin "Reports" → Add New Report.

## Auth (build started 2026-08-03)

**Canon is near-silent on auth** — the Final Override register says nothing about it; TITLE.md lists the 9 auth frames and flags "no Create Account screen" as open question #1; the Gaps Analysis lists an unwritten "Cybersecurity and Privacy Specification" (MFA, AES-256 at rest, TLS, 72-hour breach notification) as HIGH. There is **no users table** in the 21 net-new `tmg_*` tables. So auth is infrastructure we own, built to the Technical Brief §7 constraint that the three data layers are *architecturally separated, not just permission-gated*.

Decisions taken with Jiten (2026-08-03):

1. **Roles are backend-issued, never user-chosen.** Previously any signed-in user could click "Enter Admin" on Role Selection. Now `roles[]` comes from the account; Role Selection / Choose Workspace only render workspaces the account holds; one role skips the picker entirely; `selectRole()` refuses anything outside `roles` and returns `false`.
2. **No auth DB tables until the backend phase.** Accounts are served by a mock backend in `apps/web/src/services/auth/` that mirrors the future API's payloads and error codes exactly.
3. **Sign-up screens will be built** (participant + worker; admin is provisioned, never self-served — `SELF_SIGNUP_ROLES` in `@tmg180/shared`). This overrides TITLE.md's guess that account creation is "handled externally" — tell Sue/Deb a Create Account frame is now needed in Figma.

Layout:

- `packages/shared/src/auth.js` — the contract both sides read: `PASSWORD_RULES` (8 chars + a number or symbol, wording taken from the Create New Password screen), `checkPassword`, `AUTH_ERROR` codes, `sortRoles / landingRole / canUseRole`, `ACCOUNT_STATUS`, `SELF_SIGNUP_ROLES`. Password rules live here so a form and the server can never disagree.
- `apps/web/src/services/auth/` — `index.js` is the seam (`VITE_AUTH_BACKEND=api` switches it); `mockAuthBackend.js` (localStorage `tmg180-mock-accounts`, seeded demo logins, non-plaintext digest, ~350ms latency); `apiAuthBackend.js` (over `/api/v1/auth`; unbuilt endpoints throw `not_implemented` rather than faking success); `AuthError.js`.
- Route guards: `RequireRole` also checks the open workspace against `roles`; new `RequireSession` puts the two workspace pickers behind a session (they were reachable signed-out).
- API `toPublicUser` now returns `roles: [role]` alongside `role`, so moving to multi-role later isn't a breaking change.

Demo logins (dev only, listed on the sign-in screen): `alex@tmg180.test` / `Participant1`, `sam@tmg180.test` / `Worker1234`, `admin@tmg180.test` / `Admin12345`, `both@tmg180.test` / `Both12345` (two workspaces — exercises the picker).

Still to do: sign-up screens; wiring Forgot/Reset/Create-New-Password to `authService` (backend methods exist, screens are still static); session expiry/refresh UX; then the real tables. **Open for Sue/Deb**: MFA (Gaps Analysis calls for it, nothing specifies it), whether workers may hold a participant account, and the Create Account frame.

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

- Figma file: https://www.figma.com/design/NvZmofeFew3VeREx6JBarF/?node-id=1169-2 — file key `NvZmofeFew3VeREx6JBarF`, last modified 2026-07-29 (post-Final-Override). Canonical page = **"Final Design Main Page"** (node `1169:2`, 83 frames); pages "Some add pages", "New", "Page 2", "Page 3" are deprecated drafts — never build from them.
- **Access:** readable via Figma REST API with Jiten's personal access token (provided in-session 2026-08-03; not stored on disk — ask for it when needed). All 83 canonical frames exported as PNGs to `C:\Users\Kalyan\Desktop\Office\TMG180\TMG docs\figma\`.
- **Frame ↔ page mapping, gaps (23 unbuilt screens), and 4 design-vs-docs conflicts:** see [TMG180_Figma_Frame_Inventory.md](frontend/TMG180_Figma_Frame_Inventory.md). Biggest open ruling: Figma's 11 profile sections differ from the Final Override seed's 11 (Learning & employment + Self-care vs Overview + What Matters To Me).

## People

- **Sue Lowdon** — framework author, sign-off
- **Saf** — owner (Sol Business Consultant / We Care Disability Service)
- **Deb / Debabrata Mondal** — developer, build owner
- **Zain** — dev team
