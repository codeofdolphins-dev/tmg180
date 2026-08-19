import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import { getDirectoryWorker, listDirectory } from '../controllers/directory.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

/**
 * Mounted at /participant. Browse + direct contact: a participant reads
 * published worker profiles; nothing here writes, ranks or books.
 */
export const directoryRoutes = Router();

directoryRoutes.use(requireAuth, requireRole(ROLES.PARTICIPANT));

directoryRoutes.get('/directory', listDirectory);
directoryRoutes.get('/directory/:workerId', getDirectoryWorker);
