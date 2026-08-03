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

- **69 static screen mockups** complete: React 19 + Vite 8 + Tailwind v4 + lucide-react + react-router 7, plain JSX (no TS), **bun** as package manager, oxlint.
- The 23 screens missing from the Figma canonical page were built 2026-08-03 (participant dashboard/daily log/exports/privacy, worker dashboard/snapshots/learning hub/governance standing, MyPersonalProfile + 11 sections, BrowseVerifiedWorkers + RelationalWorkerProfile) — see the UPDATE note in [TMG180_Figma_Frame_Inventory.md](TMG180_Figma_Frame_Inventory.md). Built from exported PNGs + extracted text specs (`TMG docs/figma/outlines/`); banned-term substitutions were applied where Figma copy violated the registry (logged in that inventory's tables + agent reports).
- Still unbuilt by design: state variants (snapshot Generating/Locked/Addendum, submitted daily-log states), separate worker Help Centre, 8 mobile layouts.
- **Role-based navigation is live (2026-08-03 refactor)** — the `PageSwitcher` dev overlay was removed and replaced with real auth-flow + sidebar navigation (see "App architecture" below). Mock data still hardcoded per page; no backend yet.
- Not a git repo yet (user: "set up git later").
- Spec docs converted to markdown live in this folder — start with [INDEX.md](INDEX.md).
- Known Figma copy typos reproduced verbatim (flag to Sue/Deb): "here are no right or wrong answers.", "Share only what you're feel comfortable sharing.", duplicated chips on Social & Community. Also the hub's card labels ("Mobility & transport", "Social participation") differ from the section pages' own titles — mirrored as designed.

## App architecture (2026-08-03 refactor)

- **Global state**: zustand 5 (chosen over Redux for footprint). `src/store/authStore.js` — persisted (`localStorage: tmg180-auth`) session `{ user, role, isAuthenticated }` with `signIn / selectRole / signOut`. `ROLES` enum: `participant | worker | admin`.
- **Routes segregated by role, one file each** in `src/routes/`: `publicRoutes.jsx` (auth flow + role selection + link-expired/error), `participantRoutes.jsx` (26), `workerRoutes.jsx` (20), `adminRoutes.jsx` (14). Paths are role-prefixed (`/participant/*`, `/worker/*`, `/admin/*`) with **`src/routes/paths.js` as the single source of truth**. `AppRoutes.jsx` composes them under `RequireRole` guard branches (`src/routes/RequireRole.jsx`): unauthenticated → `/sign-in`, no role → `/role-selection`, wrong role → own dashboard; `/` = `RootRedirect`, `*` → `/error`. HelpCentre is registered under both participant and worker prefixes (single built page for two frames).
- **Navigation flow**: Sign In → Role Selection (or Choose Workspace) → `selectRole(role)` → role dashboard. Full auth loop wired (forgot → check email → reset → updated → sign-in).
- **Sidebar wiring**: pages keep their own Figma-faithful sidebars; navigation resolves **by label** via `src/navigation/navMaps.js` (label → path per role, `Sign Out`/`Logout` clears session) + `useRoleNav(role)` hook (`src/navigation/useRoleNav.js`). Unmapped labels are intentional no-ops (screen not built). 42 pages + the 3 shared sidebars are wired; also: profile hub section cards, Previous/Continue chain across the 11 profile sections (hub-order), back-buttons on detail pages, empty-state CTAs, View Profile cards, permission-denied `Go back`.
- **Known mapping judgement calls**: hub card "My support network" → Decision Making section page (no dedicated page; Figma hub/section mismatch pending Sue/Deb ruling); worker "Daily Logs" lands on the empty-state page (`EmptyDailyLogs`) until a real list screen exists; admin "Reports" → Add New Report.

## Build authority

**Final Override bundle** (Developer Handoff v1.1, 8 July 2026) wins over earlier files; where silent, the canonical technical pack (docs 14–20 in the Master Document Map) stands. If it's not in the bundle/canon, don't invent it. Never revive withdrawn worker-matching screens. 22-item build register (P1-01…GT-04) all "Not started"; owner Deb, sign-off Sue Lowdon.

## Non-negotiables

- **Language enforced from DB**: all UI text from the terminology registry (no hardcoded strings). Banned: match/matching, tasks, assigned caseload, productivity, programs, clinical notes, ACTION REQUIRED, non-compliant, Care Management, Governance Admin, and FCA/Baseline/Assessment in participant-facing UI.
- **Boundaries**: no matching/ranking/booking/rostering — browse + direct contact only. AI is draft-only behind a human review gate. Participant voice never completed by workers. Worker private narrative (WCPS Layer A) never shared.
- **Evidence rules**: daily note cannot finalise without goals + domain tags; snapshots always carry the fluctuation statement; locked records are addendum-only, never edited.

## Database / API

21 net-new `tmg_*` Postgres tables + 3 approved AI endpoints — full DDL in [TMG180_New_Database_Tables.md](TMG180_New_Database_Tables.md). Target stack per docs: React + Vite + Node + Express + Postgres.

## Frontend idiom (match, don't fight)

Screens intentionally mirror individual Figma frames — sidebars/labels/logos vary page-to-page and many pages hand-roll their own sidebar + `NavItem` copy instead of the shared `DashboardLayout`/`WorkspaceLayout`/`GovernanceLayout`. Don't "fix" this inconsistency unasked. Existing style: Tailwind utility JSX, small local components per page, `const` mock-data arrays at top of file, `brand-*` purple tokens from `src/index.css` `@theme`.

## Design reference

- Figma file: https://www.figma.com/design/NvZmofeFew3VeREx6JBarF/?node-id=1169-2 — file key `NvZmofeFew3VeREx6JBarF`, last modified 2026-07-29 (post-Final-Override). Canonical page = **"Final Design Main Page"** (node `1169:2`, 83 frames); pages "Some add pages", "New", "Page 2", "Page 3" are deprecated drafts — never build from them.
- **Access:** readable via Figma REST API with Jiten's personal access token (provided in-session 2026-08-03; not stored on disk — ask for it when needed). All 83 canonical frames exported as PNGs to `C:\Users\Kalyan\Desktop\Office\TMG180\TMG docs\figma\`.
- **Frame ↔ page mapping, gaps (23 unbuilt screens), and 4 design-vs-docs conflicts:** see [TMG180_Figma_Frame_Inventory.md](TMG180_Figma_Frame_Inventory.md). Biggest open ruling: Figma's 11 profile sections differ from the Final Override seed's 11 (Learning & employment + Self-care vs Overview + What Matters To Me).

## People

- **Sue Lowdon** — framework author, sign-off
- **Saf** — owner (Sol Business Consultant / We Care Disability Service)
- **Deb / Debabrata Mondal** — developer, build owner
- **Zain** — dev team
