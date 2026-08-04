import type { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { isRole, sortRoles, type Role } from '@tmg180/shared';
import { env } from '../config/env.js';
import { forbidden, unauthorized } from './errors.js';

/**
 * Verifies the bearer access token and attaches `req.user = { id, roles }`.
 * Bearer rather than cookie so the mobile client uses the same path.
 *
 * Stateless: the signature and expiry are the whole check, with no database
 * round trip. That means an access token stays usable for the rest of its
 * 15 minutes even if the account is suspended or its sessions are revoked —
 * refresh is where those take effect. Tightening that is part of the deferred
 * security pass.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.get('authorization') ?? '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(unauthorized('Missing bearer token.'));
  }

  try {
    const payload = jwt.verify(token, env.jwt.accessSecret) as JwtPayload;
    const id = Number(payload.sub);

    // A token that survives verification can still carry roles we no longer
    // recognise — sortRoles drops those, and an empty set is not a session.
    const roles = sortRoles(Array.isArray(payload.roles) ? payload.roles : []);
    if (!Number.isInteger(id) || roles.length === 0) {
      return next(unauthorized('Invalid token.'));
    }

    req.user = { id, roles };
    next();
  } catch (error) {
    next(
      unauthorized(error instanceof jwt.TokenExpiredError ? 'Token expired.' : 'Invalid token.')
    );
  }
}

/** Route guard mirroring the web app's RequireRole. */
export function requireRole(...roles: Role[]): RequestHandler {
  // Guards against JS callers and typos in route wiring — a bad role here
  // should crash at boot, not silently deny every request at runtime.
  const unknown = roles.filter((role) => !isRole(role));
  if (unknown.length > 0) {
    throw new Error(`requireRole received an unknown role: ${unknown.join(', ')}`);
  }

  return function roleGuard(req, _res, next) {
    if (!req.user) return next(unauthorized());
    // Holding any one of the listed roles is enough — a participant/worker
    // account reaches both workspaces from the same token.
    if (!req.user.roles.some((held) => roles.includes(held))) return next(forbidden());
    next();
  };
}
