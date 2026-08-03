import { createApiClient, createWebTokenStore } from '@tmg180/api-client';
import { useAuthStore } from '../store';

/**
 * The app's single API client.
 *
 * Base URL is relative in dev so Vite's /api proxy handles it (see
 * vite.config.js); set VITE_API_URL for deployed builds where web and API are
 * on different origins.
 */
export const api = createApiClient({
  baseUrl: `${import.meta.env.VITE_API_URL ?? ''}/api/v1`,
  tokenStore: createWebTokenStore(),
  onAuthLost: () => useAuthStore.getState().signOut(),
});
