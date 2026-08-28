import {
  ChevronRight,
  CirclePlus,
  LoaderCircle,
  Lock,
  MessageSquareQuote,
  TriangleAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { checkInImpactLabel, checkInIntensityLabel, checkInPeriodLabel } from '@tmg180/shared';
import { formatLogDate } from '../../lib/dates';
import { useCheckIns, useCheckInSummary } from '../../hooks/participant/checkIns';
import { participantCheckInPath, PARTICIPANT_PATHS } from '../../routes/paths';

/**
 * The participant's check-ins, newest first (Template B / M-04).
 *
 * Every row is a locked record — a check-in has no draft state — so there is
 * no status chip to draw and no edit route to offer. The list exists to show
 * what has been said over time, which is the thing the monthly snapshot is
 * built out of.
 */

function CheckInRow({ checkIn, onOpen }) {
  const intensity = checkInIntensityLabel(checkIn.intensityRating);

  return (
    <button
      onClick={onOpen}
      className="w-full text-left bg-white/80 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-semibold text-slate-900">
              {formatLogDate(checkIn.checkinDate)}
            </h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
              <Lock size={11} />
              {checkInPeriodLabel(checkIn.period)}
            </span>
          </div>
          {intensity && <p className="text-sm text-slate-500 mt-1">{intensity}</p>}
        </div>
        <ChevronRight size={18} className="text-slate-400 shrink-0 mt-1" />
      </div>

      {checkIn.impactTags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {checkIn.impactTags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium text-brand-700 bg-brand-50 px-3 py-1 rounded-full"
            >
              {checkInImpactLabel(tag)}
            </span>
          ))}
        </div>
      )}

      {checkIn.ownWords && (
        <p className="mt-4 text-sm text-slate-600 line-clamp-2">{checkIn.ownWords}</p>
      )}
    </button>
  );
}

export default function CheckInList() {
  const navigate = useNavigate();
  const { data: checkIns, isLoading, error } = useCheckIns();
  const { data: summary } = useCheckInSummary();

  return (
    <div className="max-w-238 mx-auto flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Check-ins</h1>
          <p className="text-base text-slate-600 mt-2 max-w-2xl">
            Your voice, only yours. A check-in captures your own experience of a period —
            weekly, after a support period, or whenever you choose. Nobody else can write
            one for you.
          </p>
          {summary?.total > 0 && (
            <p className="text-sm text-slate-500 mt-3">
              {summary.thisMonth} this month · {summary.total} in total
              {summary.lastCheckinDate && ` · last one ${formatLogDate(summary.lastCheckinDate)}`}
            </p>
          )}
        </div>
        <button
          onClick={() => navigate(PARTICIPANT_PATHS.checkInNew)}
          className="flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 shadow-md hover:bg-brand-700 transition-colors shrink-0"
        >
          <CirclePlus size={16} />
          New check-in
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 text-slate-500 bg-white/80 rounded-xl p-6">
          <LoaderCircle size={18} className="animate-spin" />
          Loading your check-ins…
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
          <TriangleAlert size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">We couldn&rsquo;t load your check-ins.</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      )}

      {checkIns?.length === 0 && (
        <div className="bg-white/80 rounded-xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <MessageSquareQuote size={26} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mt-6">No check-ins yet</h2>
          <p className="text-base text-slate-600 mt-2 max-w-md mx-auto">
            A check-in takes 30&ndash;60 seconds and there are no right or wrong answers.
            You can do one whenever you want to — there is no schedule to keep.
          </p>
          <button
            onClick={() => navigate(PARTICIPANT_PATHS.checkInNew)}
            className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 mt-6 shadow-md hover:bg-brand-700 transition-colors"
          >
            <CirclePlus size={16} />
            Start a check-in
          </button>
        </div>
      )}

      {checkIns?.length > 0 && (
        <div className="flex flex-col gap-4">
          {checkIns.map((checkIn) => (
            <CheckInRow
              key={checkIn.id}
              checkIn={checkIn}
              onOpen={() => navigate(participantCheckInPath.detail(checkIn.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
