# Instructions (UI Drift Fix JSON, v1, 2026-06-06)

> Source: `TMG claude demand docs/Instructions .pdf` — text extracted verbatim on 2026-08-27 (docx via document.xml, pdf via pdftotext). Table cells appear as `| `-separated runs; `☐`/`⬜` mark checkbox options. Read the source file for layout.

{
 "version": "v1",
 "date": "2026-06-06",
 "source_of_truth": "FINAL FOUNDATIONAL PRECEPTS (TMG180)",
 "intent": "Align all UI/UX copy and IA to TMG180 being a relationally governed

digital support ecosystem and a custom-built digital workspace for self-employed
workers; participant choice and direct contact; platform governance metadata-only;
avoid provider/employer patterns and feature creep.",

 "core_positioning": {
   "one_liner": "TMG180 is a relationally governed digital support ecosystem: a

custom-built workspace for self-employed workers and a free participant portal for
longitudinal evidence.",

   "what_it_is": [
    "Digital workspace for self-employed independent workers (tools, templates,

governance structure).",
    "Participant-owned portal for baseline profile, check-ins, structured support

event logs, and monthly snapshots.",
    "Relational infrastructure grounded in dignity, autonomy, safeguarding, and

proportionate governance."
   ],
   "what_it_is_not": [
    "Not an NDIS provider for service delivery.",
    "Not an employer or roster/caseload manager.",
    "Not an automated matching or messaging platform by default."
   ]

 },
 "global_banned_terms": [

   {
    "term": "match",
    "reason": "Implies automated matching/coordination; TMG180 is filter/search +

direct contact."
   },
   {
    "term": "matches",
    "reason": "As above."
   },
   {
    "term": "matched",
    "reason": "As above."
   },
   {
    "term": "matching",
    "reason": "As above."
   },
   {
    "term": "caseload",
    "reason": "Employer/provider pattern; workers are self-employed."
   },
   {
    "term": "assigned",
    "reason": "Implies allocation by platform."
   },
   {
    "term": "tasks",
    "reason": "Provider portal productivity drift."
   },
   {
    "term": "action required",
    "reason": "Shaming/compliance enforcement tone; replace with non-shaming
status."
   },
   {
    "term": "care management",
    "reason": "Provider framing; replace with evidence/logging/workspace tools."
   },
   {
    "term": "programs",
    "reason": "Health app drift; use supports/resources."
   },
   {
    "term": "client",
    "reason": "Use participant."
   },
   {
    "term": "HIPAA",
    "reason": "US law; use Australian Privacy Act/APPs/NDB."
   }
 ],
 "preferred_replacements": [
   {
    "from": "match/matching",
    "to": "filter and find the right fit"
   },
   {
    "from": "caseload",
    "to": "participants I support"
   },
   {
    "from": "assigned",
    "to": "selected / chosen / linked"
 },
 {

   "from": "tasks",
   "to": "tools / steps"
 },
 {
   "from": "action required",
   "to": "needs review / due soon"
 },
 {
   "from": "intake",
   "to": "Personal Profile (FCA baseline)"
 },
 {
   "from": "care management",
   "to": "support evidence and workspace tools"
 },
 {
   "from": "programs",
   "to": "supports / resources"
 },
 {
   "from": "client",
   "to": "participant"
 },
 {
   "from": "HIPAA",
   "to": "Privacy Act 1988 (APPs) + Notifiable Data Breaches"
 }
],
"ui_copy_keys": {
 "nav.worker_portal": "Worker Workspace",
 "nav.participant_portal": "Participant Portal",
 "nav.directory": "Verified Profiles Directory",
 "nav.personal_profile": "Personal Profile (FCA baseline)",
 "nav.daily_log": "Daily Support Evidence Log",
 "nav.monthly_snapshot": "Monthly Snapshot Summary",
 "nav.checkins": "Check-ins",
 "nav.exports": "Snapshot Exports",
 "nav.library": "Library",
 "nav.policies": "Mandatory Policies",
 "nav.practice_standards": "Practice Standards (Best Practice)",
 "nav.support_interpretation": "Support Interpretation Manual",
 "nav.relational_discipline": "Relational Discipline",
 "nav.help": "Help Centre",
   "participant.directory.title": "Browse verified worker profiles",
   "participant.directory.subtitle": "Use filters to find the right fit. You choose who to
contact.",
   "participant.directory.contact_cta": "Contact (outside platform)",
   "participant.directory.contact_note": "TMG180 does not coordinate services.
Contact happens directly with the worker using their preferred method.",
   "worker.workspace.title": "Your self-employed worker workspace",
   "worker.workspace.subtitle": "Tools, templates, and governance structure--while
you keep independence and autonomy.",
   "worker.participants.title": "Participants I support",
   "worker.participants.subtitle": "Participant-owned portal records + your own
evidence logs (within your permissions).",
   "admin.console.title": "TMG180 Governance Admin",
   "admin.console.subtitle": "Platform-level verification metadata, policy versioning/
acknowledgements, and incident/complaint tickets. No service-delivery oversight.",
   "admin.compliance.rename": "Governance Standing",
   "admin.alert.critical.rename": "High priority governance item"
 },
 "library_information_architecture": {
   "tabs": [

    "Core Library",
    "Optional Reading (collapsed)"
   ],
   "topic_pages": [
    {

      "topic": "Mandatory Policies",
      "cards": [

        "Full manual (deep)",
        "Quick guide (if exists)"
      ]
    },
    {
      "topic": "Practice Standards (Best Practice)",
      "cards": [
        "Full manual (deep)",
        "Quick guide (if exists)"
      ]
    },
    {
      "topic": "Support Interpretation",
      "cards": [
        "Quick guide (handbook)",
        "Full manual (deep)"
      ]
    },
    {
      "topic": "Relational Discipline",
      "cards": [
        "Explainer (short)",
        "Full framework (deep)"
      ]

    },
    {

      "topic": "Templates & How-to Guides",
      "cards": [

        "How-to guides",
        "Templates"
      ]
    }
   ],
   "ai_retrieval_scope": "Core Library only (Optional Reading excluded)."
 },
 "acceptance_checks": [
   "No UI surfaces contain matching/requests/chat/caseload/task language.",
   "Participant directory is filter/search only; contact is outside platform.",
   "Admin console shows metadata-only (verification, acknowledgements, incident
tickets), not service delivery policing.",
   "Personal Profile is labeled 'Personal Profile (FCA baseline)' and includes boundary
microcopy 'not a provider intake'.",
   "Optional Reading is present but collapsed and excluded from AI retrieval."
 ]
}
