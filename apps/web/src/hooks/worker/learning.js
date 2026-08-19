import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/apiClient';
import { queryClient } from '../../lib/queryClient';

const BASE = '/worker/learning';

/**
 * Learning Hub and one reading.
 *
 * The hub query holds the catalogue plus this worker's progress on every
 * reading (`{ modules, libraries, resources, summary }`); the reading query
 * adds the body and the related readings for one slug.
 *
 * Opening a reading is recorded server-side on the GET, so the hub's counts
 * are stale the moment a reading is opened — the query invalidates the list
 * once it resolves rather than leaving the hub showing an old "opened" state.
 */

export const learningKeys = {
  all: ['worker', 'learning'],
  hub: () => [...learningKeys.all, 'hub'],
  resource: (slug) => [...learningKeys.all, 'resource', slug],
};

export function useLearningHub() {
  return useQuery({
    queryKey: learningKeys.hub(),
    queryFn: () => api.get(BASE),
  });
}

export function useLearningResource(slug) {
  return useQuery({
    queryKey: learningKeys.resource(slug),
    queryFn: async () => {
      const reading = await api.get(`${BASE}/resources/${encodeURIComponent(slug)}`);
      queryClient.invalidateQueries({ queryKey: learningKeys.hub() });
      return reading;
    },
    enabled: Boolean(slug),
  });
}

/**
 * `mutate({ saved })` or `mutate({ completed })` — both are the worker's own
 * bookkeeping and both can be undone, unlike a governance acknowledgement.
 */
export function useUpdateLearningProgress(slug) {
  return useMutation({
    mutationFn: (fields) => api.patch(`${BASE}/resources/${encodeURIComponent(slug)}`, fields),
    onSuccess: ({ progress }) => {
      queryClient.setQueryData(learningKeys.resource(slug), (current) =>
        current ? { ...current, resource: { ...current.resource, progress } } : current
      );
      queryClient.invalidateQueries({ queryKey: learningKeys.hub() });
    },
  });
}
