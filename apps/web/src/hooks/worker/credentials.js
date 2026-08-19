import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/apiClient';
import { queryClient } from '../../lib/queryClient';
import { todayValue } from '../../lib/dates';

const BASE = '/worker/credentials';

/**
 * Worker credentials — the Governance Summary on the dashboard and the
 * renewals on Governance Standing.
 *
 * One query holds the whole set (`{ today, credentials, summary }`); standing
 * is derived server-side from the browser's idea of today, so the two agree
 * on what "due soon" means. A save resolves with the fresh set and replaces
 * the cache rather than merging.
 */

export const credentialKeys = {
  all: ['worker', 'credentials'],
};

export function useWorkerCredentials() {
  return useQuery({
    queryKey: credentialKeys.all,
    queryFn: () => api.get(BASE, { today: todayValue() }),
  });
}

/** `mutate({ type, fields })` — fields: { issuedAt, expiresAt, reference, notes }. */
export function useUpdateCredential() {
  return useMutation({
    mutationFn: ({ type, fields }) =>
      api.patch(`${BASE}/${encodeURIComponent(type)}?today=${todayValue()}`, fields),
    onSuccess: (fresh) => queryClient.setQueryData(credentialKeys.all, fresh),
  });
}
