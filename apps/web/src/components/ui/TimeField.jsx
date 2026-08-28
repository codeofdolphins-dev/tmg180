import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';
import { formatClock, joinClock, parseClock, splitClock } from '../../lib/dates';

/**
 * A time field: type it, or pick it from hour / minute / am-pm columns.
 *
 * Not a list of preset times — support does not run to the quarter hour, and a
 * 96-item dropdown makes finding 9:05 harder than typing it. The columns are
 * built here rather than pulled from a library because every React time picker
 * on npm either ships its own design system or is unmaintained; this one is
 * three scrollable lists and reads as part of the portal.
 *
 * The value crossing the boundary is the API's 24-hour "HH:MM". Typed text is
 * forgiving — "9:05", "0905", "9pm", "9.05 am" all land on the same value —
 * and is committed on blur, so half-typed input is never stored.
 */

const HOURS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTES = Array.from({ length: 60 }, (_, index) => index);
const MERIDIEMS = ['am', 'pm'];

/** What a column click builds on when nothing has been chosen yet. */
const BLANK = { hour12: 12, minute: 0, meridiem: 'am' };

function Column({ label, children }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col">
      <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400 text-center">
        {label}
      </div>
      <div className="tmg-time-column h-44 overflow-y-auto px-1 flex flex-col gap-0.5">
        {children}
      </div>
    </div>
  );
}

function Cell({ selected, onClick, innerRef, children }) {
  return (
    <button
      type="button"
      ref={innerRef}
      aria-pressed={selected}
      onClick={onClick}
      className={`shrink-0 rounded-full py-1.5 text-sm text-center transition-colors ${
        selected
          ? 'bg-brand-600 text-white font-semibold'
          : 'text-[#0b1c30] hover:bg-brand-50'
      }`}
    >
      {children}
    </button>
  );
}

export default function TimeField({
  id,
  value,
  onChange,
  onBlur,
  disabled = false,
  ariaLabel,
  look = 'pill',
  placeholder = '--:--',
}) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState(null);
  const wrapper = useRef(null);
  const selectedHour = useRef(null);
  const selectedMinute = useRef(null);

  const parts = splitClock(value) ?? BLANK;
  const hasValue = Boolean(value);

  // Clicking away or pressing Escape closes the picker; the value is already
  // committed by then, so there is nothing to cancel.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!wrapper.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // Open onto the current time rather than onto midnight. Scrolling the column
  // directly (not scrollIntoView) keeps the page itself still.
  useLayoutEffect(() => {
    if (!open) return;
    for (const ref of [selectedHour, selectedMinute]) {
      const cell = ref.current;
      const column = cell?.parentElement;
      if (!cell || !column) continue;
      column.scrollTop = cell.offsetTop - column.clientHeight / 2 + cell.clientHeight / 2;
    }
  }, [open]);

  const set = (patch) => onChange(joinClock({ ...parts, ...patch }));

  const field =
    look === 'box' ? 'bg-white border border-slate-300 rounded-full' : 'bg-white rounded-full';

  const commitTyped = () => {
    if (typed === null) return;
    const parsed = parseClock(typed);
    // Empty clears the field; anything unreadable reverts to what was stored.
    if (typed.trim() === '') onChange('');
    else if (parsed) onChange(parsed);
    setTyped(null);
  };

  return (
    <div className="relative" ref={wrapper}>
      <input
        id={id}
        type="text"
        aria-label={ariaLabel}
        disabled={disabled}
        placeholder={placeholder}
        value={typed ?? (hasValue ? formatClock(value) : '')}
        onChange={(event) => setTyped(event.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={(event) => {
          commitTyped();
          // Keep the picker open while the click lands on a column.
          if (!wrapper.current?.contains(event.relatedTarget)) onBlur?.(event);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commitTyped();
            setOpen(false);
          }
        }}
        className={`w-full h-12.5 ${field} pl-4 pr-11 text-base text-[#0b1c30] placeholder:text-[#6b7280] outline-none focus:ring-2 focus:ring-brand-600/40 disabled:opacity-60`}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-expanded={open}
        aria-label={`Choose ${ariaLabel ?? 'time'}`}
        disabled={disabled}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-[#0b1c30]"
      >
        <Clock size={17} />
      </button>

      {open && !disabled && (
        <div
          role="dialog"
          aria-label={`Choose ${ariaLabel ?? 'time'}`}
          className="absolute left-0 top-14.5 z-30 w-60 bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-3"
        >
          <div className="flex gap-1">
            <Column label="HH">
              {HOURS.map((hour) => (
                <Cell
                  key={hour}
                  selected={hasValue && parts.hour12 === hour}
                  innerRef={parts.hour12 === hour ? selectedHour : undefined}
                  onClick={() => set({ hour12: hour })}
                >
                  {String(hour).padStart(2, '0')}
                </Cell>
              ))}
            </Column>
            <Column label="MM">
              {MINUTES.map((minute) => (
                <Cell
                  key={minute}
                  selected={hasValue && parts.minute === minute}
                  innerRef={parts.minute === minute ? selectedMinute : undefined}
                  onClick={() => set({ minute })}
                >
                  {String(minute).padStart(2, '0')}
                </Cell>
              ))}
            </Column>
            <Column label="AM/PM">
              {MERIDIEMS.map((meridiem) => (
                <Cell
                  key={meridiem}
                  selected={hasValue && parts.meridiem === meridiem}
                  onClick={() => set({ meridiem })}
                >
                  {meridiem.toUpperCase()}
                </Cell>
              ))}
            </Column>
          </div>

          <div className="flex items-center justify-between gap-2 pt-3 mt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                onChange('');
                setTyped(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 px-3 py-1 rounded-full hover:bg-brand-50"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
