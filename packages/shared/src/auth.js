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
