import type { Context, Next } from 'hono';
import { logger as appLogger } from '@utils/logger';

export const requestLogger = async (c: Context, next: Next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;

  const method = c.req.method;
  const path = c.req.path;
  const status = c.res.status;

  appLogger.info(`${method} ${path} ${status} - ${duration}ms`);
};

export const errorLogger = async (c: Context, next: Next) => {
  try {
    return next();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    appLogger.error(`Unhandled error on ${c.req.method} ${c.req.path}: ${message}`, { error: err });
    return c.json({ error: 'Internal server error' }, 500);
  }
};
