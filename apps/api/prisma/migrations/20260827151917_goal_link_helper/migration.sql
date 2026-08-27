-- AlterTable
ALTER TABLE "tmg_daily_note_structured" ADD COLUMN     "ndis_bucket" VARCHAR(20),
ADD COLUMN     "rn_rationale_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tmg_functional_grouping_code" VARCHAR(40);

-- CreateTable
CREATE TABLE "tmg_goal_link_helper" (
    "support_domain_code" TEXT NOT NULL,
    "ndis_support_domain" TEXT NOT NULL,
    "tmg_functional_grouping" TEXT NOT NULL,
    "ndis_bucket_default" TEXT NOT NULL,
    "includes_examples" TEXT,
    "common_goal_links_plain" TEXT,
    "functional_barrier_plain" TEXT,
    "rn_rationale_tags" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_goal_link_helper_pkey" PRIMARY KEY ("support_domain_code")
);

-- Goal Link Helper pack: the bucket enum, as the pack SQL declares it.
ALTER TABLE "tmg_goal_link_helper" ADD CONSTRAINT "tmg_goal_link_helper_bucket_check" CHECK ("ndis_bucket_default" IN ('CORE','CAPACITY_BUILDING','CAPITAL'));
ALTER TABLE "tmg_daily_note_structured" ADD CONSTRAINT "tmg_daily_note_structured_bucket_check" CHECK ("ndis_bucket" IS NULL OR "ndis_bucket" IN ('CORE','CAPACITY_BUILDING','CAPITAL'));
