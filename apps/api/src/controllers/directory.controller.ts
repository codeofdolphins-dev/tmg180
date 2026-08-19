import {
  ACCOUNT_STATUS,
  AVAILABILITY_DAYS,
  AVAILABILITY_PERIODS,
  CONSENT_STATUS,
  CONTACT_NOTICE,
  SUPPORT_AREAS,
  SUPPORT_AREA_KEYS,
  WORKER_PROFILE_STATUS,
  experienceLabel,
  supportAreaLabel,
} from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { ApiError, ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { publicCredentials } from './workerProfile.controller.js';

/**
 * The participant's directory of verified workers — the read model over
 * published worker profiles (Override P4-01…P4-04, Build Guide R-04/R-06).
 *
 * The rules, in code rather than copy:
 *   - only profiles a worker has published, on an active account, are listed;
 *   - alphabetical, never ranked — there is no rating anywhere to rank by;
 *   - the list payload carries no availability, no contact method and no
 *     credentials: those belong to one profile's detail (R-04);
 *   - filters are location and support area, nothing that "matches";
 *   - the non-coordination notice travels with the payload.
 */

/** How much of the intro the card may carry when there is no one-liner. */
const EXCERPT_LENGTH = 160;

const excerpt = (text: string | null) => {
  if (!text) return null;
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= EXCERPT_LENGTH) return clean;
  const cut = clean.slice(0, EXCERPT_LENGTH);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 80))}…`;
};

const publishedWhere = {
  status: WORKER_PROFILE_STATUS.PUBLISHED,
  opt_in: true,
  worker: { status: ACCOUNT_STATUS.ACTIVE },
};

type ListRow = {
  worker_id: number;
  display_name: string | null;
  relational_intro: string | null;
  support_philosophy: string | null;
  values_tags: string[];
  published_at: Date | null;
  worker: {
    full_name: string;
    supporting_details: {
      support_areas: string[];
      location_area: string | null;
      experience_years: number | null;
    } | null;
  };
};

function toCard(row: ListRow) {
  const details = row.worker.supporting_details;
  return {
    workerId: row.worker_id,
    name: row.display_name?.trim() || row.worker.full_name,
    location: details?.location_area ?? null,
    experienceYears: details?.experience_years ?? null,
    experienceLabel: experienceLabel(details?.experience_years),
    philosophy: row.support_philosophy,
    introExcerpt: excerpt(row.relational_intro),
    relationalTags: row.values_tags,
    supportAreas: (details?.support_areas ?? []).map((key) => ({ key, label: supportAreaLabel(key) })),
    publishedAt: row.published_at,
  };
}

/**
 * GET /participant/directory?location=&supportArea=
 *
 * `location` matches the worker's stated area exactly (the filter offers the
 * distinct values that exist, so there is nothing to guess); `supportArea`
 * is a SUPPORT_AREAS key. The filter lists come back with the results so the
 * screen offers only choices that can return someone.
 */
export const listDirectory = asyncHandler(async (req, res) => {
  try {
    const location = typeof req.query.location === 'string' ? req.query.location.trim() : '';
    const supportArea = typeof req.query.supportArea === 'string' ? req.query.supportArea.trim() : '';
    if (supportArea && !SUPPORT_AREA_KEYS.includes(supportArea)) {
      throw new ApiError(400, 'That support area is not one of the offered options.', {
        supportArea: 'Unknown support area.',
      });
    }

    const rows = await prisma.workerRelationalProfile.findMany({
      where: {
        ...publishedWhere,
        ...(location || supportArea
          ? {
              worker: {
                status: ACCOUNT_STATUS.ACTIVE,
                supporting_details: {
                  ...(location ? { location_area: { equals: location, mode: 'insensitive' as const } } : {}),
                  ...(supportArea ? { support_areas: { has: supportArea } } : {}),
                },
              },
            }
          : {}),
      },
      select: {
        worker_id: true,
        display_name: true,
        relational_intro: true,
        support_philosophy: true,
        values_tags: true,
        published_at: true,
        worker: {
          select: {
            full_name: true,
            supporting_details: {
              select: { support_areas: true, location_area: true, experience_years: true },
            },
          },
        },
      },
    });

    // Alphabetical by the name that shows — display name when set — and
    // nothing else. Sorting in code because the shown name is a coalesce.
    const workers = rows.map(toCard).sort((a, b) => a.name.localeCompare(b.name, 'en'));

    // Filter options reflect every published profile, not the current page
    // of results, so clearing one filter never leaves the other with no
    // choices.
    const published = await prisma.workerProfileSupportingDetails.findMany({
      where: { worker: { relational_profile: publishedWhere, status: ACCOUNT_STATUS.ACTIVE } },
      select: { location_area: true, support_areas: true },
    });
    const locations = [
      ...new Set(published.map((row) => row.location_area?.trim()).filter((v): v is string => Boolean(v))),
    ].sort((a, b) => a.localeCompare(b, 'en'));
    const offeredAreas = new Set(published.flatMap((row) => row.support_areas));
    const supportAreas = SUPPORT_AREAS.filter((area) => offeredAreas.has(area.key));

    res.json(
      new ApiResponse(200, 'directory fetched', {
        workers,
        total: workers.length,
        filters: { location: location || null, supportArea: supportArea || null, locations, supportAreas },
        contactNotice: CONTACT_NOTICE,
      })
    );
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * GET /participant/directory/:workerId
 *
 * One published profile in full — relational content first, then the
 * supporting details including availability (R-04: here and only here),
 * the public view of the worker's credentials, and whether this participant
 * currently shares access with them. 404 for anything not published: an
 * unlisted worker is not a worker the directory knows about.
 */
export const getDirectoryWorker = asyncHandler(async (req, res) => {
  try {
    const workerId = Number(req.params.workerId);
    if (!Number.isInteger(workerId) || workerId <= 0) throw new ApiError(404, 'No such worker profile.');

    const row = await prisma.workerRelationalProfile.findFirst({
      where: { worker_id: workerId, ...publishedWhere },
      include: {
        worker: {
          select: {
            id: true,
            full_name: true,
            supporting_details: true,
            credentials: true,
          },
        },
      },
    });
    if (!row) throw new ApiError(404, 'No such worker profile.');

    const details = row.worker.supporting_details;
    const availability = new Set(details?.availability ?? []);
    const consent = await prisma.consent.findFirst({
      where: { participant_id: req.user!.id, worker_id: workerId, status: CONSENT_STATUS.ACTIVE },
      select: { id: true, granted_at: true },
    });

    res.json(
      new ApiResponse(200, 'worker profile fetched', {
        workerId: row.worker_id,
        name: row.display_name?.trim() || row.worker.full_name,
        active: true,
        location: details?.location_area ?? null,
        experienceYears: details?.experience_years ?? null,
        experienceLabel: experienceLabel(details?.experience_years),
        philosophy: row.support_philosophy,
        relational: {
          relational_intro: row.relational_intro,
          natural_support_style: row.natural_support_style,
          communication_style: row.communication_style,
          preferred_environments: row.preferred_environments,
          interests: row.interests,
          participants_appreciate: row.participants_appreciate,
          boundaries_and_fit: row.boundaries_and_fit,
        },
        relationalTags: row.values_tags,
        supportingDetails: {
          supportAreas: (details?.support_areas ?? []).map((key) => ({ key, label: supportAreaLabel(key) })),
          languages: details?.languages ?? [],
          availability: AVAILABILITY_DAYS.map((day) => ({
            day: day.key,
            label: day.short,
            weekend: day.weekend,
            slots: Object.fromEntries(
              AVAILABILITY_PERIODS.map((period) => [period.key, availability.has(`${day.key}_${period.key}`)])
            ),
          })),
          availabilitySet: availability.size > 0,
          contactPreference: details?.contact_preference ?? null,
        },
        credentials: publicCredentials(row.worker.credentials),
        consent: consent ? { active: true, grantedAt: consent.granted_at } : { active: false },
        contactNotice: CONTACT_NOTICE,
        publishedAt: row.published_at,
      })
    );
  } catch (error) {
    catchResponse(error, res);
  }
});
