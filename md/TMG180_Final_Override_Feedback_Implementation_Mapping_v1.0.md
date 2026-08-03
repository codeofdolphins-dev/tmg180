**TMG180**

**Final Override — Feedback → Implementation Mapping v1.0**

Prepared 6 July 2026 · For review (Sue Lowdon) and implementation (development)

## 1. Purpose and How to Use This Document

This mapping links every point of the final architecture feedback to its concrete implementation in the Final Override bundle — the schema patch, seed bundle and UI copy overrides. It exists so that:

- The developer implements directly from the bundle without reinterpreting the model. If it is in the bundle, build it as written; if it is not, do not invent it.
- Sue can verify at a glance that every gap raised in the final feedback is covered, and sign off without re-reading the technical files.
- Any future question of “why is it built this way” traces back to a specific feedback point in one step.

**Canonical rule:** this override bundle joins the existing canonical document set. Build from these documents only — never from earlier design files or the superseded worker-matching screens.

## 2. Source Documents (Override Bundle v1.0)

- developer_spec_final_override_v1.md — Priorities 1–5 and acceptance criteria
- schema_patch_final_override_v1.sql — Postgres schema patch (additive, safe to run as a migration)
- seed_bundle_final_override_v1.json — profile sections, dashboard actions, worker prompts, directory card config, terminology overrides
- ui_copy_overrides_v1.csv — screen-level copy replacements and rules
- README.md — bundle purpose and scope
## 3. Priority 1 — Participant Personal Profile

Feedback: the Personal Profile is the participant's whole foundation — one living profile, not a single About Me form. Participant-facing language must be simple and ownership-based. Baseline/assessment terminology must never appear in participant UI; FCA_BASELINE remains an internal model term only.

| **Feedback point** | **Implemented in (override bundle)** | **How to verify (acceptance)** |
| --- | --- | --- |
| One living profile as the foundation, growing over time | Schema: participant_profiles — one row per participant (unique participant_id), status lifecycle, completed_sections / total_sections (11), last_section_key for “continue where I left off”. | Participant lands on a single profile that resumes mid-section; progress persists across sessions. |
| Profile made of plain-language sections, not one form | Schema: participant_profile_sections (per-section status, order, plain_language_description).<br>Seed: 11 sections — Overview, About Me, How I Communicate, What Matters To Me, My Goals, Daily Living, Mobility & Access, Health & Wellbeing, Social & Community, Decision Making, Safety & Support Preferences. | All 11 sections render in seed order with the seeded plain-language descriptions. |
| Participant-controlled answers and sharing | Schema: participant_profile_answers with visibility per answer: participant_private / share_with_consent / snapshot_only. | Each answer carries a visibility value; default is participant_private. |
| No baseline terminology for participants; internal term retained | Schema: participant_label defaults to “My Personal Profile”; internal_baseline_type retains FCA_BASELINE.<br>UI copy: FCA Baseline → My Personal Profile.<br>Seed terminology: FCA Baseline marked internal_only; Baseline Assessment marked must_change. | Search participant-facing screens for “FCA”, “Baseline”, “Assessment” — zero results. Internal/API code may still use FCA_BASELINE. |
| Ownership language | Spec-mandated strings: “My Personal Profile”, “Continue My Profile”, “Your profile belongs to you”, “Your profile grows over time”. | These exact strings appear in the profile UI; no clinical phrasing substituted. |

## 4. Priority 2 — Simplified Participant Dashboard

Feedback: reduce cognitive load. The participant dashboard shows only four primary actions; everything else sits one level deeper.

| **Feedback point** | **Implemented in (override bundle)** | **How to verify (acceptance)** |
| --- | --- | --- |
| Exactly four primary actions | Schema: dashboard_action_config (audience, action_key, priority, optional).<br>Seed: continue_profile (1), daily_log (2), monthly_snapshot (3), browse_workers (4, optional). | Dashboard renders max four primary actions in seeded priority order; Browse Workers can be toggled off (optional=true) without breaking layout. |
| Everything else one level deeper | UI copy: “All feature cards” → “Four primary actions only”. | No fifth card, tile, or shortcut on the dashboard's primary surface. |

## 5. Priority 3 — Relational Worker Profile

Feedback: worker profiles are relational first, résumé second. The worker introduces themselves as a person before listing credentials.

| **Feedback point** | **Implemented in (override bundle)** | **How to verify (acceptance)** |
| --- | --- | --- |
| Relational content is the primary profile | Schema: worker_relational_profiles — relational_intro, natural_support_style, communication_style, preferred_environments, interests, participants_appreciate, boundaries_and_fit, values_tags, support_philosophy. | Profile page leads with relational fields; a published profile is possible with relational content alone. |
| Plain-language, non-clinical prompts | Seed: worker_profile_prompts — seven prompts with helper text (“A little about me”, “How I naturally support people”, “How I usually communicate”, “Where I do my best support work”, “Things I enjoy”, “What people often appreciate about working with me”, “The kind of working relationship that suits me best”). | Prompt labels and helpers match the seed verbatim; “Professional Profile” heading replaced per UI copy row (→ Relational Worker Profile). |
| Résumé details separated as supporting content | Schema: worker_profile_supporting_details — support_areas, availability_summary, location_area, languages, credentials_summary, experience_summary in a separate table. | Credentials/experience render below or behind the relational content, never above it. |
| No service coordination implication | Schema: contact_notice default — “TMG180 does not coordinate services. Contact happens directly with the independent worker using their preferred method.” | Notice appears wherever worker contact details are shown. |

## 6. Priority 4 — Verified Worker Directory

Feedback: directory cards prioritise relational fields. Availability stays visible but must not make the directory feel like a roster or booking marketplace.

| **Feedback point** | **Implemented in (override bundle)** | **How to verify (acceptance)** |
| --- | --- | --- |
| Cards lead with relational fields | Seed directory_card_config primary_fields: display_name, relational_intro_excerpt, natural_support_style, communication_style, preferred_environments. | Card top half shows name + relational excerpt + style/communication/environments. |
| Availability/location/support areas demoted, not hidden | Seed: those three appear in secondary_fields and in suppressed_primary_fields — visible lower on the card or on expand, never as the lead. | Availability is findable but never the first thing scanned; no calendar/booking affordances anywhere. |
| No matching/marketplace language | UI copy + seed terminology: “Matching” → “Browse verified workers” (must_change, all directory contexts). | The words “match”, “matching”, “book” do not appear in directory UI. |
| TMG180 does not coordinate services | Seed notice on directory config: “TMG180 does not coordinate services. Participants contact independent workers directly using the worker's preferred method.” | Notice renders on the directory; contact flows go direct to the worker's stated method. |

## 7. Priority 5 — Governance Language

Feedback: governance screens are metadata and infrastructure only. TMG180 must never read as a provider, admin, or care manager.

| **Feedback point** | **Implemented in (override bundle)** | **How to verify (acceptance)** |
| --- | --- | --- |
| Approved terms only | Use: Platform Governance, Governance Console, Governance Environment.<br>UI copy: Governance Admin → Platform Governance. | Navigation and headers use only the approved trio. |
| Banned provider-style terms | Seed terminology_overrides: Governance Admin (avoid), Care Management → “Participant-owned support evidence” (must_change, all UI). | “Management”, “Care Management”, “Governance Admin” absent from all screens. |
| Terminology enforceable in-product | Schema: terminology_overrides table (banned_term, replacement_term, context, severity) — copy rules live as data, so future copy can be linted against it. | Table seeded with the five overrides; any new UI copy is checked against it before release. |

## 8. Acceptance Checklist (Sign-off)

- Participant sees “My Personal Profile” — never FCA Baseline, Baseline Assessment, or Baseline Information.
- Participant dashboard has no more than four primary actions, in seeded order, with Browse Workers optional.
- Worker profile prompts are the seven seeded relational prompts, plain language, relational-first layout.
- Directory cards lead with style / communication / environment; availability visible but secondary; no matching or booking language.
- TMG180 never appears to coordinate services — contact notices present on worker profiles and directory.
- Governance screens show metadata/infrastructure only, using Platform Governance terminology.
## 9. Implementation Order (Developer)

- 1. Run schema_patch_final_override_v1.sql as a migration. It is additive (create table if not exists) — no destructive changes to existing canonical tables.
- 2. Load seed_bundle_final_override_v1.json: profile sections, dashboard actions, worker prompts, directory card config, terminology overrides.
- 3. Apply ui_copy_overrides_v1.csv across the listed screens; sweep all participant-facing copy against the terminology_overrides table.
- 4. Verify against Section 8 and return screenshots per checklist item for sign-off.

*Nothing outside this bundle changes. Where existing screens conflict with this override, the override wins; where the override is silent, existing canonical documents stand.*
