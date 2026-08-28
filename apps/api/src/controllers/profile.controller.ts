import {
  PROFILE_SECTION_STATUS,
  PROFILE_SECTIONS,
  PROFILE_TOTAL_SECTIONS,
  isEmptyAnswer,
  isSectionComplete,
  profileSection,
  validateSectionAnswers,
  validateSectionVisibility,
  type ProfileAnswerValue,
} from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import type { Prisma } from '../generated/prisma/client.js';
import { badRequest, notFoundError, unauthorized } from '../middleware/errors.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { GOALS_SECTION_KEY, syncParticipantGoals } from './goals.controller.js';

/**
 * The participant Personal Profile (Final Override P1-01..03).
 *
 * Two endpoints: read the whole profile, save one section. Every save upserts
 * the answers, recomputes that section's status and the profile's progress in
 * the same transaction, so the hub's counters can never disagree with the
 * answers. Always scoped to req.user.id — a participant can only ever touch
 * their own profile, so no id is accepted from the client.
 */

const profileInclude = {
  sections: { include: { answers: true } },
} as const;

type LoadedProfile = Prisma.ParticipantProfileGetPayload<{ include: typeof profileInclude }>;

/** Wire shape: sections keyed by section_key, answers keyed by question_key. */
function toPayload(profile: LoadedProfile) {
  const sections: Record<string, object> = {};
  for (const section of profile.sections) {
    sections[section.section_key] = {
      status: section.status,
      completedAt: section.completed_at,
      answers: Object.fromEntries(
        section.answers.map((answer) => [answer.question_key, answer.value])
      ),
      // P1-03: every answer carries its own visibility, private by default.
      visibility: Object.fromEntries(
        section.answers.map((answer) => [answer.question_key, answer.visibility])
      ),
    };
  }
  return {
    status: profile.status,
    lastSectionKey: profile.last_section_key,
    completedSections: profile.completed_sections,
    totalSections: profile.total_sections,
    sections,
  };
}

const loadProfile = (participantId: number) =>
  prisma.participantProfile.findUnique({
    where: { participant_id: participantId },
    include: profileInclude,
  });

/** GET /participant/profile — creates the row on first visit (P1-01: one living profile). */
export const getProfile = asyncHandler(async (req, res) => {
  if (!req.user) throw unauthorized();

  // Upsert with an empty update: concurrent first visits both land safely.
  await prisma.participantProfile.upsert({
    where: { participant_id: req.user.id },
    create: { participant_id: req.user.id, total_sections: PROFILE_TOTAL_SECTIONS },
    update: { total_sections: PROFILE_TOTAL_SECTIONS },
    select: { id: true },
  });

  const profile = await loadProfile(req.user.id);
  res.json(toPayload(profile!));
});

/**
 * PATCH /participant/profile/sections/:sectionKey  body: { answers: {...} }
 *
 * Partial saves are the norm — Save Draft and Save & Continue both land here.
 * Validation never blocks a draft: only malformed values are rejected;
 * completeness merely decides the section's status. Empty values delete the
 * answer row so clearing a field works.
 */
export const saveSection = asyncHandler(async (req, res) => {
  if (!req.user) throw unauthorized();
  const participantId = req.user.id;

  const section = profileSection(req.params.sectionKey as string);
  if (!section) throw notFoundError('No such profile section.');

  const { answers, visibility } = (req.body ?? {}) as {
    answers?: Record<string, ProfileAnswerValue>;
    visibility?: Record<string, string>;
  };
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    throw badRequest('An answers object is required.');
  }
  if (visibility !== undefined && (typeof visibility !== 'object' || visibility === null || Array.isArray(visibility))) {
    throw badRequest('Visibility must be an object of question keys.');
  }

  const errors = {
    ...validateSectionAnswers(section, answers),
    ...validateSectionVisibility(section, visibility ?? {}),
  };
  if (Object.keys(errors).length > 0) {
    throw badRequest('Some answers are invalid.', errors);
  }

  await prisma.$transaction(async (tx) => {
    const profile = await tx.participantProfile.upsert({
      where: { participant_id: participantId },
      create: { participant_id: participantId, total_sections: PROFILE_TOTAL_SECTIONS },
      update: { total_sections: PROFILE_TOTAL_SECTIONS },
      select: { id: true },
    });

    const sectionRow = await tx.participantProfileSection.upsert({
      where: { profile_id_section_key: { profile_id: profile.id, section_key: section.key } },
      create: {
        profile_id: profile.id,
        section_key: section.key,
        status: PROFILE_SECTION_STATUS.IN_PROGRESS,
      },
      update: {},
    });

    for (const [questionKey, value] of Object.entries(answers)) {
      if (isEmptyAnswer(value)) {
        await tx.participantProfileAnswer.deleteMany({
          where: { section_id: sectionRow.id, question_key: questionKey },
        });
      } else {
        // Visibility rides with the answer it belongs to: an answer that is
        // being cleared has no visibility to keep, and a visibility with no
        // answer behind it has nothing to protect.
        const chosen = visibility?.[questionKey];
        await tx.participantProfileAnswer.upsert({
          where: {
            section_id_question_key: { section_id: sectionRow.id, question_key: questionKey },
          },
          create: {
            section_id: sectionRow.id,
            question_key: questionKey,
            value,
            ...(chosen ? { visibility: chosen } : {}),
          },
          update: { value, ...(chosen ? { visibility: chosen } : {}) },
        });
      }
    }

    // Recompute from what is actually stored, not from this request's payload.
    const stored = await tx.participantProfileAnswer.findMany({
      where: { section_id: sectionRow.id },
      select: { question_key: true, value: true },
    });
    const answerMap = Object.fromEntries(stored.map((a) => [a.question_key, a.value]));

    // Sticky: a complete section never demotes (Jiten, 2026-08-04).
    const complete =
      sectionRow.status === PROFILE_SECTION_STATUS.COMPLETE ||
      isSectionComplete(section, answerMap);

    await tx.participantProfileSection.update({
      where: { id: sectionRow.id },
      data: {
        status: complete ? PROFILE_SECTION_STATUS.COMPLETE : PROFILE_SECTION_STATUS.IN_PROGRESS,
        completed_at: sectionRow.completed_at ?? (complete ? new Date() : null),
      },
    });

    // Only count sections that still exist in the contract — rows saved under
    // a since-retired section key (pre-Final-Override) must not inflate progress.
    const completedCount = await tx.participantProfileSection.count({
      where: {
        profile_id: profile.id,
        status: PROFILE_SECTION_STATUS.COMPLETE,
        section_key: { in: PROFILE_SECTIONS.map((s) => s.key) },
      },
    });

    await tx.participantProfile.update({
      where: { id: profile.id },
      data: {
        completed_sections: completedCount,
        last_section_key: section.key,
        status: completedCount >= PROFILE_TOTAL_SECTIONS ? 'complete' : 'in_progress',
      },
    });
  });

  // Goals are rows the evidence chain points at (logs link to them), derived
  // from this section. Derive them on save, not only on the next read — a
  // worker may already be on the log form waiting for them.
  if (section.key === GOALS_SECTION_KEY) await syncParticipantGoals(participantId);

  const profile = await loadProfile(participantId);
  res.json(toPayload(profile!));
});
