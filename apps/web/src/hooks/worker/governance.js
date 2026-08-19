import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/apiClient';
import { queryClient } from '../../lib/queryClient';
import { todayValue } from '../../lib/dates';

const BASE = '/worker/governance';

/**
 * Governance Standing and one item's detail.
 *
 * The standing query holds the whole screen (`{ today, groups, items,
 * credentials, summary }`) — renewals come from the same payload as the items
 * so the summary cards and the timeline can never disagree. Standing is
 * derived server-side from the browser's idea of today, exactly as the
 * credentials query does it.
 *
 * Acknowledging and note-saving both resolve with the fresh item detail, so
 * the detail cache is replaced rather than merged and the standing list is
 * invalidated behind it.
 */

export const governanceKeys = {
  all: ['worker', 'governance'],
  standing: () => [...governanceKeys.all, 'standing'],
  item: (key) => [...governanceKeys.all, 'item', key],
};

export function useGovernanceStanding() {
  return useQuery({
    queryKey: governanceKeys.standing(),
    queryFn: () => api.get(BASE, { today: todayValue() }),
  });
}

export function useGovernanceItem(key) {
  return useQuery({
    queryKey: governanceKeys.item(key),
    queryFn: () => api.get(`${BASE}/items/${encodeURIComponent(key)}`),
    enabled: Boolean(key),
  });
}

const settle = (key) => (fresh) => {
  queryClient.setQueryData(governanceKeys.item(key), fresh);
  queryClient.invalidateQueries({ queryKey: governanceKeys.standing() });
};

/** `mutate()` — confirms the item's current version. Append-only: there is no undo. */
export function useAcknowledgeItem(key) {
  return useMutation({
    mutationFn: () => api.post(`${BASE}/items/${encodeURIComponent(key)}/acknowledge`),
    onSuccess: settle(key),
  });
}

/** `mutate(note)` — `''` or null clears it. The note is private to the worker. */
export function useSaveGovernanceNote(key) {
  return useMutation({
    mutationFn: (note) => api.patch(`${BASE}/items/${encodeURIComponent(key)}/note`, { note }),
    onSuccess: settle(key),
  });
}
