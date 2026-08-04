import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ROLES, canUseRole, sortRoles } from '@tmg180/shared';
import { authService } from '../services/auth';
import { queryClient } from '../lib/queryClient';

// Re-exported so existing imports (`from '../store'`) keep working; the
// definition now lives in @tmg180/shared and is shared with the API.
export { ROLES };

/**
 * Session state — who is signed in and which workspace is open.
 *
 * Server state (the requests themselves, their pending and error states) lives
 * in TanStack Query; see src/hooks/auth.js. This store only holds what the app
 * needs synchronously to route.
 *
 * `roles` is what the account holds and is issued by the API. `role` is the
 * workspace currently open, and is only ever one of `roles`.
 */

const SIGNED_OUT = { user: null, roles: [], role: null, isAuthenticated: false };

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...SIGNED_OUT,

      /** Applied after any call that returns a session (sign-in, sign-up, /me). */
      setSession: ({ user, roles }) => {
        const held = sortRoles(roles);
        const current = get().role;
        set({
          user,
          roles: held,
          // Keep the open workspace if the account still holds it, so a
          // background /me refresh never bounces someone out of their portal.
          // Otherwise land on the account's first role — roles are
          // server-issued, so there is always one to open directly.
          role: canUseRole(held, current) ? current : (held[0] ?? null),
          isAuthenticated: true,
        });
      },

      /** Opens a workspace. Refuses any role the account does not hold. */
      selectRole: (role) => {
        if (!canUseRole(get().roles, role)) return false;
        set({ role });
        return true;
      },

      signOut: () => {
        // There is no server-side session to revoke — this just drops the
        // locally stored access token.
        authService.signOut().catch(() => {});
        queryClient.clear();
        set({ ...SIGNED_OUT });
      },
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
        // not hold. Tidiness, not enforcement — the API is the real check, and
        // useSessionSync re-validates against it on load.
        if (state && state.role && !canUseRole(state.roles ?? [], state.role)) {
          state.role = null;
        }
      },
    }
  )
);
