import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/apiClient';
import { queryClient } from '../../lib/queryClient';

const BASE = '/participant/session-preferences';

/**
 * Server state for Session Preferences. One query holds the screen
 * ({ selections, status }); a save resolves with the fresh row, so it is
 * written straight into the cache rather than refetched.
 */

export const sessionPreferenceKeys = {
  all: ['participant', 'session-preferences'],
};

export function useSessionPreferences() {
  return useQuery({
    queryKey: sessionPreferenceKeys.all,
    queryFn: () => api.get(BASE),
  });
}

export function useSaveSessionPreferences() {
  return useMutation({
    mutationFn: ({ selections, status }) => api.patch(BASE, { selections, status }),
    onSuccess: (fresh) => queryClient.setQueryData(sessionPreferenceKeys.all, fresh),
  });
}
