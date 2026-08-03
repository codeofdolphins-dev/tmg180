/**
 * Real auth backend — the same surface as ./mockAuthBackend.js, over
 * `/api/v1/auth`. Token storage is handled inside @tmg180/api-client, which is
 * why these methods return no tokens of their own.
 *
 * Unimplemented endpoints throw rather than pretending to succeed: an auth
 * screen must never show a green tick for something the server never did.
 */
import { AUTH_ERROR } from '@tmg180/shared';
import { api } from '../../lib/apiClient';
import { AuthError } from './AuthError.js';

/** Accepts today's single-role payload and the roles[] the API will return. */
const rolesOf = (user) => user?.roles ?? (user?.role ? [user.role] : []);

const asAuthError = (error) =>
  new AuthError(error?.code ?? AUTH_ERROR.INVALID_CREDENTIALS, error?.message ?? 'Sign-in failed.');

const notBuilt = (what) => {
  throw new AuthError('not_implemented', `${what} is not built on the API yet.`);
};

export const apiAuthBackend = {
  async signIn({ email, password }) {
    try {
      const user = await api.auth.signIn(email, password);
      return { user, roles: rolesOf(user) };
    } catch (error) {
      throw asAuthError(error);
    }
  },

  async signUp() {
    notBuilt('Sign-up');
  },

  async requestPasswordReset() {
    notBuilt('Password reset');
  },

  async resetPassword() {
    notBuilt('Password reset');
  },

  async me() {
    try {
      const user = await api.auth.me();
      return { user, roles: rolesOf(user) };
    } catch (error) {
      throw asAuthError(error);
    }
  },

  async signOut() {
    await api.auth.signOut();
  },

  listDemoAccounts: () => [],
};
