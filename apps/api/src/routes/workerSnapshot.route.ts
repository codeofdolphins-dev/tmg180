import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import {
  getWorkerSnapshot,
  listWorkerSnapshots,
} from '../controllers/workerSnapshot.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

/**
 * Mounted at /worker. Read-only by design — there is no POST, PATCH or DELETE
 * here and there never should be: an approved snapshot is the participant's
 * locked record, and the participant routes are the only place it is written.
 *
 * The consent gate is `assertConsent` inside the controller rather than
 * `requireConsent` middleware, because the participant comes off the snapshot
 * row, not out of the URL — the same reason the worker daily log does it that
 * way.
 */
export const workerSnapshotRoutes = Router();

workerSnapshotRoutes.use(requireAuth, requireRole(ROLES.WORKER));

workerSnapshotRoutes.get('/snapshots', listWorkerSnapshots);
workerSnapshotRoutes.get('/snapshots/:id', getWorkerSnapshot);
