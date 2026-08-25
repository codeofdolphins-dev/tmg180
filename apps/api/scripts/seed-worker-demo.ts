/**
 * Dev-only: give a worker account something to look at on the dashboard while
 * the worker log form is unbuilt — an active consent from a demo participant,
 * a draft log for today, a submitted one from yesterday with an addendum, one
 * older submitted log, and three goals on the demo participant's profile so the
 * log form has something to link to. Re-runnable: it only adds rows it does
 * not find.
 *
 *   cd apps/api && pnpm exec tsx --env-file=.env scripts/seed-worker-demo.ts sam.worker@tmg180.test
 */
import { CONSENT_STATUS, DAILY_LOG_AUTHOR_ROLE, DAILY_LOG_STATUS } from '@tmg180/shared';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/config/prisma.js';

const workerEmail = process.argv[2];
if (!workerEmail) {
  console.error('usage: seed-worker-demo.ts <worker email>');
  process.exit(1);
}

const day = (offset: number) => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + offset);
  return d;
};
const clock = (hhmm: string) => new Date(`1970-01-01T${hhmm}:00Z`);

async function main() {
  const worker = await prisma.user.findUnique({ where: { email: workerEmail.toLowerCase() } });
  if (!worker || !worker.roles.includes('worker')) throw new Error(`${workerEmail} is not a worker account`);

  const participantEmail = 'demo.participant@tmg180.test';
  const participant =
    (await prisma.user.findUnique({ where: { email: participantEmail } })) ??
    (await prisma.user.create({
      data: {
        email: participantEmail,
        full_name: 'Sarah Jenkins',
        password_hash: await bcrypt.hash('Participant1!', 12),
        roles: ['participant'],
      },
    }));

  // Goals come from the participant's My Goals profile answers — give the demo
  // participant a few so a worker log has something to link to.
  const profile = await prisma.participantProfile.upsert({
    where: { participant_id: participant.id },
    create: { participant_id: participant.id },
    update: {},
  });
  const section = await prisma.participantProfileSection.upsert({
    where: { profile_id_section_key: { profile_id: profile.id, section_key: 'goals' } },
    create: { profile_id: profile.id, section_key: 'goals', status: 'in_progress' },
    update: {},
  });
  const answers = await prisma.participantProfileAnswer.count({ where: { section_id: section.id } });
  if (answers === 0) {
    await prisma.participantProfileAnswer.createMany({
      data: [
        { section_id: section.id, question_key: 'primary_aspiration', value: 'Get out into the community more' },
        {
          section_id: section.id,
          question_key: 'goal_steps',
          value: [
            { text: 'Catch the bus on my own', done: false },
            { text: 'Join the Tuesday art group', done: false },
          ],
        },
      ],
    });
  }

  const existingConsent = await prisma.consent.findFirst({
    where: { participant_id: participant.id, worker_id: worker.id, status: CONSENT_STATUS.ACTIVE },
  });
  if (!existingConsent) {
    await prisma.consent.create({
      data: {
        participant_id: participant.id,
        worker_id: worker.id,
        consent_type: 'worker_access',
        status: CONSENT_STATUS.ACTIVE,
        granted_at: new Date(),
        can_add_daily_note: true,
        can_view_snapshot: true,
      },
    });
  }

  const existing = await prisma.dailyNoteStructured.count({
    where: { author_id: worker.id, author_role: DAILY_LOG_AUTHOR_ROLE.WORKER },
  });
  if (existing > 0) {
    console.log(`${workerEmail} already has ${existing} worker logs — nothing added.`);
    return;
  }

  const base = {
    participant_id: participant.id,
    author_id: worker.id,
    author_role: DAILY_LOG_AUTHOR_ROLE.WORKER,
    worker_id: worker.id,
  };
  await prisma.dailyNoteStructured.create({
    data: {
      ...base,
      session_date: day(0),
      start_time: clock('09:00'),
      end_time: clock('11:00'),
      service_type: 'In-home support',
      domain_tags: ['daily_living', 'communication'],
      status: DAILY_LOG_STATUS.DRAFT,
    },
  });
  const submitted = await prisma.dailyNoteStructured.create({
    data: {
      ...base,
      session_date: day(-1),
      start_time: clock('14:00'),
      end_time: clock('15:30'),
      service_type: 'Community access',
      goal_ids: [],
      domain_tags: ['social_community'],
      status: DAILY_LOG_STATUS.SUBMITTED,
      submitted_at: new Date(),
      is_locked: true,
    },
  });
  await prisma.dailyNoteAddendum.create({
    data: {
      note_id: submitted.id,
      added_by: worker.id,
      added_by_role: 'worker',
      addendum_text: 'Added the bus route we used.',
      reason: 'Additional context',
    },
  });
  await prisma.dailyNoteStructured.create({
    data: {
      ...base,
      session_date: day(-4),
      start_time: clock('10:00'),
      end_time: clock('12:00'),
      service_type: 'Goal planning',
      domain_tags: ['learning_employment'],
      status: DAILY_LOG_STATUS.SUBMITTED,
      submitted_at: new Date(),
      is_locked: true,
    },
  });
  console.log(`Seeded 3 worker logs + an active consent for ${workerEmail} (participant ${participantEmail}).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
