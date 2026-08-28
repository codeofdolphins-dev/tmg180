import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  SNAPSHOT_CHOICE_FIELD_KEYS,
  SNAPSHOT_FIELD_KEYS,
  SNAPSHOT_STATUS,
  SNAPSHOT_TAG_FIELD_KEYS,
} from '@tmg180/shared';
import { api } from '../../lib/apiClient';
import { queryClient } from '../../lib/queryClient';
import { participantSnapshotPath } from '../../routes/paths';

const BASE = '/participant/snapshots';

/**
 * Server state for the Monthly Snapshot.
 *
 * Same shape as the daily log's hooks: a list query, a query per snapshot, and
 * every write resolving with the fresh snapshot so the cache never has to guess
 * what changed. Approval is the one action here that cannot be undone, so it is
 * deliberately a separate call from saving.
 */

export const snapshotKeys = {
  all: ['participant', 'snapshots'],
  list: ['participant', 'snapshots', 'list'],
  months: ['participant', 'snapshots', 'months'],
  detail: (id) => ['participant', 'snapshots', String(id)],
};

export function useSnapshots() {
  return useQuery({ queryKey: snapshotKeys.list, queryFn: () => api.get(BASE) });
}

/** Months with submitted logs — what the list screen offers to compile. */
export function useSnapshotMonths() {
  return useQuery({ queryKey: snapshotKeys.months, queryFn: () => api.get(`${BASE}/months`) });
}

export function useSnapshot(id) {
  return useQuery({
    queryKey: snapshotKeys.detail(id),
    queryFn: () => api.get(`${BASE}/${encodeURIComponent(id)}`),
    enabled: Boolean(id),
  });
}

const cacheSnapshot = (snapshot) => {
  queryClient.setQueryData(snapshotKeys.detail(snapshot.id), snapshot);
  queryClient.invalidateQueries({ queryKey: snapshotKeys.list });
  queryClient.invalidateQueries({ queryKey: snapshotKeys.months });
  return snapshot;
};

/** Compiles or recompiles a month's draft. Never overwrites written words. */
export function useGenerateSnapshot() {
  return useMutation({
    mutationFn: (monthYear) => api.post(BASE, { monthYear }),
    onSuccess: cacheSnapshot,
  });
}

/** The only way to change a locked snapshot: append, never edit. */
export function useAddSnapshotAddendum(id) {
  return useMutation({
    mutationFn: (addendum) => api.post(`${BASE}/${encodeURIComponent(id)}/addenda`, addendum),
    onSuccess: cacheSnapshot,
  });
}

/**
 * Records the export, then hands the page over to the browser's print dialog.
 * Printing is not blocked on the record write — a failed audit row is worth a
 * console line, not a refusal to give someone their own document.
 */
export function useExportSnapshot(id) {
  return useMutation({
    mutationFn: async () => {
      try {
        cacheSnapshot(await api.post(`${BASE}/${encodeURIComponent(id)}/export`, { format: 'pdf' }));
      } catch (error) {
        console.warn('[snapshot] export not recorded', error);
      }
      globalThis.print?.();
    },
  });
}

/** Only what the participant writes — the counts and the source ids belong to the server. */
const toFields = (snapshot) => ({
  ...Object.fromEntries(SNAPSHOT_FIELD_KEYS.map((key) => [key, snapshot?.[key] ?? ''])),
  ...Object.fromEntries(SNAPSHOT_TAG_FIELD_KEYS.map((key) => [key, snapshot?.[key] ?? []])),
  ...Object.fromEntries(SNAPSHOT_CHOICE_FIELD_KEYS.map((key) => [key, snapshot?.[key] ?? ''])),
});

/**
 * The review screen's form: react-hook-form over the three layers, plus the two
 * actions the Figma footer has. Approve saves and locks in the same call, so
 * what is locked is always what was on screen.
 */
export function useSnapshotForm(id) {
  const navigate = useNavigate();
  const { data: snapshot, isLoading } = useSnapshot(id);

  const form = useForm({
    values: snapshot ? toFields(snapshot) : undefined,
    // A background refetch must never wipe what someone is mid-typing.
    resetOptions: { keepDirtyValues: true },
  });

  const write = useMutation({
    // Approve and Lock saves and locks in the same call; Save as Draft is
    // refused by the server once locked.
    mutationFn: ({ fields, approve }) =>
      approve
        ? api.post(`${BASE}/${encodeURIComponent(id)}/approve`, fields)
        : api.patch(`${BASE}/${encodeURIComponent(id)}`, fields),
    onSuccess: cacheSnapshot,
  });

  const run = async (approve) => {
    form.clearErrors();
    try {
      return await write.mutateAsync({ fields: form.getValues(), approve });
    } catch (error) {
      const details = error?.data;
      if (details && typeof details === 'object') {
        for (const [field, message] of Object.entries(details)) {
          if (typeof message === 'string') form.setError(field, { type: 'server', message });
        }
      }
      return null;
    }
  };

  return {
    form,
    snapshot,
    isLoading: Boolean(id) && isLoading,
    isSaving: write.isPending,
    error: write.error,
    isLocked: snapshot?.status === SNAPSHOT_STATUS.LOCKED,

    saveDraft: () => run(false),

    /** Approve and Lock — final, and lands on the locked view. */
    approve: async () => {
      const locked = await run(true);
      if (locked) navigate(participantSnapshotPath.detail(locked.id), { replace: true });
      return locked;
    },
  };
}
