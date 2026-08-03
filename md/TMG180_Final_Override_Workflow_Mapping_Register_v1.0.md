## Sheet: Workflow Mapping

| ID | Journey | TMG180 workflow — before override (canonical) | What the final override changes | TMG180 workflow — after override | Implemented via | Canonical docs touched | Impact on past work |
| --- | --- | --- | --- | --- | --- | --- | --- |
| WF-01 | Participant | Participant completes FCA Baseline intake (canonical FCA intake document) as the entry assessment | Intake reframed as the participant's whole foundation: one living 'My Personal Profile' in 11 plain-language sections; baseline/assessment terminology removed from participant UI; FCA_BASELINE retained internally | Participant builds My Personal Profile over time; profile resumes from last section; ownership language throughout | participant_profiles, participant_profile_sections, participant_profile_answers + seed sections + UI copy | FCA intake; banned terms | FCA intake content maps into the 11 sections — no data model rebuild; existing intake questions re-homed, not discarded |
| WF-02 | Participant | Daily casenotes recorded per canonical daily casenote spec | No structural change — repositioned as dashboard primary action 2, 'Today's Daily Log', with reflective plain language | Participant opens Today's Daily Log from a 4-action dashboard | dashboard_action_config seed (daily_log, priority 2) | Daily casenotes spec (unchanged) | None — daily casenote schema and linking stay as canonical |
| WF-03 | Participant | Monthly casenote / snapshot generated per canonical snapshot spec | No structural change — surfaced as dashboard primary action 3, 'Monthly Snapshot' | Participant reviews recent patterns and adds context via Monthly Snapshot | dashboard_action_config seed (monthly_snapshot, priority 3) | Snapshot spec (unchanged) | None — snapshot logic untouched; override is silent, canonical stands |
| WF-04 | Participant | Evidence linking between profile, logs and snapshots per canonical linking spec | No change — linking continues to reference the profile (now My Personal Profile) as the anchor record | Same linking behaviour; anchor renamed in UI only | internal_baseline_type retains FCA_BASELINE so existing links keep resolving | Linking spec (unchanged) | None — links keyed to internal identifiers, not UI labels |
| WF-05 | Participant | Dashboard grew feature cards as modules were added | Hard cap: four primary actions (Continue My Personal Profile, Today's Daily Log, Monthly Snapshot, Browse Workers optional); everything else one level deeper | Low-cognitive-load dashboard; secondary features nested | dashboard_action_config + UI copy 'All feature cards -> Four primary actions only' | Foundational overview | Existing feature screens keep their routes — they move a level down, they are not deleted |
| WF-06 | Worker | Designer incorrectly built worker-matching app screens (superseded); corrected direction was resume-style worker profiles | Worker profile rebuilt relational-first: 7 relational prompts primary; support areas, availability, location, languages, credentials split into supporting details | Worker introduces self as a person; credentials sit behind/below relational content | worker_relational_profiles + worker_profile_supporting_details + worker_profile_prompts seed | Designer Correction Brief v2.1; banned terms | Matching screens remain superseded — do NOT revive; any reusable UI components may be reskinned to relational card layout |
| WF-07 | Worker/Participant | Directory concept existed but risked reading as a booking marketplace | Directory cards lead with relational fields; availability/location/support areas demoted to secondary; 'Matching' banned -> 'Browse verified workers'; non-coordination notice on directory and profiles | Participant browses verified workers and contacts them directly by the worker's preferred method | directory_card_config seed + terminology_overrides + contact_notice defaults | Banned terms; foundational overview (TMG180 never coordinates services) | Confirms and hardens the ownership narrative — platform is evidence + browse, never rostering or booking |
| WF-08 | Governance | Governance screens carried admin/management-style labels | Terminology locked: Platform Governance / Governance Console / Governance Environment; 'Governance Admin', 'Management', 'Care Management' banned; overrides stored as data for linting | Governance surfaces show metadata/infrastructure only | terminology_overrides table + seed + UI copy row | Governance standards; banned terms | Governance standards doc remains authoritative; this override adds enforceable terminology on top |

## Sheet: Implementation Register

| ID | Priority | Feedback point | Component | Implementation detail | Acceptance check | Owner | Status | Evidence / Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1-01 | P1 Personal Profile | One living profile as participant foundation | Schema | participant_profiles: unique per participant, status lifecycle, completed/total sections (11), last_section_key resume | Single profile resumes mid-section across sessions | Deb | Not started |  |
| P1-02 | P1 Personal Profile | Plain-language sections, not one form | Schema + Seed | participant_profile_sections + 11 seeded sections (Overview ... Safety & Support Preferences) | All 11 sections render in seed order with seeded descriptions | Deb | Not started |  |
| P1-03 | P1 Personal Profile | Participant-controlled sharing | Schema | participant_profile_answers.visibility: participant_private / share_with_consent / snapshot_only (default private) | Every answer carries visibility; default private | Deb | Not started |  |
| P1-04 | P1 Personal Profile | No baseline terminology in participant UI | UI copy + Seed | FCA Baseline -> My Personal Profile; Baseline Assessment must_change; FCA_BASELINE internal_only | Zero hits for FCA/Baseline/Assessment in participant screens | Deb | Not started |  |
| P1-05 | P1 Personal Profile | Ownership language | UI copy | Exact strings: My Personal Profile / Continue My Profile / Your profile belongs to you / Your profile grows over time | Strings appear verbatim in profile UI | Deb | Not started |  |
| P2-01 | P2 Dashboard | Exactly four primary actions | Schema + Seed | dashboard_action_config; seeds continue_profile(1), daily_log(2), monthly_snapshot(3), browse_workers(4, optional) | Max 4 primary actions in seeded order; Browse Workers toggleable | Deb | Not started |  |
| P2-02 | P2 Dashboard | Everything else one level deeper | UI copy | 'All feature cards' -> 'Four primary actions only'; secondary features nested | No 5th card/tile/shortcut on primary surface | Deb | Not started |  |
| P3-01 | P3 Worker Profile | Relational content primary | Schema | worker_relational_profiles: intro, support style, communication, environments, interests, appreciation, boundaries/fit | Profile leads with relational fields; publishable on relational content alone | Deb | Not started |  |
| P3-02 | P3 Worker Profile | Plain-language relational prompts | Seed | 7 worker_profile_prompts with helper text, verbatim from seed | Prompt labels/helpers match seed exactly | Deb | Not started |  |
| P3-03 | P3 Worker Profile | Resume details as supporting content | Schema | worker_profile_supporting_details: support areas, availability, location, languages, credentials, experience | Credentials render below/behind relational content | Deb | Not started |  |
| P3-04 | P3 Worker Profile | No coordination implication | Schema | contact_notice default: TMG180 does not coordinate services; contact direct with worker | Notice shows wherever contact details show | Deb | Not started |  |
| P4-01 | P4 Directory | Cards lead relational | Seed | directory_card_config primary: name, intro excerpt, support style, communication, environments | Card top half relational only | Deb | Not started |  |
| P4-02 | P4 Directory | Availability visible but secondary | Seed | availability/location/support areas in secondary_fields AND suppressed_primary_fields | Findable but never lead; no booking affordances | Deb | Not started |  |
| P4-03 | P4 Directory | No matching/marketplace language | UI copy + Seed | 'Matching' -> 'Browse verified workers' (must_change, all directory contexts) | match/matching/book absent from directory UI | Deb | Not started |  |
| P4-04 | P4 Directory | Non-coordination notice | Seed | Directory notice: participants contact independent workers directly | Notice renders on directory | Deb | Not started |  |
| P5-01 | P5 Governance | Approved terminology only | UI copy | Platform Governance / Governance Console / Governance Environment; Governance Admin replaced | Nav/headers use approved trio only | Deb | Not started |  |
| P5-02 | P5 Governance | Banned provider-style terms | Seed | Care Management -> participant-owned support evidence (must_change, all UI); Governance Admin (avoid) | Banned terms absent across all screens | Deb | Not started |  |
| P5-03 | P5 Governance | Terminology enforceable as data | Schema + Seed | terminology_overrides table seeded with 5 overrides; new copy linted against it | Table seeded; copy check part of release process | Deb | Not started |  |
| GT-01 | Gate | Migration run | Process | schema_patch_final_override_v1.sql applied as additive migration | Migration succeeds; no destructive change to canonical tables | Deb | Not started |  |
| GT-02 | Gate | Seed loaded | Process | seed_bundle_final_override_v1.json loaded in full | All five seed groups present in DB | Deb | Not started |  |
| GT-03 | Gate | Copy sweep | Process | ui_copy_overrides_v1.csv applied; full sweep against terminology_overrides | Sweep report clean | Deb | Not started |  |
| GT-04 | Gate | Sign-off pack | Process | Screenshots per acceptance item returned for review | Sue sign-off recorded | Sue | Not started |  |

## Sheet: Summary

| TMG180 Final Override — Progress Summary |  |
| --- | --- |
| Total items | 22 |
| Not started | 22 |
| In progress | 0 |
| Built | 0 |
| Verified | 0 |
| Signed off | 0 |
| Blocked | 0 |
| % complete (Verified + Signed off) | 0 |
