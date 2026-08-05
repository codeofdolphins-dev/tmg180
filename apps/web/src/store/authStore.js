import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ROLES, canUseRole, sortRoles } from '@tmg180/shared';
import { api } from '../lib/apiClient';
import { queryClient } from '../lib/queryClient';

// Re-exported so existing imports (`from '../store'`) keep working; the
// definition now lives in @tmg180/shared and is shared with the API.
export { ROLES };

/**
 * Everything auth: who is signed in, which workspace is open, and the three
 * calls that change that. Screens call these directly —
 *
 *   const signIn = useAuthStore((s) => s.signIn);
 *   const role = await signIn(email, password);
 *
 * `roles` is what the account holds and is issued by the API. `role` is the
 * workspace currently open, and is only ever one of `roles`.
 */

const SIGNED_OUT = { user: null, roles: [], role: null, isAuthenticated: false };

/** Accepts today's roles[] payload and a single-role one, defensively. */
const rolesOf = (user) => user?.roles ?? (user?.role ? [user.role] : []);

/** The API's errors carry a message worth showing; a dead network does not. */
async function call(work) {
  try {
    return await work();
  } catch (error) {
    if (error?.name === 'ApiError') throw error;
    throw new Error('Something went wrong. Please try again.');
  }
}

export const useAuthStore = create(
  persist(
    (set, get) => {
      /** Applied after any call that returns a user. Returns where to land. */
      const applySession = (user) => {
        const held = sortRoles(rolesOf(user));
        const current = get().role;
        // Keep the open workspace if the account still holds it, so a
        // background refresh never bounces someone out of their portal.
        // Otherwise land on the account's first role — roles are
        // server-issued, so there is always one to open directly.
        const role = canUseRole(held, current) ? current : (held[0] ?? null);
        set({ user, roles: held, role, isAuthenticated: true });
        return role;
      };

      return {
        ...SIGNED_OUT,

        /** Signs in and returns the workspace to navigate to. */
        signIn: async (email, password) =>
          applySession(await call(() => api.auth.signIn(email, password))),

        /** Creates the account, signs it in, and returns where to land. */
        signUp: async (details) => applySession(await call(() => api.auth.signUp(details))),

        signOut: () => {
          // There is no server-side session to revoke — this just drops the
          // locally stored access token.
          api.auth.signOut();
          queryClient.clear();
          set({ ...SIGNED_OUT });
        },

        /**
         * Re-validates a persisted session against the API on load.
         * localStorage says who was signed in; only the server knows if that is
         * still true. A suspended account, a revoked session or a role change
         * all take effect here rather than at the next write.
         */
        refreshSession: async () => {
          try {
            applySession(await api.auth.me());
          } catch {
            get().signOut();
          }
        },

        /** Opens a workspace. Refuses any role the account does not hold. */
        selectRole: (role) => {
          if (!canUseRole(get().roles, role)) return false;
          set({ role });
          return true;
        },
      };
    },
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
        // not hold. Tidiness, not enforcement — the API is the real check, and
        // refreshSession re-validates against it on load.
        if (state && state.role && !canUseRole(state.roles ?? [], state.role)) {
          state.role = null;
        }
      },
    }
  )
);
