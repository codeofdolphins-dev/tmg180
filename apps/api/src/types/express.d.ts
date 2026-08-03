import type { Role } from '@tmg180/shared';

/**
 * `requireAuth` attaches the verified token subject here. Optional because it
 * is absent on every public route — guards must narrow it before use.
 */
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: Role };
    }
  }
}

export {};
