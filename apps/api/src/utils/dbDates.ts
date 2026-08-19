/**
 * Prisma hands `@db.Date` back as a Date at UTC midnight and `@db.Time` as
 * 1970-01-01T<time>Z. Calendar days and clock times must never be rendered
 * through a timezone, so the wire carries plain strings ("YYYY-MM-DD",
 * "HH:MM") and these helpers are the only place the two shapes meet.
 *
 * dailyLog.controller.ts / snapshot.controller.ts carry their own copies from
 * before this file existed; new controllers import from here.
 */

export const toDay = (value: Date | null | undefined) =>
  value ? value.toISOString().slice(0, 10) : null;

export const toClock = (value: Date | null | undefined) =>
  value ? value.toISOString().slice(11, 16) : null;

export const fromDay = (value?: string | null) => (value ? new Date(`${value}T00:00:00Z`) : null);

export const fromClock = (value?: string | null) =>
  value ? new Date(`1970-01-01T${value}:00Z`) : null;

export const isDayString = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

/** The server's calendar day, for callers that did not say which day "today" is. */
export function serverToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}
