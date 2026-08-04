/*
  Warnings:

  - You are about to drop the column `replaced_by` on the `tmg_refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `sessions_valid_from` on the `tmg_users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tmg_refresh_tokens" DROP COLUMN "replaced_by";

-- AlterTable
ALTER TABLE "tmg_users" DROP COLUMN "sessions_valid_from";
