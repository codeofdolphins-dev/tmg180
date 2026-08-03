import { BANNED_TERMS, findBannedTerms } from './bannedTerms.js';

/**
 * Terminology registry client.
 *
 * Non-negotiable: all UI text comes from `tmg_terminology_registry`, never from
 * hardcoded strings. Web and mobile both consume this, so the resolution rules
 * live here rather than in either app.
 *
 * The 69 built screens still carry Figma-faithful literal copy. Migrating them
 * onto `t()` is a separate pass — this package is the destination, not the
 * migration itself.
 */

let registry = new Map();
let loaded = false;

/**
 * @param {Record<string, string>} terms key -> resolved display text
 */
export function hydrateRegistry(terms) {
  registry = new Map(Object.entries(terms ?? {}));
  loaded = true;
}

/**
 * Fetch the registry from the API and hydrate it.
 * @param {{ get: (path: string) => Promise<any> }} client an @tmg180/api-client instance
 */
export async function loadRegistry(client) {
  const terms = await client.get('/terminology');
  hydrateRegistry(terms);
  return terms;
}

export function isRegistryLoaded() {
  return loaded;
}

/**
 * Resolve a registry key to display text.
 *
 * Missing keys return the key itself so a screen renders something visible and
 * obviously wrong rather than blank — the intent is that it gets noticed.
 *
 * @param {string} key
 * @param {Record<string, string|number>} [vars] `{name}` placeholders
 */
export function t(key, vars) {
  const value = registry.get(key) ?? key;
  if (!vars) return value;

  return value.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match
  );
}

export { BANNED_TERMS, findBannedTerms };
