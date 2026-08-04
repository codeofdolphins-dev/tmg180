/**
 * Auth contract shared by the web app, the API and (later) the React Native
 * client. Password rules live here so a sign-up form and the server can never
 * disagree about what counts as a valid password.
 *
 * Canon note: the TMG180 document set contains no auth specification. The
 * Comprehensive Gaps Analysis (25 May 2026) lists "Cybersecurity and Privacy
 * Specification" as an unwritten HIGH-priority document covering MFA, AES-256
 * at rest, TLS in transit and 72-hour breach notification. Everything here is
 * provisional until that document lands.
 */
import { ALL_ROLES, ROLES, isRole } from './roles.js';

export const ACCOUNT_STATUS = {
  INVITED: 'invited',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
};

/**
 * Roles a person may create for themselves. Admin is never self-served — the
 * Technical Brief treats platform governance as a separate data layer, so
 * those accounts are provisioned, not signed up for.
 */
export const SELF_SIGNUP_ROLES = [ROLES.PARTICIPANT, ROLES.WORKER];

/**
 * What a person agrees to when creating an account. Held here so the checkbox
 * a person ticks and the record written to tmg_audit_log reference the same id
 * and version — an acceptance record that can't be tied to exact wording is
 * not worth much.
 *
 * The platform-provider acknowledgement exists because the Comprehensive Gaps
 * Analysis flags non-disclosure as URGENT, and the Privacy Act's APP 5 wants
 * collection notice given at the point of collection.
 *
 * WORDING IS PROVISIONAL — Sue Lowdon (framework author) signs off legally
 * operative copy. Do not treat these strings as approved.
 */
export const REGISTRATION_CONSENTS = [
  {
    id: 'terms_and_privacy',
    version: '2026-08',
    required: true,
    label: 'I agree to the TMG180 Terms of Service and Privacy Policy.',
  },
  {
    id: 'platform_provider_disclosure',
    version: '2026-08',
    required: true,
    label:
      'I understand TMG180 is a platform provider under the NDIS Commission definition. TMG180 provides governance infrastructure — it does not deliver, coordinate, or supervise supports.',
  },
];

export const REQUIRED_CONSENT_IDS = REGISTRATION_CONSENTS.filter(
  (consent) => consent.required
).map((consent) => consent.id);

/** @returns {string[]} ids of required consents the caller did not agree to. */
export function missingConsents(given = {}) {
  return REQUIRED_CONSENT_IDS.filter((id) => given[id] !== true);
}

/** The acceptance record: what was agreed, at which version. */
export function consentRecord(given = {}) {
  return REGISTRATION_CONSENTS.filter((consent) => given[consent.id] === true).map((consent) => ({
    id: consent.id,
    version: consent.version,
  }));
}

/** Wording matches the Create New Password screen's stated requirements. */
export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (value) => value.length >= 8 },
  {
    id: 'numberOrSymbol',
    label: 'Contains a number or symbol',
    test: (value) => /[^A-Za-z]/.test(value),
  },
];

/** @returns {{ rules: Array<{id: string, label: string, passed: boolean}>, isValid: boolean }} */
export function checkPassword(value = '') {
  const rules = PASSWORD_RULES.map(({ id, label, test }) => ({
    id,
    label,
    passed: test(value),
  }));
  return { rules, isValid: rules.every((rule) => rule.passed) };
}

export const normaliseEmail = (value = '') => value.trim().toLowerCase();

export const isValidEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

/** Codes the client switches on. Human-readable text stays with the caller. */
export const AUTH_ERROR = {
  INVALID_CREDENTIALS: 'invalid_credentials',
  INVALID_EMAIL: 'invalid_email',
  EMAIL_TAKEN: 'email_taken',
  WEAK_PASSWORD: 'weak_password',
  PASSWORD_MISMATCH: 'password_mismatch',
  NO_WORKSPACE: 'no_workspace',
  ACCOUNT_SUSPENDED: 'account_suspended',
  INVALID_TOKEN: 'invalid_token',
  TOKEN_EXPIRED: 'token_expired',
};

/** The roles an account holds, in canonical portal order, unknowns dropped. */
export function sortRoles(roles = []) {
  return ALL_ROLES.filter((role) => roles.includes(role));
}

/**
 * Where a session lands after sign-in. Exactly one role goes straight in; more
 * than one returns null, meaning the account has to choose a workspace.
 */
export function landingRole(roles = []) {
  const held = sortRoles(roles);
  return held.length === 1 ? held[0] : null;
}

/**
 * Roles are server-issued: a workspace can only be entered by an account that
 * holds it. Never derive a role from anything the client can edit.
 */
export function canUseRole(roles = [], role) {
  return isRole(role) && roles.includes(role);
}
