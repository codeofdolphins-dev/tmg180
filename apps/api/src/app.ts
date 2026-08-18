import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { v1Routes } from './routes/index.js';
import { errorHandler, notFound } from './middleware/errors.js';

/**
 * The Express app, exported separately from the server so tests can mount it
 * without binding a port.
 */
export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());

  app.use(
    cors({
      // Mobile clients send no Origin — allow those through; browsers must be
      // on the allowlist.
      origin(origin, callback) {
        if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`Origin not allowed: ${origin}`));
      },
    })
  );

  app.use(express.json({ limit: '1mb' }));

  app.use('/api/v1', v1Routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
