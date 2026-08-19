import type { Request } from 'express';
import {
  CONTACT_NOTICE,
  ROLES,
  WORKER_CREDENTIAL_KEYS,
  WORKER_PROFILE_STATUS,
  credentialStatus,
  credentialTypeLabel,
  experienceLabel,
  supportAreaLabel,
  validateWorkerProfileFields,
  workerProfileReadiness,
} from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { ApiError, ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { asInet } from '../utils/clientInfo.js';
import { serverToday, toDay } from '../utils/dbDates.js';

/**
 * The worker's own profile — relational content first (the seven prompts,
 * a one-line philosophy, relational tags), résumé details as supporting
 * content, and the R-07 publication state. Worker-owned: every query is
 * scoped to req.user.id, and nothing here reads anyone else's rows.
 *
 * Both rows are created on first read so the authoring screen always has
 * something to bind to; editing a published profile changes the directory
 * at once (it is the worker's own statement about themselves — there is no
 * review queue). Publishing needs the relational intro and the explicit
 * opt-in (workerProfileReadiness); unpublishing is a single action and
 * leaves the content alone.
 */

type RelationalRow = {
  worker_id: number;
  display_name: string | null;
  relational_intro: string | null;
  natural_support_style: string | null;
  communication_style: string[];
  preferred_environments: string | null;
  interests: string[];
  participants_appreciate: string[];
  boundaries_and_fit: string | null;
  values_tags: string[];
  support_philosophy: string | null;
  opt_in: boolean;
  status: string;
  published_at: Date | null;
  updated_at: Date;
};

type SupportingRow = {
  support_areas: string[];
  availability: string[];
  location_area: string | null;
  languages: string[];
  experience_years: number | null;
  contact_preference: string | null;
  updated_at: Date;
};

type CredentialRow = {
  credential_type: string;
  issued_at: Date | null;
  expires_at: Date | null;
  verified_at: Date | null;
};

/** The flat wire shape — what PATCH accepts and what readiness reads. */
export function flattenProfile(relational: RelationalRow, supporting: SupportingRow) {
  return {
    displayName: relational.display_name,
    relational_intro: relational.relational_intro,
    natural_support_style: relational.natural_support_style,
    communication_style: relational.communication_style,
    preferred_environments: relational.preferred_environments,
    interests: relational.interests,
    participants_appreciate: relational.participants_appreciate,
    boundaries_and_fit: relational.boundaries_and_fit,
    supportPhilosophy: relational.support_philosophy,
    valuesTags: relational.values_tags,
    supportAreas: supporting.support_areas,
    availability: supporting.availability,
    locationArea: supporting.location_area,
    languages: supporting.languages,
    experienceYears: supporting.experience_years,
    contactPreference: supporting.contact_preference,
    optIn: relational.opt_in,
  };
}

/**
 * What the public can see of a worker's credentials: the type, the dates
 * the worker recorded, and whether TMG180 has verified it. Only credentials
 * with something recorded are listed — an empty row is nothing to show.
 * Shared by the worker's own preview and the participant's profile view so
 * the worker sees exactly what a participant will.
 */
export function publicCredentials(rows: CredentialRow[], today = serverToday()) {
  const byType = new Map(rows.map((row) => [row.credential_type, row]));
  return WORKER_CREDENTIAL_KEYS.flatMap((type) => {
    const row = byType.get(type);
    if (!row || (!row.issued_at && !row.expires_at && !row.verified_at)) return [];
    const expiresAt = toDay(row.expires_at);
    return [
      {
        type,
        label: credentialTypeLabel(type),
        issuedAt: toDay(row.issued_at),
        expiresAt,
        verifiedAt: row.verified_at,
        status: credentialStatus({ expiresAt }, today).status,
      },
    ];
  });
}

/** Everything the worker's authoring screen and preview need, in one payload. */
export function shapeOwnProfile(
  user: { id: number; full_name: string; status: string },
  relational: RelationalRow,
  supporting: SupportingRow,
  credentials: CredentialRow[]
) {
  const fields = flattenProfile(relational, supporting);
  const readiness = workerProfileReadiness(fields);
  return {
    workerId: user.id,
    name: relational.display_name?.trim() || user.full_name,
    accountName: user.full_name,
    fields,
    supportAreas: supporting.support_areas.map((key) => ({ key, label: supportAreaLabel(key) })),
    experienceLabel: experienceLabel(supporting.experience_years),
    credentials: publicCredentials(credentials),
    publication: {
      status: relational.status,
      optIn: relational.opt_in,
      publishedAt: relational.published_at,
      isPublished: relational.status === WORKER_PROFILE_STATUS.PUBLISHED,
    },
    readiness,
    contactNotice: CONTACT_NOTICE,
    updatedAt:
      relational.updated_at > supporting.updated_at ? relational.updated_at : supporting.updated_at,
  };
}

/** Both rows exist after this. */
async function loadOwnProfile(workerId: number) {
  const [user, relational, supporting, credentials] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: workerId },
      select: { id: true, full_name: true, status: true },
    }),
    prisma.workerRelationalProfile.upsert({
      where: { worker_id: workerId },
      create: { worker_id: workerId },
      update: {},
    }),
    prisma.workerProfileSupportingDetails.upsert({
      where: { worker_id: workerId },
      create: { worker_id: workerId },
      update: {},
    }),
    prisma.workerCredential.findMany({ where: { worker_id: workerId } }),
  ]);
  return shapeOwnProfile(user, relational, supporting, credentials);
}

function writeAudit(req: Request, entry: { actorId: number; action: string; details?: object }) {
  return prisma.auditLog.create({
    data: {
      actor_id: entry.actorId,
      actor_role: ROLES.WORKER,
      action: entry.action,
      target_type: 'worker_relational_profile',
      target_id: entry.actorId,
      details: entry.details ?? undefined,
      ip_address: asInet(req.ip),
    },
  });
}

/** GET /worker/profile */
export const getWorkerProfile = asyncHandler(async (req, res) => {
  try {
    res.json(new ApiResponse(200, 'profile fetched', await loadOwnProfile(req.user!.id)));
  } catch (error) {
    catchResponse(error, res);
  }
});

// undefined = leave alone; null / "" = clear.
const clear = (value: unknown) => value === null || value === '';
const textOrClear = (value: unknown) =>
  value === undefined ? undefined : clear(value) ? null : String(value).trim();
const listOrClear = (value: unknown) =>
  value === undefined ? undefined : value === null ? [] : (value as string[]).map((item) => item.trim());

/**
 * PATCH /worker/profile — the flat wire shape, partial updates welcome.
 * Validation is the shared validateWorkerProfileFields; the row split
 * (relational vs supporting) is an implementation detail the client never
 * sees. Returns the whole profile so the screen never merges.
 */
export const saveWorkerProfile = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const body = (req.body ?? {}) as Record<string, unknown>;

    const errors = validateWorkerProfileFields(body);
    if (Object.keys(errors).length > 0) {
      throw new ApiError(400, 'Your profile could not be saved.', errors);
    }

    const relationalData = {
      display_name: textOrClear(body.displayName),
      relational_intro: textOrClear(body.relational_intro),
      natural_support_style: textOrClear(body.natural_support_style),
      communication_style: listOrClear(body.communication_style),
      preferred_environments: textOrClear(body.preferred_environments),
      interests: listOrClear(body.interests),
      participants_appreciate: listOrClear(body.participants_appreciate),
      boundaries_and_fit: textOrClear(body.boundaries_and_fit),
      values_tags: listOrClear(body.valuesTags),
      support_philosophy: textOrClear(body.supportPhilosophy),
      opt_in: body.optIn === undefined ? undefined : Boolean(body.optIn),
    };
    const supportingData = {
      support_areas: listOrClear(body.supportAreas),
      availability: listOrClear(body.availability),
      location_area: textOrClear(body.locationArea),
      languages: listOrClear(body.languages),
      experience_years:
        body.experienceYears === undefined
          ? undefined
          : clear(body.experienceYears)
            ? null
            : Number(body.experienceYears),
      contact_preference: textOrClear(body.contactPreference),
    };

    await prisma.$transaction(async (tx) => {
      const relational = await tx.workerRelationalProfile.upsert({
        where: { worker_id: workerId },
        create: { worker_id: workerId, ...relationalData },
        update: relationalData,
      });
      await tx.workerProfileSupportingDetails.upsert({
        where: { worker_id: workerId },
        create: { worker_id: workerId, ...supportingData },
        update: supportingData,
      });
      // Withdrawing the opt-in takes a published profile down with it —
      // "published" can never be true while "opt in" is false (R-07).
      if (relational.status === WORKER_PROFILE_STATUS.PUBLISHED && relational.opt_in === false) {
        await tx.workerRelationalProfile.update({
          where: { worker_id: workerId },
          data: { status: WORKER_PROFILE_STATUS.DRAFT, published_at: null },
        });
        await writeAudit(req, { actorId: workerId, action: 'worker_profile_unpublished', details: { reason: 'opt_out' } });
      }
    });

    res.json(new ApiResponse(200, 'profile saved', await loadOwnProfile(workerId)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * POST /worker/profile/publish — lists the profile in the directory.
 * 400 `not_ready` with the missing step keys when the relational intro or
 * the opt-in is absent. Idempotent: publishing a published profile keeps
 * its original published_at.
 */
export const publishWorkerProfile = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const current = await loadOwnProfile(workerId);
    if (!current.readiness.canPublish) {
      throw new ApiError(400, 'Your profile is not ready to publish yet.', {
        reason: 'not_ready',
        missing: current.readiness.missing,
      });
    }
    if (!current.publication.isPublished) {
      await prisma.workerRelationalProfile.update({
        where: { worker_id: workerId },
        data: { status: WORKER_PROFILE_STATUS.PUBLISHED, published_at: new Date() },
      });
      await writeAudit(req, { actorId: workerId, action: 'worker_profile_published' });
    }
    res.json(new ApiResponse(200, 'profile published', await loadOwnProfile(workerId)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/** POST /worker/profile/unpublish — removes the listing; the content stays. */
export const unpublishWorkerProfile = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const current = await loadOwnProfile(workerId);
    if (current.publication.isPublished) {
      await prisma.workerRelationalProfile.update({
        where: { worker_id: workerId },
        data: { status: WORKER_PROFILE_STATUS.DRAFT, published_at: null },
      });
      await writeAudit(req, { actorId: workerId, action: 'worker_profile_unpublished' });
    }
    res.json(new ApiResponse(200, 'profile unpublished', await loadOwnProfile(workerId)));
  } catch (error) {
    catchResponse(error, res);
  }
});
