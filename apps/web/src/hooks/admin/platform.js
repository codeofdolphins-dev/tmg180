import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/apiClient';
import { queryClient } from '../../lib/queryClient';
import { todayValue } from '../../lib/dates';

/**
 * Platform Governance data — the admin dashboard's aggregates and the worker
 * registry behind credential verification. Metadata only; nothing here ever
 * carries record content.
 *
 * `today` rides on every request so "due soon" / "expired" standing is judged
 * against the browser's calendar day, the same contract the worker hooks use.
 */

export const adminKeys = {
  overview: ['admin', 'overview'],
  workers: ['admin', 'workers'],
};

export function useAdminOverview() {
  return useQuery({
    queryKey: adminKeys.overview,
    queryFn: () => api.get('/admin/overview', { today: todayValue() }),
  });
}

export function useAdminWorkers() {
  return useQuery({
    queryKey: adminKeys.workers,
    queryFn: () => api.get('/admin/workers', { today: todayValue() }),
  });
}

/**
 * `mutate({ workerId, type, verified })` — the admin verification act.
 * Resolves with `{ today, worker }`; the fresh registry row replaces the
 * stale one in place and the overview's counters are refetched.
 */
export function useVerifyCredential() {
  return useMutation({
    mutationFn: ({ workerId, type, verified }) =>
      api.patch(
        `/admin/workers/${workerId}/credentials/${encodeURIComponent(type)}?today=${todayValue()}`,
        { verified }
      ),
    onSuccess: ({ worker }) => {
      queryClient.setQueryData(adminKeys.workers, (cached) =>
        cached
          ? {
              ...cached,
              workers: cached.workers.map((row) => (row.id === worker.id ? worker : row)),
            }
          : cached
      );
      queryClient.invalidateQueries({ queryKey: adminKeys.overview });
    },
  });
}
