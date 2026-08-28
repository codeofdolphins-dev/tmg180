import {
  CHECKIN_LIMITS,
  canSubmitCheckIn,
  isCheckInLocked,
  monthKeyOf,
} from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { ApiError, ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * The Participant Check-in (Template B, Longitudinal Evidence Templates v2.0).
 *
 * The participant's own account of a period, sitting alongside the worker's
 * Support Event Log rather than inside it. Two rules shape this whole file:
 *
 *   - It is the participant's voice, so only they write it. The role guard is
 *     in the route middleware and there is no worker-layer twin — a worker
 *     completing a participant's check-in is the one thing the template rules
 *     out by name.
 *   - `is_locked` defaults true, so there is no draft state and no PATCH. What
 *     someone wrote about a period is the record for that period; a later
 *     thought is a later check-in, not an edit of the earlier one.
 *
 * Check-ins feed the Monthly Snapshot through `generated_from_checkins`.
 */

type CheckInRow = NonNullable<Awaited<ReturnType<typeof prisma.participantCheckin.findFirst>>>;

const toDay = (value: Date | null | undefined) => (value ? value.toISOString().slice(0, 10) : null);

function toCheckIn(row: CheckInRow) {
  return {
    id: row.id,
    period: row.checkin_period,
    checkinDate: toDay(row.checkin_date),
    monthYear: toDay(row.checkin_date)?.slice(0, 7) ?? null,
    impactTags: row.impact_tags,
    impactNotes: row.impact_notes ?? '',
    intensityRating: row.intensity_rating,
    helpedTags: row.helped_tags,
    helpedNotes: row.helped_notes ?? '',
    recoveryLevel: row.recovery_level,
    recoveryNotes: row.recovery_notes ?? '',
    ownWords: row.own_words ?? '',
    goalsTags: row.goals_checkin_tags,
    goalsNotes: row.goals_notes ?? '',
    isLocked: isCheckInLocked({ isLocked: row.is_locked ?? true }),
    createdAt: row.created_at,
  };
}

const numericId = (value: string) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new ApiError(404, 'No such check-in.');
  return id;
};

const text = (value: unknown) =>
  typeof value === 'string' && value.trim() !== '' ? value.slice(0, CHECKIN_LIMITS.maxNotes) : null;

/**
 * GET /participant/check-ins — newest first.
 *
 * `?month=YYYY-MM` narrows to one month, which is how the Monthly Snapshot
 * screen shows what a month's check-ins actually said.
 */
export const listCheckIns = asyncHandler(async (req, res) => {
  try {
    const { month } = req.query as { month?: string };
    const where: Record<string, unknown> = { participant_id: req.user!.id };

    if (month) {
      if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
        throw new ApiError(400, 'Choose a month.', { month: 'Needs to be a month like 2026-08.' });
      }
      const [year, monthNumber] = month.split('-').map(Number);
      where.checkin_date = {
        gte: new Date(Date.UTC(year!, monthNumber! - 1, 1)),
        // Day 0 of the next month is the last day of this one.
        lte: new Date(Date.UTC(year!, monthNumber!, 0)),
      };
    }

    const checkIns = await prisma.participantCheckin.findMany({
      where,
      orderBy: [{ checkin_date: 'desc' }, { id: 'desc' }],
    });

    res.json(new ApiResponse(200, 'check-ins fetched', checkIns.map(toCheckIn)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * POST /participant/check-ins
 *
 * Saves and locks in one call — see the note at the top of the file. The
 * shared contract is the only gate, so the web form and the server refuse the
 * same things for the same reasons.
 */
export const createCheckIn = asyncHandler(async (req, res) => {
  try {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const fields = {
      period: body.period,
      checkinDate: body.checkinDate,
      impactTags: body.impactTags ?? [],
      impactNotes: body.impactNotes,
      intensityRating: body.intensityRating ?? null,
      helpedTags: body.helpedTags ?? [],
      helpedNotes: body.helpedNotes,
      recoveryLevel: body.recoveryLevel,
      recoveryNotes: body.recoveryNotes,
      ownWords: body.ownWords,
      goalsTags: body.goalsTags ?? [],
      goalsNotes: body.goalsNotes,
    };

    const { ok, errors } = canSubmitCheckIn(fields as never);
    if (!ok) throw new ApiError(400, 'Some parts of this check-in need another look.', errors);

    const created = await prisma.participantCheckin.create({
      data: {
        participant_id: req.user!.id,
        checkin_period: fields.period as string,
        checkin_date: new Date(`${fields.checkinDate as string}T00:00:00.000Z`),
        impact_tags: fields.impactTags as string[],
        impact_notes: text(fields.impactNotes),
        intensity_rating: (fields.intensityRating as number | null) ?? null,
        helped_tags: fields.helpedTags as string[],
        helped_notes: text(fields.helpedNotes),
        recovery_level: (fields.recoveryLevel as string | undefined) ?? null,
        recovery_notes: text(fields.recoveryNotes),
        goals_checkin_tags: fields.goalsTags as string[],
        goals_notes: text(fields.goalsNotes),
        own_words: text(fields.ownWords),
        is_locked: true,
      },
    });

    res.status(201).json(new ApiResponse(201, 'check-in saved', toCheckIn(created)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/** GET /participant/check-ins/:id */
export const getCheckIn = asyncHandler(async (req, res) => {
  try {
    const checkIn = await prisma.participantCheckin.findFirst({
      where: { id: numericId(req.params.id as string), participant_id: req.user!.id },
    });
    if (!checkIn) throw new ApiError(404, 'No such check-in.');
    res.json(new ApiResponse(200, 'check-in fetched', toCheckIn(checkIn)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * GET /participant/check-ins/summary — what the portal shows without opening one.
 *
 * The count for the current month and the date of the last check-in, so the
 * dashboard and the check-in list can say where someone is up to without
 * pulling every record they have ever written.
 */
export const getCheckInSummary = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const monthKey = monthKeyOf();
    const [year, month] = monthKey.split('-').map(Number);

    const [total, thisMonth, latest] = await Promise.all([
      prisma.participantCheckin.count({ where: { participant_id: participantId } }),
      prisma.participantCheckin.count({
        where: {
          participant_id: participantId,
          checkin_date: {
            gte: new Date(Date.UTC(year!, month! - 1, 1)),
            lte: new Date(Date.UTC(year!, month!, 0)),
          },
        },
      }),
      prisma.participantCheckin.findFirst({
        where: { participant_id: participantId },
        orderBy: [{ checkin_date: 'desc' }, { id: 'desc' }],
        select: { checkin_date: true },
      }),
    ]);

    res.json(
      new ApiResponse(200, 'check-in summary fetched', {
        total,
        thisMonth,
        monthYear: monthKey,
        lastCheckinDate: toDay(latest?.checkin_date),
      })
    );
  } catch (error) {
    catchResponse(error, res);
  }
});
