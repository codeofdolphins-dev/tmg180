import type { Request } from 'express';

/**
 * What a request tells us about the device behind it. Used for the audit log
 * and for labelling refresh-token rows, so a person can recognise their own
 * sessions — never for any authorisation decision.
 */

/** tmg_audit_log.ip_address and tmg_refresh_tokens.ip_address are INET, so only store something that parses. */
export const asInet = (value?: string) =>
  value && /^[0-9a-fA-F.:]+$/.test(value) ? value.replace(/^::ffff:/, '') : null;

/** VarChar(255) in the schema — a long or absent user agent must not throw. */
export const asUserAgent = (req: Request) => req.get('user-agent')?.slice(0, 255) ?? null;
