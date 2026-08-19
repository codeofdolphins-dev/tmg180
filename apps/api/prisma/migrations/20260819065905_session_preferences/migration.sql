-- CreateTable
CREATE TABLE "tmg_participant_session_preferences" (
    "id" SERIAL NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "support_focus" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "availability" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "communication_format" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "setting" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "relational_style" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_participant_session_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tmg_participant_session_preferences_participant_id_key" ON "tmg_participant_session_preferences"("participant_id");

-- AddForeignKey
ALTER TABLE "tmg_participant_session_preferences" ADD CONSTRAINT "tmg_participant_session_preferences_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
