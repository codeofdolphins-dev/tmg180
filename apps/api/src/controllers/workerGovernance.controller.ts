import {
  GOVERNANCE_GROUPS,
  GOVERNANCE_ITEMS,
  governanceItem,
  governanceItemStatus,
  governanceStanding,
  learningResource,
  validateGovernanceNote,
} from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { ApiError, ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loadCredentials, todayFrom } from './workerCredentials.controller.js';

/**
 * Governance Standing (frame 1169:3916) and one item's detail (1170:7877).
 *
 * Worker-owned throughout: every query is scoped to `req.user.id` and nothing
 * here reads or writes another worker's rows. The catalogue of items lives in
 * @tmg180/shared (GOVERNANCE_ITEMS) because it is content, not data — the
 * tables hold only what this worker did with it.
 *
 * Acknowledging is **append-only per version**, the same rule the consent and
 * snapshot layers follow: confirming writes a row for the version the worker
 * read, re-confirming the same version changes nothing, and there is no way to
 * un-acknowledge. Publishing a new version in the catalogue moves the item
 * back to "Needs review" and leaves the earlier confirmation in its history.
 *
 * Standing is a count of what is in order, never a score. The screen shows
 * "14 of 16 in order", not a grade, and the API returns nothing that could be
 * read as a rating of the worker.
 */

type AckRow = { item_key: string; item_version: string; acknowledged_at: Date };

const byItem = (rows: AckRow[]) => {
  const map = new Map<string, { version: string; acknowledgedAt: Date }[]>();
  for (const row of rows) {
    const list = map.get(row.item_key) ?? [];
    list.push({ version: row.item_version, acknowledgedAt: row.acknowledged_at });
    map.set(row.item_key, list);
  }
  return map;
};

/** The list shape — the catalogue plus this worker's standing on each item. */
async function loadItems(workerId: number) {
  const [acks, notes] = await Promise.all([
    prisma.workerGovernanceAcknowledgement.findMany({ where: { worker_id: workerId } }),
    prisma.workerGovernanceNote.findMany({
      where: { worker_id: workerId },
      select: { item_key: true, note: true },
    }),
  ]);
  const acksByItem = byItem(acks);
  const noted = new Set(notes.filter((row) => row.note?.trim()).map((row) => row.item_key));

  return GOVERNANCE_ITEMS.map((item) => ({
    key: item.key,
    group: item.group,
    title: item.title,
    summary: item.summary,
    cadence: item.cadence,
    currentVersion: item.currentVersion,
    resourceSlug: item.resourceSlug,
    hasNote: noted.has(item.key),
    ...governanceItemStatus(item, acksByItem.get(item.key) ?? []),
  }));
}

/**
 * GET /worker/governance?today=YYYY-MM-DD
 *
 * One payload for the whole screen: the items grouped as the frame groups
 * them, the credentials the renewals timeline reads, and the summary cards'
 * numbers. `today` is the browser's calendar day so the server and the screen
 * agree on what "due soon" means.
 */
export const getStanding = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const today = todayFrom(req.query as Record<string, unknown>);
    const [items, credentials] = await Promise.all([loadItems(workerId), loadCredentials(workerId, today)]);

    res.json(
      new ApiResponse(200, 'governance standing fetched', {
        today,
        groups: GOVERNANCE_GROUPS,
        items,
        credentials: credentials.credentials,
        summary: governanceStanding(items, credentials.summary),
      })
    );
  } catch (error) {
    catchResponse(error, res);
  }
});

/** The definition plus this worker's history and private note. */
async function loadItemDetail(workerId: number, key: string) {
  const item = governanceItem(key);
  if (!item) throw new ApiError(404, 'No such governance item.');

  const [acks, note] = await Promise.all([
    prisma.workerGovernanceAcknowledgement.findMany({
      where: { worker_id: workerId, item_key: key },
      orderBy: { acknowledged_at: 'desc' },
    }),
    prisma.workerGovernanceNote.findUnique({
      where: { worker_id_item_key: { worker_id: workerId, item_key: key } },
    }),
  ]);

  const rows = acks.map((row) => ({ version: row.item_version, acknowledgedAt: row.acknowledged_at }));

  // The current version always heads the history, acknowledged or not — that
  // is the "v… (Current) · Pending" line on the frame. Everything below it is
  // this worker's own past confirmations, newest first, never removed.
  const history = [
    {
      version: item.currentVersion,
      current: true,
      acknowledgedAt: rows.find((row) => row.version === item.currentVersion)?.acknowledgedAt ?? null,
    },
    ...rows
      .filter((row) => row.version !== item.currentVersion)
      .map((row) => ({ version: row.version, current: false, acknowledgedAt: row.acknowledgedAt })),
  ];

  const reading = item.resourceSlug ? learningResource(item.resourceSlug) : null;

  return {
    item: {
      key: item.key,
      group: item.group,
      title: item.title,
      summary: item.summary,
      cadence: item.cadence,
      currentVersion: item.currentVersion,
      confirmation: item.confirmation,
      overview: item.overview,
      points: item.points,
      resourceSlug: item.resourceSlug,
    },
    ...governanceItemStatus(item, rows),
    history,
    note: note?.note ?? null,
    noteUpdatedAt: note?.note ? note.updated_at : null,
    // What to read before confirming, when there is something to read.
    reading: reading
      ? { slug: reading.slug, title: reading.title, status: reading.status, kind: reading.kind }
      : null,
  };
}

/** GET /worker/governance/items/:key */
export const getItem = asyncHandler(async (req, res) => {
  try {
    const detail = await loadItemDetail(req.user!.id, String(req.params.key));
    res.json(new ApiResponse(200, 'governance item fetched', detail));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * POST /worker/governance/items/:key/acknowledge
 *
 * Records that this worker read the item's current version. Append-only:
 * `skipDuplicates` makes a repeat confirmation a no-op rather than a second
 * row or an error, and no route un-confirms one.
 */
export const acknowledgeItem = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const key = String(req.params.key);
    const item = governanceItem(key);
    if (!item) throw new ApiError(404, 'No such governance item.');

    await prisma.workerGovernanceAcknowledgement.createMany({
      data: [{ worker_id: workerId, item_key: key, item_version: item.currentVersion }],
      skipDuplicates: true,
    });

    res.json(new ApiResponse(200, 'item acknowledged', await loadItemDetail(workerId, key)));
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * PATCH /worker/governance/items/:key/note  { note }
 *
 * The worker's private reflection on an item. Not part of the
 * acknowledgement, never shown to anyone else, and clearing it (null or "")
 * empties the row rather than deleting the history of having written one.
 */
export const saveNote = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const key = String(req.params.key);
    if (!governanceItem(key)) throw new ApiError(404, 'No such governance item.');

    const body = (req.body ?? {}) as Record<string, unknown>;
    if (!('note' in body)) throw new ApiError(400, 'That note could not be saved.', { note: 'No note was sent.' });

    const errors = validateGovernanceNote(body.note);
    if (Object.keys(errors).length > 0) throw new ApiError(400, 'That note could not be saved.', errors);

    const note = body.note === null || body.note === '' ? null : (body.note as string);
    await prisma.workerGovernanceNote.upsert({
      where: { worker_id_item_key: { worker_id: workerId, item_key: key } },
      create: { worker_id: workerId, item_key: key, note },
      update: { note },
    });

    res.json(new ApiResponse(200, 'note saved', await loadItemDetail(workerId, key)));
  } catch (error) {
    catchResponse(error, res);
  }
});
