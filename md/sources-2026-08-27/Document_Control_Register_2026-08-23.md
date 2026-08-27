# TMG180 Document Control Register & Path to Finish (23 August 2026)

> Source: `TMG claude demand docs/TMG180_Document_Control_Register_2.docx` — text extracted verbatim on 2026-08-27 (docx via document.xml, pdf via pdftotext). Table cells appear as `| `-separated runs; `☐`/`⬜` mark checkbox options. Read the source file for layout.


TMG180
Document Control Register & Path to Finish
Prepared 23 August 2026 · For Saf, the development team (Deb, Zain, Jiten) and Sue Lowdon
1   Where things actually stand (plain English)
You are much further along than the pile of documents makes it feel. Here is the honest position.
Design: done. The canonical Figma file ("TMG" — v2 pages + corrected live frames) reflects every current ruling. All banned terms are cleared from participant screens, the 22 missing/corrected frames are built and prototype-wired, and the archive page holds the 59 dead drafts. The June designer briefs did their job — they are now history, not instructions.
Specs: done and consolidated. Every open design question has been ruled on. The Master Implementation Mapping v2.0 (23 Aug) is the single register tying it all together, including which older instructions are dead.
Code: mid-build, unblocked. Deb is mid-way through the Dev Unblock build order (auth/M-01). Nothing in the build order is waiting on a decision. The Worker Profile component is delivered.
Legal: one determination outstanding. The NDIS Act review confirmed the architecture is right; the only launch-gating legal item is confirming TMG180’s status under the digital-platform registration rules (because it doesn’t process payments). That is a Saf/Sue task with a lawyer — the developers just keep the payment red line.
The reason everyone feels lost is simple: the pile contains three generations of documents (June drift-fix era → July override era → August build era), and the older generations still look authoritative. They aren’t. The register below settles it.
2   The document register — every document, classified
Status key:  BUILD FROM — current authority, developers work from this.  REFERENCE — still true, background/canon only.  ARCHIVE — superseded, keep for audit trail only.  TOOL — a product feature prototype, not a spec.
BUILD FROM — the current working set
Document
	| Date
	| Who uses it
	| Why it’s current
	| Master Implementation Mapping v2.0
	| 23 Aug
	| Everyone — start here
	| Consolidated register: authority stack, supersession table, build register, Figma links, delivery gates
	| Dev Unblock Specification (+ 7 Aug F-rulings)
	| 6–7 Aug
	| Deb, Zain, Jiten
	| Current build authority — schemas, R-01–R-09 rulings, build order
	| Final Override v1.1 bundle (schema patch, seed bundle, UI copy CSV, dev spec)
	| 8 Jul
	| Deb, Zain, Jiten
	| The migration, seed data and copy overrides the build order starts with
	| Worker Profile Spec & Review (+ WorkerProfile.jsx, tokens.css)
	| 7 Aug
	| Deb, Zain, Jiten
	| Component contract for the worker profile — delivered code
	| v2 Figma Build Record
	| 12 Aug
	| Devs + Sue
	| What the canonical Figma file contains, incl. canon corrections
	| Canonical pack (FCA Intake, Daily/Monthly Casenotes, Linking Spec, schemas, Postgres seed, policies…)
	| various
	| Devs, on field-level questions
	| Canonical wherever the newer docs are silent
	| NDIS Act Review — Developer Implications
	| 23 Aug
	| Devs (L-series) + Saf/Sue
	| The legal layer: payment red line, plan context, M-05/M-06 requirements
	| REFERENCE — true, but not a work instruction
Document
	| Status note
	| Developer Technical Brief
	| Still fully current — the platform "constitution" for developers: boundaries table, evidence chain, AI rules, privacy layers, escalation triggers. Every new developer reads this once, first. It never conflicts with the August docs.
	| Governance Architecture Development & Rationale Manual v1 (Jun)
	| Sue’s governance manual. Current, with one known gap: it understates the built worker verification/activation gate, and its legislative references need the 2026 additions (see Sue’s legislation update).
	| Legislative Alignment Map (Jun)
	| Correct as far as it goes, but built on s 34 alone. Sue’s legislation update contains the extended 2026 version, ready to fold in.
	| UI Drift Fix Pack v1 + Exec Summary + Instructions JSON/PDF (6 Jun)
	| The constitutional no-messaging / no-matching / no-marketplace decisions — still binding as boundaries. But its exact UI strings (e.g. "Personal Profile (FCA baseline)", "TMG180 Governance Admin", 5-tile dashboard) were later overruled — strings come from the Aug docs only.
	| NDIS Act alignment review ("NDIS and TMG180", 23 Aug)
	| Source legal analysis — already translated into the Developer Implications doc; nobody needs to work from the raw review.
	| Canon checklist (~Jul)
	| Its verdict ("no major piece missing") stands. Two items carry into the action plan: (a) the Participant Autonomy & Support Fit Check and Worker Burnout/Rescue Mode Check as Core Library tools; (b) confirming technical ownership/handover — repo, hosting, database, domain/DNS, backups.
	| ARCHIVE — superseded; do not hand these to anyone
Document
	| Superseded by
	| Designer Correction Brief v2
	| v2.1, then the August documents
	| Designer Correction Brief v2.1 — both copies ("F" and "F2" are the same document)
	| Design work is complete. Its still-valid rules live on in the Drift Fix boundaries and the Master Mapping; its exact strings are partly overruled (SR-01–SR-09)
	| Designer Reference Guide HTML
	| Interactive version of v2.1 — same status. Handy format, wrong strings (5 tiles, FCA-baseline nav label, Governance Admin title). Archive, or rebuild from the Master Mapping later
	| Handoff & Implementation Mapping v1.1 (8 Jul)
	| Master Implementation Mapping v2.0 — its P-register carried over item-for-item
	| TOOLS — product features, not specs
File
	| What it is
	| Where it fits
	| TMG Language Translator Agent (.jsx)
	| Worker/coordinator-facing AI tool: translates participant words into NDIS functional language via a 23-entry translator table
	| Future feature — worker Library / AI-assist layer (backlog). Before it ships it must be rewired through a governed backend endpoint: the current file calls the AI API directly from the browser, which breaks the Technical Brief’s rule that identifiable data only touches governed AI endpoints
	| TMG My Words, My Way (.html)
	| Participant-facing version of the same translator, warm plain-language UI
	| Same status, same rewiring requirement. Both are strong assets — they’re just not part of the current build order
	| 3   The answer for the developers — exactly four documents
Deb, Zain, Jiten: close everything else. Your working set is:
#
	| Document
	| How to use it
	| 1
	| Master Implementation Mapping v2.0
	| Open first, always. Section 3 (supersession register) stops you building June-era mistakes; Section 2 has every Figma link.
	| 2
	| Dev Unblock Specification (6 Aug)
	| The build authority. Work the build order: ① profile sections ② M-01 auth ③ M-04 check-in ④ two-layer logs + consent middleware ⑤ admin aggregates ⑥ directory.
	| 3
	| Final Override v1.1 bundle
	| Run the migration, load the seed, apply the copy CSV. (The bundle’s four files — not the v1.1 handoff document around them.)
	| 4
	| Worker Profile Spec & Review (7 Aug)
	| The delivered component and its data contract.
	| Two documents to read once for context, never as instructions: the Developer Technical Brief (the boundaries you must never cross — plus one addition from the legal review: never build anything that touches NDIS payment money) and the NDIS Act Review Developer Implications (the L-series items that shape the M-05/M-06 backlog).
If a document isn’t in this list and seems to say something different — it’s superseded. Check the supersession register, then ask Saf only if it’s genuinely not covered.
4   Saf’s path to finished — in order
This week
1.  Send the developers Section 3 above (or just the Master Mapping + this register). Tell them: the four documents, the build order, nothing else.
2.  Send Sue her legislation update (separate document, prepared alongside this one) and ask her to close the two items queued since July: the two registration consent strings for M-01, and the ruling on the two additive profile sections (Learning & Employment; My Support Network).
3.  Book the legal consult for the 0137 digital-platform determination — the only item that can genuinely hold up launch, and it runs in parallel with the build.
While the build runs (order #1–#6, nothing blocked)
4.  Confirm technical ownership with Deb: repo admin, hosting accounts, database host, domain/DNS, backup/export process. The canon checklist flagged this and it is still open — it protects Sue’s ownership position.
5.  Move the Figma file into your Pro team permanently (Starter caps still apply to the current location).
6.  With Sue: update the Governance Architecture Manual to document the built worker activation gate (verification, expiry monitoring, 80-question/80% onboarding) — audit gold the manual currently doesn’t show.
After build order #6 (backlog, specs first)
7.  M-09 Consent journey → M-10 Snapshot approval → M-06 Invoices (plan-context fields + payment red line) → M-05 Incidents (taxonomy + statutory clocks). Then the Library tools (Autonomy & Support Fit Check, Burnout/Rescue Mode Check) and, when ready, the two Translator tools via a governed AI endpoint.
Launch gates
From the Master Mapping §5: migration + seed evidence · copy sweep clean · ownership-string grep · structural-negatives review · screenshot pack · Sue’s sign-off — plus the 0137 determination in hand.
That’s the whole path. No new documents are needed to finish TMG180 — only the ones above, in the order above.
