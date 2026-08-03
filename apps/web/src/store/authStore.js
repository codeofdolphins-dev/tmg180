import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ROLES, canUseRole, landingRole, sortRoles } from '@tmg180/shared';
import { authService } from '../services/auth';

// Re-exported so existing imports (`from '../store'`) keep working; the
// definition now lives in @tmg180/shared and is shared with the API.
export { ROLES };

/**
 * Global auth/session state.
 *
 * `roles` is what the account holds and is issued by the backend — the user
 * never picks it. `role` is the workspace currently open, and is only ever one
 * of `roles`. Accounts are still served by the mock backend
 * (src/services/auth) until the API has user tables.
 */

const SIGNED_OUT = { user: null, roles: [], role: null, isAuthenticated: false };

const toStoreError = (error) => ({
  code: error?.code ?? 'unknown_error',
  message: error?.message ?? 'Something went wrong. Please try again.',
});

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...SIGNED_OUT,
      status: 'idle', // 'idle' | 'submitting'
      error: null,

      /** @returns {Promise<{roles: string[], role: string|null}>} */
      signIn: async (email, password) => {
        set({ status: 'submitting', error: null });
        try {
          const session = await authService.signIn({ email, password });
          const roles = sortRoles(session.roles);
          const role = landingRole(roles);

          set({ user: session.user, roles, role, isAuthenticated: true, status: 'idle' });
          return { roles, role };
        } catch (error) {
          set({ status: 'idle', error: toStoreError(error) });
          throw error;
        }
      },

      /** @returns {Promise<{roles: string[], role: string|null}>} */
      signUp: async (details) => {
        set({ status: 'submitting', error: null });
        try {
          const session = await authService.signUp(details);
          const roles = sortRoles(session.roles);
          const role = landingRole(roles);

          set({ user: session.user, roles, role, isAuthenticated: true, status: 'idle' });
          return { roles, role };
        } catch (error) {
          set({ status: 'idle', error: toStoreError(error) });
          throw error;
        }
      },

      /** Opens a workspace. Refuses any role the account does not hold. */
      selectRole: (role) => {
        if (!canUseRole(get().roles, role)) return false;
        set({ role });
        return true;
      },

      signOut: () => {
        authService.signOut().catch(() => {});
        set({ ...SIGNED_OUT, status: 'idle', error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'tmg180-auth',
      version: 2, // v1 stored a freely-chosen role; those sessions must sign in again
      migrate: () => ({ ...SIGNED_OUT }),
      partialize: ({ user, roles, role, isAuthenticated }) => ({
        user,
        roles,
        role,
        isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Hand-editing localStorage must not open a workspace the account does
        // not hold. This is tidiness, not enforcement — the real check lives on
        // the server once roles arrive inside a signed token.
        if (state && state.role && !canUseRole(state.roles ?? [], state.role)) {
          state.role = null;
        }
      },
    }
  )
);
