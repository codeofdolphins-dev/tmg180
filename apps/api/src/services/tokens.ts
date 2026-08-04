import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { sortRoles } from '@tmg180/shared';
import { env } from '../config/env.js';

/**
 * Both access and password-reset tokens are JWTs signed with the same secret.
 * There is no server-side session state: signing out just discards the token
 * client-side, and a reset link is valid until it expires with no way to
 * revoke it early or enforce single use. That is a deliberate trade for a much
 * smaller surface while the app is still taking shape — real sessions can come
 * back later if they turn out to be needed.
 */

export function signAccessToken(user: { id: number; roles: string[] }) {
  return jwt.sign({ sub: String(user.id), roles: sortRoles(user.roles) }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessTtl as SignOptions['expiresIn'],
  });
}

export function signResetToken(user: { id: number }) {
  return jwt.sign({ sub: String(user.id), purpose: 'password_reset' }, env.jwt.accessSecret, {
    expiresIn: `${env.passwordResetTtlMinutes}m` as SignOptions['expiresIn'],
  });
}

/**
 * Throws jwt.TokenExpiredError or jwt.JsonWebTokenError on anything unusable —
 * callers branch on that to tell "expired" from "invalid".
 */
export function decodeResetToken(token: string): number {
  const payload = jwt.verify(token, env.jwt.accessSecret) as JwtPayload;
  const id = Number(payload.sub);
  if (payload.purpose !== 'password_reset' || !Number.isInteger(id)) {
    throw new jwt.JsonWebTokenError('Not a valid password reset token.');
  }
  return id;
}
