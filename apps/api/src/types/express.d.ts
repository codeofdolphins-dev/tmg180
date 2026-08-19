import type { Role } from '@tmg180/shared';
import type { ActiveConsent } from '../middleware/consent.js';

/**
 * `requireAuth` attaches the verified token subject here. Optional because it
 * is absent on every public route — guards must narrow it before use.
 *
 * `roles` is the set the account holds, not the one it is acting as: the
 * workspace picker chooses that per request, so guards test membership.
 *
 * `consent` is set by `requireConsent` on participant-scoped worker routes —
 * the active grant the request is running under.
 */
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; roles: Role[] };
      consent?: ActiveConsent;
    }
  }
}

export {};
