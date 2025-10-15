import { Hono } from 'hono';

import { prisma } from '@utils/prisma';
import { logger } from '@utils/logger';

export const misc = new Hono();

misc.get('/', (c) => {
  logger.info('Health check endpoint hit');
  return c.text('📚 Bookstore API is running 🚀');
});

misc.get('/health', async (c) => {
  const timestamp = new Date().toISOString();

  const status = {
    timestamp,
    server: 'OK',
    database: 'UNKNOWN',
    uptime: process.uptime()
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    status.database = 'OK';
    logger.info('Database health check passed');
  } catch (err) {
    logger.error('Database health check failed:', err);
    status.database = 'ERROR';
  }

  return c.json(status);
});

misc.all('*', (c) => {
  logger.error(`Route not found: ${c.req.url}`);
  return c.json({ error: 'Route not found' }, 404);
});
