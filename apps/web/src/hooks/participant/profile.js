import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  PROFILE_SECTION_STATUS,
  PROFILE_SECTIONS,
  PROFILE_TOTAL_SECTIONS,
  nextProfileSection,
  profileSection,
  profileSectionSlug,
} from '@tmg180/shared';
import { api } from '../../lib/apiClient';
import { queryClient } from '../../lib/queryClient';
import { PARTICIPANT_PATHS } from '../../routes/paths';

/**
 * Server state for the Personal Profile. One query holds the whole profile
 * (progress + answers); every section save resolves with the fresh profile and
 * replaces the cache, so the hub and the section pages always agree.
 */

export const profileKeys = {
  profile: ['participant', 'profile'],
};

/** Section key -> route, derived from the canonical seed order. */
export const SECTION_PATHS = Object.fromEntries(
  PROFILE_SECTIONS.map((section) => [
    section.key,
    `${PARTICIPANT_PATHS.profile}/${profileSectionSlug(section.key)}`,
  ])
);

/** Where "start" and stale continue-keys land: the first section in seed order. */
export const FIRST_SECTION_PATH = SECTION_PATHS[PROFILE_SECTIONS[0].key];

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.profile,
    queryFn: () => api.get('/participant/profile'),
    staleTime: 60_000,
  });
}

export function useSaveSection() {
  return useMutation({
    // Partial saves welcome — this is also Save Draft. Resolves with the
    // fresh full profile, progress recomputed.
    mutationFn: ({ sectionKey, answers }) =>
      api.patch(`/participant/profile/sections/${encodeURIComponent(sectionKey)}`, { answers }),
    onSuccess: (profile) => queryClient.setQueryData(profileKeys.profile, profile),
  });
}

/**
 * Everything a section page needs: a react-hook-form instance prefilled from
 * the saved answers, save actions for each button idiom, and the section's
 * live status.
 *
 * Drafts are never blocked client-side — completeness only affects the status
 * the server computes, so every save action just sends what's typed.
 */
export function useSectionForm(sectionKey, { transform } = {}) {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();
  const save = useSaveSection();

  const section = profileSection(sectionKey);
  const saved = profile?.sections?.[sectionKey];

  const form = useForm({
    values: saved?.answers ?? {},
    // A background refetch must never wipe what someone is mid-typing.
    resetOptions: { keepDirtyValues: true },
  });

  const index = PROFILE_SECTIONS.findIndex((s) => s.key === sectionKey);
  const previous = PROFILE_SECTIONS[index - 1] ?? null;
  const next = nextProfileSection(sectionKey);

  const saveThen = (path) => async () => {
    const values = form.getValues();
    const answers = transform ? transform(values) : values;
    try {
      await save.mutateAsync({ sectionKey, answers });
      if (path) navigate(path);
    } catch {
      // save.error renders in the page's banner; stay put on failure.
    }
  };

  return {
    section,
    form,
    isLoading,
    isSaving: save.isPending,
    error: save.error,
    status: saved?.status ?? PROFILE_SECTION_STATUS.NOT_STARTED,
    isLast: !next,
    /** e.g. "04/11" — position in the seed order, for the sidebar counter. */
    position: `${String(section.order).padStart(2, '0')}/${PROFILE_TOTAL_SECTIONS}`,
    saveDraft: saveThen(null),
    saveAndExit: saveThen(PARTICIPANT_PATHS.profile),
    saveAndContinue: saveThen(next ? SECTION_PATHS[next.key] : PARTICIPANT_PATHS.profile),
    /** Previous never saves — matches the built screens. */
    goPrevious: () =>
      navigate(previous ? SECTION_PATHS[previous.key] : PARTICIPANT_PATHS.profile),
  };
}

/** Adds or removes a value in a chips/checklist answer array. */
export const toggleInList = (list = [], value) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
