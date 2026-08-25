import DatePicker from 'react-datepicker';
import { CalendarDays } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import { parseDay, toDayValue } from '../../lib/dates';

/**
 * A calendar date field. The browser's native date input renders differently on
 * every platform (and shows US ordering on Windows), so records that people
 * read back — a session date on an evidence log — get a real picker instead.
 *
 * The value on the outside is always the API's `YYYY-MM-DD`; the Date object
 * the picker wants never leaves this component. Dates display AU-style.
 *
 * The header carries month and year dropdowns, not just the month arrows: the
 * fields that use this are not all "some day near today" — a credential expires
 * years out and was issued years back, and paging a year at a time through
 * twelve clicks is the wrong tool for that. The dropdowns bound how far the
 * calendar reaches, which also stops a mistyped year landing in the record.
 */

const YEARS_BACK = 40;
const YEARS_FORWARD = 20;

/** A Date at the start of `offset` years from now — the year dropdown's edges. */
function yearEdge(offset) {
  const now = new Date();
  return new Date(now.getFullYear() + offset, offset < 0 ? 0 : 11, offset < 0 ? 1 : 31);
}

export default function DateField({
  id,
  value,
  onChange,
  onBlur,
  disabled = false,
  ariaLabel,
  look = 'pill',
  minDate,
  maxDate,
  placeholder = 'dd/mm/yyyy',
}) {
  const field =
    look === 'box'
      ? 'bg-white border border-slate-300 rounded-full'
      : 'bg-white rounded-full';

  // The year dropdown lists exactly the years between the picker's bounds, so
  // the bounds are what makes it usable. Callers that care (a session date can
  // never be in the future) pass their own; everyone else gets the window.
  const from = minDate ?? yearEdge(-YEARS_BACK);
  const to = maxDate ?? yearEdge(YEARS_FORWARD);

  return (
    <div className="relative">
      <DatePicker
        id={id}
        selected={parseDay(value)}
        onChange={(date) => onChange(toDayValue(date))}
        onBlur={onBlur}
        disabled={disabled}
        minDate={from}
        maxDate={to}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        ariaLabelledBy={undefined}
        aria-label={ariaLabel}
        showPopperArrow={false}
        popperPlacement="bottom-start"
        className={`tmg-date-input w-full h-12.5 ${field} pl-4 pr-11 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:ring-2 focus:ring-brand-600/40 disabled:opacity-60`}
        calendarClassName="tmg-calendar"
        wrapperClassName="w-full"
      />
      <CalendarDays
        size={17}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
      />
    </div>
  );
}
