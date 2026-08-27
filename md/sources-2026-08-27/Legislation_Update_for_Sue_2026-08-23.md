# TMG180 Legislation Update for Sue (23 August 2026, from Saf)

> Source: `TMG claude demand docs/TMG180_Legislation_Update_for_Sue.docx` — text extracted verbatim on 2026-08-27 (docx via document.xml, pdf via pdftotext). Table cells appear as `| `-separated runs; `☐`/`⬜` mark checkbox options. Read the source file for layout.


TMG180
Legislation Update for Sue
Plain-English summary of the 2026 NDIS Act review · Prepared 23 August 2026 · From Saf
1   The headline, first
An independent legal alignment review compared TMG180’s full document suite — governance, architecture, policies, privacy, worker practice — against the NDIS Act as it stands in 2026. Its conclusion is worth quoting close to verbatim, because it’s the strongest external validation TMG180 has received:
"TMG180 is not working against the Act. Its central architecture expresses the Act’s human-rights purpose unusually well… The remaining work is identifiable and containable. It does not require rebuilding the relational concept."
Everything you designed TMG180 around — participant authority, supported decision-making, dignity and privacy, reasonable risk, accurate contextual evidence, human control over AI — the review found reflected not just in the philosophy but in the built platform. The worker verification and activation gate (the document checks, expiry monitoring, and the 80-question onboarding with an 80% pass mark) was singled out as "significant evidence of alignment" once the reviewer understood it was already built.
Nothing in this update changes the design. It attaches the current legal machinery to the architecture that’s already there.
2   What changed in the legislation
Three changes in the 2026 framework matter to TMG180.
First, the Act now runs two plan frameworks side by side. Older plans still operate under section 34 (the "reasonable and necessary" test our documents are built around). Newer plans operate under sections 32C–32L, which introduce reasonable-and-necessary budgets, flexible versus stated funding, funding periods, and needs assessment. TMG180’s documents currently reference section 34 alone. Nothing we say is wrong — it’s just incomplete for participants on new-framework plans. Our interpretation material and the platform’s invoice records need to recognise both.
Second, section 10 now legally defines what counts as an "NDIS support". A support can connect perfectly to a participant’s goals and impairment and still not be an NDIS support in law. Our support-interpretation material should add this check so workers and participants aren’t caught out.
Third — and most important for us — from 1 July 2026, "NDIS digital platforms" must register with the Commission (registration group 0137) and be certified against the Core Module. The definition has several parts, but the decisive one is this: the platform must process NDIS plan money through the system.
3   The digital platform question — why TMG180’s model matters
TMG180 was deliberately built so that it never touches plan money. Workers invoice plan managers directly; TMG180 takes no percentage; no payment moves through the platform. Under the statutory definition, that very likely places TMG180 outside mandatory platform registration — a legitimate structural boundary, not a loophole.
Two things follow. We need a formal legal determination confirming this reading before launch — it’s the one genuinely launch-gating legal item, and I’m arranging the consult. And the boundary has to stay true and be described consistently everywhere: the platform’s code (the developers now hold this as a standing red line — no payment features, ever, without a legal ruling first), our terms, the website, and anything we say publicly. If TMG180 ever started processing payments, registration would almost certainly become mandatory, bringing the full registered-provider obligations with it.
The review also noted, fairly, that several of TMG180’s processes are currently written as principles rather than auditable procedures. That’s fine while we’re outside registration; it would need upgrading if we ever chose to register. That’s a future decision, not a present problem.
4   What needs updating in our documents (not the platform)
These are documentation tasks, mostly yours and mine — the platform itself doesn’t change.
The Governance Architecture Manual should describe the worker verification and activation gate in full — the document verification, the recorded issue and expiry dates, the expiry monitoring, and the 80-question onboarding assessment. The review initially marked worker screening as a gap and then withdrew that finding once the built controls were explained. Right now the manual understates what the platform actually does, which means an external reviewer reading only the paperwork would miss our strongest audit evidence.
The Legislative Alignment Map needs the 2026 additions — the extended table is in Section 6, ready to fold in.
The incident policy needs the statutory categories and clocks stated explicitly: most reportable incidents require notification to the Commission within 24 hours with follow-up within five business days; unauthorised restrictive practices generally within five business days unless harm occurred. And where a legal duty to report exists, our wording must say "must", not "may". The policy’s relational strength stays — this adds the regulatory floor beneath it.
Three wording refinements the review suggested, all sensible: consent language becomes "TMG180 does not rely on implied consent for sensitive participant information — express, recorded consent is required unless authorised or required by law" (rather than an absolute "consent must never be implied"); competence language makes clear a worker assesses their own competence and scope, never the participant’s capacity; and the least-restrictive-response principle carries a line confirming it never limits mandatory reporting or emergency response.
One dated item to know about, no action yet: from 1 January 2027, registered digital platforms must check and display worker banning-order status and verify claimed credentials. If we stay outside registration it doesn’t bind us — and our credential verification display already does most of it anyway.
5   The two small items still queued with you
While we’re here — the build has two items waiting on you, both quick: the two registration consent checkbox wordings for the Create Account screen (the Section 4 consent formulation above is the guide), and your ruling on the two optional profile sections (Learning & Employment as a twelfth section; My Support Network as its own section rather than folded into Decision Making). Both are one-line answers; the platform absorbs either decision at no cost.
6   Updated Legislative Alignment Map (2026 additions)
The existing map stands. These rows extend it:
Legislation / Principle
	| TMG180 Governance Response
	| Platform Evidence / Tools
	| NDIS Act s 10 — definition of an NDIS support
	| Support interpretation adds the legal check: is this support an NDIS support, not only goal-connected
	| Support Interpretation Manual update; worker attestation on invoices
	| NDIS Act ss 32C–32L — new-framework plans (budgets, stated vs flexible funding, funding periods)
	| Dual-framework interpretation: s 34 for old-framework plans, ss 32C–32L for new; plan context recorded, never adjudicated
	| Plan-context fields on service agreements and invoices; interpretation library update
	| Provider Registration Rules — NDIS digital platforms (group 0137, from 1 Jul 2026)
	| Deliberate structural boundary: no plan money processed through TMG180; workers invoice plan managers directly
	| Invoice-generation-only architecture; consistent boundary statements in terms, website and workflows; formal legal determination (pending)
	| Reportable incident rules — notification timeframes
	| Typed incident categories with statutory clocks; reporting never conditional on internal processes; "must" where a duty exists
	| Incident pathway (M-05) with 24-hour / 5-business-day tracking
	| Worker screening & credential display (registered platforms, from 1 Jan 2027)
	| Already exceeded in substance by the built activation gate; banning-order display only if registration status changes
	| Verification records, expiry monitoring, onboarding assessment records, credential status display
	| Privacy Act 1988 (APPs) + Notifiable Data Breaches — record continuity
	| Retention periods, export-before-account-closure, corrections preserve originals, governed legal-access path for sealed records
	| Account lifecycle controls; append-only records with addenda; audit logs
	| 7   What you don’t need to worry about
The review confirmed the things TMG180 deliberately does not do are correct boundaries under the Act, not gaps: we don’t determine what’s reasonable and necessary, we don’t make funding decisions, we don’t diagnose, we don’t supervise workers’ daily delivery, we don’t own participant goals, and we’re not party to every service agreement. The review’s words: "The architecture is right to preserve those boundaries."
The design is finished, the build is moving, and the law confirms the model. What’s left is the legal determination, a round of document updates we can do together, and your two one-line rulings.
— Saf
