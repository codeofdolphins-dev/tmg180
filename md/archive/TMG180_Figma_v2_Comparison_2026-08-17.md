# TMG180 — Figma v2 (12 Aug 2026) vs the built app

Prepared 2026-08-17 by Claude Code for Jiten / Deb / Zain. Companion to the client's [Developer Build Guide (12 Aug)](../TMG180_Developer_Build_Guide_2026-08-12.md). Everything below was read from the Figma REST API (new file `afqPpGbttWc85160MpjoTT`, version `2386813351910390576`, last modified 2026-08-12 12:11 UTC) and compared against (a) the 29 Jul 2026 version of the old file `NvZmofeFew3VeREx6JBarF` that the current build was made from, and (b) the code in `apps/web` / `apps/api` / `packages/shared` at commit `f0a5460`.

Assets saved alongside the earlier exports in `TMG docs/figma/v2/`: 22 v2 frame PNGs + Flow Map, `design-system/` (12 component PNGs), `outlines/` (layer outline + plain-text dump per frame, design-system outline, flow-map outline).

---

## 1. What is in the new Figma file

| Page | Node | Contents | Status for us |
| --- | --- | --- | --- |
| Final Design Main Page | `1169:2` | **83 frames — the same 83 node IDs as the old file** (+1 "Phone View" label). Text swept (see §2). | Existing screens still build from here, with the copy changes below. |
| TMG180 v2 — 01 Design System | `0:1` | 6 components + 6 component sets, 5 text styles (`TMG180/display · h2 · h3 · body · micro`, all Inter). Variables (colour/space/radius) exist but the REST `variables/local` endpoint needs the Enterprise `file_variables:read` scope — **not readable with our token**. | Palette is plain Tailwind (see §4). Ask Deb for the delivered `tokens.css`. |
| TMG180 v2 — 02+03 All Screens | `1137:6` | **22 dev-ready frames** in 6 labelled rows (see §3). | New/corrected screens build from here. |
| zz Archive — deprecated drafts (D-06) | `2:2280` | 59 superseded frames inside one 20145×20902 container + 2 loose "Body" frames. | Never build from. |
| TMG180 v2 — 04 Flow Map | `124:2` | One 2200×1250 reference diagram: Sign In ↔ Create Account → Workspace chooser → Participant Dashboard → {Profile hub → 11 sections, Daily Log → Check-in, Monthly Snapshot → Snapshot Exports, Browse Directory → Worker Profile}; Forgot/Reset off Sign In. Purple = new/corrected in v2, white = unchanged. | Routing reference — matches our `paths.js` topology except the check-in branch (unbuilt). |

Note: the *old* file key `NvZmofeFew3VeREx6JBarF` was also edited on 12 Aug (11:34) and has the v2 pages split as "02 Missing Screens" / "03 Corrected Screens". The new key merges them and is the one Saf's guide links — treat `afqPpGbttWc85160MpjoTT` as canonical and stop reading the old key.

## 2. Main-page text sweep — exact diff (29 Jul → 12 Aug)

Method: multiset diff of every visible TEXT node per frame, same node IDs. **42 of 83 frames changed; 79 strings removed, 80 added** — consistent with the guide's "75+ text corrections". Full per-frame list in the appendix. The patterns:

| Pattern | Frames | Build impact |
| --- | --- | --- |
| Sidebar/nav "My Profile" → **"My Personal Profile"** | 27 frames (every participant frame with a sidebar) | Our participant sidebar is shared (`ParticipantSidebar.jsx`) — one label change + `navMaps.js` key + `SessionPreferences` breadcrumb. |
| "Your Personal Profile" → "My Personal Profile"; "Continue Your Personal Profile" → **"Continue My Profile"** | 1207:5 hub | `MyPersonalProfile.jsx:201–224`, side-panel copy in `ProfileAboutMe.jsx:7`, `ProfileMyGoals.jsx:23`. |
| "Personal Profile (FCA Baseline)" → "My Personal Profile"; "(FCA baseline)" → "(personal profile)" | 1169:234 dashboard, 1170:5926 Library, Help Centre | `Library.jsx:17`. |
| "baseline" → "usual pattern"/"usual"; "Baseline Comparison" chips reworded | Daily log Draft/Submitted/Addendum, worker log 1169:3172, snapshot addendum, mobile profile, admin report | `DailySupportEvidenceLog.jsx:156–163`, `worker/DailyLogForm.jsx:55–59,283`, `MonthlySnapshotSummary.jsx:27`. **Worker log 1169:3172 chip set is now: Typical / More support needed / Less support needed / Different support needed** (was Better than / Same as / Variable / Below baseline). |
| "clinical" → "medical" (mechanical) | Snapshot Exports, Admin Participant Overview, Add New Report | Superseded by the R-08 Row-6 frames — see §5. |
| "compliance/Compliant" → "in line with" / "Australian Privacy Principles" / "governance standing" | Daily log Draft, Privacy & Sharing, Help Centre, Worker Resource Detail | `ParticipantDailyLog.jsx:236,256`, `PrivacySharing.jsx:393`, `ParticipantHelpCentre.jsx:130`, `worker/HelpCentre.jsx:139`, `LearningHubResource.jsx:139`. |
| "task" → "support"/"routines"; "Abandoned task" → "Stepped away" | Daily log Draft, Addendum, Snapshot Draft | `DailySupportEvidenceLog.jsx:121`. |
| "Governance Admin" → **"Platform Governance"**; "TMG180 Governance Admin" → "TMG180 Platform Admin"; "Governance Administrators" → "Platform Governance reviewers" | Admin Profile, Policies, Policy Version Detail, Ticket Detail, Role Selection | `AdminProfile.jsx:33`, `Policies.jsx:59`, `PolicyVersionDetail.jsx:61`, `TicketDetail.jsx:209`. |
| "Assigned admin" → "Reviewing admin"; "Unassigned" → "No reviewer yet"; "Assigned to X" → "Reviewer: X" | Incidents & Complaints, Ticket Detail | `IncidentsComplaints.jsx:79,176`, `TicketDetail.jsx:31–32,101`. |
| Sign In gains "New to TMG180? Sign up" | 1169:5327 | Ours says "Create an account" (`SignIn.jsx:128–133`). |
| "What participants appreciate" → **"What I bring to support"**, chips un-quoted | 1221:3413 | `RelationalWorkerProfile.jsx:21–23,164`. |
| "Select 1-3 FCA goals…" → "Select 1–3 participant goals or support purposes…" | 1169:3172 worker log | `worker/DailyLogForm.jsx:224`. |

## 3. The 22 v2 frames vs what is built

| Row | v2 frame (node) | Built today | Verdict | Size |
| --- | --- | --- | --- | --- |
| 1 | M-01 Create Account ×5 states (`3234:2/41/81/107/130`) | `pages/auth/SignUp.jsx` — real, backend-wired (`POST /auth/sign-up`), but: no page title/subtitle, **no Confirm password**, role cards say "Participant / Support worker" with long copy (design: "Participant — I use supports" / "Worker — I provide support"), button "Create Account" (design "Create my account"), no dedicated email-taken banner + inline + "Sign in to this account instead" (409 arrives as a generic banner), **no success screen** ("Your account is ready" / "Go to my workspace" — we jump straight to the dashboard), password error copy differs. Consent checkboxes already wired to `REGISTRATION_CONSENTS`. | Needs change | M |
| 1 | Sign In corrected (`3234:138`) | `SignIn.jsx` has the link but reads "Create an account"; auth back-links: 3× "Return to Sign In" ✓, but `CreateNewPassword.jsx:173`, `ResetPassword.jsx:147`, `LinkExpired.jsx:65` say "Back to Sign In". | Needs change | S |
| 2 | Choose Your Workspace, single dynamic (`3234:155`) | Two pages still exist (`RoleSelection.jsx`, `ChooseWorkspace.jsx`), both already filter to held roles and both **unreachable** — sign-in lands multi-role accounts straight on `roles[0]`'s dashboard. Copy is the old "Welcome to TMG180 / Enter Portal / Enter Workspace / Enter Admin". Design: one page, "Choose your workspace", explanatory subtitle, "Participant Workspace / Worker Workspace" cards with **Open** buttons, admin card "TMG180 Platform Admin". | Needs change | M |
| 3 | Participant Dashboard corrected (`3238:324`) | `ParticipantDashboard.jsx` has **5** cards incl. **Export Snapshot** (design: forbidden on dashboard), Monthly Snapshot has no CTA, no check-in banner, "Start Check-in" goes to `/participant/daily-log` (the evidence-log page). Design: greeting "Good morning, Jordan / Your space. Everything here belongs to you.", banner "How's today going? — A 30-second check-in, in your own words. [Start Check-in]", exactly 4 cards: Continue My Profile ("Pick up where you left off — N of 11 sections done." → Continue), Daily Log (→ Open Daily Log), Monthly Snapshot (→ View Snapshot), Browse Workers (→ Browse Directory). | Needs change | M |
| 3 | Profile hub corrected (`3238:2`) + Hub card Decision Making (`3236:348`) | Hub exists and is backend-powered, but the section set is the **old Figma-11** (`about-me, my-goals, daily-living, mobility-access, how-i-communicate, social-community, self-care, learning-employment, health-wellbeing, safety-support, decision-making` — hyphenated keys, "My support network" card label). Design/seed is the **Override-11 in fixed order with underscore slugs**: `overview · about_me · how_i_communicate · what_matters_to_me · my_goals · daily_living · mobility_access · health_wellbeing · social_community · decision_making · safety_support_preferences`; cards numbered 01–11 with Not started / In progress / Completed chips (we render nothing for not-started); title "My Personal Profile", subtitle "Your story, your way. Complete sections at your own pace — everything here belongs to you.", CTA "Continue My Profile". Buttons: design has only **Save Draft / Save & Continue**; our `ProfileSectionFooter` has Previous / Save Draft / Save & Exit / Save & Continue (+ "Save & Finish"). Side-card counter "NN/11" → design "Section N of 11". | Needs change | **L** (re-key seed in `packages/shared/src/profile.js`, drop Learning & employment + Self-care pages, fold Self-care → daily_living, remap `paths.js` / routes / `SECTION_PATHS` / hub cards, **data remap for existing `tmg_participant_profile_sections` rows and `last_section_key`** — no Prisma schema change needed) |
| 3 | M-11 Overview (`3236:238`), M-12 What Matters To Me (`3236:293`) | **Not built.** Overview: "Section 1 of 11", intro "A quick snapshot of you, in your words. There are no right or wrong answers — share only what you're comfortable sharing.", 3 textareas: "Who am I, in a sentence or two?", "What do people notice first about me?", "What does a good day look like for me?". What Matters To Me: "Section 4 of 11", intro "The people, values and non-negotiables that shape how you want support to work. You own this information — you decide who sees it.", 3 textareas: "People and relationships that matter to me", "What I value most in how I'm supported", "Things I never want to happen". Pattern from `ProfileAboutMe.jsx`. | Not built | M |
| 4 | M-04 Check-in ×4 states (`3236:2/146/195/72`) | **Not built** anywhere in web/shared/api. Prisma model `ParticipantCheckin` → `tmg_participant_checkin` already exists (`intensity_rating`, `impact_*`, `helped_*`, `recovery_*`, `own_words`, `is_locked`) but no `updated_at`, and no controller/route/hook/page. Design: "Today's check-in" — "Thirty seconds, in your own words. This is yours — workers only see it if you share it."; intensity 0–4 button row ("A settled day" … "A very big day"); "What showed up today?", "What helped?", "What did it cost you?", "In my own words"; button "Save my check-in"; states: Saving…, success ("Check-in saved / Nice one. Today is captured in your own words — it feeds your monthly snapshot, and you can edit it any time before midnight." → Back to Dashboard / Edit today's check-in), same-day edit (amber banner "You're editing today's check-in. Edits close at midnight — after that it becomes part of your record." → Save changes / Discard changes). API: `POST/GET?from=&to=/PATCH /api/participant/checkins` (ours would be `/api/v1/participant/checkins`), participant-role only, enforce in middleware. | Not built | **L** |
| 5 | Browse Directory corrected (`3238:388`) | `BrowseVerifiedWorkers.jsx`: title "Browse Verified Workers", has a **Search Keywords** filter (design: Location + Support area only), cards show **Next Available + 7-day availability bar** (R-04: no availability in list), no "Relational Worker · Richmond, VIC · 8 Years Exp." line, button "View Profile". No ratings ✓ (R-06 already satisfied). Design title "Browse Directory", subtitle "Verified worker profiles, led by how people support — not by scores. Listed alphabetically." Duplicate page `WorkerDirectory.jsx` (`/participant/directory`, favourites tab + availability text) should be retired or brought in line. | Needs change | M |
| 5 | Relational Worker Profile corrected (`3239:95`) | `RelationalWorkerProfile.jsx` structurally matches (header chips, About/Interests/Communication/Best Working Relationship/Availability grid/Credentials) but still says **"What participants appreciate"** with a Star icon and quoted chips; footer notice wording differs ("Mandatory Notice: … Contact happens directly with the independent worker…" vs design "TMG180 does not coordinate services. Participants contact workers directly using their preferred contact method."); extra "Experience & Skills" card not in design. Name is a single `<h1>` ✓. | Needs change | S |
| 6 | Worker onboarding pill R-07 (`3240:126`) | `LearningHub.jsx:206`, `WorkerProfile.jsx:172`, `WorkerOnboarding.jsx:184` all say "Complete onboarding to publish your profile (opt-in) and access tools." → design "Complete onboarding to publish your profile to the directory — optional." (Also settles our open question: immediate workspace access is correct; onboarding only gates directory publication.) | Needs change | S |
| 6 | R-08a/b/c copy (`3240:134/142/150`) | Snapshot Exports notice currently "You are about to download private health information…" (`SnapshotExports.jsx:139`) — contradicts the approved line; design: **"Exports contain only what you've chosen to share. TMG180 stores no medical or treatment records."** Add New Report `:237` "…or clinical details…" → **"Reports contain aggregates and identifiers only. TMG180 stores no medical or treatment records."** Admin Participant Overview → page is removed under R-05 (see below). | Needs change | S |

Other rulings in the guide that touch code:

| Ruling | Built today | Verdict |
| --- | --- | --- |
| R-05 remove Admin Participant Overview page + nav item | Still routed (`paths.js:87`, `adminRoutes.jsx:10,28`), in `GovernanceSidebar.jsx:25`, `navMaps.js:60–62`, and 4 hand-rolled admin sidebars (`Policies.jsx:28`, `AddNewReport.jsx:25`, `ConsentAuditLog.jsx:25`, `ParticipantOverview.jsx:25,160`). | Needs change — S |
| R-09 two-layer daily log + consent middleware | Worker `DailyLogForm.jsx` and participant `ParticipantDailyLog.jsx` are static mockups; no API. Prisma has both `tmg_participant_checkin` and the daily-note tables. | Not built — L (backend stream) |
| Terminology sweep, whole `apps/web/src` | Rendered hits remaining: participant — `Library.jsx:17` "(FCA baseline)", `DailySupportEvidenceLog.jsx:121,156,163` (task / Baseline Comparison / Better than baseline), `MonthlySnapshotSummary.jsx:27` (baseline), `ParticipantDailyLog.jsx:236,256` "APP Compliant", `ParticipantHelpCentre.jsx:130` "Privacy & Compliance Notice", `PrivacySharing.jsx:393` "in compliance with", `RelationalWorkerProfile.jsx:164`; worker — `DailyLogForm.jsx:55–59,105,224,283` (FCA goals, baseline chips), `HelpCentre.jsx:139`, `LearningHubResource.jsx:139`; admin — `ParticipantOverview.jsx:26,191,199,223,237,289`, `ReportDetail.jsx:87`, `AddNewReport.jsx:166,237`, `PlatformGovernanceDashboard.jsx:188` "Regulatory Compliance", `IncidentsComplaints.jsx:79,176`, `TicketDetail.jsx:31–32,101,209`, `AdminProfile.jsx:33`, `Policies.jsx:59`, `PolicyVersionDetail.jsx:61`. Zero "Assessment" hits. | ~25 lines — S/M |
| Password rules (M-01) | `PASSWORD_RULES` in `@tmg180/shared` already = 8 chars + number or symbol ✓; `ResetPassword.jsx` (the superseded D-02 frame) is still built and routed — retire in favour of `CreateNewPassword.jsx`. | Mostly matches |
| Delivered code (`WorkerProfile.jsx`, `tokens.css`, `worker-profile-preview.html`) | **Not in the repo.** Ask Deb/Saf to forward — the guide says they "already reflect all of the above". | Missing input |

## 4. Visual language — the one thing the guide doesn't say

The 22 v2 frames use a different idiom from the 83 main-page frames, and the guide says both stay canonical ("Existing compliant screens still build from here"):

| | Main page ("Vibrant") | v2 screens |
| --- | --- | --- |
| Canvas | 1280 × 1024–2452, ambient blurred blobs, 48px card radii, glass cards | 1280 × 960 flat `#f1f5f9` background, white cards, 1px `#e2e8f0` borders, ~12px radii |
| Primary | `#7800ce` | `#7c3aed` (violet-600), hover/dark `#6d28d9`, tint `#ede9fe` |
| Text | `#0b1c30`, `#434655`, `#4d4354` | `#1e293b` (slate-800), `#475669`, `#94a3b8` |
| Status | assorted | green `#dcfce7/#15803d`, amber `#fef3c7/#b45309`, red `#fee2e2/#b91c1c` |
| Type | 48px display, Inter/system | Inter, 5 named styles; body 13.5px, h1 30–32px w800 |
| Sidebar | varies per frame | one `Sidebar / Participant` component: Dashboard · My Personal Profile · Daily Log · Monthly Snapshot · Browse Directory / Help Centre · Privacy & Sharing / "Jordan P. — Sign Out" |

Our `apps/web/src/index.css` `@theme` has `brand-600 #6b21a8` / `brand-700 #5b1988` / `brand-100 #e8e1f0` (matches neither), no Inter, and many pages hard-code `#7800ce`, `#004ac6`, `#0b1c30`. **Ruling needed from Saf: are the v2 frames visual specs (then the app should move to the v2 tokens and the main-page "Vibrant" idiom is legacy) or structural specs to be skinned in the existing style?** The v2 sidebar component vs the main-page sidebars (Session Preferences, Library, etc.) is the same question.

## 5. Figma-internal issues to raise with Saf (found via the API, not visible in the guide)

1. **Mechanical find/replace slips in the sweep** (participant/admin-facing, all on the main page):
   - `1169:4370` Admin Participant Overview: "No medical records **is** shown", "PERSONAL PROFILE (**profile** BASELINE) IN PROGRESS/COMPLETED", "Personal Profile (**personal profile**) Status", "Personal Profile (**profile usual pattern**)". (Moot if R-05 removes the page — but the frame is still on the canonical page.)
   - `1170:6606` Daily log Submitted+Addendum: "**Usual pattern** Comparison", "Better than usual pattern".
   - `1205:1795` Personal Profile (Mobile): "Help us understand your **usual pattern energy** and…".
   - `1205:2` Report Detail: "establishing a verified **usual pattern** for Q2 governance standing".
   - `1169:3172` Worker Daily Support Evidence Log keeps the heading "Baseline comparison" (worker-facing, so allowed — confirm intended).
2. **R-08 "AFTER (ships)" copy was not applied to the main-page frames.** `1169:1940`, `1169:4370`, `1169:4853` got a literal clinical→medical swap instead ("without any medical records or external commentary", "or medical details in admin reports"). The Row-6 frames say the approved sentence ships → we build from Row-6, but the main page should be corrected.
3. **R-07 pill copy not applied to `1169:3676` / `1170:8069`** — both still read "Complete onboarding to publish your profile (opt-in) and access tools." Row-6 `3240:126` explicitly "Replaces the Learning Hub pill on 1169:3676 and 1170:8069" → build from Row-6.
4. **Banned term still live on the main page:** `1205:612` (second "Choose Your Workspace") contains "**TMG180 Governance Admin** — View platform-level governance metadata and settings. — Open Admin Console". Superseded by D-01 anyway, but it fails the acceptance grep the guide says passes with zero hits.
5. **"Back to Login" remains** on `1169:5500` Create New Password (the frame the guide says to build from) and `1169:5449` Reset Password (superseded D-02). Guide rule "Return to Sign In everywhere" wins.
6. **"Sarah Mitchell line-break fixed"** — the name TEXT node on `1221:3413` is byte-identical between versions (664×56, 48px, auto-height). Nothing changed in the frame; presumably fixed in the delivered `WorkerProfile.jsx`. Ours already renders it on one line.
7. `1169:5586` Role Selection still shows three static cards incl. "Enter Admin" (only the label was renamed to "TMG180 Platform Admin"); D-01's dynamic chooser `3234:155` supersedes it. Both old chooser frames should move to zz Archive.
8. `1207:187` Learning & employment and `1207:538` Self-care are still on the canonical page although R-01 drops/merges them; the hub frame `1207:5` still shows the old 11 cards while `3238:2` shows the Override 11.

## 6. Suggested work order (mirrors the guide's §2, sized from the audit)

1. **Profile re-seed (R-01)** — `packages/shared/src/profile.js` re-key + reorder, add Overview / What Matters To Me pages, retire Learning & employment + Self-care pages (fold Self-care questions into `daily_living`), remap routes/paths/`SECTION_PATHS`/hub cards, one-off DB remap of `section_key`/`last_section_key`; hub copy + numbering + "Not started" chip; footer buttons → Save Draft / Save & Continue. **L**
2. **Auth polish (M-01/W-01/D-01)** — Sign In link text, "Return to Sign In" ×3, SignUp title/subtitle/confirm-password/role-card copy/button/email-taken state/success screen, collapse the two choosers into one and route multi-role sign-ins through it, retire `ResetPassword.jsx`. **M**
3. **Check-in (M-04)** — page + 4 states, `services/checkins` + hooks, API controller/routes on the existing `tmg_participant_checkin` model (+ `updated_at`, midnight-lock rule, participant-only middleware); wire the dashboard banner. **L**
4. **Dashboard (R-02)** — 4-card config array, banner, remove Export card, greeting copy, "N of 11" from `useProfile()`. **M**
5. **Directory + profile (R-06/R-04/F-1..4)** — strip keyword filter + availability from list, retitle, card meta line; rename appreciate → "What I bring to support", un-quote chips, footer notice; retire/align `WorkerDirectory.jsx`. **M**
6. **Copy sweep + R-05/R-07/R-08** — the ~25 lines in §3, remove Admin Participant Overview + nav items, pill copy ×3, exports/report notices, "Governance Admin" ×4, "Assigned" ×5, sidebar "My Personal Profile" / "Browse Directory" / "Sign Out". **S/M**
7. **Tokens** — pending Saf's answer to §4; if v2 is the visual spec, swap `@theme` brand → violet scale, add Inter, sweep hard-coded hexes. **M**

---

## Appendix — full main-page text diff (29 Jul → 12 Aug), per frame

### Vibrant Participant Dashboard (1169:234)
- "Personal Profile (FCA Baseline)"  →  "My Personal Profile"
- "My Profile"  →  "My Personal Profile"

### Daily Support Evidence Log (Draft) (1169:825)
- "My Profile"  →  "My Personal Profile"
- "Briefly describe what tasks were completed..."  →  "Briefly describe what support was provided..."
- "Compared to your usual baseline, how did things go during this period?"  →  "Compared to your usual pattern, how did things go during this period?"
- "Below baseline"  →  "Below usual"
- "Privacy First (APP Compliant)"  →  "Privacy First (Australian Privacy Principles)" (×2)

### Daily Support Evidence Log (Submitted) (1169:1112)
- "My Profile"  →  "My Personal Profile"
- "Compared to your usual baseline, how did things go during this period?"  →  "Compared to your usual pattern, how did things go during this period?"
- "Below baseline"  →  "Below usual"

### Monthly Snapshot Summary (Draft) (1169:1349)
- "Attempted solo on 12th June. Abandoned task after 15 minutes due to noise levels in the shopping centre."  →  "Attempted solo on 12th June. Stepped away after 15 minutes due to noise levels in the shopping centre."
- "My Profile"  →  "My Personal Profile"

### Monthly Snapshot Summary (Generating) (1169:1671) · (Locked) (1169:1767)
- "My Profile"  →  "My Personal Profile"

### Snapshot Exports Dashboard (1169:1940)
- "My Profile"  →  "My Personal Profile"
- "…compile your logged progress without any clinical notes or external commentary…"  →  "…without any medical records or external commentary…" (see §5.2 — Row-6 R-08a copy supersedes)

### Help Centre Dashboard (1169:2152)
- "Manage your FCA baseline information and preferences."  →  "Manage your personal profile information and preferences."
- "Information regarding data control, sharing settings, and regulatory compliance."  →  "…and regulatory governance standing."
- "My Profile"  →  "My Personal Profile"

### Privacy & Sharing Dashboard (1169:2326)
- "Your data is handled in compliance with the Australian Privacy Act 1988 (APPs) + Notifiable Data Breaches scheme."  →  "Your data is handled in line with the Australian Privacy Act 1988 (APPs) + Notifiable Data Breaches scheme."
- "My Profile"  →  "My Personal Profile"

### Worker Daily Support Evidence Log (1169:3172)
- "Select 1-3 FCA goals relevant to today's support."  →  "Select 1–3 participant goals or support purposes relevant to today's support."
- "Baseline Comparison"  →  "Baseline comparison"
- "Better than baseline"  →  "Typical"
- "Same as baseline"  →  "More support needed"
- "Variable today"  →  "Less support needed"
- "Below baseline today"  →  "Different support needed"

### Admin Participant Overview (1169:4370)
- "Aggregated participant portal activity. No clinical data is shown."  →  "…No medical records is shown." (sic)
- "Privacy Assured: No participant clinical content or private record details are visible in the admin console."  →  "…No participant medical records or private record details…"
- "PERSONAL PROFILE (FCA BASELINE) IN PROGRESS"  →  "PERSONAL PROFILE (profile BASELINE) IN PROGRESS" (sic)
- "PERSONAL PROFILE (FCA BASELINE) COMPLETED"  →  "PERSONAL PROFILE (profile BASELINE) COMPLETED" (sic)
- "Personal Profile (FCA baseline) Status"  →  "Personal Profile (personal profile) Status" (sic)
- "Personal Profile (FCA baseline)"  →  "Personal Profile (profile usual pattern)" (sic)

### Add New Report (1169:4853)
- "Do not include participant-owned record content or clinical details in admin reports…"  →  "…or medical details in admin reports…" (Row-6 R-08c copy supersedes)

### Admin Profile Dashboard (1169:5056) · Admin - Policies Management (1170:9492)
- "Governance Admin"  →  "Platform Governance"

### Sign In (1169:5327)
- ADDED: "New to TMG180? Sign up"

### Role Selection (1169:5586)
- "TMG180 Governance Admin"  →  "TMG180 Platform Admin"

### Session Preferences (1170:5652) · Worker Profile Detail (1170:6090) · Worker Directory - Favourites (1170:6301) · Learning & employment (1207:187) · About Me (1207:376) · Self-care (1207:538) · How I Communicate (1207:694) · My Goals (1207:867) · Daily Living (1207:1017) · Mobility & Access (1207:1203) · Health & Wellbeing (1207:1400) · Social & Community (1207:1608) · Decision Making (1207:1803) · Safety & Support Preferences (1207:1992) · Browse Verified Workers (1219:2237)
- "My Profile"  →  "My Personal Profile"

### Participant Library (1170:5926)
- "(FCA baseline)"  →  "(personal profile)"
- "My Profile"  →  "My Personal Profile"

### Monthly Snapshot Addendum (1170:6451)
- "…necessary to maintain the baseline independence achieved in morning routines."  →  "…necessary to maintain the independence achieved in morning routines."
- "My Profile"  →  "My Personal Profile"

### Daily Support Evidence Log (Submitted + Addendum) (1170:6606)
- "Guided verbal prompts for task sequencing."  →  "Guided verbal prompts for step-by-step routines."
- "Baseline Comparison"  →  "Usual pattern Comparison" (sic)
- "Better than baseline"  →  "Better than usual pattern"
- "My Profile"  →  "My Personal Profile"

### Worker Resource Detail (1170:8551)
- "…ensuring compliance and clear communication with participants and coordinators."  →  "…supporting good governance standing."

### Admin - Incidents & Complaints (1170:9251)
- "Assigned admin"  →  "Reviewing admin"
- "Unassigned"  →  "No reviewer yet"

### Report Detail (1205:2)
- "…establishing a verified baseline for Q2 governance standing."  →  "…establishing a verified usual pattern for Q2 governance standing." (sic)

### Policy Version Detail (1205:276)
- "GOVERNANCE ADMIN"  →  "PLATFORM GOVERNANCE"

### Ticket Detail (1205:669)
- "These notes are only visible to Governance Administrators."  →  "…visible to Platform Governance reviewers."
- "Assigned"  →  "Reviewer"
- "Assigned to Sarah Jenkins"  →  "Reviewer: Sarah Jenkins"

### Personal Profile (Mobile) (1205:1795)
- "Help us understand your baseline energy and"  →  "Help us understand your usual pattern energy and" (sic)

### My Personal Profile (1207:5)
- "Your Personal Profile"  →  "My Personal Profile" (×2)
- "Continue Your Personal Profile"  →  "Continue My Profile"
- "My Profile"  →  "My Personal Profile"

### Relational Worker Profile - Sarah Mitchell (1221:3413)
- "What participants appreciate"  →  "What I bring to support"
- "\"Calm presence in stress\""  →  "Calm presence in stress"
- "\"Exceptional active listening\""  →  "Exceptional active listening"
- "\"Punctuality & reliability\""  →  "Punctuality & reliability"
- "My Profile"  →  "My Personal Profile"

Frames with **no** text change (41): 1169:2660, 1169:2956, 1169:3455, 1169:3676, 1169:3916, 1169:4181, 1169:4639, 1169:5360, 1169:5399, 1169:5449, 1169:5500, 1169:5567, 1170:5875, 1170:6813, 1170:7043, 1170:7390, 1170:7686, 1170:7877, 1170:8069, 1170:8393, 1170:8762, 1170:9001, 1170:9593, 1205:612, 1205:943, 1205:1061, 1205:1210, 1205:1320, 1205:1427, 1205:1457, 1205:1556, 1205:1600, 1205:1683, 1205:1755, 1205:1939, 1205:2033, 1205:2208, 1205:2352, 1205:2522, 1205:2646, 1205:2765.
