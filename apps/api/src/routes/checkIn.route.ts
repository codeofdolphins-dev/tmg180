import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import {
  createCheckIn,
  getCheckIn,
  getCheckInSummary,
  listCheckIns,
} from '../controllers/checkIn.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

/**
 * Mounted at /participant — M-04, the check-in (Template B).
 *
 * Participant-only, in middleware rather than in the controllers: the template
 * rules out a worker completing a participant's check-in, so no
 * worker-authenticated request should be able to reach these at all. There is
 * deliberately no PATCH — a saved check-in is locked.
 */
export const checkInRoutes = Router();

checkInRoutes.use(requireAuth, requireRole(ROLES.PARTICIPANT));

// Before /:id, so "summary" is never read as an id.
checkInRoutes.get('/check-ins/summary', getCheckInSummary);

checkInRoutes.get('/check-ins', listCheckIns);
checkInRoutes.post('/check-ins', createCheckIn);
checkInRoutes.get('/check-ins/:id', getCheckIn);
