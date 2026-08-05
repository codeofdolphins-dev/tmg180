/** The participant Personal Profile endpoints, in one place. */
import { api } from '../../../lib/apiClient';

export const profileService = {
  /** The whole profile: progress + every section's answers. */
  get: () => api.get('/participant/profile'),

  /**
   * Saves one section's answers (partial saves welcome — this is also Save
   * Draft). Resolves with the fresh full profile, progress recomputed.
   */
  saveSection: (sectionKey, answers) =>
    api.patch(`/participant/profile/sections/${encodeURIComponent(sectionKey)}`, { answers }),
};
