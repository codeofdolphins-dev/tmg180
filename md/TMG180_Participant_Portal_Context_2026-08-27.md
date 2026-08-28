# TMG180 Participant Portal — Modification Context (27 Aug 2026, v2 after the document delivery)

Gathered 2026-08-27, rewritten the same evening once Jiten delivered the client's document set to `Desktop/Office/TMG180/TMG claude demand docs/`. **Start here for the participant-portal modification round.** The brief: the client had Lovable generate the same site from this document set and likes it; we bring the participant portal to the set. **Figma is retired for content** — theme = the built one ([frontend/TMG180_Participant_UI_Scale.md](frontend/TMG180_Participant_UI_Scale.md) + existing idiom); structure and copy from the documents only. **No assumptions: where the documents disagree or are silent, the item is listed in §5 as a ruling, not decided here.**

Every delivered document is mirrored verbatim in [sources-2026-08-27/](sources-2026-08-27/) (plain-text extraction; open the source file for layout).

## 0. Authority — what the delivered documents say about themselves

1. **[Document Control Register, 23 Aug](sources-2026-08-27/Document_Control_Register_2026-08-23.md)** is the newest register in the set. It names the developer working set as **exactly four documents**: (1) *Master Implementation Mapping v2.0* (23 Aug) — "open first, always"; (2) *Dev Unblock Specification* (6 Aug) + 7 Aug F-rulings — "the build authority"; (3) *Final Override v1.1 bundle* (the four files, "not the v1.1 handoff document around them"); (4) *Worker Profile Spec & Review* (7 Aug) + `WorkerProfile.jsx` / `tokens.css`. Read-once context: *Developer Technical Brief* and *NDIS Act Review — Developer Implications* (23 Aug). **We hold one of the four (the bundle) and one of the two (the Brief).** The rest are in §5.
2. The register classes *Handoff & Implementation Mapping v1.1* (8 Jul) as **ARCHIVE** (P-register carried into Master Mapping v2.0) and the June *Drift Fix pack* (= Instructions.pdf) as **REFERENCE**: its boundaries stay binding, its exact strings ("Personal Profile (FCA baseline)", "TMG180 Governance Admin", 5-tile dashboard) were overruled — "strings come from the Aug docs only".
3. The 3-page governance **[Final Override Handoff Mapping v1.1](sources-2026-08-27/Final_Override_Handoff_Mapping_v1.1_governance.md)** (the pasted image + docx) restates the override with the rule "override wins over screens; canon stands where silent" and its own status "changes only through the document register". Until Master Mapping v2.0 arrives it is the most specific participant-copy authority we hold.
4. The **25 Aug Longitudinal package (14 modules)** post-dates the register by two days and is **not in the client's list**. It declares itself a final canonical override; the client's list instead carries the *Support Needs Tool v4* (FCA lineage, 11-section compatible). Which one is the Personal Profile is **ruling #1** — nothing profile-related moves until it is answered.
5. The register also says "Design: done (Figma)". Jiten's 27 Aug instruction retires Figma for content; strings therefore come only from the documents in this set (and Master Mapping v2.0 when it arrives).

## 1. The delivery — what arrived, what was removed, where it lives

23 files delivered. Removed with Jiten's authorisation, all content-identical to a kept copy: 8 byte-identical `(1)`/`(2)` copies; `FCA (INTAKE FINAL) (1).docx` and `…Rationale_Manual_v1 (2).docx` (different bytes, identical text); the two PDF renders of the Document Control Register and the Legislation Update (docx kept). 20 documents + 3 page images remain.

| Delivered | Date / version | Mirror | For the participant portal |
| --- | --- | --- | --- |
| Instructions .pdf | Drift Fix JSON v1, 6 Jun 2026 | [Instructions_DriftFix_2026-06-06.md](sources-2026-08-27/Instructions_DriftFix_2026-06-06.md) | Binding boundaries + banned terms; nav/library IA; directory copy (§2.1) |
| Goal Link Helper — README v1, One-Page Spec v1.1, schema+seed SQL | 3 Jun 2026 | [README](sources-2026-08-27/Goal_Link_Helper_Pack_README_v1.md) · [Spec](sources-2026-08-27/Goal_Link_Helper_Developer_Spec_One_Page_v1_1.md) · [SQL](sources-2026-08-27/TMG180_Goal_Link_Helper_schema_and_seed_postgres_v1.sql) | New log fields + reference table (§2.3) |
| Participant Personal Profile Support Needs Tool v4 PLATFORM_READY.pdf | v4 | [Participant_Personal_Profile_Support_Needs_Tool_v4.md](sources-2026-08-27/Participant_Personal_Profile_Support_Needs_Tool_v4.md) | The profile content in the client's set (§2.2) |
| FCA (INTAKE FINAL).docx ("-4") | — | already [applied](../packages/shared/src/profile.js) | **Text-identical to the copy we had.** "-4" is not a revision. |
| TMG180 Developer Technical Brief.docx ("-2") | — | [md mirror](TMG180_Developer_Technical_Brief.md) | **Byte-identical to the copy we had.** "-2" is not a revision. |
| CASE NOTE INTRODUCTION INSTRUCTIONS copy.docx | — | [Case_Note_Introduction_Instructions.md](sources-2026-08-27/Case_Note_Introduction_Instructions.md) | Intro text for every note screen + Library (§2.5) |
| DAILY CASENOTES.docx | canonical template | [Daily_Casenotes_Relational_Evidence_Note.md](sources-2026-08-27/Daily_Casenotes_Relational_Evidence_Note.md) | The **11-section Daily Relational Evidence Note** — not the 25 Aug checkbox form (§2.4). **No monthly template arrived.** |
| goal mapping examples.pdf | — | [Goal_Mapping_Examples.md](sources-2026-08-27/Goal_Mapping_Examples.md) | Six NDIS domains; Library content (§2.6) |
| TMG180_Final_Override_Handoff_Mapping_v1.1.docx + page-1..3.jpg | v1.1 governance doc | [Final_Override_Handoff_Mapping_v1.1_governance.md](sources-2026-08-27/Final_Override_Handoff_Mapping_v1.1_governance.md) | Approved wording table; standing boundaries (§2.7) |
| TMG180_Document_Control_Register_2.docx | 23 Aug 2026 | [Document_Control_Register_2026-08-23.md](sources-2026-08-27/Document_Control_Register_2026-08-23.md) | Authority stack (§0), backlog order, launch gates (§2.8) |
| TMG180_Legislation_Update_for_Sue.docx | 23 Aug 2026 | [Legislation_Update_for_Sue_2026-08-23.md](sources-2026-08-27/Legislation_Update_for_Sue_2026-08-23.md) | Payment red line; record-continuity duties; two queued rulings (§2.9) |
| TMG180_Legislative_Alignment_Map.docx | Jun 2026 | [Legislative_Alignment_Map.md](sources-2026-08-27/Legislative_Alignment_Map.md) | Evidence tools per provision (§2.10) |
| TMG180_Mandatory_Policies_GOVERNANCE_CONTROLLED_v1.docx | v1.0, 21 Jun 2026 | [Mandatory_Policies_Governance_Controlled_v1.md](sources-2026-08-27/Mandatory_Policies_Governance_Controlled_v1.md) | What the Participant Portal holds; participant rights (§2.11) |
| Governance Architecture Development & Rationale Manual v1 | Jun 2026 | [Governance_Architecture_Development_and_Rationale_Manual_v1.md](sources-2026-08-27/Governance_Architecture_Development_and_Rationale_Manual_v1.md) | Component register, AI rules, controlled terminology (§2.12) |
| TMG Governance Architecture.docx | v1.0 draft | [TMG_Governance_Architecture_v1.md](sources-2026-08-27/TMG_Governance_Architecture_v1.md) | Six-volume suite structure; no UI content |
| AI Governance Register (1).docx | v1.0 | [AI_Governance_Register_v1.md](sources-2026-08-27/AI_Governance_Register_v1.md) | AI controls (§2.12) |
| SPEC AI human centered AI AGENTS copy.docx | AI-thread extract | [SPEC_AI_Human_Centred_AI_Agents.md](sources-2026-08-27/SPEC_AI_Human_Centred_AI_Agents.md) | "No participant-facing agent" at MVP (§2.12) |
| TMG180 Learning Hub Worker Orientation.docx | 5 modules | [Learning_Hub_Worker_Orientation.md](sources-2026-08-27/Learning_Hub_Worker_Orientation.md) | Worker phase; confirms evidence rules (§2.12) |

## 2. What each document requires of the participant portal, against the build

### 2.1 Instructions.pdf (Drift Fix, 6 Jun)
- **Binding (register: boundaries stand):** banned everywhere — match / matches / matched / matching, caseload, assigned, tasks, action required, care management, programs, client, HIPAA. Participant directory is filter/search only; contact happens outside the platform. Library IA: tabs *Core Library* / *Optional Reading (collapsed)*; five topic pages (Mandatory Policies · Practice Standards · Support Interpretation · Relational Discipline · Templates & How-to Guides); AI retrieval = Core Library only.
- **Overruled by name (register):** "Personal Profile (FCA baseline)", "TMG180 Governance Admin", the 5-tile dashboard.
- **Not overruled by name:** the directory strings — `participant.directory.title` "Browse verified worker profiles", `.subtitle` "Use filters to find the right fit. You choose who to contact.", `.contact_cta` "Contact (outside platform)", `.contact_note` "TMG180 does not coordinate services. Contact happens directly with the worker using their preferred method." Whether these survive Master Mapping v2.0 is **ruling #7**.
- Nav keys list the participant surfaces: Personal Profile · Daily Support Evidence Log · Monthly Snapshot Summary · **Check-ins** · Snapshot Exports · Library · Help Centre · Verified Profiles Directory.
- **Built:** every surface except Check-ins; `Library.jsx` exists with the two tabs but is orphaned (no link to it) and holds mock guides. `BrowseVerifiedWorkers.jsx:180,201` still says "match these filters" (banned).

### 2.2 Support Needs Tool v4 — the profile content in the client's set
- **What it is:** the FCA (INTAKE FINAL) questionnaire re-labelled. Verified by comparison: 358 vs 366 checkbox options, all identical except one rewording ("I need flexibility when my capacity fluctuates" → "…when my support needs change"); the FCA's editor's-note list ("Everyday language / Impact first / No clinical terms…") is gone. Headings identical except "Section 1: Your Personality Style" → "Section 1: About You" and "Before We Begin" → "Before You Begin" (rewritten: "What you are completing today is your Participant Personal Profile. This is not a clinical Functional Capacity Assessment…" — the banned words appear verbatim, in a negation).
- **New in v4, not in the FCA:** a front block *Participant / Support Overview* — **Basic Details** (participant full name, preferred name, date of birth, NDIS number, plan management type, NDIS plan dates, emergency/contact person, preferred contact method, accessibility needs, primary language / communication needs, date profile started, date last updated); **Worker / Support Network Overview** table (name · role/relationship · contact details · access permission · notes/limits — "does not create employment, assignment, or provider management"); **Participant Goals** table (goal · what this means in everyday life · support that may help · review/notes — "in their own words"). Closing section renamed *You Own Your Personal Profile* ("Your profile belongs to you… who sees it, who you share it with, whether you update it, whether you download it"); *You Own Your Support Evidence Notes* (read · contribute · add reflections · **upload notes from other workers** · choose who has access); *Your Choice* (Allow full structured documentation · Participate actively · Upload external case notes · Limit involvement · Decide later).
- **Built:** `packages/shared/src/profile.js` carries the FCA content inside the 11 Override sections. Deltas vs v4: group titles are ours ("Your Personality Style", "Personal Care and Body", "Household Routines and Keeping Up With the Home", "Emotional Regulation, Stress, and Your Nervous System", "What I Am Working Towards") where v4 has "About You", "Your Personal Care and Body", "Household Tasks and Keeping Up With the Home", "Emotional Regulation, Stress, and Nervous System", and no "What I Am Working Towards"; intro copy is the FCA's "Before We Begin"; no Basic Details block; no Support Network table; goals are `primary_aspiration` + `goal_steps`, not the v4 four-column table; the `documentation_choice` options exist (Overview section).
- **Relationship to the 14-module package:** none of the 14 modules' copy is in v4. Two documents now claim to be the Personal Profile with incompatible content — **ruling #1**.

### 2.3 Goal Link Helper pack (3 Jun)
- **Requires:** on the Support Evidence Log — `goal_ids[]` (≥ 1 goal, required), `ndis_bucket` (CORE / CAPACITY_BUILDING / CAPITAL, required), `rn_rationale_tags[]` (optional), `tmg_functional_grouping` (optional; selecting it prefills the default bucket + tags; the user may override; store what was selected). Reference table `tmg_goal_link_helper` seeded with 19 rows (support_domain_code, NDIS support domain, TMG functional grouping, default bucket, examples, goal-link prompts, functional-barrier phrases, R&N tags) — "use as autocomplete suggestions; do not force perfect matches". Monthly snapshot export gains "Supports used this month" grouped by bucket with top goal links, 2–3 functional-barrier phrases, outcome markers and non-shaming "why this remains needed" sentence stems. Written for "workers (and participants)". Boundaries: no diagnosis fields; goals may be many-to-many and evolve.
- **Built:** participant log has 1–3 goals + ≥ 1 of nine `FUNCTIONAL_DOMAINS` (list taken from a Figma frame — the nineteen helper groupings are now a document-backed candidate, see ruling #5); no bucket, no rationale tags, no functional grouping, no helper table; snapshot has no bucket roll-up.

### 2.4 DAILY CASENOTES — the 11-section Daily Relational Evidence Note
- **Requires (developer instructions in the doc):** the note "must remain linked to the intake baseline" through three mandatory hooks — **Goal link** (Section 2: select 1–3 of nine support purposes — Daily living · Community participation · Emotional regulation · Health and wellbeing · Social connection · Capacity building · Routine and structure · Admin or planning · Safety and stability · Other), **Functional impact** (Section 4: 1–3 of eleven), **Baseline comparison** (Section 9: Typical / More / Less / Different + contributing factors). Plus Session Snapshot (date, worker, times, focus, environment), How Today Felt (10 options + short note), What Support Was Helpful (15 options + "what helped most"), Functional Participation Snapshot (one sentence "With support today, the participant was able to:"), Outcome or Change (10 options), Recovery and Sustainability (7 options + note), **Participant Voice** ("Optional. One sentence only."), Safety/Consent/Follow-up (8 options). "The structure itself should not be removed or redesigned without preserving the baseline logic."
- **Built:** the participant-authored log (`ParticipantDailyLog.jsx`) has session date/time, free-text impact/support/notes, 1–3 goals from the profile, nine domain tags, usual-pattern comparison, draft → submit → addendum. It does not carry Sections 3, 4 (as listed), 5, 6, 7, 8, 9's contributor list, 10 or 11. The worker log (`worker/DailyLogForm.jsx`) is still the static Figma screen.
- **Whose form is it:** the template has a *Worker:* field and "Worker Note Guidance" — it is the worker's note. Every delivered document names the participant's own daily object a **check-in** (Tech Brief §2/§4: "cannot be completed by the worker on the participant's behalf"; Instructions nav `Check-ins`; Mandatory Policies §2 "participant check-ins"; Governance Manual §9 "Participant Check-ins"; Legislative Map s 4; Case Note Intro "Participants may also complete check-ins or reflections if they wish. This is optional."). The Override seed names dashboard action 2 "Today's Daily Log". What the participant authors daily — a check-in, a full log, or both — is **ruling #3**.
- **Monthly:** the set says "daily/monthly note set" but only the daily arrived. The Master Document Map's #13 (three-layer monthly, participant approves, addendum-only) is what the built snapshot follows; the document itself is still not on disk (§5).

### 2.5 Case Note Introduction Instructions
- **Requires (Master Map #10):** shown "in the Learning Hub and at the top of every note screen". Participant-relevant sections: *Purpose of These Notes*, *Participants* (optional check-ins/reflections; "Your own words matter"), *Important Principles* (capacity fluctuates; support changes outcomes), *What These Notes Build Over Time*. Developer guidance: each note block keeps mapping Functional impact · Support required · Support delivered · Outcome/change · Baseline comparison · Recovery/sustainability · Participant voice — "should not be altered".
- **Built:** nothing renders this text — not on the log screen, not on the snapshot, not in the Library.

### 2.6 goal_mapping_examples.pdf
- Names the **six NDIS functional capacity domains** (Mobility · Communication · Social interaction · Learning · Self-care · Self-management) and gives goal → support → justification → evidence-phrase examples. Master Map places it in the Learning Hub (workers) — for the participant portal it is Library content only. It is the third document-backed candidate for the domain list (ruling #5).

### 2.7 Final Override Handoff Mapping v1.1 (governance doc, 3 pp)
- §2: 11 sections in the named order; dashboard "Only: Continue My Personal Profile; Today's Daily Log; Monthly Snapshot; Browse Workers (optional). No other feature cards."; directory primary fields = display name, relational intro excerpt, natural support style, communication style, preferred environments — availability, location, support areas secondary.
- §3 approved wording: profile title **"My Personal Profile"**; **primary action "Continue My Profile"**; "Your profile belongs to you."; "Your profile grows over time."; FCA_BASELINE internal only. §5 dashboard copy: "Continue About Me" → **"Continue My Personal Profile"**. So the two strings are both correct, in different places: the profile screen's own action is "Continue My Profile"; the dashboard's is "Continue My Personal Profile". **Built:** the hub button says "Continue My Personal Profile" → change to "Continue My Profile"; dashboard is right.
- §6 standing boundaries: no in-platform messaging; no automated matching/ranking/recommendation; **no processing of NDIS plan money**; AI drafts only; audit records metadata-only, append-only.
- §7 acceptance: every §2 row passes, no §4 banned term in the interface, governance trio only.

### 2.8 Document Control Register (23 Aug) — beyond §0
- Sue's two queued rulings: the two registration consent strings (Create Account) and the additive sections (Learning & Employment as a 12th; My Support Network as its own) — still open, and the v4 front block's *Worker / Support Network Overview* table is relevant to the second.
- Backlog order after build #6: M-09 Consent journey → M-10 Snapshot approval → M-06 Invoices → M-05 Incidents → Library tools (Participant Autonomy & Support Fit Check; Worker Burnout/Rescue Mode Check) → the two Translator tools ("TMG My Words, My Way" is the **participant-facing** one, future, only via a governed endpoint).
- Launch gates: migration + seed evidence · copy sweep clean · ownership-string grep · structural-negatives review · screenshot pack · Sue's sign-off · 0137 determination.

### 2.9 Legislation Update for Sue (23 Aug)
- **Payment red line:** "no payment features, ever, without a legal ruling first" — no invoice/payment surface in the participant portal.
- **Record continuity (APPs/NDB row):** retention periods, **export-before-account-closure**, corrections preserve originals, governed legal-access path for sealed records; append-only with addenda. **Built:** addenda ✓; no account-closure export, no deletion-request flow (`tmg_deletion_requests` exists in the May DDL, unbuilt).
- Consent formulation for Create Account: "express, recorded consent… unless authorised or required by law" (guide for the two strings).
- Confirms the model is outside 0137 registration *because* no plan money moves; boundary statements must stay consistent in code, terms, website.

### 2.10 Legislative Alignment Map (Jun) + 2026 additions
- Platform evidence per provision, participant side: s 3 → Personal Profile, participant voice prompts, goal-linking tools; s 4 → **participant check-ins**, choice prompts, worker fit tools; s 5 → participant portal, plain-language tools, profile prompts; s 7 → website access layers, NDIS knowledge library, AI output modes; s 31 → Goal Link Helper, monthly snapshots, daily logs; s 34 → Daily Support Evidence Logs, interpretation library; Privacy → role separation, participant-owned evidence.

### 2.11 Mandatory Policies v1 (21 Jun)
- §2 Boundary Statement — the Participant Portal "may contain a Participant Personal Profile baseline, **participant check-ins**, structured support event logs, participant-approved monthly snapshot exports and consent controls, where the participant chooses to use the portal and provides consent." Narrative case notes are not stored by default.
- Policy 4 participant rights: create a personal portal and own their information; **have input to their case notes in their own words**; understand what is recorded; request access to records from the worker; request corrections; decline recording of certain information; withdraw consent at any time. Policy 5: participants are not charged; no contracts; may leave at any time; external complaint bodies never discouraged. Policy 7: internal AI uses only platform-stored data, outputs draft-only; identifiable data never into public AI.
- The manual says "TMG180 Governance Administration" throughout (~40 times). If policy text is ever displayed in the participant Library verbatim it carries a term the override bans from the interface — **ruling #8**.

### 2.12 Governance Manual v1 · Governance Architecture · AI Governance Register · SPEC AI · Learning Hub
- Manual §9 component register lists, as separate components: Participant Personal Profile · Daily Support Evidence Logs · Monthly Snapshot Summaries · **Participant Check-ins** ("to keep participant experience visible and not rely only on worker observations") · Goal Link Helper · Support Interpretation Manual · Practice Standards · Onboarding · Website layers · Policy Library · AI rules. Appendix B controlled terminology: Participant (not client) · Independent worker · **Browse / choose / connect** (not match / assign) · Support relationship (not caseload) · **Participant Personal Profile** (not Functional Capacity Assessment) · Evidence log (not surveillance/monitoring) · AI-assisted draft (not AI assessment).
- AI: **SPEC AI** — MVP is internal, worker-portal only, draft-only, citation-required; "**No participant-facing agent (no participant portal/messaging drift)**"; the AI Governance Register and Manual §11 add: human oversight, no autonomous decisions, preserve participant voice, traceability, drift control. **Built:** the participant log renders a disabled "Help me write this" panel and the snapshot review a disabled writing helper — the documents give no participant-facing AI at MVP, so these render controls for something the set says must not exist yet (see §4).
- Learning Hub (worker phase): confirms 1–3 goals + 1–3 domain tags mandatory to finalise, the two-layer model, the eight banned terms with replacements, "the participant approves the monthly summary". Worker-facing copy still calls the intake a "Functional Capacity Assessment intake".

## 3. Conflicts the delivery settles, and the ones it creates

> **27 Aug, evening — applied.** Jiten's instruction: build from the documents; the Lovable code is not needed. Read against their own precedence, rows 1, 2, 3, 5, 6, 7, 8, 10 and 11 resolve without a ruling — how, and what was built as a result, is in §7. Only rows 4 (settled) and 9 (Sue's queued items) remain as written.

| # | Question | Documents | Status |
| --- | --- | --- | --- |
| 1 | **Which Personal Profile content?** | Support Needs Tool v4 (in the set; FCA lineage; 11 sections per Override/Handoff/Register) **vs** 25 Aug Longitudinal 14-module package (not in the set; says it overrides) | **Ruling.** Built = FCA content in 11 sections ≈ v4 minus the front block. |
| 2 | **Which Daily/Monthly forms?** | 11-section Daily Relational Evidence Note + Goal Link Helper (in the set) **vs** 25 Aug checkbox Daily/Monthly Case Notes (not in the set) | **Ruling.** Built ≈ the 11-section rule set (goals + tags + baseline comparison). |
| 3 | **What does the participant author daily?** | Check-in (Tech Brief, Instructions nav, Policies, Manual, Leg Map, Case Note Intro, Build Guide M-04) **vs** Override action "Today's Daily Log" **vs** built full participant log | **Ruling.** |
| 4 | "Continue My Profile" vs "Continue My Personal Profile" | Handoff Mapping v1.1 §3 (profile) + §5 (dashboard) | **Settled:** profile screen "Continue My Profile"; dashboard "Continue My Personal Profile". |
| 5 | **Functional domain list** for `domain_tags` | nine (built, Figma) · six NDIS domains (goal mapping pdf) · nine support purposes (Daily Casenotes §2) · eleven functional impacts (§4) · nineteen groupings (Goal Link Helper) | **Ruling.** |
| 6 | "Functional Capacity Assessment" verbatim in v4's *Before You Begin* (negation) | v4 copy vs P1-04 zero-hits grep "including negations" | **Ruling** (written exception or copy change). |
| 7 | Directory strings | Instructions.pdf (title/subtitle/CTA/notice) vs Build Guide/Override; register overrules Drift-Fix strings "e.g." three named ones only | **Ruling** or Master Mapping v2.0. |
| 8 | "Governance Administration" inside policy text shown in the Library | Mandatory Policies vs override trio | **Ruling** (display verbatim, or a participant-facing edition from Sue). |
| 9 | Sue's queued rulings | consent strings; 12th section / My Support Network (v4's Support Network table now exists as content) | **Open since July.** |
| 10 | Participant-facing AI at MVP | SPEC AI "no participant-facing agent"; register: "My Words, My Way" future via governed endpoint; Tech Brief "help participants understand NDIS concepts" | Documents agree: none at MVP. Confirm before removing the two disabled panels. |
| 11 | `SessionPreferences.jsx` (top-bar gear) | in no delivered document; options use pre-Override section names; "General Availability" on a participant | **Ruling** (remove or re-key). |

## 4. Consolidated delta — participant portal vs the delivered set

| Surface | Documents require | Built today | Work (after the ruling it depends on) |
| --- | --- | --- | --- |
| Profile hub + sections | v4 headings/intro verbatim; front block (Basic Details · Support Network · Goals table); "Continue My Profile" on the hub; ownership strings | FCA content in 11 sections with our group titles; no front block; goals = aspiration + steps; hub button "Continue My Personal Profile" | Re-title groups to v4 wording; swap intro to *Before You Begin*; add the front block and the 4-column goals table; hub button → "Continue My Profile" **(ruling 1, 6, 9)** |
| Dashboard | exactly the 4 seed actions, seed copy; "calmer" | 4 actions ✓; action-2 button "Start Check-in"; hard-coded `SNAPSHOT_BARS`; old 48px card style | Remove fake bars; harmonise cards to the UI scale; action-2 label **(ruling 3)** |
| Daily (participant) | check-in and/or log; Goal Link Helper fields (bucket required); Case Note Intro at top; participant voice one sentence | full participant log, goals + 9 tags, no bucket/tags/grouping, no intro text, disabled AI panel | Add `tmg_goal_link_helper` + fields; render the Intro; remove AI panel **(ruling 2, 3, 5, 10)** |
| Monthly | three-layer snapshot, participant approves, addendum-only ✓; "Supports used this month" by bucket | ✓ minus bucket roll-up; disabled writing helper; two inactive tiles | Add bucket roll-up; remove helper **(ruling 2, 10)**; monthly template still missing (§5) |
| Directory + worker read view | primary fields = name · intro excerpt · style · communication · environments; location/support areas/availability secondary; filter/search only; "Contact (outside platform)"; non-coordination notice ✓ | card lacks style/communication/environments and leads with location (list API doesn't select them); "match these filters" ×2; "not a booking" negation | Add the three fields to list payload + card top half; demote location; reword ×3 **(ruling 7 for the title/subtitle/CTA)** |
| Privacy & Sharing | consent per worker ✓; withdraw any time ✓; export-before-account-closure; corrections preserve originals; "upload notes from other workers" (v4) | grants/revoke/audit ✓; no account-closure export; no deletion request; no external-note upload | Account lifecycle (export + deletion request); external-note upload **(after ruling 1 — v4 feature)** |
| Library | Core / Optional tabs; real content: Case Note Intro, Goal Mapping Examples, Policy 5 statement, Support Interpretation (not on disk) | tabs ✓ with mock guides; **route orphaned** | Link it; load the delivered documents **(ruling 8)** |
| Help Centre | — (no document) | built; FAQ answers ours | Sue sign-off + support address |
| Session Preferences | — (no document) | built from an old frame | **Ruling 11** |
| Check-in (M-04) | present in every governance document | unbuilt; Prisma model exists | Build **(ruling 3)** |
| Language | banned lists (Instructions + Handoff §4 + Learning Hub table); ownership strings | FCA/Baseline/Assessment clean; "match" ×2; "booking" negation | Fix the three; grep exception **(ruling 6)** |

Nothing in this table depends on Figma. Everything marked with a ruling waits.

## 5. Still required

**Documents — named as current authority by the delivered register or Master Map, not on disk.** Items 3, 5 and 6 were already known from the Master Document Map and the project memory and should have been in the first missing-documents list (27 Aug, before the delivery); items 1, 2 and 4 only surfaced inside the delivered Document Control Register.

1. **Master Implementation Mapping v2.0** (23 Aug) — the register's "open first, always": authority stack, supersession register (SR-01…), build register, delivery gates.
2. **Dev Unblock Specification** (6 Aug) **+ 7 Aug F-rulings** — "the build authority": schemas, R-01–R-09, build order ① profile sections ② M-01 ③ M-04 check-in ④ two-layer logs + consent middleware ⑤ admin aggregates ⑥ directory.
3. **Worker Profile Spec & Review** (7 Aug) + `WorkerProfile.jsx` + `tokens.css` — the directory read model depends on its data contract.
4. **NDIS Act Review — Developer Implications** (23 Aug) — the L-series items.
5. **Canonical Technical Pack, Master Map docs 14–20** — README v2, Canonical Schemas Bundle v2/2.2/2.3 (incl. `fca_intake_v6`), Config Master Seeds Postgres v1, Banned Terms & Replacements v1, Improvement Markers v1, Intake→CaseNotes Linking Spec, Participant Snapshot vs Confidential Worker Notes Spec. Never received; the register's "Canonical pack" row still points at them.
6. ~~**MONTHLY CASENOTES** template (Master Map #13) — the set said "daily/monthly note set"; only the daily arrived.~~ **Arrived 28 Aug 2026**, with the Longitudinal Evidence Templates v2.0 that specify the check-in — see §9.
7. *Optional:* Goal Link Helper Table v1 `.xlsx` / seed `.json` (the SQL already carries the 19 seed rows).

**Assets:** the **Lovable build** — URL, export, or full-page screenshots of every participant screen. Still the only way to compare structure page by page.

**Rulings (Saf / Sue), numbered as in §3:** 1 profile source · 2 daily/monthly forms · 3 participant daily object · 5 domain list · 6 "Functional Capacity Assessment" exception · 7 directory strings · 8 policy wording in the Library · 9 Sue's two queued items · 10 participant-facing AI removal · 11 Session Preferences.

## 6. Rules that do not move (from the delivered set)

No matching / ranking / assigning / booking / rostering · directory is filter + search, contact outside the platform · no in-platform messaging · **no NDIS plan money, ever** · AI drafts only behind a human review gate, none participant-facing at MVP · participant voice never completed by a worker · worker narrative (WCPS) never stored or shown · locked records addendum-only, corrections preserve originals · audit records metadata-only, append-only · copy verbatim from the documents · nothing invented, nothing seeded to look populated · one shared layout · participant UI scale everywhere.

## 7. Built on 27 Aug 2026 (evening) — from the documents, no Lovable code

How each open row in §3 resolved by the documents' own rules, and what changed. Everything below lint-, typecheck- and build-clean; verified in the running app with a throw-away participant account (created through the real sign-up API, screenshotted, then deleted with every row it owned) and a 9-step API test of the Goal Link Helper rule.

| §3 row | Rule applied | Result in code |
| --- | --- | --- |
| 1 Profile content | The client's set carries Support Needs Tool v4; the 25 Aug package is not in it (Jiten: focus this set) | `packages/shared/src/profile.js`: Overview intro = v4 *Before You Begin* verbatim; new **Basic Details** group (10 fields incl. a `date` type); the v4 *Consent, Ownership…* copy verbatim in four groups; group titles → v4 headings ("About You", "Your Personal Care and Body", "Household Tasks…", "…and Nervous System"); one option reworded ("…when my support needs change"); **Participant Goals** four-column table (`rows` type) replaces aspiration + steps; **Worker / Support Network Overview** five-column table homed in Decision Making (Build Guide). `goals.controller.ts` derives goals from the table's *Goal* cells first, legacy answers after (nothing stored stops resolving). Renderer: `rows` and `date` question types, group `outro` lines. |
| 2 Daily/monthly forms | Same reasoning | Built log kept (it already carries the 11-section note's hooks: goals, functional impact, baseline comparison) and extended with the Goal Link Helper (below). Monthly stays the three-layer snapshot with the new bucket roll-up. |
| 3 Participant daily object | Every governance document names it a **check-in** | **Unblocked 28 Aug — see §9.** As at 27 Aug: **blocked, not built:** the check-in's option sets ("what showed up", "what helped", "recovery cost") come from MONTHLY CASENOTES.docx (Gaps Analysis), which has not arrived — inventing them would break the rule. The participant-authored full log stays as built and is flagged (no document asks for it; no document asks to remove it). Dashboard action 2 now carries the seed label only. |
| 5 Domain list | Learning Hub M4 "which NDIS functional areas (1–3)"; goal mapping pdf: the six NDIS domains | `FUNCTIONAL_DOMAINS` = Mobility · Communication · Social interaction · Learning · Self-care · Self-management. Dev scripts re-keyed. |
| 6 "Functional Capacity Assessment" in v4 copy | Handoff §7: deviation logged with a reason | **Deviation logged here:** v4's *Before You Begin* says "This is not a clinical Functional Capacity Assessment…" and "Forms, reviews, assessments, provider intake processes…" — rendered verbatim (P1-04's zero-hits grep would flag it; the source is the client's own participant copy). |
| 7 Directory strings | Register: Drift-Fix strings overruled, "strings come from the Aug docs only" | Built (Build Guide) strings kept. Banned words fixed: "match these filters" ×2 → "for these filters"; "not a booking" → removed. |
| 8 Policy text in the Library | Handoff §4 bans "Governance Admin" in *navigation and headers*; the manual's own status is "working draft… requires terminology review" | Library shows the two policies as **Coming soon** with that reason; no text written in their place. |
| 10 Participant-facing AI | SPEC AI: none at MVP | "Help me write this" (log) and "Help me review this" (snapshot) panels removed. |
| 11 Session Preferences | In no document; "if it's not in the bundle/canon, don't invent it" | Page, hook, route and top-bar gear removed. The API routes/table remain untouched (no document asks for a data deletion). |

Also built from the documents:

- **Dashboard** (`ParticipantDashboard.jsx`) — rebuilt from a new `DASHBOARD_ACTIONS` contract (`packages/shared/src/dashboard.js`, the seed's `participant_dashboard_actions` verbatim): four cards, seed label + description, "N of 11 sections completed" chip, one "Open" action each; no fake bars, participant UI scale. Hub primary action → **"Continue My Profile"** (Handoff Mapping v1.1 §3).
- **Directory card** (P4-01) — list API now selects `natural_support_style · communication_style · preferred_environments`; the card leads with name, intro excerpt and those three rows (seed `primary_fields`); location + support areas demoted to one secondary line; stored support-area keys outside `SUPPORT_AREAS` are dropped from the payload (test workers in the dev DB carried invalid keys).
- **Library** — `packages/shared/src/participantLibrary.js`: Core / Optional tabs (Instructions.pdf IA); *TMG180 — Relational Evidence Notes* (Case Note Introduction Instructions) published verbatim; Policy 4 and Policy 5 listed as awaiting their participant-facing edition. Route `/participant/library/:slug`, sidebar entry, `ReadingBlocks` renderer. **Note screens**: `NoteIntroduction` puts the document's *Purpose of These Notes* section at the top of the log form, collapsed (Master Map #10).
- **Goal Link Helper** (pack v1.1) — `packages/shared/src/goalLinkHelper.js` (the 19 seed rows verbatim, buckets, rationale tags); Prisma migration `20260827151917_goal_link_helper` (`tmg_goal_link_helper` + three columns on `tmg_daily_note_structured`, bucket CHECKs as the pack's SQL declares); `prisma/seedGoalLinkHelper.ts` (runs in `db:seed`, 19 rows in place); validation: bucket **required to submit**, grouping/tags optional and validated; both log APIs read/write the fields; `GoalLinkHelperFields` on the participant **and** worker forms (grouping prefills bucket + tags, override kept); `GoalLinkSummary` on both read views; `snapshotStats.buckets` + `SupportsByBucket` ("Supports used this month": per bucket the top goal links, the chosen groupings' functional-barrier phrases, rationale-tag counts) on the participant review, the locked summary and the worker's view. Rationale sentence stems are **not** generated — the pack gives no wording.

Still open after this round: the check-in (needs MONTHLY CASENOTES — **delivered 28 Aug, built, §9**), Sue's two queued rulings, the missing authority documents in §5, the Lovable build for a page-by-page comparison, and the 25 Aug package's status relative to this set.

## 8. The Personal Profile: eleven sections and a closing step (settled 28 Aug 2026)

Sequence, for the record: fourteen sections were built first, from Sue's "PERSONAL PROFILE IMPORTANT CHANGES" letter — the only document that lays out a fourteen-step flow. Jiten then sent the Lovable participant-profile route, which builds **eleven**, and ruled: **keep eleven**, keep our design, take Lovable's content where we can get it.

**Where it landed**

- **Eleven sections**, exactly the Final Override seed's, with their groups back where they were: *Household Tasks…* in Daily Living, *My Home and Environment* in Safety & Support Preferences.
- **Learning & Employment is gone.** It had no questions in any document; it was never more than a name.
- **Review & Submit survives as a closing step, not a twelfth section** — `PROFILE_REVIEW_STEP` in the contract, opened and saved exactly like a section but outside `PROFILE_SECTIONS`, so progress still reads *N of 11*. It holds the Support Needs Tool v4 block that closes that document (You Own Your Personal Profile · Support Evidence Notes · Why Documentation Matters · How the System Works · Your Choice) and lists the eleven with their status. Lovable ends its page on a review-and-submit panel too, so both builds agree on the shape.

**Two documented gaps closed in the same pass**, both found by reading the Lovable route against our build:

| Built | Document behind it |
| --- | --- |
| **Per-answer visibility** — *Only me · Workers I allow · Monthly Snapshot only* under every answer, plus "set every answer in this section to…" | **Final Override P1-03.** The column and the private default existed; nothing read or wrote them, and there was no control. Now on the wire (`PATCH …/sections/:key` takes a `visibility` map, `GET` returns one), validated server-side, and private unless chosen. |
| **Download a copy of the profile** — `/participant/profile/print`, every answered question in its own words, saved through the browser's print dialog | Support Needs Tool v4: "You choose: who sees it · who you share it with · whether you update it · **whether you download it**". Same mechanism as the Monthly Snapshot export, so the file is made on the participant's device and sent nowhere. |

**Not taken from Lovable:** its design (ours stands), its submit-and-lock with typed-name consent (the three consent statements appear in no document), and its PDF watermark/password options (invented). Its per-section "X of Y answered" counter is a fair idea and is still open.

**Wants Sue's sign-off:** the three visibility labels and notes are ours — P1-03 fixes only the enum values and the private default. In particular whether `snapshot_only` means *instead of* the profile (the reading built) or *as well as*.

**Still wanted from Lovable:** `@/content/profile-tool` — their `profileChapters` / `chapterBlocks` / `chapterFields` / `profileIntro`. What was shared is the page shell; the eleven sections' actual question wording lives in that module, and it is the only way to compare their content against ours rather than guess at it.

## 9. The 28 Aug 2026 delivery: the check-in unblocked, the monthly template built

Two documents arrived that were not in the 27 Aug set (`new doc/`, 28 Aug). Six others in the same folder were duplicates of documents already held and were removed after a line-level diff; `FCA_INTAKE_FINAL.docx` was the superseded predecessor of Support Needs Tool v4 (same section set, still using the "Functional Capacity Form" framing v4 replaced) and went with them.

**What arrived** — mirrored verbatim in [sources-2026-08-28/](sources-2026-08-28/):

| Document | What it settles |
| --- | --- |
| **Longitudinal Evidence Templates v2.0** | The three templates as one system: **A** Support Event Log (worker, per session), **B** **Participant Check-in** — the option sets §7 row 3 was blocked on — and **C** Monthly Snapshot Summary, C1–C9, generated from A and B, participant-approved, exportable. Plus the non-negotiable tone rules and the append-only rule. |
| **Monthly Relational Longitudinal Snapshot** | The monthly template from §5 item 6. Eleven sections, checkbox-led: participant reflection, participation trends, ongoing barriers, support-mediated functioning, fluctuation and context, recovery and sustainability, goal and participation mapping, quality-of-life outcomes, the non-linear functioning statement, participant voice and approval, plus worker guidance and developer instructions. |

**The check-in, built.** `tmg_participant_checkin` was created from the earlier DB pack and matches Template B field for field, so this needed no migration — only the vocabularies the table's untyped columns were waiting for.

- `packages/shared/src/checkIn.js` — B1 periods · B2 twelve impact tags (pick 1–3) · B3 the 0–4 intensity scale with the template's wording · B4 twelve "what helped" tags · B5 four recovery levels · B6 own words · B7 five goal tags; `validateCheckInFields`, `canSubmitCheckIn`, `isCheckInLocked`, label helpers.
- **No draft state and no PATCH.** `is_locked` defaults true: a check-in is the record the moment it saves, and a later thought is a later check-in. `POST /participant/check-ins`, `GET` list (`?month=`), `GET /:id`, `GET /check-ins/summary` — participant-only in middleware, because the template rules out a worker completing one.
- Web: `/participant/check-ins` (list), `/new` (the seven blocks in the template's order and wording), `/:id` (read-only; empty blocks are not drawn). Sidebar entry added. **Not** a fifth dashboard card — Final Override P2-01 allows exactly four.
- Only B1 and B2 are required to save. Everything the template marks optional stays optional: "there are no right or wrong answers", "takes 30–60 seconds".

**Template C, completed against columns that already existed.** The snapshot contract had C2, part of C3 and two of C7's fields; the rest were columns nothing read or wrote.

- `SNAPSHOT_LAYERS` now runs C2 → C3 → **C4 the six NDIS functional domains** → **C5 outcome highlights** → C7 (with **impairment category** added). The perspective tabs wrap rather than sitting in a fixed three-column grid.
- Two tag banks are now on the wire and editable: **C3 participation areas** (`participation_domains` — the participant's own selection; generation no longer overwrites it, and the counted NDIS-domain version was always separately available as `stats.domains`) and **C5 outcome tags** (`outcome_tags`). Both render on the locked snapshot.
- Snapshots now compile from **logs *and* check-ins** (`generated_from_checkins`, populated; the "Check-ins" tile shows the real count). `canApproveSnapshot` accepts either as evidence — Template C is "generated from Template A and B logs", so a participant who wrote check-ins through a month nobody else recorded still has a month worth approving.

**The Monthly Relational Longitudinal Snapshot, built as the template specifies** (Jiten, 28 Aug: build to the document; where no document backs something, say so on the page rather than invent it).

It is **not** a second artefact. Its own Developer Instructions describe this record — "aggregate patterns from daily notes, preserve participant voice, track sustainability and recovery cost, support reassessment evidence" — and its section 2 asks Template C2's five questions in different words, its section 10 is C6 and its section 11 is C8. What it adds is sections 3–9. So it extends the one monthly record:

| Template section | Where it went |
| --- | --- |
| 1 Summary details | `participant_involvement` (new). Month, version and prepared-by already existed. |
| 2 Participant reflection | The existing C2 fields — the same five questions. Mapping recorded in `snapshot.js`. |
| 3 Participation and everyday life trends | `participation_trend_tags` (15) + `participation_trends_summary` |
| 4 Ongoing functional barriers | `barrier_tags` (13) + `barriers_summary` |
| 5 Support-mediated functioning | `support_mediated_tags` (14) + `support_mediated_summary` |
| 6 Fluctuation and context | `fluctuation_level` (4) + `fluctuation_influence_tags` (13) + `fluctuation_summary` |
| 7 Recovery and sustainability trends | `recovery_trend_tags` (11) + `recovery_trends_summary` |
| 8 Goal and participation mapping | `goal_mapping_tags` (13) + `goal_mapping_summary` |
| 9 Quality of life outcomes | `quality_of_life_tags` (12) + `quality_of_life_summary` |
| 10 Non-linear functioning statement | The existing `nonlinear_statement` (C6). |
| 11 Participant voice and approval | `approval_statements` (5), beside the existing approval and addendum. |

- Migration `20260828080149_monthly_relational_snapshot` — 17 additive nullable columns, no data touched.
- `SNAPSHOT_RELATIONAL_SECTIONS` in `packages/shared/src/snapshot.js` carries each section verbatim, including its **examples** and its **`note`** — the template's own reason for the section existing. Both render; they are what keeps the wording from drifting clinical.
- `RelationalSections.jsx` renders them on the snapshot review and, read-only, on the locked snapshot. A section nobody used is not drawn on the locked view.
- Validation is shared: each bank only accepts its own keys (a barrier tag in the fluctuation bank is a 400), and the single-choice fields only their own four.

**Verified end to end** with a throw-away participant account through the real sign-up API — check-in create/list/filter/read, its validation rules, the missing PATCH, cross-account 404s; then a snapshot compiled from check-ins alone, every Template C and relational field saved and read back, wrong-bank and duplicate options refused, recompile leaving the participant's words and selections intact, approval locking it, and the locked record refusing edits. Account and all its rows removed afterwards (`apps/api/scripts/cleanup-verify-account.ts`).

## 10. The three gaps, built (28 Aug 2026, afternoon)

Jiten's ruling for the round: build to the documents; where no document backs a piece, say so on the page rather than invent it. Lovable's `routeTree.gen.ts` (28 Aug) gave the route map but no page content — it confirmed `/participant/check-ins` (same path as ours), `/participant/concerns`, `/participant/support-fit`, that **Mandatory Policies** is `/library/policies` (a Library topic, not a screen) and that **Improvement & goal mapping** has no route at all on their side.

### 10.1 External access layer — snapshot share links (Template C9)

The last purely-engineering gap. Template C9: "exported as a PDF and shared with: NDIS planner or LAC · Support coordinator · Allied health professional · Tribunal or review process · Kept private … Sharing requires explicit participant consent. The participant controls who receives this document. TMG180 cannot share this document without participant approval."

- **`tmg_snapshot_share_links`** (migration `20260828083553_share_links_and_concerns`): one row per link — snapshot, participant, SHA-256 of the token, C9 audience, allow-download, status, expiry, open count. The token is shown once, in the URL, at creation; it is not stored and cannot be shown again.
- **Rules:** only a locked snapshot; only while the `allow_share_links` preference is on (it was stored-not-acted-on since 19 Aug; now acted on, and its `pending` flag is gone); "Kept private" is refused as a link; 7/30/90 days, default 7 (the preference's own copy). Revocation is final; a new link is a new row.
- **Every open is recorded** — `snapshot_link_opened` in `tmg_audit_log` with no actor, plus `snapshot_link_created` / `_revoked` under the participant (both now on the Privacy & Sharing audit log). The participant reads them back as the **Access Log** on Snapshot Exports.
- **Public end:** `GET /api/v1/public/snapshot-share/:token` — the only unauthenticated route under `/api/v1`. A link that never existed, one that expired and one that was revoked all get the same 404 with the same words. Web: `/share/snapshot/:token` (`SharedSnapshot.jsx`, no chrome) — the participant's name, the month, who the link was for, the counts, areas of daily life, Goal Link Helper roll-up, every Template C layer and the relational sections, the non-linear statement, addenda; Download only if the participant allowed it.
- **Participant end:** `shareLink.controller.ts` + `shareLink.route.ts`; `SnapshotExports.jsx` rewritten — the panel is live (audience, expiry, download toggle, create → URL shown once with Copy, active links with Revoke, past links), `?snapshot=` preselects, "Link active" badge is now true when it says so; the locked snapshot's two dead buttons open Exports at that month; Privacy & Sharing's rail lists the open links.
- `services/snapshotRead.ts` now holds the wire↔column maps for all three snapshot readers (participant, share link, and — unchanged — the consented worker), so a Template C field is added once.

### 10.2 Raise a concern (Mandatory Policy 2, M-05 participant side)

The admin "Incidents" screen was a mock with hard-coded numbers; nothing in the API knew the word. Built from Policy 2 ("Complaint ticket; response record; referral/escalation record"), with Policy 3's incident vocabulary and Policy 10's report pathway:

- **`tmg_concerns` + `tmg_concern_responses`** — append-only. The raised ticket is never edited; everything after it is a stamped response row. Kind (concern / complaint / feedback — Policy 2's definitions verbatim), category (Policy 2's "expected to raise" list + discrimination + information handling), relates-to (platform / support delivery / not sure — the boundary check is governance's, not the form's), optional "about", the words, optional "what would help". Status: received → acknowledged → being looked at → responded → referred on → closed, from "How Complaints Are Handled".
- **Participant:** `/participant/concerns` list, `/new` form, `/:id` thread with a follow-up box while open. The no-retaliation lines and the three external bodies are on every one of the three screens, verbatim, never behind the form — Policy 5: "does not discourage or restrict external complaints".
- **Governance API:** `GET/PATCH /admin/concerns` — respond, move status, refer, close; first acknowledgement and closure stamped once. **The admin UI is still the mock** — the endpoints exist for it, the screen has not been rewired.
- **Said on the page, not built:** response timeframes. The register puts "taxonomy + statutory clocks" before M-05 and neither has arrived; the form says the timeframes "are set by governance and have not yet been published".

### 10.3 Autonomy & support fit check

Named in the 23 Aug register as a Core Library tool; no question set exists in any document. `/participant/support-fit` says what the check is for — from the Governance Manual ("A worker may be competent and still not the right relational fit"; the §7 choice-and-control definition), the Legislative Alignment Map (s 4 "worker fit tools", s 17A "fit and reflection standards") and Policy 5's rights list — says plainly that the questions have not been delivered, and points at the four parts of the portal that already do some of this (About You, Safety & Support Preferences, the directory's relational fields, Raise a concern). No questions invented.

### 10.4 Library — filled from the documents

Ruling #8 (Governance Administration wording in policy text) was resolved by the 28 Aug ruling: publish as written, say what it is. **Mandatory Policies 2, 3, 4, 5 and 10** are published verbatim (`participantLibraryContent.js`; each drops only the audit-controls table and the two header cells) with a **Working draft** chip and the manual's own status line on the reading — "Requires legal review, terminology review and source-currency review before formal adoption". The Library now groups by the Instructions.pdf topic pages that the delivered documents can fill — Mandatory Policies · Templates & How-to Guides · How TMG180 is governed — with `?topic=` for the sidebar's **Mandatory Policies** entry. New readings: *How the evidence templates work* (Longitudinal Evidence Templates v2.0 front matter, tone rules, C9), *What the Monthly Snapshot is for* (the monthly template's Purpose + non-linear statement), and in Optional Reading the goal mapping examples (Master Map #9), the AI Governance Register and the Governance Architecture. Practice Standards, Support Interpretation and Relational Discipline are in the IA but their manuals are not on disk; they are not listed as empty shelves.

**Verified** with two throw-away accounts through the real API (34 checks): share before approval 400, preference-off 403, private audience and bad expiry 400, create 201 with a 43-character token, two public opens 200 with the participant's words, malformed/bogus/expired-or-revoked tokens all the same 404, double revoke 409, foreign ids 404, no token 401; concern validation 400s, raise 201, follow-up 201, governance respond/refer/close with the stamps, follow-up on closed 409, participant on `/admin` 403. Both accounts and every row they owned removed afterwards.
