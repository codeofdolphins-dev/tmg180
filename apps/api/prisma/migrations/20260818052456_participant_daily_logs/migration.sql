-- DropForeignKey
ALTER TABLE "tmg_daily_note_structured" DROP CONSTRAINT "tmg_daily_note_structured_worker_id_fkey";

-- AlterTable
ALTER TABLE "tmg_daily_note_addendum" ADD COLUMN     "reason" VARCHAR(255);

-- AlterTable
ALTER TABLE "tmg_daily_note_structured" ADD COLUMN     "additional_notes" TEXT,
ADD COLUMN     "author_id" INTEGER,
ADD COLUMN     "author_role" VARCHAR(50),
ADD COLUMN     "end_time" TIME,
ADD COLUMN     "impact_text" TEXT,
ADD COLUMN     "start_time" TIME,
ADD COLUMN     "support_text" TEXT,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "worker_id" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'draft',
ALTER COLUMN "submitted_at" DROP NOT NULL,
ALTER COLUMN "submitted_at" DROP DEFAULT,
ALTER COLUMN "is_locked" SET DEFAULT false;

-- CreateIndex
CREATE INDEX "tmg_daily_note_structured_author_id_session_date_idx" ON "tmg_daily_note_structured"("author_id", "session_date");

-- AddForeignKey
ALTER TABLE "tmg_daily_note_structured" ADD CONSTRAINT "tmg_daily_note_structured_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "tmg_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_daily_note_structured" ADD CONSTRAINT "tmg_daily_note_structured_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "tmg_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
