/**
 * Date and time formatting for record dates.
 *
 * A session date is a calendar day (`YYYY-MM-DD`), not an instant — parsing it
 * with `new Date('2026-08-18')` reads it as UTC midnight, which renders as the
 * day before for anyone west of Greenwich. Split the parts instead.
 */

/** `YYYY-MM-DD` -> Date at local midnight, or null. */
export function parseDay(value) {
  if (!value) return null;
  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

/** Date -> `YYYY-MM-DD` in the browser's own timezone, never UTC's. */
export function toDayValue(date) {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** "Monday, 18 Aug 2026" */
export function formatLogDate(value) {
  const date = parseDay(value);
  if (!date) return '';
  return date.toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** "18 Aug 2026" */
export function formatShortDate(value) {
  const date = parseDay(value);
  if (!date) return '';
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Timestamps are real instants — "18 Aug 2026, 1:15 pm". */
export function formatTimestamp(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Anything someone might type for a time -> the stored 24-hour "HH:MM".
 * Accepts "9", "9:05", "09.05", "0905", "9:05 pm", "9pm". Returns null when it
 * cannot be read as a time, which is how the time field decides whether to
 * offer what was typed.
 */
export function parseClock(raw) {
  if (!raw) return null;
  const cleaned = String(raw).trim().toLowerCase().replace(/\s+/g, '');
  const match = cleaned.match(/^(\d{1,2})(?:[:.]?(\d{2}))?(am|pm|a|p)?$/);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? 0);
  const meridiem = match[3]?.[0];

  if (Number.isNaN(hours) || Number.isNaN(minutes) || minutes > 59) return null;

  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    if (meridiem === 'a') hours = hours === 12 ? 0 : hours;
    else hours = hours === 12 ? 12 : hours + 12;
  } else if (hours > 23) {
    return null;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** "09:05" -> "9:05 am", the way the time is said rather than stored. */
export function formatClock(value) {
  if (!value) return '';
  const [hours, minutes] = String(value).split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return '';
  const meridiem = hours < 12 ? 'am' : 'pm';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${meridiem}`;
}

/** "21:05" -> { hour12: 9, minute: 5, meridiem: 'pm' }, or null. */
export function splitClock(value) {
  if (!value) return null;
  const [hours, minutes] = String(value).split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return {
    hour12: hours % 12 === 0 ? 12 : hours % 12,
    minute: minutes,
    meridiem: hours < 12 ? 'am' : 'pm',
  };
}

/** The inverse: the three columns of a time picker -> stored "HH:MM". */
export function joinClock({ hour12, minute, meridiem }) {
  const hours = meridiem === 'am' ? (hour12 === 12 ? 0 : hour12) : hour12 === 12 ? 12 : hour12 + 12;
  return `${String(hours).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/** "9:00 am – 1:00 pm", or one side of it, or nothing. */
export function formatTimeRange(start, end) {
  const from = formatClock(start);
  const to = formatClock(end);
  if (from && to) return `${from} – ${to}`;
  return from || to || '';
}

/** Today as the API's `YYYY-MM-DD`, in the browser's own timezone. */
export function todayValue() {
  return toDayValue(new Date());
}

/** "Yesterday" / "Today" / "Mon, 14 Oct" — for recent-activity rows. */
export function formatRelativeDay(value) {
  const date = parseDay(value);
  if (!date) return '';
  const today = parseDay(todayValue());
  const diffDays = Math.round((today - date) / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays === -1) return 'Tomorrow';
  return date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
}

const RELATIVE = new Intl.RelativeTimeFormat('en-AU', { numeric: 'auto' });
const RELATIVE_STEPS = [
  ['second', 60],
  ['minute', 60],
  ['hour', 24],
  ['day', 7],
  ['week', 4.345],
  ['month', 12],
];

/**
 * "just now" / "yesterday" / "2 weeks ago" — for a timestamp whose exact
 * moment matters less than how long ago it was ("Last viewed" on a snapshot).
 * Unlike formatRelativeDay this takes an instant, not a calendar day.
 */
export function formatRelativeTime(value) {
  if (!value) return '';
  const then = new Date(value);
  if (Number.isNaN(then.getTime())) return '';

  let amount = (then.getTime() - Date.now()) / 1000;
  for (const [unit, size] of RELATIVE_STEPS) {
    if (Math.abs(amount) < size) return RELATIVE.format(Math.round(amount), unit);
    amount /= size;
  }
  return RELATIVE.format(Math.round(amount), 'year');
}

/**
 * "July 2023" — for credential dates, where the day is noise. Accepts a
 * calendar day (`YYYY-MM-DD`) or a timestamp; both are read as dates.
 */
export function formatMonthYear(value) {
  if (!value) return '';
  const date = String(value).length <= 10 ? parseDay(value) : new Date(value);
  if (!date || Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
}
