import { env } from '../config/env.js';

/**
 * Outbound email.
 *
 * There is no transport configured yet — SMTP_URL is unset and no provider has
 * been chosen. Rather than pretend a message was sent, development writes the
 * link to the server log so the reset flow is fully testable, and production
 * throws: an unsent password-reset email must be a visible failure, not a
 * participant locked out with no explanation.
 *
 * Wiring a provider means implementing `deliver` and nothing else.
 */

type Message = { to: string; subject: string; text: string };

async function deliver(message: Message) {
  if (!env.smtpUrl) {
    if (env.isProduction) {
      throw new Error('No mail transport configured (SMTP_URL). Cannot send email.');
    }
    console.info(
      `\n[mail:dev] to: ${message.to}\n[mail:dev] subject: ${message.subject}\n${message.text}\n`
    );
    return;
  }

  // TODO: send via SMTP_URL once a provider is chosen.
  throw new Error('SMTP_URL is set but no transport is implemented yet.');
}

export function passwordResetLink(token: string) {
  return `${env.appUrl}/create-new-password?token=${encodeURIComponent(token)}`;
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const link = passwordResetLink(token);
  await deliver({
    to,
    subject: 'Reset your TMG180 password',
    text: [
      'You asked to reset your TMG180 password.',
      '',
      link,
      '',
      `This link works once and expires in ${env.passwordResetTtlMinutes} minutes.`,
      "If you didn't ask for this, you can ignore this email — nothing has changed.",
    ].join('\n'),
  });
}
