# TMG180 Goal Linking Helper — Developer Spec One-Pager v1.1 (2026-06-03)

> Source: `TMG claude demand docs/TMG180_Goal_Link_Helper_Developer_Spec_One_Page_v1 1.docx` — text extracted verbatim on 2026-08-27 (docx via document.xml, pdf via pdftotext). Table cells appear as `| `-separated runs; `☐`/`⬜` mark checkbox options. Read the source file for layout.


TMG180 — Goal Linking Helper (Bucket + Goal + R&N)
Developer Spec One‑Pager v1
Date: 2026-06-03
Purpose
Make it easy for workers (and participants) to link supports to participant goals and ‘reasonable & necessary’ framing without diagnosis‑led language. This is guidance for tagging logs and generating clearer monthly summaries.
Core concept
Every Support Evidence Log must link to: (1) at least one participant goal, and (2) a budget bucket (Core/Capacity/Capital).
Optional: add 1–2 R&N rationale tags (plain-language) to support monthly snapshot exports.
Monthly snapshot export rolls up: supports used → goal links → functional barrier → outcomes over time.
Reference data to load
Load the Goal Link Helper table as reference data (CSV/XLSX provided):
TMG180_Goal_Link_Helper_Table_v1 (support_domain_code, domain, TMG functional grouping, default bucket, goal link prompts, functional barrier prompts, R&N rationale tags).
Use as autocomplete suggestions; do not force perfect matches.
UI changes (minimal)
In Support Evidence Log form: add fields: goal_ids[] (multi-select), ndis_bucket (Core/Capacity/Capital), rn_rationale_tags[] (multi-select, optional), tmg_functional_grouping (select, optional).
Defaults: if tmg_functional_grouping selected, prefill suggested ndis_bucket_default and suggested rn_rationale_tags.
Allow user override of bucket and tags (audit: store what was selected).
Schema / DB changes (minimal)
Add table: tmg_goal_link_helper (load from CSV/XLSX).
Add columns to support_event_logs: goal_ids (array FK), ndis_bucket, rn_rationale_tags (array), tmg_functional_grouping_code.
Optional: add foreign key to participants_goals table if goals are stored separately.
Export / monthly snapshot logic
Monthly snapshot export includes a section: ‘Supports used this month’ grouped by bucket (Core/Capacity/Capital).
For each bucket: list top goal links and 2–3 functional barrier phrases + outcomes markers.
Use the selected rationale tags to produce non-shaming ‘why this remains needed’ sentence stems.
Important boundaries
Do not require diagnosis fields for mapping.
Goal links do not need rigid one-to-one mapping; multiple supports can link to the same goal and goals can evolve.
Use function-first wording from the helper table and your Translator/Improvement tables; avoid clinical/shaming language.
