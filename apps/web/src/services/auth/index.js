/**
 * The app's single auth seam. Screens and hooks talk to `authService`, never to
 * the HTTP client directly.
 *
 * Every call here reaches the API. There is no mock path: a screen that looks
 * signed in without a server session is worse than one that fails loudly.
 */
import { AUTH_ERROR } from '@tmg180/shared';
import { api } from '../../lib/apiClient';
import { AuthError } from './AuthError.js';

/** Accepts today's roles[] payload and a single-role one, defensively. */
const rolesOf = (user) => user?.roles ?? (user?.role ? [user.role] : []);

const asAuthError = (error) =>
  new AuthError(
    error?.code ?? AUTH_ERROR.INVALID_CREDENTIALS,
    error?.message ?? 'Something went wrong. Please try again.',
    error?.details
  );

/** Keeps every rejection an AuthError, so screens switch on `code` only. */
async function call(work) {
  try {
    return await work();
  } catch (error) {
    throw asAuthError(error);
  }
}

export const authService = {
  signIn: ({ email, password }) =>
    call(async () => {
      const user = await api.auth.signIn(email, password);
      return { user, roles: rolesOf(user) };
    }),

  signUp: (details) =>
    call(async () => {
      const user = await api.auth.signUp(details);
      return { user, roles: rolesOf(user) };
    }),

  me: () =>
    call(async () => {
      const user = await api.auth.me();
      return { user, roles: rolesOf(user) };
    }),

  signOut: () => call(() => api.auth.signOut()),

  forgotPassword: (email) => call(() => api.auth.forgotPassword(email)),

  verifyResetToken: (token) => call(() => api.auth.verifyResetToken(token)),

  resetPassword: ({ token, password }) => call(() => api.auth.resetPassword(token, password)),
};

export { AuthError } from './AuthError.js';
