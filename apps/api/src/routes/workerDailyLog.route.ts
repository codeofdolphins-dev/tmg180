import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import {
  addWorkerAddendum,
  createWorkerDailyLog,
  getWorkerDailyLog,
  listWorkerDailyLogs,
  saveWorkerDailyLog,
  submitWorkerDailyLog,
} from '../controllers/workerDailyLog.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

/**
 * Mounted at /worker — the worker layer of R-09.
 *
 * Separate from the participant's /participant/daily-logs by design (Build
 * Guide §5): the role guard here means a participant token never reaches a
 * worker's history. The per-participant consent gate runs inside each write
 * (the participant comes off the body on create and off the row afterwards),
 * via the same assertConsent the URL-scoped routes use.
 */
export const workerDailyLogRoutes = Router();

workerDailyLogRoutes.use(requireAuth, requireRole(ROLES.WORKER));

workerDailyLogRoutes.get('/daily-logs', listWorkerDailyLogs);
workerDailyLogRoutes.post('/daily-logs', createWorkerDailyLog);
workerDailyLogRoutes.get('/daily-logs/:id', getWorkerDailyLog);
workerDailyLogRoutes.patch('/daily-logs/:id', saveWorkerDailyLog);
workerDailyLogRoutes.post('/daily-logs/:id/submit', submitWorkerDailyLog);
workerDailyLogRoutes.post('/daily-logs/:id/addenda', addWorkerAddendum);
