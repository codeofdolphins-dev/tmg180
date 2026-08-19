import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import { listCredentials, updateCredential } from '../controllers/workerCredentials.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

/**
 * Mounted at /worker. Worker-owned data — the role guard is the whole access
 * rule (a worker reads and writes only their own credentials; the controller
 * scopes every query to req.user.id). Lives in middleware, not the controller,
 * per Build Guide §5.
 */
export const workerCredentialsRoutes = Router();

workerCredentialsRoutes.use(requireAuth, requireRole(ROLES.WORKER));

workerCredentialsRoutes.get('/credentials', listCredentials);
workerCredentialsRoutes.patch('/credentials/:type', updateCredential);
