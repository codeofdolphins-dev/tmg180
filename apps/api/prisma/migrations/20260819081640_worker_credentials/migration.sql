-- CreateTable
CREATE TABLE "tmg_worker_credentials" (
    "id" SERIAL NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "credential_type" VARCHAR(50) NOT NULL,
    "issued_at" DATE,
    "expires_at" DATE,
    "verified_at" TIMESTAMPTZ,
    "reference" VARCHAR(255),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tmg_worker_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tmg_worker_credentials_worker_id_idx" ON "tmg_worker_credentials"("worker_id");

-- CreateIndex
CREATE INDEX "tmg_worker_credentials_expires_at_idx" ON "tmg_worker_credentials"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "tmg_worker_credentials_worker_id_credential_type_key" ON "tmg_worker_credentials"("worker_id", "credential_type");

-- AddForeignKey
ALTER TABLE "tmg_worker_credentials" ADD CONSTRAINT "tmg_worker_credentials_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "tmg_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
