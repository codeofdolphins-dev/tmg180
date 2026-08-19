import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import {
  getPrivacy,
  grantConsent,
  revokeConsent,
  savePreferences,
  updateConsent,
} from '../controllers/privacy.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

/**
 * Mounted at /participant. Consent belongs to the participant alone — a worker
 * can never reach these routes to widen their own access, which is enforced in
 * middleware rather than left to a controller to remember.
 */
export const privacyRoutes = Router();

privacyRoutes.use(requireAuth, requireRole(ROLES.PARTICIPANT));

privacyRoutes.get('/privacy', getPrivacy);
privacyRoutes.patch('/privacy/preferences', savePreferences);
privacyRoutes.post('/privacy/consents', grantConsent);
privacyRoutes.patch('/privacy/consents/:id', updateConsent);
privacyRoutes.post('/privacy/consents/:id/revoke', revokeConsent);
