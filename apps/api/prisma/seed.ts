/**
 * Baseline seed: the Platform Governance (admin) account.
 *
 * Admin is never self-served — `SELF_SIGNUP_ROLES` is participant + worker
 * only, because the Technical Brief treats platform governance as a separate
 * data layer that is *provisioned*, not signed up for. This script is that
 * provisioning step, so a fresh database has someone who can sign in to the
 * governance console.
 *
 * It seeds an account and nothing else — no invented participants, workers,
 * reports or incidents. Governance screens read real platform activity, and
 * demo rows there would misrepresent it.
 *
 * Re-runnable: an existing account is left alone apart from being re-activated
 * and given the admin role if it somehow lost either. The password is never
 * reset on an existing account — use the forgot-password flow for that.
 *
 *   cd apps/api && pnpm db:seed
 *
 * Credentials come from the environment; the dev defaults below are only
 * allowed outside production:
 *   SEED_ADMIN_EMAIL      default admin@tmg180.test
 *   SEED_ADMIN_PASSWORD   default Governance1! (dev only)
 *   SEED_ADMIN_NAME       default Platform Governance
 */
import { ACCOUNT_STATUS, ROLES } from '@tmg180/shared';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/config/prisma.js';
import { env } from '../src/config/env.js';

const DEV_DEFAULTS = {
  email: 'admin@tmg180.test',
  password: '12345678',
  name: 'Platform Governance',
};

function credentials() {
  const email = (process.env.SEED_ADMIN_EMAIL ?? DEV_DEFAULTS.email).trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? DEV_DEFAULTS.password;
  const name = (process.env.SEED_ADMIN_NAME ?? DEV_DEFAULTS.name).trim();

  // A known-public password must never reach a real environment.
  if (env.isProduction && (!process.env.SEED_ADMIN_EMAIL || !process.env.SEED_ADMIN_PASSWORD)) {
    throw new Error(
      'Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD before seeding in production — the dev defaults are public.'
    );
  }
  if (password.length < 8) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 8 characters.');
  }

  return { email, password, name };
}

async function main() {
  const { email, password, name } = credentials();

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, roles: true, status: true },
  });

  if (existing) {
    const roles = existing.roles.includes(ROLES.ADMIN)
      ? existing.roles
      : [...existing.roles, ROLES.ADMIN];
    const needsRepair =
      roles.length !== existing.roles.length || existing.status !== ACCOUNT_STATUS.ACTIVE;

    if (needsRepair) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { roles, status: ACCOUNT_STATUS.ACTIVE },
      });
      console.log(`↻ ${email} already existed — restored admin role / active status.`);
    } else {
      console.log(`✓ ${email} already provisioned — nothing to do.`);
    }
    console.log('  Password unchanged. Use the forgot-password flow to reset it.');
    return;
  }

  const user = await prisma.user.create({
    data: {
      email,
      full_name: name,
      password_hash: await bcrypt.hash(password, env.BCRYPT_SALT),
      roles: [ROLES.ADMIN],
      status: ACCOUNT_STATUS.ACTIVE,
    },
    select: { id: true },
  });

  // Governance accounts exist outside the self-signup path, so the audit trail
  // is the only record of how this one came to be.
  await prisma.auditLog.create({
    data: {
      actor_id: user.id,
      actor_role: ROLES.ADMIN,
      action: 'account_created',
      target_type: 'user',
      target_id: user.id,
      details: { provisioned: true, source: 'prisma/seed.ts' },
    },
  });

  console.log(`✓ Provisioned Platform Governance account: ${email}`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`  Password: ${password}  (dev default — change it before any shared environment)`);
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
