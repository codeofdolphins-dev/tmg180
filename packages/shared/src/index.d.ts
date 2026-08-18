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

// --- dailyLog.js ---

export type DailyLogStatus = 'draft' | 'submitted';

export declare const DAILY_LOG_STATUS: {
  readonly DRAFT: 'draft';
  readonly SUBMITTED: 'submitted';
};

export declare const DAILY_LOG_AUTHOR_ROLE: {
  readonly PARTICIPANT: 'participant';
  readonly WORKER: 'worker';
};

export declare const DAILY_LOG_LIMITS: {
  readonly minGoals: number;
  readonly maxGoals: number;
  readonly maxDomains: number;
  readonly maxText: number;
  readonly maxReason: number;
};

/** Taken from the built screens, not from canon — see the note in dailyLog.js. */
export declare const FUNCTIONAL_DOMAINS: readonly { key: string; label: string }[];
export declare const FUNCTIONAL_DOMAIN_KEYS: readonly string[];

export declare const USUAL_PATTERN_COMPARISONS: readonly { key: string; label: string }[];
export declare const COMPARISON_KEYS: readonly string[];

export interface DailyLogFields {
  sessionDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  goalIds?: number[];
  domainTags?: string[];
  impactText?: string | null;
  supportText?: string | null;
  outcomeText?: string | null;
  comparison?: string | null;
  additionalNotes?: string | null;
}

export declare function validateDailyLogFields(fields?: DailyLogFields): Record<string, string>;

export declare function canSubmitDailyLog(log?: DailyLogFields): {
  ok: boolean;
  errors: Record<string, string>;
};

export declare function isDailyLogLocked(log?: { status?: string }): boolean;

export declare function validateAddendum(addendum?: {
  text?: string | null;
  reason?: string | null;
}): Record<string, string>;

export declare function domainLabel(key: string): string;
export declare function comparisonLabel(key: string): string | null;

// --- snapshot.js ---

export type SnapshotStatus = 'generating' | 'draft' | 'locked';

export declare const SNAPSHOT_STATUS: {
  readonly GENERATING: 'generating';
  readonly DRAFT: 'draft';
  readonly LOCKED: 'locked';
};

/** Mandatory in every snapshot; identical to the column default. */
export declare const NONLINEAR_STATEMENT: string;

export interface SnapshotField {
  key: string;
  label: string;
  prompt: string;
}

export interface SnapshotLayer {
  key: string;
  label: string;
  description: string;
  fields: readonly SnapshotField[];
}

export declare const SNAPSHOT_LAYERS: readonly SnapshotLayer[];
export declare const SNAPSHOT_FIELD_KEYS: readonly string[];
export declare const SNAPSHOT_ADDENDUM_REASONS: readonly string[];

export declare const SNAPSHOT_LIMITS: {
  readonly maxText: number;
  readonly maxReason: number;
};

export declare function isMonthKey(value: unknown): boolean;
export declare function monthLabel(monthKey: string): string;
export declare function monthKeyOf(date?: Date): string;
export declare function previousMonthKey(monthKey: string): string;

export declare function validateSnapshotFields(
  fields?: Record<string, unknown>
): Record<string, string>;

export declare function canApproveSnapshot(snapshot?: {
  status?: string;
  nonlinearStatement?: string | null;
  sourceLogIds?: readonly number[];
}): { ok: boolean; errors: string[] };

export declare function isAddendumOnly(record?: { status?: string }): boolean;

export declare function validateSnapshotAddendum(addendum?: {
  text?: string | null;
  reason?: string | null;
}): Record<string, string>;

// --- privacy.js ---

export interface SharingPreference {
  key: string;
  label: string;
  description: string;
  default: boolean;
  pending?: boolean;
}

export declare const SHARING_PREFERENCES: readonly SharingPreference[];
export declare const PREFERENCE_KEYS: readonly string[];
export declare const DEFAULT_PREFERENCES: Record<string, boolean>;

export declare const CONSENT_STATUS: {
  readonly ACTIVE: 'active';
  readonly SUPERSEDED: 'superseded';
  readonly REVOKED: 'revoked';
};

export interface ConsentPermission {
  key: string;
  column: string;
  label: string;
  description: string;
}

export declare const CONSENT_PERMISSIONS: readonly ConsentPermission[];
export declare const CONSENT_PERMISSION_KEYS: readonly string[];

export declare const PRIVACY_AUDIT_ACTIONS: Record<string, { label: string; tone: string }>;
export declare const PRIVACY_AUDIT_ACTION_KEYS: readonly string[];

export declare function consentSummary(permissions?: Record<string, boolean>): string;
export declare function validatePreferences(preferences?: Record<string, unknown>): Record<string, string>;
export declare function validateConsentPermissions(permissions?: Record<string, unknown>): Record<string, string>;

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
