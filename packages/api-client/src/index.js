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
 * A 401 triggers one refresh attempt; concurrent 401s share that single attempt
 * rather than stampeding the refresh endpoint.
 *
 * @param {object} options
 * @param {string} options.baseUrl e.g. '/api/v1' on web, 'https://…/api/v1' on mobile
 * @param {import('./tokenStore.js').TokenStore} [options.tokenStore]
 * @param {() => void} [options.onAuthLost] called when refresh fails — clear session
 */
export function createApiClient({ baseUrl, tokenStore, onAuthLost }) {
  const tokens = tokenStore ?? createMemoryTokenStore();
  let refreshInFlight = null;

  async function request(method, path, { body, signal, retry = true } = {}) {
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

    if (response.status === 401 && retry && current?.refreshToken) {
      const refreshed = await refresh(current.refreshToken);
      if (refreshed) return request(method, path, { body, signal, retry: false });
    }

    return parse(response);
  }

  async function refresh(refreshToken) {
    refreshInFlight ??= (async () => {
      try {
        const response = await fetch(`${baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (!response.ok) throw new Error('refresh failed');
        const next = await response.json();
        await tokens.write(next);
        return true;
      } catch {
        await tokens.write(null);
        onAuthLost?.();
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();

    return refreshInFlight;
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
      async signIn(email, password) {
        const result = await request('POST', '/auth/sign-in', {
          body: { email, password },
          retry: false,
        });
        await tokens.write({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });
        return result.user;
      },
      async signOut() {
        const current = await tokens.read();
        if (current?.refreshToken) {
          await request('POST', '/auth/sign-out', {
            body: { refreshToken: current.refreshToken },
            retry: false,
          }).catch(() => {});
        }
        await tokens.write(null);
      },
      me: () => request('GET', '/auth/me'),
    },
  };
}

export { createWebTokenStore, createMemoryTokenStore };
