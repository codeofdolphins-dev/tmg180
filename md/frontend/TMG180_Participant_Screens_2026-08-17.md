# TMG180 — Participant screens: data pack + build-vs-Figma diff

**Date:** 2026-08-17 · **Scope:** the Participant Portal only (dashboard, chrome, My Personal Profile hub + sections, daily log, check-in, monthly snapshot, exports, directory, worker profile, help, privacy, preferences, library, permission-denied, mobile frames). Auth/worker/admin are out of scope here — see [TMG180_Figma_Reference.md](TMG180_Figma_Reference.md) for those.

**Sources.** Design: the canonical Figma file `afqPpGbttWc85160MpjoTT` via the local exports in `TMG docs/figma/` (v2-screens PNGs + outlines for every frame; main-page PNGs where the render quota allowed, outlines for all 83) and the [12 Aug Build Guide](../TMG180_Developer_Build_Guide_2026-08-12.md). Code: the working tree at commit `f0a5460` (participant layout refactor) plus today's uncommitted changes. Every claim below was read from those files; `file:line` refs are as of today. Companion: [TMG180_Participant_Strings_2026-08-17.md](TMG180_Participant_Strings_2026-08-17.md) — the verbatim Figma copy for every participant screen, ready for a strings module.

**How to read the verdicts.** *Matches* = build follows the canonical frame; *Copy* = only strings differ; *Needs change* = structure/behaviour/ruling gaps; *Not built* = no page/state exists; *Retire* = built against a frame the design has withdrawn. Sizes S/M/L are effort, not importance.

---

## 1. The participant surface at a glance

Paths are `apps/web/src/pages/participant/…`; routes are from `apps/web/src/routes/paths.js` (`PARTICIPANT_PATHS`). "Canonical" is the frame to build from (v2 overrides main-page). PNG ✓ = local export exists; outline ✓ = layer/text dump exists (all frames have outlines).

| # | Screen | Canonical frame | Superseded frame(s) | PNG | Built page | Route | Verdict | Size |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Participant Dashboard | v2 `3238:324` | `1169:234` (Vibrant) | ✓ | ParticipantDashboard.jsx | `/participant/dashboard` | Needs change — 5 cards not 4, no check-in banner, snapshot card dead end, legacy copy | M |
| 2 | Portal chrome (sidebar/top bar) | DS `Sidebar / Participant` `3232:33` | per-frame sidebars | ✓ | components/layout/participant/* | — | Needs change — labels, user block, top bar not in v2 | S–M |
| 3 | My Personal Profile hub | v2 `3238:2` (+ card `3236:348`) | `1207:5` | ✓ | MyPersonalProfile.jsx | `/participant/profile` | Needs change — old 11, "Your", bento, no numbers/bar | L (with R-01) |
| 4 | Overview (§01) | v2 `3236:238` (M-11) | — | ✓ | — | — | **Not built** | M |
| 5 | About Me (§02) | `1207:376` | — | outline | ProfileAboutMe.jsx | `/participant/profile/about-me` | Copy + shell | S |
| 6 | How I Communicate (§03) | `1207:694` | — | outline | ProfileHowICommunicate.jsx | `…/how-i-communicate` | Copy + shell (title "Communication") | S |
| 7 | What Matters To Me (§04) | v2 `3236:293` (M-12) | — | ✓ | — | — | **Not built** | M |
| 8 | My Goals (§05) | `1207:867` | — | outline | ProfileMyGoals.jsx | `…/my-goals` | Copy + shell | S |
| 9 | Daily Living (§06) | `1207:1017` + Self-care `1207:538` folds in | — | outline | ProfileDailyLiving.jsx (+ ProfileSelfCare.jsx to fold) | `…/daily-living` (+ `…/self-care`) | Needs change — fold not started (0/4 questions) | L |
| 10 | Mobility & Access (§07) | `1207:1203` | — | outline | ProfileMobilityAccess.jsx | `…/mobility-access` | Matches (shell/footer aside) | S |
| 11 | Health & Wellbeing (§08) | `1207:1400` | — | outline | ProfileHealthWellbeing.jsx | `…/health-wellbeing` | Copy (2 Figma typos carried) | S |
| 12 | Social & Community (§09) | `1207:1608` | — | outline | ProfileSocialCommunity.jsx | `…/social-community` | Matches | S |
| 13 | Decision Making (§10) | `1207:1803` | — | outline | ProfileDecisionMaking.jsx | `…/decision-making` | Copy (hub says "My support network"; sidebar copy is Safety's) | S |
| 14 | Safety & Support Preferences (§11) | `1207:1992` | — | outline | ProfileSafetySupport.jsx | `…/safety-support` | Copy (US phone placeholder) | S |
| — | Learning & employment | `1207:187` | dropped by R-01 | outline | ProfileLearningEmployment.jsx | `…/learning-employment` | **Retire** (12th-section candidate; keep strings) | S + data |
| — | Self-care | `1207:538` | folded by R-01 | outline | ProfileSelfCare.jsx | `…/self-care` | **Retire** after fold | (in #9) |
| 15 | Daily Log — Draft | `1169:825` | — | ✓ | ParticipantDailyLog.jsx | `/participant/daily-log` | Needs change — 100% static, "APP Compliant", worker-layer form on a participant route | L |
| 16 | Daily Log — Submitted | `1169:1112` | — | ✓ | — | — | **Not built** (state) | M |
| 17 | Daily Log — Submitted + Addendum | `1170:6606` | — | ✓ | DailySupportEvidenceLog.jsx | `/participant/daily-log/evidence` (orphaned) | Copy + terminology ("Baseline" ×2, "task") + unreachable | S |
| 18 | Check-in (M-04) ×4 states | v2 `3236:2 / 146 / 195 / 72` | — | ✓ | — | — | **Not built** (page, path, API) | L |
| 19 | Monthly Snapshot — Draft | `1169:1349` | — | ✓ | — | — | **Not built** (the richest frame) | L |
| 20 | Monthly Snapshot — Generating | `1169:1671` | — | ✓ | — | — | **Not built** | S |
| 21 | Monthly Snapshot — Locked | `1169:1767` | — | ✓ | — | — | **Not built** | M |
| 22 | Monthly Snapshot — Addendum | `1170:6451` | — | ✓ | MonthlySnapshotSummary.jsx | `/participant/snapshot` | Copy ("baseline" re-introduced) + history placement | S |
| 23 | Snapshot Exports | `1169:1940` + R-08a `3240:134` | — | ✓ | SnapshotExports.jsx | `/participant/snapshot/exports` | Copy — ships an un-approved sentence; only reachable from the R-02-forbidden dashboard card | S |
| 24 | Browse Directory | v2 `3238:388` | `1219:2237`, `1170:6301` | ✓ | BrowseVerifiedWorkers.jsx | `/participant/browse-workers` | Needs change — R-04 availability in list, keyword filter, card shape | M |
| 25 | Relational Worker Profile | v2 `3239:95` | `1221:3413`, `1170:6090` | ✓ | RelationalWorkerProfile.jsx | `/participant/browse-workers/profile` | Needs change — F-1..F-4 not applied | S–M |
| — | Worker Directory (favourites) | — | `1170:6301` | ✓ | WorkerDirectory.jsx | `/participant/directory` | **Retire** (favourites, list availability, URL-only) | S |
| — | Worker Directory Profile | — | `1170:6090` | ✓ | WorkerDirectoryProfile.jsx | `/participant/directory/profile` | **Retire** (harvest the Contact block first) | S |
| 26 | Help Centre | `1169:2152` | — | ✓ | ParticipantHelpCentre.jsx | `/participant/help` | Needs change — 6 rewritten cards vs 5, FAQs differ, support card missing, invented "Compliance" notice | M |
| 27 | Privacy & Sharing | `1169:2326` | — | ✓ | PrivacySharing.jsx | `/participant/privacy-sharing` | Copy + behaviour — faithful transcription, every control inert, "in compliance with" | M |
| 28 | Session Preferences | `1170:5652` | — | ✓ | SessionPreferences.jsx | `/participant/preferences` | Behaviour — no chip is selectable; only reachable via the gear icon | M |
| 29 | Library | `1170:5926` | — | ✓ | Library.jsx | `/participant/library` | Terminology ("(FCA baseline)") + tab bug + orphaned | S–M |
| 30 | Permission Denied (Participant) | `1205:1556` | — | outline | PermissionDeniedParticipant.jsx | `/participant/permission-denied` | Matches (copy verbatim; both CTAs wired) — nothing redirects here | S |
| 31 | Mobile ×8 (`1205:1795 / 1939 / 2033 / 2208 / 2352 / 2522 / 2646 / 2765`) | main page | — | outline | — | — | Not built; **off-canon in places** (§3.8) | L |

Totals: 26 pages routed under `/participant`; **5 whole screens and 6 states not built** (Overview, WMTM, Check-in ×4, Daily Log Submitted, Snapshot Draft/Generating/Locked); **4 pages to retire** (Learning & employment, Self-care, WorkerDirectory, WorkerDirectoryProfile); everything except the profile hub/sections runs on hardcoded mock data.

---

## 2. Cross-cutting findings

### 2.1 Chrome (`components/layout/participant/`)

The shared `ParticipantLayout` (fixed sidebar `w-64` + fixed top bar `h-14`, ambient blobs `#f0dbff` / `#d8e2ff`) is a port of the legacy Vibrant dashboard `1169:234`, not of the v2 `Sidebar / Participant` component `3232:33`.

| v2 says | Build has | Ref |
| --- | --- | --- |
| Nav "My Personal Profile" | "My Profile" | `ParticipantSidebar.jsx:24` |
| Nav "Browse Directory" | "Verified Workers" | `ParticipantSidebar.jsx:28` |
| Footer user block: divider + 30px `#ede9fe` circle + "Jordan P." + "Sign Out" | no user block; a "Logout" nav row | `ParticipantSidebar.jsx:102` |
| No top bar at all | fixed top bar with gear → `/participant/preferences` + initials avatar (the only live user data in the chrome) | `ParticipantTopBar.jsx:27-37` |
| 260px flat white sidebar, r:8 items with 7px dot, active `#ede9fe`/`#7c3aed` | 256px `bg-[#f8f9ff]/70` blur + shadow, `rounded-full` items with lucide icons, active `bg-purple-600/30 text-brand-700` | `ParticipantSidebar.jsx:48-54, 73` |
| Page bg `#f1f5f9`, no blobs, Inter | `bg-white` + blobs; no webfont loaded; `@theme` `brand-600 = #6b21a8` matches neither v2 (`#7c3aed`) nor Vibrant (`#7800ce`) | `ParticipantLayout.jsx:15-19`, `index.css:3-11` |
| — | `TopBar.jsx` (Unsplash-hotlinked avatar, two no-op buttons) survives only in PermissionDeniedParticipant | `TopBar.jsx:18` |
| — | Nothing highlights on `/participant/preferences` or `/participant/library`; `/participant/directory` highlights "Verified Workers" but nothing links there | `ParticipantSidebar.jsx:30, 40-42` |

`navigation/navMaps.js` `PARTICIPANT_NAV` is **dead code** for this portal — `ParticipantSidebar` navigates by path and never imports `useRoleNav` (only the worker/admin sidebars do). It also lacks the two v2 labels ("My Personal Profile", "Browse Workers"), so re-enabling label-routing later would silently no-op them.

### 2.2 No strings module; terminology registry unused; banned-term hits

There is no strings/content module in `apps/web/src` — every string is an inline JSX literal or a top-of-file `const`. Meanwhile the API already serves `GET /terminology` (flat key→value from `TerminologyRegistry`) and `packages/terminology` exposes `t()`; no participant page calls either. The Build Guide §6 wants every participant-facing string in one greppable place — [the strings file](TMG180_Participant_Strings_2026-08-17.md) is the seed for that.

The `packages/terminology/src/bannedTerms.js` mirror is also **narrower than the guide's list**: it has no `Compliance`, `Assigned`, bare `task`, or bare `clinical` entries — so a lint built on it today would pass three of the hits below.

Rendered banned/ownership hits in participant screens (grep of `pages/participant`, `components/layout/participant`, `components/participant`; comments and identifiers excluded):

| File:line | Renders | Problem | Fix |
| --- | --- | --- | --- |
| `Library.jsx:17` | "(FCA baseline)" beside the "Personal Profile" heading | FCA + Baseline | Figma says "(personal profile)" |
| `DailySupportEvidenceLog.jsx:156` / `:163` | "Baseline Comparison" / "Better than baseline" | Baseline ×2 | "Usual pattern" / "Better than usual" (do **not** copy the Figma slip "Usual pattern Comparison") |
| `DailySupportEvidenceLog.jsx:121` | "…prompts for task sequencing." | task; not the Figma string | Figma: "Guided verbal prompts for step-by-step routines." |
| `MonthlySnapshotSummary.jsx:27` | "…maintain the baseline independence…" | Baseline — **re-introduced**; Figma `1170:6451` already reads "…maintain the independence…" | delete the word |
| `ParticipantDailyLog.jsx:236` / `:256` | "Privacy First (APP Compliant)" | Compliant; not the Figma string | Figma: "Privacy First (Australian Privacy Principles)" |
| `ParticipantHelpCentre.jsx:130` | "Privacy & Compliance Notice" | Compliance; whole block is invented (not in `1169:2152`) | delete block |
| `PrivacySharing.jsx:393` | "…handled in compliance with the Australian Privacy Act…" | Compliance | Figma: "in line with" (the build already says that at `ParticipantHelpCentre.jsx:134`) |
| `MyPersonalProfile.jsx:201, 203` / `:224` / `:254` | "Your Personal Profile" ×2 / "Continue Your Personal Profile" / "Your Profile Sections" | ownership strings must be verbatim "My Personal Profile" / "Continue My Profile" | v2 `3238:2` |
| `ProfileAboutMe.jsx:7`, `ProfileMyGoals.jsx:23` | "Your Personal Profile belongs to you." | ownership phrasing (carried from `1207:376` / `1207:867`) | rewrite in My-ownership |
| `ParticipantSidebar.jsx:24` | "My Profile" | ownership string | "My Personal Profile" |
| `BrowseVerifiedWorkers.jsx:68, 213` | "Medication Admin", "Specialties, skills, or names..." | clinical register (not on the literal list) | goes with the R-04/R-06 rebuild |
| `WorkerDirectoryProfile.jsx:32-37, 158-162` | "Trauma-aware", "person-centered care", "mental health well-being" | clinical register | page retires |

The approved sentence **"TMG180 stores no medical or treatment records."** appears nowhere in `apps/` — it belongs on Snapshot Exports (R-08a) and the Privacy & Sharing notice card.

### 2.3 What is live vs mock

Backend-powered: sign-in/sign-up/reset (auth), and **the whole My Personal Profile feature** (hub + 11 section pages via `useProfile` / `useSectionForm` → `GET /participant/profile`, `PATCH /participant/profile/sections/:key`). Everything else in the portal is static: `ParticipantDashboard`, both daily-log pages, `MonthlySnapshotSummary`, `SnapshotExports`, all four directory pages, `ParticipantHelpCentre`, `PrivacySharing`, `SessionPreferences` contain **zero** `useState`/`onClick`/fetch (Library has a tab `useState` that nothing reads; PermissionDenied has two wired buttons). `apps/api/src/routes/index.ts` mounts only `/health`, `/auth`, `/terminology`, `/participant` (profile) — no check-in, daily-log, snapshot, export, consent, or directory endpoint exists. Shared rules `canFinaliseDailyLog`, `isAddendumOnly`, `SNAPSHOT_STATUS` (`packages/shared/src/evidence.js`) are imported by nobody.

Reachability today (from the chrome): Dashboard, Profile, Daily Log, Monthly Snapshot, Browse Workers, Help Centre, Privacy & Sharing ✓ · Session Preferences — gear icon only, no nav highlight · Snapshot Exports — only via the dashboard "Export Snapshot" card that R-02 removes (would become **unreachable**) · Library, Daily Log evidence view, `/participant/directory*`, Permission Denied — **URL only**.

### 2.4 Profile section shell (all 11 pages)

- **Footer:** `components/participant/ProfileSectionFooter.jsx:26-59` renders four buttons — Previous · Save Draft (Mail icon) · Save & Exit · Save & Continue (and "Save & Finish" on the last section). R-01 / v2 `3236:238`: **exactly two, "Save Draft" / "Save & Continue"**, left-aligned, r:8, no icons. Its own docblock (`:5-10`) says it deliberately merged three Figma idioms — superseded.
- **Counter:** `hooks/participant/profile.js:99` emits `"04/11"` into a right-hand "Personal Profile Status" card; v2 pages put **"Section N of 11"** (11px w700 violet) under a breadcrumb **"My Personal Profile › {Section}"** above the H1. Neither breadcrumb nor "Section N of 11" exists anywhere in `apps/web/src`.
- **Numbers are wrong under R-01 anyway** because the seed order is the old order (About Me shows 01/11, should be 2; How I Communicate 05 → 3; My Goals 02 → 5; Daily Living 03 → 6; Mobility 04 → 7; Health 09 → 8; Social 06 → 9; Decision Making 11 → 10; Safety 10 → 11).
- **Right-hand panels** ("Personal Profile Status", "Your Information", "Need Help?") and the "Why we ask this" card exist on the main-page section frames but **not on the v2 section pages** (single 924px column, no side panel). Whether they survive is part of the v2-vs-Vibrant question (§2.6). Every page sets the Need Help body `italic`; Figma is upright.
- Two Figma typos are reproduced verbatim: "here are no right or wrong answers." (`ProfileAboutMe.jsx:13`, `ProfileHowICommunicate.jsx:40`) and "Share only what you're feel comfortable sharing." (`ProfileAboutMe.jsx:14`, `ProfileHealthWellbeing.jsx:47`); Health also carries "our health and wellbeing information belongs to you." (`:40`, missing "Y").
- No `<form>` element on any page; chips/toggles/moods use `watch`/`setValue` rather than `register` (works, but Enter does nothing); `isLoading` is returned by the hook and read by no page (fields flash empty then fill).
- Error banner on save failure is a build addition (keep); per-field errors from the API's `details` map are not surfaced.

### 2.5 R-01 seed vs code (the biggest single item)

`packages/shared/src/profile.js:43-284` still holds the pre-12-Aug 11 with hyphenated keys; the DB stores `section_key`/`question_key` as free text (`schema.prisma:157, 174`), so a slug rename is a **row backfill**, contrary to the "seed edit, never a migration" comment at `profile.js:5-7`.

| R-01 # | R-01 slug | Old key (order) | Action | Page |
| --- | --- | --- | --- | --- |
| 1 | `overview` | — | **add** (3 textareas, M-11) | new `ProfileOverview.jsx` |
| 2 | `about_me` | `about-me` (1) | rename, reorder | ProfileAboutMe.jsx |
| 3 | `how_i_communicate` | `how-i-communicate` (5) | rename, reorder, title → "How I Communicate" | ProfileHowICommunicate.jsx |
| 4 | `what_matters_to_me` | — | **add** (3 textareas, M-12) | new `ProfileWhatMattersToMe.jsx` |
| 5 | `my_goals` | `my-goals` (2) | rename, reorder | ProfileMyGoals.jsx |
| 6 | `daily_living` | `daily-living` (3) **+ `self-care` (7)** | rename + **fold** 4 questions in (`personal_care`, `medication_routine`, `medication_notes`, `daily_supports`) | ProfileDailyLiving.jsx absorbs ProfileSelfCare.jsx |
| 7 | `mobility_access` | `mobility-access` (4) | rename, title → "Mobility & Access" | ProfileMobilityAccess.jsx |
| 8 | `health_wellbeing` | `health-wellbeing` (9) | rename, reorder | ProfileHealthWellbeing.jsx |
| 9 | `social_community` | `social-community` (6) | rename, reorder, title → "Social & Community" | ProfileSocialCommunity.jsx |
| 10 | `decision_making` | `decision-making` (11) | rename, reorder; hub label "My support network" → "Decision Making" | ProfileDecisionMaking.jsx |
| 11 | `safety_support_preferences` | `safety-support` (10) | rename, title → "Safety & Support Preferences"; becomes last (takes "Save & Finish" if kept) | ProfileSafetySupport.jsx |
| — | — | `learning-employment` (8) | **drop** (4 questions, page, route, path, hub card) | ProfileLearningEmployment.jsx — delete |

11 − 1 − 1 + 2 = 11 ✓. Knock-ons: `paths.js:26-36`, `participantRoutes.jsx:36-46`, `hooks/participant/profile.js:26-38` (`SECTION_PATHS`), `MyPersonalProfile.jsx:26-108` (cards), stale "R-01 open" comments (`profile.js:9-12, 266-267`; `MyPersonalProfile.jsx:20-25`; `ProfileSectionFooter.jsx:5-10`). Runtime consequences of retiring sections without a data pass: orphan `learning-employment`/`self-care` rows still count in `completed_sections` (`profile.controller.ts:158-160`) → hub can read "11 of 10"; `total_sections` is frozen per row at creation (`:65, :102`); `last_section_key` may point at a retired key → `SECTION_PATHS[key]` undefined → hub falls back to "You haven't started yet". Suggested keys for the new sections: `who_i_am / people_notice_first / good_day` and `people_who_matter / what_i_value / never_want_to_happen` (all `textarea`, none required).

### 2.6 Visual language (already open with Saf — recorded, not relitigated)

Every built participant screen is in the main-page "Vibrant" idiom (`#7800ce`, blurred blobs, r:48 cards, glass) — faithful to the frames it was built from. The v2 frames (dashboard, hub, Overview, WMTM, check-in, directory, worker profile) are flat violet-600 / slate / Inter / r:12 with a 260px white sidebar and **no top bar, no side panels**. Roughly half the "structure" rows in §3 (card radii, blobs, top bar, section side panels, sidebar shape) resolve one way or the other on Saf's answer; the copy, count, ruling and behaviour rows do not depend on it. Whichever wins, `@theme` today (`brand-600 #6b21a8`, no font token) matches neither and pages hard-code hexes.

### 2.7 Figma-internal issues surfaced by this pass (add to the Saf list)

Beyond the slips already in the Figma reference: `1169:825` domains helper says "(Select 1-3 goals)" under "Functional domain tags"; `1169:825` intro is the profile intro reused; `1169:825` privacy label+body duplicated in the AI panel; `1207:376`/`1207:694`/`1207:1400` typos above; `1207:1803` Decision Making sidebar carries the Safety copy; `1207:1992` US phone placeholder; `1207:1608` duplicates "Volunteering"/"Community Groups" chips; `1207:538` intro is off-topic ("values, goals"); `1169:2326` right-column card is named "Snapshot Export History" but its heading text reads "Support Team Access"; `1169:1767` Locked snapshot has **no fluctuation statement** and a "space space" typo, and `1205:2208` mobile snapshot also lacks the statement; three different fluctuation sentences exist (Draft full, Addendum abridged, DB default a third); `3238:388` says "Listed alphabetically" but its sample order isn't; `3239:95` has no contact affordance or back link although the footer tells participants to contact directly; `1169:2152` Help card 5 body "regulatory governance standing" reads as compliance register; mobile `1205:2352`/`2646` still show ratings/reviews (R-06) and `1205:2765` uses "Dr. Sarah Jenkins / Primary Therapist" and an "Anonymous Research" toggle; `1205:1795` says "Your Profile" and "Functional Capacity"; the DS status-chip "Not started" dot is `#94a3b8` in `3232:111` but `#475669` in `3233:53`/`3236:348`.

---

## 3. Screen-by-screen

### 3.1 Dashboard — v2 `3238:324` vs `ParticipantDashboard.jsx`

**Figma:** greeting "Good morning, Jordan" / "Your space. Everything here belongs to you." → check-in banner (`#ede9fe`, "How's today going?" / "A 30-second check-in, in your own words." / primary "Start Check-in" → M-04) → **exactly four** white r:12 cards in a 2×2 grid, each icon tile + title + one line + a violet text-link CTA: "Continue My Profile — Pick up where you left off — 2 of 11 sections done. → Continue", "Daily Log — Today's story, in your words and your workers' notes. → Open Daily Log", "Monthly Snapshot — Your month, summarised — you approve what's in it. → View Snapshot", "Browse Workers — Verified worker profiles, led by how people work. → Browse Directory" → footer note "Note: Export lives under Monthly Snapshot › Snapshot Exports (R-02) — deliberately not a dashboard action."

**Build:** a faithful port of the legacy `1169:234` — "Welcome back, Alex." (`:12`, hardcoded, not from the store), 3-line intro, **five** r:48 cards: "Personal Profile" with a literal "In progress" chip + outlined "Continue" (`:20-39`); "Today's Daily Log" with a solid **"Start Check-in"** button that navigates to `/participant/daily-log` (`:41-60`); "Monthly Snapshot" with a mock 7-bar chart and **no CTA/no navigation** (`:62-79`); "Browse verified worker profiles" (`:81-97`); a full-width **"Export Snapshot"** card → `/participant/snapshot/exports` (`:99-120`). No banner, no note, no live data — although `useProfile()` already gives `completedSections/totalSections` (used at `MyPersonalProfile.jsx:183-186`).

| Figma | Build | Type | Fix / size |
| --- | --- | --- | --- |
| Greeting by time of day + real name | "Welcome back, Alex." `:12` | copy/behaviour | greeting helper from `useAuthStore().user.name` — S |
| Check-in banner → M-04 | absent; "Start Check-in" is a card button to the evidence form | missing / ruling (W-03) | banner + `PARTICIPANT_PATHS.checkIn` + page (§3.4) — M (banner) + L (page) |
| 4 cards, config array `continue_profile / daily_log / monthly_snapshot / browse_workers` | 5 hardcoded cards; Export card violates R-02 | extra / ruling | delete Export card; add note line; move Export entry to the Locked snapshot state so `/snapshot/exports` stays reachable — M |
| "Continue My Profile — … 2 of 11 sections done. → Continue" | "Personal Profile", "Continue where you left off.", chip | copy/terminology | verbatim copy + `useProfile()` counter — S |
| "Monthly Snapshot → View Snapshot" | no CTA, inert card, fake chart | missing behaviour | text-link → `PARTICIPANT_PATHS.snapshot`; drop `SNAPSHOT_BARS` — S |
| Text-link CTAs, flat white cards | outlined/solid buttons, gradient r:48 cards | structure | gated on §2.6 — M |
| No status chip on dashboard | "In progress" literal `:28-30` | extra | remove — S |

### 3.2 My Personal Profile hub + Overview + What Matters To Me

**Figma hub `3238:2`:** H1 "My Personal Profile" · "Your story, your way. Complete sections at your own pace — everything here belongs to you." · one row: 320×8 progress bar + "2 of 11 sections completed" + primary pill "Continue My Profile" · uniform 3-column grid of 11 `Section hub card`s (number "01"…"11", icon tile, label, status chip "Not started / In progress / Completed" — **no description on any card**, the resume card gets a violet outline). Nothing else — no hero, no image, no side card, no "Save & Exit", no "Your Profile Sections".

**Build `MyPersonalProfile.jsx`:** the legacy `1207:5` hub — eyebrow + H1 both "Your Personal Profile" (`:201-203`), long legacy subtitle, gradient hero "Continue Your Personal Profile" with "Your last saved section: …" and Continue/Get started (`:222-251`) plus a decorative `<img src="/images/img.jpg">`, a right-hand "Profile Completion" card (counter but no bar, `:211-219`), sub-heading "Your Profile Sections" (`:254`), and an 11-card **bento** (`featured/wide/small`) in the **old order with old labels** ("About me", "My goals", "Daily living", "Mobility & transport", "Communication", "Social participation", "Self-care", "Learning & employment", "Health & wellbeing", "Safety", **"My support network"**), each with a description, no numbers, and `StatusBadge` returning **null for not-started** (`:130`), uppercase "IN PROGRESS" pill for in-progress. Fully live (statuses, counters, resume key) — the data plumbing is right; the frame is wrong.

**Overview `3236:238` / WMTM `3236:293`:** breadcrumb "My Personal Profile › Overview" · "Section 1 of 11" · H1 · intro · three 924×52 textareas with `e.g.` placeholders · Save Draft / Save & Continue. WMTM identical shape, "Section 4 of 11". **Neither exists** — no page, path, route, `SECTION_PATHS` entry, or seed section (`grep overview` across the repo → nothing).

| Figma | Build | Type | Fix / size |
| --- | --- | --- | --- |
| R-01 11 in fixed order, underscore slugs, numbered cards, chip always shown | old 11, hyphen keys, bento, descriptions, no numbers, no chip when not started | data + structure | §2.5 seed pass + one `SectionHubCard` — L |
| "My Personal Profile" / "Continue My Profile" | "Your Personal Profile" ×2, "Continue Your Personal Profile", "Your Profile Sections" | ownership | S |
| progress bar + counter + CTA in one row | side card + hero + image | structure | replace hero/side card with the row — M |
| Overview + WMTM pages | not built | missing | 2 pages on the ProfileAboutMe pattern (minus side panels if v2 wins) — M |
| Save Draft / Save & Continue; "Section N of 11"; breadcrumb | 4 buttons; "NN/11" in a side card; no breadcrumb | structure | §2.4 — S (footer) + S (counter) |
| Cards are `<div onClick>` | — | a11y | make them buttons/links — S |

### 3.3 The 11 section pages (main-page frames) — per section

All eleven bound pages have **every Figma field present, bound to the right `question_key`, with matching option lists** (checked field-by-field). Differences are copy, shell, and a few option/semantic points:

| Section | Page | Figma frame → build differences (beyond §2.4) |
| --- | --- | --- |
| About Me | ProfileAboutMe.jsx | Pronoun option list (`she-her, he-him, they-them, self-describe, prefer-not-to-say`) is not in Figma — build/seed invention; "I use my own words" reveals no free-text field; `preferred_name` `required` is a build invention (no Figma marker); grid has no responsive fallback (`:42`, unlike siblings); "Your Personal Profile belongs to you." `:7`; typos `:13-14`. |
| How I Communicate | ProfileHowICommunicate.jsx | Frame and build both titled **"Communication"** — R-01/v2 hub says "How I Communicate" (`:82`, seed `profile.js:122`); radio cards clear on re-click (`:106`) with `role="radio"` but no keyboard semantics; `additional_needs` seeded `textarea` but rendered as a 48px input (`profile.js:129`); typo `:40`. |
| My Goals | ProfileMyGoals.jsx | Figma shows the steps list with a ready blank row; build starts with **zero rows** + an invented empty-state line "Add the small steps that will get you there." (`:89-91`); build renders icon + "Add another step" where Figma literally has "+ Add another step" (build is right); `primary_aspiration` `required` invented; "Your Personal Profile belongs to you." `:23`. |
| Daily Living | ProfileDailyLiving.jsx | Faithful to `1207:1017`, but the **Self-care fold has not started** — 0 of 4 questions present in page or seed. Fold in Personal Care (6 chips), Medication & Health Routine (4 chips + textarea), Daily Supports (textarea) from `1207:538`; retire the Self-care intro (off-topic). Consider `medication_routine` as `select` — "Independent" and "Full assistance" are mutually exclusive but modelled `multi`. |
| Mobility & Access | ProfileMobilityAccess.jsx | Matches; select placeholders "Choose your preferred method" / "Choose what applies to you" are invented (Figma shows values); title in seed/frame is "Mobility & transport" → R-01 "Mobility & Access". |
| Health & Wellbeing | ProfileHealthWellbeing.jsx | "Exercise Plan" (`:25`, value `exercise_plan`) vs Figma "Exercise Program"; both Figma typos reproduced (`:40, :47`); mood buttons 4 & 5 both `#006c49` in Figma vs `emerald-600`/`teal-600`. |
| Social & Community | ProfileSocialCommunity.jsx | Frame/seed say "Social participation"; build "Social Participation" (`:48`); R-01 → "Social & Community". Chip dedup (10 vs Figma's 12 with 2 duplicates) is correct. |
| Decision Making | ProfileDecisionMaking.jsx | Sidebar "Your Information"/"Need Help?" copy is the **Safety** copy in both Figma and build (`:35-45`) — rewrite; hub card still "My support network" (`MyPersonalProfile.jsx:104`) with a description promising "the people who support you and the roles they play" that no field captures — accept the loss or add a `support_network` question (Sue); `continueLabel="Save & Finish"` (`:249`) moves to Safety under R-01; complete-chip palette differs from siblings (`:195`). |
| Safety & Support Preferences | ProfileSafetySupport.jsx | Copy verbatim; phone placeholder "+1 (555) 000-0000" (`:114`) — US format on an AU product (Figma bug); `type="text"` not `tel`; chips `rounded-lg` vs pill; becomes section 11 → takes "Save & Finish" if that label survives. |
| Learning & employment | ProfileLearningEmployment.jsx | Fully faithful build (all 4 fields, 6 tiles, 12 chips) — retiring on ruling, not quality. Touches: `profile.js:180-210`, `paths.js:35`, `participantRoutes.jsx:12,45`, `hooks/participant/profile.js:34`, `MyPersonalProfile.jsx:78-85`, the file. Keep the strings for the 12th-section candidate. |
| Self-care | ProfileSelfCare.jsx | Faithful build of `1207:538`; retires into Daily Living. Touches: `profile.js:160-178`, `paths.js:36`, `participantRoutes.jsx:13,46`, `hooks:33`, `MyPersonalProfile.jsx:70-77`, the file, plus moving any saved `self-care` answer rows onto the `daily_living` section row. |

### 3.4 Daily Log (3 states) + Check-in (4 states)

**Figma Daily Log.** *Draft `1169:825`:* participant context pill ("Andrew Joseph | TMG180-P-2048") · H1 "Daily Support Evidence Log" · Session Details (Date / Start Time / End Time with pickers) · Intent & Focus (goal dropdown "Select a goal from your plan...", selected chip "Increase community access" ✕, required; domain chips **Daily living / Mobility / Social & Civic / Self-care**) · The Details (three textareas: "Function-first impacts", "Support delivered", "Outcome / participation snapshot") · comparison segmented control ("Compared to your usual pattern, how did things go during this period?" — Better than usual / Same as usual / Variable / Below usual) · right column AI panel "Help me write this" ("Privacy First (Australian Privacy Principles)", rough-notes textarea, "Plain language / NDIS evidence language / Both formats") + "Additional Notes (Optional)" · footer Cancel / Save Draft / Submit Log. *Submitted `1169:1112`:* same skeleton frozen read-only, green chip "Submitted Oct 24, 2023 • 1:15 PM", helpers and chip ✕ removed, AI panel gone, footer Cancel / **Add Addendum**, better intro ("Record what happened during support and link it back to your goals. Take your time, there is no right or wrong way to write this."). *Submitted + Addendum `1170:6606`:* a different read-only bento record — status "Submitted", context bar (Alex Rivera / TMG-8821-XP / date), notice "This log has been submitted. You can add a note if something needs to be included or clarified.", Focus Areas (GOALS LINKED / FUNCTIONAL DOMAINS chips), Support Details (IMPACTS / CHALLENGES · SUPPORT PROVIDED · OUTCOME), Participant Voice quote, comparison card (Figma slip "Usual pattern Comparison / Better than usual pattern"), Notes & Addendums (Add Note: Note Content, **Reason for Note**, auto-stamp line, Cancel / Save Note; History timeline "Reason: Clarification").

**Figma Check-in M-04** (`3236:2 / 146 / 195 / 72`, v2 chrome, "Daily Log" nav active, no back link): "Today's check-in" · "Thirty seconds, in your own words. This is yours — workers only see it if you share it." · "How intense was today?" — five cards 0…4 with end labels "A settled day" / "A very big day" · four free-text fields "What showed up today?" / "What helped?" / "What did it cost you?" / "In my own words" (each with an `e.g.` placeholder, **no tag chips anywhere**) · "Save my check-in". Submitting: faded rows + "Saving…". Success: centred card "Check-in saved" / "Nice one. Today is captured in your own words — it feeds your monthly snapshot, and you can edit it any time before midnight." / "Back to Dashboard" / "Edit today's check-in". Same-day edit: amber banner "You're editing today's check-in. Edits close at midnight — after that it becomes part of your record." + prefilled fields + "Save changes" / "Discard changes".

**Build.** `ParticipantDailyLog.jsx` = Draft only, 100% static (no state/handlers; chips are `<span>`; the goal "dropdown" opens nothing; footer inert), copy slips ("APP Compliant" `:236,256`; "usual routine" `:199` vs "usual pattern"; "supports were completed" `:179`; both label rows hardcode "(Select 1-3 goals)" `:62-70` — the domains one should say domains); the right column incl. "Additional Notes" disappears below `xl` (`:218`). `DailySupportEvidenceLog.jsx` = the `1170:6606` record view, static, **orphaned** (nothing links to `/participant/daily-log/evidence`), terminology hits `:121, :156, :163`, ref "TMD-8825-XP" `:48` vs Figma "TMG-8821-XP", "e.g. Omitted" `:195` vs "e.g., Omitted". **Check-in: nothing** — no page, no path, no nav, no service, no API route. The dashboard's "Start Check-in" lands on the worker-layer evidence form (`ParticipantDashboard.jsx:53-59`), which is the R-09 layering inverted.

| Item | Figma | Build | Fix / size |
| --- | --- | --- | --- |
| Check-in page + 4 states | M-04 | not built | `ParticipantCheckin.jsx` + `PARTICIPANT_PATHS.checkIn` + route + dashboard banner + hooks/service — L |
| Check-in API | `POST /participant/checkins`, `GET ?from=&to=`, `PATCH /:id` same-day, participant-only middleware | none | `checkin.route.ts` under `/api/v1/participant`, guard exactly like `profile.route.ts:13` — M |
| Check-in data | 5 fields, one per day, edits until local midnight | `ParticipantCheckin` (`schema.prisma:356-385`): fits `intensity_rating / impact_notes / helped_notes / recovery_notes / own_words / checkin_date`; but **`is_locked @default(true)` contradicts same-day PATCH**, no `updated_at`, no unique `(participant_id, checkin_date)`, no participant timezone, six unused tag/goal columns, table mapped singular `tmg_participant_checkin` vs the pack's `tmg_participant_checkins`, 0–4 CHECK not in Prisma | migration — M |
| Daily Log Submitted state | `1169:1112` | not built | status prop on `ParticipantDailyLog` (read-only + footer swap) — M |
| Draft interactivity + finalise rule | 1–3 goals + ≥1 domain to submit | zero handlers; `canFinaliseDailyLog` unused | form state + gate Submit + API — L (backend stream) |
| Evidence view reachable | after submit via "Add Addendum" | URL only | wire from Submitted footer / a log list — S |
| Terminology/copy | see §2.2 | 6 lines | S |
| Addendum reason | "Reason for Note" + "Reason: Clarification" | `DailyNoteAddendum` has no `reason` column | add column — S |
| Participant daily-log fields vs `DailyNoteStructured` | Start/End Time, free-text impacts + support delivered | only `duration_minutes`, `impact_tags[]`, `support_type_tags[]`; times live on the worker-private note | decide fields or add columns — M |
| Status vocabulary | "Submitted" | `DAILY_LOG_STATUS = draft \| finalised` (`evidence.js:7-10`) vs Prisma default `"submitted"`; `isAddendumOnly()` tests the *snapshot* enum so it is never true for a note | unify — S |

### 3.5 Monthly Snapshot (4 states) + Snapshot Exports

**Figma.** *Draft `1169:1349`* (2452px tall, the richest participant frame): status pill "Draft — participant review", H1 "Monthly Snapshot Summary", "Review your monthly support evidence before approving and locking your snapshot.", month selector "June 2026" · "June Overview" + 4 stat tiles (28 DAYS LOGGED / 14 GOALS ADVANCED / High ENERGY TREND / 4 CHECK-INS) · "Language Perspective" 3-way toggle (Plain language / Functional meaning / NDIS evidence language) · "Goal Progress Summary" cards (Positive Trend / Maintaining, "12 logs this month") · "Functioning with Support" (WITH SUPPORT / WITHOUT SUPPORT) + Participant Voice quote ("Participant-authored") · "Functional Domain Trends" chart with a "Mandatory Statement Overlay": **"Capacity is not linear — variation in daily functioning does not indicate regression. This data reflects support needs, not personal failure."** · right: "Source Material — Generated from Daily Support Evidence Logs and check-ins for this month.", AI "Help me review this", approval area "Ready to lock?" / "Approve and Lock" / "Save as Draft" · APP footer. *Generating `1169:1671`:* orb + "Compiling your snapshot..." / "We're gathering insights from your June 2026 Daily Logs and check-ins. This usually takes a few seconds." *Locked `1169:1767`:* "October Snapshot", chip "Approved and Locked", buttons "Addendum" / "Export Snapshot", Core Engagement (42.5 hrs / 14 Days streak), Focus Areas (Therapeutic Sessions 45% …), Monthly Reflection quote, "Snapshot was locked on Oct 31, 2023.", "Download as PDF" / "Share time-limited link" / "View audit log" — **no fluctuation statement**, different month and metric vocabulary from Draft. *Addendum `1170:6451`:* H1 48px, chip "Approved and locked", banner "This snapshot is locked. You can add an addendum if something needs to be included." + abridged statement, "Snapshot Preview" (PLAIN LANGUAGE SUMMARY / FUNCTIONAL MEANING / NDIS EVIDENCE LANGUAGE cards), "Add Addendum" (Date Added, Reason for Addendum "Select a reason...", Addendum Note, Save Addendum / Cancel), full-width "Addendum History" ("Added by Participant • Context").

**Figma Exports `1169:1940` + R-08a `3240:134`:** "Snapshot Exports" / "You own this information. You decide who sees it." · "Participant-Owned Data" card whose middle sentence R-08a replaces with **"Exports contain only what you've chosen to share. TMG180 stores no medical or treatment records."** · Notice "You are about to download private health information…" · EXPORT HISTORY list (June "Locked & Ready" PDF/Share; May highlighted "Link Active" PDF/Manage Sharing; April) · sticky "Share May 2026" (Link Expiry 7/30/**90** with 30 selected, "Allow PDF Download", ACTIVE SECURE LINK + copy, Revoke Link / Update Link) · Audit Log ("Dr. A. Smith (Viewed)", "Link Generated" System). No filters/sort/pagination/empty state.

**Build.** `MonthlySnapshotSummary.jsx` = the **Addendum** frame only, static, faithful except: H1 `text-2xl` (Figma 48px), Addendum History nested in the left column (Figma full-width), reason `<select>` has three invented options ("Additional context / Correction / Clarification") that don't match the history chip vocabulary "Context", "baseline" re-introduced (`:27`), Save Addendum inert. Draft / Generating / Locked: **not built in any form** — no month selector, no approval control, no language toggle, no statement overlay, no export entry. `SnapshotExports.jsx` = `1169:1940`, faithful and static (11 inert controls); the ownership card (`:126-131`) says "…without any **worker notes** or external commentary…" — neither Figma nor R-08a, and factually wrong (snapshots are generated from worker notes).

| Item | Figma | Build | Fix / size |
| --- | --- | --- | --- |
| Draft state (approval is the participant's act) | `1169:1349` | not built | status-driven page, Draft default — L |
| Generating / Locked states | `1169:1671` / `1169:1767` | not built | S / M; route Locked "Export Snapshot" → `/participant/snapshot/exports` |
| Fluctuation statement | Draft full; Addendum abridged; DB default (`schema.prisma:425`) a third wording; Locked none | abridged only | declare one sentence, render in all states, seed `nonlinear_statement` from it — M |
| R-08a exports copy | approved sentence | "worker notes" rewrite `:126-131` | S — highest-priority copy fix in scope |
| Exports reachability | Locked snapshot → Exports | only the dashboard Export card (R-02 removes it) | add entry on the snapshot page — S |
| Addendum reason | select + "Context" chip | invented options; `SnapshotAddendum` has no `reason` | agree vocabulary + column — M |
| Language layers | Plain / Functional / NDIS as stored artefacts | 3 hardcoded strings; `MonthlySnapshot` has **no NDIS-language column** | add columns or map — M |
| Status enum | draft → generating → awaiting approval → locked (+addenda) | `SNAPSHOT_STATUS = generating \| awaiting_approval \| locked` vs Prisma default `"draft"`; web imports neither | unify in `@tmg180/shared` — M |
| Export/share model | history, 7/30/90-day revocable link, PDF toggle, per-viewer audit | only `exported_at` / `export_format` scalars; no `SnapshotExport`/`ShareLink` model | greenfield (`ExternalWorkerInvitation` token/expiry shape + `AuditLog` reusable) — L |
| Schema ↔ design content | DB has `what_mattered / what_helped / what_got_in_way / recovery_cost / next_month_intentions / outcome_tags` | none of them appear on **any** snapshot frame; conversely Draft's goal cards/trend chart/stat tiles and Locked's hours/streak/% have no columns | design + schema reconciliation (Sue/Saf) — M |
| Empty state (no approved snapshot yet) | not designed | 3 hardcoded rows | design ask + build — M |

### 3.6 Browse Directory + Relational Worker Profile (+ the retiring pair)

**Figma directory `3238:388`:** "Browse Directory" · "Verified worker profiles, led by how people support — not by scores. Listed alphabetically." · two pill filters "Location: Melbourne — all ▾" / "Support area: All areas ▾" (frame literally named "Filters (location, support area only)") · no sort control, no count, no pagination, no empty state, no favourites · row cards 924×135: `#ede9fe` avatar · name (violet) · meta "Relational Worker · Richmond, VIC · 8 Years Exp." · quote · two Soft chips · right-aligned secondary "View profile" · designer annotation (not UI copy) restating R-06/R-04.

**Figma worker profile `3239:95`:** avatar · name 32px violet + inline "Active" status chip · three neutral Badge pills (Relational Worker / Richmond, VIC / 8 Years Exp.) · quote · two columns: "A little about me" (+ nested "Natural Support Style — Calm, consistent, and person-led."), "Best Working Relationship" (primary-outline card) | "Interests" (Soft chips), "Communication" (green-dot rows), **"What I bring to support"** (green heading, Card/Green outline, frame named "strengths (worker-authored, no quote marks)", Strength chips unquoted, no icons) · full-width "Weekly Availability" (DS grid: 7 tinted cells × AM/PM, SAT/SUN amber headers, no "AVAIL" text; annotation "renders only from the profile detail response") · "Credentials" (DS credential rows, green status text) · footer Mandatory Notice bar **"TMG180 does not coordinate services. Participants contact workers directly using their preferred contact method."** · **no buttons at all** — no contact CTA, no back link (design gap: the notice says contact directly, the screen offers no method).

**Build.** `BrowseVerifiedWorkers.jsx` = the superseded `1219:2237`: "Browse Verified Workers" + breadcrumb, 4 static filter controls incl. **Search Keywords** + Apply Filters, 3-col vertical cards with Communication Style / Support Style / Preferred Env., **"Next Available" + 7-day availability strip (R-04 violation ×2)**, emerald support-area chips, full-width "View Profile", inert pagination 1 2 3 … 12; mock order not alphabetical; no ratings ✓. `RelationalWorkerProfile.jsx` = the superseded `1221:3413` and behind even that: **"What participants appreciate"** with a Star icon (`:160-165`), `APPRECIATIONS` labels wrapped in literal quotes with icons (`:20-24`), footer "Mandatory Notice: … Contact happens directly with the independent worker…" (`:275-278`), extra "Experience & Skills" card (`:217-252`), "AVAIL" text pills instead of tinted cells (`:44-50`), 176px avatar/`text-5xl` name, differing quote/about/style/relationship copy; structure otherwise right; no buttons (matches Figma). `WorkerDirectory.jsx` (defaults to a **Favourites** tab, hearts, "Availability" in list) and `WorkerDirectoryProfile.jsx` (heart, "Typical Availability" table, clinical-leaning tags, and the portal's **only Contact block** — "Call Sarah" / "Send Email") are reachable by URL only (`ParticipantSidebar.jsx:30` only *highlights* `P.directory`; nothing navigates there). **No Prisma model** backs any of this — no worker profile, credential, availability, or directory table (`grep worker_relational|supporting_details|availab` → nothing relevant).

| Item | Figma | Build | Fix / size |
| --- | --- | --- | --- |
| R-04: no availability in list | none | "Next Available" + strip (`:130-154`), `availability[]`/`nextAvailable` data | delete — S |
| Filters | Location + Support area pills | 4 controls + Apply | collapse — M |
| Card | row card, meta line, 2 Soft chips, "View profile" | vertical card, 8 blocks, "View Profile" | rebuild — M |
| Title/subtitle/ordering | "Browse Directory" / "…not by scores. Listed alphabetically." | "Browse Verified Workers" / "Connect with…"; unsorted | S |
| F-1..F-4 on profile | "What I bring to support", unquoted Strength chips, canonical notice, no icons | "What participants appreciate", quoted + icons + Star, rewritten notice | S |
| Extra card / DS alignment | no Experience & Skills; DS availability grid, credential rows, badges | present; AVAIL pills; mixed badge styles | S each |
| Retire pair | — | WorkerDirectory.jsx, WorkerDirectoryProfile.jsx, `paths.js:43-44`, `participantRoutes.jsx:53-54`, sidebar `match` | delete after harvesting the Contact block — S |
| Data contract | list DTO **without** `supporting_details`; detail adds `status, intro_quote, about, natural_support_style, best_working_relationship, interests[], communication[], strengths[] (worker-authored), supporting_details.availability{mon…sun:{am,pm}}, credentials[]` | nothing in Prisma or API | greenfield: P3-01/P3-03 tables + `GET /participant/workers`, `/workers/:id` — L (worker stream) |
| Contact method + empty state | not designed | none | design ask (Saf) — M |

### 3.7 Help Centre · Privacy & Sharing · Session Preferences · Library · Permission Denied

| Screen | Figma (`frame`) vs build — the substantive gaps |
| --- | --- |
| **Help Centre** `1169:2152` | Figma: subtitle "Find guidance about your profile, evidence logs, snapshots, exports, privacy and directory use."; search pill with a filled "Search" button; **5** link-cards (Personal Profile / Evidence & Snapshots / Snapshot Exports / Verified Directory / **Privacy & Sharing** spanning 2 cols with an "Important" badge + APP/NDB footnote); FAQ **2-col grid** of 6 named questions; "Need more help?" support card with "Contact support". Build (`ParticipantHelpCentre.jsx`): rewritten subtitle, no Search button, **6** rewritten cards (plain divs, not links), 6 different FAQ questions stacked with chevrons but no expand state, **no support card**, plus an invented "Privacy & Compliance Notice" footer (`:127-138`). Reachable ✓. Fix: replace `TOPICS`/`FAQS`, add support card, drop the notice — M. Add a Library card here (see Library). |
| **Privacy & Sharing** `1169:2326` | The closest match of the five — header, hero ("You own this information." / "You decide who sees it. Your daily logs and snapshots remain private until you explicitly choose to share them."), 4 sharing toggles (titles/bodies/states verbatim), Support Team Access table (columns verbatim), Consent Audit Log, Active Share Links, export history, notice card all transcribed. But: `Toggle` is a presentational `<div>` (`:92-106`, no role/aria/state); Grant Access / Review / Remove / View Full Log / Copy Link / revoke all lack `onClick`; "in compliance with" `:393`; the right-column card heading duplicates "Support Team Access" (inherited Figma bug — layer name says "Snapshot Export History"); audit icons all grey (Figma green/grey/green); the approved "TMG180 stores no medical or treatment records." is missing. Data fit: `Consent` (per-worker `can_view_snapshot`, `can_add_daily_note`, `can_view_checkins`, `revoked_at`, `superseded_by`) backs the table/Remove/append-only rule; `ExternalWorkerInvitation` (72-hour `expires_at`) backs Grant Access; `AuditLog` backs the log — but there is **no `can_view_daily_note`**, no notification-preference model, no share-link model, no audit outcome column, and **no UI anywhere for `ParticipantProfileAnswer.visibility`** (P1-03) or `DeletionRequest`. Reachable ✓. Fix: real toggles + wiring — M; copy — S. |
| **Session Preferences** `1170:5652` | Figma: breadcrumb "MY PROFILE › PREFERENCES" (profile nav active), notice, six chip groups (Support Focus / General Availability / Communication Format / Setting / Languages "Other ▾" / Relational Style) — all labels match the build's arrays verbatim — Save Draft / Save Preferences. Build (`SessionPreferences.jsx`): **no `useState`** — no chip can be selected, buttons inert, "Other +" literal (`:38`), headings 14px vs 24px, breadcrumb inert. Reachable only via the top-bar gear; no nav highlight. Data: no model — best fit is a dedicated `ParticipantProfileSection` with one `question_key` per group (gets per-answer `visibility` for free). Fix: state + persistence — M. |
| **Library** `1170:5926` | Figma: "Library", search, tabs Core Library / Optional Reading, two categories ("Personal Profile **(personal profile)**", "Daily Support Evidence Log") × 2 guide cards each ("Open guide"); Help Centre is the active nav item on this frame (Library has no nav slot anywhere). Build (`Library.jsx`): strings verbatim **except `:17` "(FCA baseline)"**; `activeTab` state exists but content ignores it (`:122`); "Open guide" inert; **orphaned** (no link anywhere; `navMaps` entry dead). Fix: string, tab gate, link from a Help Centre card + `match: [P.help, P.library]` — S/M. |
| **Permission Denied** `1205:1556` | All four strings verbatim ("You don't have access to this information" / "This information is participant-owned and can only be viewed with the correct permission." / "You own this information. You decide who sees it." / "Open Privacy & Sharing" + "Go back"); both buttons wired. Gaps are size/shape (768px r:40 card, 224px illustration, 32px H1 vs `max-w-xl`, 96px, `text-2xl`) and the shared `TopBar.jsx` with its Unsplash avatar. **Nothing redirects here** — no consent guard exists yet. Fix: swap top bar, scale — S; wire from the future consent guard — M. |

### 3.8 Mobile frames (8, not built)

`1205:1795` Personal Profile (says "Your Profile", has a "Functional Capacity" block, pre-R-01 form) · `1205:1939` Dashboard (3 actions + "3/5 Logs" stats — pre-R-02) · `1205:2033` Daily Log (4-step wizard with "Support Modality" / "Environment" — no desktop equivalent) · `1205:2208` Snapshot ("Overall Mood / Energy Levels / Sleep Quality", "Approve & Lock Snapshot", **no fluctuation statement**) · `1205:2352` Directory (**"4.9 (120 reviews)", "MINIMUM RATING" — R-06 violations**) · `1205:2522` Exports ("automatically expire after 7 days", **QUARTERLY SUMMARY**, "Generated" not "Approved") · `1205:2646` Worker Profile ("4.9", "120+ Sessions", "Senior Support Coordinator") · `1205:2765` Privacy & Sharing ("Dr. Sarah Jenkins / Primary Therapist", "Anonymous Research" toggle, "Full/Limited"). All use a bottom tab bar Home / Profile / Log / Snapshot / Browse. **Recommendation:** treat all eight as pre-ruling explorations; re-derive from the v2 desktop frames before any mobile build (M-14 scope pending). `ParticipantLayout` has no responsive branch at all (`w-64` + `pl-64`, no breakpoints).

---

## 4. Data layer fit (participant)

| Feature | Prisma today | Fit | Gaps |
| --- | --- | --- | --- |
| Personal Profile | `ParticipantProfile` / `…Section` / `…Answer` (+ `visibility`) | ✓ live | R-01 slug backfill; `total_sections` frozen per row; no visibility UI |
| Check-in (M-04) | `ParticipantCheckin` → `tmg_participant_checkin` | partial | `is_locked` default, `updated_at`, unique per day, timezone, plural table name, unused tag columns; no API |
| Daily log (participant view of worker layer) | `DailyNoteStructured` / `DailyNotePrivate` / `DailyNoteAddendum`, `ParticipantGoal` | partial | free-text impacts/support columns, session times on the structured row, addendum `reason`, status vocabulary; `FUNCTIONAL_DOMAINS` still `null`; no API |
| Monthly snapshot | `MonthlySnapshot` / `SnapshotAddendum` | partial | statement wording, status enum, NDIS-language column, per-goal progress rows, addendum `reason`, dead `participant_addendum` scalar, nullable `snapshot_id`; sections in DB that no frame shows; no API |
| Exports / share links | `exported_at`, `export_format` scalars | ✗ | `SnapshotExport` history + `ShareLink` (token, 7/30/90 expiry, allow_pdf, revoked_at) + view audit; no API |
| Consent / privacy | `Consent`, `ExternalWorkerInvitation` (72h), `AuditLog`, `DeletionRequest`, `Notification` | mostly ✓ | `can_view_daily_note`, notification preferences, audit outcome, share-link model; no API |
| Session preferences | — | ✗ | model as a profile section (question_key per group) |
| Worker directory / profile | — | ✗ | P3-01 relational profile (7 prompts), P3-03 supporting details (availability, credentials), publish flag (R-07); list DTO must not reach `supporting_details` (R-04); no API |
| Library / Help | — | static | registry keys or a `LibraryGuide` table if ever dynamic |

---

## 5. Suggested participant work order (mirrors Build Guide §2, sized from this audit)

1. **R-01 profile pass — L.** Seed rewrite (§2.5) + Overview/WMTM pages + Self-care fold + retire Learning & employment + hub rebuilt to `3238:2` (numbers, always-on chips, progress row, ownership strings) + shell (breadcrumb, "Section N of 11", 2-button footer) + one-off DB backfill (`section_key`, `last_section_key`, self-care answers, orphan rows, `total_sections`). Copy fixes from §3.3 ride along.
2. **Dashboard R-02 — M.** 4-card config array, banner, greeting from the store, "N of 11" from `useProfile()`, drop Export card + chart, add the note line; chrome labels ("My Personal Profile", "Browse Directory", "Sign Out" + user block).
3. **Check-in M-04 — L.** Migration on `ParticipantCheckin`, `checkin.route.ts` + controller (participant-only, same-day PATCH until local midnight), `services/participant/checkin` + hooks, page with 4 states, banner wiring; then decide what `/participant/daily-log` becomes for participants (read-only worker evidence) under R-09.
4. **Copy + terminology sweep — S/M.** The §2.2 table, R-08a exports sentence, "TMG180 stores no medical or treatment records." on Privacy & Sharing, snapshot "baseline", Help Centre content, Library tag; land the strings file as a module and start `t()`/registry adoption.
5. **Directory + worker profile — M (UI) + L (data).** Strip R-04 list availability + keyword filter, row cards, retitle; F-1..F-4 on the profile; retire the two `/directory*` pages (harvest Contact); worker-stream tables + endpoints.
6. **Snapshot + exports — L.** Status-driven page (Draft default; Generating; Locked with export entry; Addendum), one fluctuation sentence everywhere, exports empty state, share-link/export models and endpoints.
7. **Privacy & Sharing / Preferences / Library / Help — M.** Real toggles + consent endpoints, preferences state + section, Library tab gate + Help Centre link, Help content rewrite; wire Permission Denied from the consent guard.
8. **Tokens — M** once Saf answers §2.6.

## 6. Open with Saf / Sue / Deb

- **Saf:** v2 vs Vibrant for existing screens (§2.6) — decides side panels, top bar, radii, blobs. · Worker profile has no contact affordance/back link — how does "contact directly" happen? · Directory empty state; exports empty state; snapshot Locked/mobile without the fluctuation statement; which of the three statement wordings is canonical; Locked/Draft metric vocabularies differ; Help card 5 "regulatory governance standing"; the Figma slips in §2.7; forward the delivered `WorkerProfile.jsx` / `tokens.css`.
- **Sue:** Learning & Employment 12th section (strings kept); "My support network" content (roles) that no field captures after the fold; addendum reason vocabulary (daily log + snapshot); the two consent strings; participant-facing check-in vs the six unused tag/goal columns.
- **Deb / backend:** `tmg_participant_checkin` vs `tmg_participant_checkins`; the check-in migration list; `DailyNoteAddendum.reason`; snapshot status enum + NDIS-language column; share-link/export models; `FUNCTIONAL_DOMAINS` list; worker profile tables (P3-01/P3-03).

## Appendix — files touched by the R-01 pass (for the ticket)

`packages/shared/src/profile.js` (seed) · `apps/web/src/routes/paths.js:26-36` · `apps/web/src/routes/participant/participantRoutes.jsx:2-46` · `apps/web/src/hooks/participant/profile.js:26-38, 99` · `apps/web/src/components/participant/ProfileSectionFooter.jsx` · `apps/web/src/pages/participant/MyPersonalProfile.jsx` · new `ProfileOverview.jsx`, `ProfileWhatMattersToMe.jsx` · `ProfileDailyLiving.jsx` (+ delete `ProfileSelfCare.jsx`, `ProfileLearningEmployment.jsx`) · `ProfileDecisionMaking.jsx:249` / `ProfileSafetySupport.jsx` ("Save & Finish") · `apps/api/prisma` one-off backfill script · `apps/api/src/controllers/profile.controller.ts:158-160` (count only seed keys).
