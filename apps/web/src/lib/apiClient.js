import { useAuthStore } from '../store';

/**
 * The app's API client: one fetch wrapper, one place the token lives, one place
 * a 401 is handled.
 *
 * Base URL is relative in dev so Vite's /api proxy handles it (see
 * vite.config.js); set VITE_API_URL for deployed builds where web and API are
 * on different origins.
 */

const BASE_URL = `${import.meta.env.VITE_API_URL ?? ''}/api/v1`;
const TOKEN_KEY = 'tmg180-token';

/**
 * The API's response envelope, on success and failure alike:
 *
 *   { statusCode: 200, message: 'log in successful', data: { ... }, success: true }
 *   { statusCode: 400, message: 'Email not registered!!!', data: null, success: false }
 *
 * `request` unwraps `data` on success and throws `ApiError` on failure, so
 * callers never see the envelope.
 */

/** The API answered with an error: `status` (HTTP), `message`, optional `data`. */
export class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const isEnvelope = (payload) =>
  payload !== null && typeof payload === 'object' && 'success' in payload && 'statusCode' in payload;

/** Endpoints not yet on the envelope answer with the bare payload — pass it through. */
const unwrap = (payload) => (isEnvelope(payload) ? payload.data : payload);

// localStorage throws in private mode; a missing token just means unauthenticated.
const readToken = () => {
  try {
    return globalThis.localStorage?.getItem(TOKEN_KEY) ?? null;
  } catch {
    return null;
  }
};

const writeToken = (token) => {
  try {
    if (token) globalThis.localStorage?.setItem(TOKEN_KEY, token);
    else globalThis.localStorage?.removeItem(TOKEN_KEY);
  } catch {
    // Storage disabled — the session stays in memory for this tab only.
  }
};

/**
 * @param {boolean} [options.signOutOn401] false for the /auth endpoints you can
 *   call while signed out — a rejected sign-in must not clear a live session.
 */
async function request(method, path, { body, signOutOn401 = true } = {}) {
  const token = readToken();
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  // The token is a stateless JWT with no server-side session, so there is
  // nothing to refresh: a 401 means it is gone or expired.
  if (response.status === 401 && signOutOn401) {
    writeToken(null);
    useAuthStore.getState().signOut();
  }

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success === false) {
    throw new ApiError(
      payload?.statusCode ?? response.status,
      // A non-JSON failure (proxy down, HTML error page) still needs words.
      payload?.message ?? (response.statusText || 'Something went wrong.'),
      payload?.data ?? null
    );
  }
  return unwrap(payload);
}

/** Sign-in and sign-up both answer with data: { user, accessToken }. */
async function authenticate(path, body) {
  const { user, accessToken } = await request('POST', path, { body, signOutOn401: false });
  writeToken(accessToken);
  return user;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, { body }),
  patch: (path, body) => request('PATCH', path, { body }),
  delete: (path) => request('DELETE', path),

  auth: {
    signIn: (email, password) => authenticate('/auth/sign-in', { email, password }),
    signUp: (details) => authenticate('/auth/sign-up', details),
    /** Nothing to revoke server-side — this just drops the local token. */
    signOut: () => writeToken(null),
    me: () => request('GET', '/auth/me'),

    /** Always resolves — the API never reveals whether the address exists. */
    forgotPassword: (email) =>
      request('POST', '/auth/forgot-password', { body: { email }, signOutOn401: false }),

    /** Lets the reset screen show "link expired" before asking for a password. */
    verifyResetToken: (token) =>
      request('GET', `/auth/reset-password/${encodeURIComponent(token)}`, { signOutOn401: false }),

    resetPassword: (token, password) =>
      request('POST', '/auth/reset-password', { body: { token, password }, signOutOn401: false }),
  },
};
