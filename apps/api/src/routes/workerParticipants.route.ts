import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import {
  listParticipantGoals,
  listWorkerParticipants,
} from '../controllers/workerParticipants.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { requireConsent } from '../middleware/consent.js';

/**
 * Mounted at /worker. The list is the worker's own active grants; anything
 * under /participants/:participantId is participant-owned and sits behind
 * requireConsent — the gate is middleware, not a check inside a controller.
 */
export const workerParticipantsRoutes = Router();

workerParticipantsRoutes.use(requireAuth, requireRole(ROLES.WORKER));

workerParticipantsRoutes.get('/participants', listWorkerParticipants);
workerParticipantsRoutes.get(
  '/participants/:participantId/goals',
  requireConsent('canAddDailyNote', 'canViewProfile'),
  listParticipantGoals
);
