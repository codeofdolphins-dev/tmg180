import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { canSubmitConcern } from '@tmg180/shared';
import { api } from '../../lib/apiClient';
import { queryClient } from '../../lib/queryClient';
import { participantConcernPath, PARTICIPANT_PATHS } from '../../routes/paths';

const BASE = '/participant/concerns';

/**
 * Server state for Raise a concern (Mandatory Policy 2).
 *
 * A concern has no draft — it is received the moment it saves — so, like the
 * check-in, there is no lazy create and no PATCH. The only write after
 * raising one is a follow-up, which appends and never edits.
 */

export const concernKeys = {
  all: ['participant', 'concerns'],
  list: ['participant', 'concerns', 'list'],
  detail: (id) => ['participant', 'concerns', String(id)],
};

export function useConcerns() {
  return useQuery({ queryKey: concernKeys.list, queryFn: () => api.get(BASE) });
}

export function useConcern(id) {
  return useQuery({
    queryKey: concernKeys.detail(id),
    queryFn: () => api.get(`${BASE}/${encodeURIComponent(id)}`),
    enabled: Boolean(id),
  });
}

const cacheConcern = (concern) => {
  queryClient.setQueryData(concernKeys.detail(concern.id), concern);
  queryClient.invalidateQueries({ queryKey: concernKeys.list });
  return concern;
};

/** A follow-up in the participant's words — refused once the ticket is closed. */
export function useAddConcernFollowUp(id) {
  return useMutation({
    mutationFn: (text) => api.post(`${BASE}/${encodeURIComponent(id)}/responses`, { text }),
    onSuccess: cacheConcern,
  });
}

const emptyConcern = () => ({
  kind: '',
  category: '',
  relatesTo: '',
  about: '',
  description: '',
  whatWouldHelp: '',
});

const toFields = (values) => ({
  kind: values.kind || null,
  category: values.category || null,
  relatesTo: values.relatesTo || null,
  about: values.about ?? '',
  description: values.description ?? '',
  whatWouldHelp: values.whatWouldHelp ?? '',
});

/**
 * The form: runs the shared rule first — the same check the server repeats —
 * so what is missing is said next to the field, then lands on the received
 * ticket.
 */
export function useConcernForm() {
  const navigate = useNavigate();
  const blank = useMemo(emptyConcern, []);
  const form = useForm({ values: blank });

  const save = useMutation({
    mutationFn: (fields) => api.post(BASE, fields),
    onSuccess: cacheConcern,
  });

  return {
    form,
    isSaving: save.isPending,
    error: save.error,

    submit: async () => {
      const fields = toFields(form.getValues());
      const { ok, errors } = canSubmitConcern(fields);
      if (!ok) {
        for (const [field, message] of Object.entries(errors)) {
          form.setError(field, { type: 'submit', message });
        }
        return null;
      }
      form.clearErrors();
      try {
        const saved = await save.mutateAsync(fields);
        navigate(participantConcernPath.detail(saved.id), { replace: true });
        return saved;
      } catch (error) {
        const details = error?.data;
        if (details && typeof details === 'object') {
          for (const [field, message] of Object.entries(details)) {
            if (typeof message === 'string') form.setError(field, { type: 'server', message });
          }
        }
        return null;
      }
    },

    cancel: () => navigate(PARTICIPANT_PATHS.concerns),
  };
}
