/**
 * One error type for every auth backend, so screens switch on `code` and never
 * on which backend happens to be wired up.
 */
export class AuthError extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.details = details;
  }
}
