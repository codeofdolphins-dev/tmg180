import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { CONSENT_STATUS } from '@tmg180/shared';
import { api } from '../../lib/apiClient';
import { queryClient } from '../../lib/queryClient';

const BASE = '/participant/privacy';

/**
 * Server state for Privacy & Sharing.
 *
 * One query holds the screen — preferences, consent records and the audit
 * entries — because they change together: revoking access writes an audit row,
 * and a toggle does too. Every write invalidates the whole thing rather than
 * patching pieces of it, so what the screen shows can never disagree with the
 * record behind it. On a privacy screen that matters more than a round trip.
 */

export const privacyKeys = {
  all: ['participant', 'privacy'],
};

export function usePrivacy(params = {}) {
  return useQuery({
    queryKey: [...privacyKeys.all, params],
    queryFn: () => api.get(BASE, { ...params }),
    placeholderData: keepPreviousData,
  });
}

const refresh = () => queryClient.invalidateQueries({ queryKey: privacyKeys.all });

/** Global preferences — what a grant may include, never a grant itself. */
export function useSavePreferences() {
  return useMutation({
    mutationFn: (changes) => api.patch(`${BASE}/preferences`, changes),
    onSuccess: refresh,
  });
}

/** Changing a grant supersedes it server-side; the list comes back rewritten. */
export function useUpdateConsent() {
  return useMutation({
    mutationFn: ({ id, permissions }) => api.patch(`${BASE}/consents/${id}`, permissions),
    onSuccess: refresh,
  });
}

export function useRevokeConsent() {
  return useMutation({
    mutationFn: ({ id, reason }) => api.post(`${BASE}/consents/${id}/revoke`, { reason }),
    onSuccess: refresh,
  });
}

/** Only current grants belong in the access table; the rest is history. */
export const activeConsents = (consents = []) =>
  consents.filter((consent) => consent.status === CONSENT_STATUS.ACTIVE);
