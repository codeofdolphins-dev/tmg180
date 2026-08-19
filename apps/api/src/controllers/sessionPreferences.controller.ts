import { SESSION_PREFERENCE_STATUS, validateSessionSelections } from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { ApiError, ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Session Preferences (participant layer). Filters for planning — they grant
 * nothing, so unlike consent there is no history to preserve: the row is
 * simply the participant's current answers, updated in place.
 */

type PreferencesRow = {
  support_focus: string[];
  availability: string[];
  communication_format: string[];
  setting: string[];
  languages: string[];
  relational_style: string[];
  status: string;
};

const shape = (row: PreferencesRow) => ({
  selections: {
    support_focus: row.support_focus,
    availability: row.availability,
    communication_format: row.communication_format,
    setting: row.setting,
    languages: row.languages,
    relational_style: row.relational_style,
  },
  status: row.status,
});

/** GET /participant/session-preferences — row created on first read. */
export const getSessionPreferences = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const row = await prisma.participantSessionPreferences.upsert({
      where: { participant_id: participantId },
      create: { participant_id: participantId },
      update: {},
    });
    res.json(new ApiResponse(200, 'session preferences fetched', shape(row)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/** PATCH /participant/session-preferences — partial updates welcome. */
export const saveSessionPreferences = asyncHandler(async (req, res) => {
  try {
    const participantId = req.user!.id;
    const body = (req.body ?? {}) as { selections?: Record<string, unknown>; status?: unknown };
    const selections = (body.selections ?? {}) as Partial<Record<string, string[]>>;

    const errors = validateSessionSelections(selections);
    if (Object.keys(errors).length > 0) {
      throw new ApiError(400, 'Those preferences could not be saved.', errors);
    }

    const status = body.status === undefined ? undefined : String(body.status);
    if (
      status !== undefined &&
      status !== SESSION_PREFERENCE_STATUS.DRAFT &&
      status !== SESSION_PREFERENCE_STATUS.SAVED
    ) {
      throw new ApiError(400, 'Status must be draft or saved.');
    }

    // undefined fields are "leave as is" to Prisma's update, and fall back to
    // column defaults on create — one object serves both sides of the upsert.
    const data = {
      support_focus: selections.support_focus,
      availability: selections.availability,
      communication_format: selections.communication_format,
      setting: selections.setting,
      languages: selections.languages,
      relational_style: selections.relational_style,
      status,
    };

    const row = await prisma.participantSessionPreferences.upsert({
      where: { participant_id: participantId },
      create: { participant_id: participantId, ...data },
      update: data,
    });

    res.json(new ApiResponse(200, 'session preferences saved', shape(row)));
  } catch (error) {
    catchResponse(error, res);
  }
});
