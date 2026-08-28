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

export type DailyLogAuthorRole = 'participant' | 'worker';

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
  readonly maxServiceType: number;
  readonly maxLocation: number;
};

/** Taken from the built screens, not from canon — see the note in dailyLog.js. */
export declare const FUNCTIONAL_DOMAINS: readonly { key: string; label: string }[];

export interface DashboardAction {
  key: string;
  label: string;
  description: string;
  route: string;
  priority: number;
  optional: boolean;
}
export declare const DASHBOARD_ACTIONS: readonly DashboardAction[];
export declare const DASHBOARD_ACTION_KEYS: readonly string[];
export declare const FUNCTIONAL_DOMAIN_KEYS: readonly string[];

export declare const USUAL_PATTERN_COMPARISONS: readonly { key: string; label: string }[];
export declare const COMPARISON_KEYS: readonly string[];
/** The worker layer's vocabulary for the same column. */
export declare const SUPPORT_LEVEL_COMPARISONS: readonly { key: string; label: string }[];
export declare const SUPPORT_LEVEL_COMPARISON_KEYS: readonly string[];
export declare function comparisonKeysFor(layer?: DailyLogAuthorRole): readonly string[];

export interface GoalLinkHelperEntry {
  code: string;
  domain: string;
  grouping: string;
  bucketDefault: string;
  examples: string;
  goalLinks: string;
  barrier: string;
  rationaleTags: readonly string[];
}
export declare const NDIS_BUCKETS: readonly { key: string; label: string }[];
export declare const NDIS_BUCKET_KEYS: readonly string[];
export declare function bucketLabel(key: string): string;
export declare const GOAL_LINK_HELPER: readonly GoalLinkHelperEntry[];
export declare const GOAL_LINK_HELPER_CODES: readonly string[];
export declare function goalLinkHelperEntry(code: string | null | undefined): GoalLinkHelperEntry | null;
export declare function goalLinkSuggestions(
  code: string | null | undefined
): { bucket: string; rationaleTags: readonly string[] } | null;
export declare const RN_RATIONALE_TAG_KEYS: readonly string[];
export declare const RN_RATIONALE_TAGS: readonly { key: string; label: string }[];
export declare function rnRationaleTagLabel(tag: string): string;

export interface DailyLogFields {
  sessionDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  goalIds?: number[];
  domainTags?: string[];
  /** Goal Link Helper pack: bucket required to submit; grouping and tags optional. */
  ndisBucket?: string | null;
  functionalGrouping?: string | null;
  rnRationaleTags?: string[];
  impactText?: string | null;
  supportText?: string | null;
  outcomeText?: string | null;
  comparison?: string | null;
  additionalNotes?: string | null;
  /** Worker layer only. */
  serviceType?: string | null;
  location?: string | null;
  participantVoice?: string | null;
  safetyNote?: string | null;
  privateNarrative?: string | null;
}

export interface DailyLogValidationOptions {
  layer?: DailyLogAuthorRole;
}

export declare function validateDailyLogFields(
  fields?: DailyLogFields,
  options?: DailyLogValidationOptions
): Record<string, string>;

export declare function canSubmitDailyLog(
  log?: DailyLogFields,
  options?: DailyLogValidationOptions
): {
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

// --- checkIn.js ---

export type CheckInPeriod = 'this_week' | 'today' | 'after_support';

export declare const CHECKIN_PERIODS: readonly { key: CheckInPeriod; label: string }[];
export declare const CHECKIN_PERIOD_KEYS: readonly string[];

export declare const CHECKIN_IMPACT_TAGS: readonly { key: string; label: string }[];
export declare const CHECKIN_IMPACT_TAG_KEYS: readonly string[];

export declare const CHECKIN_INTENSITY_SCALE: readonly { value: number; label: string }[];
export declare const CHECKIN_INTENSITY_MIN: number;
export declare const CHECKIN_INTENSITY_MAX: number;

export declare const CHECKIN_HELPED_TAGS: readonly { key: string; label: string }[];
export declare const CHECKIN_HELPED_TAG_KEYS: readonly string[];

export declare const CHECKIN_RECOVERY_LEVELS: readonly { key: string; label: string }[];
export declare const CHECKIN_RECOVERY_LEVEL_KEYS: readonly string[];

export declare const CHECKIN_GOAL_TAGS: readonly { key: string; label: string }[];
export declare const CHECKIN_GOAL_TAG_KEYS: readonly string[];

export declare const CHECKIN_OWN_WORDS_PROMPT: string;

export declare const CHECKIN_LIMITS: {
  readonly minImpactTags: number;
  readonly maxImpactTags: number;
  readonly maxNotes: number;
};

export interface CheckInFields {
  period?: string | null;
  checkinDate?: string | null;
  impactTags?: readonly string[];
  impactNotes?: string | null;
  intensityRating?: number | null;
  helpedTags?: readonly string[];
  helpedNotes?: string | null;
  recoveryLevel?: string | null;
  recoveryNotes?: string | null;
  ownWords?: string | null;
  goalsTags?: readonly string[];
  goalsNotes?: string | null;
}

export declare function validateCheckInFields(fields?: CheckInFields): Record<string, string>;

export declare function canSubmitCheckIn(checkIn?: CheckInFields): {
  ok: boolean;
  errors: Record<string, string>;
};

/** Saved check-ins are locked; `is_locked` defaults true, so does this. */
export declare function isCheckInLocked(checkIn?: { isLocked?: boolean }): boolean;

export declare function checkInPeriodLabel(key: string): string;
export declare function checkInImpactLabel(key: string): string;
export declare function checkInHelpedLabel(key: string): string;
export declare function checkInRecoveryLabel(key: string): string;
export declare function checkInGoalLabel(key: string): string;
export declare function checkInIntensityLabel(value?: number | null): string;

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
/** The layers' free-text fields only; `SNAPSHOT_FIELD_KEYS` also has the relational summaries. */
export declare const SNAPSHOT_LAYER_FIELD_KEYS: readonly string[];
export declare const SNAPSHOT_FIELD_KEYS: readonly string[];
export declare const SNAPSHOT_ADDENDUM_REASONS: readonly string[];

/** C3 — the participant's own "participation affected most in", not the six NDIS domains. */
export declare const SNAPSHOT_PARTICIPATION_AREAS: readonly { key: string; label: string }[];
export declare const SNAPSHOT_PARTICIPATION_AREA_KEYS: readonly string[];
/** C5 — outcome highlights. */
export declare const SNAPSHOT_OUTCOME_TAGS: readonly { key: string; label: string }[];
export declare const SNAPSHOT_OUTCOME_TAG_KEYS: readonly string[];
/** The array-valued wire fields, each mapped to the keys it accepts. */
export declare const SNAPSHOT_TAG_FIELDS: Record<string, readonly string[]>;
export declare const SNAPSHOT_TAG_FIELD_KEYS: readonly string[];
/** C9 — recorded with an export; the platform never sends anything itself. */
export declare const SNAPSHOT_SHARE_AUDIENCES: readonly { key: string; label: string }[];
export declare const SNAPSHOT_SHARE_AUDIENCE_KEYS: readonly string[];

export declare function participationAreaLabel(key: string): string;
export declare function outcomeTagLabel(key: string): string;
export declare function shareAudienceLabel(key: string): string;

// Monthly Relational Longitudinal Snapshot — the same record, checkbox-led.

export interface SnapshotRelationalSection {
  key: string;
  /** The section number in the template (3–9). */
  number: number;
  title: string;
  question: string;
  instruction?: string;
  /** Section 6 alone asks a single-choice question before its bank. */
  choiceField?: string;
  choiceLabel?: string;
  choiceOptions?: readonly { key: string; label: string }[];
  tagField: string;
  summaryField: string;
  summaryLabel: string;
  options: readonly { key: string; label: string }[];
  examples?: readonly string[];
  /** The template's own reason for the section existing. */
  note?: string;
}

export declare const SNAPSHOT_RELATIONAL_SECTIONS: readonly SnapshotRelationalSection[];
export declare const SNAPSHOT_RELATIONAL_SECTION_KEYS: readonly string[];
export declare const SNAPSHOT_RELATIONAL_TEXT_KEYS: readonly string[];

export declare const SNAPSHOT_PARTICIPANT_INVOLVEMENT: readonly { key: string; label: string }[];
export declare const SNAPSHOT_FLUCTUATION_LEVELS: readonly { key: string; label: string }[];
export declare const SNAPSHOT_APPROVAL_STATEMENTS: readonly { key: string; label: string }[];

/** Single-choice wire fields, each mapped to the keys it accepts. */
export declare const SNAPSHOT_CHOICE_FIELDS: Record<string, readonly string[]>;
export declare const SNAPSHOT_CHOICE_FIELD_KEYS: readonly string[];

export declare function participantInvolvementLabel(key: string): string;
export declare function fluctuationLevelLabel(key: string): string;
export declare function approvalStatementLabel(key: string): string;
export declare function relationalTagLabel(sectionKey: string, key: string): string;
export declare function relationalSection(key: string): SnapshotRelationalSection | null;

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
  sourceCheckInIds?: readonly number[];
}): { ok: boolean; errors: string[] };

export declare function isAddendumOnly(record?: { status?: string }): boolean;

export declare function validateSnapshotAddendum(addendum?: {
  text?: string | null;
  reason?: string | null;
}): Record<string, string>;

export type SnapshotAccessLevel = 'full_shared' | 'summary_only';

export declare const SNAPSHOT_ACCESS: {
  readonly FULL: 'full_shared';
  readonly SUMMARY: 'summary_only';
};

export declare const SNAPSHOT_ACCESS_LABELS: Record<SnapshotAccessLevel, string>;

/** null when the grant does not reach approved snapshots at all. */
export declare function snapshotAccessLevel(permissions?: {
  canViewSnapshot?: boolean;
  canViewProfile?: boolean;
}): SnapshotAccessLevel | null;

export declare function snapshotAccessLabel(level?: string | null): string;
export declare function showsNarrative(level?: string | null): boolean;

// --- snapshotShare.js ---

export type ShareLinkStatus = 'active' | 'revoked' | 'expired';

export declare const SHARE_LINK_STATUS: {
  readonly ACTIVE: 'active';
  readonly REVOKED: 'revoked';
  readonly EXPIRED: 'expired';
};

export declare const SHARE_LINK_STATUS_LABELS: Record<ShareLinkStatus, string>;
export declare const SHARE_LINK_EXPIRY_OPTIONS: readonly { days: number; label: string }[];
export declare const SHARE_LINK_EXPIRY_DAYS: readonly number[];
export declare const SHARE_LINK_DEFAULT_EXPIRY_DAYS: number;
export declare const SHARE_LINK_AUDIT_ACTIONS: Record<string, { label: string; tone: string }>;
export declare const SHARE_LINK_AUDIT_ACTION_KEYS: readonly string[];

export declare function shareLinkStatus(
  link?: { status?: string; expiresAt?: string | Date | null } | null,
  now?: Date
): ShareLinkStatus | null;
export declare function isShareLinkOpen(
  link?: { status?: string; expiresAt?: string | Date | null } | null,
  now?: Date
): boolean;
export declare function shareLinkStatusLabel(status?: string | null): string;

export declare function validateShareLinkFields(fields?: {
  expiresInDays?: number | string;
  audience?: string | null;
  allowDownload?: boolean;
}): Record<string, string>;

// --- concerns.js ---

export type ConcernKind = 'concern' | 'complaint' | 'feedback';
export type ConcernRelatesTo = 'platform' | 'service' | 'unsure';
export type ConcernStatus =
  | 'received'
  | 'acknowledged'
  | 'in_review'
  | 'responded'
  | 'referred'
  | 'closed';

export declare const CONCERN_KINDS: readonly { key: ConcernKind; label: string; description: string }[];
export declare const CONCERN_KIND_KEYS: readonly string[];
export declare const CONCERN_CATEGORIES: readonly { key: string; label: string }[];
export declare const CONCERN_CATEGORY_KEYS: readonly string[];
export declare const CONCERN_RELATES_TO: readonly {
  key: ConcernRelatesTo;
  label: string;
  description: string;
}[];
export declare const CONCERN_RELATES_TO_KEYS: readonly string[];

export declare const CONCERN_STATUS: {
  readonly RECEIVED: 'received';
  readonly ACKNOWLEDGED: 'acknowledged';
  readonly IN_REVIEW: 'in_review';
  readonly RESPONDED: 'responded';
  readonly REFERRED: 'referred';
  readonly CLOSED: 'closed';
};
export declare const CONCERN_STATUS_LABELS: Record<ConcernStatus, string>;
export declare const CONCERN_STATUS_KEYS: readonly string[];
export declare const CONCERN_OPEN_STATUSES: readonly string[];

export declare const CONCERN_EXTERNAL_BODIES: readonly string[];
export declare const CONCERN_HANDLING_STEPS: readonly string[];
export declare const CONCERN_PRINCIPLES: readonly string[];
export declare const CONCERN_NO_RETALIATION: readonly string[];
export declare const CONCERN_PLATFORM_LIMITS: readonly string[];

export declare const CONCERN_LIMITS: {
  readonly maxAbout: number;
  readonly maxText: number;
};

export interface ConcernFields {
  kind?: string | null;
  category?: string | null;
  relatesTo?: string | null;
  about?: string | null;
  description?: string | null;
  whatWouldHelp?: string | null;
}

export declare function validateConcernFields(fields?: ConcernFields): Record<string, string>;
export declare function canSubmitConcern(concern?: ConcernFields): {
  ok: boolean;
  errors: Record<string, string>;
};
export declare function validateConcernResponse(
  response?: { text?: string | null },
  concern?: { status?: string }
): Record<string, string>;
export declare function isConcernOpen(concern?: { status?: string } | null): boolean;

export declare function concernKindLabel(key: string): string;
export declare function concernCategoryLabel(key: string): string;
export declare function concernRelatesToLabel(key: string): string;
export declare function concernStatusLabel(key: string): string;

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
export declare const CONSENT_TYPE_WORKER_ACCESS: string;

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

// --- sessionPreferences.js ---

export interface SessionPreferenceGroup {
  key: string;
  label: string;
  subtitle?: string;
  options: readonly string[];
}

export declare const SESSION_PREFERENCE_GROUPS: readonly SessionPreferenceGroup[];
export declare const SESSION_PREFERENCE_GROUP_KEYS: readonly string[];
export declare const DEFAULT_SESSION_PREFERENCES: Record<string, string[]>;
export declare const SESSION_PREFERENCE_STATUS: {
  readonly DRAFT: 'draft';
  readonly SAVED: 'saved';
};
export declare function validateSessionSelections(
  selections?: Record<string, unknown>
): Record<string, string>;

// --- profile.js ---

export type AnswerVisibility = 'participant_private' | 'share_with_consent' | 'snapshot_only';

export declare const ANSWER_VISIBILITY: {
  readonly PRIVATE: 'participant_private';
  readonly SHARE_WITH_CONSENT: 'share_with_consent';
  readonly SNAPSHOT_ONLY: 'snapshot_only';
};

export type ProfileSectionStatus = 'not_started' | 'in_progress' | 'complete';
export declare const ANSWER_VISIBILITY_VALUES: readonly AnswerVisibility[];
export declare const VISIBILITY_OPTIONS: readonly {
  value: AnswerVisibility;
  label: string;
  note: string;
}[];
export declare function isAnswerVisibility(value: unknown): boolean;
export declare function visibilityLabel(value: string): string | null;
export declare function validateSectionVisibility(
  section: ProfileSection,
  visibility?: Record<string, string>
): Record<string, string>;

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
  | 'steps'
  | 'date'
  | 'rows';

export interface ProfileQuestionOption {
  value: string;
  label: string;
}

export interface ProfileQuestion {
  key: string;
  type: ProfileQuestionType;
  label: string;
  helper?: string;
  placeholder?: string;
  required?: boolean;
  options?: readonly ProfileQuestionOption[];
  columns?: readonly { key: string; label: string }[];
  addLabel?: string;
  min?: number;
  max?: number;
}

/** One titled block of the intake, with its participant-facing framing copy. */
export interface ProfileSectionGroup {
  title: string;
  intro?: readonly string[];
  questions: readonly ProfileQuestion[];
  outro?: readonly string[];
}

export interface ProfileSection {
  key: string;
  order: number;
  title: string;
  /** Seed plain-language description (hub card + page subtitle). */
  description: string;
  intro?: readonly string[];
  groups: readonly ProfileSectionGroup[];
  /** The closing step: lists every section with its status. */
  review?: boolean;
  /** Flat view of every group's questions — what validation reads. */
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
export declare const PROFILE_REVIEW_STEP: ProfileSection;
export declare const PROFILE_STEPS: readonly ProfileSection[];

export declare function profileSection(key: string): ProfileSection | undefined;

/** Canonical keys are snake_case (seed); URLs use kebab-case slugs. */
export declare function profileSectionSlug(key: string): string;

export declare function profileSectionBySlug(slug: string): ProfileSection | undefined;

export declare function nextProfileSection(key: string): ProfileSection | null;
export declare function previousProfileSection(key: string): ProfileSection | null;

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

// --- workerCredentials.js ---

export type CredentialStatus = 'up_to_date' | 'due_soon' | 'expired' | 'needs_review';

export interface WorkerCredentialType {
  key: string;
  label: string;
}

export declare const WORKER_CREDENTIAL_TYPES: readonly WorkerCredentialType[];

export declare const WORKER_CREDENTIAL_KEYS: readonly string[];

export declare const CREDENTIAL_STATUS: {
  readonly UP_TO_DATE: 'up_to_date';
  readonly DUE_SOON: 'due_soon';
  readonly EXPIRED: 'expired';
  readonly NEEDS_REVIEW: 'needs_review';
};

export declare const CREDENTIAL_DUE_SOON_DAYS: number;

export declare function credentialTypeLabel(key: string): string;

export declare function credentialStatusLabel(status: string): string;

export declare function daysUntil(expiresAt: string | null | undefined, today: string): number | null;

export declare function credentialStatus(
  credential: { expiresAt?: string | null },
  today: string
): { status: CredentialStatus; daysLeft: number | null };

export interface CredentialSummary {
  total: number;
  upToDate: number;
  dueSoon: number;
  expired: number;
  needsReview: number;
  next: { type: string; expiresAt: string; daysLeft: number } | null;
  allInOrder: boolean;
}

export declare function credentialSummary(
  credentials?: ReadonlyArray<{
    type: string;
    status: CredentialStatus;
    expiresAt?: string | null;
    daysLeft: number | null;
  }>
): CredentialSummary;

export interface CredentialFields {
  issuedAt?: string | null;
  expiresAt?: string | null;
  reference?: string | null;
}

export declare function validateCredentialFields(fields?: CredentialFields): Record<string, string>;

// ---------------------------------------------------------------------------
// Worker profile + directory (workerProfile.js)
// ---------------------------------------------------------------------------

export type WorkerProfilePromptKind = 'text' | 'list';

export interface WorkerProfilePrompt {
  key: string;
  label: string;
  helper: string;
  kind: WorkerProfilePromptKind;
  readLabel: string;
}

export declare const WORKER_PROFILE_PROMPTS: readonly WorkerProfilePrompt[];
export declare const WORKER_PROFILE_PROMPT_KEYS: readonly string[];
export declare const WORKER_PROFILE_TEXT_KEYS: readonly string[];
export declare const WORKER_PROFILE_LIST_KEYS: readonly string[];

export declare const SUPPORT_AREAS: readonly { key: string; label: string }[];
export declare const SUPPORT_AREA_KEYS: readonly string[];
export declare function supportAreaLabel(key: string): string;

export declare const RELATIONAL_TAGS: readonly string[];

export interface AvailabilityDay {
  key: string;
  label: string;
  short: string;
  weekend: boolean;
}
export declare const AVAILABILITY_DAYS: readonly AvailabilityDay[];
export declare const AVAILABILITY_PERIODS: readonly { key: string; label: string }[];
export declare const AVAILABILITY_SLOTS: readonly string[];

export type WorkerProfileStatus = 'draft' | 'published';
export declare const WORKER_PROFILE_STATUS: { readonly DRAFT: 'draft'; readonly PUBLISHED: 'published' };

export declare const WORKER_PROFILE_LIMITS: {
  maxDisplayName: number;
  maxText: number;
  maxPhilosophy: number;
  maxListItems: number;
  maxListItem: number;
  maxLocation: number;
  maxLanguages: number;
  maxLanguage: number;
  maxExperienceYears: number;
  maxContact: number;
};

export declare const CONTACT_NOTICE: string;

export declare function experienceLabel(years: number | null | undefined): string | null;

/** Flat wire shape shared by PATCH /worker/profile and the readiness check. */
export interface WorkerProfileFields {
  displayName?: string | null;
  relational_intro?: string | null;
  natural_support_style?: string | null;
  communication_style?: string[] | null;
  preferred_environments?: string | null;
  interests?: string[] | null;
  participants_appreciate?: string[] | null;
  boundaries_and_fit?: string | null;
  supportPhilosophy?: string | null;
  valuesTags?: string[] | null;
  supportAreas?: string[] | null;
  availability?: string[] | null;
  locationArea?: string | null;
  languages?: string[] | null;
  experienceYears?: number | null;
  contactPreference?: string | null;
  optIn?: boolean;
}

export declare function validateWorkerProfileFields(fields?: WorkerProfileFields): Record<string, string>;

export interface WorkerProfileReadinessStep {
  key: string;
  label: string;
  done: boolean;
  required: boolean;
}

export interface WorkerProfileReadiness {
  steps: WorkerProfileReadinessStep[];
  completed: number;
  total: number;
  onboardingComplete: boolean;
  canPublish: boolean;
  missing: string[];
}

export declare function workerProfileReadiness(profile?: WorkerProfileFields): WorkerProfileReadiness;

// --- workerGovernance.js ---

export type GovernanceGroupKey = 'acknowledgement' | 'document' | 'readiness';
export type GovernanceCadence = 'once' | 'annual' | 'on_update';
export type GovernanceItemStatusKey = 'confirmed' | 'needs_review' | 'not_started';

export interface GovernanceGroup {
  key: GovernanceGroupKey;
  label: string;
  blurb: string;
}

export interface GovernanceItemDefinition {
  key: string;
  group: GovernanceGroupKey;
  title: string;
  summary: string;
  cadence: GovernanceCadence;
  currentVersion: string;
  confirmation: string;
  overview: string;
  points: readonly string[];
  resourceSlug: string | null;
}

export declare const GOVERNANCE_GROUPS: readonly GovernanceGroup[];
export declare const GOVERNANCE_GROUP_KEYS: readonly GovernanceGroupKey[];
export declare const GOVERNANCE_CADENCE: {
  readonly ONCE: 'once';
  readonly ANNUAL: 'annual';
  readonly ON_UPDATE: 'on_update';
};
export declare const GOVERNANCE_ITEMS: readonly GovernanceItemDefinition[];
export declare const GOVERNANCE_ITEM_KEYS: readonly string[];
export declare const GOVERNANCE_ITEM_STATUS: {
  readonly CONFIRMED: 'confirmed';
  readonly NEEDS_REVIEW: 'needs_review';
  readonly NOT_STARTED: 'not_started';
};
export declare const GOVERNANCE_NOTE_LIMIT: number;

export declare function governanceItem(key: string): GovernanceItemDefinition | null;
export declare function governanceGroup(key: string): GovernanceGroup | null;
export declare function governanceItemStatusLabel(status: string): string;

export interface GovernanceAcknowledgementRow {
  version: string;
  acknowledgedAt: string | Date | null;
}

export declare function governanceItemStatus(
  item: GovernanceItemDefinition,
  acknowledgements?: ReadonlyArray<GovernanceAcknowledgementRow>
): {
  status: GovernanceItemStatusKey;
  acknowledgedAt: string | Date | null;
  acknowledgedVersion: string | null;
};

export interface GovernanceStanding {
  items: { total: number; confirmed: number; needsReview: number; notStarted: number };
  awaitingReview: number;
  readiness: { inOrder: number; total: number };
  allInOrder: boolean;
  nextRenewal: { type: string; expiresAt: string; daysLeft: number } | null;
}

export declare function governanceStanding(
  items?: ReadonlyArray<{ status: GovernanceItemStatusKey }>,
  credentials?: { total?: number; upToDate?: number; next?: CredentialSummary['next'] }
): GovernanceStanding;

export declare function validateGovernanceNote(note?: unknown): Record<string, string>;

// --- workerLearning.js ---

export type LearningLibrary = 'core' | 'optional';
export type LearningResourceStatus = 'published' | 'awaiting_content';
export type LearningResourceKind =
  | 'manual'
  | 'quick_guide'
  | 'explainer'
  | 'framework'
  | 'how_to'
  | 'template';

export interface LearningModule {
  key: string;
  title: string;
  blurb: string;
}

export interface LearningResourceBody {
  overview: readonly string[];
  steps: ReadonlyArray<{ title: string; detail: string }>;
  example: { title: string; lines: readonly string[] } | null;
  notes: readonly string[];
}

export interface LearningResourceDefinition {
  slug: string;
  moduleKey: string;
  kind: LearningResourceKind;
  library: LearningLibrary;
  status: LearningResourceStatus;
  title: string;
  summary: string;
  readMinutes: number | null;
  updatedAt: string | null;
  body: LearningResourceBody | null;
  download: string | null;
  action: { target: string; label: string } | null;
}

export declare const LEARNING_LIBRARIES: { readonly CORE: 'core'; readonly OPTIONAL: 'optional' };
export declare const LEARNING_LIBRARY_TABS: ReadonlyArray<{ key: LearningLibrary; label: string }>;
export declare const LEARNING_RESOURCE_STATUS: {
  readonly PUBLISHED: 'published';
  readonly AWAITING_CONTENT: 'awaiting_content';
};
export declare const LEARNING_RESOURCE_KINDS: ReadonlyArray<{ key: LearningResourceKind; label: string }>;
export declare const LEARNING_RESOURCE_KIND_KEYS: readonly LearningResourceKind[];
export declare const LEARNING_MODULES: readonly LearningModule[];
export declare const LEARNING_MODULE_KEYS: readonly string[];
export declare const LEARNING_RESOURCES: readonly LearningResourceDefinition[];
export declare const LEARNING_RESOURCE_SLUGS: readonly string[];

export declare function learningKindLabel(key: string): string;
export declare function learningResource(slug: string): LearningResourceDefinition | null;
export declare function learningModule(key: string): LearningModule | null;
export declare function resourcesInModule(moduleKey: string): LearningResourceDefinition[];
export declare function resourcesInLibrary(library: string): LearningResourceDefinition[];
export declare function relatedResources(slug: string, limit?: number): LearningResourceDefinition[];

export declare function learningSummary(
  resources?: ReadonlyArray<{
    status: LearningResourceStatus;
    progress?: { completedAt?: unknown; savedAt?: unknown } | null;
  }>
): { total: number; published: number; awaitingContent: number; completed: number; saved: number };

export declare function validateLearningProgress(fields?: {
  saved?: unknown;
  completed?: unknown;
}): Record<string, string>;

// --- participantLibrary.js ---

export interface ParticipantReadingBlock {
  kind: 'h2' | 'p' | 'list';
  text?: string;
  items?: readonly string[];
}

export interface ParticipantReading {
  slug: string;
  library: string;
  topic: string;
  status: 'published' | 'awaiting_content';
  title: string;
  subtitle?: string;
  source: string;
  summary: string;
  body: readonly ParticipantReadingBlock[] | null;
  /** Published from a governance working draft; said on the reading. */
  draft?: boolean;
}

export declare const PARTICIPANT_LIBRARIES: { readonly CORE: 'core'; readonly OPTIONAL: 'optional' };
export declare const PARTICIPANT_LIBRARY_TABS: readonly { key: string; label: string }[];
export declare const PARTICIPANT_LIBRARY_TOPICS: readonly { key: string; label: string }[];
export declare const PARTICIPANT_LIBRARY_TOPIC_KEYS: readonly string[];
export declare const PARTICIPANT_READING_STATUS: {
  readonly PUBLISHED: 'published';
  readonly AWAITING_CONTENT: 'awaiting_content';
};
export declare const PARTICIPANT_READINGS: readonly ParticipantReading[];
export declare const PARTICIPANT_READING_SLUGS: readonly string[];
export declare const PARTICIPANT_READING_AWAITING_NOTE: string;
export declare const PARTICIPANT_READING_DRAFT_NOTE: string;
export declare function participantReading(slug: string): ParticipantReading | null;
export declare function participantReadingsIn(library: string): ParticipantReading[];
export declare function participantReadingSection(slug: string, heading: string): ParticipantReadingBlock[];
export declare function participantReadingsByTopic(
  library: string
): { topic: { key: string; label: string }; readings: ParticipantReading[] }[];
export declare function participantLibraryTopic(key: string): { key: string; label: string } | null;
