import bcrypt from 'bcryptjs';
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { isRole } from '@tmg180/shared';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { badRequest, unauthorized } from '../middleware/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * NOTE: the 21 net-new `tmg_*` tables in the DB pack contain no users table —
 * accounts are expected to come from the existing platform schema, which
 * Prisma does not model yet. These stay raw SQL until it does; Prisma's tagged
 * template parameterises every interpolated value, so this is not injectable.
 * Confirm the real table/column names with Deb before first migration.
 */
interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  full_name: string | null;
  role: string | null;
}

// Column lists must be written out literally — every `${}` in a $queryRaw
// template becomes a bound parameter, never inlined SQL.
const findUserByEmail = (email: string) =>
  prisma.$queryRaw<UserRow[]>`
    SELECT id, email, password_hash, full_name, role
    FROM users
    WHERE lower(email) = lower(${email})
    LIMIT 1
  `;

const findUserById = (id: number) =>
  prisma.$queryRaw<UserRow[]>`
    SELECT id, email, password_hash, full_name, role
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `;

/**
 * Compared against when the account is missing, so response timing does not
 * reveal which addresses have accounts.
 */
const DUMMY_HASH = '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidiu';

function signTokens(user: Pick<UserRow, 'id' | 'role'>) {
  const accessToken = jwt.sign(
    { sub: String(user.id), role: user.role },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessTtl as SignOptions['expiresIn'] }
  );
  const refreshToken = jwt.sign(
    { sub: String(user.id), type: 'refresh' },
    env.jwt.refreshSecret,
    { expiresIn: env.jwt.refreshTtl as SignOptions['expiresIn'] }
  );
  return { accessToken, refreshToken };
}

const toPublicUser = (row: UserRow) => ({
  id: row.id,
  email: row.email,
  name: row.full_name,
  role: isRole(row.role) ? row.role : null,
});

export const signIn = asyncHandler(async (req, res) => {
  const { email, password } = (req.body ?? {}) as { email?: string; password?: string };
  if (!email || !password) {
    throw badRequest('Email and password are required.');
  }

  const [user] = await findUserByEmail(email);
  const valid = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);

  if (!user || !valid) {
    throw unauthorized('Email or password is incorrect.');
  }

  res.json({ user: toPublicUser(user), ...signTokens(user) });
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = (req.body ?? {}) as { refreshToken?: string };
  if (!refreshToken) throw badRequest('refreshToken is required.');

  let payload: JwtPayload;
  try {
    payload = jwt.verify(refreshToken, env.jwt.refreshSecret) as JwtPayload;
  } catch {
    throw unauthorized('Refresh token is invalid or expired.');
  }

  if (payload.type !== 'refresh') throw unauthorized('Not a refresh token.');

  const [user] = await findUserById(Number(payload.sub));
  if (!user) throw unauthorized('Account no longer exists.');

  res.json(signTokens(user));
});

export const signOut = asyncHandler(async (_req, res) => {
  // TODO: persist a revocation list (or bump a per-user token version) so a
  // stolen refresh token can be killed server-side. Until then sign-out is
  // client-side only — acceptable for the mock phase, not for launch.
  res.status(204).end();
});

export const me = asyncHandler(async (req, res) => {
  if (!req.user) throw unauthorized();

  const [user] = await findUserById(req.user.id);
  if (!user) throw unauthorized('Account no longer exists.');

  res.json(toPublicUser(user));
});
