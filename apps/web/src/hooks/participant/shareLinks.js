import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/apiClient';
import { queryClient } from '../../lib/queryClient';
import { privacyKeys } from './privacy';

/**
 * Server state for snapshot share links (Template C9 — the external access
 * layer). One query per snapshot holds its links *and* its access log
 * together, because they change together: an open writes a log row, a
 * revocation writes one too. Every write invalidates both that query and the
 * participant-wide list the Privacy & Sharing rail reads.
 */

export const shareLinkKeys = {
  all: ['participant', 'share-links'],
  list: ['participant', 'share-links', 'list'],
  forSnapshot: (snapshotId) => ['participant', 'share-links', 'snapshot', String(snapshotId)],
};

/** Every link the participant has made, across all snapshots. */
export function useShareLinks() {
  return useQuery({ queryKey: shareLinkKeys.list, queryFn: () => api.get('/participant/share-links') });
}

/** { allowed, locked, links, events } for one snapshot. */
export function useSnapshotShareLinks(snapshotId) {
  return useQuery({
    queryKey: shareLinkKeys.forSnapshot(snapshotId),
    queryFn: () => api.get(`/participant/snapshots/${encodeURIComponent(snapshotId)}/share-links`),
    enabled: Boolean(snapshotId),
  });
}

const refresh = (snapshotId) => {
  queryClient.invalidateQueries({ queryKey: shareLinkKeys.list });
  if (snapshotId) queryClient.invalidateQueries({ queryKey: shareLinkKeys.forSnapshot(snapshotId) });
  // Creating or revoking a link is on the privacy audit log too.
  queryClient.invalidateQueries({ queryKey: privacyKeys.all });
};

/**
 * Creates a link. The response carries `url` — the only time the token is
 * ever shown — so the caller must surface it immediately; it cannot be
 * fetched again.
 */
export function useCreateShareLink(snapshotId) {
  return useMutation({
    mutationFn: (fields) =>
      api.post(`/participant/snapshots/${encodeURIComponent(snapshotId)}/share-links`, fields),
    onSuccess: () => refresh(snapshotId),
  });
}

export function useRevokeShareLink(snapshotId) {
  return useMutation({
    mutationFn: (linkId) => api.post(`/participant/share-links/${encodeURIComponent(linkId)}/revoke`),
    onSuccess: () => refresh(snapshotId),
  });
}

/** The public end — no session; the token is the credential. */
export function useSharedSnapshot(token) {
  return useQuery({
    queryKey: ['public', 'snapshot-share', token],
    queryFn: () => api.get(`/public/snapshot-share/${encodeURIComponent(token)}`),
    enabled: Boolean(token),
    // A dead link is dead; retrying will not revive it.
    retry: false,
  });
}
