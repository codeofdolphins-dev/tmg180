# SPEC-AI-1 — TMG Human-Centred / Embedded AI Agent Layer (AI-thread extract)

> Source: `TMG claude demand docs/SPEC AI human centered AI AGENTS copy.docx` — text extracted verbatim on 2026-08-27 (docx via document.xml, pdf via pdftotext). Table cells appear as `| `-separated runs; `☐`/`⬜` mark checkbox options. Read the source file for layout.


Yes — you can build an AI agent that fits TMG’s “human-centred + compliant + cyber-safe” approach, and then productise the same architecture for other businesses.

Your two new docs already describe the right direction: AI agents as internal business infrastructure, with governance, security, and workflow fit as the main differentiators, not “generic chatbots.”

Below is the developer-speak architecture I’d recommend for TMG first (then generalise), using current OpenAI agent tooling and the security guardrails you care about.  

SPEC-AI-1-TMG Human-Centred AI Agent

Background

TMG has a structured, relational compliance framework and a worker portal. Workers need help navigating policies, writing documentation in the correct tone, and staying compliant without the platform becoming corporate, surveillance-y, or prescriptive. Your goal is an internal agent that reduces admin load, improves consistency, and strengthens privacy/cyber posture by keeping knowledge use inside a governed environment.

Requirements

Must have
Secure internal agent (inside the worker portal) trained via retrieval over TMG docs (policies, guides, templates), not by dumping content into public tools.
RAG with citations: answers must quote/point to exact policy sections so staff can verify quickly.
Role-based access: worker sees only their own data; admin sees only compliance metadata (same rule as your platform).
Human-in-the-loop: agent assists; it does not make final decisions (especially in safety/escalation).  
Audit trail for agent usage: question, retrieved sources, generated output, actions taken.
Cyber controls aligned to OWASP LLM threats: prompt injection, sensitive disclosure, excessive agency, etc.  
Data control: do not use business data for model training by default; keep tenant-level controls.  

Should have
Tone enforcement: relational language style-guide baked into prompts + post-checks (no “non-compliant”, no shaming).
Document drafting helpers: daily note / monthly summary assistants that map to your templates but never overwrite locked records (addendum-only).
Policy change workflow: when policies update, the agent’s retrieval index updates + “delta training” module is suggested.

Won’t have (at MVP)
Autonomous actions like sending emails, filing incidents, publishing profiles, or “deciding” escalations.
Participant-facing agent (no participant portal/messaging drift).

Method

1) Build as a “Governed Agent Layer” inside TMG (not a standalone chatbot)

UI entry points (inside worker portal):
“Ask TMG” (knowledge assistant)
“Draft Daily Note” (guided drafting, session-linked)
“Draft Monthly Summary” (pull goals + session totals, suggest relational wording)
“Compliance check” (does this invoice/note meet required fields + tone? — non-punitive)

2) Core architecture (recommended)

Use OpenAI’s Responses API for agent-like interactions and built-in tool orchestration, plus the Agents SDK for structured workflows, tracing, and evals.  

Components
Agent Orchestrator (API service)
Accepts requests from worker portal
Enforces authZ, redaction, rate limits
Calls model via Responses API
Emits audit logs
Knowledge Store (RAG)
Document ingestion pipeline: policies/guides/templates → chunking → embeddings → vector store
Retrieval step returns top passages + metadata (doc, version, clause IDs)
Answer must include citations
Policy/Tone Guardrails
System prompt with “relational language standard”
Output checker:
blocks prohibited phrases
flags risky content (“medical advice”, “legal certainty”, “mandatory escalation”) for human review
Refusal behaviors for unsafe requests
Security Controls (LLM OWASP aligned)
Prompt injection protection: isolate retrieved content, never execute instructions from documents, tool allowlists  
Sensitive info controls: PII/PHI redaction before LLM, and post-generation checks
Excessive agency prevention: no tools that can “do” things until later phases (read-only + draft-only)  
Observability
Tracing for each run (model input/output, retrieved chunks, guardrail decisions), using Agents SDK tracing concepts  
Eval set: “golden questions” derived from your policies

PlantUML
@startuml
actor Worker
rectangle "TMG Worker Portal" as UI
rectangle "Agent Orchestrator API" as ORCH
database "Policy + Guide Corpus" as DOCS
database "Vector Store" as VEC
rectangle "OpenAI Responses API" as OAI
rectangle "Guardrails\n(tone + safety + PII)" as GUARD
database "Audit Log" as AUD
Worker -> UI : Ask / Draft / Check
UI -> ORCH : request (auth token)
ORCH -> GUARD : redact + validate
ORCH -> VEC : retrieve relevant passages
VEC -> ORCH : chunks + citations
ORCH -> OAI : generate answer w/ citations
OAI -> ORCH : draft + rationale
ORCH -> GUARD : output checks (tone/safety)
ORCH -> AUD : store trace + citations + result
ORCH -> UI : response (with cited sources)
@enduml
3) What the agent is allowed to do (Phase 1)

Read-only + draft-only.
It can: answer questions, draft text, suggest options, cite policy sections.
It cannot: publish, message, submit incidents, file invoices, change participant records.

This prevents “corporate drift” and reduces cyber risk (no excessive agency).  

4) Data/privacy posture
Keep business data inside your environment; use OpenAI API with “your data is your data” controls, and do not opt in to training.  
Minimise what is sent to the model:
redact names/addresses where possible
send only the minimum session context needed for drafting
Store outputs as drafts until the worker accepts.

Implementation

Step 1 — Define the first 3 “agent jobs” (TMG-specific)
Policy Navigator: “What do I do in scenario X?” with cited policy refs
Daily Note Draft Helper: convert bullets/voice dictation into your daily format + relational tone checks
Monthly Summary Draft Helper: pull goals from intake + session totals; draft non-shaming narrative

Step 2 — Build ingestion + retrieval
Convert your DOCX/PDF policy library into versioned HTML/Markdown
Chunk with clause IDs
Embed + store in vector DB
Implement “citation-required responses”

Step 3 — Add guardrails
Prompt template + relational style constraints
PII redaction + output scanner
Tool allowlist (no actions)

Step 4 — Add tracing + evals
Store every run trace + retrieved chunks
Build a test suite of 50–100 Qs drawn from policies, plus “red team” prompts

Step 5 — Roll out as “beta inside worker portal”
limited to a small set of workers
feedback loop in UI: “helpful / not helpful” + “policy mismatch” button

Milestones
M1: Knowledge Agent (read-only) — policy Q&A with citations + audit logs
M2: Daily Draft Helper — mobile-friendly, relational tone checks
M3: Monthly Draft Helper — intake + sessions auto-pull + export-safe drafting
M4: Compliance Check Helper — EARN-field alignment + gentle reminders
M5: Productisation — tenant onboarding, doc ingestion tooling, governance dashboard

Gathering Results
Reduction in time spent searching policy docs
Higher consistency of note tone and structure
Lower “missing required evidence” rate (without adding required fields)
Security validation against OWASP LLM risks checklist  

Two questions (so we lock the right architecture)
Do you want this agent hosted inside your existing backend (recommended), or as a separate service for easier reuse across other businesses?
What should the first agent job be for TMG: Policy Navigator or Daily Note Draft Helper?

If you answer those, I’ll produce a consolidated “SPEC-AI-1” doc in the same style as your developer backlog, plus a reusable “multi-tenant” variant for selling to other businesses.
Yes — and the way you’ve phrased it (“ethical, cyber-safe, real-life + compliance, embedded per business”) is exactly the right product boundary.

If you build the agent inside your existing backend, you get three big wins:
you can enforce your privacy + autonomy rules (no participant portal/matching drift) at the API layer
you can keep data handling consistent with your security posture
you can later “productise” it by turning your TMG knowledge into a tenant-specific knowledge pack rather than a generic bot

Below is a developer-speak spec for an AI agent that matches your stance.

SPEC-AI-1-TMG Embedded AI Agent Layer

Background

TMG already has a relational, non-shaming framework and a worker portal. Workers need help applying the framework in real scenarios (tone, documentation, boundaries, safety steps) while staying audit-ready—without creating a corporate surveillance system or turning TMG into a dispatcher. The agent must be secure-by-design and grounded in TMG’s own documents and language.

Requirements

Must have
Embedded inside existing backend (same auth, same RBAC/tenancy rules as the portal).
RAG (retrieval) over TMG knowledge with citations to policy/guide sections.
Draft-only + advice-only at MVP: can draft notes, explanations, and checklists; cannot publish, message, match participants, submit incidents, or change locked records.
Tone guardrail: enforce relational language standard; ban shaming/corporate phrasing.
Cyber guardrails aligned to OWASP LLM Top 10 risks (prompt injection, insecure output, data leakage, DoS, etc.).  
Data minimisation: redact/minimise sensitive details sent to model.
No training on business data by default using OpenAI API platform controls.  
Audit trail: store prompt metadata, retrieved chunks, citations, output, guardrail decisions.

Should have
Per-workflow agents (Policy Navigator, Daily Note Draft Helper, Monthly Summary Draft Helper).
Eval suite: 50–200 “golden” scenarios + red-team prompts; regression checks each release.
Policy versioning in the knowledge store; answers cite versions.

Won’t have at MVP
Participant-facing assistant.
Autonomous tools (emailing, booking, payments, publishing, escalation actions).

Method

1) Build as a “Governed Agent Service” inside your backend

A single internal service/module (same repo or a small internal service) that exposes endpoints like:
POST /ai/policy_navigator
POST /ai/daily_note_draft
POST /ai/monthly_summary_draft
POST /ai/tone_check

All endpoints require worker auth and enforce “worker can only access their own records.”

2) Knowledge architecture: “Tenant Knowledge Pack” (TMG now, other businesses later)

Even if you only have one tenant today (TMG), design it as:
KnowledgePack: a versioned set of documents + embeddings + guardrail rules + tone guide.
For other businesses later: you create a new KnowledgePack (their policies, their workflows, their tone, their compliance regime).

Key rule: the model is general; the business specificity comes from retrieval + guardrails + templates, not “fine-tuning everything.”

3) Retrieval + citations (RAG)
Ingestion pipeline:
DOCX/PDF → canonical text (Markdown/HTML)
chunk by clause/heading
attach metadata: doc_id, doc_version, clause_id, effective_date, policy_type
embed + store in vector DB
At runtime:
retrieve top chunks
generate answer that must cite those chunks (refuse if no relevant sources)

This is how you embed “real-life + compliance” safely: outputs are always grounded.

4) Guardrails (ethics + cybersecurity)

Input protection
Prompt injection handling: treat retrieved documents as data, never instructions (tool allowlist; no tool execution from doc text).  
Strip/replace personal identifiers where possible (participant names, addresses).
Rate limiting + token caps (DoS protection).  

Output protection
Tone filter:
ban terms like “non-compliant”, “failure to”, “zero tolerance” unless explicitly required by your policy
enforce relational patterns (“pause/decline is valid”, “not completed yet”)
Safety classifier:
if the question is crisis-level: return a structured “immediate safety steps” template + escalation pointers, no improvisation
“No action” enforcement:
outputs are drafts/checklists only; user must click “Apply” or copy manually (MVP)

5) Observability + audit

Store:
user id, tenant, workflow type
retrieved chunk IDs + versions
output
guardrail flags
user feedback (“helpful”, “policy mismatch”)

This becomes your “ethical accountability layer.”

Implementation plan (TMG first)

Phase 1 (2–3 agent jobs, highest value)
Policy Navigator (Q&A with citations)
“What do I do in this scenario?” → answer + policy citations + non-shaming language
Daily Note Draft Helper (mobile-friendly)
input: bullet points / voice transcript
output: a draft aligned to your daily template + tone check + “participant voice optional”
Monthly Summary Draft Helper
input: month + participant goals + session totals
output: non-linear progress narrative, contextual frequency/disruptions, ready to export

Phase 2 (compliance comfort, still non-corporate)
Compliance Check Helper
verifies required fields are present without adding new required fields
applies EARN rule: suggests optional fields but cannot force them

OpenAI implementation notes (current best practice)
Use Responses API as the primary primitive for new agent builds.  
Use OpenAI’s agent patterns/SDK for tool orchestration + tracing as needed.  
Keep “no training on business data” defaults enabled via OpenAI data controls.  

How this becomes a product for other businesses (without losing ethics)

You don’t sell “an AI agent.” You sell a Governed Agent Layer with:
tenant onboarding (their policies/templates)
their tone guide
their compliance rules
their cyber controls
their audit logs + eval suite

So each business gets their own embedded “real-life knowledge + compliance” system—exactly what you want.

Two decisions to lock (so your team doesn’t drift)
MVP is draft-only (no autonomous actions).
MVP is internal-only (worker portal), not participant-facing.

If you say “yes” to both, I’ll turn this into a contractor backlog like we did for the platform (epics/stories/acceptance criteria), including: ingestion pipeline, vector store, guardrails, audit logs, and the three TMG workflows
Yes — focusing on healthcare / care / high-compliance services and offering specialised, embedded, governed AI agents is a worthwhile direction if you stick to the model you described: tenant-specific knowledge + strong security + human oversight + auditability.

Why it’s worth doing (and why your differentiation matters):
These sectors have high documentation burden and high risk, so they value systems that are trustworthy, auditable, and safe-by-design (not “generic chat”). NIST’s AI RMF is explicitly about managing AI risks to build trust.  
Regulation is moving toward human oversight and risk controls, especially for higher-risk uses (EU AI Act highlights human oversight and risk classification).  
Security threats for LLM apps are now well-defined (prompt injection, sensitive disclosure, excessive agency, etc.), and being able to say “we build to OWASP LLM Top 10” is a real moat.  
Using the OpenAI API platform, you can keep a strong privacy posture (data not used for training by default, with enterprise controls).  

Now, here’s the contractor-ready backlog for building the AI agent inside your existing backend (TMG first), plus a “how to keep devs aligned” section that prevents drift.

Contractor Backlog — Embedded AI Agent Layer (TMG First)

Global Non-Goals (apply to every story)
No participant-facing agent
No matching / rostering / allocation
No autonomous actions at MVP (no sending emails, filing incidents, publishing profiles, editing locked records)
No “surveillance” outputs (no worker scoring, engagement dashboards)

Global Non-Functional Requirements
RBAC + tenancy enforced by backend (agent never bypasses existing rules)
Data minimisation + redaction before model call
Prompt injection defenses + tool allowlists (OWASP LLM Top 10 aligned)  
All answers must include citations to your docs (or refuse)
Full audit trail (inputs/outputs/retrieval/guardrail decisions)
OpenAI API data controls configured (no training by default)  

EPIC A0 — Foundations (Security, Audit, Guardrails)

Story A0.1 — Agent gateway inside backend

As the system, all AI requests go through a single internal gateway service/module.
AC
Endpoint(s) live behind existing auth
Worker requests are scoped to their worker_id / tenant
Rate limits + token limits applied per user

Story A0.2 — PII/PHI minimisation & redaction pipeline

As the system, we minimise sensitive information sent to the model.
AC
Configurable redaction rules (names, addresses, identifiers)
“Min context” mode used by default
Logs store hashed identifiers, not raw PII

Story A0.3 — Guardrail engine (input + output)

As the system, we block unsafe/inappropriate outputs and enforce relational tone.
AC
Prompt injection pattern handling (never follow instructions embedded in retrieved text)  
Output checks:
banned shaming terms list
“draft-only” enforcement language
safety escalation classifier routes to approved templates
Any guardrail trigger is logged

Story A0.4 — AI audit log + trace store

As the system, every agent run is auditable.
AC
Store: request type, redactions applied, retrieved chunk IDs, model output, guardrail results
Admin can view metadata only (consistent with your platform stance)

EPIC A1 — Knowledge Ingestion + Retrieval (RAG)

Story A1.1 — Document ingestion pipeline (versioned)

As governance, we ingest TMG docs into a canonical store.
AC
DOCX/PDF → canonical text (Markdown/HTML)
Version + effective date tracked
Clause IDs/anchors preserved where possible

Story A1.2 — Vector index build

As the system, we embed and index document chunks.
AC
Chunking strategy (by headings/clauses)
Metadata stored: doc_id, version, clause_id, policy_type
Rebuild job runs on doc updates

Story A1.3 — Citation-required retrieval API

As the agent, we retrieve relevant sources and cite them.
AC
Retrieval returns top chunks + metadata
If confidence low / no sources: agent responds “I can’t find that in approved sources” (no hallucinated policy)

EPIC A2 — Agent Job 1: Policy Navigator (Read-only Q&A)

Story A2.1 — 
/ai/policy_navigator

As a worker, I can ask scenario questions and get an answer with citations.
AC
Answer includes: “What to do” + “Why (policy refs)” + “Next step”
No legal/clinical certainty language
Must cite TMG sources or refuse

Story A2.2 — “Relational response templates”

As the system, scenario responses follow your tone.
AC
Approved response templates for: consent changes, ethical pause, speaking up, privacy boundaries
Banned phrasing list enforced

EPIC A3 — Agent Job 2: Daily Note Draft Helper (Mobile-first)

Story A3.1 — 
/ai/daily_note_draft

As a worker, I can paste bullets/voice text and get a draft aligned to the daily note template.
AC
Outputs structured to your daily format (checkbox themes + narrative)
Non-shaming, relational language
Does not auto-save to record (user must paste/confirm)

Story A3.2 — Tone check endpoint

As a worker, I can run a “tone check” on my draft.
AC
Flags judgement language
Suggests relational alternatives
Doesn’t add new required fields (EARN principle compatibility)

EPIC A4 — Agent Job 3: Monthly Summary Draft Helper

Story A4.1 — 
/ai/monthly_summary_draft

As a worker, I can generate a monthly draft from goals + session totals + key notes.
AC
Pulls intake goals (via backend fetch, respecting RBAC)
Summarises frequency/duration and non-linear progress respectfully
Participant voice is optional, never assumed

Story A4.2 — Export-safe drafting

As the system, drafts avoid risky claims.
AC
No clinical diagnoses
No “guarantees”
Clear, factual, contextual language

EPIC A5 — Compliance Helper (Non-corporate)

Story A5.1 — “Missing essentials” checker (gentle)

As a worker, I can see if a record is missing essentials without being shamed.
AC
Only checks existing required fields
Uses neutral language: “not completed yet”
No task lists generated

Story A5.2 — Policy update “delta guidance”

As governance, when policies change, the agent references the new version and suggests the delta module.
AC
Index rebuild on new versions
Answers cite current effective version by default

EPIC A6 — Evals, Red Teaming, Release Gates

Story A6.1 — Golden set evaluations

As the team, we run regression tests on common scenarios.
AC
100+ scenario prompts mapped to expected tone + citations
Tests fail if citations missing or banned terms appear

Story A6.2 — OWASP LLM Top 10 threat tests

As the team, we test prompt injection and data leakage patterns.
AC
Documented test suite for prompt injection, sensitive disclosure, excessive agency  

How to “teach developers” to stick to your ethics + model

This is the part that stops norm-defaulting. Make it process + gates, not persuasion.

1) Create a one-page “Agent Constitution” and enforce it in PRs

Non-negotiables (examples):
Draft-only at MVP
Citation-required outputs
No participant portal/matching
Relational language standard (banned phrases list)
Admin metadata-only visibility

PR gate: any PR that violates constitution fails review.

2) Add Definition of Done checklists (mandatory on every AI ticket)

A ticket is not “Done” unless:
RBAC enforced in gateway
Redaction applied
Retrieval citations present
Guardrails pass (tone + safety)
Audit log written
Eval tests updated/passing

3) Build the product as “knowledge packs” per business (your future model)

For any new business:
ingest their policies + templates
define their tone guide + banned terms
define their allowed workflows + no-go actions
generate a golden eval set from their real scenarios

That’s how you “embed real-life situations + compliance” per client, while preserving your values.

4) Use NIST AI RMF as your governance spine (simple version)

Adopt a lightweight RMF loop:
Map (context + intended use)
Measure (evals + incidents)
Manage (controls + updates)
Govern (roles + accountability)  

This keeps you credible in healthcare-style environments.
Prompt training helps, but it doesn’t solve the core problem you’re working on. Here’s the clean explanation you can hand to anyone.

Why prompt training doesn’t solve this

1) Prompting doesn’t fix bad problem framing

If someone starts with “build a chatbot / add features,” AI will happily generate plausible answers. But it won’t automatically discover:
the real workflow
the real harms
the real compliance intent
So you get fast output that’s still misaligned.

2) Prompting can’t replace tacit judgment

Human-centred, relational work includes tacit skills:
how shame shows up in language
when “pause/decline” is the safest option
what staff will bypass under pressure
what audits actually require vs what people think they require
You can’t “prompt” your way into lived understanding. AI can help articulate it, but it can’t create it.

3) Prompt training doesn’t prevent drift to norm defaults

Even well-meaning teams drift into familiar patterns:
portals, tasks, dashboards, inboxes
“more required fields” under compliance pressure
Prompting doesn’t stop that. It often accelerates it because AI generates those defaults quickly.

4) Prompting doesn’t manage risk

In high-compliance sectors, the risks are predictable:
hallucinated policy
prompt injection
sensitive data leakage
overconfident advice
accidental autonomy (“the agent did something”)
Prompting is not a risk control. Governance is.

Why method and governance 
does
 solve it

1) A method forces shared truth
A good method requires artifacts that align everyone:
Mission Promise Sheet (what you promise real people)
Reality Maps (validated frontline workflows)
Compliance Intent Matrix (intent → control → evidence → data minimisation)

This replaces opinions with traceability.

2) Governance prevents corporate creep

Governance creates hard guardrails:
Non-goals (no portal/matching/messaging/tasks/feeds)
EARN rule (no required field unless Evidence/Action/Reimbursement/Necessary)
Relational language standard (banned phrases + required tone patterns)

This is what stops the “default to norm.”

3) Release gates make it real

You don’t ship because it “sounds good.” You ship because it proved itself:
blocked-path demos (with a relational “Why”)
audit evidence logs exist
AI outputs cite sources or refuse
evals + security tests pass

This is how you scale quality without needing everyone to think like you.

4) Governance makes AI safe and useful

“Governed AI” means:
citations-required retrieval
draft-only by default
audit logs for every run
tool allowlists, redaction, injection defenses
That turns AI into an assistant that reduces burden without increasing harm.

The short line

Prompt training improves how people talk to AI. Method + governance improves what the system becomes.
In care and compliance contexts, only method + governance reliably prevents harm and drift.


