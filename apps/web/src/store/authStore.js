import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const ROLES = {
  PARTICIPANT: 'participant',
  WORKER: 'worker',
  ADMIN: 'admin',
};

/**
 * Global auth/session state.
 * No backend yet — signIn accepts any credentials and role is chosen on the
 * Role Selection screen. Persisted so a refresh keeps the session.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,

      signIn: (user = {}) =>
        set({
          user: { name: 'TMG180 User', email: '', ...user },
          isAuthenticated: true,
        }),

      selectRole: (role) => set({ role }),

      signOut: () => set({ user: null, role: null, isAuthenticated: false }),
    }),
    { name: 'tmg180-auth' }
  )
);
