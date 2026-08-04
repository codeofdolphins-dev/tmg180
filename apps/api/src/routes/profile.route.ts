import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import { getProfile, saveSection } from '../controllers/profile.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

/**
 * Mounted at /participant — the participant's own Personal Profile only.
 * Worker/admin visibility into a profile is a separate, consent-gated surface
 * (P1-03) and does not reuse these routes.
 */
export const profileRoutes = Router();

profileRoutes.use(requireAuth, requireRole(ROLES.PARTICIPANT));

profileRoutes.get('/profile', getProfile);
profileRoutes.patch('/profile/sections/:sectionKey', saveSection);
