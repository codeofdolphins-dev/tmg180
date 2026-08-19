-- CreateTable
CREATE TABLE "tmg_worker_governance_acknowledgements" (
    "id" SERIAL NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "item_key" VARCHAR(60) NOT NULL,
    "item_version" VARCHAR(20) NOT NULL,
    "acknowledged_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_worker_governance_acknowledgements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_worker_governance_notes" (
    "id" SERIAL NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "item_key" VARCHAR(60) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_worker_governance_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_worker_learning_progress" (
    "id" SERIAL NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "resource_slug" VARCHAR(80) NOT NULL,
    "opened_at" TIMESTAMPTZ,
    "open_count" INTEGER NOT NULL DEFAULT 0,
    "saved_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_worker_learning_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tmg_worker_governance_acknowledgements_worker_id_idx" ON "tmg_worker_governance_acknowledgements"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "tmg_worker_governance_acknowledgements_worker_id_item_key_i_key" ON "tmg_worker_governance_acknowledgements"("worker_id", "item_key", "item_version");

-- CreateIndex
CREATE INDEX "tmg_worker_governance_notes_worker_id_idx" ON "tmg_worker_governance_notes"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "tmg_worker_governance_notes_worker_id_item_key_key" ON "tmg_worker_governance_notes"("worker_id", "item_key");

-- CreateIndex
CREATE INDEX "tmg_worker_learning_progress_worker_id_idx" ON "tmg_worker_learning_progress"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "tmg_worker_learning_progress_worker_id_resource_slug_key" ON "tmg_worker_learning_progress"("worker_id", "resource_slug");

-- AddForeignKey
ALTER TABLE "tmg_worker_governance_acknowledgements" ADD CONSTRAINT "tmg_worker_governance_acknowledgements_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_worker_governance_notes" ADD CONSTRAINT "tmg_worker_governance_notes_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_worker_learning_progress" ADD CONSTRAINT "tmg_worker_learning_progress_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
