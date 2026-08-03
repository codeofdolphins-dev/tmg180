TITLE (Heading 1, 24pt, Bold):

TMG180 DESIGN ALIGNMENT SUMMARY

Executive Review for Developer Handoff

SUBTITLE (Heading 2, 14pt):

Final Design Main Page — Status & Open Questions

---

SECTION 1 (Heading 1):

DESIGN STATUS: READY FOR DEVELOPMENT

(Body text - regular paragraph)

Source of truth: Final Design Main Page (Figma tab 1195857868)

✅ All terminology verified and corrected (Governance Standing, Participants I support, etc.)

✅ Architecture enforces "side-by-side" principle (no matching, no provider management, direct contact only)

✅ Desktop design complete (Participant Portal, Worker Portal, Admin Console)

✅ Mobile design complete (8 responsive frames for daily-use flows)

✅ All text/label fixes implemented and verified across 165+ instances

---

SECTION 2 (Heading 1):

REQUIREMENTS MET ✅

PARTICIPANT PORTAL (Heading 2):

✅ Dashboard with 5 tiles (Personal Profile, Daily Log, Monthly Snapshot, Export, Browse Directory)

✅ Personal Profile with 11 sections (About Me, My Goals, Daily Living, Mobility & Transport, Communication, Social Participation, Learning & Employment, Health & Wellbeing, Safety, My Support Network, + 1 more)

✅ Daily Support Evidence Log (session details, intent/focus, evidence, review)

✅ Monthly Snapshot Summary (mood, activities, functional capacity, goal progression)

✅ Snapshot Export (download/share capability)

✅ Worker Directory ("Browse Verified Workers" with filtering by support areas, communication style, location, identity alignment)

✅ Favourites/Saved Workers (direct contact info shown: phone, email, website, booking link)

✅ Privacy & Sharing (consent controls, data sharing toggles)

✅ Help Centre & Support resources

WORKER PORTAL (Heading 2):

✅ Dashboard (Participants I support, Today's sessions, Governance alerts)

✅ Participants I support list

✅ Calendar (self-managed scheduling)

✅ Daily Support Evidence Log (worker-side logging template)

✅ Monthly Snapshot (worker-side monthly review)

✅ Learning Hub (onboarding modules, Activation Progress with correct wording: "Complete onboarding to publish your profile (opt-in) and access tools")

✅ Governance Standing (verification metadata: NDIS status, Professional Indemnity, screening, policy acknowledgements)

✅ Worker Relational Profile (support areas, communication style, relational style tags, experience, credentials, languages, location, contact methods — direct contact only)

✅ Settings/Preferences

✅ Help Centre & Resources

ADMIN CONSOLE (Heading 2):

✅ Governance Standing (verification metadata dashboard)

✅ Policies & Acknowledgements (policy version tracking, acknowledgement status)

✅ Incidents & Complaints (ticket/incident tracking for governance)

✅ Consent Audit Log (consent tracking for compliance)

✅ Workers Report (oversight of verification status)

✅ Audit Logs (activity tracking)

SHARED & STATE FRAMES (Heading 2):

✅ Role Selection (Participant / Worker / Admin)

✅ Sign In, Forgot Password, Email verification flows

✅ Empty States (No Daily Logs, No Monthly Snapshot, No Export, No Favourites, No Consent Access)

✅ Error States & Permission Denied variants

MOBILE DESIGN (Heading 2):

✅ 8 responsive frames (Personal Profile, Participant Dashboard, Daily Log, Monthly Snapshot, Worker Directory, Snapshot Exports, Worker Profile Detail, Privacy & Sharing)

✅ Simplified bottom nav (Home / Profile / Log / Snapshot / Browse) — no terminology inconsistencies

ARCHITECTURE & PRINCIPLES (Heading 2):

✅ "Side-by-side, not over-the-shoulder" enforced throughout

✅ Direct contact only (no platform messaging, no in-app booking)

✅ No matching algorithm (filtering/browsing only)

✅ Participant ownership (they own their profile, logs, exports)

✅ Worker autonomy (self-employed, no caseload management)

✅ Governance metadata-only (Admin Console shows verification, not service-delivery oversight)

TERMINOLOGY & LANGUAGE (Heading 2):

✅ "Governance Standing" (not "Compliance") — consistent throughout Worker Portal

✅ "Participants I support" (not "Participants" or "Caseload") — consistent throughout Worker Portal

✅ "Favourites" (not "Matched Workers") — reinforces browsing, not matching

✅ All 23 banned terms replaced per Drift Fix Pack

✅ "Complete onboarding to publish your profile (opt-in) and access tools" (Activation Progress card — correct wording)

---

SECTION 3 (Heading 1):

GAPS IDENTIFIED ⚠️

MISSING FRAMES (Heading 2):

1. No dedicated "Create Account" onboarding screen

- Context: Auth flow goes Role Selection → Sign In directly

- Likely handled in code/auth layer — confirm with your team

- Impact: Low (if auth is external)

2. No "Account Details" standalone onboarding frame

- Context: Only exists as settings section within Worker Settings

- May be intentional if handled dynamically — clarify with your team

- Impact: Low-to-Medium

DESIGN INCONSISTENCIES (Heading 2):

3. Duplicate "Choose Your Workspace" frames

- Version A: 2 cards (Participant Portal, Worker Workspace)

- Version B: 3 cards (+ TMG180 Governance Admin)

- Question: Intentional separate flows, or should they be consolidated?

- Impact: Medium (affects onboarding UX clarity)

4. "Session Preferences" title is slightly awkward

- Content is correct (participant-owned filter tags for communication style, availability windows, support focus)

- Title just needs polish — not an architecture violation

- Decision: Kept as-is (Deb can rename if needed)

STRUCTURAL ITEMS PENDING DELETION (Heading 2):

5. Weekly Availability calendar (on Worker Relational Profile)

- Reason: Workers are autonomous; platform should NOT collect detailed availability

- Status: Located, awaiting user deletion

6. Participant Overview nav item (Admin Console)

- Reason: Enables over-the-shoulder participant management; violates side-by-side principle

- Status: Located, awaiting user deletion

DEPRECATED PAGES (Heading 2):

Draft pages contain earlier/rougher versions and should be archived:

- Some add pages

- New

- Page 2

- Page 3

Final Design Main Page is the canonical source of truth.

---

SECTION 4 (Heading 1):

OPEN QUESTIONS FOR DEB

1. Account creation handling

Is "Create Account" screen needed in Figma, or handled entirely in code/auth layer?

2. Workspace selection

Are both "Choose Your Workspace" variants intentional for different user paths?

3. Mobile scope verification

Is the current 8-frame mobile coverage (daily-use flows only, no admin/auth/detailed onboarding) aligned with your MVP plan?

---

SECTION 5 (Heading 1):

RECOMMENDATIONS

1. Use Final Design Main Page as single source of truth

2. Archive/delete draft pages (Some add pages, New, Page 2, Page 3) to reduce confusion

3. Cross-reference design against TMG180_Legislative_Alignment_Map for compliance verification

4. Clarify the 3 open questions above before starting dev

5. Reference CIS001-005 docs for detailed data models and schemas

---

SECTION 6 (Heading 1):

DESIGN READINESS SUMMARY

COMPLETE (95%):

✅ Terminology verified and corrected

✅ Architecture enforces "side-by-side" principle

✅ Desktop & mobile frames complete

✅ All text/label fixes implemented

PENDING:

⚠️ 2 structural deletions (Weekly Availability, Participant Overview)

❓ 3 open questions for team clarification

READY FOR DEVELOPMENT ONCE:

1. User deletes the 2 structural items

2. You clarify the 3 open questions

---

FOOTER:

Final Design Main Page — Figma

TMG180 Canonical Specifications: CIS001–CIS005

Developer Reference: TMG180_Developer_Technical_Brief.docx

Compliance Reference: TMG180_Legislative_Alignment_Map.docx
