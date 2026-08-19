import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import {
  getSessionPreferences,
  saveSessionPreferences,
} from '../controllers/sessionPreferences.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

/** Mounted at /participant. Preferences belong to the participant alone. */
export const sessionPreferencesRoutes = Router();

sessionPreferencesRoutes.use(requireAuth, requireRole(ROLES.PARTICIPANT));

sessionPreferencesRoutes.get('/session-preferences', getSessionPreferences);
sessionPreferencesRoutes.patch('/session-preferences', saveSessionPreferences);
