-- CreateTable
CREATE TABLE "tmg_refresh_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token_hash" VARCHAR(64) NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "revoked_at" TIMESTAMPTZ,
    "replaced_by" INTEGER,
    "user_agent" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tmg_password_resets" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token_hash" VARCHAR(64) NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "used_at" TIMESTAMPTZ,
    "requested_ip" INET,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tmg_refresh_tokens_token_hash_key" ON "tmg_refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "tmg_refresh_tokens_user_id_revoked_at_idx" ON "tmg_refresh_tokens"("user_id", "revoked_at");

-- CreateIndex
CREATE INDEX "tmg_refresh_tokens_expires_at_idx" ON "tmg_refresh_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "tmg_password_resets_token_hash_key" ON "tmg_password_resets"("token_hash");

-- CreateIndex
CREATE INDEX "tmg_password_resets_user_id_used_at_idx" ON "tmg_password_resets"("user_id", "used_at");

-- AddForeignKey
ALTER TABLE "tmg_refresh_tokens" ADD CONSTRAINT "tmg_refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmg_password_resets" ADD CONSTRAINT "tmg_password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
