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

export interface RegistrationConsent {
  id: string;
  version: string;
  required: boolean;
  label: string;
}

export declare const REGISTRATION_CONSENTS: readonly RegistrationConsent[];

export declare const REQUIRED_CONSENT_IDS: readonly string[];

/** Ids of required consents the caller did not agree to. */
export declare function missingConsents(given?: Record<string, boolean>): string[];

/** What was agreed, at which wording version — for the audit record. */
export declare function consentRecord(
  given?: Record<string, boolean>
): Array<{ id: string; version: string }>;

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

// --- profile.js ---

export type AnswerVisibility = 'participant_private' | 'share_with_consent' | 'snapshot_only';

export declare const ANSWER_VISIBILITY: {
  readonly PRIVATE: 'participant_private';
  readonly SHARE_WITH_CONSENT: 'share_with_consent';
  readonly SNAPSHOT_ONLY: 'snapshot_only';
};

export type ProfileSectionStatus = 'not_started' | 'in_progress' | 'complete';

export declare const PROFILE_SECTION_STATUS: {
  readonly NOT_STARTED: 'not_started';
  readonly IN_PROGRESS: 'in_progress';
  readonly COMPLETE: 'complete';
};

export type ProfileQuestionType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'multi'
  | 'toggle'
  | 'scale'
  | 'steps';

export interface ProfileQuestion {
  key: string;
  type: ProfileQuestionType;
  required?: boolean;
  options?: readonly string[];
  min?: number;
  max?: number;
}

export interface ProfileSection {
  key: string;
  order: number;
  title: string;
  questions: readonly ProfileQuestion[];
}

/** Any JSON-safe answer value; the question's type constrains the real shape. */
export type ProfileAnswerValue =
  | string
  | boolean
  | number
  | string[]
  | Array<{ text: string; done: boolean }>;

export declare const PROFILE_SECTIONS: readonly ProfileSection[];

export declare const PROFILE_TOTAL_SECTIONS: number;

export declare function profileSection(key: string): ProfileSection | undefined;

export declare function nextProfileSection(key: string): ProfileSection | null;

export declare function isEmptyAnswer(value: unknown): boolean;

export declare function validateAnswerValue(
  question: ProfileQuestion,
  value: unknown
): string | null;

export declare function validateSectionAnswers(
  section: ProfileSection,
  answers?: Record<string, unknown>
): Record<string, string>;

export declare function isSectionComplete(
  section: ProfileSection,
  answers?: Record<string, unknown>
): boolean;
