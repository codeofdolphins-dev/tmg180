# TMG180 — Developer Build Guide

**For:** Deb (Debabrata Mondal) · cc Zain, Jiten  **From:** Saf  **Date:** 12 August 2026

> Converted 2026-08-17 from `TMG docs/TMG180-Developer-Build-Guide-Deb.docx` (two copies were received; the second is identical plus the handover email, reproduced at the end). Companion for developers: [frontend/TMG180_Figma_Reference.md](frontend/TMG180_Figma_Reference.md) (frame → page mapping, verbatim copy, build gaps).

**Status:** Build from this. The Figma file is now complete against the Final Override v1.1 — every missing screen exists, every corrected screen exists, the terminology sweep is done, and the whole flow is prototype-wired. No further design sign-off is needed except the two additive items in Section 8.

## 1. Where everything lives

**Figma file (canonical):** <https://www.figma.com/design/afqPpGbttWc85160MpjoTT/TMG> (file key `afqPpGbttWc85160MpjoTT`)

- **TMG180 v2 — 01 Design System** — tokens (colour/space/radius variables), type styles, and all master components. Pull exact values from the Variables panel / Dev Mode; the CSS custom properties in tokens.css map 1:1.
- **TMG180 v2 — 02+03 All Screens** — 22 dev-ready frames in six labelled rows, ordered as the user journey: Authentication → Workspace → Dashboard & Profile → Check-in → Directory & Worker Profile → Copy corrections.
- **TMG180 v2 — 04 Flow Map** — the routing reference. The prototype itself runs on the screens page: open the Sign In frame, press Present, and click through end to end.
- **Final Design Main Page** — the original 84 frames, now terminology-clean (see Section 6). Existing compliant screens still build from here.
- **zz Archive — deprecated drafts** — 59 superseded frames (old marketplace-era screens, FCA-labelled drafts). Never build from this page.

## 2. Build order

1. Seed `tmg_profile_sections` with the eleven sections (Section 4) and wire the profile CRUD — largest unblocked stream, schema settled.
2. Authentication + Create Account (M-01) — all five states are now designed; password rules below.
3. Participant check-in (M-04) — small, self-contained, kills the two dead-end CTAs.
4. Two-layer daily log split (R-09) with the consent middleware — no worker-authenticated route may ever write to participant check-ins; enforce in middleware.
5. Admin aggregates only; remove Participant Overview page + nav item (R-05) in the same pass.
6. Directory without ratings (R-06); availability nested under `supporting_details` in the detail response only (R-04).

## 3. Screen-by-screen: what to build from where

| Screen | Build notes | Where |
| --- | --- | --- |
| **Create Account (M-01)** | 5 states: empty, field errors, email-already-registered, submitting, success. Roles are backend-issued (signup role is a request, not a grant). Admin is provisioned — never on this screen. Consent checkboxes wire to `tmg_consent_records` with placeholder strings. | v2 Screens, Row 1 |
| **Sign In (corrected)** | Adds the Sign up link (W-01). Back-link label everywhere: "Return to Sign In". | v2 Screens, Row 1 |
| **Workspace chooser** | ONE dynamic component; renders only workspaces the account holds; single-role users skip it. Admin card label: "TMG180 Platform Admin". | v2 Screens, Row 2 |
| **Participant Dashboard** | Exactly 4 actions (R-02): `continue_profile`, `daily_log`, `monthly_snapshot`, `browse_workers` — as a frontend config array. Start Check-in banner routes to M-04. Export is NOT a dashboard action. | v2 Screens, Row 3 |
| **Profile hub + sections** | Exactly the 11 sections, in seed order. Overview and What Matters To Me are new (M-11/M-12). One button system: Save Draft / Save & Continue. | v2 Screens, Row 3 |
| **Check-in (M-04)** | 5 fields: intensity 0–4, what showed up, what helped, recovery cost, in my own words. Participant-authenticated only. Same-day edits via PATCH; edits close at midnight. | v2 Screens, Row 4 |
| **Browse Directory** | No rating column, review table, rating filter or sort — none exist anywhere (R-06). Ordering alphabetical/relational. List payload excludes availability entirely (R-04). Filters: location, support area. | v2 Screens, Row 5 |
| **Worker Profile** | Matches WorkerProfile.jsx already delivered. Strengths are worker-authored (never feedback data). Availability renders only from `supporting_details.availability` in the detail response. | v2 Screens, Row 5 |
| **Onboarding pill (R-07)** | `workspace_access` granted immediately on account creation; `directory_published` requires `onboarding_complete` AND `opt_in`. Copy: "Complete onboarding to publish your profile to the directory — optional." | v2 Screens, Row 6 |

## 4. Profile sections seed (R-01 — canonical)

```sql
CREATE TABLE tmg_profile_sections (id SERIAL PK, slug TEXT UNIQUE, display_label TEXT,
  sort_order INT, is_active BOOL DEFAULT TRUE, created_at, updated_at);
```

**Seed rows, in this exact order:** `overview` · `about_me` · `how_i_communicate` · `what_matters_to_me` · `my_goals` · `daily_living` · `mobility_access` · `health_wellbeing` · `social_community` · `decision_making` · `safety_support_preferences`.

Old hub-card mapping (no content lost): Self-care → `daily_living`; My support network → `decision_making`; Communication → `how_i_communicate`; Mobility & transport → `mobility_access`; Social participation → `social_community`; Safety → `safety_support_preferences`. Learning & employment is held as an additive candidate (Section 8).

**Per-participant entries:** `tmg_participant_profile_entries` with JSONB content validated at the API layer per section — a new field never touches the database.

## 5. Check-in + daily log contracts (M-04 / R-09)

```
POST  /api/participant/checkins            -- create today's check-in
GET   /api/participant/checkins?from=&to=  -- range read
PATCH /api/participant/checkins/:id        -- same-day edits only
```

**Two tables, two layers:** `tmg_support_evidence_logs` (worker layer, `draft|submitted|addendum`) and `tmg_participant_checkins` (participant self-report). Hard rule in middleware, not controllers: no worker-authenticated route writes to participant check-ins; worker reads require an active consent grant. Check-ins feed the monthly snapshot generator alongside worker evidence logs.

**Password rules (M-01):** match `PASSWORD_RULES` in `@tmg180/shared` — minimum 8 characters, must contain a number or symbol. The 8-character-only Reset Password frame is superseded (D-02); build from Create New Password.

## 6. Copy & acceptance rules (already applied in Figma)

The acceptance test greps participant-facing strings. The Figma file now passes with zero hits; keep the build matching:

- **Banned on participant screens:** FCA, Baseline, Assessment, Governance Admin, Compliance, Assigned, Task(s), clinical — including negations ("no clinical data" still fails). Approved replacement where the meaning is needed: "TMG180 stores no medical or treatment records."
- **Ownership strings, verbatim:** "My Personal Profile" and "Continue My Profile". Never "Your". Keep every participant-facing string in the shared strings module so the sweep greps one place.
- **Admin console naming:** Platform Governance / Governance Console / Governance Environment only. "Assigned admin" → "Reviewing admin" / "Reviewer".
- **Internal identifiers are exempt:** `FCA_BASELINE` stays as an internal enum for schema continuity — it must simply never render to a participant-facing string or API response field.

## 7. What changed in the live Figma frames (12 Aug sweep)

- 75+ text corrections across the original 84 frames: every sidebar now reads "My Personal Profile"; all Governance Admin / FCA / Baseline / Compliance / Assigned / task / clinical tokens replaced; "What participants appreciate" → "What I bring to support" with unquoted chips; Sarah Mitchell line-break fixed; Sign up link added to Sign In.
- Deprecated drafts (59 frames) quarantined on the zz Archive page — D-06 closed. If a frame you remember is missing from the main page, check the archive before assuming it was deleted.
- The delivered code (WorkerProfile.jsx, tokens.css, worker-profile-preview.html) already reflects all of the above — no rework needed on your side for those.

## 8. Genuinely still open (none of it blocks you)

1. Learning & Employment as a 12th section and My Support Network as standalone — Sue's call; each is one seed row + one frame, zero schema cost. Build the eleven.
2. The two registration consent strings — placeholders are wired in M-01 and the strings module; swapping copy later is a one-line change.
3. Backlog screens (M-05 incident report, M-06 invoices, M-08 notifications, M-09 consent journey, M-10 snapshot approval, M-07 external access, M-14 mobile scope) — specs land first; the data models already exist in the DDL.

*Questions → Saf. Every change in the file traces to a ruling ID (R-01…R-09, T-01…T-08, W-01, D-01…D-06, F-1…F-4, M-01…M-12) from the 4 Aug audit and 6 Aug Dev Unblock Spec, so reference those IDs in tickets.*

---

## Appendix — handover email (attached to the second copy of the doc)

> **Subject:** TMG180 — design handover, build from this
>
> Deb,
>
> The Figma file is done and checked — every gap from the 4 Aug audit is closed, terminology passes the acceptance grep, and the full flow is prototype-wired so you can click through it end to end: <https://www.figma.com/design/afqPpGbttWc85160MpjoTT/TMG>
>
> Attached is the build guide — three pages, screen-by-screen, with every decision traced to its ruling ID. Work from the v2 pages and the corrected main-page frames only; anything on the "zz Archive" page is dead.
>
> Three things to set expectations:
>
> 1. Build the eleven profile sections. Sue may add Learning & Employment and/or My Support Network later — each is one seed row, no schema change, so don't design for twelve.
> 2. Consent checkbox copy in Create Account is placeholder until Sue's strings land. It's wired to the strings module, so swapping it is a one-line change — don't hold anything for it.
> 3. M-09 (consent journey) and M-10 (snapshot approval) are the next design pieces. They're not drawn yet and they don't block you — the data models already exist in the DDL.
>
> Nothing else is waiting on design or rulings. Any questions, quote the ruling ID and come straight to me.
