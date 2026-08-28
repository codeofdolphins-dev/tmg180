-- CreateTable
CREATE TABLE "tmg_snapshot_share_links" (
    "id" SERIAL NOT NULL,
    "snapshot_id" INTEGER NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "token_hash" VARCHAR(64) NOT NULL,
    "audience" VARCHAR(50) NOT NULL,
    "allow_download" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMPTZ,
    "last_opened_at" TIMESTAMPTZ,
    "open_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tmg_snapshot_share_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_concerns" (
    "id" SERIAL NOT NULL,
    "raised_by" INTEGER NOT NULL,
    "raised_by_role" VARCHAR(50) NOT NULL,
    "kind" VARCHAR(20) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "relates_to" VARCHAR(20) NOT NULL,
    "about" VARCHAR(255),
    "description" TEXT NOT NULL,
    "what_would_help" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'received',
    "acknowledged_at" TIMESTAMPTZ,
    "referred_to" VARCHAR(255),
    "referred_at" TIMESTAMPTZ,
    "closed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_concerns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_concern_responses" (
    "id" SERIAL NOT NULL,
    "concern_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "author_role" VARCHAR(50) NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_concern_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tmg_snapshot_share_links_token_hash_key" ON "tmg_snapshot_share_links"("token_hash");

-- CreateIndex
CREATE INDEX "tmg_snapshot_share_links_snapshot_id_status_idx" ON "tmg_snapshot_share_links"("snapshot_id", "status");

-- CreateIndex
CREATE INDEX "tmg_snapshot_share_links_participant_id_status_idx" ON "tmg_snapshot_share_links"("participant_id", "status");

-- CreateIndex
CREATE INDEX "tmg_concerns_raised_by_created_at_idx" ON "tmg_concerns"("raised_by", "created_at");

-- CreateIndex
CREATE INDEX "tmg_concerns_status_created_at_idx" ON "tmg_concerns"("status", "created_at");

-- CreateIndex
CREATE INDEX "tmg_concern_responses_concern_id_created_at_idx" ON "tmg_concern_responses"("concern_id", "created_at");

-- AddForeignKey
ALTER TABLE "tmg_snapshot_share_links" ADD CONSTRAINT "tmg_snapshot_share_links_snapshot_id_fkey" FOREIGN KEY ("snapshot_id") REFERENCES "tmg_monthly_snapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_snapshot_share_links" ADD CONSTRAINT "tmg_snapshot_share_links_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_concerns" ADD CONSTRAINT "tmg_concerns_raised_by_fkey" FOREIGN KEY ("raised_by") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_concern_responses" ADD CONSTRAINT "tmg_concern_responses_concern_id_fkey" FOREIGN KEY ("concern_id") REFERENCES "tmg_concerns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_concern_responses" ADD CONSTRAINT "tmg_concern_responses_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
