import crypto from 'node:crypto';
import type { Request } from 'express';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { unauthorized } from '../middleware/errors.js';
import { asInet, asUserAgent } from '../utils/clientInfo.js';

/**
 * Rotating refresh tokens — the only server-side session state in the app.
 *
 * An access token is a short JWT that nothing can revoke, so it is deliberately
 * near-worthless on its own: 15 minutes, and the client has to come back here
 * for the next one. This is where suspension, sign-out and revocation actually
 * take effect.
 *
 * Every refresh consumes the token it was given and issues a new one, so a
 * stolen token is only usable until the real client next refreshes. At that
 * point one of the two presents an already-rotated token, which is the signal
 * that the chain leaked — `family` is what lets us revoke the whole chain
 * rather than the single row, since we cannot tell thief from victim.
 */

/** 48 bytes of CSPRNG. base64url so it survives headers, bodies and logs intact. */
const TOKEN_BYTES = 48;

const UNIT_MS = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 } as const;

/** Accepts the `30d` / `12h` / `15m` / `30s` shape the TTL env vars already use. */
export function durationToMs(value: string): number {
  const match = /^(\d+)\s*([smhd])$/.exec(value.trim());
  if (!match) {
    throw new Error(`Unsupported duration: "${value}". Expected something like 15m, 12h or 30d.`);
  }
  return Number(match[1]) * UNIT_MS[match[2] as keyof typeof UNIT_MS];
}

/**
 * Only the hash is stored. The token is high-entropy random, not a password,
 * so a fast digest is the right tool — bcrypt here would buy nothing and cost
 * ~250ms on the hot path.
 */
const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

const mint = () => crypto.randomBytes(TOKEN_BYTES).toString('base64url');

const expiryFromNow = () => new Date(Date.now() + durationToMs(env.refreshTtl));

/** Rows nobody can use again. Cleared as we go so no cron job is needed. */
function pruneDeadTokens(userId: number) {
  return prisma.refreshToken.deleteMany({
    where: {
      user_id: userId,
      OR: [{ expires_at: { lt: new Date() } }, { revoked_at: { not: null } }],
    },
  });
}

/**
 * Starts a new chain. Called on sign-in and sign-up — never on refresh, which
 * must stay in the family it was handed.
 */
export async function issueRefreshToken(req: Request, userId: number): Promise<string> {
  // Best-effort tidy-up; a failure here must not cost someone their sign-in.
  await pruneDeadTokens(userId).catch(() => undefined);

  const token = mint();
  await prisma.refreshToken.create({
    data: {
      user_id: userId,
      family: crypto.randomUUID(),
      token_hash: hashToken(token),
      expires_at: expiryFromNow(),
      user_agent: asUserAgent(req),
      ip_address: asInet(req.ip),
    },
  });
  return token;
}

/**
 * Consumes `token` and issues its successor in the same family.
 *
 * Throws 401 on anything unusable, so the caller never has to tell the cases
 * apart — every one of them means the same thing to the client: sign in again.
 */
export async function rotateRefreshToken(
  req: Request,
  token: string
): Promise<{ userId: number; token: string }> {
  const existing = await prisma.refreshToken.findUnique({
    where: { token_hash: hashToken(token) },
  });

  // Unknown token: never issued, or already pruned. Nothing to revoke.
  if (!existing) throw unauthorized('Your session has ended. Please sign in again.');

  // Already rotated or explicitly signed out. Someone is replaying a token
  // that should be dead, and we cannot tell which side of the chain is honest
  // — so the whole family goes, which signs every device on it out.
  if (existing.revoked_at) {
    await prisma.refreshToken.updateMany({
      where: { family: existing.family, revoked_at: null },
      data: { revoked_at: new Date() },
    });
    throw unauthorized('Your session has ended. Please sign in again.');
  }

  if (existing.expires_at <= new Date()) {
    await prisma.refreshToken.update({
      where: { id: existing.id },
      data: { revoked_at: new Date() },
    });
    throw unauthorized('Your session has expired. Please sign in again.');
  }

  const next = mint();

  // One transaction: there must never be a moment where the old token is spent
  // and the new one does not exist, or the client is locked out by a crash.
  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: existing.id },
      data: { revoked_at: new Date() },
    }),
    prisma.refreshToken.create({
      data: {
        user_id: existing.user_id,
        family: existing.family,
        token_hash: hashToken(next),
        expires_at: expiryFromNow(),
        user_agent: asUserAgent(req),
        ip_address: asInet(req.ip),
      },
    }),
  ]);

  return { userId: existing.user_id, token: next };
}

/**
 * Sign-out. Revokes the family rather than the single row, so signing out on a
 * device ends that device's chain outright instead of leaving its predecessor
 * replayable. Silent on an unknown token — sign-out has nothing to report and
 * nothing to leak.
 */
export async function revokeRefreshToken(token: string): Promise<void> {
  const existing = await prisma.refreshToken.findUnique({
    where: { token_hash: hashToken(token) },
    select: { family: true },
  });
  if (!existing) return;

  await prisma.refreshToken.updateMany({
    where: { family: existing.family, revoked_at: null },
    data: { revoked_at: new Date() },
  });
}

/**
 * Ends every session an account has. Not wired to a route yet — this is what a
 * password change and an admin suspension will call.
 */
export function revokeAllRefreshTokens(userId: number): Promise<unknown> {
  return prisma.refreshToken.updateMany({
    where: { user_id: userId, revoked_at: null },
    data: { revoked_at: new Date() },
  });
}
