import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import {
  acknowledgeItem,
  getItem,
  getStanding,
  saveNote,
} from '../controllers/workerGovernance.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

/**
 * Mounted at /worker. Worker-owned data — the role guard is the whole access
 * rule (a worker reads and writes only their own standing; the controller
 * scopes every query to req.user.id). No consent gate: nothing here is
 * participant-owned.
 */
export const workerGovernanceRoutes = Router();

workerGovernanceRoutes.use(requireAuth, requireRole(ROLES.WORKER));

workerGovernanceRoutes.get('/governance', getStanding);
workerGovernanceRoutes.get('/governance/items/:key', getItem);
// Append-only: there is deliberately no route that un-acknowledges an item.
workerGovernanceRoutes.post('/governance/items/:key/acknowledge', acknowledgeItem);
workerGovernanceRoutes.patch('/governance/items/:key/note', saveNote);
