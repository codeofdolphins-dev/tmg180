# TMG180 Participant Longitudinal Brief — the participant-type slice of the 25 Aug canon

Gathered 2026-08-25. **Start here for the participant phase of the Longitudinal package.** This extracts everything participant-type from [TMG180_Longitudinal_Spec_2026-08-25.md](TMG180_Longitudinal_Spec_2026-08-25.md) + [canonical-2026-08-25/](canonical-2026-08-25/) and lines it up against the code that exists today. Worker read-views, admin surfaces and the AI-derived layer are explicitly **out of scope here** — they are later phases; nothing in this brief blocks on them.

## 0. Authority and scope

- The Longitudinal package (2026-08-25.1) overrides the current build, earlier schemas and earlier seed bundles **in its domain** (Personal Profile, Daily/Monthly Case Notes, sharing/versioning/derived views).
- Participant-type scope = the participant's own experience of it: **My Personal Profile (14 modules) · versioned responses + history · save-and-return · module-scoped sharing grants (the granting side) · the participant's view of Daily/Monthly notes · migration of the existing 11-section answers**.
- Copy fidelity is a release blocker (PP-01): render the exact seed text, exact options, canonical order. Length is solved by UX (cards/collapsible groups), never by cutting content.

## 1. Non-negotiables (participant-facing digest)

1. The Profile is a **participant-facing living document**, never backend-only intake (PP-04). Participant reads back exactly what they entered (PP-02).
2. **Edits never overwrite history** — a change supersedes; the prior answer stays queryable (PP-05). Responses snapshot their prompt/option wording at write time.
3. **"Not sure" / "prefer not to answer" / "not applicable" are answers, not null** (§9).
4. Save-and-return anywhere; no forced completion of optional questions (PP-03).
5. One product object, "**My Personal Profile**" — 14 modules inside it, "Continue / Review My Personal Profile" behaviour, never 14 separate assessments (§4.1).
6. Workers see nothing until the participant grants access — full profile or **selected modules**, revocable immediately (PP-07/08/09).
7. Monthly's "a Personal Profile module may need updating" produces a **review prompt for the participant only** — nothing edits the Profile automatically (MN-01).
8. Derived functional/NDIS wording, if shown at all, is a separate optional layer that never replaces the source answer (§4.2, PP-06).

## 2. The 14 modules (seed: `tmg180_personal_profile_canonical_seed.json`)

2,383 blocks; kinds are `text` | `blank` (free-text space) | `checkbox_line` (one line of joined `☐` options). `module_id` + `display_order` are canonical; the source titles carry the source docs' own numbering slips (the 3rd module is titled "Module 2 — Who am I?", the 5th "Module 3 — Executive Functioning…") — **§8.2 forbids correcting them**. ~330 free-text prompts and ~294 choice groups (~2,900 options) across the set. Topic outlines below are derived for orientation only — the seed is the source of truth.

| # | module_id | Source title | Blocks | ~Free-text | ~Choice groups (options) |
| --- | --- | --- | --- | --- | --- |
| 1 | pp_module_01 | Your Personal Profile | 125 | 0 | 0 |
| 2 | pp_module_02 | Module 2 — About Me, My Disability and What Matters to Me | 163 | 32 | 11 (103) |
| 3 | pp_module_03 | Module 2 — Who am I? | 27 | 5 | 2 (57) |
| 4 | pp_module_04 | Module 4 — My Body, Movement & Physical Abilities | 155 | 28 | 19 (196) |
| 5 | pp_module_05 | Module 3 — Executive Functioning and Everyday Life | 137 | 20 | 13 (156) |
| 6 | pp_module_06 | Module 6 — Personal Care & Looking After Myself | 129 | 20 | 13 (164) |
| 7 | pp_module_07 | Module 7 — Getting Around & Leaving Home | 153 | 26 | 24 (245) |
| 8 | pp_module_08 | Module 8 — Food, Meals & Everyday Nutrition | 208 | 32 | 28 (348) |
| 9 | pp_module_09 | Module 9 — My Home & Everyday Household Tasks | 174 | 27 | 25 (247) |
| 10 | pp_module_10 | Module 10 — Keeping My Mind & Body Healthy | 230 | 49 | 26 (240) |
| 11 | pp_module_11 | Module 11 — My Emotions, Stress & Nervous System | 223 | 38 | 28 (335) |
| 12 | pp_module_12 | Module 12 — My Health, Medication & Ongoing Health Needs | 183 | 31 | 23 (231) |
| 13 | pp_module_13 | Module 13 — Equipment, Technology & My Environment | 182 | 31 | 26 (291) |
| 14 | pp_module_14 | Module 14 — My Life, Purpose, Dreams & Aspirations | 294 | 58 | 25 (301) |

Per-module topics (derived outline):

1. **Your Personal Profile** — all explanatory, no inputs: understanding everyday life in your own words · functional needs · "your diagnosis doesn't tell your whole story" · whole-of-life effect · what you already have/tried · improvement and ongoing impairment coexist · building your own evidence over time · professional + own evidence together · helping workers understand you · your Profile belongs to you. *(This is the natural "Before You Begin" landing page of My Personal Profile.)*
2. **About Me, My Disability and What Matters to Me** — 1. About Me (name I like, pronouns, important things, enjoy/interests, people/animals/communities, strengths, what helps me feel comfortable) · 2. My Disability/Diagnosis (record-if-I-choose, "what does this mean to me") · 3. **My Goals (repeatable "+ Add another goal")** · 4. What I Already Have Around Me (health/allied-health + mainstream/community supports) · 5. Things I Have Already Tried · 6. What Helps Me Function.
3. **Who am I?** — short warm-up: things I enjoy / used to enjoy / would like again / wondered about · "I'm not really sure what I enjoy at the moment ☐" (a legitimate answer) · what makes a good day for me. ⚠ Contains leftover drafting artifacts in the source copy ("Then don't merely ask what they currently do:", "And then we can gently explore:") — render-exact per §8.2, flagged to Saf below.
4. **My Body, Movement & Physical Abilities** — moving around · strength/balance/coordination · hands & smaller movements · pain · energy/stamina/fatigue · "my body can be different at different times" · non-physical barriers · movement & activity · effect on the rest of my life · in my own words.
5. **Executive Functioning and Everyday Life** — getting started · planning/organising · following through · time & transitions · when demands build up · what affects it.
6. **Personal Care & Looking After Myself** — showering/bathing · dressing · grooming/hygiene · toileting & continence · skin/positioning/comfort · "knowing how doesn't mean it happens" · sensory experiences · when another person supports me · in my own words.
7. **Getting Around & Leaving Home** — getting ready to leave · physically getting around · transport · wayfinding · "the thought of leaving" · being in public · familiar vs unfamiliar · groups/community · getting home matters too · in my own words.
8. **Food, Meals & Everyday Nutrition** — what food is like for me · choosing · planning · shopping · preparing/cooking · eating & drinking · hydration · nutrition · food/emotions/regulation · sensory · eating safely · **mealtime management plan** · eating out · better/harder days · in my own words.
9. **My Home & Everyday Household Tasks** — everyday cleaning · laundry · bedding · organisation · when tasks build up · household safety · supplies · outdoor area · when someone helps in my home · better/harder days · in my own words.
10. **Keeping My Mind & Body Healthy** — movement & activity · rest/sleep/recovery · mental & emotional health · therapy & professional support · connection & relationships · what already works · when things go well / get difficult · in my own words.
11. **My Emotions, Stress & Nervous System** — anxiety & worry · panic · low mood · overwhelm & dysregulation · shutdown/freeze/withdrawal · trauma-related responses · sensory overload · stress accumulation · masking · better/harder days · when someone is supporting me · communication when distressed · in my own words.
12. **My Health, Medication & Ongoing Health Needs** — current health · pain · fatigue · medication + effects · prescriptions & health admin · appointments & access · my health/therapy team · treatment routines · nursing/specialised support · continence health · fluctuating health · "one thing affects everything else" · what already works · in my own words.
13. **Equipment, Technology & My Environment** — equipment I use · mobility equipment · technology in everyday life · home environment · accessibility outside home · sensory environment · communication & information accessibility · transport · safety & emergency access · when equipment fails · maintenance/admin · tried already · what works · in my own words.
14. **My Life, Purpose, Dreams & Aspirations** — my roles · employment · education & skills · contribution/volunteering · interests & passions · things I used to do · what I have & don't want to lose · belonging & connection · choice/independence/control · something I'd like to try · **My Goals** · my dreams & aspirations · my version of an ordinary good life · "this Profile belongs to you".

## 3. The interaction model the seed implies

The seed is per-paragraph copy, not a form schema — deriving the interactive model is our job, and it must be **deterministic and text-preserving** (the derivation may classify blocks, never rewrite them):

- `text` ending `?` or `:` followed by `blank` → free-text field (the blank count suggests size).
- `text` question/lead-in followed by `checkbox_line` → multi-select group; options split on `☐`, labels verbatim; trailing "Other: ______" options get an inline free-text.
- `checkbox_line` with no lead-in → continuation of the group above.
- Standalone short `text` after blank(s) → topic heading (grouping only).
- Remaining `text` → explanatory copy, rendered as-is ("why we ask" copy is part of the experience, §8.2).
- Special cases: Module 2's "+ Add another goal" → repeatable group (§9); inline "…: ☐" single checkboxes (module 3); every group implicitly admits "not sure / prefer not to answer" semantics — store them as values, never null (§9).

## 4. Daily / Monthly — the participant's side only

Forms mirrored at [TMG180_Daily_Monthly_Case_Notes_2026-08-25.md](TMG180_Daily_Monthly_Case_Notes_2026-08-25.md); seed `tmg180_daily_monthly_canonical_seed.json` (120 blocks). Participant-type touchpoints:

- Daily: "Participant voice & collaboration" state + "anything the participant wants recorded in their own words" — stored separately from worker content (DN-02); participant reads their notes.
- Monthly: "How was the participant involved?" · section 12 "Participant's view of the month" · participant review status on the record · section 9/13 can raise "a Personal Profile module may need updating" → a **review prompt** on the participant side (MN-01), never an edit.
- The full case-note rebuild is shared with the worker phase — participant-type work should land the **review-prompt seam and the participant read view**, not rebuild worker authoring.

## 5. What exists today (the thing §18 says we must not rip out)

- **API**: `GET /participant/profile`, `PATCH /participant/profile/sections/:sectionKey` ([profile.controller.ts](../apps/api/src/controllers/profile.controller.ts)) over `ParticipantProfile` / `ParticipantProfileSection` / `ParticipantProfileAnswer` (answers upsert in place — no versioning, no prompt snapshots).
- **Contract**: `packages/shared/src/profile.js` — the 11 R-01 sections (~74 keys incl. groups/fields), seeded from the July Final Override bundle + FCA (INTAKE FINAL) content, definitions in shared code, not DB.
- **Web**: `MyPersonalProfile.jsx` (11-section hub), one generic `ProfileSection.jsx` (route `/participant/profile/:sectionSlug`), hooks in `hooks/participant/profile.js` (`useProfile`, `useSaveSection`, `useSectionForm`), dashboard "N of 11 sections completed" chip.
- **Evidence chain**: `ParticipantGoal` rows derive on save from section `goals` (`primary_aspiration`, `goal_steps`) — daily logs require 1–3 of them to submit. **This chain must keep working through every step of the migration.**
- Data at stake: dev-only (one real local participant, `flowtest@example.com`). No production data.

## 6. Mapping the 11 sections → 14 modules (§18)

§18 demands mapping only where a **defensible exact match** exists; everything else stays as flagged legacy — do not guess. Field-level review verdict: the new modules re-ask everything with different prompts and options, so **there are no defensible exact field matches**. Candidate topic correspondences for the record: overview→M1 · about_me→M2§1 · communication→M2§1/M11/M13 (split) · what_matters→M2/M14 · goals→M2§3+M14 · daily_living→M5/M6/M8/M9 (split) · mobility_access→M7 · health_wellbeing→M10/M12 · social_community→M3/M14 · decision_making→M14 · safety_preferences→M6/M11. Consequence: **all current answers become preserved read-only legacy records** (visible to the participant as their earlier answers, per PP-04/MIG-01), and participants enter the new modules fresh. Exception to handle with care: goals — `ParticipantGoal` stays the operational goals table; when Module 2 §3 goes live its repeatable goal group becomes the new way goals are captured, and the derive-on-save rule (goals materialised by the write) carries over.

## 7. Build slices — participant type, one by one

- **P0 — Definition layer + seed import.** New Prisma tables mirroring the reference SQL's intent (`profile_definition`, `profile_module_definition` with verbatim `content_json` + SHA-256, and a versioned response table with `prompt_snapshot` / `option_label_snapshot` / `superseded_by`). An idempotent import script reads [canonical-2026-08-25/](canonical-2026-08-25/) JSON **verbatim** into an immutable-once-active definition version, and derives the interaction model (§3 above) deterministically alongside — never editing text. NB this reverses the earlier "definitions live in shared, not DB" decision: the canon requires versioned, hash-checked, immutable definitions, which is a database job.
- **P1 — "My Personal Profile" renderer.** The 14-module hub + one generic module page rendering the active definition + current responses: explanatory copy, headings, free-text, multi-selects (with Other inlines, repeatable goals), save-and-return with per-module progress, Continue/Review behaviour. Participant UI scale applies; **no Figma frames exist for these modules** — build on the established participant idiom, flag to Saf.
- **P2 — Versioning + history.** Supersede-chain on response writes (PP-05), participant-visible history view ("what did I have here before"), audit events on view/update (AUD-01 participant slice).
- **P3 — Migration (§18).** Old 11-section surface retires from nav; legacy answers preserved read-only and reachable (MIG-01); goals chain re-pointed as §6 above; dashboard chip becomes "N of 14 modules".
- **P4 — Sharing grants (granting side).** Module-scoped grants (full profile / selected modules, expiry, immediate revocation) from Privacy & Sharing, layered on the existing consent architecture (PP-07/08/09 participant half; the worker read view is the worker phase).
- **P5 — Daily/Monthly participant surfaces.** The §4 touchpoints: review prompts, participant view/voice on the new forms — sequenced with the worker-phase rebuild of authoring.

Release-blocker tests owned by this phase: **PP-01…PP-06 (P0–P2) · MIG-01 (P3) · PP-07–09 participant half (P4) · MN-01 (P5)**.

## 8. Open questions / flags for Saf & Sue

1. **No Figma frames** for the 14 modules, the history view, module-scoped sharing, or the new case-note forms — building on the participant UI scale + existing idiom until design lands.
2. **Module 3 drafting artifacts** in canonical copy ("Then don't merely ask what they currently do:" / "And then we can gently explore:") — render-exact rules say keep; they read as editor's notes. Need a corrected signed bundle to remove them.
3. **Title numbering slips** (3rd module titled "Module 2", 5th titled "Module 3") — kept per §8.2; confirm intended.
4. **Two goal surfaces** (Module 2 §3 and Module 14 "My Goals") — which one feeds the 1–3-goals-per-daily-log evidence chain, or both?
5. The old FCA intake seed (`FcaIntake`, AI intake-summary endpoint) — the 11-section content it fed is superseded; confirm the intake derivation retires with it.
6. Does the participant check-in (M-04, still unbuilt) survive alongside the new Daily Case Note, or fold into it?
