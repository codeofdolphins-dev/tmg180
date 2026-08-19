import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import {
  getWorkerProfile,
  publishWorkerProfile,
  saveWorkerProfile,
  unpublishWorkerProfile,
} from '../controllers/workerProfile.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

/**
 * Mounted at /worker. The worker's own profile — the role guard is the whole
 * access rule; the controller scopes everything to req.user.id.
 */
export const workerProfileRoutes = Router();

workerProfileRoutes.use(requireAuth, requireRole(ROLES.WORKER));

workerProfileRoutes.get('/profile', getWorkerProfile);
workerProfileRoutes.patch('/profile', saveWorkerProfile);
workerProfileRoutes.post('/profile/publish', publishWorkerProfile);
workerProfileRoutes.post('/profile/unpublish', unpublishWorkerProfile);
