import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import {
  addAddendum,
  createDailyLog,
  getDailyLog,
  listDailyLogs,
  saveDailyLog,
  submitDailyLog,
} from '../controllers/dailyLog.controller.js';
import { listGoals } from '../controllers/goals.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

/**
 * Mounted at /participant — the participant layer of R-09 only.
 *
 * The role guard is the hard rule from Build Guide §5: it lives in middleware,
 * not in the controllers, so no worker-authenticated request can ever reach a
 * participant's own log. The worker layer gets its own routes and its own
 * consent gate; it will not reuse these.
 */
export const dailyLogRoutes = Router();

dailyLogRoutes.use(requireAuth, requireRole(ROLES.PARTICIPANT));

dailyLogRoutes.get('/goals', listGoals);

dailyLogRoutes.get('/daily-logs', listDailyLogs);
dailyLogRoutes.post('/daily-logs', createDailyLog);
dailyLogRoutes.get('/daily-logs/:id', getDailyLog);
dailyLogRoutes.patch('/daily-logs/:id', saveDailyLog);
dailyLogRoutes.post('/daily-logs/:id/submit', submitDailyLog);
dailyLogRoutes.post('/daily-logs/:id/addenda', addAddendum);
