import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { DAILY_LOG_AUTHOR_ROLE, DAILY_LOG_STATUS, canSubmitDailyLog } from '@tmg180/shared';
import { api } from '../../lib/apiClient';
import { queryClient } from '../../lib/queryClient';
import { todayValue } from '../../lib/dates';
import { WORKER_PATHS, workerDailyLogPath } from '../../routes/paths';

const BASE = '/worker/daily-logs';
const LAYER = { layer: DAILY_LOG_AUTHOR_ROLE.WORKER };

/**
 * Server state for the worker layer of the Daily Support Evidence Log (R-09).
 *
 * Same shape as the participant hooks: the list and each log are separate
 * queries; every write resolves with the fresh log, replaces the detail cache
 * and invalidates the lists. Keys are namespaced under ['worker', …] so a dual
 * participant/worker account never shares a cache entry between workspaces.
 *
 * The detail shape carries the worker's private narrative. It is cached here
 * like any other field — this is the author's own browser — but it is never
 * part of a list payload and the API never sends it to anyone else.
 */

export const workerDailyLogKeys = {
  all: ['worker', 'daily-logs'],
  lists: ['worker', 'daily-logs', 'list'],
  list: (params = {}) => ['worker', 'daily-logs', 'list', params],
  detail: (id) => ['worker', 'daily-logs', String(id)],
  participants: ['worker', 'participants'],
  goals: (participantId) => ['worker', 'participants', String(participantId), 'goals'],
};

/** Newest first. `params` accepts { from, to, status, limit }. */
export function useWorkerDailyLogs(params = {}) {
  return useQuery({
    queryKey: workerDailyLogKeys.list(params),
    queryFn: () => {
      const query = new URLSearchParams(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
      ).toString();
      return api.get(query ? `${BASE}?${query}` : BASE);
    },
  });
}

export function useWorkerDailyLog(id) {
  return useQuery({
    queryKey: workerDailyLogKeys.detail(id),
    queryFn: () => api.get(`${BASE}/${encodeURIComponent(id)}`),
    enabled: Boolean(id),
  });
}

/** The people who currently hold an active consent grant for this worker. */
export function useWorkerParticipants() {
  return useQuery({
    queryKey: workerDailyLogKeys.participants,
    queryFn: () => api.get('/worker/participants'),
    staleTime: 30_000,
  });
}

/** A consented participant's goals — what a log can link to. 403 when consent is gone. */
/**
 * The participant's goals, as the worker may link them. Goals are written by
 * the participant on *their* profile, often while the worker is already on
 * the form — so this is the one worker query that refetches on window focus
 * and never holds an empty answer as fresh: "no goals yet" is exactly the
 * state most likely to change underneath them.
 */
export function useParticipantGoals(participantId) {
  return useQuery({
    queryKey: workerDailyLogKeys.goals(participantId),
    queryFn: () => api.get(`/worker/participants/${encodeURIComponent(participantId)}/goals`),
    enabled: Boolean(participantId),
    staleTime: (query) => (query.state.data?.length ? 60_000 : 0),
    refetchOnWindowFocus: true,
    retry: (count, error) => error?.status !== 403 && count < 2,
  });
}

const cacheLog = (log) => {
  queryClient.setQueryData(workerDailyLogKeys.detail(log.id), log);
  queryClient.invalidateQueries({ queryKey: workerDailyLogKeys.lists });
  return log;
};

/** The only way to change a submitted log: append, never edit. */
export function useAddWorkerAddendum(id) {
  return useMutation({
    mutationFn: (addendum) => api.post(`${BASE}/${encodeURIComponent(id)}/addenda`, addendum),
    onSuccess: cacheLog,
  });
}

/** Blank draft — what the form opens on before anything is saved. */
const emptyLog = (participantId) => ({
  participantId: participantId ? String(participantId) : '',
  sessionDate: todayValue(),
  startTime: '',
  endTime: '',
  serviceType: '',
  location: '',
  goalIds: [],
  domainTags: [],
  ndisBucket: '',
  functionalGrouping: '',
  rnRationaleTags: [],
  impactText: '',
  supportText: '',
  outcomeText: '',
  comparison: '',
  participantVoice: '',
  safetyNote: '',
  privateNarrative: '',
  additionalNotes: '',
});

/** Only the fields the API owns — never post back id/status/addenda. */
const toFields = (values) => ({
  sessionDate: values.sessionDate || null,
  startTime: values.startTime || null,
  endTime: values.endTime || null,
  serviceType: values.serviceType ?? '',
  location: values.location ?? '',
  goalIds: (values.goalIds ?? []).map(Number),
  domainTags: values.domainTags ?? [],
  ndisBucket: values.ndisBucket || null,
  functionalGrouping: values.functionalGrouping || null,
  rnRationaleTags: values.rnRationaleTags ?? [],
  impactText: values.impactText ?? '',
  supportText: values.supportText ?? '',
  outcomeText: values.outcomeText ?? '',
  comparison: values.comparison || null,
  participantVoice: values.participantVoice ?? '',
  safetyNote: values.safetyNote ?? '',
  privateNarrative: values.privateNarrative ?? '',
  additionalNotes: values.additionalNotes ?? '',
});

/** A saved log back into form values. */
const fromLog = (log) => ({
  ...toFields(log),
  participantId: String(log.participant?.id ?? ''),
});

/**
 * Everything the worker log form needs — a react-hook-form instance
 * (prefilled from the saved draft when editing one) and the footer actions.
 *
 * Mirrors the participant hook: the draft is created lazily on first save,
 * Submit saves-and-finalises in one call, the shared evidence rule runs
 * client-side first, and server field errors land next to their fields. The
 * one addition is the participant: a new log must say who it is about, and
 * that is fixed once the draft exists.
 */
export function useWorkerDailyLogForm(id, { participantId: presetParticipantId } = {}) {
  const navigate = useNavigate();
  const { data: log, isLoading, error: loadError } = useWorkerDailyLog(id);

  const blank = useMemo(() => emptyLog(presetParticipantId), [presetParticipantId]);

  const form = useForm({
    values: id ? (log ? fromLog(log) : undefined) : blank,
    resetOptions: { keepDirtyValues: true },
  });

  const save = useMutation({
    mutationFn: async ({ participantId, fields, submit }) => {
      const created = id ? null : await api.post(BASE, { participantId: Number(participantId), ...fields });
      const logId = id ?? created.id;
      if (submit) return api.post(`${BASE}/${encodeURIComponent(logId)}/submit`, fields);
      return created ?? api.patch(`${BASE}/${encodeURIComponent(logId)}`, fields);
    },
    onSuccess: cacheLog,
  });

  const run = async ({ submit }) => {
    const values = form.getValues();
    const fields = toFields(values);

    if (!id && !values.participantId) {
      form.setError('participantId', { type: 'submit', message: 'Choose who this support was for.' });
      return null;
    }
    if (submit) {
      const { ok, errors } = canSubmitDailyLog(fields, LAYER);
      if (!ok) {
        for (const [field, message] of Object.entries(errors)) {
          form.setError(field, { type: 'submit', message });
        }
        return null;
      }
    }

    form.clearErrors();
    try {
      return await save.mutateAsync({ participantId: values.participantId, fields, submit });
    } catch (error) {
      const details = error?.data;
      if (details && typeof details === 'object' && details.reason !== 'consent_required') {
        for (const [field, message] of Object.entries(details)) {
          if (typeof message === 'string') form.setError(field, { type: 'server', message });
        }
      }
      return null;
    }
  };

  return {
    form,
    log,
    isLoading: Boolean(id) && isLoading,
    loadError,
    isSaving: save.isPending,
    error: save.error,
    /** True when the API refused because the participant's consent is gone. */
    consentLost: save.error?.status === 403 && save.error?.data?.reason === 'consent_required',
    isLocked: log?.status === DAILY_LOG_STATUS.SUBMITTED,

    saveDraft: async () => {
      const saved = await run({ submit: false });
      if (saved && !id) navigate(workerDailyLogPath.edit(saved.id), { replace: true });
      return saved;
    },

    submit: async () => {
      const saved = await run({ submit: true });
      if (saved) navigate(workerDailyLogPath.detail(saved.id), { replace: true });
      return saved;
    },

    cancel: () => navigate(WORKER_PATHS.dailyLogs),
  };
}

/** Adds or removes a value in a chips answer array. */
export const toggleInList = (list = [], value) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
