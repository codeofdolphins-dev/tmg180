/**
 * Participant Personal Profile service — the seam between screens and HTTP,
 * mirroring services/auth. Screens and hooks talk to this, never to the API
 * client directly.
 */
import { api } from '../../lib/apiClient';

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
