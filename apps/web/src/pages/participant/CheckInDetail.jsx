import { ArrowLeft, CirclePlus, LoaderCircle, Lock, TriangleAlert } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  checkInGoalLabel,
  checkInHelpedLabel,
  checkInImpactLabel,
  checkInIntensityLabel,
  checkInPeriodLabel,
  checkInRecoveryLabel,
  CHECKIN_OWN_WORDS_PROMPT,
} from '@tmg180/shared';
import { formatLogDate } from '../../lib/dates';
import { useCheckIn } from '../../hooks/participant/checkIns';
import { PARTICIPANT_PATHS } from '../../routes/paths';

/**
 * One saved check-in, read-only — which is the only way a check-in is ever
 * read. It locks on save, so this screen has no edit affordance to offer: the
 * way to say something different about a later period is a later check-in.
 *
 * Blocks with nothing in them are not drawn. Half a check-in is a whole
 * check-in, and rendering empty headings would read like unfinished homework.
 */

function Block({ title, children }) {
  return (
    <section className="bg-[#f8f9ff] rounded-4xl p-8">
      <h2 className="text-xl font-semibold text-[#0b1c30]">{title}</h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Tags({ values, label }) {
  if (!values?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span
          key={value}
          className="text-sm font-medium text-brand-700 bg-brand-50 px-4 py-1.5 rounded-full"
        >
          {label(value)}
        </span>
      ))}
    </div>
  );
}

function Note({ label, text }) {
  if (!text) return null;
  return (
    <div>
      <p className="text-sm text-[#4d4354]">{label}</p>
      <p className="mt-1 text-base text-[#0b1c30] whitespace-pre-wrap">{text}</p>
    </div>
  );
}

export default function CheckInDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: checkIn, isLoading, error } = useCheckIn(id);

  if (isLoading) {
    return (
      <div className="max-w-238 mx-auto flex items-center gap-3 text-slate-500 bg-[#f8f9ff] rounded-4xl p-8">
        <LoaderCircle size={18} className="animate-spin" />
        Loading your check-in…
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-238 mx-auto flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl p-6 text-rose-800">
        <TriangleAlert size={18} className="shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">We couldn&rsquo;t load this check-in.</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!checkIn) return null;

  const intensity = checkInIntensityLabel(checkIn.intensityRating);
  const hasHelped = checkIn.helpedTags?.length > 0 || checkIn.helpedNotes;
  const hasRecovery = checkIn.recoveryLevel || checkIn.recoveryNotes;
  const hasGoals = checkIn.goalsTags?.length > 0 || checkIn.goalsNotes;

  return (
    <div className="flex flex-col gap-8 max-w-238 mx-auto">
      <div>
        <button
          onClick={() => navigate(PARTICIPANT_PATHS.checkIns)}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={15} />
          All check-ins
        </button>
        <div className="flex items-center gap-3 flex-wrap mt-4">
          <h1 className="text-3xl font-bold text-[#0b1c30]">
            {formatLogDate(checkIn.checkinDate)}
          </h1>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
            <Lock size={11} />
            {checkInPeriodLabel(checkIn.period)}
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-2">
          Saved as you wrote it. To say something different about a later period, add a new
          check-in.
        </p>
      </div>

      <Block title="What showed up most">
        <Tags values={checkIn.impactTags} label={checkInImpactLabel} />
        <Note label="Anything else showing up" text={checkIn.impactNotes} />
        {intensity && (
          <div>
            <p className="text-sm text-[#4d4354]">How strong it was overall</p>
            <p className="mt-1 text-base text-[#0b1c30]">
              {checkIn.intensityRating} — {intensity}
            </p>
          </div>
        )}
      </Block>

      {hasHelped && (
        <Block title="What helped">
          <Tags values={checkIn.helpedTags} label={checkInHelpedLabel} />
          <Note label="What else helped" text={checkIn.helpedNotes} />
        </Block>
      )}

      {hasRecovery && (
        <Block title="Recovery cost">
          {checkIn.recoveryLevel && (
            <p className="text-base text-[#0b1c30]">
              {checkInRecoveryLabel(checkIn.recoveryLevel)}
            </p>
          )}
          <Note label="About recovery" text={checkIn.recoveryNotes} />
        </Block>
      )}

      {checkIn.ownWords && (
        <Block title="In my own words">
          <Note label={CHECKIN_OWN_WORDS_PROMPT} text={checkIn.ownWords} />
        </Block>
      )}

      {hasGoals && (
        <Block title="Goals check-in">
          <Tags values={checkIn.goalsTags} label={checkInGoalLabel} />
          <Note label="About my goals this period" text={checkIn.goalsNotes} />
        </Block>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => navigate(PARTICIPANT_PATHS.checkInNew)}
          className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm rounded-full px-6 py-3 shadow-md hover:bg-brand-700 transition-colors"
        >
          <CirclePlus size={16} />
          New check-in
        </button>
      </div>
    </div>
  );
}
