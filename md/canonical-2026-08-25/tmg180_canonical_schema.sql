-- TMG180 Personal Profile / Longitudinal Evidence Canonical Schema
-- Version: 2026-08-25.1
-- IMPORTANT: participant-authored source content and participant responses are immutable historical facts.
-- AI/NDIS/functional interpretations MUST be stored separately and MUST NOT overwrite source content.

CREATE TABLE profile_definition (
    id UUID PRIMARY KEY,
    bundle_id TEXT NOT NULL,
    version TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft','active','superseded')),
    source_sha256 TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    activated_at TIMESTAMPTZ,
    supersedes_id UUID REFERENCES profile_definition(id),
    UNIQUE(bundle_id, version)
);

CREATE TABLE profile_module_definition (
    id UUID PRIMARY KEY,
    profile_definition_id UUID NOT NULL REFERENCES profile_definition(id),
    module_key TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    source_filename TEXT NOT NULL,
    source_title TEXT NOT NULL,
    source_sha256 TEXT NOT NULL,
    content_json JSONB NOT NULL,
    UNIQUE(profile_definition_id, module_key)
);

CREATE TABLE participant_profile (
    id UUID PRIMARY KEY,
    participant_id UUID NOT NULL,
    active_definition_id UUID NOT NULL REFERENCES profile_definition(id),
    status TEXT NOT NULL DEFAULT 'in_progress'
        CHECK (status IN ('in_progress','complete','archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE participant_profile_version (
    id UUID PRIMARY KEY,
    participant_profile_id UUID NOT NULL REFERENCES participant_profile(id),
    version_no INTEGER NOT NULL,
    definition_id UUID NOT NULL REFERENCES profile_definition(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by_actor_type TEXT NOT NULL
        CHECK (created_by_actor_type IN ('participant','authorised_supporter','system')),
    created_by_actor_id UUID,
    change_reason TEXT,
    snapshot_json JSONB NOT NULL,
    UNIQUE(participant_profile_id, version_no)
);

CREATE TABLE participant_profile_response (
    id UUID PRIMARY KEY,
    participant_profile_id UUID NOT NULL REFERENCES participant_profile(id),
    module_key TEXT NOT NULL,
    block_id TEXT NOT NULL,
    definition_version TEXT NOT NULL,
    response_json JSONB NOT NULL,
    -- exact display copy at time of response prevents later copy changes rewriting history
    prompt_snapshot TEXT NOT NULL,
    option_label_snapshot JSONB,
    participant_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    superseded_by UUID REFERENCES participant_profile_response(id)
);

CREATE INDEX idx_profile_response_profile_module
    ON participant_profile_response(participant_profile_id, module_key);

CREATE TABLE profile_share_grant (
    id UUID PRIMARY KEY,
    participant_profile_id UUID NOT NULL REFERENCES participant_profile(id),
    participant_id UUID NOT NULL,
    grantee_actor_type TEXT NOT NULL CHECK (grantee_actor_type IN ('worker','provider','nominee','other')),
    grantee_actor_id UUID NOT NULL,
    scope_type TEXT NOT NULL CHECK (scope_type IN ('full_profile','selected_modules')),
    module_keys JSONB,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    granted_by_participant BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE daily_note (
    id UUID PRIMARY KEY,
    participant_id UUID NOT NULL,
    worker_id UUID,
    profile_id UUID REFERENCES participant_profile(id),
    note_date DATE NOT NULL,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','final','amended')),
    participant_involvement TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    finalised_at TIMESTAMPTZ
);

CREATE TABLE daily_note_response (
    id UUID PRIMARY KEY,
    daily_note_id UUID NOT NULL REFERENCES daily_note(id),
    block_id TEXT NOT NULL,
    definition_version TEXT NOT NULL,
    response_json JSONB NOT NULL,
    prompt_snapshot TEXT NOT NULL,
    option_label_snapshot JSONB,
    provenance_type TEXT NOT NULL DEFAULT 'worker_record'
        CHECK (provenance_type IN ('participant_report','worker_observation','worker_record','professional_evidence')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE monthly_snapshot (
    id UUID PRIMARY KEY,
    participant_id UUID NOT NULL,
    profile_id UUID REFERENCES participant_profile(id),
    month_start DATE NOT NULL,
    month_end DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','final','amended')),
    participant_review_status TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    finalised_at TIMESTAMPTZ
);

CREATE TABLE monthly_snapshot_response (
    id UUID PRIMARY KEY,
    monthly_snapshot_id UUID NOT NULL REFERENCES monthly_snapshot(id),
    block_id TEXT NOT NULL,
    definition_version TEXT NOT NULL,
    response_json JSONB NOT NULL,
    prompt_snapshot TEXT NOT NULL,
    option_label_snapshot JSONB,
    provenance_type TEXT NOT NULL DEFAULT 'shared_summary'
        CHECK (provenance_type IN ('participant_report','worker_observation','shared_summary')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE evidence_link (
    id UUID PRIMARY KEY,
    participant_id UUID NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN (
        'profile_response','daily_note_response','monthly_snapshot_response','professional_document'
    )),
    source_id UUID NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('goal','functional_domain','report_section','profile_module')),
    target_key TEXT NOT NULL,
    link_basis TEXT NOT NULL CHECK (link_basis IN ('explicit_user_selection','worker_selection','configured_mapping','human_reviewed_ai')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE derived_interpretation (
    id UUID PRIMARY KEY,
    participant_id UUID NOT NULL,
    source_type TEXT NOT NULL,
    source_id UUID NOT NULL,
    interpretation_type TEXT NOT NULL CHECK (interpretation_type IN (
        'functional_language','ndis_language','longitudinal_pattern','report_draft'
    )),
    output_text TEXT NOT NULL,
    model_or_rule_version TEXT NOT NULL,
    provenance_json JSONB NOT NULL,
    review_status TEXT NOT NULL DEFAULT 'unreviewed'
        CHECK (review_status IN ('unreviewed','accepted','edited','rejected')),
    reviewed_by_actor_type TEXT,
    reviewed_by_actor_id UUID,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_event (
    id UUID PRIMARY KEY,
    participant_id UUID,
    actor_type TEXT NOT NULL,
    actor_id UUID,
    action TEXT NOT NULL,
    object_type TEXT NOT NULL,
    object_id UUID,
    metadata_json JSONB,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Required invariants:
-- 1. Never UPDATE source response text to replace it with AI/NDIS/functional wording.
-- 2. Profile changes create a new response row and supersede the prior row; prior rows remain queryable.
-- 3. Worker access requires an active participant-issued profile_share_grant.
-- 4. Daily/monthly records reference profile context but never rewrite participant_profile_response.
-- 5. All derived_interpretation records have provenance and human-review state.
