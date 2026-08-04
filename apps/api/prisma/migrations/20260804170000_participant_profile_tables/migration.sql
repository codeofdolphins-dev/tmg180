-- Final Override P1-01/02/03: participant_profiles / _sections / _answers.
-- Section & question definitions live in @tmg180/shared, not the database —
-- answers are (question_key -> JSONB) rows keyed by the shared definitions.

-- CreateTable
CREATE TABLE "tmg_participant_profiles" (
    "id" SERIAL NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'in_progress',
    "last_section_key" VARCHAR(100),
    "completed_sections" INTEGER NOT NULL DEFAULT 0,
    "total_sections" INTEGER NOT NULL DEFAULT 11,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_participant_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_participant_profile_sections" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "section_key" VARCHAR(100) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'not_started',
    "completed_at" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_participant_profile_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_participant_profile_answers" (
    "id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "question_key" VARCHAR(100) NOT NULL,
    "value" JSONB NOT NULL,
    "visibility" VARCHAR(50) NOT NULL DEFAULT 'participant_private',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_participant_profile_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tmg_participant_profiles_participant_id_key" ON "tmg_participant_profiles"("participant_id");

-- CreateIndex
CREATE UNIQUE INDEX "tmg_participant_profile_sections_profile_id_section_key_key" ON "tmg_participant_profile_sections"("profile_id", "section_key");

-- CreateIndex
CREATE UNIQUE INDEX "tmg_participant_profile_answers_section_id_question_key_key" ON "tmg_participant_profile_answers"("section_id", "question_key");

-- AddForeignKey
ALTER TABLE "tmg_participant_profiles" ADD CONSTRAINT "tmg_participant_profiles_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_participant_profile_sections" ADD CONSTRAINT "tmg_participant_profile_sections_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "tmg_participant_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_participant_profile_answers" ADD CONSTRAINT "tmg_participant_profile_answers_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "tmg_participant_profile_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
