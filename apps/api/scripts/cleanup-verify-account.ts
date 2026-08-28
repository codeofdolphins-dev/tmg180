import { prisma } from '../src/config/prisma.js';

/**
 * Removes a throw-away verification account and every row it owns.
 *
 * Verifying a participant feature end to end means creating a real account
 * through the real API; this is the other half of that, so the dev database
 * never accumulates accounts nobody made.
 *
 *   npx tsx --env-file=.env scripts/cleanup-verify-account.ts <email>
 */
async function main() {
  const email = process.argv[2];
  if (!email) throw new Error('Pass the account email.');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('No such account —', email);
    return;
  }

  const id = user.id;
  const removed = {
    shareLinks: (await prisma.snapshotShareLink.deleteMany({ where: { participant_id: id } })).count,
    concernResponses: (await prisma.concernResponse.deleteMany({ where: { author_id: id } })).count,
    concerns: (await prisma.concern.deleteMany({ where: { raised_by: id } })).count,
    snapshotAddenda: (await prisma.snapshotAddendum.deleteMany({ where: { added_by: id } })).count,
    snapshots: (await prisma.monthlySnapshot.deleteMany({ where: { participant_id: id } })).count,
    checkIns: (await prisma.participantCheckin.deleteMany({ where: { participant_id: id } })).count,
    dailyNotes: (await prisma.dailyNoteStructured.deleteMany({ where: { author_id: id } })).count,
    goals: (await prisma.participantGoal.deleteMany({ where: { participant_id: id } })).count,
    auditLog: (await prisma.auditLog.deleteMany({ where: { actor_id: id } })).count,
    refreshTokens: (await prisma.refreshToken.deleteMany({ where: { user_id: id } })).count,
    consents: (await prisma.consent.deleteMany({ where: { participant_id: id } })).count,
    privacySettings: (
      await prisma.participantPrivacySettings.deleteMany({ where: { participant_id: id } })
    ).count,
    profile: (await prisma.participantProfile.deleteMany({ where: { participant_id: id } })).count,
  };

  await prisma.user.delete({ where: { id } });
  console.log('Removed account', id, email, JSON.stringify(removed));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
