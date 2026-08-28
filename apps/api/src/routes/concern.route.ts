import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import {
  addConcernFollowUp,
  getConcern,
  listConcerns,
  raiseConcern,
} from '../controllers/concern.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

/**
 * Mounted at /participant — raising a concern (Mandatory Policy 2). The
 * governance side is on /admin. No worker route exists on purpose: a concern
 * about a worker is not the worker's to read through the platform.
 */
export const concernRoutes = Router();

concernRoutes.use(requireAuth, requireRole(ROLES.PARTICIPANT));

concernRoutes.get('/concerns', listConcerns);
concernRoutes.post('/concerns', raiseConcern);
concernRoutes.get('/concerns/:id', getConcern);
concernRoutes.post('/concerns/:id/responses', addConcernFollowUp);
