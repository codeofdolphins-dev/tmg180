import { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Clock,
  MapPin,
  BadgeCheck,
  ShieldOff,
  CheckCircle2,
  CirclePlus,
  LoaderCircle,
  TriangleAlert,
  NotebookPen,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DAILY_LOG_STATUS } from '@tmg180/shared';
import { parseDay, toDayValue, todayValue, formatTimeRange, formatShortDate } from '../../lib/dates';
import { useWorkerDailyLogs } from '../../hooks/worker/dailyLog';
import { WORKER_PATHS, workerDailyLogPath } from '../../routes/paths';

/**
 * Worker Calendar — Figma 1170:7390, on the UI scale.
 *
 * TMG180 has no booking or roster concept (it is the one thing the platform
 * must never become), so there is no sessions table to read. A "session" here
 * is the same thing it is on the dashboard: one of the worker's own Daily
 * Support Evidence Logs, placed on the day it records. The grid reads
 * `/worker/daily-logs?from&to` for the visible range; the agenda shows the
 * selected day; Week and List are the same data in a different shape. Until
 * the worker log form is built, every card opens the Daily Logs list.
 */

const CARD = 'bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]';
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const VIEWS = [
  { key: 'month', label: 'Month' },
  { key: 'week', label: 'Week' },
  { key: 'list', label: 'List' },
];
const PAGE_LIMIT = 100;

// ---- calendar-day arithmetic (strings in, strings out; never via UTC) ------

function addDays(day, count) {
  const date = parseDay(day);
  date.setDate(date.getDate() + count);
  return toDayValue(date);
}

function addMonths(day, count) {
  const date = parseDay(day);
  date.setDate(1);
  date.setMonth(date.getMonth() + count);
  return toDayValue(date);
}

function firstOfMonth(day) {
  const date = parseDay(day);
  date.setDate(1);
  return toDayValue(date);
}

function lastOfMonth(day) {
  const date = parseDay(day);
  date.setMonth(date.getMonth() + 1, 0);
  return toDayValue(date);
}

/** The Sunday on or before `day` — the frame's week starts on Sunday. */
function startOfWeek(day) {
  const date = parseDay(day);
  return addDays(day, -date.getDay());
}

function monthTitle(day) {
  return parseDay(day).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
}

function dayOfMonth(day) {
  return parseDay(day).getDate();
}

/** The range a view needs: the month grid includes the padding days around it. */
function visibleRange(view, cursor, selected) {
  if (view === 'week') {
    const from = startOfWeek(selected);
    return { from, to: addDays(from, 6) };
  }
  const first = firstOfMonth(cursor);
  const last = lastOfMonth(cursor);
  if (view === 'list') return { from: first, to: last };
  const from = startOfWeek(first);
  const to = addDays(startOfWeek(last), 6);
  return { from, to };
}

function daysBetween(from, to) {
  const days = [];
  for (let day = from; day <= to; day = addDays(day, 1)) days.push(day);
  return days;
}

/** A session is upcoming until its end time (or start, or day) has passed. */
function isUpcoming(log, today, nowClock) {
  if (log.sessionDate > today) return true;
  if (log.sessionDate < today) return false;
  const end = log.endTime || log.startTime;
  return end ? end > nowClock : false;
}

// ---- pieces -----------------------------------------------------------------

function SessionChip({ upcoming }) {
  return upcoming ? (
    <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-brand-700 shrink-0">
      Upcoming
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 shrink-0">
      <CheckCircle2 size={11} />
      Completed
    </span>
  );
}

function SessionCard({ log, upcoming, onOpen }) {
  const submitted = log.status === DAILY_LOG_STATUS.SUBMITTED;
  const times = formatTimeRange(log.startTime, log.endTime);
  const where = log.serviceType || log.location;
  const cta = upcoming ? 'Open support tools' : submitted ? 'View details' : 'Continue Daily Log';
  const ctaStyle = upcoming
    ? 'bg-brand-600 text-white shadow-md hover:bg-brand-700'
    : submitted
      ? 'bg-slate-50 text-slate-700 hover:bg-slate-100'
      : 'bg-white border border-slate-200 text-brand-700 hover:bg-purple-50';

  return (
    <div className={`${CARD} ${submitted ? 'border-l-4 border-emerald-400' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{log.participant.name}</h3>
        <SessionChip upcoming={upcoming} />
      </div>
      <p className="flex items-center gap-2 text-sm text-slate-500 mt-1">
        <Clock size={14} className="text-slate-400" />
        {times || 'Time not recorded'}
      </p>
      {where && (
        <p className="flex items-center gap-2 text-sm text-slate-600 mt-2">
          <MapPin size={14} className="text-slate-400" />
          {where}
        </p>
      )}
      <p
        className={`flex items-center gap-2 text-sm mt-2 ${
          log.consentActive ? 'text-emerald-700' : 'text-slate-500'
        }`}
      >
        {log.consentActive ? <BadgeCheck size={14} /> : <ShieldOff size={14} />}
        {log.consentActive ? 'Active consent' : 'No active consent'}
      </p>
      <p className="flex items-center gap-2 text-sm mt-2">
        {submitted ? (
          <>
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span className="text-emerald-700">Log submitted</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-400 ml-1 mr-1" />
            <span className="text-slate-700">Log draft in progress</span>
          </>
        )}
      </p>
      <button
        onClick={() => onOpen(log)}
        className={`mt-4 w-full text-sm font-semibold rounded-full py-3 transition-colors ${ctaStyle}`}
      >
        {cta}
      </button>
    </div>
  );
}

function Marker({ log }) {
  return (
    <span
      className={`block h-1.5 rounded-full ${
        log.status === DAILY_LOG_STATUS.SUBMITTED ? 'bg-emerald-400' : 'bg-brand-600'
      }`}
    />
  );
}

function MonthGrid({ cursor, selected, today, logsByDay, onSelect }) {
  const { from, to } = visibleRange('month', cursor, selected);
  const month = parseDay(cursor).getMonth();
  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAYS.map((label) => (
          <div key={label} className="text-[10px] font-bold uppercase tracking-wide text-slate-400 text-center">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {daysBetween(from, to).map((day) => {
          const inMonth = parseDay(day).getMonth() === month;
          const logs = logsByDay.get(day) ?? [];
          const isSelected = day === selected;
          const isToday = day === today;
          return (
            <button
              key={day}
              onClick={() => onSelect(day)}
              aria-pressed={isSelected}
              aria-label={`${formatShortDate(day)}${logs.length ? `, ${logs.length} session${logs.length === 1 ? '' : 's'}` : ''}`}
              className={`aspect-square rounded-xl p-2 flex flex-col items-start justify-between border transition-colors ${
                isSelected
                  ? 'border-brand-600 bg-purple-50'
                  : isToday
                    ? 'border-brand-200 bg-white hover:bg-purple-50/60'
                    : 'border-slate-100 bg-white/70 hover:bg-slate-50'
              } ${inMonth ? '' : 'opacity-40'}`}
            >
              <span
                className={`text-sm ${
                  isToday || isSelected ? 'font-bold text-brand-700' : 'text-slate-700'
                }`}
              >
                {dayOfMonth(day)}
              </span>
              {logs.length > 0 && (
                <span className="w-full flex flex-col gap-0.5">
                  {logs.slice(0, 3).map((log) => (
                    <Marker key={log.id} log={log} />
                  ))}
                  {logs.length > 3 && (
                    <span className="text-[10px] text-slate-500 leading-none">+{logs.length - 3}</span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeekStrip({ selected, today, logsByDay, onSelect }) {
  const from = startOfWeek(selected);
  return (
    <div className="grid grid-cols-7 gap-2">
      {daysBetween(from, addDays(from, 6)).map((day, index) => {
        const logs = logsByDay.get(day) ?? [];
        const isSelected = day === selected;
        const isToday = day === today;
        return (
          <button
            key={day}
            onClick={() => onSelect(day)}
            aria-pressed={isSelected}
            className={`min-h-40 rounded-xl p-2 flex flex-col gap-2 border text-left transition-colors ${
              isSelected
                ? 'border-brand-600 bg-purple-50'
                : isToday
                  ? 'border-brand-200 bg-white'
                  : 'border-slate-100 bg-white/70 hover:bg-slate-50'
            }`}
          >
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{WEEKDAYS[index]}</div>
              <div className={`text-sm ${isToday || isSelected ? 'font-bold text-brand-700' : 'text-slate-700'}`}>
                {dayOfMonth(day)}
              </div>
            </div>
            {logs.map((log) => (
              <span
                key={log.id}
                className={`block text-[11px] leading-tight rounded-lg px-2 py-1 ${
                  log.status === DAILY_LOG_STATUS.SUBMITTED
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-purple-100 text-brand-800'
                }`}
                title={`${log.participant.name}${log.startTime ? ` · ${formatTimeRange(log.startTime, log.endTime)}` : ''}`}
              >
                <span className="block font-semibold truncate">{log.participant.name.split(' ')[0]}</span>
                {log.startTime && (
                  <span className="block opacity-80">{formatTimeRange(log.startTime, null)}</span>
                )}
              </span>
            ))}
          </button>
        );
      })}
    </div>
  );
}

function ListView({ logs, today, nowClock, onOpen }) {
  if (logs.length === 0) {
    return <p className="text-sm text-slate-600">No sessions logged this month.</p>;
  }
  const groups = [];
  for (const log of [...logs].sort((a, b) => (a.sessionDate < b.sessionDate ? -1 : 1))) {
    const last = groups[groups.length - 1];
    if (last && last.day === log.sessionDate) last.logs.push(log);
    else groups.push({ day: log.sessionDate, logs: [log] });
  }
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.day}>
          <h3 className="text-sm font-semibold text-slate-500 mb-3">
            {group.day === today ? 'Today · ' : ''}
            {formatShortDate(group.day)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.logs.map((log) => (
              <SessionCard
                key={log.id}
                log={log}
                upcoming={isUpcoming(log, today, nowClock)}
                onOpen={onOpen}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- page -------------------------------------------------------------------

export default function Calendar() {
  const navigate = useNavigate();
  const today = todayValue();
  const [view, setView] = useState('month');
  const [cursor, setCursor] = useState(() => firstOfMonth(today));
  const [selected, setSelected] = useState(today);

  const range = visibleRange(view, cursor, selected);
  const { data: logs, isLoading, error } = useWorkerDailyLogs({
    from: range.from,
    to: range.to,
    limit: PAGE_LIMIT,
  });

  const logsByDay = useMemo(() => {
    const map = new Map();
    for (const log of logs ?? []) {
      if (!map.has(log.sessionDate)) map.set(log.sessionDate, []);
      map.get(log.sessionDate).push(log);
    }
    // Earliest start first within a day.
    for (const list of map.values()) {
      list.sort((a, b) => String(a.startTime ?? '').localeCompare(String(b.startTime ?? '')));
    }
    return map;
  }, [logs]);

  const now = new Date();
  const nowClock = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const agenda = logsByDay.get(selected) ?? [];

  const openLog = (log) =>
    navigate(
      log.status === DAILY_LOG_STATUS.SUBMITTED
        ? workerDailyLogPath.detail(log.id)
        : workerDailyLogPath.edit(log.id)
    );

  const select = (day) => {
    setSelected(day);
    if (firstOfMonth(day) !== cursor) setCursor(firstOfMonth(day));
  };
  const step = (direction) => {
    if (view === 'week') {
      select(addDays(selected, 7 * direction));
    } else {
      setCursor((current) => addMonths(current, direction));
    }
  };
  const goToday = () => {
    setCursor(firstOfMonth(today));
    setSelected(today);
  };

  const title = view === 'week' ? `Week of ${formatShortDate(startOfWeek(selected))}` : monthTitle(cursor);

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
        <p className="text-base text-slate-600 mt-2 max-w-2xl">
          View your upcoming support sessions and check-ins.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
        {/* ---------- calendar column ---------- */}
        <div className="flex flex-col gap-4">
          <div className={`${CARD} flex flex-wrap items-center justify-between gap-3 py-4`}>
            <div className="flex items-center gap-3">
              <button
                onClick={goToday}
                className="text-sm font-medium text-brand-700 border border-purple-200 rounded-full px-4 py-1.5 hover:bg-purple-50 transition-colors"
              >
                Today
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => step(-1)}
                  aria-label={view === 'week' ? 'Previous week' : 'Previous month'}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-lg font-semibold text-slate-900 min-w-44 text-center">{title}</h2>
                <button
                  onClick={() => step(1)}
                  aria-label={view === 'week' ? 'Next week' : 'Next month'}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            <div className="flex items-center bg-slate-100 rounded-full p-1" role="tablist">
              {VIEWS.map((option) => (
                <button
                  key={option.key}
                  role="tab"
                  aria-selected={view === option.key}
                  onClick={() => setView(option.key)}
                  className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
                    view === option.key
                      ? 'bg-white text-brand-700 font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={CARD}>
            {isLoading && (
              <p className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <LoaderCircle size={16} className="animate-spin" />
                Loading your sessions…
              </p>
            )}
            {error && (
              <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-4 text-rose-800 mb-4">
                <TriangleAlert size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">We couldn&rsquo;t load your sessions.</p>
                  <p className="text-sm mt-1">{error.message}</p>
                </div>
              </div>
            )}
            {logs?.length === PAGE_LIMIT && (
              <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-4">
                Showing the first {PAGE_LIMIT} sessions in this range — narrow the range to see the rest.
              </p>
            )}

            {view === 'month' && (
              <MonthGrid cursor={cursor} selected={selected} today={today} logsByDay={logsByDay} onSelect={select} />
            )}
            {view === 'week' && (
              <WeekStrip selected={selected} today={today} logsByDay={logsByDay} onSelect={select} />
            )}
            {view === 'list' && <ListView logs={logs ?? []} today={today} nowClock={nowClock} onOpen={openLog} />}

            {view !== 'list' && (
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-1.5 rounded-full bg-brand-600" /> Draft log
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-1.5 rounded-full bg-emerald-400" /> Submitted log
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ---------- agenda rail ---------- */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 bg-[#eef3fd] rounded-xl p-4">
            <span className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
              <Lightbulb size={18} />
            </span>
            <p className="text-sm text-slate-700 leading-relaxed">
              Daily Support Evidence Logs can be added after a support session.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Agenda</h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-brand-700">
              {selected === today ? 'Today' : formatShortDate(selected)}
            </span>
          </div>

          {agenda.length === 0 && !isLoading && (
            <div className={`${CARD} text-center py-8`}>
              <div className="w-12 h-12 rounded-full bg-purple-50 text-brand-600 flex items-center justify-center mx-auto">
                <NotebookPen size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-900 mt-3">
                {selected === today ? 'Nothing logged for today' : 'Nothing logged on this day'}
              </p>
              <p className="text-sm text-slate-600 mt-1">
                A session shows here once you start a Daily Support Evidence Log for it.
              </p>
              <button
                onClick={() => navigate(WORKER_PATHS.dailyLogNew)}
                className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-5 py-2.5 mt-4 shadow-md hover:bg-brand-700 transition-colors"
              >
                <CirclePlus size={15} />
                New Support Entry
              </button>
            </div>
          )}

          {agenda.map((log) => (
            <SessionCard
              key={log.id}
              log={log}
              upcoming={isUpcoming(log, today, nowClock)}
              onOpen={openLog}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
