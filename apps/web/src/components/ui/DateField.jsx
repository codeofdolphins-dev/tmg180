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
 */
export default function DateField({
  id,
  value,
  onChange,
  onBlur,
  disabled = false,
  ariaLabel,
  look = 'pill',
  maxDate,
  placeholder = 'dd/mm/yyyy',
}) {
  const field =
    look === 'box'
      ? 'bg-white border border-slate-300 rounded-full'
      : 'bg-white rounded-full';

  return (
    <div className="relative">
      <DatePicker
        id={id}
        selected={parseDay(value)}
        onChange={(date) => onChange(toDayValue(date))}
        onBlur={onBlur}
        disabled={disabled}
        maxDate={maxDate}
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
