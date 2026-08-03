import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiResponse.js';

/**
 * One error envelope for every failure: { error: { code, message, details } }.
 * @tmg180/api-client parses exactly this shape, so web and mobile get
 * identical error handling for free.
 *
 * Throw these from a controller wrapped in `asyncHandler` — it forwards the
 * rejection to `errorHandler` below.
 */

const CODE_BY_STATUS: Record<number, string> = {
  400: 'bad_request',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not_found',
};

export const badRequest = (message: string, details: unknown = null) =>
  new ApiError(400, message, details, [], 'bad_request');

export const unauthorized = (message = 'Authentication required.') =>
  new ApiError(401, message, null, [], 'unauthorized');

export const forbidden = (message = 'You do not have access to this record.') =>
  new ApiError(403, message, null, [], 'forbidden');

export const notFoundError = (message = 'Not found.') =>
  new ApiError(404, message, null, [], 'not_found');

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

  res.status(status).json({
    error: {
      code:
        (error instanceof ApiError ? error.code : undefined) ??
        CODE_BY_STATUS[status] ??
        'internal_error',
      // Never leak internals to a client; 5xx detail stays in the logs.
      message:
        status >= 500 || !(error instanceof Error) ? 'Something went wrong.' : error.message,
      details: error instanceof ApiError ? (error.data ?? undefined) : undefined,
    },
  });
}
