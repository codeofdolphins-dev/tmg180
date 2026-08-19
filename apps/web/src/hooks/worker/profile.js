import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/apiClient';
import { queryClient } from '../../lib/queryClient';
import { useAuthStore } from '../../store';

const BASE = '/worker/profile';

/**
 * The worker's own profile — what they write about themselves and whether it
 * is listed in the participant directory.
 *
 * One query holds the whole thing (`fields`, `publication`, `readiness`,
 * `credentials`), because publishing changes all of them at once: saving a
 * field can complete a readiness step, and withdrawing the opt-in takes a
 * published profile down. Every write resolves with the fresh profile and
 * replaces the cache rather than merging, so what the screen shows can never
 * disagree with what the directory would.
 */

export const workerProfileKeys = {
  all: ['worker', 'profile'],
};

export function useWorkerProfile() {
  return useQuery({
    queryKey: workerProfileKeys.all,
    queryFn: () => api.get(BASE),
  });
}

const cacheProfile = (fresh) => queryClient.setQueryData(workerProfileKeys.all, fresh);

/** `mutate(fields)` — the flat wire shape; partial updates welcome. */
export function useSaveWorkerProfile() {
  return useMutation({
    mutationFn: (fields) => api.patch(BASE, fields),
    onSuccess: cacheProfile,
  });
}

/** Lists the profile in the directory. 400 `not_ready` carries `missing`. */
export function usePublishProfile() {
  return useMutation({
    mutationFn: () => api.post(`${BASE}/publish`),
    onSuccess: cacheProfile,
  });
}

/** Removes the listing. The content stays exactly as written. */
export function useUnpublishProfile() {
  return useMutation({
    mutationFn: () => api.post(`${BASE}/unpublish`),
    onSuccess: cacheProfile,
  });
}

/**
 * The account name, which is the profile's fallback display name — so a
 * change here can rename the directory card. The signed-in user in the auth
 * store is updated too, or the top bar would keep the old name until reload.
 */
export function useUpdateAccountName() {
  return useMutation({
    mutationFn: (full_name) => api.patch('/auth/me', { full_name }),
    onSuccess: () => {
      useAuthStore.getState().refreshSession();
      queryClient.invalidateQueries({ queryKey: workerProfileKeys.all });
    },
  });
}
