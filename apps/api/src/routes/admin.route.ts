import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import { listWorkers, overview, verifyCredential } from '../controllers/adminWorkers.controller.js';
import {
  getConcernForGovernance,
  listAllConcerns,
  updateConcern,
} from '../controllers/concern.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

/**
 * Mounted at /admin. Platform Governance is a provisioned role (never
 * self-served), and the role guard is the whole access rule — everything
 * behind it is platform-level metadata, no record content. Lives in
 * middleware, not the controller, per Build Guide §5.
 */
export const adminRoutes = Router();

adminRoutes.use(requireAuth, requireRole(ROLES.ADMIN));

adminRoutes.get('/overview', overview);
adminRoutes.get('/workers', listWorkers);
adminRoutes.patch('/workers/:workerId/credentials/:type', verifyCredential);

// Mandatory Policy 2 tickets — governance reads, responds, refers, closes.
adminRoutes.get('/concerns', listAllConcerns);
adminRoutes.get('/concerns/:id', getConcernForGovernance);
adminRoutes.patch('/concerns/:id', updateConcern);
