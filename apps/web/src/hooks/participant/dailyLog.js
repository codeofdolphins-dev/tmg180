import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { canSubmitDailyLog, DAILY_LOG_STATUS } from '@tmg180/shared';
import { api } from '../../lib/apiClient';
import { queryClient } from '../../lib/queryClient';
import { PARTICIPANT_PATHS, participantDailyLogPath } from '../../routes/paths';

const BASE = '/participant/daily-logs';

/**
 * Server state for the Daily Support Evidence Log (R-09, participant layer).
 *
 * The list and each log are separate queries — a log holds its addenda, and
 * the list only needs summaries, so one cache entry per log keeps a long
 * history cheap. Every write resolves with the fresh log and replaces the
 * detail cache, then invalidates the list so its summary follows.
 */

export const dailyLogKeys = {
  all: ['participant', 'daily-logs'],
  lists: ['participant', 'daily-logs', 'list'],
  list: (params = {}) => ['participant', 'daily-logs', 'list', params],
  detail: (id) => ['participant', 'daily-logs', String(id)],
  goals: ['participant', 'goals'],
};

/** Today in the browser's timezone, as the API's YYYY-MM-DD. */
export function today() {
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset();
  return new Date(now.getTime() - offsetMinutes * 60_000).toISOString().slice(0, 10);
}

/** Newest first. `params` accepts { from, to, status }. */
export function useDailyLogs(params = {}) {
  return useQuery({
    queryKey: dailyLogKeys.list(params),
    queryFn: () => {
      const query = new URLSearchParams(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
      ).toString();
      return api.get(query ? `${BASE}?${query}` : BASE);
    },
  });
}

export function useDailyLog(id) {
  return useQuery({
    queryKey: dailyLogKeys.detail(id),
    queryFn: () => api.get(`${BASE}/${encodeURIComponent(id)}`),
    enabled: Boolean(id),
  });
}

/** The goals a log links to — the participant's own, from My Goals. */
export function useGoals() {
  return useQuery({
    queryKey: dailyLogKeys.goals,
    queryFn: () => api.get('/participant/goals'),
    staleTime: 60_000,
  });
}

const cacheLog = (log) => {
  queryClient.setQueryData(dailyLogKeys.detail(log.id), log);
  // Only the lists — the detail was just replaced with the server's copy,
  // and invalidating it would refetch over what is on screen.
  queryClient.invalidateQueries({ queryKey: dailyLogKeys.lists });
  return log;
};

/** The only way to change a submitted log: append, never edit. */
export function useAddAddendum(id) {
  return useMutation({
    mutationFn: (addendum) => api.post(`${BASE}/${encodeURIComponent(id)}/addenda`, addendum),
    onSuccess: cacheLog,
  });
}

/** Blank draft — what the form opens on before anything is saved. */
const emptyLog = () => ({
  sessionDate: today(),
  startTime: '',
  endTime: '',
  goalIds: [],
  domainTags: [],
  ndisBucket: '',
  functionalGrouping: '',
  rnRationaleTags: [],
  impactText: '',
  supportText: '',
  outcomeText: '',
  comparison: '',
  additionalNotes: '',
});

/** Only the fields the API owns — never post back id/status/addenda. */
const toFields = (values) => ({
  sessionDate: values.sessionDate || null,
  startTime: values.startTime || null,
  endTime: values.endTime || null,
  goalIds: (values.goalIds ?? []).map(Number),
  domainTags: values.domainTags ?? [],
  ndisBucket: values.ndisBucket || null,
  functionalGrouping: values.functionalGrouping || null,
  rnRationaleTags: values.rnRationaleTags ?? [],
  impactText: values.impactText ?? '',
  supportText: values.supportText ?? '',
  outcomeText: values.outcomeText ?? '',
  comparison: values.comparison || null,
  additionalNotes: values.additionalNotes ?? '',
});

/**
 * Everything the log form needs: a react-hook-form instance (prefilled from
 * the saved draft when editing one), and the two actions the Figma footer has.
 *
 * A draft is created lazily on the first save, so opening the form and walking
 * away leaves nothing behind. Submit runs the shared evidence rule before it
 * calls the API — the same check the server repeats — so the 1-3 goals and
 * domain-tag requirements surface next to the fields rather than as a 400.
 */
export function useDailyLogForm(id) {
  const navigate = useNavigate();
  const { data: log, isLoading } = useDailyLog(id);

  // Stable identity: react-hook-form resets whenever  changes, and a
  // fresh object every render would wipe what is being typed.
  const blank = useMemo(emptyLog, []);

  const form = useForm({
    values: id ? (log ? toFields(log) : undefined) : blank,
    // A background refetch must never wipe what someone is mid-typing.
    resetOptions: { keepDirtyValues: true },
  });

  const save = useMutation({
    mutationFn: async ({ fields, submit }) => {
      // A log the form has never saved has no id yet — create it first, then
      // submit that same id, so Submit never leaves someone a silent draft.
      // Submit saves and finalises in one call, so a log can never be locked
      // with anything other than what was on screen.
      const created = id ? null : await api.post(BASE, fields);
      const logId = id ?? created.id;
      if (submit) return api.post(`${BASE}/${encodeURIComponent(logId)}/submit`, fields);
      return created ?? api.patch(`${BASE}/${encodeURIComponent(logId)}`, fields);
    },
    onSuccess: cacheLog,
  });

  const run = async ({ submit }) => {
    const fields = toFields(form.getValues());

    if (submit) {
      const { ok, errors } = canSubmitDailyLog(fields);
      if (!ok) {
        for (const [field, message] of Object.entries(errors)) {
          form.setError(field, { type: 'submit', message });
        }
        return null;
      }
    }

    form.clearErrors();
    try {
      const saved = await save.mutateAsync({ fields, submit });
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
  };

  return {
    form,
    /** The saved log, once there is one — the draft's id, status, addenda. */
    log,
    isLoading: Boolean(id) && isLoading,
    isSaving: save.isPending,
    error: save.error,
    isLocked: log?.status === DAILY_LOG_STATUS.SUBMITTED,

    /** Save Draft — stays on the form, moving to the saved log's own URL. */
    saveDraft: async () => {
      const saved = await run({ submit: false });
      // keepScroll: the form has not moved, only its URL — see ScrollToTop.
      if (saved && !id) {
        navigate(participantDailyLogPath.edit(saved.id), { replace: true, state: { keepScroll: true } });
      }
      return saved;
    },

    /** Submit Log — locks the record and lands on its read-only view. */
    submit: async () => {
      const saved = await run({ submit: true });
      if (saved) navigate(participantDailyLogPath.detail(saved.id), { replace: true });
      return saved;
    },

    cancel: () => navigate(PARTICIPANT_PATHS.dailyLog),
  };
}

/** Adds or removes a value in a chips answer array. */
export const toggleInList = (list = [], value) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
