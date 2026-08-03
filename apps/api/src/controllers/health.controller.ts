import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/** Liveness plus a real round-trip to Postgres, so a dead DB shows as 503. */
export const health = asyncHandler(async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'up' });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'down' });
  }
});
