import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * The terminology registry drives every string in both clients, so it is
 * deliberately unauthenticated — the sign-in screen needs it before a token
 * exists. It contains no participant data.
 *
 * NOTE: the previous raw query selected `term_key`, `display_text` and
 * `is_active`. The DB pack defines the columns as `key`, `value` and `context`
 * with no active flag, so this follows the doc. If Deb's live table really has
 * an is_active column, the schema needs a correction — not this file.
 */
export const listTerminology = asyncHandler(async (_req, res) => {
  const rows = await prisma.terminologyRegistry.findMany({
    select: { key: true, value: true },
  });

  res.set('Cache-Control', 'public, max-age=300');
  res.json(Object.fromEntries(rows.map((row) => [row.key, row.value])));
});
