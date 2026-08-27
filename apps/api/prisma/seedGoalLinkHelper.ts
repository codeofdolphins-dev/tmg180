/**
 * Loads the Goal Link Helper reference table (`tmg_goal_link_helper`) from the
 * shared contract — the pack's own seed rows, verbatim
 * (TMG180_Goal_Link_Helper_schema_and_seed_postgres_v1.sql). Re-runnable: rows
 * are upserted by support_domain_code, matching the pack's ON CONFLICT rule.
 *
 * Run on its own:  cd apps/api && pnpm exec tsx --env-file=.env prisma/seedGoalLinkHelper.ts
 * Also runs as part of `pnpm db:seed`.
 */
import { GOAL_LINK_HELPER } from '@tmg180/shared';
import { prisma } from '../src/config/prisma.js';

export async function seedGoalLinkHelper() {
  for (const entry of GOAL_LINK_HELPER) {
    const data = {
      ndis_support_domain: entry.domain,
      tmg_functional_grouping: entry.grouping,
      ndis_bucket_default: entry.bucketDefault,
      includes_examples: entry.examples,
      common_goal_links_plain: entry.goalLinks,
      functional_barrier_plain: entry.barrier,
      rn_rationale_tags: entry.rationaleTags.join(';'),
    };
    await prisma.goalLinkHelper.upsert({
      where: { support_domain_code: entry.code },
      create: { support_domain_code: entry.code, ...data },
      update: data,
    });
  }
  console.log(`✓ Goal Link Helper table: ${GOAL_LINK_HELPER.length} rows in place.`);
}

const runDirectly = process.argv[1]?.replace(/\\/g, '/').endsWith('prisma/seedGoalLinkHelper.ts');
if (runDirectly) {
  seedGoalLinkHelper()
    .catch((error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
