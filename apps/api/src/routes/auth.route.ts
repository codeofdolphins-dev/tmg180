import { Router } from 'express';
import {
  forgotPassword,
  me,
  resetPassword,
  signIn,
  signUp,
  verifyResetToken,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const authRoutes = Router();

// NOTE: no rate limiting on these routes yet — deliberately deferred with the
// rest of the security pass (MFA, lockout, breach notification) that the Gaps
// Analysis calls for. Add it before anything is exposed publicly.

// Access tokens are stateless JWTs with no server-side session, so there is
// nothing for a refresh or sign-out endpoint to do — sign-out is the client
// discarding its token.
authRoutes.post('/sign-up', signUp);
authRoutes.post('/sign-in', signIn);
authRoutes.get('/me', requireAuth, me);

authRoutes.post('/forgot-password', forgotPassword);
authRoutes.get('/reset-password/:token', verifyResetToken);
authRoutes.post('/reset-password', resetPassword);
