import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { canSubmitCheckIn } from '@tmg180/shared';
import { api } from '../../lib/apiClient';
import { queryClient } from '../../lib/queryClient';
import { participantCheckInPath, PARTICIPANT_PATHS } from '../../routes/paths';
import { today } from './dailyLog';

const BASE = '/participant/check-ins';

/**
 * Server state for the Participant Check-in (Template B / M-04).
 *
 * Simpler than the daily log by design: a check-in has no draft state, so
 * there is no lazy create, no PATCH and no autosave. The form fills, the
 * participant saves once, and the record is locked — which is also why the
 * only cache writes here are "add to the list" and "cache the new detail".
 */

export const checkInKeys = {
  all: ['participant', 'check-ins'],
  lists: ['participant', 'check-ins', 'list'],
  list: (params = {}) => ['participant', 'check-ins', 'list', params],
  detail: (id) => ['participant', 'check-ins', String(id)],
  summary: ['participant', 'check-ins', 'summary'],
};

/** Newest first. `params` accepts { month: 'YYYY-MM' }. */
export function useCheckIns(params = {}) {
  return useQuery({
    queryKey: checkInKeys.list(params),
    queryFn: () => {
      const query = new URLSearchParams(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
      ).toString();
      return api.get(query ? `${BASE}?${query}` : BASE);
    },
  });
}

export function useCheckIn(id) {
  return useQuery({
    queryKey: checkInKeys.detail(id),
    queryFn: () => api.get(`${BASE}/${encodeURIComponent(id)}`),
    enabled: Boolean(id),
  });
}

/** Counts and the last check-in date — what a screen shows without opening one. */
export function useCheckInSummary() {
  return useQuery({
    queryKey: checkInKeys.summary,
    queryFn: () => api.get(`${BASE}/summary`),
    staleTime: 60_000,
  });
}

/** Blank check-in — everything past the period and the date is optional. */
const emptyCheckIn = () => ({
  period: 'this_week',
  checkinDate: today(),
  impactTags: [],
  impactNotes: '',
  intensityRating: null,
  helpedTags: [],
  helpedNotes: '',
  recoveryLevel: '',
  recoveryNotes: '',
  ownWords: '',
  goalsTags: [],
  goalsNotes: '',
});

/** Only the fields the API owns. */
const toFields = (values) => ({
  period: values.period || null,
  checkinDate: values.checkinDate || null,
  impactTags: values.impactTags ?? [],
  impactNotes: values.impactNotes ?? '',
  intensityRating:
    values.intensityRating === null || values.intensityRating === ''
      ? null
      : Number(values.intensityRating),
  helpedTags: values.helpedTags ?? [],
  helpedNotes: values.helpedNotes ?? '',
  recoveryLevel: values.recoveryLevel || null,
  recoveryNotes: values.recoveryNotes ?? '',
  ownWords: values.ownWords ?? '',
  goalsTags: values.goalsTags ?? [],
  goalsNotes: values.goalsNotes ?? '',
});

/**
 * Everything the check-in form needs. Saving runs the shared contract first —
 * the same check the server repeats — so the "pick 1–3" rule surfaces next to
 * the options rather than as a 400, and lands on the saved (locked) check-in.
 */
export function useCheckInForm() {
  const navigate = useNavigate();

  // Stable identity: a fresh object every render would reset the form.
  const blank = useMemo(emptyCheckIn, []);
  const form = useForm({ values: blank });

  const save = useMutation({
    mutationFn: (fields) => api.post(BASE, fields),
    onSuccess: (checkIn) => {
      queryClient.setQueryData(checkInKeys.detail(checkIn.id), checkIn);
      queryClient.invalidateQueries({ queryKey: checkInKeys.lists });
      queryClient.invalidateQueries({ queryKey: checkInKeys.summary });
      return checkIn;
    },
  });

  return {
    form,
    isSaving: save.isPending,
    error: save.error,

    save: async () => {
      const fields = toFields(form.getValues());

      const { ok, errors } = canSubmitCheckIn(fields);
      if (!ok) {
        for (const [field, message] of Object.entries(errors)) {
          form.setError(field, { type: 'submit', message });
        }
        return null;
      }

      form.clearErrors();
      try {
        const saved = await save.mutateAsync(fields);
        navigate(participantCheckInPath.detail(saved.id), { replace: true });
        return saved;
      } catch (error) {
        // Field-level errors come back as data: { field: message }.
        const details = error?.data;
        if (details && typeof details === 'object') {
          for (const [field, message] of Object.entries(details)) {
            if (typeof message === 'string') form.setError(field, { type: 'server', message });
          }
        }
        return null;
      }
    },

    cancel: () => navigate(PARTICIPANT_PATHS.checkIns),
  };
}
