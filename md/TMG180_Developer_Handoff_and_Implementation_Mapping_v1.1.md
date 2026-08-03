**TMG180**

**Final Override — Developer Handoff & Implementation Mapping**

Version 1.1  ·  Consolidated build-from document  ·  Prepared 8 July 2026

|  |  |
| --- | --- |
| **Build from** | This document + the Final Override bundle only. It supersedes earlier design files and the withdrawn worker-matching screens. |
| **For implementation** | Development team (Zain / Deb) |
| **For review & sign-off** | Sue Lowdon |
| **Owner** | Saf — Sol Business Consultant / We Care Disability Service |
| **Status** | Final — approved for build |

**The one rule for this build**

Build exactly what is written in this document and the bundle. If it is in the bundle, build it as written. If it is not in the bundle, do not invent it. Where an existing screen conflicts with this override, the override wins. Where the override is silent, the existing canonical documents stand. No reinterpretation of the model.

This is a refinement release, not a rebuild. The data model, sections and navigation already exist. The work is information architecture, naming and layout — re-homing what is already built so the platform reads as TMG180.

**1**   **Purpose and how to use this document**

This mapping links every point of the final architecture feedback to its concrete implementation in the Final Override bundle — the schema patch, seed bundle and UI copy overrides — so that:

**Development** implements directly from the bundle without reinterpreting the model.

**Sue** can confirm at a glance that every gap raised in the feedback is covered, and sign off without re-reading the technical files.

**Any future “why is it built this way” question** traces back to a specific feedback point in one step.

**2**   **The bundle — what to build from**

These files are the single source of truth. Build from these only — never from earlier design files or the superseded worker-matching screens.

| **File** | **What it contains** | **How the developer uses it** |
| --- | --- | --- |
| developer_spec_final_override_v1.md | Priorities 1–5 and acceptance criteria | Read first — the intent behind every change |
| schema_patch_final_override_v1.sql | Postgres schema patch (additive) | Run as a migration (create table if not exists) |
| seed_bundle_final_override_v1.json | Profile sections, dashboard actions, worker prompts, directory card config, terminology overrides | Load into the database as seed data |
| ui_copy_overrides_v1.csv | Screen-level copy replacements and rules | Apply across the listed screens; use for the terminology sweep |
| README.md | Bundle purpose and scope | Orientation |

**3**   **Non-negotiable principles (do not drift)**

These are constitutional. When a UI decision is not explicitly covered, follow these before inventing anything:

| **Always** | **Never** |
| --- | --- |
| Participant, Independent Worker | Provider, Client, Caseload, Tasks |
| Browse / Filter verified workers | Matching, booking, roster, marketplace |
| Participant choice & ownership | Care Management, Management, Admin |
| Platform Governance (metadata / infrastructure) | TMG180 coordinating or directing support |
| Relational practice — the person first | Résumé-style professional profiles |
| My Personal Profile (participant-facing) | FCA Baseline / Baseline Assessment in the UI |

**Do not revive the withdrawn worker-matching screens.** They are superseded. Reusable UI components may be reskinned into the relational card layout, but the matching concept does not return.

**4**   **Feedback → implementation → acceptance**

Each priority below states the feedback, the exact bundle artefact that satisfies it, and the acceptance test the developer returns evidence against.

**Priority 1 — Participant Personal Profile**

**Feedback:**  *The Personal Profile is the participant’s whole foundation — one living profile, not a single About Me form. Participant-facing language must be simple and ownership-based. Baseline / assessment terminology must never appear in participant UI; FCA_BASELINE remains an internal model term only.*

| **Feedback point** | **Implemented in (bundle)** | **How to verify (acceptance)** |
| --- | --- | --- |
| One living profile as the foundation, growing over time | Schema: participant_profiles — one row per participant (unique participant_id), status lifecycle, completed_sections / total_sections (11), last_section_key for “continue where I left off”. | Participant lands on a single profile that resumes mid-section; progress persists across sessions. |
| Profile made of plain-language sections, not one form | Schema: participant_profile_sections (per-section status, order, description). Seed: 11 sections — Overview, About Me, How I Communicate, What Matters To Me, My Goals, Daily Living, Mobility & Access, Health & Wellbeing, Social & Community, Decision Making, Safety & Support Preferences. | All 11 sections render in seed order with the seeded plain-language descriptions. |
| Participant-controlled answers and sharing | Schema: participant_profile_answers with visibility per answer: participant_private / share_with_consent / snapshot_only. | Each answer carries a visibility value; default is participant_private. |
| No baseline terminology for participants; internal term retained | Schema: participant_label defaults to “My Personal Profile”; internal_baseline_type retains FCA_BASELINE. UI copy: FCA Baseline → My Personal Profile. Seed: FCA Baseline internal_only; Baseline Assessment must_change. | Search participant screens for “FCA”, “Baseline”, “Assessment” — zero results. Internal/API code may still use FCA_BASELINE. |
| Ownership language | Spec-mandated strings: “My Personal Profile”, “Continue My Profile”, “Your profile belongs to you”, “Your profile grows over time”. | These exact strings appear in the profile UI; no clinical phrasing substituted. |

**Priority 2 — Simplified Participant Dashboard**

**Feedback:**  *Reduce cognitive load. The participant dashboard shows only four primary actions; everything else sits one level deeper. It should feel like entering a personal space, not managing software.*

| **Feedback point** | **Implemented in (bundle)** | **How to verify (acceptance)** |
| --- | --- | --- |
| Exactly four primary actions | Schema: dashboard_action_config (audience, action_key, priority, optional). Seed: continue_profile (1), daily_log (2), monthly_snapshot (3), browse_workers (4, optional). | Dashboard renders max four primary actions in seeded priority order; Browse Workers can be toggled off (optional=true) without breaking layout. |
| Everything else one level deeper | UI copy: “All feature cards” → “Four primary actions only”. | No fifth card, tile, or shortcut on the dashboard’s primary surface. |

**Priority 3 — Relational Worker Profile**

**Feedback:**  *Worker profiles are relational first, résumé second. The worker introduces themselves as a person before listing credentials. This is the defining feature of TMG180.*

| **Feedback point** | **Implemented in (bundle)** | **How to verify (acceptance)** |
| --- | --- | --- |
| Relational content is the primary profile | Schema: worker_relational_profiles — relational_intro, natural_support_style, communication_style, preferred_environments, interests, participants_appreciate, boundaries_and_fit, values_tags, support_philosophy. | Profile page leads with relational fields; a published profile is possible with relational content alone. |
| Plain-language, non-clinical prompts | Seed: worker_profile_prompts — seven prompts with helper text (A little about me; How I naturally support people; How I usually communicate; Where I do my best support work; Things I enjoy; What people often appreciate about working with me; The kind of working relationship that suits me best). | Prompt labels and helpers match the seed verbatim; “Professional Profile” heading replaced → Relational Worker Profile. |
| Résumé details separated as supporting content | Schema: worker_profile_supporting_details — support_areas, availability_summary, location_area, languages, credentials_summary, experience_summary in a separate table. | Credentials / experience render below or behind the relational content, never above it. |
| No service-coordination implication | Schema: contact_notice default — “TMG180 does not coordinate services. Contact happens directly with the independent worker using their preferred method.” | Notice appears wherever worker contact details are shown. |

**Priority 4 — Verified Worker Directory**

**Feedback:**  *Directory cards prioritise relational fields. Availability stays visible but must not make the directory feel like a roster or booking marketplace. Participants are choosing a relationship, not booking an appointment.*

| **Feedback point** | **Implemented in (bundle)** | **How to verify (acceptance)** |
| --- | --- | --- |
| Cards lead with relational fields | Seed directory_card_config primary_fields: display_name, relational_intro_excerpt, natural_support_style, communication_style, preferred_environments. | Card top half shows name + relational excerpt + style / communication / environments. |
| Availability / location / support areas demoted, not hidden | Seed: those three appear in secondary_fields and in suppressed_primary_fields — visible lower on the card or on expand, never as the lead. | Availability is findable but never the first thing scanned; no calendar / booking affordances anywhere. |
| No matching / marketplace language | UI copy + seed terminology: “Matching” → “Browse verified workers” (must_change, all directory contexts). | The words “match”, “matching”, “book” do not appear in directory UI. |
| TMG180 does not coordinate services | Seed notice on directory config: “TMG180 does not coordinate services. Participants contact independent workers directly using the worker’s preferred method.” | Notice renders on the directory; contact flows go direct to the worker’s stated method. |

**Priority 5 — Governance Language**

**Feedback:**  *Governance screens are metadata and infrastructure only. TMG180 must never read as a provider, admin, or care manager.*

| **Feedback point** | **Implemented in (bundle)** | **How to verify (acceptance)** |
| --- | --- | --- |
| Approved terms only | Use: Platform Governance, Governance Console, Governance Environment. UI copy: Governance Admin → Platform Governance. | Navigation and headers use only the approved trio. |
| Banned provider-style terms | Seed terminology_overrides: Governance Admin (avoid); Care Management → “Participant-owned support evidence” (must_change, all UI). | “Management”, “Care Management”, “Governance Admin” absent from all screens. |
| Terminology enforceable in-product | Schema: terminology_overrides table (banned_term, replacement_term, context, severity) — copy rules live as data, so future copy can be linted against it. | Table seeded with the five overrides; any new UI copy is checked against it before release. |

**5**   **Workflow map — before and after the override**

How each existing journey changes, what implements the change, and the impact on work already done. “No change” rows are included so nothing is accidentally rebuilt.

| **ID** | **Journey** | **Before (canonical)** | **What the override changes** | **After** | **Impact on past work** |
| --- | --- | --- | --- | --- | --- |
| WF-01 | Participant | Participant completes FCA Baseline intake as the entry assessment. | Reframed as the participant’s whole foundation: one living ‘My Personal Profile’ in 11 plain-language sections; baseline/assessment terms removed from UI; FCA_BASELINE retained internally. | Participant builds My Personal Profile over time; profile resumes from last section; ownership language throughout. | FCA intake content maps into the 11 sections — no data-model rebuild; questions re-homed, not discarded. |
| WF-02 | Participant | Daily casenotes per canonical daily casenote spec. | No structural change — repositioned as dashboard action 2, ‘Today’s Daily Log’, with reflective language. | Participant opens Today’s Daily Log from a 4-action dashboard. | None — daily casenote schema and linking stay as canonical. |
| WF-03 | Participant | Monthly casenote / snapshot per canonical snapshot spec. | No structural change — surfaced as dashboard action 3, ‘Monthly Snapshot’. | Participant reviews recent patterns and adds context via Monthly Snapshot. | None — snapshot logic untouched; override silent, canonical stands. |
| WF-04 | Participant | Evidence linking between profile, logs and snapshots. | No change — linking still references the profile (now My Personal Profile) as the anchor record. | Same linking behaviour; anchor renamed in UI only. | None — links keyed to internal identifiers, not UI labels. |
| WF-05 | Participant | Dashboard grew feature cards as modules were added. | Hard cap: four primary actions; everything else one level deeper. | Low-cognitive-load dashboard; secondary features nested. | Existing feature screens keep their routes — they move a level down, they are not deleted. |
| WF-06 | Worker | Designer incorrectly built worker-matching screens (superseded); corrected direction was relational profiles. | Worker profile rebuilt relational-first: 7 relational prompts primary; support areas, availability, location, languages, credentials split into supporting details. | Worker introduces self as a person; credentials sit behind / below relational content. | Matching screens remain superseded — do NOT revive; reusable UI may be reskinned to relational cards. |
| WF-07 | Worker / Participant | Directory concept existed but risked reading as a booking marketplace. | Cards lead with relational fields; availability/location/support areas demoted; ‘Matching’ banned → ‘Browse verified workers’; non-coordination notice added. | Participant browses verified workers and contacts them directly by the worker’s preferred method. | Hardens the ownership narrative — platform is evidence + browse, never rostering or booking. |
| WF-08 | Governance | Governance screens carried admin / management-style labels. | Terminology locked: Platform Governance / Console / Environment; ‘Governance Admin’, ‘Management’, ‘Care Management’ banned; overrides stored as data. | Governance surfaces show metadata / infrastructure only. | Governance standards doc remains authoritative; override adds enforceable terminology on top. |

**6**   **Build register — item by item**

The atomic checklist the developer works through and the reviewer signs off. Owner and status columns are ready for tracking (owners per the current register: Deb build, Sue sign-off).

**Priority 1 — Personal Profile**

| **ID** | **Feedback point** | **Component** | **Implementation detail** | **Acceptance check** | **Owner** | **Status** |
| --- | --- | --- | --- | --- | --- | --- |
| P1-01 | One living profile as participant foundation | Schema | participant_profiles: unique per participant, status lifecycle, completed/total sections (11), last_section_key resume | Single profile resumes mid-section across sessions | Deb | Not started |
| P1-02 | Plain-language sections, not one form | Schema + Seed | participant_profile_sections + 11 seeded sections (Overview … Safety & Support Preferences) | All 11 sections render in seed order with seeded descriptions | Deb | Not started |
| P1-03 | Participant-controlled sharing | Schema | participant_profile_answers.visibility: private / share_with_consent / snapshot_only (default private) | Every answer carries visibility; default private | Deb | Not started |
| P1-04 | No baseline terminology in participant UI | UI copy + Seed | FCA Baseline → My Personal Profile; Baseline Assessment must_change; FCA_BASELINE internal_only | Zero hits for FCA/Baseline/Assessment in participant screens | Deb | Not started |
| P1-05 | Ownership language | UI copy | Exact strings: My Personal Profile / Continue My Profile / Your profile belongs to you / Your profile grows over time | Strings appear verbatim in profile UI | Deb | Not started |

**Priority 2 — Dashboard**

| **ID** | **Feedback point** | **Component** | **Implementation detail** | **Acceptance check** | **Owner** | **Status** |
| --- | --- | --- | --- | --- | --- | --- |
| P2-01 | Exactly four primary actions | Schema + Seed | dashboard_action_config; seeds continue_profile(1), daily_log(2), monthly_snapshot(3), browse_workers(4, optional) | Max 4 primary actions in seeded order; Browse Workers toggleable | Deb | Not started |
| P2-02 | Everything else one level deeper | UI copy | ‘All feature cards’ → ‘Four primary actions only’; secondary features nested | No 5th card/tile/shortcut on primary surface | Deb | Not started |

**Priority 3 — Worker Profile**

| **ID** | **Feedback point** | **Component** | **Implementation detail** | **Acceptance check** | **Owner** | **Status** |
| --- | --- | --- | --- | --- | --- | --- |
| P3-01 | Relational content primary | Schema | worker_relational_profiles: intro, support style, communication, environments, interests, appreciation, boundaries/fit | Profile leads with relational fields; publishable on relational content alone | Deb | Not started |
| P3-02 | Plain-language relational prompts | Seed | 7 worker_profile_prompts with helper text, verbatim from seed | Prompt labels/helpers match seed exactly | Deb | Not started |
| P3-03 | Résumé details as supporting content | Schema | worker_profile_supporting_details: support areas, availability, location, languages, credentials, experience | Credentials render below/behind relational content | Deb | Not started |
| P3-04 | No coordination implication | Schema | contact_notice default: TMG180 does not coordinate services; contact direct with worker | Notice shows wherever contact details show | Deb | Not started |

**Priority 4 — Directory**

| **ID** | **Feedback point** | **Component** | **Implementation detail** | **Acceptance check** | **Owner** | **Status** |
| --- | --- | --- | --- | --- | --- | --- |
| P4-01 | Cards lead relational | Seed | directory_card_config primary: name, intro excerpt, support style, communication, environments | Card top half relational only | Deb | Not started |
| P4-02 | Availability visible but secondary | Seed | availability/location/support areas in secondary_fields AND suppressed_primary_fields | Findable but never lead; no booking affordances | Deb | Not started |
| P4-03 | No matching / marketplace language | UI copy + Seed | ‘Matching’ → ‘Browse verified workers’ (must_change, all directory contexts) | match/matching/book absent from directory UI | Deb | Not started |
| P4-04 | Non-coordination notice | Seed | Directory notice: participants contact independent workers directly | Notice renders on directory | Deb | Not started |

**Priority 5 — Governance**

| **ID** | **Feedback point** | **Component** | **Implementation detail** | **Acceptance check** | **Owner** | **Status** |
| --- | --- | --- | --- | --- | --- | --- |
| P5-01 | Approved terminology only | UI copy | Platform Governance / Console / Environment; Governance Admin replaced | Nav/headers use approved trio only | Deb | Not started |
| P5-02 | Banned provider-style terms | Seed | Care Management → participant-owned support evidence (must_change, all UI); Governance Admin (avoid) | Banned terms absent across all screens | Deb | Not started |
| P5-03 | Terminology enforceable as data | Schema + Seed | terminology_overrides table seeded with 5 overrides; new copy linted against it | Table seeded; copy check part of release process | Deb | Not started |

**Delivery gates**

| **ID** | **Feedback point** | **Component** | **Implementation detail** | **Acceptance check** | **Owner** | **Status** |
| --- | --- | --- | --- | --- | --- | --- |
| GT-01 | Migration run | Process | schema_patch_final_override_v1.sql applied as additive migration | Migration succeeds; no destructive change to canonical tables | Deb | Not started |
| GT-02 | Seed loaded | Process | seed_bundle_final_override_v1.json loaded in full | All five seed groups present in DB | Deb | Not started |
| GT-03 | Copy sweep | Process | ui_copy_overrides_v1.csv applied; full sweep against terminology_overrides | Sweep report clean | Deb | Not started |
| GT-04 | Sign-off pack | Process | Screenshots per acceptance item returned for review | Sue sign-off recorded | Sue | Not started |

**7**   **Implementation order**

Work in this order. Nothing outside the bundle changes.

**1.**  **Run the migration.**  Apply schema_patch_final_override_v1.sql. It is additive (create table if not exists) — no destructive changes to existing canonical tables.

**2.**  **Load the seed.**  Load seed_bundle_final_override_v1.json in full: profile sections, dashboard actions, worker prompts, directory card config, terminology overrides.

**3.**  **Apply the copy.**  Apply ui_copy_overrides_v1.csv across the listed screens, then sweep all participant-facing copy against the terminology_overrides table.

**4.**  **Verify and return evidence.**  Check against the acceptance column and the sign-off checklist below, and return screenshots per checklist item for Sue’s sign-off.

**8**   **Acceptance checklist (sign-off)**

Version 1.0 launches when every item is true and evidenced.

| ☐ | Participant sees “My Personal Profile” — never FCA Baseline, Baseline Assessment, or Baseline Information. |
| --- | --- |
| ☐ | Participant dashboard has no more than four primary actions, in seeded order, with Browse Workers optional. |
| ☐ | Worker profile prompts are the seven seeded relational prompts, plain language, relational-first layout. |
| ☐ | Directory cards lead with style / communication / environment; availability visible but secondary; no matching or booking language. |
| ☐ | TMG180 never appears to coordinate services — contact notices present on worker profiles and directory. |
| ☐ | Governance screens show metadata / infrastructure only, using Platform Governance terminology. |

**Where existing screens conflict with this override, the override wins; where the override is silent, the existing canonical documents stand. Build it as written.**
