import { Router } from 'express';
import { ROLES } from '@tmg180/shared';
import {
  createShareLink,
  listShareLinks,
  listSnapshotShareLinks,
  revokeShareLink,
} from '../controllers/shareLink.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

/**
 * Mounted at /participant — the participant's end of a snapshot share link.
 * Only the participant creates or revokes one: "the participant controls who
 * receives this document" (Template C9), so the guard is the role, in
 * middleware. The public end is public.route.ts.
 */
export const shareLinkRoutes = Router();

shareLinkRoutes.use(requireAuth, requireRole(ROLES.PARTICIPANT));

shareLinkRoutes.get('/share-links', listShareLinks);
shareLinkRoutes.post('/share-links/:linkId/revoke', revokeShareLink);
shareLinkRoutes.get('/snapshots/:id/share-links', listSnapshotShareLinks);
shareLinkRoutes.post('/snapshots/:id/share-links', createShareLink);
