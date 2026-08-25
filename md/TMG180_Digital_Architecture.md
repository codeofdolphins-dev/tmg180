# TMG180 Digital Architecture

Converted from `TMG180 Digital Architecture.docx` (received 2026-08-25, `TMG Docs latest/`). **Nature of this document**: it is an AI-conversation extract — an assistant's consolidated answer ("Looking across this entire thread…") capturing the recurring architecture across Sue/Saf's design threads. It is context and rationale, not a signed canonical build order; where it overlaps the [Longitudinal Spec](TMG180_Longitudinal_Spec_2026-08-25.md), the spec governs. It cites two documents we have never received: `TMG 180 INTERNAL GOVERNANCE REPORT copy copy.docx` and `TMG180_NDIS_Support_Interpretation_Manual_Reasonable_and_Necessary_WORKER_FACING.pdf` — chase with Saf. The source's own numbering skips section 8; mirrored as-is.

## 1. The overall purpose of the technology

TMG180 was not conceived primarily as a piece of software or simply a worker marketplace. The technology exists to provide infrastructure around an independent participant–worker relationship while preserving: participant autonomy and voice; independent-worker autonomy; governance and accountability; safeguarding; longitudinal understanding; privacy; evidence; and human/relational context.

The recurring architectural problem: *how can legislation, governance, relational/human-centred practice, independent work, participant choice, documentation and technology operate as one coherent system without one layer overriding the others?* The Internal Governance Integration Report describes the same development problem — normally separate domains (NDIS legislation, compliance, psychosocial frameworks, community-sector practice, digital infrastructure, AI, human rights, operational support) translated into one operational system.

## 2. The recurring architecture

```
PARTICIPANT
    │
    ├── Profile / lived context
    ├── Goals
    ├── Preferences / voice
    └── Functional impacts
             │
             ▼
      SUPPORT RELATIONSHIP
             │
    ┌────────┴────────┐
Participant       Independent
direction           worker
    └────────┬────────┘
             ▼
       SUPPORT DELIVERY
             ▼
      DAILY EVIDENCE
             ▼
  LONGITUDINAL EVIDENCE
             ▼
     MONTHLY PATTERNS
             ▼
     PROGRESS / OUTCOMES
             ▼
      PLAN-REVIEW EVIDENCE
```

Surrounding that operational pathway:

```
┌──────────────────────────────────────────────┐
│             GOVERNANCE LAYER                 │
│ Legislation │ Privacy │ Safeguarding         │
│ Choice      │ Rights  │ Worker boundaries    │
│ Compliance  │ Audit   │ Relational practice  │
└──────────────────────────────────────────────┘
┌──────────────────────────────────────────────┐
│             TECHNOLOGY LAYER                 │
│ Database │ Permissions │ Workflows │ AI      │
│ Audit    │ Overrides   │ Templates │ Library │
└──────────────────────────────────────────────┘
```

## 3. Participant Profile as the starting context

A participant should not have to start from zero in every interaction. The Profile provides persistent context (goals, functional impacts, communication preferences, strengths, support needs, circumstances, preferences, voice). Its purpose isn't to reduce the participant to structured fields — it gives the rest of the system context, because the same visible support activity can mean completely different things for different participants. The Support Interpretation Manual's evidence chain became an organising principle of the data architecture: **impairment → functional impact → support need → support provided → outcome or maintenance over time → participant voice**.

## 4. Daily evidence

Daily support notes aren't intended to become lengthy clinical case notes. They record sufficient structured evidence of: *what was happening → what support was needed → what support occurred → what did the participant say → what changed / was maintained*. This lets individual support interactions become usable evidence without requiring workers to write assessments or make diagnoses. Participant voice and worker observation must not silently become the same thing — the worker records what they actually observed and what the participant actually communicated.

## 5. Longitudinal architecture

One note is a transaction; many notes across time become longitudinal evidence (days → monthly picture → patterns over time → change / stable / fluctuation). That matters particularly for psychosocial disability, fluctuating capacity, executive-function difficulties, chronic conditions, fatigue, trauma-related functional impacts, non-linear recovery. Purpose is not surveillance but continuity, understanding, contextual clarity and reduced fragmentation.

## 6. The AI layer

```
SOURCE DATA (participant + worker + governance)
        ▼
   AI ASSISTANCE  (organise · draft · identify patterns)
        ▼
   HUMAN REVIEW
        ▼
   FINAL RECORD
```

AI can help organise information, draft summaries, surface longitudinal patterns, maintain terminology, connect information across structured records, reduce repetitive admin, assist interpretation, support consistent workflows. It does not replace participant voice, worker judgement, professional assessment, safeguarding decisions, NDIA decisions, or governance responsibility. AI is subordinate to human oversight.

## 7. Schemas, seed bundles and controlled content

The system can't consist of editable pages of text; some concepts need structured data and controlled relationships (schemas, IDs, relationships, seed bundles, controlled terminology, versioning, references, dependencies). Principle: human-readable content → structured concepts/IDs → feeding UI, workflows, AI instructions, evidence and governance — never `DELETE support_type_17`. Preserves referential integrity, audit history, historical records, evidence meaning, governance traceability: *the current system can change without rewriting what the historical system meant at the time.*

## 9. Governance as architecture rather than paperwork

Governance isn't a PDF beside the software — it is translated into system behaviour: governance principle → operational interpretation → platform rule → workflow → user action → record/evidence → auditability. "Participants have choice and control" must influence permissions, profile ownership, worker interactions, consent, documentation, editing, complaints, service relationships, AI behaviour and evidence — not just sit in a policy.

## 10. Relational governance

Structure without removing context. TMG180 deliberately holds pairs often treated as opposites: participant autonomy ↔ safeguarding; worker independence ↔ accountability; human context ↔ structured evidence; choice ↔ boundaries; flexibility ↔ governance; relational practice ↔ compliance; AI assistance ↔ human oversight; longitudinal understanding ↔ privacy. A "relationally governed middle-ground operational model."

## 11. Independent-worker architecture

TMG180 must not accidentally become an employment architecture. Intended: participant ↔ independent worker ↔ TMG180 infrastructure — never TMG180-employs-worker-assigned-to-participant. Workers remain self-employed, keep their ABNs, operate their own businesses, engage participants directly, manage their own delivery, retain professional/legal responsibility. "Governance-supported operational infrastructure", not labour management. This affects database relationships, wording, workflows, permissions and governance.

## 12. Worker Library as an interpretation layer

The library performs translation: legislation → governance → TMG180 interpretation → Worker Library → everyday worker decision. Resources include Choice & Control guidance, Reasonable & Necessary interpretation, relational practice, documentation guidance, governance-in-practice, safeguarding, privacy, operational material. The R&N manual translates s34 criteria into ordinary worker questions ("What disability-related barrier is this support responding to?"). Purpose: confidence through understanding rather than compliance through fear.

## 13. Participant evidence architecture

Personal Profile → Goals → Daily Support Evidence → Monthly Longitudinal Summary → improvement/maintenance/barriers/fluctuation → Progress Report → Plan Review. Key concept: **improvement with support does not mean disappearance of impairment**. The architecture can demonstrate simultaneously: impairment remains + support works + participation improves + support requirements evolve. That is why longitudinal data beats isolated snapshots.

## 14. "The system holds the memory"

The participant shouldn't have to reconstruct their entire life every time someone asks for evidence; the worker shouldn't have to remember six months of interactions; the monthly summary shouldn't invent a narrative; the AI shouldn't invent context. Instead: participant contributes voice · worker records support · system preserves history · AI assists organisation · human verifies interpretation · longitudinal layer reveals patterns. **The system holds the memory without owning the person's story.**

## 15. The recurring problem TMG180 is attempting to solve

Legislation, governance, participant voice, worker practice, psychosocial context, evidence, technology, safeguarding and human rights are traditionally fragmented; TMG180 attempts to hold HUMAN + GOVERNED + DIGITAL together in support of real support.

## 16. The strongest recurring design principles

1. Participant voice remains the primary human context.
2. Workers remain independent rather than becoming platform-controlled labour.
3. Governance is implemented through systems, not merely policies.
4. Relational practice and compliance are designed to coexist.
5. Evidence accumulates longitudinally rather than relying on snapshots.
6. AI assists humans; it does not become the authority.
7. Historical data is preserved rather than silently rewritten.
8. Structured schemas connect content, workflows and governance.
9. Worker guidance translates complexity rather than expecting workers to become compliance experts.
10. Technology should reduce administrative and interpretive burden, not add a layer of it.
11. Functional evidence is more useful when connected to context, support and outcomes.
12. The ecosystem should accommodate change and fluctuation rather than assuming people are static.
13. Human judgement remains necessary where context matters.
14. Auditability should coexist with dignity and privacy.
15. The platform provides infrastructure rather than taking ownership of participant–worker relationships.

The document closes proposing a consolidated **TMG180 Architecture & Design Decision Record** extracted from the conversational threads, so the reasoning architecture survives even when old AI threads disappear.
