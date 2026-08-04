/*
  Warnings:

  - You are about to drop the `tmg_refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the `tmg_password_resets` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tmg_refresh_tokens" DROP CONSTRAINT "tmg_refresh_tokens_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tmg_password_resets" DROP CONSTRAINT "tmg_password_resets_user_id_fkey";

-- DropTable
DROP TABLE "tmg_refresh_tokens";

-- DropTable
DROP TABLE "tmg_password_resets";
