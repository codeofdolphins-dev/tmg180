-- CreateTable
CREATE TABLE "tmg_participant_privacy_settings" (
    "id" SERIAL NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_participant_privacy_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tmg_participant_privacy_settings_participant_id_key" ON "tmg_participant_privacy_settings"("participant_id");

-- AddForeignKey
ALTER TABLE "tmg_participant_privacy_settings" ADD CONSTRAINT "tmg_participant_privacy_settings_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
