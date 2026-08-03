import type { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { isRole, type Role } from '@tmg180/shared';
import { env } from '../config/env.js';
import { forbidden, unauthorized } from './errors.js';

/**
 * Verifies the bearer access token and attaches `req.user = { id, role }`.
 * Bearer rather than cookie so the mobile client uses the same path.
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

    // A token that survives verification can still carry a role we no longer
    // recognise — treat that as invalid rather than trusting the claim.
    if (!Number.isInteger(id) || !isRole(payload.role)) {
      return next(unauthorized('Invalid token.'));
    }

    req.user = { id, role: payload.role };
    next();
  } catch (error) {
    next(
      unauthorized(
        error instanceof jwt.TokenExpiredError ? 'Token expired.' : 'Invalid token.'
      )
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
    if (!roles.includes(req.user.role)) return next(forbidden());
    next();
  };
}
