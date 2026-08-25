import { defineConfig } from 'prisma/config';

// Node 22+ reads .env natively, so we skip the dotenv dependency. The CLI also
// runs in CI/containers where the vars are already exported — a missing file
// there is expected, not an error.
try {
  process.loadEnvFile();
} catch {
  // No .env on disk; fall back to whatever the shell already provides.
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // Runs on `prisma migrate reset` too, so a reset database still has a
    // governance account to sign in with.
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
