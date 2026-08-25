/**
 * Dev-only: hard-delete a user and everything that references them.
 *
 * Why this script exists: nearly every foreign key into `tmg_users` is
 * ON DELETE RESTRICT (Prisma's default for a required relation), so a plain
 * `DELETE FROM tmg_users` fails on the first dependent row. That default is
 * deliberate for this product — the evidence chain is append-only and
 * participant-owned, and deletion is meant to run through the reviewed
 * `tmg_deletion_requests` workflow, not a raw delete. This is the *dev*
 * escape hatch for test accounts, and it refuses to run in production.
 *
 * Deletes in foreign-key order inside one transaction: either the whole user
 * disappears or nothing does.
 *
 *   cd apps/api && pnpm exec tsx --env-file=.env scripts/delete-user.ts <email|id> [--dry-run]
 *
 * Records where this user is the *worker* on someone else's evidence (daily
 * logs, invoices, consents) are deleted too — that is the point of a hard
 * delete, but it means another participant's history loses those rows. The
 * dry run prints the counts first; read them before confirming.
 */
import { prisma } from '../src/config/prisma.js';
import { env } from '../src/config/env.js';

const target = process.argv[2];
const dryRun = process.argv.includes('--dry-run');

if (!target) {
  console.error('usage: delete-user.ts <email|id> [--dry-run]');
  process.exit(1);
}
if (env.isProduction) {
  console.error('Refusing to run in production — use the deletion-request workflow.');
  process.exit(1);
}

const asId = Number(target);
const where = Number.isInteger(asId) && asId > 0 ? { id: asId } : { email: target.toLowerCase() };

async function main() {
  const user = await prisma.user.findUnique({
    where,
    select: { id: true, email: true, full_name: true, roles: true },
  });
  if (!user) {
    console.error(`No user matching "${target}".`);
    process.exitCode = 1;
    return;
  }

  const id = user.id;
  console.log(`${user.full_name} <${user.email}>  id=${id}  roles=[${user.roles.join(', ')}]`);

  // What references this user, in the order the rows have to go. Each entry is
  // [label, count(), delete()] so a dry run and a real run read the same list.
  const profile = await prisma.participantProfile.findUnique({
    where: { participant_id: id },
    select: { id: true },
  });
  const sectionIds = profile
    ? (
        await prisma.participantProfileSection.findMany({
          where: { profile_id: profile.id },
          select: { id: true },
        })
      ).map((s) => s.id)
    : [];

  const steps: Array<{ label: string; count: () => Promise<number>; run: () => Promise<unknown> }> = [
    // Personal Profile: answers -> sections -> profile.
    {
      label: 'profile answers',
      count: () => prisma.participantProfileAnswer.count({ where: { section_id: { in: sectionIds } } }),
      run: () => prisma.participantProfileAnswer.deleteMany({ where: { section_id: { in: sectionIds } } }),
    },
    {
      label: 'profile sections',
      count: () => prisma.participantProfileSection.count({ where: { id: { in: sectionIds } } }),
      run: () => prisma.participantProfileSection.deleteMany({ where: { id: { in: sectionIds } } }),
    },
    {
      label: 'profile',
      count: () => prisma.participantProfile.count({ where: { participant_id: id } }),
      run: () => prisma.participantProfile.deleteMany({ where: { participant_id: id } }),
    },

    // Evidence chain: addenda -> parent records.
    {
      label: 'snapshot addenda',
      count: () =>
        prisma.snapshotAddendum.count({
          where: { OR: [{ added_by: id }, { snapshot: { participant_id: id } }] },
        }),
      run: () =>
        prisma.snapshotAddendum.deleteMany({
          where: { OR: [{ added_by: id }, { snapshot: { participant_id: id } }] },
        }),
    },
    {
      label: 'monthly snapshots',
      count: () => prisma.monthlySnapshot.count({ where: { participant_id: id } }),
      run: () => prisma.monthlySnapshot.deleteMany({ where: { participant_id: id } }),
    },
    {
      label: 'daily log addenda',
      count: () =>
        prisma.dailyNoteAddendum.count({
          where: {
            OR: [
              { added_by: id },
              { note: { OR: [{ participant_id: id }, { worker_id: id }, { author_id: id }] } },
            ],
          },
        }),
      run: () =>
        prisma.dailyNoteAddendum.deleteMany({
          where: {
            OR: [
              { added_by: id },
              { note: { OR: [{ participant_id: id }, { worker_id: id }, { author_id: id }] } },
            ],
          },
        }),
    },

    // Invoices reference daily logs, so they clear before the logs do.
    {
      label: 'invoice audit entries',
      count: () =>
        prisma.invoiceAudit.count({
          where: {
            OR: [
              { changed_by: id },
              { invoice: { OR: [{ participant_id: id }, { worker_id: id }] } },
            ],
          },
        }),
      run: () =>
        prisma.invoiceAudit.deleteMany({
          where: {
            OR: [
              { changed_by: id },
              { invoice: { OR: [{ participant_id: id }, { worker_id: id }] } },
            ],
          },
        }),
    },
    {
      label: 'invoices',
      count: () =>
        prisma.invoice.count({ where: { OR: [{ participant_id: id }, { worker_id: id }] } }),
      run: () =>
        prisma.invoice.deleteMany({ where: { OR: [{ participant_id: id }, { worker_id: id }] } }),
    },

    {
      label: 'daily logs',
      count: () =>
        prisma.dailyNoteStructured.count({
          where: { OR: [{ participant_id: id }, { worker_id: id }, { author_id: id }] },
        }),
      run: () =>
        prisma.dailyNoteStructured.deleteMany({
          where: { OR: [{ participant_id: id }, { worker_id: id }, { author_id: id }] },
        }),
    },
    {
      label: 'private notes',
      count: () =>
        prisma.dailyNotePrivate.count({ where: { OR: [{ participant_id: id }, { worker_id: id }] } }),
      run: () =>
        prisma.dailyNotePrivate.deleteMany({
          where: { OR: [{ participant_id: id }, { worker_id: id }] },
        }),
    },

    // External worker invitations own their notes.
    {
      label: 'external support notes',
      count: () => prisma.externalSupportNote.count({ where: { participant_id: id } }),
      run: () => prisma.externalSupportNote.deleteMany({ where: { participant_id: id } }),
    },
    {
      label: 'external worker invitations',
      count: () =>
        prisma.externalWorkerInvitation.count({
          where: { OR: [{ participant_id: id }, { revoked_by: id }] },
        }),
      run: () =>
        prisma.externalWorkerInvitation.deleteMany({
          where: { OR: [{ participant_id: id }, { revoked_by: id }] },
        }),
    },

    // Goals point at the intake, so goals clear first.
    {
      label: 'goals',
      count: () => prisma.participantGoal.count({ where: { participant_id: id } }),
      run: () => prisma.participantGoal.deleteMany({ where: { participant_id: id } }),
    },
    {
      label: 'intake records',
      count: () => prisma.fcaIntake.count({ where: { participant_id: id } }),
      run: () => prisma.fcaIntake.deleteMany({ where: { participant_id: id } }),
    },

    {
      label: 'consents',
      count: () =>
        prisma.consent.count({ where: { OR: [{ participant_id: id }, { worker_id: id }] } }),
      run: () =>
        prisma.consent.deleteMany({ where: { OR: [{ participant_id: id }, { worker_id: id }] } }),
    },
    {
      label: 'check-ins',
      count: () => prisma.participantCheckin.count({ where: { participant_id: id } }),
      run: () => prisma.participantCheckin.deleteMany({ where: { participant_id: id } }),
    },
    {
      label: 'notifications',
      count: () => prisma.notification.count({ where: { recipient_id: id } }),
      run: () => prisma.notification.deleteMany({ where: { recipient_id: id } }),
    },
    {
      label: 'privacy settings',
      count: () => prisma.participantPrivacySettings.count({ where: { participant_id: id } }),
      run: () => prisma.participantPrivacySettings.deleteMany({ where: { participant_id: id } }),
    },
    {
      label: 'session preferences',
      count: () => prisma.participantSessionPreferences.count({ where: { participant_id: id } }),
      run: () => prisma.participantSessionPreferences.deleteMany({ where: { participant_id: id } }),
    },
    {
      label: 'deletion requests',
      count: () =>
        prisma.deletionRequest.count({
          where: { OR: [{ participant_id: id }, { processed_by: id }] },
        }),
      run: () =>
        prisma.deletionRequest.deleteMany({
          where: { OR: [{ participant_id: id }, { processed_by: id }] },
        }),
    },

    // Worker-side records.
    {
      label: 'worker credentials',
      count: () => prisma.workerCredential.count({ where: { worker_id: id } }),
      run: () => prisma.workerCredential.deleteMany({ where: { worker_id: id } }),
    },
    {
      label: 'governance acknowledgements',
      count: () => prisma.workerGovernanceAcknowledgement.count({ where: { worker_id: id } }),
      run: () => prisma.workerGovernanceAcknowledgement.deleteMany({ where: { worker_id: id } }),
    },
    {
      label: 'governance notes',
      count: () => prisma.workerGovernanceNote.count({ where: { worker_id: id } }),
      run: () => prisma.workerGovernanceNote.deleteMany({ where: { worker_id: id } }),
    },
    {
      label: 'learning progress',
      count: () => prisma.workerLearningProgress.count({ where: { worker_id: id } }),
      run: () => prisma.workerLearningProgress.deleteMany({ where: { worker_id: id } }),
    },
    {
      label: 'worker supporting details',
      count: () => prisma.workerProfileSupportingDetails.count({ where: { worker_id: id } }),
      run: () => prisma.workerProfileSupportingDetails.deleteMany({ where: { worker_id: id } }),
    },
    {
      label: 'worker relational profile',
      count: () => prisma.workerRelationalProfile.count({ where: { worker_id: id } }),
      run: () => prisma.workerRelationalProfile.deleteMany({ where: { worker_id: id } }),
    },

    // Refresh tokens cascade on their own; audit rows null their actor.
    {
      label: 'refresh tokens',
      count: () => prisma.refreshToken.count({ where: { user_id: id } }),
      run: () => prisma.refreshToken.deleteMany({ where: { user_id: id } }),
    },
  ];

  console.log('\nDependent rows:');
  let total = 0;
  for (const step of steps) {
    const n = await step.count();
    total += n;
    if (n > 0) console.log(`  ${String(n).padStart(4)}  ${step.label}`);
  }
  const auditRows = await prisma.auditLog.count({ where: { actor_id: id } });
  if (auditRows > 0) console.log(`  ${String(auditRows).padStart(4)}  audit entries (actor set to null, kept)`);
  if (total === 0) console.log('  none');

  if (dryRun) {
    console.log(`\nDry run — nothing deleted. ${total} row(s) would go, plus the user.`);
    return;
  }

  await prisma.$transaction(async () => {
    for (const step of steps) await step.run();
    await prisma.user.delete({ where: { id } });
  });

  console.log(`\n✓ Deleted ${user.email} and ${total} dependent row(s).`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
