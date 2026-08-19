import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/apiClient';

const BASE = '/worker/snapshots';

/**
 * Server state for the worker's view of Approved Monthly Snapshots.
 *
 * Read-only, so there are no mutations here and no cache writing — the only
 * side effect on this surface is the audit row the API records when a snapshot
 * is opened, which belongs to the server.
 *
 * Keys sit under ['worker', …] like the rest of the workspace, so a dual
 * participant/worker account never shares a cache entry between the two
 * layers — the same month can legitimately look different from each side.
 *
 * Opening a snapshot is what records a view, so the detail query does not
 * refetch on window focus: coming back to the tab should not add a row to the
 * participant's access record.
 */

export const workerSnapshotKeys = {
  all: ['worker', 'snapshots'],
  lists: ['worker', 'snapshots', 'list'],
  list: (params = {}) => ['worker', 'snapshots', 'list', params],
  detail: (id) => ['worker', 'snapshots', String(id)],
};

/** Locked snapshots this worker may see. `params` accepts { participantId, month }. */
export function useWorkerSnapshots(params = {}) {
  return useQuery({
    queryKey: workerSnapshotKeys.list(params),
    queryFn: () => {
      const query = new URLSearchParams(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
      ).toString();
      return api.get(query ? `${BASE}?${query}` : BASE);
    },
  });
}

/** One approved snapshot. 403 once the participant's consent is gone. */
export function useWorkerSnapshot(id) {
  return useQuery({
    queryKey: workerSnapshotKeys.detail(id),
    queryFn: () => api.get(`${BASE}/${encodeURIComponent(id)}`),
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
    retry: (count, error) => error?.status !== 403 && error?.status !== 404 && count < 2,
  });
}

/** True when the API refused because the participant's consent is gone. */
export const isConsentLost = (error) =>
  error?.status === 403 && error?.data?.reason === 'consent_required';
