import axios from 'axios';
import { useAuthStore } from '../store';

/**
 * The app's API client: one axios instance, one place the tokens live, one
 * place an expired session is handled.
 *
 * Base URL is relative in dev so Vite's /api proxy handles it (see
 * vite.config.js); set VITE_API_URL for deployed builds where web and API are
 * on different origins.
 */

const BASE_URL = `${import.meta.env.VITE_API_URL ?? ''}/api/v1`;

/**
 * Two tokens, two jobs. The access token is short-lived and rides on every
 * request; the refresh token is long-lived, goes nowhere except /auth/refresh,
 * and is the only half the server can revoke.
 */
const TOKEN_KEY = 'tmg180-token';
const REFRESH_KEY = 'tmg180-refresh';

/**
 * The API's response envelope, on success and failure alike:
 *
 *   { statusCode: 200, message: 'log in successful', data: { ... }, success: true }
 *   { statusCode: 400, message: 'Email not registered!!!', data: null, success: false }
 *
 * The client unwraps `data` on success and throws `ApiError` on failure, so
 * callers never see the envelope.
 */

/**
 * The API answered with an error: `status` (HTTP), `message`, optional `data`.
 * A dead network is deliberately NOT an ApiError — callers use that
 * distinction to decide whether the message is worth showing.
 */
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
const read = (key) => {
  try {
    return globalThis.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    if (value) globalThis.localStorage?.setItem(key, value);
    else globalThis.localStorage?.removeItem(key);
  } catch {
    // Storage disabled — the session stays in memory for this tab only.
  }
};

const storeSession = ({ accessToken, refreshToken }) => {
  write(TOKEN_KEY, accessToken);
  write(REFRESH_KEY, refreshToken);
};

const clearSession = () => {
  write(TOKEN_KEY, null);
  write(REFRESH_KEY, null);
};

/**
 * Refreshing is deduplicated: an expired access token usually surfaces as
 * several 401s at once (a screen firing three queries on mount), and each one
 * racing its own rotation would spend the others' refresh token and sign
 * everybody out. They all await the same attempt instead.
 */
let refreshInFlight = null;

/**
 * Bare `axios`, not the `http` instance — the instance's interceptors call
 * this on a 401, so going back through them would recurse.
 *
 * @returns true if a new access token is now stored.
 */
async function rotateSession() {
  const refreshToken = read(REFRESH_KEY);
  if (!refreshToken) return false;

  try {
    const response = await axios.post(
      `${BASE_URL}/auth/refresh`,
      { refreshToken },
      { headers: { Accept: 'application/json' }, validateStatus: () => true }
    );

    // A rejected refresh token is final — the session is genuinely over.
    // Anything else (network down, API restarting, a 500) is not the session's
    // fault, so leave the tokens alone and let the caller surface the error.
    if (response.status === 401 || response.status === 403) {
      clearSession();
      return false;
    }
    if (response.status < 200 || response.status >= 300) return false;

    const session = unwrap(response.data);
    if (!session?.accessToken) return false;

    storeSession(session);
    return true;
  } catch {
    // Network failure. Same reasoning: not a reason to end the session.
    return false;
  }
}

function refreshSessionOnce() {
  refreshInFlight ??= rotateSession().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

const http = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = read(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Success side: unwrap the envelope so callers get `data` directly. A 2xx
 * carrying `success: false` still counts as the API saying no.
 *
 * Error side: a 401 means the access token is gone or past its 15 minutes.
 * That is the expected state most of the time, not an error: rotate and
 * replay the call once (`_retried` guards the replay so a persistent 401
 * cannot loop), and only end the session if the refresh token is dead too.
 * Config flags ride on the axios config: `recoverFrom401: false` for the
 * /auth endpoints you can call while signed out — a rejected sign-in must not
 * try to refresh a session or clear a live one.
 */
http.interceptors.response.use(
  (response) => {
    if (response.status === 204) return null;
    const payload = response.data;
    if (payload?.success === false) {
      throw new ApiError(
        payload.statusCode ?? response.status,
        payload.message ?? 'Something went wrong.',
        payload.data ?? null
      );
    }
    return unwrap(payload);
  },
  async (error) => {
    const { config, response } = error;

    // No response at all — network down, CORS, aborted. Not the API
    // answering, so not an ApiError; callers show a generic message.
    if (!response) throw error;

    if (response.status === 401 && config?.recoverFrom401 !== false) {
      if (!config?._retried && (await refreshSessionOnce())) {
        return http({ ...config, _retried: true });
      }
      useAuthStore.getState().signOut();
    }

    const payload = response.data;
    throw new ApiError(
      payload?.statusCode ?? response.status,
      // A non-JSON failure (proxy down, HTML error page) still needs words.
      payload?.message ?? (response.statusText || 'Something went wrong.'),
      payload?.data ?? null
    );
  }
);

const request = (method, path, { body, params, recoverFrom401 = true } = {}) =>
  http({ method, url: path, data: body, params, recoverFrom401 });

/** Sign-in and sign-up both answer with data: { user, accessToken, refreshToken }. */
async function authenticate(path, body) {
  const session = await request('POST', path, { body, recoverFrom401: false });
  storeSession(session);
  return session.user;
}

export const api = {
  get: (path, params) => request('GET', path, { params }),
  post: (path, body) => request('POST', path, { body }),
  patch: (path, body) => request('PATCH', path, { body }),
  delete: (path) => request('DELETE', path),

  auth: {
    signIn: (email, password) => authenticate('/auth/sign-in', { email, password }),
    signUp: (details) => authenticate('/auth/sign-up', details),

    /**
     * Drops the local tokens first so the UI is signed out immediately, then
     * tells the API to revoke the chain. That call is best-effort: it is not
     * worth blocking sign-out on, and an unrevoked refresh token still expires
     * on its own.
     */
    signOut: () => {
      const refreshToken = read(REFRESH_KEY);
      clearSession();
      if (!refreshToken) return;
      request('POST', '/auth/sign-out', {
        body: { refreshToken },
        recoverFrom401: false,
      }).catch(() => undefined);
    },

    me: () => request('GET', '/auth/me'),

    /** Always resolves — the API never reveals whether the address exists. */
    forgotPassword: (email) =>
      request('POST', '/auth/forgot-password', { body: { email }, recoverFrom401: false }),

    /** Lets the reset screen show "link expired" before asking for a password. */
    verifyResetToken: (token) =>
      request('GET', `/auth/reset-password/${encodeURIComponent(token)}`, {
        recoverFrom401: false,
      }),

    resetPassword: (token, password) =>
      request('POST', '/auth/reset-password', {
        body: { token, password },
        recoverFrom401: false,
      }),
  },
};
