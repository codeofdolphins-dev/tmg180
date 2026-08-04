/**
 * Env is read once, validated once, and fails loudly at boot rather than
 * surfacing as a confusing 500 on the first request.
 */

function required(name: string, options: { allowDevDefault?: string } = {}): string {
  const value = process.env[name];
  if (value) return value;

  if (options.allowDevDefault && process.env.NODE_ENV !== 'production') {
    return options.allowDevDefault;
  }
  throw new Error(`Missing required environment variable: ${name}`);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT ?? 4000),

  databaseUrl: required('DATABASE_URL', {
    allowDevDefault: 'postgresql://postgres:postgres@localhost:5432/tmg180?schema=public',
  }),

  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET', { allowDevDefault: 'dev-access-secret' }),
    accessTtl: process.env.ACCESS_TOKEN_TTL ?? '15m',
  },

  /** Where password-reset links point — the web app, not the API. */
  appUrl: process.env.APP_URL ?? 'http://localhost:5173',

  /** Password-reset link lifetime. Short by design. */
  passwordResetTtlMinutes: Number(process.env.PASSWORD_RESET_TTL_MINUTES ?? 60),

  /**
   * SMTP is not configured yet. Until it is, reset links are written to the
   * server log in development so the flow is testable; in production a missing
   * transport is a hard failure rather than a silently dropped email.
   */
  smtpUrl: process.env.SMTP_URL ?? null,

  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};
