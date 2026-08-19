import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/apiClient';

const BASE = '/participant/directory';

/**
 * Server state for Browse Directory — read-only by design. A participant
 * browses published worker profiles and contacts people directly; nothing
 * here books, ranks or "matches", so there are no mutations.
 *
 * The list never carries availability (R-04): that arrives only with one
 * worker's profile, from the detail query.
 */

export const directoryKeys = {
  all: ['participant', 'directory'],
  lists: () => [...directoryKeys.all, 'list'],
  list: (filters) => [...directoryKeys.lists(), filters],
  worker: (workerId) => [...directoryKeys.all, 'worker', String(workerId)],
};

const cleanFilters = ({ location, supportArea } = {}) => ({
  ...(location ? { location } : {}),
  ...(supportArea ? { supportArea } : {}),
});

/** `{ workers, total, filters: { locations, supportAreas, … }, contactNotice }` */
export function useDirectory(filters = {}) {
  const params = cleanFilters(filters);
  return useQuery({
    queryKey: directoryKeys.list(params),
    queryFn: () => api.get(BASE, params),
    placeholderData: keepPreviousData,
  });
}

/** One published profile; 404 when the worker is not (or no longer) listed. */
export function useDirectoryWorker(workerId) {
  return useQuery({
    queryKey: directoryKeys.worker(workerId),
    queryFn: () => api.get(`${BASE}/${workerId}`),
    enabled: Boolean(workerId),
    retry: (count, error) => error?.status !== 404 && count < 2,
  });
}
