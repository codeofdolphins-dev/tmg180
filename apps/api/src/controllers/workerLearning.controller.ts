import {
  LEARNING_LIBRARY_TABS,
  LEARNING_MODULES,
  LEARNING_RESOURCES,
  LEARNING_RESOURCE_STATUS,
  learningResource,
  learningSummary,
  relatedResources,
  validateLearningProgress,
} from '@tmg180/shared';
import { prisma } from '../config/prisma.js';
import { ApiError, ApiResponse, catchResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Learning Hub (frame 1169:3676) and one reading (1170:8551).
 *
 * The catalogue is content and lives in @tmg180/shared (LEARNING_RESOURCES);
 * what is stored here is only this worker's own relationship with it — opened,
 * saved for later, marked as read. Worker-owned, so every query is scoped to
 * `req.user.id`, and there is nothing participant-owned anywhere near it.
 *
 * A reading whose text is still to come (`awaiting_content` — the four
 * canonical manuals are Sue's to write) is listed, because the frame lists it,
 * but cannot be opened, saved or marked as read. Nothing is invented in its
 * place.
 */

type ProgressRow = {
  resource_slug: string;
  opened_at: Date | null;
  open_count: number;
  saved_at: Date | null;
  completed_at: Date | null;
};

const toProgress = (row: ProgressRow | undefined) => ({
  openedAt: row?.opened_at ?? null,
  openCount: row?.open_count ?? 0,
  savedAt: row?.saved_at ?? null,
  completedAt: row?.completed_at ?? null,
});

/** The list carries everything except `body` — one reading's text is its own request. */
const toListItem = (
  resource: (typeof LEARNING_RESOURCES)[number],
  progress: ReturnType<typeof toProgress>
) => ({
  slug: resource.slug,
  moduleKey: resource.moduleKey,
  kind: resource.kind,
  library: resource.library,
  status: resource.status,
  title: resource.title,
  summary: resource.summary,
  readMinutes: resource.readMinutes,
  updatedAt: resource.updatedAt,
  action: resource.action,
  progress,
});

async function progressByslug(workerId: number) {
  const rows = await prisma.workerLearningProgress.findMany({ where: { worker_id: workerId } });
  return new Map(rows.map((row) => [row.resource_slug, row]));
}

/**
 * GET /worker/learning
 *
 * The whole hub in one payload: the modules the frame's cards are built from,
 * the two library tabs, and every reading with this worker's progress on it.
 */
export const listLearning = asyncHandler(async (req, res) => {
  try {
    const rows = await progressByslug(req.user!.id);
    const resources = LEARNING_RESOURCES.map((resource) =>
      toListItem(resource, toProgress(rows.get(resource.slug)))
    );

    res.json(
      new ApiResponse(200, 'learning hub fetched', {
        modules: LEARNING_MODULES,
        libraries: LEARNING_LIBRARY_TABS,
        resources,
        summary: learningSummary(resources),
      })
    );
  } catch (error) {
    catchResponse(error, res);
  }
});

/** Both the reading and the fact this worker cannot open it yet. */
function readableOr404(slug: string) {
  const resource = learningResource(slug);
  if (!resource) throw new ApiError(404, 'No such reading.');
  if (resource.status !== LEARNING_RESOURCE_STATUS.PUBLISHED) {
    throw new ApiError(409, 'This reading has not been published yet.');
  }
  return resource;
}

/**
 * GET /worker/learning/resources/:slug
 *
 * Opening a reading records that it was opened, the way viewing a snapshot
 * records a view — the worker's own reading history is the only thing it
 * feeds, and it is theirs.
 */
export const getResource = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const slug = String(req.params.slug);
    const resource = readableOr404(slug);

    const row = await prisma.workerLearningProgress.upsert({
      where: { worker_id_resource_slug: { worker_id: workerId, resource_slug: slug } },
      create: { worker_id: workerId, resource_slug: slug, opened_at: new Date(), open_count: 1 },
      update: { opened_at: new Date(), open_count: { increment: 1 } },
    });

    res.json(
      new ApiResponse(200, 'reading fetched', {
        resource: { ...toListItem(resource, toProgress(row)), body: resource.body },
        related: relatedResources(slug).map((other) => ({
          slug: other.slug,
          kind: other.kind,
          title: other.title,
          summary: other.summary,
          readMinutes: other.readMinutes,
        })),
      })
    );
  } catch (error) {
    catchResponse(error, res);
  }
});

/**
 * PATCH /worker/learning/resources/:slug  { saved?, completed? }
 *
 * Both are the worker's own bookkeeping and both can be undone — unlike a
 * governance acknowledgement, marking a reading as read is a bookmark, not a
 * statement of record.
 */
export const updateProgress = asyncHandler(async (req, res) => {
  try {
    const workerId = req.user!.id;
    const slug = String(req.params.slug);
    readableOr404(slug);

    const body = (req.body ?? {}) as { saved?: unknown; completed?: unknown };
    const errors = validateLearningProgress(body);
    if (Object.keys(errors).length > 0) {
      throw new ApiError(400, 'That could not be saved.', errors);
    }

    const now = new Date();
    const data = {
      saved_at: body.saved === undefined ? undefined : body.saved ? now : null,
      completed_at: body.completed === undefined ? undefined : body.completed ? now : null,
    };

    const row = await prisma.workerLearningProgress.upsert({
      where: { worker_id_resource_slug: { worker_id: workerId, resource_slug: slug } },
      create: {
        worker_id: workerId,
        resource_slug: slug,
        saved_at: data.saved_at ?? null,
        completed_at: data.completed_at ?? null,
      },
      update: data,
    });

    res.json(new ApiResponse(200, 'reading updated', { slug, progress: toProgress(row) }));
  } catch (error) {
    catchResponse(error, res);
  }
});
