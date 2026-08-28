/**
 * Moves stored answers to the section that now owns them.
 *
 * The Personal Profile went from eleven sections to the fourteen of Sue's
 * "PERSONAL PROFILE IMPORTANT CHANGES" letter, which re-homes three groups of
 * the Support Needs Tool v4: the household group and "My Home and Environment"
 * into the new Home Environment section, and the closing consent/ownership
 * block into Review & Submit. An answer is stored against a section row, so
 * without this it would still be attached to the section it used to live in
 * and would not render — the record must move with its question, never be
 * dropped (Longitudinal spec §18: preserve, do not delete).
 *
 * Re-runnable: an answer already sitting in the right section is left alone,
 * and a question that never had an answer costs nothing.
 *
 *   cd apps/api && pnpm exec tsx --env-file=.env scripts/remap-profile-sections.ts [--dry]
 */
import { PROFILE_SECTION_STATUS, isSectionComplete, profileSection } from '@tmg180/shared';
import { prisma } from '../src/config/prisma.js';

const DRY = process.argv.includes('--dry');

/** question_key -> the section it belongs to now. */
const MOVES: Record<string, { from: string; to: string }> = {
  documentation_choice: { from: 'overview', to: 'review_submit' },
  household_impacts: { from: 'daily_living', to: 'home_environment' },
  household_support: { from: 'daily_living', to: 'home_environment' },
  household_notes: { from: 'daily_living', to: 'home_environment' },
  home_environment: { from: 'safety_preferences', to: 'home_environment' },
  home_environment_notes: { from: 'safety_preferences', to: 'home_environment' },
};

async function main() {
  const profiles = await prisma.participantProfile.findMany({
    select: { id: true, participant_id: true },
  });
  let moved = 0;
  const touchedSections = new Set<number>();

  for (const profile of profiles) {
    for (const [questionKey, move] of Object.entries(MOVES)) {
      const answer = await prisma.participantProfileAnswer.findFirst({
        where: { question_key: questionKey, section: { profile_id: profile.id, section_key: move.from } },
        select: { id: true, value: true, visibility: true },
      });
      if (!answer) continue;

      if (DRY) {
        console.log(`would move ${questionKey}: ${move.from} → ${move.to} (profile ${profile.id})`);
        moved += 1;
        continue;
      }

      const target = await prisma.participantProfileSection.upsert({
        where: { profile_id_section_key: { profile_id: profile.id, section_key: move.to } },
        create: {
          profile_id: profile.id,
          section_key: move.to,
          status: PROFILE_SECTION_STATUS.IN_PROGRESS,
        },
        update: {},
        select: { id: true },
      });

      // Move the row itself, so its timestamps and visibility travel with it.
      await prisma.participantProfileAnswer.update({
        where: { id: answer.id },
        data: { section_id: target.id },
      });
      touchedSections.add(target.id);
      moved += 1;
      console.log(`moved ${questionKey}: ${move.from} → ${move.to} (profile ${profile.id})`);
    }
  }

  // Re-derive status for every section an answer landed in or left.
  if (!DRY) {
    const sections = await prisma.participantProfileSection.findMany({
      where: { section_key: { in: [...new Set(Object.values(MOVES).flatMap((m) => [m.from, m.to])) ] } },
      include: { answers: { select: { question_key: true, value: true } } },
    });
    for (const row of sections) {
      const def = profileSection(row.section_key);
      if (!def) continue;
      const answers = Object.fromEntries(row.answers.map((a) => [a.question_key, a.value]));
      const complete = isSectionComplete(def, answers);
      const status = complete
        ? PROFILE_SECTION_STATUS.COMPLETE
        : row.answers.length > 0
          ? PROFILE_SECTION_STATUS.IN_PROGRESS
          : PROFILE_SECTION_STATUS.NOT_STARTED;
      if (status !== row.status) {
        await prisma.participantProfileSection.update({ where: { id: row.id }, data: { status } });
        console.log(`  status ${row.section_key}: ${row.status} → ${status}`);
      }
    }
  }

  console.log(`${DRY ? 'would move' : 'moved'} ${moved} answer${moved === 1 ? '' : 's'} across ${profiles.length} profile${profiles.length === 1 ? '' : 's'}.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
