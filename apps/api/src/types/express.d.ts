import type { Role } from '@tmg180/shared';

/**
 * `requireAuth` attaches the verified token subject here. Optional because it
 * is absent on every public route — guards must narrow it before use.
 *
 * `roles` is the set the account holds, not the one it is acting as: the
 * workspace picker chooses that per request, so guards test membership.
 */
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; roles: Role[] };
    }
  }
}

export {};
