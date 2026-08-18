import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiResponse.js';

/**
 * One error envelope for every failure, the same one the controllers send:
 * { statusCode, message, data, success: false }. Throw these from a handler
 * wrapped in `asyncHandler` and `errorHandler` below turns them into that
 * shape — including the failures thrown in middleware, before any controller
 * runs, which is where the auth and role guards live.
 */

export const badRequest = (message: string, details: unknown = null) =>
  new ApiError(400, message, details);

export const unauthorized = (message = 'Authentication required.') =>
  new ApiError(401, message);

export const forbidden = (message = 'You do not have access to this record.') =>
  new ApiError(403, message);

export const notFoundError = (message = 'Not found.') =>
  new ApiError(404, message);

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(notFoundError(`No route for ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity.
  _next: NextFunction
) {
  const status = error instanceof ApiError ? error.statusCode : 500;

  if (status >= 500) {
    console.error('[api] unhandled error', error);
  }

  res.status(status).json(
    new ApiError(
      status,
      // Never leak internals to a client; 5xx detail stays in the logs.
      status >= 500 || !(error instanceof Error) ? 'Something went wrong.' : error.message,
      error instanceof ApiError ? error.data : null
    )
  );
}
