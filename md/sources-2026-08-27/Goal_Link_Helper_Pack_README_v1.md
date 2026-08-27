# TMG180 Goal Link Helper Pack v1 — README (2026-06-03)

> Source: `TMG claude demand docs/TMG180_Goal_Link_Helper_Pack_README_v1.docx` — text extracted verbatim on 2026-08-27 (docx via document.xml, pdf via pdftotext). Table cells appear as `| `-separated runs; `☐`/`⬜` mark checkbox options. Read the source file for layout.


TMG180 — Goal Link Helper Pack v1 (What to Send)
Date: 2026-06-03
What this pack is
Reference data that helps workers link supports to goals using function-first groupings, an NDIS budget bucket, and R&N rationale prompts.
Files to send to developers
TMG180_Goal_Link_Helper_Developer_Spec_One_Page_v1.docx (implementation instructions)
TMG180_Goal_Link_Helper_schema_and_seed_postgres_v1.sql (creates + seeds the Postgres table)
TMG180_Goal_Link_Helper_Table_v1.xlsx (human-readable table for review)
(Optional) TMG180_Goal_Link_Helper_Table_v1_seed.json (if they prefer JSON import)
How it is used in the product
Support Evidence Log form adds: goal link(s), bucket (Core/Capacity/Capital), optional functional grouping, and optional R&N rationale tags.
Monthly export rolls up supports by bucket and shows which goals they supported and what outcomes changed/sustained.
Guidance only: user can override suggested bucket/tags; final choice remains the worker’s responsibility.
