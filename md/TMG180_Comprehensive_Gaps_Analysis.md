| **TMG180**<br>Comprehensive Gaps Analysis<br>**Platform Alignment \| NDIS Legislation \| Missing Features \| Registration Requirements**<br>25 May 2026  \|  For Sue Lowdon and Debabrata Mondal |
| --- |

|  | CRITICAL REGULATORY ALERT:<br>TMG180 is a platform provider under the NDIS Commission definition.<br>From 1 July 2026, mandatory registration is required for all NDIS platform providers.<br>Criminal penalties apply for operating without registration where it is required.<br>Civil penalties of up to $15 million for serious misconduct under the NDIS Amendment (Integrity and Safeguarding) Act 2025.<br>Registration takes 3 to 12 months. If not already started - start now. |
| --- | --- |

| **1.  NDIS Registration - The Most Urgent Gap** |
| --- |

TMG180 is a digital platform that connects NDIS participants with independent workers. Under the NDIS Commission's definition, this makes TMG180 a platform provider.

|  | Platform provider definition (NDIS Commission):<br>"A provider that uses a profile-based platform to connect participants with workers to deliver NDIS supports,<br>for example an app or website where participants and workers create a profile."<br>TMG180 matches this definition exactly.<br>From 1 July 2026 - mandatory registration required.<br>NDIS Amendment (Integrity and Safeguarding) Act 2025 is now law.<br>Criminal penalties apply for non-compliance.<br>Registration process takes 3 to 12 months from application to approval.<br>Today is 25 May 2026. The deadline is 36 days away. |
| --- | --- |

|  | What registration requires:<br>1.  Independent audit against the NDIS Practice Standards<br>2.  Suitability assessment of key personnel (including Saf as director/owner)<br>3.  NDIS Worker Screening Checks for all workers on the platform<br>4.  Mandatory reporting obligations - serious incidents must be reported to the Commission<br>5.  Documented policies and procedures that meet the Practice Standards<br>6.  Ongoing compliance monitoring and re-auditing<br>What TMG180 already has that supports registration:<br>- TMG Main Policies document - comprehensive and compliant<br>- Governance Practice Standards - exceeds minimum requirements<br>- Allied Health Boundaries specification - clear role definitions<br>- Worker compliance tracking - insurance, screening, code of conduct<br>- Incident management screen in admin console<br>- Two-layer privacy model documented and specified<br>What needs to be done immediately:<br>- Engage an NDIS-approved quality auditor<br>- Begin the registration application with the Commission<br>- Confirm transition period arrangements with the Commission<br>- Ensure WeCare Disability Service Centre registration covers the TMG180 platform |
| --- | --- |

| **2.  Platform Feature Gaps - What Is Not Built Yet** |
| --- |

These features are in the canonical documents but do not exist on the live platform. They must be built before TMG180 can function as designed.

| **Area** | **Gap identified** | **What needs to happen** | **Priority** |
| --- | --- | --- | --- |

| **FCA Intake Form** | Not built. The most critical screen on the platform does not exist. | Build from TMG180_Canonical_Schemas_Bundle_v2.json schema fca_intake_v6. This is the baseline. Everything connects back to it. Goals entered here must appear in daily note UI. | **URGENT** |
| --- | --- | --- | --- |

| **Daily Support Event Log** | Not built. The Daily Note button exists but links to nothing. | Build eleven section daily note from DAILY CASENOTES.docx template. Goal selection mandatory (1-3 from intake). Functional domain tags mandatory. Cannot finalise without both. Append-only after submission. | **URGENT** |
| --- | --- | --- | --- |

| **Participant Check-in** | Not built. No screen exists for participant self-reporting. | Build from MONTHLY CASENOTES.docx check-in section. Intensity rating 0-4. What showed up. What helped. Recovery cost. Goals check-in. In my own words. 30-60 seconds. | **URGENT** |
| --- | --- | --- | --- |

| **Monthly Snapshot Generation** | Not built. Core longitudinal evidence feature missing. | Build three-layer snapshot from MONTHLY CASENOTES.docx. AI generates draft from daily logs and check-ins. Participant approves before locking. Append-only after approval. Fluctuation statement mandatory in every snapshot. | **URGENT** |
| --- | --- | --- | --- |

| **Goal Linking Architecture** | Not built. Goals from intake do not flow to daily notes. | Goals entered in FCA intake must appear as selectable options in daily note UI. System must enforce 1-3 goals selected before note can be finalised. This is Rule 1 of the Linking Spec. | **URGENT** |
| --- | --- | --- | --- |

| **Areas of Support Screen** | Built from wrong template. Shows therapy app categories. | Rebuild from FCA intake support categories: Daily living, Community participation, Emotional regulation, Health and wellbeing, Social connection, Capacity building, Routine and structure, Admin or planning, Safety and stability. | **URGENT** |
| --- | --- | --- | --- |

| **Postgres Seed Not Loaded** | Terminology registry not in database. All UI text is hardcoded. | Run TMG180_Canonical_Config_Master_Seeds_Postgres_v1.xlsx as seed data. All React component text must read from terminology registry tables. No hardcoded strings anywhere in the UI. | **URGENT** |
| --- | --- | --- | --- |

| **Banned Terms Still Visible** | Multiple banned terms on live platform screens. | Fix immediately: productive, Action Required, Performance Snapshots, assigned caseloads, tasks, matches. All must be replaced before any participant or worker sees the platform. | **URGENT** |
| --- | --- | --- | --- |

| **Onboarding Complete Screen** | Shows therapy app content - Mindful Presence, Session Frequency. | Rebuild to show participant goals from FCA intake, consent settings selected, documentation preferences chosen. Remove all therapy app content. | **HIGH** |
| --- | --- | --- | --- |

| **Relational Compatibility Tags** | Not in Find Workers filter. Core of Sue's matching philosophy missing. | Add tags to Find Workers filter: calm, nurturing, trauma-aware, lived experience, faith background, gender preference, neurodivergent, humorous, outdoorsy, creative, artistic, practical, structured, bilingual. | **HIGH** |
| --- | --- | --- | --- |

| **External Worker Access Layer** | Not built. New feature identified 25 May 2026. | Build per Access Layer Specification document. Participant invites external worker via secure token. External worker uploads simplified note. Participant approves. Token expires after 72 hours. See TMG180_Access_Layer_Specification.docx. | **HIGH** |
| --- | --- | --- | --- |

| **Assessment Evidence Pack Export** | Not built. Core output of longitudinal evidence model missing. | Monthly snapshots must be exportable as PDF. Participant-approved, locked, append-only. Includes trend data, fluctuation statements, goal linkage, NDIS domain mapping. This is what participants take to reassessments. | **HIGH** |
| --- | --- | --- | --- |

| **Consent Flow** | No technical specification exists. Deb will invent it. | Write consent flow specification. How participant grants consent to a worker. How consent is recorded in the database. How consent is revoked. What happens to data access when consent is revoked. Must be append-only and auditable. | **HIGH** |
| --- | --- | --- | --- |

| **Invoice Workflow** | Create Invoice button exists but no specification for how it works. | Specify invoice workflow. NDIS line item selection. Service date and duration. Participant and plan manager details. Submission to plan manager. Status tracking. Audit trail. Consistent with NDIS Price Arrangements. | **HIGH** |
| --- | --- | --- | --- |

| **Learning Hub Content Map** | Learning Hub screen exists but no content mapping document. | Map which TMG180 documents become which Learning Hub modules in what order for which user type. Governance Practice Standards, Case Note Introduction Instructions, Goal Mapping Examples all belong here. Specify module structure, order, and completion tracking. | **MEDIUM** |
| --- | --- | --- | --- |

| **My Requests Screen 404** | URL path is wrong. Page returns 404 error. | Fix URL path to /src/Content/Participant/Requests/my-requests.html. Simple fix, do first. | **URGENT** |
| --- | --- | --- | --- |

| **3.  NDIS Legislative Alignment Gaps** |
| --- |

These gaps relate to how TMG180 must align with current and upcoming NDIS legislation and the NDIS Amendment (Integrity and Safeguarding) Act 2025.

| **Area** | **Gap identified** | **What needs to happen** | **Priority** |
| --- | --- | --- | --- |

| **Impairment Linkage** | No screen or field links supports to the participant's specific impairment category. | Under the NDIS Act 2013 (amended 2024), every support must link to the specific impairment that met access criteria. The monthly snapshot must include an impairment and support linkage section. Add to Monthly Snapshot schema and template. | **URGENT** |
| --- | --- | --- | --- |

| **Notice of Impairments** | Platform has no field for participant's Notice of Impairments document. | Add Notice of Impairments field to FCA intake. Participant uploads or records their listed impairment categories. These flow into the monthly snapshot impairment linkage section. | **HIGH** |
| --- | --- | --- | --- |

| **Reasonable and Necessary Evidence** | No structured support for S34 evidence generation. | The Goal Mapping Examples document already shows how to do this. The monthly snapshot AI must generate evidence phrases that connect supports to functional domains and S34 criteria. Add to the AI endpoint specification. | **HIGH** |
| --- | --- | --- | --- |

| **Mandatory Incident Reporting** | Worker-facing incident reporting pathway not specified. | Workers on the platform have mandatory reporting obligations. The admin incidents screen exists. But there is no worker-facing incident report form or clear escalation pathway documented. Write the incident reporting workflow for workers. | **HIGH** |
| --- | --- | --- | --- |

| **Plan Management Integration** | Platform has no connection to plan management systems. | Participants are plan managed. Invoices submitted by workers must go to plan managers. Specify how the invoice workflow connects to plan management. May require a plan manager portal or API integration in a later phase. | **MEDIUM** |
| --- | --- | --- | --- |

| **NDIS Price Arrangements** | No reference to current NDIS Price Arrangements in the platform. | All invoices and service claims must reference valid NDIS support item numbers and comply with current Price Arrangements. Ensure the invoice workflow includes support item number selection from the current Price Arrangements and Price Limits. | **HIGH** |
| --- | --- | --- | --- |

| **Worker Screening for External Workers** | External workers uploading notes are not verified. | Under NDIS rules, workers delivering supports to participants must have current NDIS Worker Screening. External workers accessing participant records must confirm their screening status. Add screening confirmation to external worker verification flow. | **HIGH** |
| --- | --- | --- | --- |

| **Platform Provider Registration Disclosure** | Participants not informed TMG180 is a platform provider requiring registration. | The FCA intake consent section must disclose that TMG180 is a platform provider subject to mandatory registration from 1 July 2026 and what protections this gives participants. Update the consent section. | **URGENT** |
| --- | --- | --- | --- |

| **4.  Document and Specification Gaps** |
| --- |

These specifications do not exist yet and need to be written before Deb can build the relevant features correctly.

| **Area** | **Gap identified** | **What needs to happen** | **Priority** |
| --- | --- | --- | --- |

| **Consent Flow Specification** | No technical document specifying how consent works in the system. | Write specification covering: how participant grants consent to a worker, database table structure, what data the worker can access after consent, real-time access revocation, audit trail of all consent changes, what happens to existing notes when consent is revoked. | **HIGH** |
| --- | --- | --- | --- |

| **Invoice Workflow Specification** | No document specifying how the invoice and payment system works. | Write specification covering: invoice creation by worker, NDIS support item number selection, submission to plan manager, status tracking (submitted, approved, paid, rejected), audit trail, what happens on rejection, credit note process. | **HIGH** |
| --- | --- | --- | --- |

| **Learning Hub Content Map** | No document mapping which content goes into the Learning Hub. | Write content map: which documents become which modules, module titles in TMG language, order for worker onboarding, order for ongoing professional development, completion tracking, mandatory vs optional modules, certificate of completion. | **MEDIUM** |
| --- | --- | --- | --- |

| **Monthly Snapshot Approval Flow** | No UI specification for the participant approval process. | Write specification covering: what participant sees when a draft snapshot arrives, how they add context or corrections, how addenda are added, what happens when they approve, how the locked document is stored, export process. | **HIGH** |
| --- | --- | --- | --- |

| **Notification System Specification** | No specification for what notifications are sent and when. | Write notification specification: compliance document expiry alerts for workers (30 days, 7 days, expired), monthly snapshot ready for participant review, daily note submission confirmation, consent granted or revoked, incident submitted confirmation. | **MEDIUM** |
| --- | --- | --- | --- |

| **Data Retention and Deletion Policy** | Main Policies document mentions retention but platform has no implementation spec. | Write technical specification: what data is retained for how long (7 years from last activity), what happens when a participant leaves the platform, how deletion requests are handled, what is retained for legal compliance after deletion, audit log retention. | **HIGH** |
| --- | --- | --- | --- |

| **Cybersecurity and Privacy Specification** | No technical security specification exists for the platform. | Platform providers under the new NDIS registration framework must demonstrate robust cybersecurity and privacy controls. Write specification covering: data encryption (AES-256 at rest, TLS in transit), MFA requirements, penetration testing schedule, breach notification process (72 hours), Privacy Act 1988 compliance. | **HIGH** |
| --- | --- | --- | --- |

| **5.  Relational Language and Terminology Gaps on Live Platform** |
| --- |

Every banned term still visible on the live platform. These must be fixed before any participant or worker sees the platform.

|  | Banned terms confirmed still present on the live platform (reviewed 24-25 May 2026):<br>Screen: Worker Dashboard (hero card)<br>Current: "You have a productive day ahead with 4 sessions scheduled."<br>Replace: "You have 4 sessions today."<br>Screen: Worker Dashboard (compliance alert)<br>Current: "Action Required"<br>Replace: "Needs review"<br>Screen: Worker Dashboard (right panel)<br>Current: "Performance Snapshots"<br>Replace: "Support overview"<br>Screen: Worker Dashboard (right panel)<br>Current: "Priority Tasks" with "Action" label<br>Replace: "Coming up" with "Needs review"<br>Screen: Choose Workspace (worker description)<br>Current: "Manage daily tasks, view assigned caseloads, and collaborate with your team."<br>Replace: "Manage your support event logs, view the participants you support (with consent), and connect with your support network."<br>Screen: Participant Dashboard (hero card)<br>Current: "We've updated your matches and request statuses"<br>Replace: "We've updated your support connections and support log statuses."<br>Screen: Sign In<br>Current: "THE HUMAN SANCTUARY" branding label<br>Replace: Remove entirely. This is from a therapy app template.<br>Screen: Admin Workers<br>Current: "CONTRACT TYPE" label<br>Replace: "Engagement type" |
| --- | --- |

|  | Additional language concerns not in the banned terms file but not aligned with relational framework:<br>"Profile Completion 85%" - frames onboarding as a task completion metric.<br>Replace: "Your workspace is taking shape."<br>"Complete Setup" button - task-focused, clinical.<br>Replace: "Continue when you're ready"<br>"Add Participant" button in worker portal - employer/provider language.<br>Replace: "Add a participant you support"<br>"Participant #882" as identifier - depersonalising.<br>Consider: First name only in worker-facing views where consent allows. |
| --- | --- |

| **6.  What Is Working Well - Do Not Change These** |
| --- |

|  | The following is built correctly and aligned with the canonical documents:<br>Platform architecture: Three portals correctly separated - Participant, Worker, Admin.<br>Learning Hub: Relational Discipline Foundations, Psychosocial Complexity, Maintaining Boundaries. Sue's framework is in there correctly.<br>Worker compliance screen: Insurance, NDIS check, code of conduct, conflict declaration with expiry dates. Correctly structured.<br>Admin policies screen: Worker Code of Conduct v2.4, Privacy and Data Handling v1.1. Correct.<br>Admin incidents screen: Severity levels, review queue, case IDs. Correctly structured.<br>Worker Participants screen: Intake status tracking, Daily Note button, Continue Intake button. Correct structure.<br>Find Workers screen: Uses filter/search approach not match. Good language.<br>Overall design: Clean, professional, consistent TMG180 branding throughout.<br>Tech stack: React + Vite + Node + Express + Postgres. Fully compatible with canonical pack.<br>Canonical pack: Complete. Schemas, seed file, banned terms, improvement markers, linking spec, snapshot spec. All correct.<br>Document framework: FCA intake, daily notes, monthly notes, case note instructions, evidence of improvement. All complete.<br>Governance documents: Foundational overview, governance standards, main policies, NDIS alignment. All complete. |
| --- | --- |

| **7.  Priority Build Order - Do These** **In** **This Sequence** |
| --- |

|  | WEEK 1 - Fix immediately (before any participant or worker sees the platform):<br>1.  Fix 404 error on My Requests screen (URL path)<br>2.  Remove THE HUMAN SANCTUARY from sign in screen<br>3.  Fix all banned terms on worker dashboard, choose workspace, participant dashboard<br>4.  Run Postgres seed file - load terminology registry into database<br>5.  Switch all React hardcoded strings to read from terminology registry<br>WEEK 2 - Rebuild wrong screens:<br>6.  Rebuild Areas of Support screen from FCA intake categories<br>7.  Rebuild Onboarding Complete screen to show goals and consent settings<br>WEEK 3-4 - Build core longitudinal evidence layer:<br>8.  Build FCA intake form from schema bundle (fca_intake_v6)<br>9.  Build daily support event log with goal linking from intake<br>10. Build participant check-in screen<br>11. Build monthly snapshot generation and participant approval flow<br>WEEK 5-6 - Build supporting features:<br>12. Add relational compatibility tags to Find Workers screen<br>13. Build external worker access layer (Layer D)<br>14. Build consent flow with database audit trail<br>15. Build invoice workflow<br>WEEK 7-8 - Build evidence and export:<br>16. Build assessment evidence pack PDF export<br>17. Build notification system<br>18. Write and implement cybersecurity specification<br>19. Write and implement data retention specification |
| --- | --- |

|  | Alongside the build - registration (parallel track, start now):<br>1.  Contact NDIS Commission about transition period for platform providers<br>2.  Engage an NDIS-approved quality auditor<br>3.  Confirm WeCare Disability Service Centre registration covers TMG180 platform<br>4.  Begin registration application - do not wait for the build to be complete<br>5.  Target: registration application submitted by 30 June 2026 |
| --- | --- |

| **8.  What TMG180 Does That Nobody Else Does** |
| --- |

|  | This section exists because it is important to remember what TMG180 is building toward<br>and why the gaps matter. Fixing them is not just compliance - it is protecting something genuinely unique.<br>1.  Participant-owned longitudinal evidence<br>No other NDIS platform gives participants ownership of their own evidence record.<br>No other platform builds evidence gradually over time that participants can approve and export.<br>This is what TMG180 does that nobody else has built.<br>2.  Relational language enforced at system level<br>No other platform enforces dignity-preserving, non-shaming language through a terminology registry.<br>No other platform bans clinical and provider language at the AI layer.<br>This is what Sue designed and what makes TMG180 different in every interaction.<br>3.  Non-linear fluctuation documented as evidence not failure<br>No other platform builds fluctuation documentation into the longitudinal model.<br>The monthly snapshot non-linear functioning statement means a harder month<br>cannot be used against a participant at reassessment.<br>This directly protects participant funding.<br>4.  Independent worker infrastructure without losing autonomy<br>TMG180 gives independent workers everything a provider gives them<br>- compliance, insurance tracking, verification, directory listing -<br>without turning them into employees or taking a percentage of their income.<br>This is the middle ground Sue designed.<br>5.  Compliance built from lived experience<br>The framework was not designed by a compliance consultant.<br>It was designed by a participant who has lived the failures of the system<br>and understands exactly what would have helped.<br>That is why it works. That is why it is unique. |
| --- | --- |

| TMG180 - Comprehensive Gaps Analysis | 25 May 2026 \| NDIS Amendment (Integrity and Safeguarding) Act 2025 |
| --- | --- |
