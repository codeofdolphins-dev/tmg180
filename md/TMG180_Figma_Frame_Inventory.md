# TMG180 Figma Frame Inventory & Build Mapping

Generated 2026-08-03 from the live Figma file via REST API.

> **UPDATE (2026-08-03, later the same day): all 23 missing screens have been built.** New pages: RoleSelection, ParticipantDashboard, ParticipantDailyLog, SnapshotExports, PrivacySharing, WorkerDashboard, ApprovedSnapshots, LearningHub, WorkerGovernanceStanding, MyPersonalProfile + 11 Profile* section pages, BrowseVerifiedWorkers, RelationalWorkerProfile — all routed in `AppRoutes.jsx` and listed in the PageSwitcher. The app now has 69 pages covering every unique desktop frame on the canonical Figma page. Lint + build verified; banned-term sweep clean. Remaining (unbuilt by design): snapshot/log state variants (Generating/Locked/Addendum), the worker-vs-participant Help Centre split, and the 8 mobile layouts. The ❌ marks in the tables below reflect the original audit and are retained for traceability.

- **File:** `NvZmofeFew3VeREx6JBarF` ("T_M....") — last modified **2026-07-29**, i.e. *after* the Final Override (8 July 2026)
- **Link:** https://www.figma.com/design/NvZmofeFew3VeREx6JBarF/?node-id=1169-2 (deep-link any frame with `?node-id=<id with dash>`, e.g. `1169-234`)
- **Canonical page:** `Final Design Main Page` (id `1169:2`) — 83 frames. Draft pages `Some add pages`, `New`, `Page 2`, `Page 3` are **deprecated** per TITLE.md — never build from them.
- **PNG exports:** all 83 canonical frames exported at 1× to `C:\Users\Kalyan\Desktop\Office\TMG180\TMG docs\figma\` (filename = `Frame_Name__nodeId.png`)
- Access requires a Figma personal access token (held by Jiten; provided in-session — not stored in this repo).

Status legend: ✅ built (page exists mirroring the frame) · ⚠ built but flagged · ❌ not built · ◐ state-variant of a built page (variant states not implemented).

## Auth & shared (9 frames)

| Frame | Node | Built page | Status |
| --- | --- | --- | --- |
| Sign In | 1169:5327 | [SignIn.jsx](../src/pages/SignIn.jsx) `/sign-in` | ✅ |
| Check Your Email | 1169:5360 | [CheckYourEmail.jsx](../src/pages/CheckYourEmail.jsx) `/check-email` | ✅ |
| Forgot Password | 1169:5399 | [ForgotPassword.jsx](../src/pages/ForgotPassword.jsx) `/forgot-password` | ✅ |
| Reset Password | 1169:5449 | [ResetPassword.jsx](../src/pages/ResetPassword.jsx) `/reset-password` | ✅ |
| Create New Password | 1169:5500 | [CreateNewPassword.jsx](../src/pages/CreateNewPassword.jsx) `/create-new-password` | ✅ |
| Success State | 1169:5567 | [PasswordUpdated.jsx](../src/pages/PasswordUpdated.jsx) `/password-updated` | ✅ |
| Role Selection | 1169:5586 | — | ❌ |
| Choose Your Workspace | 1170:5875 | [ChooseWorkspace.jsx](../src/pages/ChooseWorkspace.jsx) `/choose-workspace` | ✅ |
| Choose Your Workspace (duplicate) | 1205:612 | duplicate frame — TITLE.md open question #3 (2-card vs 3-card variant) unresolved in the file | ⚠ |

## Participant portal (17 frames)

| Frame | Node | Built page | Status |
| --- | --- | --- | --- |
| Vibrant Participant Dashboard | 1169:234 | — | ❌ |
| Daily Support Evidence Log (Draft) | 1169:825 | — (frame is **Participant Portal**; built [DailySupportEvidenceLog.jsx](../src/pages/DailySupportEvidenceLog.jsx) `/daily-log` carries **Worker Portal** sidebar) | ⚠❌ |
| Daily Support Evidence Log (Submitted) | 1169:1112 | — (same mismatch) | ◐❌ |
| Daily Support Evidence Log (Submitted + Addendum) | 1170:6606 | — | ◐❌ |
| Monthly Snapshot Summary (Draft) | 1169:1349 | [MonthlySnapshotSummary.jsx](../src/pages/MonthlySnapshotSummary.jsx) `/snapshot/summary` | ✅ |
| Monthly Snapshot Summary (Generating) | 1169:1671 | state variant | ◐ |
| Monthly Snapshot Summary (Locked) | 1169:1767 | state variant | ◐ |
| Monthly Snapshot Addendum | 1170:6451 | state variant | ◐ |
| Snapshot Exports Dashboard | 1169:1940 | — (only the empty state exists: [EmptyExport.jsx](../src/pages/EmptyExport.jsx)) | ❌ |
| Help Centre Dashboard | 1169:2152 | [HelpCentre.jsx](../src/pages/HelpCentre.jsx) `/help` (single page; also see Worker Help Centre below) | ✅ |
| Privacy & Sharing Dashboard | 1169:2326 | — | ❌ |
| Session Preferences Dashboard | 1170:5652 | [SessionPreferences.jsx](../src/pages/SessionPreferences.jsx) `/preferences` | ✅ |
| Participant Library | 1170:5926 | [Library.jsx](../src/pages/Library.jsx) `/library` | ✅ |
| Worker Profile Detail | 1170:6090 | [WorkerDirectoryProfile.jsx](../src/pages/WorkerDirectoryProfile.jsx) `/directory/profile` | ✅ |
| Worker Directory - Favourites Tab | 1170:6301 | [WorkerDirectory.jsx](../src/pages/WorkerDirectory.jsx) `/directory` (tabs All Workers / Favourites) | ✅ |
| **Browse Verified Workers** (post-override) | 1219:2237 | — implements Final Override P4 directory | ❌ |
| **Relational Worker Profile - Sarah Mitchell** (post-override) | 1221:3413 | — implements Final Override P3 profile | ❌ |

## My Personal Profile (12 frames — none built)

Hub: **My Personal Profile** (1207:5). Sections in the file: About Me (1207:376), How I Communicate (1207:694), My Goals (1207:867), Daily Living (1207:1017), Mobility & Access (1207:1203), Health & Wellbeing (1207:1400), Social & Community (1207:1608), Decision Making (1207:1803), Safety & Support Preferences (1207:1992), **Learning & employment** (1207:187), **Self-care** (1207:538). All ❌ not built.

> ⚠ **Section-list conflict with the Final Override seed.** The override's 11 seeded sections are: Overview, About Me, How I Communicate, **What Matters To Me**, My Goals, Daily Living, Mobility & Access, Health & Wellbeing, Social & Community, Decision Making, Safety & Support Preferences. The Figma file (newer: 29 July) instead has **Learning & employment** and **Self-care**, and no Overview / What Matters To Me section frames. Needs a Sue/Deb ruling before building P1-02 — the override bundle is the contractual authority, but the design is more recent.

## Worker portal (14 frames)

| Frame | Node | Built page | Status |
| --- | --- | --- | --- |
| Worker Workspace Dashboard | 1169:2660 | — | ❌ |
| Participants I Support | 1169:2956 | [ParticipantsISupport.jsx](../src/pages/ParticipantsISupport.jsx) `/participants-i-support` | ✅ |
| Worker Daily Support Evidence Log | 1169:3172 | [DailySupportEvidenceLog.jsx](../src/pages/DailySupportEvidenceLog.jsx) `/daily-log` and/or [DailyLogForm.jsx](../src/pages/DailyLogForm.jsx) `/daily-log/new` — visual confirmation pending | ⚠ |
| Approved Monthly Snapshots | 1169:3455 | — | ❌ |
| Worker Portal - Learning Hub | 1169:3676 | — (only the resource detail exists) | ❌ |
| Worker Governance Standing | 1169:3916 | — (built [GovernanceStanding.jsx](../src/pages/GovernanceStanding.jsx) is the **Admin** variant) | ❌ |
| Worker Portal - Resources | 1170:6813 | [Resources.jsx](../src/pages/Resources.jsx) `/resources` | ✅ |
| Worker Portal - Settings | 1170:7043 | [WorkerSettings.jsx](../src/pages/WorkerSettings.jsx) `/worker-settings` | ✅ |
| Worker Calendar Dashboard | 1170:7390 | [Calendar.jsx](../src/pages/Calendar.jsx) `/calendar` | ✅ |
| Worker Help Centre Dashboard | 1170:7686 | shares [HelpCentre.jsx](../src/pages/HelpCentre.jsx)? — one built page for two frames | ⚠ |
| Governance Item Detail | 1170:7877 | [GovernanceItemDetail.jsx](../src/pages/GovernanceItemDetail.jsx) `/governance/item-detail` | ✅ |
| Worker Profile & Availability | 1170:8069 | [WorkerProfile.jsx](../src/pages/WorkerProfile.jsx) `/profile` — ⚠ TITLE.md marked Weekly Availability for deletion; override P3 demotes availability to supporting details. Frame still in file. | ⚠ |
| Worker Onboarding | 1170:8393 | [WorkerOnboarding.jsx](../src/pages/WorkerOnboarding.jsx) `/onboarding` | ✅ |
| Worker Resource Detail | 1170:8551 | [LearningHubResource.jsx](../src/pages/LearningHubResource.jsx) `/learning-hub/resource` | ✅ |

## Admin / Platform Governance (13 frames)

| Frame | Node | Built page | Status |
| --- | --- | --- | --- |
| TMG180 Platform Governance Dashboard | 1169:4181 | [PlatformGovernanceDashboard.jsx](../src/pages/PlatformGovernanceDashboard.jsx) `/governance/dashboard` | ✅ |
| Admin Participant Overview | 1169:4370 | [ParticipantOverview.jsx](../src/pages/ParticipantOverview.jsx) `/participant-overview` — ⚠ TITLE.md marked this frame for **deletion** (violates side-by-side principle); still in file and still built | ⚠ |
| Admin - Consent Audit Log | 1169:4639 | [ConsentAuditLog.jsx](../src/pages/ConsentAuditLog.jsx) `/consent-audit-log` | ✅ |
| Add New Report | 1169:4853 | [AddNewReport.jsx](../src/pages/AddNewReport.jsx) `/reports/new` | ✅ |
| Admin Profile Dashboard | 1169:5056 | [AdminProfile.jsx](../src/pages/AdminProfile.jsx) `/admin-profile` | ✅ |
| Admin - Workers Report Dashboard | 1170:8762 | [WorkersReport.jsx](../src/pages/WorkersReport.jsx) `/workers/report` | ✅ |
| Admin Governance Standing | 1170:9001 | [GovernanceStanding.jsx](../src/pages/GovernanceStanding.jsx) `/governance/standing` | ✅ |
| Admin - Incidents & Complaints | 1170:9251 | [IncidentsComplaints.jsx](../src/pages/IncidentsComplaints.jsx) `/incidents` | ✅ |
| Admin - Policies Management | 1170:9492 | [Policies.jsx](../src/pages/Policies.jsx) `/policies` | ✅ |
| Admin - Settings Dashboard | 1170:9593 | [SettingsPage.jsx](../src/pages/SettingsPage.jsx) `/settings` | ✅ |
| Report Detail | 1205:2 | [ReportDetail.jsx](../src/pages/ReportDetail.jsx) `/reports/detail` | ✅ |
| Policy Version Detail | 1205:276 | [PolicyVersionDetail.jsx](../src/pages/PolicyVersionDetail.jsx) `/policies/version-detail` | ✅ |
| Ticket Detail | 1205:669 | [TicketDetail.jsx](../src/pages/TicketDetail.jsx) `/tickets/detail` | ✅ |

## Empty / error / privacy states (10 frames — all built ✅)

No Daily Logs (1205:943 → EmptyDailyLogs), No Consent Access (1205:1061 → NoConsentAccess), No Export (1205:1210 → EmptyExport), No Favourites (1205:1320 → EmptyFavourites), Something Went Wrong (1205:1427 → SomethingWentWrong), No Monthly Snapshot (1205:1457 → EmptyMonthlySnapshot), Permission Denied Participant/Worker/Admin (1205:1556/1600/1683 → PermissionDenied\*), Link Expired / Revoked (1205:1755 → LinkExpired).

## Mobile (8 frames — responsive variants, no separate pages built)

Personal Profile (1205:1795), Participant Dashboard (1205:1939), Daily Support Evidence Log (1205:2033), Monthly Snapshot Summary (1205:2208), Worker Directory (1205:2352), Snapshot Exports (1205:2522), Worker Profile Detail (1205:2646), Privacy & Sharing (1205:2765) — all 390px wide. The built desktop pages are not responsive; treat as future work.

## Gap summary — canonical frames with no built screen (23 unique screens)

1. Role Selection · 2. Vibrant Participant Dashboard · 3. Participant Daily Support Evidence Log (Draft/Submitted/+Addendum — participant-side) · 4. Snapshot Exports Dashboard · 5. Privacy & Sharing Dashboard · 6. Worker Workspace Dashboard · 7. Approved Monthly Snapshots · 8. Worker Portal - Learning Hub · 9. Worker Governance Standing (worker variant) · 10. My Personal Profile hub + 11 sections (12 screens) · 11. Browse Verified Workers (override P4) · 12. Relational Worker Profile (override P3).

Plus non-screen gaps: snapshot state variants (Generating/Locked/Addendum), worker vs participant Help Centre split, 8 mobile layouts.

## Design-vs-docs conflicts to resolve before building

1. **Profile sections**: Figma's 11 sections ≠ override seed's 11 sections (see box above).
2. **Pending deletions never done**: `Admin Participant Overview` (1169:4370) and the availability block in `Worker Profile & Availability` (1170:8069) were flagged for deletion in TITLE.md but remain in the file (and as built pages).
3. **Duplicate Choose Your Workspace** frames (1170:5875 vs 1205:612) — open question #2 from TITLE.md still unresolved.
4. **Built `/daily-log` portal mismatch**: canonical Draft/Submitted frames are Participant Portal; the built page shows Worker Portal chrome.
