import { createWebTokenStore, createMemoryTokenStore } from './tokenStore.js';

export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * HTTP client for the TMG180 API. Shared by the web app and (later) the React
 * Native app — the only platform-specific piece is the token store.
 *
 * Auth is bearer-token, not cookies, precisely so mobile can use it unchanged.
 * The access token is a stateless JWT with no server-side session, so there is
 * nothing to refresh: a 401 on an authenticated call just means the token is
 * gone or expired, and the client clears it and calls onAuthLost.
 *
 * @param {object} options
 * @param {string} options.baseUrl e.g. '/api/v1' on web, 'https://…/api/v1' on mobile
 * @param {import('./tokenStore.js').TokenStore} [options.tokenStore]
 * @param {() => void} [options.onAuthLost] called when an authenticated call 401s
 */
export function createApiClient({ baseUrl, tokenStore, onAuthLost }) {
  const tokens = tokenStore ?? createMemoryTokenStore();

  async function request(method, path, { body, signal, handleAuthLoss = true } = {}) {
    const current = await tokens.read();
    const headers = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (current?.accessToken) {
      headers.Authorization = `Bearer ${current.accessToken}`;
    }

    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      signal,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (response.status === 401 && handleAuthLoss) {
      await tokens.write(null);
      onAuthLost?.();
    }

    return parse(response);
  }

  async function parse(response) {
    if (response.status === 204) return null;

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new ApiError(
        response.status,
        payload?.error?.code ?? 'unknown_error',
        payload?.error?.message ?? response.statusText,
        payload?.error?.details
      );
    }
    return payload;
  }

  return {
    get: (path, opts) => request('GET', path, opts),
    post: (path, body, opts) => request('POST', path, { ...opts, body }),
    patch: (path, body, opts) => request('PATCH', path, { ...opts, body }),
    delete: (path, opts) => request('DELETE', path, opts),

    auth: {
      /** Creates the account and signs it in — same payload as signIn. */
      async signUp(details) {
        const result = await request('POST', '/auth/sign-up', {
          body: details,
          handleAuthLoss: false,
        });
        await tokens.write({ accessToken: result.accessToken });
        return result.user;
      },
      async signIn(email, password) {
        const result = await request('POST', '/auth/sign-in', {
          body: { email, password },
          handleAuthLoss: false,
        });
        await tokens.write({ accessToken: result.accessToken });
        return result.user;
      },
      /** Nothing to revoke server-side — this just drops the local token. */
      async signOut() {
        await tokens.write(null);
      },
      me: () => request('GET', '/auth/me'),

      /** Always resolves — the API never reveals whether the address exists. */
      forgotPassword: (email) =>
        request('POST', '/auth/forgot-password', { body: { email }, handleAuthLoss: false }),

      /** Lets the reset screen show "link expired" before asking for a password. */
      verifyResetToken: (token) =>
        request('GET', `/auth/reset-password/${encodeURIComponent(token)}`, {
          handleAuthLoss: false,
        }),

      resetPassword: (token, password) =>
        request('POST', '/auth/reset-password', {
          body: { token, password },
          handleAuthLoss: false,
        }),
    },
  };
}

export { createWebTokenStore, createMemoryTokenStore };
