-- CreateTable
CREATE TABLE "tmg_worker_relational_profiles" (
    "id" SERIAL NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "display_name" VARCHAR(120),
    "relational_intro" TEXT,
    "natural_support_style" TEXT,
    "communication_style" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferred_environments" TEXT,
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "participants_appreciate" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "boundaries_and_fit" TEXT,
    "values_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "support_philosophy" VARCHAR(255),
    "opt_in" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_worker_relational_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_worker_profile_supporting_details" (
    "id" SERIAL NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "support_areas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "availability" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "location_area" VARCHAR(120),
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "experience_years" INTEGER,
    "contact_preference" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_worker_profile_supporting_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tmg_worker_relational_profiles_worker_id_key" ON "tmg_worker_relational_profiles"("worker_id");

-- CreateIndex
CREATE INDEX "tmg_worker_relational_profiles_status_idx" ON "tmg_worker_relational_profiles"("status");

-- CreateIndex
CREATE UNIQUE INDEX "tmg_worker_profile_supporting_details_worker_id_key" ON "tmg_worker_profile_supporting_details"("worker_id");

-- AddForeignKey
ALTER TABLE "tmg_worker_relational_profiles" ADD CONSTRAINT "tmg_worker_relational_profiles_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_worker_profile_supporting_details" ADD CONSTRAINT "tmg_worker_profile_supporting_details_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
