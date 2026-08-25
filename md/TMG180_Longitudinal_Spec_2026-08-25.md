# TMG180 Personal Profile + Longitudinal Evidence — Developer Implementation Specification

**FINAL CANONICAL OVERRIDE — 25 August 2026** (package version 2026-08-25.1)

Converted in full from `TMG180_Personal_Profile_Longitudinal_Developer_Implementation_Spec.docx`, received 2026-08-25 in `TMG Docs latest/TMG180_Canonical_Profile_Longitudinal_Developer_Package_2026-08-25/`. The package's machine-readable files are copied into this repo at [canonical-2026-08-25/](canonical-2026-08-25/) (`tmg180_personal_profile_canonical_seed.json`, `tmg180_daily_monthly_canonical_seed.json`, `tmg180_canonical_schema.sql`, `README.txt`).

Applies to: Personal Profile, Daily Case Note, Monthly Case Note, participant visibility/sharing, versioning, longitudinal evidence and AI-derived views.

## 1. Implementation status and authority

This specification is the implementation source of truth for the TMG180 Personal Profile and its relationship to Daily and Monthly Case Notes.

Where the current build, an earlier schema, an earlier seed bundle, developer interpretation, or backend-only implementation conflicts with this specification, **this specification overrides it**.

The canonical participant-facing wording is the wording contained in the 14 Personal Profile module source documents and the current Daily/Monthly Case Note source document. Developers must not paraphrase, shorten, merge, relabel or replace that copy unless a later signed canonical bundle explicitly supersedes it.

## 2. Non-negotiable product rule

The Personal Profile is BOTH a participant-facing living document AND the baseline data source for the longitudinal evidence system. It must never be implemented as backend-only intake data that the participant cannot subsequently view.

The participant must be able to:

- open and read the full Personal Profile in ordinary language
- save and return to incomplete modules
- view the answers they actually entered or selected
- update or add information over time
- see that the modules form one Personal Profile rather than unrelated assessments
- choose what Profile information is shared with linked workers
- review relevant Daily and Monthly evidence without the system rewriting the Profile
- generate or review reports that use the same underlying evidence without losing the original source wording

## 3. Canonical source files

The Personal Profile bundle contains 14 ordered source modules:

1. PP MODULE 1 introduction copy.docx
2. PP Module 2 About me copy.docx
3. PP MODULE 3 Who am i copy.docx
4. PP MODULE 4 My Body copy.docx
5. PP MODULE 5 Executive Functioning copy.docx
6. PP MODULE 6 Personal Care copy.docx
7. PP MODULE 7 Getting around copy.docx
8. PP MODULE 8 Food And Nutrition copy.docx
9. PP MODULE 9 My Living Space copy.docx
10. PP MODULE 10 Keeping my self healthy copy.docx
11. PP MODULE 11 Stress Emotions and Nervous System copy.docx
12. PP MODULE 12 My current and ongoing health needs copy.docx
13. PP MODULE 13 Technology Equipment and Communication copy.docx
14. PP MODULE 14 My purpose and dreams copy.docx

Daily/Monthly source: DAILY and MONTHLY CASE NOTES copy.docx (mirrored at [TMG180_Daily_Monthly_Case_Notes_2026-08-25.md](TMG180_Daily_Monthly_Case_Notes_2026-08-25.md)).

Machine-readable canonical copies are supplied with this specification as:

- `tmg180_personal_profile_canonical_seed.json`
- `tmg180_daily_monthly_canonical_seed.json`
- `tmg180_canonical_schema.sql`

Each seed file preserves the exact source copy in source order and includes source-file SHA-256 hashes. These hashes are for change detection, not participant display.

> Note (Claude, conversion): the 14 module source .docx files themselves were NOT in the delivery — only their content embedded in the profile seed JSON (2,383 blocks: `text` / `blank` / `checkbox_line`, per-module SHA-256). The seed's module titles carry the source docs' own internal numbering inconsistencies (e.g. the third module is titled "Module 2 — Who am I?", the fifth "Module 3 — Executive Functioning…"); §8.2 forbids correcting them — `module_id`/`display_order` are the canonical technical order.

## 4. Required user experience

### 4.1 Personal Profile navigation

- Show one product object named "My Personal Profile".
- Inside it, show the 14 modules in canonical order.
- Use "Continue My Personal Profile" / "Review My Personal Profile" behaviour rather than presenting modules as separate assessments.
- Allow save-and-return at any point.
- Do not require every optional question to be answered before progress can be saved.
- Long modules may be visually divided into sections, cards or collapsible groups, but the wording and logical order must remain intact.
- Do not remove prompts because they are "too long". Solve length through UX, not content deletion.

### 4.2 Participant-facing source view

For every response, the participant-facing view must show the original prompt/option wording and the participant's actual stored response. Derived terminology may be shown as a separate optional layer but may never replace the source response.

Example:

| Source layer | Derived layer |
| --- | --- |
| Participant: "I know what needs to be done but cannot get started." | Optional functional mapping: task initiation / executive functioning |

Participant free text remains exactly as entered. Optional NDIS-aligned wording is stored as a separate derived interpretation.

## 5. Core architecture

Required flow:

- Personal Profile = participant-owned baseline/context
- Daily Case Note = what actually happened during support
- Monthly Case Note = shared reflection and pattern summary across the month
- Longitudinal layer = links repeated source evidence over time
- Reports = views of existing evidence, not new facts
- AI = assists organisation/drafting/pattern retrieval; does not overwrite source content or decide funding/diagnosis

Canonical relationship: **PERSONAL PROFILE → DAILY EVIDENCE → MONTHLY PATTERNS → LONGITUDINAL EVIDENCE → REPORT/REASSESSMENT PREPARATION**

## 6. Data ownership and separation of concerns

### 6.1 Store definition separately from response

Never hard-code the form copy into UI components. Store canonical definitions/seed content separately from participant responses. UI renders the active definition version; responses retain snapshots of the wording visible when the answer was recorded.

### 6.2 Required data layers

| Layer | Purpose | Overwrite source? |
| --- | --- | --- |
| Definition/seed | Exact module prompts, explanatory copy, options, order, UI metadata | No |
| Participant source response | What the participant selected/wrote | Never |
| Worker source record | What the worker recorded/observed | Never |
| Monthly source summary | Participant/worker monthly reflection | Never |
| Derived functional language | Optional translation/mapping | No — separate record |
| Derived NDIS language | Optional report wording | No — separate record |
| AI longitudinal pattern | Human-reviewable synthesis of linked evidence | No — separate record |

## 7. Database schema

Use the supplied SQL file `tmg180_canonical_schema.sql` as the reference relational model. Equivalent ORM/entity models are acceptable **only if all invariants below are preserved**:

- Definition versions are immutable once active.
- Participant response history is not destructively overwritten.
- A changed answer creates a new current response and keeps the superseded response queryable.
- Prompt and selected-option labels are snapshotted with the response so later copy changes cannot rewrite historical meaning.
- Derived AI/functional/NDIS interpretations use separate tables/collections with provenance and review status.
- Daily and Monthly records may reference the current Profile but cannot update Profile responses.
- All view/share/update events relevant to sensitive participant records are auditable.

Reference tables in the SQL: `profile_definition`, `profile_module_definition`, `participant_profile`, `participant_profile_version`, `participant_profile_response` (with `prompt_snapshot`, `option_label_snapshot`, `superseded_by`), `profile_share_grant` (scope `full_profile` | `selected_modules`, expiry, revocation), `daily_note` + `daily_note_response` (provenance per block), `monthly_snapshot` + `monthly_snapshot_response`, `evidence_link`, `derived_interpretation` (review status), `audit_event`.

## 8. Seed bundle requirements

The developer must import the supplied canonical JSON bundles. **Do not recreate the fields manually from the Word documents.**

### 8.1 Stable IDs

Every module and content block has a stable key. Stable keys are technical identifiers only; they do not change participant-facing wording.

### 8.2 Copy fidelity

- Render the exact text from the seed bundle.
- Preserve checkbox option labels exactly.
- Preserve explanatory text and "why we ask" content; it is part of the participant experience, not developer comments.
- Do not convert participant-facing prompts into clinical labels.
- Do not merge two prompts because they appear similar.
- Do not silently correct module titles/numbering in source copy; internal module IDs are the canonical technical order.

## 9. Response storage

Response values must be stored independently from the display copy. Minimum supported response types:

- single checkbox/boolean
- multi-select checkbox group
- short text
- long free text
- single-choice option
- date/time where explicitly required
- repeatable groups (for goals/supports where "add another" is supported)
- participant choice such as prefer not to answer / not sure / not applicable

**Never convert "not sure", "prefer not to answer", "not applicable", or "haven't tried" into null.** These are meaningful participant responses and must remain distinguishable from unanswered.

## 10. Personal Profile versioning

The Profile is living and updatable. "Update" must not mean erasing the historical baseline.

- Participant edits create a new response version for changed fields.
- Unchanged fields continue to reference the prior active response.
- The participant sees the current Profile by default.
- Authorised history view can show prior versions/effective dates.
- Monthly Case Notes may flag "A Personal Profile module may need updating"; this must create a review prompt/task only. It must not automatically change the Profile.
- If a whole module definition changes in a later canonical release, keep both definition versions and migrate only where explicitly instructed.

## 11. Sharing and permissions

The participant owns the Personal Profile and controls worker access.

- Participant: full read/write access to own current Profile and read access to own history.
- Linked worker: no Profile access by default until participant grants it.
- Worker grant may be full Profile or **selected modules**.
- Worker access is read-only unless a distinct participant-authorised collaborative editing workflow is implemented.
- Worker must not be able to edit participant-authored source responses as if they were the participant.
- Revocation must take effect immediately for future access.
- Admin/platform operations should use least-privilege access; routine administration must not mean unrestricted browsing of participant content.
- Every share, revoke and sensitive record access must be auditable.

## 12. Daily Case Note implementation

Use the exact Daily Case Note copy from the canonical seed. The form is intentionally low cognitive load and checkbox-led.

- Worker can complete structured selections without being forced to write extra narrative when the structured fields accurately describe the day.
- Participant voice/collaboration state must be stored separately from worker observation.
- Daily note captures what support occurred, what helped, variation from usual, relevant context, what support made possible and follow-up.
- A Daily Note may reference Profile modules/domains for retrieval/reporting, but it must not mutate the Profile.
- Finalised notes are immutable except through an amendment/version process.

## 13. Monthly Case Note implementation

Use the exact Monthly Case Note copy from the canonical seed. Monthly is a shared reflection and longitudinal summary, not a worker rewrite of the Personal Profile.

- Monthly view may retrieve that month's Daily Notes to assist review.
- AI may draft a proposed summary/pattern view from source notes, but the result remains derived until reviewed.
- The participant's view and worker observation can both be retained where they differ.
- Maintenance is a valid outcome; do not force "improvement" scoring.
- Fluctuation, effort/recovery, support contribution and comparison with the Profile must remain visible concepts.
- "A Personal Profile module may need updating" creates a participant review prompt only.

## 14. AI boundaries

AI is an assistive layer. It must never become the source-of-truth layer.

Allowed: retrieve relevant Profile/Daily/Monthly evidence; draft summaries; surface repeated patterns; create optional everyday ↔ functional/NDIS wording views; identify missing/contradictory source evidence for human review; organise a participant-selected reporting period.

Not allowed: rewrite the Personal Profile source answers; invent participant voice; convert worker observation into diagnosis; infer physiological/psychological causation as fact without source evidence; decide eligibility/funding; calculate or claim a clinical assessment result; silently merge conflicting participant and worker accounts.

## 15. Provenance requirements

Every reportable evidence statement must be traceable back to source records. At minimum distinguish:

- participant report
- participant direct quote/free text
- worker observation
- worker support record
- professional/external evidence
- configured terminology mapping
- AI-derived longitudinal pattern
- human-edited/approved derived text

A report may combine these sources, but the system must be able to show where each statement came from.

## 16. Reporting

Reporting reads the same underlying evidence and changes presentation, not facts.

- Participant view: everyday language, source-first, readable and low cognitive load
- Worker view: support need / support provided / what changed or was maintained
- Monthly/longitudinal view: patterns, fluctuation, recovery cost, maintenance, support contribution
- NDIS evidence view: optional functional/NDIS-aligned wording with source provenance
- Governance/audit view: version, access, provenance, consent/sharing and change history

## 17. API / service behaviour

| Endpoint/operation | Required behaviour |
| --- | --- |
| GET /participants/{id}/profile | Return current participant-facing Profile definition + current responses. |
| PATCH /participants/{id}/profile/responses/{blockId} | Create a new response version; never destructively replace historical response. |
| GET /participants/{id}/profile/history | Return profile versions/history subject to permissions. |
| POST /participants/{id}/profile/share-grants | Participant creates worker/module access grant. |
| DELETE /participants/{id}/profile/share-grants/{grantId} | Revoke future access. |
| GET /participants/{id}/daily-notes | Return authorised notes for date range. |
| POST /participants/{id}/daily-notes | Create Daily Note draft. |
| POST /daily-notes/{id}/finalise | Lock source note; later changes use amendment workflow. |
| GET /participants/{id}/monthly-snapshots | Return monthly summaries. |
| POST /participants/{id}/monthly-snapshots | Create monthly draft, optionally prefilled by human-reviewable AI suggestions. |
| POST /participants/{id}/reports | Generate a derived report for a selected period/view; source records remain unchanged. |

## 18. Migration from current backend-only implementation

If the current build already stores Profile answers only in backend structures, do NOT delete that data. Perform a migration:

1. Inventory existing Profile data, field IDs, current UI and seed versions.
2. Map each existing field to the canonical module/block ID where a defensible exact match exists.
3. Preserve original stored values and original timestamps.
4. For fields that do not map exactly, retain them as legacy/unmapped records; do not guess.
5. Import canonical definition/seed bundles.
6. Build participant-facing "My Personal Profile" renderer.
7. Attach existing mapped responses to the participant-facing view.
8. Create current Profile versions without rewriting historical content.
9. Implement sharing grants and worker read views.
10. Implement Daily/Monthly links and reporting only after Profile source visibility is verified.
11. Run acceptance tests below before enabling AI enrichment.

## 19. Acceptance tests — release blocker

| Test | Pass condition |
| --- | --- |
| PP-01 Source fidelity | A seeded module renders exact canonical wording and options in canonical order. |
| PP-02 Participant visibility | After saving, participant can reopen My Personal Profile and see exactly what they entered/selected. |
| PP-03 Save and return | Participant can leave part-way through a long module and resume without data loss. |
| PP-04 No backend-only profile | No Profile response exists that is inaccessible to the participant solely because it has been stored in backend fields. |
| PP-05 Update history | Changing an answer updates current view but prior answer remains retrievable in version history. |
| PP-06 Derived separation | AI/NDIS wording appears as a separate derived layer and does not alter the participant source response. |
| PP-07 Sharing default | New linked worker cannot see Profile until participant grants access. |
| PP-08 Scoped sharing | Participant can grant selected modules and worker cannot retrieve ungranted modules. |
| PP-09 Revocation | Revoked worker can no longer retrieve Profile content. |
| DN-01 Daily fidelity | Daily form renders exact canonical copy and permits checkbox-led completion without compulsory narrative where not required. |
| DN-02 Source separation | Participant voice and worker observation remain distinguishable. |
| MN-01 Monthly profile boundary | Monthly "Profile may need updating" creates a review prompt; it does not edit Profile. |
| MN-02 Maintenance | Monthly record can represent maintained capacity/support without requiring an "improved" outcome. |
| AI-01 No overwrite | AI operation cannot update participant_profile_response source values. |
| AI-02 Provenance | Every derived statement can be traced to source record IDs and model/rule version. |
| AUD-01 Auditability | Profile access/share/update/finalisation events are recorded. |
| MIG-01 Legacy preservation | Unmapped legacy backend fields are retained and flagged, not guessed or deleted. |

## 20. Definition of done

- Participant can use the Personal Profile as a real living document, not merely complete intake fields.
- All 14 modules are present in canonical order and source wording is intact.
- Participant can save, return, view, update and control sharing.
- Daily and Monthly Case Notes use the canonical current forms.
- Profile, Daily and Monthly records are linked for longitudinal retrieval without one rewriting another.
- Original participant and worker source evidence is preserved with version/provenance.
- AI-generated views are separate, reviewable and non-authoritative.
- Developer has run and passed every release-blocker acceptance test.
- Current implementation differences/legacy data have been migrated without destructive deletion.

## 21. Developer handover rule

DO NOT reinterpret the Personal Profile as backend intake data. Implement the participant-facing source record first. The backend schema, longitudinal mappings, reports and AI layer exist to support that record — not to replace it.

**Canonical product principle: The system holds the memory while the participant retains the voice.**
