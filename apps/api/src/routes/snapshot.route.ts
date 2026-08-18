import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import {
  addSnapshotAddendum,
  approveSnapshot,
  generateSnapshot,
  getSnapshot,
  listSnapshotMonths,
  listSnapshots,
  recordSnapshotExport,
  saveSnapshot,
} from '../controllers/snapshot.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

/**
 * Mounted at /participant. Approval is the participant's alone, so no other
 * role reaches these routes — the guard is middleware, before any controller
 * runs. Worker and admin visibility into an approved snapshot is a separate,
 * consent-gated surface and will not reuse them.
 */
export const snapshotRoutes = Router();

snapshotRoutes.use(requireAuth, requireRole(ROLES.PARTICIPANT));

// Before /:id, so "months" is never read as an id.
snapshotRoutes.get('/snapshots/months', listSnapshotMonths);

snapshotRoutes.get('/snapshots', listSnapshots);
snapshotRoutes.post('/snapshots', generateSnapshot);
snapshotRoutes.get('/snapshots/:id', getSnapshot);
snapshotRoutes.patch('/snapshots/:id', saveSnapshot);
snapshotRoutes.post('/snapshots/:id/approve', approveSnapshot);
snapshotRoutes.post('/snapshots/:id/addenda', addSnapshotAddendum);
snapshotRoutes.post('/snapshots/:id/export', recordSnapshotExport);
