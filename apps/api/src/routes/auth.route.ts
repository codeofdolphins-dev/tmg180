import { Router } from 'express';
import {
  forgotPassword,
  me,
  updateMe,
  refresh,
  resetPassword,
  signIn,
  signOut,
  signUp,
  verifyResetToken,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const authRoutes = Router();

// NOTE: no rate limiting on these routes yet — deliberately deferred with the
// rest of the security pass (MFA, lockout, breach notification) that the Gaps
// Analysis calls for. Add it before anything is exposed publicly.

// Sign-in and sign-up answer with a pair: a 15-minute access token and a
// rotating refresh token. /refresh and /sign-out take the refresh token in the
// body and are unauthenticated by design — that token is itself the credential,
// and both have to work once the access token has already expired.
authRoutes.post('/sign-up', signUp);
authRoutes.post('/sign-in', signIn);
authRoutes.post('/refresh', refresh);
authRoutes.post('/sign-out', signOut);
authRoutes.get('/me', requireAuth, me);
authRoutes.patch('/me', requireAuth, updateMe);

authRoutes.post('/forgot-password', forgotPassword);
authRoutes.get('/reset-password/:token', verifyResetToken);
authRoutes.post('/reset-password', resetPassword);
