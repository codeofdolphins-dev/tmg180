-- CreateTable
CREATE TABLE "tmg_users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255),
    "full_name" VARCHAR(255) NOT NULL,
    "roles" VARCHAR(50)[],
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "ndis_number" VARCHAR(50),
    "last_login_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_terminology_registry" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    "context" VARCHAR(100),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_terminology_registry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_banned_terms" (
    "id" SERIAL NOT NULL,
    "banned_term" VARCHAR(255) NOT NULL,
    "replacement" VARCHAR(255) NOT NULL,
    "context" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_banned_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_improvement_markers" (
    "id" SERIAL NOT NULL,
    "marker_type" VARCHAR(100) NOT NULL,
    "marker_text" TEXT NOT NULL,
    "domain_tag" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_improvement_markers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_support_banding" (
    "id" SERIAL NOT NULL,
    "band_code" VARCHAR(50) NOT NULL,
    "band_label" TEXT NOT NULL,
    "description" TEXT,
    "min_frequency" INTEGER,
    "max_frequency" INTEGER,
    "intensity_range_low" INTEGER,
    "intensity_range_high" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_support_banding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_translator_terms" (
    "id" SERIAL NOT NULL,
    "ndis_term" VARCHAR(255) NOT NULL,
    "relational_term" VARCHAR(255) NOT NULL,
    "functional_domain" VARCHAR(100),
    "context" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_translator_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_fca_intake" (
    "id" SERIAL NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" VARCHAR(50) DEFAULT 'draft',
    "submitted_at" TIMESTAMPTZ,
    "personality_tags" TEXT[],
    "meaning_tags" TEXT[],
    "strengths_tags" TEXT[],
    "goals_tags" TEXT[],
    "mobility_tags" TEXT[],
    "mobility_notes" TEXT,
    "communication_tags" TEXT[],
    "communication_notes" TEXT,
    "social_tags" TEXT[],
    "social_notes" TEXT,
    "selfcare_tags" TEXT[],
    "selfcare_notes" TEXT,
    "learning_tags" TEXT[],
    "learning_notes" TEXT,
    "selfmanagement_tags" TEXT[],
    "selfmanagement_notes" TEXT,
    "community_tags" TEXT[],
    "health_tags" TEXT[],
    "equipment_tags" TEXT[],
    "support_pattern_tags" TEXT[],
    "fluctuation_notes" TEXT,
    "safety_tags" TEXT[],
    "safety_notes" TEXT,
    "substance_tags" TEXT[],
    "compat_style_tags" TEXT[],
    "compat_gender_tags" TEXT[],
    "compat_faith_tags" TEXT[],
    "compat_identity_tags" TEXT[],
    "compat_avoid_tags" TEXT[],
    "documentation_consent" TEXT[],
    "consent_declared" BOOLEAN DEFAULT false,
    "consent_declared_at" TIMESTAMPTZ,
    "ndis_goals" JSONB,
    "impairment_categories" TEXT[],
    "notice_of_impairments_uploaded" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_fca_intake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_participant_goals" (
    "id" SERIAL NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "intake_id" INTEGER,
    "goal_text" TEXT NOT NULL,
    "ndis_domain" VARCHAR(100),
    "ndis_domain_label" TEXT,
    "goal_order" INTEGER DEFAULT 1,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_participant_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_daily_note_private" (
    "id" SERIAL NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "session_date" DATE NOT NULL,
    "start_time" TIME,
    "end_time" TIME,
    "duration_minutes" INTEGER,
    "service_type" VARCHAR(100),
    "location" VARCHAR(255),
    "private_narrative" TEXT,
    "safety_narrative" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_locked" BOOLEAN DEFAULT true,

    CONSTRAINT "tmg_daily_note_private_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_daily_note_structured" (
    "id" SERIAL NOT NULL,
    "private_note_id" INTEGER,
    "worker_id" INTEGER NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "session_date" DATE NOT NULL,
    "duration_minutes" INTEGER,
    "service_type" VARCHAR(100),
    "location" VARCHAR(255),
    "goal_ids" INTEGER[],
    "goal_validated" BOOLEAN DEFAULT false,
    "domain_tags" VARCHAR(50)[],
    "domain_validated" BOOLEAN DEFAULT false,
    "impact_tags" TEXT[],
    "support_type_tags" TEXT[],
    "outcome_tags" TEXT[],
    "outcome_text" TEXT,
    "baseline_comparison" VARCHAR(50),
    "baseline_factors" TEXT[],
    "baseline_notes" TEXT,
    "participant_voice" TEXT,
    "safety_note" TEXT,
    "status" VARCHAR(50) DEFAULT 'submitted',
    "submitted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_locked" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_daily_note_structured_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_daily_note_addendum" (
    "id" SERIAL NOT NULL,
    "note_id" INTEGER,
    "added_by" INTEGER NOT NULL,
    "added_by_role" VARCHAR(50) NOT NULL,
    "addendum_text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_daily_note_addendum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_participant_checkin" (
    "id" SERIAL NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "checkin_period" VARCHAR(50),
    "checkin_date" DATE NOT NULL,
    "impact_tags" TEXT[],
    "impact_notes" TEXT,
    "intensity_rating" INTEGER,
    "helped_tags" TEXT[],
    "helped_notes" TEXT,
    "recovery_level" VARCHAR(100),
    "recovery_notes" TEXT,
    "goals_checkin_tags" TEXT[],
    "goals_notes" TEXT,
    "own_words" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_locked" BOOLEAN DEFAULT true,

    CONSTRAINT "tmg_participant_checkin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_monthly_snapshot" (
    "id" SERIAL NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "month_year" VARCHAR(7) NOT NULL,
    "version" INTEGER DEFAULT 1,
    "generated_from_notes" INTEGER[],
    "generated_from_checkins" INTEGER[],
    "generated_at" TIMESTAMPTZ,
    "participant_story" TEXT,
    "what_mattered" TEXT,
    "what_got_in_way" TEXT,
    "what_helped" TEXT,
    "recovery_cost" TEXT,
    "next_month_intentions" TEXT,
    "participation_domains" TEXT[],
    "main_functional_impacts" TEXT,
    "frequency_pattern" TEXT,
    "recovery_cost_trend" TEXT,
    "supports_that_helped" TEXT,
    "when_support_unavailable" TEXT,
    "mobility_summary" TEXT,
    "communication_summary" TEXT,
    "social_summary" TEXT,
    "selfcare_summary" TEXT,
    "learning_summary" TEXT,
    "selfmanagement_summary" TEXT,
    "impairment_category" TEXT,
    "impairment_linkage" TEXT,
    "goal_linkage" TEXT,
    "outcome_tags" TEXT[],
    "outcome_highlights" TEXT,
    "nonlinear_statement" TEXT NOT NULL DEFAULT 'Capacity varied across the month, consistent with non-linear functioning. Participation improved with support scaffolding. This reflects supports working, not removal of impairment.',
    "status" VARCHAR(50) DEFAULT 'draft',
    "participant_approved" BOOLEAN DEFAULT false,
    "participant_approved_at" TIMESTAMPTZ,
    "participant_addendum" TEXT,
    "locked_at" TIMESTAMPTZ,
    "exported_at" TIMESTAMPTZ,
    "export_format" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_monthly_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_snapshot_addendum" (
    "id" SERIAL NOT NULL,
    "snapshot_id" INTEGER,
    "added_by" INTEGER NOT NULL,
    "added_by_role" VARCHAR(50) NOT NULL,
    "addendum_text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_snapshot_addendum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_consent" (
    "id" SERIAL NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "worker_id" INTEGER,
    "consent_type" VARCHAR(100) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "granted_at" TIMESTAMPTZ,
    "revoked_at" TIMESTAMPTZ,
    "revoked_reason" TEXT,
    "can_view_intake" BOOLEAN DEFAULT false,
    "can_view_snapshot" BOOLEAN DEFAULT false,
    "can_add_daily_note" BOOLEAN DEFAULT false,
    "can_view_checkins" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "superseded_by" INTEGER,

    CONSTRAINT "tmg_consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_external_worker_invitations" (
    "id" SERIAL NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "worker_name" VARCHAR(255) NOT NULL,
    "worker_email" VARCHAR(255) NOT NULL,
    "worker_role" VARCHAR(255),
    "token_hash" VARCHAR(255) NOT NULL,
    "status" VARCHAR(50) DEFAULT 'pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ DEFAULT (now() + '72:00:00'::interval),
    "accepted_at" TIMESTAMPTZ,
    "revoked_at" TIMESTAMPTZ,
    "revoked_by" INTEGER,
    "note_submitted" BOOLEAN DEFAULT false,
    "note_submitted_at" TIMESTAMPTZ,

    CONSTRAINT "tmg_external_worker_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_external_support_notes" (
    "id" SERIAL NOT NULL,
    "invitation_id" INTEGER,
    "participant_id" INTEGER NOT NULL,
    "external_worker_name" VARCHAR(255) NOT NULL,
    "external_worker_role" VARCHAR(255) NOT NULL,
    "session_date" DATE NOT NULL,
    "duration_minutes" INTEGER,
    "support_type_tags" TEXT[],
    "presentation_tags" TEXT[],
    "outcome_text" TEXT,
    "safety_note" TEXT,
    "status" VARCHAR(50) DEFAULT 'pending_review',
    "participant_reviewed_at" TIMESTAMPTZ,
    "participant_approved" BOOLEAN,
    "rejection_reason" TEXT,
    "submitted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_locked" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_external_support_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_invoices" (
    "id" SERIAL NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "daily_note_id" INTEGER,
    "service_date" DATE NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "support_item_number" VARCHAR(50),
    "support_item_name" TEXT,
    "support_category" VARCHAR(100),
    "unit_price" DECIMAL(10,2),
    "quantity" DECIMAL(10,2),
    "gst_applicable" BOOLEAN DEFAULT false,
    "total_amount" DECIMAL(10,2),
    "plan_manager_name" VARCHAR(255),
    "plan_manager_email" VARCHAR(255),
    "participant_ndis_number" VARCHAR(50),
    "status" VARCHAR(50) DEFAULT 'draft',
    "submitted_at" TIMESTAMPTZ,
    "approved_at" TIMESTAMPTZ,
    "paid_at" TIMESTAMPTZ,
    "rejected_at" TIMESTAMPTZ,
    "rejection_reason" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_invoice_audit" (
    "id" SERIAL NOT NULL,
    "invoice_id" INTEGER,
    "previous_status" VARCHAR(50),
    "new_status" VARCHAR(50),
    "changed_by" INTEGER,
    "changed_by_role" VARCHAR(50),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_invoice_audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_notifications" (
    "id" SERIAL NOT NULL,
    "recipient_id" INTEGER NOT NULL,
    "recipient_role" VARCHAR(50) NOT NULL,
    "notification_type" VARCHAR(100) NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "reference_id" INTEGER,
    "reference_type" VARCHAR(100),
    "is_read" BOOLEAN DEFAULT false,
    "read_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_audit_log" (
    "id" BIGSERIAL NOT NULL,
    "actor_id" INTEGER,
    "actor_role" VARCHAR(50),
    "action" VARCHAR(100) NOT NULL,
    "target_type" VARCHAR(100),
    "target_id" INTEGER,
    "details" JSONB,
    "ip_address" INET,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_deletion_requests" (
    "id" SERIAL NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "requested_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50) DEFAULT 'pending',
    "legal_hold" BOOLEAN DEFAULT false,
    "legal_hold_reason" TEXT,
    "processed_at" TIMESTAMPTZ,
    "processed_by" INTEGER,
    "notes" TEXT,

    CONSTRAINT "tmg_deletion_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tmg_users_email_key" ON "tmg_users"("email");

-- CreateIndex
CREATE INDEX "tmg_users_status_idx" ON "tmg_users"("status");

-- CreateIndex
CREATE INDEX "tmg_users_roles_idx" ON "tmg_users" USING GIN ("roles" array_ops);

-- CreateIndex
CREATE UNIQUE INDEX "tmg_terminology_registry_key_key" ON "tmg_terminology_registry"("key");

-- CreateIndex
CREATE INDEX "tmg_terminology_registry_context_idx" ON "tmg_terminology_registry"("context");

-- CreateIndex
CREATE UNIQUE INDEX "tmg_banned_terms_banned_term_key" ON "tmg_banned_terms"("banned_term");

-- CreateIndex
CREATE UNIQUE INDEX "tmg_support_banding_band_code_key" ON "tmg_support_banding"("band_code");

-- CreateIndex
CREATE INDEX "tmg_fca_intake_participant_id_idx" ON "tmg_fca_intake"("participant_id");

-- CreateIndex
CREATE INDEX "tmg_fca_intake_status_idx" ON "tmg_fca_intake"("status");

-- CreateIndex
CREATE INDEX "tmg_participant_goals_participant_id_idx" ON "tmg_participant_goals"("participant_id");

-- CreateIndex
CREATE INDEX "tmg_participant_goals_participant_id_is_active_idx" ON "tmg_participant_goals"("participant_id", "is_active");

-- CreateIndex
CREATE INDEX "tmg_daily_note_private_worker_id_session_date_idx" ON "tmg_daily_note_private"("worker_id", "session_date");

-- CreateIndex
CREATE INDEX "tmg_daily_note_structured_participant_id_session_date_idx" ON "tmg_daily_note_structured"("participant_id", "session_date");

-- CreateIndex
CREATE INDEX "tmg_daily_note_structured_worker_id_session_date_idx" ON "tmg_daily_note_structured"("worker_id", "session_date");

-- CreateIndex
CREATE INDEX "tmg_participant_checkin_participant_id_checkin_date_idx" ON "tmg_participant_checkin"("participant_id", "checkin_date");

-- CreateIndex
CREATE INDEX "tmg_monthly_snapshot_participant_id_month_year_idx" ON "tmg_monthly_snapshot"("participant_id", "month_year");

-- CreateIndex
CREATE UNIQUE INDEX "idx_snapshot_unique" ON "tmg_monthly_snapshot"("participant_id", "month_year", "version");

-- CreateIndex
CREATE INDEX "tmg_consent_participant_id_status_idx" ON "tmg_consent"("participant_id", "status");

-- CreateIndex
CREATE INDEX "tmg_consent_worker_id_status_idx" ON "tmg_consent"("worker_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "tmg_external_worker_invitations_token_hash_key" ON "tmg_external_worker_invitations"("token_hash");

-- CreateIndex
CREATE INDEX "tmg_external_worker_invitations_participant_id_idx" ON "tmg_external_worker_invitations"("participant_id");

-- CreateIndex
CREATE INDEX "tmg_external_worker_invitations_token_hash_idx" ON "tmg_external_worker_invitations"("token_hash");

-- CreateIndex
CREATE INDEX "tmg_external_worker_invitations_status_idx" ON "tmg_external_worker_invitations"("status");

-- CreateIndex
CREATE INDEX "tmg_external_support_notes_participant_id_session_date_idx" ON "tmg_external_support_notes"("participant_id", "session_date");

-- CreateIndex
CREATE INDEX "tmg_external_support_notes_participant_id_status_idx" ON "tmg_external_support_notes"("participant_id", "status");

-- CreateIndex
CREATE INDEX "tmg_invoices_worker_id_service_date_idx" ON "tmg_invoices"("worker_id", "service_date");

-- CreateIndex
CREATE INDEX "tmg_invoices_participant_id_idx" ON "tmg_invoices"("participant_id");

-- CreateIndex
CREATE INDEX "tmg_invoices_status_idx" ON "tmg_invoices"("status");

-- CreateIndex
CREATE INDEX "tmg_notifications_recipient_id_recipient_role_is_read_idx" ON "tmg_notifications"("recipient_id", "recipient_role", "is_read");

-- CreateIndex
CREATE INDEX "tmg_notifications_notification_type_created_at_idx" ON "tmg_notifications"("notification_type", "created_at");

-- CreateIndex
CREATE INDEX "tmg_audit_log_actor_id_created_at_idx" ON "tmg_audit_log"("actor_id", "created_at");

-- CreateIndex
CREATE INDEX "tmg_audit_log_target_type_target_id_created_at_idx" ON "tmg_audit_log"("target_type", "target_id", "created_at");

-- CreateIndex
CREATE INDEX "tmg_audit_log_action_created_at_idx" ON "tmg_audit_log"("action", "created_at");

-- AddForeignKey
ALTER TABLE "tmg_fca_intake" ADD CONSTRAINT "tmg_fca_intake_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_participant_goals" ADD CONSTRAINT "tmg_participant_goals_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_participant_goals" ADD CONSTRAINT "tmg_participant_goals_intake_id_fkey" FOREIGN KEY ("intake_id") REFERENCES "tmg_fca_intake"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_daily_note_private" ADD CONSTRAINT "tmg_daily_note_private_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_daily_note_private" ADD CONSTRAINT "tmg_daily_note_private_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_daily_note_structured" ADD CONSTRAINT "tmg_daily_note_structured_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_daily_note_structured" ADD CONSTRAINT "tmg_daily_note_structured_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_daily_note_structured" ADD CONSTRAINT "tmg_daily_note_structured_private_note_id_fkey" FOREIGN KEY ("private_note_id") REFERENCES "tmg_daily_note_private"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_daily_note_addendum" ADD CONSTRAINT "tmg_daily_note_addendum_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_daily_note_addendum" ADD CONSTRAINT "tmg_daily_note_addendum_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "tmg_daily_note_structured"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_participant_checkin" ADD CONSTRAINT "tmg_participant_checkin_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_monthly_snapshot" ADD CONSTRAINT "tmg_monthly_snapshot_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_snapshot_addendum" ADD CONSTRAINT "tmg_snapshot_addendum_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_snapshot_addendum" ADD CONSTRAINT "tmg_snapshot_addendum_snapshot_id_fkey" FOREIGN KEY ("snapshot_id") REFERENCES "tmg_monthly_snapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_consent" ADD CONSTRAINT "tmg_consent_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_consent" ADD CONSTRAINT "tmg_consent_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "tmg_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_consent" ADD CONSTRAINT "tmg_consent_superseded_by_fkey" FOREIGN KEY ("superseded_by") REFERENCES "tmg_consent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_external_worker_invitations" ADD CONSTRAINT "tmg_external_worker_invitations_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_external_worker_invitations" ADD CONSTRAINT "tmg_external_worker_invitations_revoked_by_fkey" FOREIGN KEY ("revoked_by") REFERENCES "tmg_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_external_support_notes" ADD CONSTRAINT "tmg_external_support_notes_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_external_support_notes" ADD CONSTRAINT "tmg_external_support_notes_invitation_id_fkey" FOREIGN KEY ("invitation_id") REFERENCES "tmg_external_worker_invitations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_invoices" ADD CONSTRAINT "tmg_invoices_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_invoices" ADD CONSTRAINT "tmg_invoices_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_invoices" ADD CONSTRAINT "tmg_invoices_daily_note_id_fkey" FOREIGN KEY ("daily_note_id") REFERENCES "tmg_daily_note_structured"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_invoice_audit" ADD CONSTRAINT "tmg_invoice_audit_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "tmg_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_invoice_audit" ADD CONSTRAINT "tmg_invoice_audit_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "tmg_invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_notifications" ADD CONSTRAINT "tmg_notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_audit_log" ADD CONSTRAINT "tmg_audit_log_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "tmg_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_deletion_requests" ADD CONSTRAINT "tmg_deletion_requests_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_deletion_requests" ADD CONSTRAINT "tmg_deletion_requests_processed_by_fkey" FOREIGN KEY ("processed_by") REFERENCES "tmg_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
