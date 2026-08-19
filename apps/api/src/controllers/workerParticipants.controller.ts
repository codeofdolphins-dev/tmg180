import { CONSENT_STATUS, DAILY_LOG_AUTHOR_ROLE, consentSummary } from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { toDay } from '../utils/dbDates.js';
import { syncParticipantGoals } from './goals.controller.js';

/**
 * "Participants I support" — the people who currently hold an active consent
 * grant for this worker, and nothing about anyone else. The list is the grant,
 * not a roster: a revoked or superseded grant drops the person from it on the
 * next request, and the worker's own logs about them stay in the worker's
 * history (that is their record) while every participant-owned surface closes.
 */

const permissionsOf = (row: {
  can_view_intake: boolean | null;
  can_view_snapshot: boolean | null;
  can_add_daily_note: boolean | null;
  can_view_checkins: boolean | null;
}) => ({
  canViewSnapshot: row.can_view_snapshot ?? false,
  canViewProfile: row.can_view_intake ?? false,
  canAddDailyNote: row.can_add_daily_note ?? false,
  canViewCheckins: row.can_view_checkins ?? false,
});

/**
 * GET /worker/participants
 *
 * Each person carries their grant and, from the worker's own history, the
 * most recent log about them (`lastSupport`) and how many there are — so the
 * screen can say "Last support: yesterday" without a second round trip. Those
 * come from the worker's logs, not from anything participant-owned.
 */
export const listWorkerParticipants = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const consents = await prisma.consent.findMany({
      where: { worker_id: workerId, status: CONSENT_STATUS.ACTIVE },
      include: { participant: { select: { id: true, full_name: true } } },
      orderBy: { created_at: 'desc' },
    });

    const participantIds = [...new Set(consents.map((consent) => consent.participant_id))];
    const [latest, counts] = participantIds.length
      ? await Promise.all([
          prisma.dailyNoteStructured.findMany({
            where: {
              author_id: workerId,
              author_role: DAILY_LOG_AUTHOR_ROLE.WORKER,
              participant_id: { in: participantIds },
            },
            orderBy: [{ session_date: 'desc' }, { start_time: 'desc' }, { created_at: 'desc' }],
            distinct: ['participant_id'],
            select: { id: true, participant_id: true, session_date: true, status: true },
          }),
          prisma.dailyNoteStructured.groupBy({
            by: ['participant_id'],
            where: {
              author_id: workerId,
              author_role: DAILY_LOG_AUTHOR_ROLE.WORKER,
              participant_id: { in: participantIds },
            },
            _count: { _all: true },
          }),
        ])
      : [[], []];
    const lastByParticipant = new Map(latest.map((row) => [row.participant_id, row]));
    const countByParticipant = new Map(counts.map((row) => [row.participant_id, row._count._all]));

    // One entry per participant — the newest active grant wins if there are
    // somehow two (supersession should prevent it, but the list must not
    // show a person twice).
    const seen = new Set<number>();
    const participants = [];
    for (const consent of consents) {
      if (seen.has(consent.participant_id)) continue;
      seen.add(consent.participant_id);
      const permissions = permissionsOf(consent);
      const last = lastByParticipant.get(consent.participant_id);
      participants.push({
        id: consent.participant.id,
        name: consent.participant.full_name,
        consent: {
          id: consent.id,
          grantedAt: consent.granted_at,
          permissions,
          summary: consentSummary(permissions),
        },
        lastSupport: last
          ? { logId: last.id, sessionDate: toDay(last.session_date), status: last.status }
          : null,
        logCount: countByParticipant.get(consent.participant_id) ?? 0,
      });
    }
    participants.sort((a, b) => a.name.localeCompare(b.name));

    res.json(new ApiResponse(200, 'participants fetched', participants));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * GET /worker/participants/:participantId/goals
 *
 * Behind requireConsent('canAddDailyNote', 'canViewProfile'): linking goals is
 * what makes a log submittable, so a worker allowed to add logs must be able
 * to see them; a worker allowed to see the profile sees them for the same
 * reason the participant does. Same derivation as the participant's own list.
 */
export const listParticipantGoals = asyncHandler(async (req, res) => {
  try {
    const participantId = Number(req.params.participantId);
    res.json(new ApiResponse(200, 'goals fetched', await syncParticipantGoals(participantId)));
  } catch (error) {
    catchResponse(error, res);
  }
});
