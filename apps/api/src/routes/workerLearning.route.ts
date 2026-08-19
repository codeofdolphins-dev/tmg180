import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import {
  getResource,
  listLearning,
  updateProgress,
} from '../controllers/workerLearning.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

/**
 * Mounted at /worker. The catalogue is the same for every worker; what is
 * per-worker is their own reading progress, and the controller scopes it to
 * req.user.id.
 */
export const workerLearningRoutes = Router();

workerLearningRoutes.use(requireAuth, requireRole(ROLES.WORKER));

workerLearningRoutes.get('/learning', listLearning);
workerLearningRoutes.get('/learning/resources/:slug', getResource);
workerLearningRoutes.patch('/learning/resources/:slug', updateProgress);
