# TMG180 New Database Tables (Net New Only)

**Source:** `TMG180_New_Database_Tables.sql` | Postgres | Node + Express + React + Vite stack | For Debabrata Mondal | 25 May 2026

Net-new tables (21, prefixed `tmg_`), additive only, append-only architecture where noted. Sections: 1) Terminology & language enforcement, 2) Participant evidence architecture (FCA intake, goals, daily notes private/structured, check-ins, monthly snapshots, addenda), 3) Consent architecture, 4) External worker access layer (Layer D), 5) Invoice & payment workflow, 6) Notifications, 7) Data retention & audit, 8) API endpoint reference (Express routes incl. the 3 AI endpoints).

```sql
-- ============================================================
-- TMG180 -- New Database Tables (Net New Only)
-- Postgres | Node + Express + React + Vite Stack
-- For Debabrata Mondal | 25 May 2026
-- ============================================================
-- These tables are net new. They do not conflict with
-- anything already built. Run after your existing migrations.
-- All tables follow append-only architecture where noted.
-- ============================================================


-- ============================================================
-- SECTION 1: TERMINOLOGY AND LANGUAGE ENFORCEMENT
-- ============================================================

-- Terminology registry
-- All UI copy in React must read from this table.
-- No hardcoded strings in components.
CREATE TABLE IF NOT EXISTS tmg_terminology_registry (
  id                  SERIAL PRIMARY KEY,
  key                 VARCHAR(255) NOT NULL UNIQUE,
  value               TEXT NOT NULL,
  context             VARCHAR(100),   -- e.g. 'participant_portal', 'worker_portal', 'admin', 'shared'
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_terminology_key ON tmg_terminology_registry(key);
CREATE INDEX idx_terminology_context ON tmg_terminology_registry(context);

COMMENT ON TABLE tmg_terminology_registry IS
  'Single source of truth for all UI text. React reads from here. No hardcoded strings.';

-- Banned terms enforcement
CREATE TABLE IF NOT EXISTS tmg_banned_terms (
  id                  SERIAL PRIMARY KEY,
  banned_term         VARCHAR(255) NOT NULL UNIQUE,
  replacement         VARCHAR(255) NOT NULL,
  context             TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE tmg_banned_terms IS
  'Terms that must never appear in AI outputs or UI. Checked at AI layer before any text is displayed.';

-- Seed banned terms from canonical JSON
INSERT INTO tmg_banned_terms (banned_term, replacement) VALUES
  ('match', 'filter/search'),
  ('assigned caseload', 'participants you support (with consent)'),
  ('tasks', 'support event logs / notes / invoices'),
  ('productivity', 'clarity / calm workspace'),
  ('programs', 'supports / snapshot'),
  ('clinical notes', 'support logs / snapshot notes'),
  ('ACTION REQUIRED', 'Needs review'),
  ('non-compliant', 'not completed yet')
ON CONFLICT (banned_term) DO UPDATE SET replacement = EXCLUDED.replacement;

-- Improvement markers (outcome language)
CREATE TABLE IF NOT EXISTS tmg_improvement_markers (
  id                  SERIAL PRIMARY KEY,
  marker_type         VARCHAR(100) NOT NULL,  -- e.g. 'functional_gain', 'stability', 'recovery_cost'
  marker_text         TEXT NOT NULL,
  domain_tag          VARCHAR(50),            -- NDIS functional domain
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE tmg_improvement_markers IS
  'Language the AI uses to describe progress without implying cure. Support-mediated functioning.';

-- Support banding rules
CREATE TABLE IF NOT EXISTS tmg_support_banding (
  id                  SERIAL PRIMARY KEY,
  band_code           VARCHAR(50) NOT NULL UNIQUE,
  band_label          TEXT NOT NULL,
  description         TEXT,
  min_frequency       INTEGER,   -- sessions per month
  max_frequency       INTEGER,
  intensity_range_low INTEGER,   -- 0-4 scale
  intensity_range_high INTEGER,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE tmg_support_banding IS
  'Support band rules for estimating participant support needs from intake and ongoing logs.';

-- Translator terms (NDIS language to relational language and back)
CREATE TABLE IF NOT EXISTS tmg_translator_terms (
  id                  SERIAL PRIMARY KEY,
  ndis_term           VARCHAR(255) NOT NULL,
  relational_term     VARCHAR(255) NOT NULL,
  functional_domain   VARCHAR(100),
  context             TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE tmg_translator_terms IS
  'Translates NDIS clinical language to relational language and back. Used by AI translation layer.';


-- ============================================================
-- SECTION 2: PARTICIPANT EVIDENCE ARCHITECTURE
-- ============================================================

-- FCA intake baseline (one per participant, updateable with version history)
CREATE TABLE IF NOT EXISTS tmg_fca_intake (
  id                  SERIAL PRIMARY KEY,
  participant_id      INTEGER NOT NULL,  -- FK to your existing participants table
  version             INTEGER NOT NULL DEFAULT 1,
  status              VARCHAR(50) DEFAULT 'draft',  -- draft, complete, archived
  submitted_at        TIMESTAMPTZ,
  -- Section 1: About the participant
  personality_tags    TEXT[],            -- array of selected tags
  meaning_tags        TEXT[],
  -- Section 2: Strengths
  strengths_tags      TEXT[],
  goals_tags          TEXT[],            -- things they want more of
  -- Section 3: Functional impacts (NDIS six domains)
  mobility_tags       TEXT[],
  mobility_notes      TEXT,
  communication_tags  TEXT[],
  communication_notes TEXT,
  social_tags         TEXT[],
  social_notes        TEXT,
  selfcare_tags       TEXT[],
  selfcare_notes      TEXT,
  learning_tags       TEXT[],
  learning_notes      TEXT,
  selfmanagement_tags TEXT[],
  selfmanagement_notes TEXT,
  -- Section 4: Community and health
  community_tags      TEXT[],
  health_tags         TEXT[],
  equipment_tags      TEXT[],
  -- Section 5: Support patterns
  support_pattern_tags TEXT[],
  fluctuation_notes   TEXT,
  -- Section 6: Safety
  safety_tags         TEXT[],
  safety_notes        TEXT,
  substance_tags      TEXT[],
  -- Section 7: Relational compatibility
  compat_style_tags   TEXT[],
  compat_gender_tags  TEXT[],
  compat_faith_tags   TEXT[],
  compat_identity_tags TEXT[],
  compat_avoid_tags   TEXT[],
  -- Section 8: Consent
  documentation_consent TEXT[],         -- selected consent options
  consent_declared    BOOLEAN DEFAULT FALSE,
  consent_declared_at TIMESTAMPTZ,
  -- NDIS linkage
  ndis_goals          JSONB,            -- array of {goal_id, goal_text, domain}
  impairment_categories TEXT[],         -- from Notice of Impairments
  notice_of_impairments_uploaded BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fca_participant ON tmg_fca_intake(participant_id);
CREATE INDEX idx_fca_status ON tmg_fca_intake(status);

COMMENT ON TABLE tmg_fca_intake IS
  'Participant FCA intake baseline. Everything on the platform connects back to this. Append-only after submission.';

-- Participant goals (extracted from FCA for use in daily notes)
CREATE TABLE IF NOT EXISTS tmg_participant_goals (
  id                  SERIAL PRIMARY KEY,
  participant_id      INTEGER NOT NULL,
  intake_id           INTEGER REFERENCES tmg_fca_intake(id),
  goal_text           TEXT NOT NULL,
  ndis_domain         VARCHAR(100),     -- mobility, communication, social, selfcare, learning, selfmanagement
  ndis_domain_label   TEXT,
  goal_order          INTEGER DEFAULT 1,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_goals_participant ON tmg_participant_goals(participant_id);
CREATE INDEX idx_goals_active ON tmg_participant_goals(participant_id, is_active);

COMMENT ON TABLE tmg_participant_goals IS
  'Goals extracted from FCA intake. These appear as selectable options in daily note UI. Linked to NDIS domains.';

-- Daily support event logs (WCPS layer A - worker private narrative)
CREATE TABLE IF NOT EXISTS tmg_daily_note_private (
  id                  SERIAL PRIMARY KEY,
  worker_id           INTEGER NOT NULL,
  participant_id      INTEGER NOT NULL,
  session_date        DATE NOT NULL,
  start_time          TIME,
  end_time            TIME,
  duration_minutes    INTEGER,
  service_type        VARCHAR(100),
  location            VARCHAR(255),
  private_narrative   TEXT,             -- NEVER shared. WCPS only.
  safety_narrative    TEXT,             -- NEVER shared unless legal requirement
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  -- Append-only: no updates allowed after submission
  is_locked           BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_private_note_worker ON tmg_daily_note_private(worker_id, session_date);

COMMENT ON TABLE tmg_daily_note_private IS
  'WCPS Layer A. Worker private narrative notes. NEVER accessible by participant, other workers, or admin. Legal only.';

-- Daily support event logs (shared structured layer - flows into participant snapshot)
CREATE TABLE IF NOT EXISTS tmg_daily_note_structured (
  id                  SERIAL PRIMARY KEY,
  private_note_id     INTEGER REFERENCES tmg_daily_note_private(id),
  worker_id           INTEGER NOT NULL,
  participant_id      INTEGER NOT NULL,
  session_date        DATE NOT NULL,
  duration_minutes    INTEGER,
  service_type        VARCHAR(100),
  location            VARCHAR(255),
  -- Goal links (mandatory - 1-3 from participant goals)
  goal_ids            INTEGER[],        -- FK array to tmg_participant_goals
  goal_validated      BOOLEAN DEFAULT FALSE,  -- cannot submit without goals
  -- Functional domain tags (mandatory - 1-3)
  domain_tags         VARCHAR(50)[],    -- NDIS domain codes
  domain_validated    BOOLEAN DEFAULT FALSE,  -- cannot submit without domains
  -- Section 3: What was hard today
  impact_tags         TEXT[],           -- TT-* tags from canonical schema
  -- Section 4: Support delivered
  support_type_tags   TEXT[],
  -- Section 5: Outcome micro-block
  outcome_tags        TEXT[],
  outcome_text        TEXT,             -- "Today, with support, the participant was able to..."
  -- Section 6: Baseline comparison
  baseline_comparison VARCHAR(50),      -- typical, more_support, less_support, different_support
  baseline_factors    TEXT[],
  baseline_notes      TEXT,
  -- Section 7: Participant voice (visible to participant)
  participant_voice   TEXT,
  safety_note         TEXT,             -- public safety note (not private narrative)
  -- Status
  status              VARCHAR(50) DEFAULT 'submitted',   -- submitted, locked
  submitted_at        TIMESTAMPTZ DEFAULT NOW(),
  is_locked           BOOLEAN DEFAULT TRUE,              -- append-only after submission
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_structured_note_participant ON tmg_daily_note_structured(participant_id, session_date);
CREATE INDEX idx_structured_note_worker ON tmg_daily_note_structured(worker_id, session_date);

COMMENT ON TABLE tmg_daily_note_structured IS
  'Structured support event log. Flows into participant snapshot. Visible to participant. Append-only.';

-- Daily note addenda (for corrections after locking)
CREATE TABLE IF NOT EXISTS tmg_daily_note_addendum (
  id                  SERIAL PRIMARY KEY,
  note_id             INTEGER REFERENCES tmg_daily_note_structured(id),
  added_by            INTEGER NOT NULL,     -- worker_id or participant_id
  added_by_role       VARCHAR(50) NOT NULL, -- 'worker' or 'participant'
  addendum_text       TEXT NOT NULL,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE tmg_daily_note_addendum IS
  'Addenda to locked notes. The only way to add context after submission. Original note never modified.';

-- Participant check-ins
CREATE TABLE IF NOT EXISTS tmg_participant_checkin (
  id                  SERIAL PRIMARY KEY,
  participant_id      INTEGER NOT NULL,
  checkin_period      VARCHAR(50),          -- 'this_week', 'today', 'after_support'
  checkin_date        DATE NOT NULL,
  -- Section B2: What showed up
  impact_tags         TEXT[],
  impact_notes        TEXT,
  -- Section B3: Intensity rating
  intensity_rating    INTEGER CHECK (intensity_rating >= 0 AND intensity_rating <= 4),
  -- Section B4: What helped
  helped_tags         TEXT[],
  helped_notes        TEXT,
  -- Section B5: Recovery cost
  recovery_level      VARCHAR(100),         -- 'none', 'little', 'a_lot', 'days'
  recovery_notes      TEXT,
  -- Section B6: Goals check-in
  goals_checkin_tags  TEXT[],
  goals_notes         TEXT,
  -- Section B7: In my own words
  own_words           TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  is_locked           BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_checkin_participant ON tmg_participant_checkin(participant_id, checkin_date);

COMMENT ON TABLE tmg_participant_checkin IS
  'Participant self-reporting. Weekly or post-session. Feeds into monthly snapshot AI generation.';

-- Monthly snapshots
CREATE TABLE IF NOT EXISTS tmg_monthly_snapshot (
  id                  SERIAL PRIMARY KEY,
  participant_id      INTEGER NOT NULL,
  month_year          VARCHAR(7) NOT NULL,  -- format: 2026-05
  version             INTEGER DEFAULT 1,
  -- Generation
  generated_from_notes INTEGER[],           -- daily note IDs included
  generated_from_checkins INTEGER[],        -- check-in IDs included
  generated_at        TIMESTAMPTZ,
  -- Layer 1: Participant-first plain language
  participant_story   TEXT,
  what_mattered       TEXT,
  what_got_in_way     TEXT,
  what_helped         TEXT,
  recovery_cost       TEXT,
  next_month_intentions TEXT,
  -- Layer 2: Functional meaning
  participation_domains TEXT[],
  main_functional_impacts TEXT,
  frequency_pattern   TEXT,
  recovery_cost_trend TEXT,
  supports_that_helped TEXT,
  when_support_unavailable TEXT,
  -- Layer 3: NDIS evidence view
  mobility_summary    TEXT,
  communication_summary TEXT,
  social_summary      TEXT,
  selfcare_summary    TEXT,
  learning_summary    TEXT,
  selfmanagement_summary TEXT,
  -- Impairment linkage (NDIS Act 2013 amended 2024 requirement)
  impairment_category TEXT,
  impairment_linkage  TEXT,
  goal_linkage        TEXT,
  -- Outcome highlights
  outcome_tags        TEXT[],
  outcome_highlights  TEXT,
  -- Non-linear functioning statement (MANDATORY in every snapshot)
  nonlinear_statement TEXT NOT NULL DEFAULT
    'Capacity varied across the month, consistent with non-linear functioning. Participation improved with support scaffolding. This reflects supports working, not removal of impairment.',
  -- Participant approval
  status              VARCHAR(50) DEFAULT 'draft',  -- draft, under_review, approved, locked
  participant_approved BOOLEAN DEFAULT FALSE,
  participant_approved_at TIMESTAMPTZ,
  participant_addendum TEXT,
  locked_at           TIMESTAMPTZ,
  -- Export
  exported_at         TIMESTAMPTZ,
  export_format       VARCHAR(50),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_snapshot_participant ON tmg_monthly_snapshot(participant_id, month_year);
CREATE UNIQUE INDEX idx_snapshot_unique ON tmg_monthly_snapshot(participant_id, month_year, version);

COMMENT ON TABLE tmg_monthly_snapshot IS
  'Three-layer monthly snapshot. AI generated from daily notes and check-ins. Participant approves before locking. Append-only after approval.';

-- Snapshot addenda
CREATE TABLE IF NOT EXISTS tmg_snapshot_addendum (
  id                  SERIAL PRIMARY KEY,
  snapshot_id         INTEGER REFERENCES tmg_monthly_snapshot(id),
  added_by            INTEGER NOT NULL,
  added_by_role       VARCHAR(50) NOT NULL,
  addendum_text       TEXT NOT NULL,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE tmg_snapshot_addendum IS
  'Addenda to approved locked snapshots. Corrections via addendum only. Original never modified.';


-- ============================================================
-- SECTION 3: CONSENT ARCHITECTURE
-- ============================================================

-- Participant consent records (full audit trail)
CREATE TABLE IF NOT EXISTS tmg_consent (
  id                  SERIAL PRIMARY KEY,
  participant_id      INTEGER NOT NULL,
  worker_id           INTEGER,              -- NULL for platform-wide consent
  consent_type        VARCHAR(100) NOT NULL, -- 'worker_access', 'documentation', 'external_worker', 'data_sharing'
  status              VARCHAR(50) NOT NULL,  -- 'granted', 'revoked', 'pending'
  granted_at          TIMESTAMPTZ,
  revoked_at          TIMESTAMPTZ,
  revoked_reason      TEXT,
  -- Scope of consent
  can_view_intake     BOOLEAN DEFAULT FALSE,
  can_view_snapshot   BOOLEAN DEFAULT FALSE,
  can_add_daily_note  BOOLEAN DEFAULT FALSE,
  can_view_checkins   BOOLEAN DEFAULT FALSE,
  -- Audit
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  -- Append-only: consent changes create new records, never update old ones
  superseded_by       INTEGER REFERENCES tmg_consent(id)
);

CREATE INDEX idx_consent_participant ON tmg_consent(participant_id, status);
CREATE INDEX idx_consent_worker ON tmg_consent(worker_id, status);

COMMENT ON TABLE tmg_consent IS
  'Full audit trail of all consent grants and revocations. Append-only. Changes create new records.';

-- Trigger: when consent is revoked, update worker data access immediately
CREATE OR REPLACE FUNCTION tmg_revoke_worker_access()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'revoked' AND OLD.status = 'granted' THEN
    -- Log the revocation timestamp
    NEW.revoked_at = NOW();
    -- Worker immediately loses access to participant record
    -- Application layer enforces: no queries with participant_id return data
    -- when no active consent record exists
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER consent_revocation_trigger
  BEFORE UPDATE ON tmg_consent
  FOR EACH ROW EXECUTE FUNCTION tmg_revoke_worker_access();


-- ============================================================
-- SECTION 4: EXTERNAL WORKER ACCESS LAYER (NEW - Layer D)
-- ============================================================

-- External worker invitations
CREATE TABLE IF NOT EXISTS tmg_external_worker_invitations (
  id                  SERIAL PRIMARY KEY,
  participant_id      INTEGER NOT NULL,
  worker_name         VARCHAR(255) NOT NULL,
  worker_email        VARCHAR(255) NOT NULL,
  worker_role         VARCHAR(255),          -- e.g. personal trainer, physiotherapist
  token_hash          VARCHAR(255) NOT NULL UNIQUE,  -- hashed secure token
  status              VARCHAR(50) DEFAULT 'pending',  -- pending, accepted, expired, revoked
  -- Expiry
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  expires_at          TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '72 hours'),
  accepted_at         TIMESTAMPTZ,
  revoked_at          TIMESTAMPTZ,
  revoked_by          INTEGER,               -- participant_id who revoked
  -- Usage
  note_submitted      BOOLEAN DEFAULT FALSE,
  note_submitted_at   TIMESTAMPTZ
);

CREATE INDEX idx_ext_invitation_participant ON tmg_external_worker_invitations(participant_id);
CREATE INDEX idx_ext_invitation_token ON tmg_external_worker_invitations(token_hash);
CREATE INDEX idx_ext_invitation_status ON tmg_external_worker_invitations(status);

COMMENT ON TABLE tmg_external_worker_invitations IS
  'Secure token-based invitations for external workers. 72 hour expiry. Single use. Participant controlled.';

-- External worker support notes
CREATE TABLE IF NOT EXISTS tmg_external_support_notes (
  id                  SERIAL PRIMARY KEY,
  invitation_id       INTEGER REFERENCES tmg_external_worker_invitations(id),
  participant_id      INTEGER NOT NULL,
  external_worker_name VARCHAR(255) NOT NULL,
  external_worker_role VARCHAR(255) NOT NULL,
  -- Note content (simplified template)
  session_date        DATE NOT NULL,
  duration_minutes    INTEGER,
  support_type_tags   TEXT[],               -- what they worked on
  presentation_tags   TEXT[],               -- how participant presented
  outcome_text        TEXT,                 -- optional one sentence outcome
  safety_note         TEXT,                 -- optional safety note
  -- Participant review and approval
  status              VARCHAR(50) DEFAULT 'pending_review',  -- pending_review, approved, rejected
  participant_reviewed_at TIMESTAMPTZ,
  participant_approved BOOLEAN,
  rejection_reason    TEXT,
  -- Append-only after submission
  submitted_at        TIMESTAMPTZ DEFAULT NOW(),
  is_locked           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ext_note_participant ON tmg_external_support_notes(participant_id, session_date);
CREATE INDEX idx_ext_note_status ON tmg_external_support_notes(participant_id, status);

COMMENT ON TABLE tmg_external_support_notes IS
  'Notes submitted by external workers via invitation. Participant must approve before entering record.';


-- ============================================================
-- SECTION 5: INVOICE AND PAYMENT WORKFLOW
-- ============================================================

CREATE TABLE IF NOT EXISTS tmg_invoices (
  id                  SERIAL PRIMARY KEY,
  worker_id           INTEGER NOT NULL,
  participant_id      INTEGER NOT NULL,
  -- Session reference
  daily_note_id       INTEGER REFERENCES tmg_daily_note_structured(id),
  service_date        DATE NOT NULL,
  duration_minutes    INTEGER NOT NULL,
  -- NDIS line item
  support_item_number VARCHAR(50),          -- e.g. 01_011_0107_1_1
  support_item_name   TEXT,
  support_category    VARCHAR(100),
  unit_price          NUMERIC(10,2),
  quantity            NUMERIC(10,2),        -- hours or units
  gst_applicable      BOOLEAN DEFAULT FALSE,
  total_amount        NUMERIC(10,2),
  -- Plan management
  plan_manager_name   VARCHAR(255),
  plan_manager_email  VARCHAR(255),
  participant_ndis_number VARCHAR(50),
  -- Status tracking
  status              VARCHAR(50) DEFAULT 'draft',  -- draft, submitted, approved, paid, rejected
  submitted_at        TIMESTAMPTZ,
  approved_at         TIMESTAMPTZ,
  paid_at             TIMESTAMPTZ,
  rejected_at         TIMESTAMPTZ,
  rejection_reason    TEXT,
  -- Audit
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoice_worker ON tmg_invoices(worker_id, service_date);
CREATE INDEX idx_invoice_participant ON tmg_invoices(participant_id);
CREATE INDEX idx_invoice_status ON tmg_invoices(status);

COMMENT ON TABLE tmg_invoices IS
  'NDIS invoice workflow. Worker creates, submits to plan manager. Full status tracking and audit trail.';

-- Invoice audit log (append-only status history)
CREATE TABLE IF NOT EXISTS tmg_invoice_audit (
  id                  SERIAL PRIMARY KEY,
  invoice_id          INTEGER REFERENCES tmg_invoices(id),
  previous_status     VARCHAR(50),
  new_status          VARCHAR(50),
  changed_by          INTEGER,
  changed_by_role     VARCHAR(50),
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE tmg_invoice_audit IS
  'Append-only audit trail for invoice status changes.';


-- ============================================================
-- SECTION 6: NOTIFICATION SYSTEM
-- ============================================================

CREATE TABLE IF NOT EXISTS tmg_notifications (
  id                  SERIAL PRIMARY KEY,
  recipient_id        INTEGER NOT NULL,
  recipient_role      VARCHAR(50) NOT NULL,  -- 'participant', 'worker', 'admin'
  notification_type   VARCHAR(100) NOT NULL,
  -- Types:
  -- 'compliance_expiry_30' - document expires in 30 days
  -- 'compliance_expiry_7'  - document expires in 7 days
  -- 'compliance_expired'   - document has expired
  -- 'snapshot_ready'       - monthly snapshot ready for participant review
  -- 'note_submitted'       - daily note submitted confirmation
  -- 'consent_granted'      - worker granted access
  -- 'consent_revoked'      - worker access revoked
  -- 'external_note_pending' - external worker note needs review
  -- 'invoice_status'       - invoice status changed
  title               TEXT NOT NULL,
  body                TEXT NOT NULL,
  reference_id        INTEGER,              -- related record ID
  reference_type      VARCHAR(100),         -- 'daily_note', 'snapshot', 'invoice', 'compliance'
  is_read             BOOLEAN DEFAULT FALSE,
  read_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notification_recipient ON tmg_notifications(recipient_id, recipient_role, is_read);
CREATE INDEX idx_notification_type ON tmg_notifications(notification_type, created_at);

COMMENT ON TABLE tmg_notifications IS
  'Platform notification system. All notification types for all user roles.';


-- ============================================================
-- SECTION 7: DATA RETENTION AND AUDIT
-- ============================================================

-- Platform-wide audit log
CREATE TABLE IF NOT EXISTS tmg_audit_log (
  id                  BIGSERIAL PRIMARY KEY,
  actor_id            INTEGER,              -- user who performed the action
  actor_role          VARCHAR(50),
  action              VARCHAR(100) NOT NULL, -- e.g. 'consent_granted', 'note_submitted', 'snapshot_approved'
  target_type         VARCHAR(100),          -- e.g. 'participant', 'note', 'snapshot'
  target_id           INTEGER,
  details             JSONB,                 -- additional context
  ip_address          INET,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_actor ON tmg_audit_log(actor_id, created_at);
CREATE INDEX idx_audit_target ON tmg_audit_log(target_type, target_id, created_at);
CREATE INDEX idx_audit_action ON tmg_audit_log(action, created_at);

COMMENT ON TABLE tmg_audit_log IS
  'Append-only audit trail for all significant platform actions. 7 year retention minimum.';

-- Data deletion requests (participants can request deletion subject to legal retention)
CREATE TABLE IF NOT EXISTS tmg_deletion_requests (
  id                  SERIAL PRIMARY KEY,
  participant_id      INTEGER NOT NULL,
  requested_at        TIMESTAMPTZ DEFAULT NOW(),
  status              VARCHAR(50) DEFAULT 'pending',  -- pending, approved, partial, completed
  legal_hold          BOOLEAN DEFAULT FALSE,   -- records under legal hold cannot be deleted
  legal_hold_reason   TEXT,
  processed_at        TIMESTAMPTZ,
  processed_by        INTEGER,
  notes               TEXT
);

COMMENT ON TABLE tmg_deletion_requests IS
  'Participant data deletion requests. Subject to 7 year legal retention requirement.';


-- ============================================================
-- SECTION 8: API ENDPOINT REFERENCE (for Express routes)
-- ============================================================
-- These are the endpoints Deb needs to build in Node/Express.
-- Each endpoint references the tables above.
--
-- AI ENDPOINTS (three only - no extra agents):
--   POST /api/ai/intake-summary
--     Input:  { participant_id, intake_id }
--     Output: { summary_text, domain_tags, goal_suggestions }
--     Source: tmg_fca_intake + tmg_translator_terms + tmg_improvement_markers
--
--   POST /api/ai/monthly-snapshot-draft
--     Input:  { participant_id, month_year }
--     Output: { layer1, layer2, layer3, nonlinear_statement, outcome_tags }
--     Source: tmg_daily_note_structured + tmg_participant_checkin
--             + tmg_improvement_markers + tmg_banned_terms
--
--   POST /api/ai/event-log-helper (optional)
--     Input:  { participant_id, session_context }
--     Output: { suggested_impact_tags, suggested_outcome_text }
--     Source: tmg_translator_terms + tmg_improvement_markers
--
-- CONSENT ENDPOINTS:
--   POST   /api/consent/grant             - participant grants worker access
--   PATCH  /api/consent/:id/revoke        - participant revokes worker access
--   GET    /api/consent/participant/:id   - get all consent records for participant
--
-- EXTERNAL WORKER ENDPOINTS:
--   POST   /api/external/invite           - participant sends invitation
--   GET    /api/external/verify/:token    - worker verifies token
--   POST   /api/external/note            - worker submits note
--   PATCH  /api/external/note/:id/approve - participant approves
--   PATCH  /api/external/note/:id/reject  - participant rejects
--
-- EVIDENCE ENDPOINTS:
--   POST   /api/intake                    - submit FCA intake
--   POST   /api/daily-note               - submit daily note (validates goals + domains)
--   POST   /api/checkin                  - submit participant check-in
--   GET    /api/snapshot/:participant_id/:month_year  - get snapshot
--   PATCH  /api/snapshot/:id/approve     - participant approves snapshot
--   POST   /api/snapshot/:id/addendum    - add addendum to locked snapshot
--   GET    /api/snapshot/:id/export      - export as PDF
--
-- INVOICE ENDPOINTS:
--   POST   /api/invoices                 - create invoice
--   PATCH  /api/invoices/:id/submit      - submit to plan manager
--   GET    /api/invoices/worker/:id      - worker's invoices
--   GET    /api/invoices/participant/:id - participant's invoices
-- ============================================================


-- ============================================================
-- VERIFICATION QUERIES
-- Run these to confirm tables were created correctly
-- ============================================================

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'tmg_%'
ORDER BY table_name;

-- Expected output (20 tables):
-- tmg_audit_log
-- tmg_banned_terms
-- tmg_consent
-- tmg_daily_note_addendum
-- tmg_daily_note_private
-- tmg_daily_note_structured
-- tmg_deletion_requests
-- tmg_external_support_notes
-- tmg_external_worker_invitations
-- tmg_fca_intake
-- tmg_improvement_markers
-- tmg_invoice_audit
-- tmg_invoices
-- tmg_monthly_snapshot
-- tmg_notifications
-- tmg_participant_checkin
-- tmg_participant_goals
-- tmg_snapshot_addendum
-- tmg_support_banding
-- tmg_terminology_registry
-- tmg_translator_terms

```
