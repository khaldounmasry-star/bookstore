import { Hono } from 'hono';

import { prisma } from '@utils/prisma';

export const misc = new Hono();

misc.get('/', (c) => c.text('📚 Bookstore API is running 🚀'));

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
  } catch (err) {
    console.error('Database health check failed:', err);
    status.database = 'ERROR';
  }

  return c.json(status);
});

misc.all('*', (c) => c.json({ error: 'Route not found' }, 404));
