import { Router } from 'express';
import { openSharedSnapshot } from '../controllers/shareLink.controller.js';

/**
 * Mounted at /public — the only routes under /api/v1 with no session.
 *
 * A share link is opened by someone who has no account and never will: a
 * planner, an LAC, a coordinator. The token in the URL is the whole
 * credential, and the controller treats it that way — one lookup by hash,
 * one uniform 404 for anything that does not open.
 */
export const publicRoutes = Router();

publicRoutes.get('/snapshot-share/:token', openSharedSnapshot);
