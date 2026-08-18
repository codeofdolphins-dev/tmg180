-- CreateTable
CREATE TABLE "tmg_refresh_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "family" UUID NOT NULL,
    "token_hash" VARCHAR(64) NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "revoked_at" TIMESTAMPTZ,
    "user_agent" VARCHAR(255),
    "ip_address" INET,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tmg_refresh_tokens_token_hash_key" ON "tmg_refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "tmg_refresh_tokens_user_id_revoked_at_idx" ON "tmg_refresh_tokens"("user_id", "revoked_at");

-- CreateIndex
CREATE INDEX "tmg_refresh_tokens_family_idx" ON "tmg_refresh_tokens"("family");

-- CreateIndex
CREATE INDEX "tmg_refresh_tokens_expires_at_idx" ON "tmg_refresh_tokens"("expires_at");

-- AddForeignKey
ALTER TABLE "tmg_refresh_tokens" ADD CONSTRAINT "tmg_refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tmg_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
