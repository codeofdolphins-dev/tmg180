/**
 * Mock auth backend — accounts live in localStorage until the real API and its
 * user tables exist.
 *
 * It deliberately mirrors the shape the API will return (`{ user, roles,
 * accessToken, refreshToken }`) and throws the same error codes, so switching
 * to the server is a one-line change in ./index.js and no screen has to move.
 *
 * NOT a security boundary. Anyone can edit localStorage; roles are only truly
 * enforced once the API issues them inside a signed token.
 */
import {
  ACCOUNT_STATUS,
  AUTH_ERROR,
  ROLES,
  checkPassword,
  isValidEmail,
  normaliseEmail,
  sortRoles,
} from '@tmg180/shared';
import { AuthError } from './AuthError.js';

const STORAGE_KEY = 'tmg180-mock-accounts';
const LATENCY_MS = 350;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // an hour; the real link is emailed

/**
 * Sign-in credentials for local work. Alex matches the participant dashboard's
 * "Welcome back, Alex."; `both@` exists to exercise the workspace picker.
 */
const SEED_ACCOUNTS = [
  {
    name: 'Alex Nguyen',
    email: 'alex@tmg180.test',
    password: 'Participant1',
    roles: [ROLES.PARTICIPANT],
  },
  { name: 'Sam Patel', email: 'sam@tmg180.test', password: 'Worker1234', roles: [ROLES.WORKER] },
  { name: 'Riley Chen', email: 'admin@tmg180.test', password: 'Admin12345', roles: [ROLES.ADMIN] },
  {
    name: 'Jordan Lee',
    email: 'both@tmg180.test',
    password: 'Both12345',
    roles: [ROLES.PARTICIPANT, ROLES.WORKER],
  },
];

const wait = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Not a security control — the real API bcrypts. This only keeps plaintext
 * passwords out of localStorage, where a shared screen would leak them.
 */
function digest(value) {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) | 0;
  }
  return `mock$${(hash >>> 0).toString(36)}`;
}

const newId = () => `usr_${Math.random().toString(36).slice(2, 10)}`;

function seedDb() {
  return {
    accounts: SEED_ACCOUNTS.map((account) => ({
      id: newId(),
      name: account.name,
      email: normaliseEmail(account.email),
      passwordDigest: digest(account.password),
      roles: account.roles,
      status: ACCOUNT_STATUS.ACTIVE,
      createdAt: new Date().toISOString(),
    })),
    resets: [],
  };
}

function readDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupt or unavailable storage — fall through and reseed
  }
  const fresh = seedDb();
  writeDb(fresh);
  return fresh;
}

function writeDb(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // private-mode or quota — the session still works for this tab
  }
}

const findAccount = (db, email) =>
  db.accounts.find((account) => account.email === normaliseEmail(email));

const toPublicUser = (account) => ({
  id: account.id,
  name: account.name,
  email: account.email,
});

function toSession(account) {
  return {
    user: toPublicUser(account),
    roles: sortRoles(account.roles),
    accessToken: `mock-access-${account.id}`,
    refreshToken: `mock-refresh-${account.id}`,
  };
}

function assertUsableAccount(account) {
  if (account.status === ACCOUNT_STATUS.SUSPENDED) {
    throw new AuthError(
      AUTH_ERROR.ACCOUNT_SUSPENDED,
      'This account is suspended. Contact TMG180 support.'
    );
  }
  if (sortRoles(account.roles).length === 0) {
    throw new AuthError(
      AUTH_ERROR.NO_WORKSPACE,
      "This account doesn't have a workspace yet. Contact TMG180 support."
    );
  }
}

export const mockAuthBackend = {
  async signIn({ email, password }) {
    await wait();
    const db = readDb();
    const account = findAccount(db, email);

    // One message for a missing account and a wrong password — never confirm
    // which email addresses exist.
    if (!account || account.passwordDigest !== digest(password ?? '')) {
      throw new AuthError(AUTH_ERROR.INVALID_CREDENTIALS, 'Email or password is incorrect.');
    }
    assertUsableAccount(account);

    return toSession(account);
  },

  async signUp({ name, email, password, role }) {
    await wait();
    if (!isValidEmail(email)) {
      throw new AuthError(AUTH_ERROR.INVALID_EMAIL, 'Enter a valid email address.');
    }
    if (!checkPassword(password ?? '').isValid) {
      throw new AuthError(AUTH_ERROR.WEAK_PASSWORD, 'Password does not meet the requirements.');
    }

    const db = readDb();
    if (findAccount(db, email)) {
      throw new AuthError(AUTH_ERROR.EMAIL_TAKEN, 'An account with this email already exists.');
    }

    const account = {
      id: newId(),
      name: name?.trim() || 'TMG180 User',
      email: normaliseEmail(email),
      passwordDigest: digest(password),
      roles: sortRoles([role]),
      status: ACCOUNT_STATUS.ACTIVE,
      createdAt: new Date().toISOString(),
    };
    assertUsableAccount(account);

    db.accounts.push(account);
    writeDb(db);
    return toSession(account);
  },

  /**
   * The real API emails a link and always returns 204 so the response can't be
   * used to enumerate accounts. The mock returns the token as well, because
   * there is no inbox to open in local development.
   */
  async requestPasswordReset({ email }) {
    await wait();
    const db = readDb();
    const account = findAccount(db, email);
    if (!account) return { sent: true, token: null };

    const token = `reset_${Math.random().toString(36).slice(2, 12)}`;
    db.resets = [
      ...db.resets.filter((reset) => reset.email !== account.email),
      { email: account.email, token, expiresAt: Date.now() + RESET_TOKEN_TTL_MS, usedAt: null },
    ];
    writeDb(db);
    return { sent: true, token };
  },

  async resetPassword({ token, password }) {
    await wait();
    if (!checkPassword(password ?? '').isValid) {
      throw new AuthError(AUTH_ERROR.WEAK_PASSWORD, 'Password does not meet the requirements.');
    }

    const db = readDb();
    const reset = db.resets.find((entry) => entry.token === token);
    if (!reset || reset.usedAt) {
      throw new AuthError(AUTH_ERROR.INVALID_TOKEN, 'This reset link is no longer valid.');
    }
    if (reset.expiresAt < Date.now()) {
      throw new AuthError(AUTH_ERROR.TOKEN_EXPIRED, 'This reset link has expired.');
    }

    const account = findAccount(db, reset.email);
    if (!account) {
      throw new AuthError(AUTH_ERROR.INVALID_TOKEN, 'This reset link is no longer valid.');
    }

    account.passwordDigest = digest(password);
    reset.usedAt = Date.now();
    writeDb(db);
    return { reset: true };
  },

  async me({ accessToken } = {}) {
    await wait(120);
    const db = readDb();
    const account = db.accounts.find((entry) => `mock-access-${entry.id}` === accessToken);
    if (!account) throw new AuthError(AUTH_ERROR.INVALID_TOKEN, 'Session is no longer valid.');
    return { user: toPublicUser(account), roles: sortRoles(account.roles) };
  },

  async signOut() {
    // Nothing server-side to revoke while accounts are local.
  },

  /** Dev affordance: the credentials the sign-in screen offers as hints. */
  listDemoAccounts: () =>
    SEED_ACCOUNTS.map(({ email, password, roles }) => ({ email, password, roles })),
};
