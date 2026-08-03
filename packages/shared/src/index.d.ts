/**
 * Type surface for @tmg180/shared. The implementation stays plain JS so the
 * web app keeps consuming it without a build step; the API is TypeScript and
 * needs these declarations to import the same single source of truth.
 */

// --- roles.js ---

export type Role = 'participant' | 'worker' | 'admin';

export declare const ROLES: {
  readonly PARTICIPANT: 'participant';
  readonly WORKER: 'worker';
  readonly ADMIN: 'admin';
};

export declare const ALL_ROLES: readonly Role[];

export declare function isRole(value: unknown): value is Role;

// --- auth.js ---

export type AccountStatus = 'invited' | 'active' | 'suspended';

export declare const ACCOUNT_STATUS: {
  readonly INVITED: 'invited';
  readonly ACTIVE: 'active';
  readonly SUSPENDED: 'suspended';
};

export declare const SELF_SIGNUP_ROLES: readonly Role[];

export interface PasswordRule {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

export interface PasswordRuleResult {
  id: string;
  label: string;
  passed: boolean;
}

export declare const PASSWORD_RULES: readonly PasswordRule[];

export declare function checkPassword(value?: string): {
  rules: PasswordRuleResult[];
  isValid: boolean;
};

export declare function normaliseEmail(value?: string): string;

export declare function isValidEmail(value?: string): boolean;

export declare const AUTH_ERROR: {
  readonly INVALID_CREDENTIALS: 'invalid_credentials';
  readonly INVALID_EMAIL: 'invalid_email';
  readonly EMAIL_TAKEN: 'email_taken';
  readonly WEAK_PASSWORD: 'weak_password';
  readonly PASSWORD_MISMATCH: 'password_mismatch';
  readonly NO_WORKSPACE: 'no_workspace';
  readonly ACCOUNT_SUSPENDED: 'account_suspended';
  readonly INVALID_TOKEN: 'invalid_token';
  readonly TOKEN_EXPIRED: 'token_expired';
};

export declare function sortRoles(roles?: readonly string[]): Role[];

export declare function landingRole(roles?: readonly string[]): Role | null;

export declare function canUseRole(roles: readonly string[] | undefined, role: unknown): boolean;

// --- evidence.js ---

export declare const DAILY_LOG_STATUS: {
  readonly DRAFT: 'draft';
  readonly FINALISED: 'finalised';
};

export declare const SNAPSHOT_STATUS: {
  readonly GENERATING: 'generating';
  readonly AWAITING_APPROVAL: 'awaiting_approval';
  readonly LOCKED: 'locked';
};

/**
 * Null until the API serves the allowed set — the NDIS domain codes are not
 * enumerated anywhere in the document set.
 */
export declare const FUNCTIONAL_DOMAINS: string[] | null;

export declare function canFinaliseDailyLog(log: {
  goalIds?: readonly string[];
  domainTags?: readonly string[];
}): { ok: boolean; errors: string[] };

export declare function isAddendumOnly(record: { status?: string }): boolean;
