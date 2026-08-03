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
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
