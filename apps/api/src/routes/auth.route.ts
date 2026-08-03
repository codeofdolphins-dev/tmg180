import { Router } from 'express';
import { me, refresh, signIn, signOut } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const authRoutes = Router();

authRoutes.post('/sign-in', signIn);
authRoutes.post('/refresh', refresh);
authRoutes.post('/sign-out', signOut);
authRoutes.get('/me', requireAuth, me);
