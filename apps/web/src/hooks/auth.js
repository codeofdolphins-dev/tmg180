import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth';
import { useAuthStore } from '../store';

/**
 * Auth server state. Every one of these hits the API — there is no local
 * fallback anywhere in the auth flow.
 *
 * Mutations return the session so a screen can route on it directly:
 *   const { role } = await signIn.mutateAsync({ email, password })
 */

export const authKeys = {
  session: ['auth', 'session'],
  resetToken: (token) => ['auth', 'reset-token', token],
};

/** Stores the session and reports where it should land. */
function useApplySession() {
  const setSession = useAuthStore((s) => s.setSession);
  return (session) => {
    setSession(session);
    // Read back the role the store just resolved — same rule everywhere,
    // and always a real, held role since it's server-issued.
    return { ...session, role: useAuthStore.getState().role };
  };
}

// The session is applied inside mutationFn rather than onSuccess: mutateAsync
// resolves with what mutationFn returns and discards onSuccess's return value,
// so the role a screen routes on has to be added here.
export function useSignIn() {
  const apply = useApplySession();
  return useMutation({
    mutationFn: async (credentials) => apply(await authService.signIn(credentials)),
  });
}

export function useSignUp() {
  const apply = useApplySession();
  return useMutation({
    mutationFn: async (details) => apply(await authService.signUp(details)),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email) => authService.forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }) => authService.resetPassword({ token, password }),
  });
}

/**
 * Checks a reset link before showing the form, so an expired one lands on the
 * Link Expired screen instead of failing after someone types a new password.
 */
export function useResetTokenCheck(token) {
  return useQuery({
    queryKey: authKeys.resetToken(token),
    queryFn: () => authService.verifyResetToken(token),
    enabled: Boolean(token),
    retry: false,
    staleTime: Infinity,
  });
}

/**
 * Re-validates a persisted session against the API on load.
 *
 * localStorage says who was signed in; only the server knows if that is still
 * true. A suspended account, a revoked session or a role change all take effect
 * here rather than at the next write.
 */
export function useSessionSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setSession = useAuthStore((s) => s.setSession);
  const signOut = useAuthStore((s) => s.signOut);

  const query = useQuery({
    queryKey: authKeys.session,
    queryFn: () => authService.me(),
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const { data, error } = query;

  useEffect(() => {
    if (data) setSession(data);
  }, [data, setSession]);

  useEffect(() => {
    // The account is gone, suspended, or the session was revoked elsewhere.
    if (error) signOut();
  }, [error, signOut]);

  return query;
}
