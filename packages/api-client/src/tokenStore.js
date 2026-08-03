/**
 * Token storage is the one thing web and mobile genuinely cannot share:
 * browsers get localStorage, React Native gets expo-secure-store. Both satisfy
 * this interface, so everything above it stays identical.
 *
 * @typedef {object} TokenStore
 * @property {() => (Tokens|null)|Promise<Tokens|null>} read
 * @property {(tokens: Tokens|null) => void|Promise<void>} write
 *
 * @typedef {{ accessToken: string, refreshToken: string }} Tokens
 */

const STORAGE_KEY = 'tmg180-tokens';

/** Browser implementation. @returns {TokenStore} */
export function createWebTokenStore(storageKey = STORAGE_KEY) {
  return {
    read() {
      try {
        const raw = globalThis.localStorage?.getItem(storageKey);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
    write(tokens) {
      try {
        if (tokens) {
          globalThis.localStorage?.setItem(storageKey, JSON.stringify(tokens));
        } else {
          globalThis.localStorage?.removeItem(storageKey);
        }
      } catch {
        // Storage disabled (private mode) — session stays in memory only.
      }
    },
  };
}

/** Non-persistent fallback, used in tests and SSR. @returns {TokenStore} */
export function createMemoryTokenStore() {
  let tokens = null;
  return {
    read: () => tokens,
    write: (next) => {
      tokens = next;
    },
  };
}
