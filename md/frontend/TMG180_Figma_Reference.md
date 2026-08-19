# TMG180 — Figma Design Reference (canonical since 12 Aug 2026)

The **only** design source for development. Created 2026-08-17 when the team reset to the client's 12 Aug handover; everything about the previous Figma file lives in [../archive/](../archive/README.md) and must not be used.

- **File:** `TMG` — key **`afqPpGbttWc85160MpjoTT`** — <https://www.figma.com/design/afqPpGbttWc85160MpjoTT/TMG> · read at version `2386813351910390576` (last modified 2026-08-12 12:11 UTC, owner safmeo123). Deep-link any frame with `?node-id=<id with dash>` (e.g. `?node-id=3238-324`).
- **Build-from document:** [../TMG180_Developer_Build_Guide_2026-08-12.md](../TMG180_Developer_Build_Guide_2026-08-12.md) (Saf, 12 Aug). Quote its ruling IDs in tickets.
- **Access:** Figma REST API with Jiten's personal access token (ask in-session; never stored). Variables need the Enterprise `file_variables:read` scope — not available; palette/type are listed in §4 instead.
- **Local exports** (all from this file/version) in `C:\Users\Kalyan\Desktop\Office\TMG180\TMG docs\figma\`: `main-page/` (41 of 83 PNGs — the other 42 are pending: Figma's render quota for the token hit `Retry-After ≈ 4.6 days` on 2026-08-17; the list and how to fill it are in that folder's README; outlines for all 83 are complete), `v2-screens/` (22 PNGs + Flow Map), `design-system/` (12 PNGs), `outlines/` (layer outline + plain-text dump per frame). Filename = `Frame_Name__nodeId.png`.

## 1. Pages and the rule for each

| Page | Node | Contents | Rule |
| --- | --- | --- | --- |
| **TMG180 v2 — 02+03 All Screens** | `1137:6` | 22 dev-ready frames, 6 rows (§3) | **Build from. Where a v2 frame covers a screen, it overrides the main-page frame.** |
| **TMG180 v2 — 01 Design System** | `0:1` | 12 master components, 5 text styles (§4) | Tokens/components for everything new. |
| **TMG180 v2 — 04 Flow Map** | `124:2` | Routing diagram (`3241:2`) | Reference for navigation. |
| **Final Design Main Page** | `1169:2` | 83 frames (§2), terminology-swept | Build existing screens from here **unless superseded by a v2 frame** (marked below). |
| zz Archive — deprecated drafts (D-06) | `2:2280` | 59 superseded frames | **Never.** |

Flow (from `3241:2`): Sign In ↔ Create Account (5 states) → Workspace chooser (dynamic; single-role skips) → Participant Dashboard (4 actions) → { My Personal Profile hub → 11 section pages · Daily Log → Check-in (M-04) · Monthly Snapshot → Snapshot Exports (export lives here, not on the dashboard) · Browse Directory → Worker Profile }. Forgot/Reset hangs off Sign In.

## 2. Main page — 83 frames → built pages

Paths are `apps/web/src/pages/…`. "Superseded" = build from the named v2 frame instead. Mapping carried over from the 3 Aug inventory (node IDs unchanged) and paths updated to the role-folder layout.

### Auth (9)

| Frame | Node | Built page | Note |
| --- | --- | --- | --- |
| Sign In | `1169:5327` | auth/SignIn.jsx | Superseded → v2 `3234:138` |
| Check Your Email | `1169:5360` | auth/CheckYourEmail.jsx | Back-link "Return to Sign In" |
| Forgot Password | `1169:5399` | auth/ForgotPassword.jsx | |
| Reset Password | `1169:5449` | auth/ResetPassword.jsx | **Superseded (D-02)** — build only Create New Password |
| Create New Password | `1169:5500` | auth/CreateNewPassword.jsx | Frame still says "Back to Login" — guide rule "Return to Sign In" wins |
| Success State | `1169:5567` | auth/PasswordUpdated.jsx | |
| Role Selection | `1169:5586` | auth/RoleSelection.jsx | Superseded → v2 `3234:155` (D-01) |
| Choose Your Workspace | `1170:5875` | auth/ChooseWorkspace.jsx | Superseded → v2 `3234:155` |
| Choose Your Workspace (2nd) | `1205:612` | — | Superseded → v2 `3234:155`; frame still contains banned "TMG180 Governance Admin" |

### Participant (18)

| Frame | Node | Built page | Note |
| --- | --- | --- | --- |
| Vibrant Participant Dashboard | `1169:234` | participant/ParticipantDashboard.jsx | Superseded → v2 `3238:324` (R-02) |
| Daily Support Evidence Log (Draft) | `1169:825` | participant/ParticipantDailyLog.jsx | Participant layer of R-09 |
| Daily Support Evidence Log (Submitted) | `1169:1112` | state variant — not built | |
| Daily Support Evidence Log (Submitted + Addendum) | `1170:6606` | participant/DailySupportEvidenceLog.jsx | |
| Monthly Snapshot Summary (Draft) | `1169:1349` | participant/MonthlySnapshotSummary.jsx | |
| Monthly Snapshot Summary (Generating) | `1169:1671` | state variant — not built | |
| Monthly Snapshot Summary (Locked) | `1169:1767` | state variant — not built | |
| Monthly Snapshot Addendum | `1170:6451` | state variant — not built | |
| Snapshot Exports Dashboard | `1169:1940` | participant/SnapshotExports.jsx | Notice copy → v2 `3240:134` (R-08a) |
| Help Centre Dashboard | `1169:2152` | participant/ParticipantHelpCentre.jsx | |
| Privacy & Sharing Dashboard | `1169:2326` | participant/PrivacySharing.jsx | |
| Session Preferences Dashboard | `1170:5652` | participant/SessionPreferences.jsx | |
| Participant Library | `1170:5926` | participant/Library.jsx | |
| Worker Profile Detail | `1170:6090` | — (WorkerDirectoryProfile.jsx deleted 2026-08-19) | Older directory profile — v2 `3239:95` built instead |
| Worker Directory - Favourites Tab | `1170:6301` | — (WorkerDirectory.jsx deleted 2026-08-19) | Older directory — v2 `3238:388` built instead |
| Browse Verified Workers | `1219:2237` | participant/BrowseVerifiedWorkers.jsx | Superseded → v2 `3238:388` (R-06/R-04) |
| Relational Worker Profile - Sarah Mitchell | `1221:3413` | participant/RelationalWorkerProfile.jsx | Superseded → v2 `3239:95` (F-1..F-4) |
| My Personal Profile (hub) | `1207:5` | participant/MyPersonalProfile.jsx | Superseded → v2 `3238:2` (R-01/R-03) |

### My Personal Profile sections (11 frames on the main page — but R-01 fixes the set to the Override 11)

Seed order (R-01): `overview` · `about_me` · `how_i_communicate` · `what_matters_to_me` · `my_goals` · `daily_living` · `mobility_access` · `health_wellbeing` · `social_community` · `decision_making` · `safety_support_preferences`.

| # | Section | Frame | Built page |
| --- | --- | --- | --- |
| 01 | Overview | v2 `3236:238` (M-11) | — not built |
| 02 | About Me | `1207:376` | participant/ProfileAboutMe.jsx |
| 03 | How I Communicate | `1207:694` | participant/ProfileHowICommunicate.jsx |
| 04 | What Matters To Me | v2 `3236:293` (M-12) | — not built |
| 05 | My Goals | `1207:867` | participant/ProfileMyGoals.jsx |
| 06 | Daily Living | `1207:1017` (+ Self-care `1207:538` folds in) | participant/ProfileDailyLiving.jsx (+ ProfileSelfCare.jsx to fold/retire) |
| 07 | Mobility & Access | `1207:1203` | participant/ProfileMobilityAccess.jsx |
| 08 | Health & Wellbeing | `1207:1400` | participant/ProfileHealthWellbeing.jsx |
| 09 | Social & Community | `1207:1608` | participant/ProfileSocialCommunity.jsx |
| 10 | Decision Making | `1207:1803` (absorbs "My support network") | participant/ProfileDecisionMaking.jsx |
| 11 | Safety & Support Preferences | `1207:1992` | participant/ProfileSafetySupport.jsx |
| — | Learning & employment | `1207:187` | participant/ProfileLearningEmployment.jsx — **dropped by R-01** (12th-section candidate, Sue's call); retire |

Section-page button system (guide §3): **Save Draft / Save & Continue** only.

### Worker (14)

| Frame | Node | Built page | Note |
| --- | --- | --- | --- |
| Worker Workspace Dashboard | `1169:2660` | worker/WorkerDashboard.jsx | |
| Participants I Support | `1169:2956` | worker/ParticipantsISupport.jsx | |
| Worker Daily Support Evidence Log | `1169:3172` | worker/DailyLogForm.jsx | Worker layer of R-09; comparison chips: Typical / More support needed / Less support needed / Different support needed |
| Approved Monthly Snapshots | `1169:3455` | worker/ApprovedSnapshots.jsx + worker/WorkerSnapshotDetail.jsx | Dynamic 2026-08-19. The frame's Status filter has one possible value (only locked snapshots reach a worker), so it renders as a fixed statement, not a control. "View Snapshot" goes to the detail page, which the frame does not draw — built in the portal idiom. |
| Worker Portal - Learning Hub | `1169:3676` | worker/LearningHub.jsx | Onboarding pill copy → v2 `3240:126` (R-07) |
| Worker Governance Standing | `1169:3916` | worker/WorkerGovernanceStanding.jsx | |
| Worker Portal - Resources | `1170:6813` | worker/Resources.jsx | |
| Worker Portal - Settings | `1170:7043` | worker/WorkerSettings.jsx | |
| Worker Calendar Dashboard | `1170:7390` | worker/Calendar.jsx | |
| Worker Help Centre Dashboard | `1170:7686` | worker/HelpCentre.jsx | |
| Governance Item Detail | `1170:7877` | worker/GovernanceItemDetail.jsx | |
| Worker Profile & Availability | `1170:8069` | worker/WorkerProfile.jsx | Onboarding pill copy → v2 `3240:126` (R-07) |
| Worker Onboarding | `1170:8393` | worker/WorkerOnboarding.jsx | |
| Worker Resource Detail | `1170:8551` | worker/LearningHubResource.jsx | |

### Admin / Platform Governance (13)

| Frame | Node | Built page | Note |
| --- | --- | --- | --- |
| TMG180 Platform Governance Dashboard | `1169:4181` | admin/PlatformGovernanceDashboard.jsx | |
| Admin Participant Overview | `1169:4370` | admin/ParticipantOverview.jsx | **Remove page + nav item (R-05)** |
| Admin - Consent Audit Log | `1169:4639` | admin/ConsentAuditLog.jsx | |
| Add New Report | `1169:4853` | admin/AddNewReport.jsx | Notice copy → v2 `3240:150` (R-08c) |
| Admin Profile Dashboard | `1169:5056` | admin/AdminProfile.jsx | Label "Platform Governance" |
| Admin - Workers Report Dashboard | `1170:8762` | admin/WorkersReport.jsx | |
| Admin Governance Standing | `1170:9001` | admin/GovernanceStanding.jsx | |
| Admin - Incidents & Complaints | `1170:9251` | admin/IncidentsComplaints.jsx | "Reviewing admin" / "No reviewer yet" |
| Admin - Policies Management | `1170:9492` | admin/Policies.jsx | |
| Admin - Settings Dashboard | `1170:9593` | admin/SettingsPage.jsx | |
| Report Detail | `1205:2` | admin/ReportDetail.jsx | |
| Policy Version Detail | `1205:276` | admin/PolicyVersionDetail.jsx | |
| Ticket Detail | `1205:669` | admin/TicketDetail.jsx | "Reviewer: …" |

### Empty / error / privacy states (10 — all built)

No Daily Logs `1205:943` → worker/EmptyDailyLogs · No Consent Access `1205:1061` → worker/NoConsentAccess · No Export `1205:1210` → worker/EmptyExport · No Favourites `1205:1320` → worker/EmptyFavourites · Something Went Wrong `1205:1427` → auth/SomethingWentWrong · No Monthly Snapshot `1205:1457` → folded into worker/ApprovedSnapshots' empty state 2026-08-19 (`EmptyMonthlySnapshot.jsx` deleted) · Permission Denied Participant/Worker/Admin `1205:1556`/`1600`/`1683` → participant/PermissionDeniedParticipant, worker/PermissionDeniedWorker, admin/PermissionDeniedAdmin · Link Expired / Revoked `1205:1755` → auth/LinkExpired.

### Mobile (8 — not built; M-14 mobile scope pending)

Personal Profile `1205:1795` · Participant Dashboard `1205:1939` · Daily Support Evidence Log `1205:2033` · Monthly Snapshot Summary `1205:2208` · Worker Directory `1205:2352` · Snapshot Exports `1205:2522` · Worker Profile Detail `1205:2646` · Privacy & Sharing `1205:2765` (all 390 wide).

## 3. v2 screens — 22 frames (page `1137:6`)

| Row | Frame | Node | Size | Built page today | Status vs design |
| --- | --- | --- | --- | --- | --- |
| 1 Auth | M-01 Create Account / 1 Empty | `3234:2` | 1280×960 | auth/SignUp.jsx | Partial — see gaps |
| 1 | M-01 Create Account / 2 Field errors | `3234:41` | 1280×960 | auth/SignUp.jsx | Partial |
| 1 | M-01 Create Account / 3 Email already registered | `3234:81` | 1280×960 | auth/SignUp.jsx | Missing state |
| 1 | M-01 Create Account / 4 Submitting | `3234:107` | 1280×960 | auth/SignUp.jsx | Partial (label) |
| 1 | M-01 Create Account / 5 Success | `3234:130` | 1280×960 | — | Missing |
| 1 | Sign In (corrected — adds Sign up link, W-01) | `3234:138` | 1280×960 | auth/SignIn.jsx | Link text differs |
| 2 Workspace | Choose Your Workspace (single dynamic — D-01) | `3234:155` | 1280×960 | auth/ChooseWorkspace.jsx + RoleSelection.jsx | Collapse to one; copy |
| 3 Dashboard & Profile | Participant Dashboard (corrected — R-02) | `3238:324` | 1280×960 | participant/ParticipantDashboard.jsx | 5 cards → 4 + banner |
| 3 | Profile hub (corrected — 11 Override sections, R-01/R-03) | `3238:2` | 1280×1150 | participant/MyPersonalProfile.jsx | Re-seed sections |
| 3 | M-11 Profile section / Overview | `3236:238` | 1280×960 | — | Not built |
| 3 | M-12 Profile section / What Matters To Me | `3236:293` | 1280×960 | — | Not built |
| 3 | Hub card / Decision Making | `3236:348` | 380×220 | (card in hub) | — |
| 4 Check-in | M-04 Check-in / 1 Empty | `3236:2` | 1280×960 | — | Not built |
| 4 | M-04 Check-in / 2 Submitting | `3236:146` | 1280×960 | — | Not built |
| 4 | M-04 Check-in / 3 Success | `3236:195` | 1280×960 | — | Not built |
| 4 | M-04 Check-in / 4 Same-day edit | `3236:72` | 1280×960 | — | Not built |
| 5 Directory | Browse Directory (corrected — R-06 no ratings, R-04 no availability) | `3238:388` | 1280×1150 | participant/BrowseVerifiedWorkers.jsx | Filters/cards |
| 5 | Relational Worker Profile (corrected — F-1..F-4) | `3239:95` | 1280×1500 | participant/RelationalWorkerProfile.jsx | Copy |
| 6 Copy | Worker onboarding status (R-07) | `3240:126` | 760×420 | worker/LearningHub.jsx, WorkerProfile.jsx, WorkerOnboarding.jsx | Copy |
| 6 | R-08a — Snapshot Exports copy | `3240:134` | 640×420 | participant/SnapshotExports.jsx | Copy |
| 6 | R-08b — Admin aggregate view copy | `3240:142` | 640×420 | admin/ParticipantOverview.jsx | Page removed (R-05) |
| 6 | R-08c — Admin reports copy | `3240:150` | 640×420 | admin/AddNewReport.jsx | Copy |

Approved sentences (Row 6): pill — "Complete onboarding to publish your profile to the directory — optional."; exports — "Exports contain only what you've chosen to share. TMG180 stores no medical or treatment records."; reports — "Reports contain aggregates and identifiers only. TMG180 stores no medical or treatment records."

Key copy on the v2 screens (verbatim, for the strings module):

- **Sign In**: "Sign in" · Email `you@example.com` · Password `Your password` · "Forgot password?" · button "Sign in" · "New to TMG180? Sign up".
- **Create Account**: "Create your account" · "Your space, your information, your pace." · Full name `Your full name` · Email `you@example.com` · Password `At least 8 characters, with a number or symbol` · Confirm password `Re-enter your password` · "I am joining as" → Participant "I use supports" / Worker "I provide support" · 2 consent checkboxes (placeholder) · button "Create my account" / "Creating your account…" · "Already have an account? Sign in". Errors: "Enter a valid email address." · "Passwords need at least 8 characters and a number or symbol." · "Passwords don't match yet." Email taken: banner "That email already has a TMG180 account. You can sign in instead, or reset your password." + inline "This email is already registered." + "Sign in to this account instead". Success: "Your account is ready" · "Welcome to TMG180. Your workspace is set up and yours from day one — you choose what goes in it and who sees it." · "Go to my workspace".
- **Workspace chooser**: "Choose your workspace" · "You only see workspaces your account holds. If you hold one workspace, you go straight in and never see this screen." · "Participant Workspace — Your personal space — your profile, daily log and snapshots." · "Worker Workspace — Your independent workspace — logs, calendar and learning." · buttons "Open" · admin card label "TMG180 Platform Admin".
- **Participant sidebar (component `3232:33`)**: TMG180 / Participant Portal · Dashboard · My Personal Profile · Daily Log · Monthly Snapshot · Browse Directory · (footer) Help Centre · Privacy & Sharing · "Jordan P." / "Sign Out".
- **Dashboard**: "Good morning, Jordan" · "Your space. Everything here belongs to you." · banner "How's today going?" / "A 30-second check-in, in your own words." / "Start Check-in" · cards: "Continue My Profile — Pick up where you left off — 2 of 11 sections done. → Continue" · "Daily Log — Today's story, in your words and your workers' notes. → Open Daily Log" · "Monthly Snapshot — Your month, summarised — you approve what's in it. → View Snapshot" · "Browse Workers — Verified worker profiles, led by how people work. → Browse Directory".
- **Profile hub**: "My Personal Profile" · "Your story, your way. Complete sections at your own pace — everything here belongs to you." · "2 of 11 sections completed" · "Continue My Profile" · cards 01–11 with chips Not started / In progress / Completed.
- **Overview (Section 1 of 11)**: "A quick snapshot of you, in your words. There are no right or wrong answers — share only what you're comfortable sharing." · "Who am I, in a sentence or two?" · "What do people notice first about me?" · "What does a good day look like for me?" · Save Draft / Save & Continue.
- **What Matters To Me (Section 4 of 11)**: "The people, values and non-negotiables that shape how you want support to work. You own this information — you decide who sees it." · "People and relationships that matter to me" · "What I value most in how I'm supported" · "Things I never want to happen".
- **Check-in**: "Today's check-in" · "Thirty seconds, in your own words. This is yours — workers only see it if you share it." · "How intense was today?" 0–4 ("A settled day" … "A very big day") · "What showed up today?" · "What helped?" · "What did it cost you?" · "In my own words" · "Save my check-in" / "Saving…" · success "Check-in saved — Nice one. Today is captured in your own words — it feeds your monthly snapshot, and you can edit it any time before midnight." → "Back to Dashboard" / "Edit today's check-in" · edit banner "You're editing today's check-in. Edits close at midnight — after that it becomes part of your record." → "Save changes" / "Discard changes".
- **Browse Directory**: "Browse Directory" · "Verified worker profiles, led by how people support — not by scores. Listed alphabetically." · filters "Location" / "Support area" · card: name · "Relational Worker · Richmond, VIC · 8 Years Exp." · quote · support-area chips · "View profile".
- **Relational Worker Profile**: header name + "Active" + chips Relational Worker / Richmond, VIC / 8 Years Exp. + quote · "A little about me" (+ "Natural Support Style") · "Interests" · "Communication" · "Best Working Relationship" · "What I bring to support" (unquoted green chips) · "Weekly Availability" (AM/PM × Mon–Sun) · "Credentials" · footer "TMG180 does not coordinate services. Participants contact workers directly using their preferred contact method."

## 4. Design system (page `0:1`)

Components: `Sidebar / Participant` `3232:33` · `Button` `3232:89` (Primary/Secondary/Text × Default/Hover/Disabled/Loading "Please wait…") · `Chip` `3232:98` (Soft/Filled/Strength/Neutral) · `Status chip` `3232:111` (Not started/In progress/Completed/Active) · `Form field` `3233:19` (Default/Focus/Error/Disabled) · `Checkbox row / Consent` `3233:20` · `Mandatory Notice bar` `3233:23` · `Card` `3233:34` (Default/Primary outline/Green outline) · `Section hub card` `3233:53` (3 statuses) · `Credential row` `3233:54` · `Availability grid` `3233:59` · `Badge` `3247:317`.

Text styles: `TMG180/display · h2 · h3 · body · micro` — all **Inter**. Observed sizes: display 30–32px w800, h2 20–24px w800, h3 14–17px w600/700, body 13.5px w400 (lh 16), micro 10.5–11.5px.

Palette observed on the v2 pages (Tailwind names): primary violet-600 `#7c3aed` (hover/dark violet-700 `#6d28d9`, tint violet-100 `#ede9fe`); page bg slate-100 `#f1f5f9`; card white; borders slate-200 `#e2e8f0`; text slate-800 `#1e293b`, secondary `#475669`, muted slate-400 `#94a3b8`; success green-100 `#dcfce7` / green-700 `#15803d`; warning amber-100 `#fef3c7` / amber-700 `#b45309`; error red-100 `#fee2e2` / red-700 `#b91c1c`. Frames 1280×960; sidebar 260 wide; radii ~12px.

**Open with Saf:** whether this v2 style replaces the main page's "Vibrant" style (`#7800ce`, blurred blobs, 48px radii, 48px display) for the existing screens, or v2 frames are structural only. Also: the "delivered code" (`WorkerProfile.jsx`, `tokens.css`, `worker-profile-preview.html`) referenced in the guide was sent to Deb, not this repo — request it.

## 5. Build gaps vs this design (as of 2026-08-17, code untouched)

Sized S/M/L. Details and file:line refs are in the archived audit ([../archive/TMG180_Figma_v2_Comparison_2026-08-17.md](../archive/TMG180_Figma_v2_Comparison_2026-08-17.md) §3) — the code side of that doc is still accurate.

1. **R-01 profile re-seed — L.** `packages/shared/src/profile.js` holds the old 11 with hyphenated keys; move to the Override 11 (underscore slugs, fixed order), add Overview + What Matters To Me pages, retire Learning & employment, fold Self-care into daily_living, remap `paths.js`/routes/`SECTION_PATHS`/hub cards, one-off DB remap of `section_key` / `last_section_key`; hub copy + 01–11 numbering + "Not started" chip; footer → Save Draft / Save & Continue.
2. **Auth (M-01 / W-01 / D-01) — M.** Sign In "Sign up" link text; "Return to Sign In" on CreateNewPassword / ResetPassword / LinkExpired; SignUp title/subtitle, Confirm password + mismatch error, role-card copy, button copy, email-taken state, success screen; one dynamic chooser reachable for multi-role accounts; retire ResetPassword.jsx.
3. **Check-in (M-04) — L.** Page + 4 states, service/hooks, API `POST/GET/PATCH /api/v1/participant/checkins` on the existing `tmg_participant_checkin` model (+ `updated_at`, midnight lock, participant-only middleware); wire the dashboard banner.
4. **Dashboard (R-02) — M.** 4-card config array, banner, drop Export card, greeting copy, "N of 11" from `useProfile()`.
5. **Directory + profile (R-06 / R-04 / F-1..4) — M.** **Done 2026-08-19** (both pages dynamic on the new worker-profile tables; `WorkerDirectory.jsx` / `WorkerDirectoryProfile.jsx` retired). Was: Remove keyword filter + availability from list, retitle, meta line; rename "What participants appreciate" → "What I bring to support", un-quote chips, footer notice; retire/align WorkerDirectory.jsx + WorkerDirectoryProfile.jsx.
6. **Copy sweep + R-05 / R-07 / R-08 — S/M.** Sidebar "My Personal Profile" / "Browse Directory" / "Sign Out"; ~25 banned-term lines (FCA baseline in Library, baseline chips in both daily logs, APP Compliant, Compliance notices, Governance Admin ×4, Assigned ×5, clinical ×3); remove Admin Participant Overview + nav items; pill copy ×3; exports/report notices.
7. **Tokens — M**, pending Saf's answer above: `@theme` brand → violet scale, Inter, sweep hard-coded hexes.
