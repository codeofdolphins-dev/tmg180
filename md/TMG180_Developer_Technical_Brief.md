## TMG180 Developer Technical Brief

*Platform Build Reference — Legislative Alignment, Feature Rules & Architectural Boundaries*

| **READ FIRST** | This brief exists because TMG180 is a legally and governance-anchored platform — not a generic SaaS product. Every feature you build sits inside a compliance framework. Some design decisions look optional but aren't. This document tells you which ones, why they exist, and what the platform must produce to be defensible. |
| --- | --- |

### 1. What this platform actually is

TMG180 is a relationally governed digital support ecosystem built for the NDIS (National Disability Insurance Scheme). It is not a provider, not an employer, not a marketplace, and not a clinical system. It is governance infrastructure — it provides the tools, standards, evidence pathways, and boundaries that make human-centred disability support visible, consistent, and auditable.

This distinction matters architecturally. Features are not built to maximise engagement or conversion. They are built to:

- Produce auditable evidence of participant choice and control
- Support workers to operate safely and independently without being directed
- Maintain platform boundaries that prevent the system from becoming a provider or employer
- Feed a longitudinal evidence chain that can be followed by a regulator or auditor
### 2. The legislative logic behind the build

Every major platform component maps to at least one piece of NDIS legislation or governance obligation. The table below shows the full chain. You do not need to know the law in depth — but you need to know it exists, because it determines what fields are mandatory, what outputs must be produced, and what the platform must never do.

| **Platform feature / module** | **Legislation anchor** | **Build rule** | **Required output** |
| --- | --- | --- | --- |
| **Personal Profile**<br>**⚠ critical** | NDIS Act s 3, s 4 | Must capture participant identity, preferences, communication style, support needs and goals in the participant's own words — not the worker's interpretation | Baseline record participant can review and update; structured for longitudinal comparison |
| **Participant check-ins**<br>**⚠ critical** | NDIS Act s 4, s 17A | Must capture participant experience directly — not filtered through worker observations. Cannot be bypassed or completed by the worker on the participant's behalf | Timestamped participant-voice responses linked to their profile and support period |
| **Daily Support Evidence Logs**<br>**⚠ critical** | NDIS Act s 34 (R&N) | Must record functional impact, what support was provided, participant voice, any changes and emerging patterns. Not a tick-box task list | Structured log entries that link to participant goals and can be aggregated into monthly snapshots |
| **Monthly Snapshot Summaries**<br>**⚠ critical** | NDIS Act s 31, s 34 | Must synthesise daily logs into a reviewable summary without requiring the participant to retell their experience. Must be participant-readable | Plain-language summary linked to daily logs, goal progress, and participant check-in data |
| **Goal Link Helper** | NDIS Act s 31 | Must maintain the distinction between goals, support needs, funded supports, and the plan itself. Cannot collapse these into a single category or provider-defined list | Structured goal-to-support mapping that an auditor can trace |
| **Worker profiles & directory**<br>**⚠ critical** | NDIS Act s 4, Code of Conduct | Must present worker information for participant-directed choice only. Platform must not assign, match, or rank workers. Participant selects — platform does not decide | Worker profile fields that support informed participant choice; no platform-controlled matching logic |
| **Incidents & complaints pathway**<br>**⚠ critical** | NDIS Code of Conduct, Practice Standards | Must provide a concern-before-complaint pathway, no-retaliation safeguards, and visibility of external complaint bodies. Must not require the participant to escalate directly without support | Logged concern and complaint records with timestamps, status and response trail |
| **AI tools (drafting, interpretation)**<br>**⚠ critical** | Privacy Act / APPs, AI governance | AI is assistive only. Must not make decisions, assess capacity, rank participants, assign workers, or determine funding. All AI outputs require human review before being treated as final | Draft outputs flagged as AI-generated; review gate before any output becomes a record |
| **Worker onboarding & portal** | WHS / psychosocial risk | Platform provides infrastructure and governance guidance but does not direct the worker's service delivery, supervise their work, or create an employment relationship | Onboarding completion records, credential verification status, document templates |
| **Policy & knowledge library** | NDIS Act s 7, Practice Standards | All content must use accessible, plain language. No provider-only or clinical-only interpretation. Content must be layered — participants and workers access appropriately pitched versions | Published library content with version control and review dates |

### 3. The three things every feature must do

Before you build a feature, ask which of these three things it does. If it does none of them, question whether it needs to exist at all.

| **1. Produces evidence**<br>The feature generates a timestamped, attributable, structured output that can be read by an auditor, a regulator, or a future reviewer. Evidence is not a note — it is a traceable record.<br>*Examples: Daily log entries, monthly snapshots, participant check-in responses, incident records.* | **2. Supports participant choice**<br>The feature gives the participant real information, real options, and real control over decisions that affect them — without the platform or worker quietly substituting their own preference.<br>*Examples: Worker directory with participant-controlled filtering, check-in tools, goal preference fields, communication style settings.* | **3. Maintains a platform boundary**<br>The feature reinforces what the platform is and is not. It does not drift into controlling service delivery, directing workers, managing participant funding, or making decisions that belong to participants.<br>*Examples: Worker terms, platform boundary copy, AI review gates, absence of automatic matching or assignment logic.* |
| --- | --- | --- |

### 4. Platform boundary — what you must not build

These are not optional constraints. They are legally and architecturally load-bearing. Building features in the 'must not' column without explicit sign-off from the TMG180 governance lead could expose the platform to provider registration obligations, employment liability, or privacy breaches.

| **Platform CAN do** | **Platform must NOT do** |
| --- | --- |
| Present worker profiles for participant-directed choice | Assign, rank, or algorithmically match workers to participants |
| Provide governance templates, tools, and guidance to workers | Supervise, direct, or control a worker's service delivery |
| Verify worker eligibility documents and access conditions | Become the worker's employer or assume vicarious liability |
| Maintain platform-level incident and complaints pathways | Adjudicate all disputes between participants and workers |
| Provide AI-assisted drafting and interpretation tools | Use AI to assess capacity, determine funding, or decide outcomes |
| Support longitudinal evidence and documentation structures | Own or control worker service records or clinical assessments |
| Support participant check-ins and preference capture | Allow workers to complete participant-facing inputs on their behalf |
| Provide plain-language NDIS information and knowledge library | Provide legal advice, plan management, or funding determinations |

### 5. The longitudinal evidence chain — the core data model

The three core evidence modules must connect. A reviewer must be able to follow a participant's experience across time. If these three outputs don't link, the platform cannot perform its primary governance function.

| **1. Personal Profile**<br>*Created at onboarding. Participant-owned baseline.*<br>Identity, preferences, communication style<br>Support needs in participant's own words<br>Goals and what matters to them<br>Routines and what helps / what doesn't<br>Must be updatable by participant. Must be readable by linked workers only. Must form the baseline for all downstream evidence. | **2. Daily Support Evidence Logs**<br>*Created per session / support interaction.*<br>What support was provided and in what context<br>Participant voice — what they said, chose, or indicated<br>Functional impact and any changes observed<br>Goal linkage and emerging patterns<br>Must link to participant profile. Must distinguish participant voice from worker observation. Must be structurally aggregatable into monthly snapshots. | **3. Monthly Snapshot Summaries**<br>*Auto-generated monthly from daily logs.*<br>Aggregated pattern view across the month<br>Goal progress and support trends<br>Participant check-in sentiment and themes<br>Flags for review — changes, concerns, emerging needs<br>Must be participant-readable in plain language. Must link back to source daily logs. Must be producible for plan review or audit on demand. |
| --- | --- | --- |

| **AUDIT TEST** | A regulator or auditor must be able to trace: what the participant said they needed (Profile) → what support was delivered (Daily Log) → what changed over time and what goals were progressed (Monthly Snapshot). If that chain breaks anywhere in the data model, the platform fails its primary governance function. |
| --- | --- |

### 6. AI governance rules for developers

AI features are approved and required — but they operate inside strict boundaries. These are not UX preferences. Violating them puts the platform outside its legal position.

| **AI CAN** | Assist workers in drafting case notes, support logs, and summaries. Help participants understand NDIS concepts in plain language. Identify patterns across a participant's longitudinal record. Translate complex language into accessible formats. Suggest goal linkages for worker review. |
| --- | --- |

| **AI CANNOT** | Make decisions about participant capacity, funding, or support eligibility. Rank, assign, or recommend workers to participants without participant-initiated choice. Generate outputs that are treated as final records without a human review gate. Process identifiable participant data through public or uncontrolled AI endpoints. Override participant voice or substitute platform interpretation for participant preference. |
| --- | --- |

**Required AI implementation pattern**

Every AI-assisted output must follow this pattern:

- AI generates a draft output — clearly flagged as AI-generated
- A human reviewer (worker or participant depending on context) reviews and edits
- The reviewed output is saved as the final record — with attribution to the human reviewer, not the AI
- The system logs that AI assistance was used in producing the draft
### 7. Privacy and data architecture rules

TMG180 operates under the Privacy Act 1988 (Cth), the Australian Privacy Principles (APPs), and the Notifiable Data Breaches scheme. The data architecture must reflect these obligations by design — not as an afterthought.

**Role-separated data layers**

The platform has three data layers that must be architecturally separated — not just permission-gated:

- Participant data — owned by the participant, accessible only to linked workers and platform administrators with legitimate purpose
- Worker data — owned by the worker, their service records are their own and not platform-controlled
- Platform data — governance records, policy documents, incident logs, and audit trails held by TMG180
| **KEY RULE** | The platform does not own participant support records or worker service records. It provides the infrastructure for those records to be created and held appropriately. This is not a semantic distinction — it has direct implications for your data model, storage architecture, and access controls. |
| --- | --- |

**Data minimisation**

- Collect only what is needed for a specific, stated purpose
- Do not pre-populate fields from inferred data or third-party sources without consent
- Participant identifiable data must not pass through public AI APIs — use approved, governed AI endpoints only
- Audit logs must be retained; routine operational data should have defined retention limits
### 8. The audit traceability test

Before signing off any major feature or module, run this test. A governance reviewer or auditor should be able to complete this chain without leaving the platform:

| **1** | Identify the NDIS principle or legislative obligation the feature responds to |
| --- | --- |
| **2** | Find the governance policy or practice standard that translates that principle into a platform rule |
| **3** | Open the platform feature and show which specific field, workflow, or output operationalises that rule |
| **4** | Show the record the system produced — timestamped, attributed, structured |
| **5** | Show how that record connects to the participant's longitudinal evidence chain (Profile → Logs → Snapshot) |
| **6** | Show the review pathway — who can see it, who can act on it, and what happens next |

*If any step in this chain breaks — the feature is incomplete, regardless of how well it functions technically.*

### 9. Questions to ask before every build decision

- Does this feature produce a record that is timestamped, attributed, and structured for audit?
- Does it preserve participant voice separately from worker observation?
- Does it connect to the participant's longitudinal evidence chain?
- Does it give the participant real choice, or does the platform quietly decide?
- Does it maintain the boundary between governance infrastructure and service delivery?
- If AI is involved — is there a human review gate before the output becomes a record?
- Is identifiable participant data staying within governed, approved systems?
- Could this feature be read as directing workers or managing supports? If yes — escalate before building.
### 10. Escalation — when to check before building

These situations require sign-off from the TMG180 governance lead before you proceed:

- Any feature that uses participant data to generate a recommendation or ranking
- Any feature that could be interpreted as the platform directing a worker's support delivery
- Any new AI capability beyond drafting assistance and plain-language interpretation
- Any change to the data model that affects how participant records are stored, accessed, or attributed
- Any feature that sits at the boundary between participant choice and platform-controlled outcomes
- Any third-party integration that receives participant or worker identifiable data
*Document prepared by TMG180 governance suite. This is a working governance-controlled document. Review required before each major development phase. Not for public distribution.*
