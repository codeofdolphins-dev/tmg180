/**
 * The app's single auth seam. Every screen and the auth store talk to
 * `authService` — never to a backend module directly — so moving off mock
 * accounts is this one switch.
 *
 * Set VITE_AUTH_BACKEND=api once the API has real user tables. Until then the
 * mock backend runs, including in production builds, because there is nothing
 * else to sign in against.
 */
import { mockAuthBackend } from './mockAuthBackend.js';
import { apiAuthBackend } from './apiAuthBackend.js';

export const USING_MOCK_AUTH = (import.meta.env.VITE_AUTH_BACKEND ?? 'mock') !== 'api';

export const authService = USING_MOCK_AUTH ? mockAuthBackend : apiAuthBackend;

export { AuthError } from './AuthError.js';
