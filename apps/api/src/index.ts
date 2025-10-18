import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { rateLimiter } from 'hono-rate-limiter';

import { books }  from '@routes/books';
import { users }  from '@routes/users';
import { misc }  from '@routes/misc';
import { prisma } from '@utils/prisma';
import { docs } from '@routes/docs';
import { requestLogger, errorLogger } from '@middleware/logger';
import { logger as appLogger } from '@utils/logger';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
);
app.use('*', requestLogger);
app.use('*', errorLogger);
app.use('*', rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  keyGenerator: (): string => 'global'
}));
app.use('*', secureHeaders());

app.route('/books', books);
app.route('/users', users);
app.route('/docs', docs);
app.route('/', misc);

app.onError((err, c) => {
  appLogger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  return c.json(
    { error: 'Internal Server Error', message: err.message },
    500
  );
});

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  appLogger.info(`Server running at http://localhost:${info.port}`);
});

process.on('SIGINT', async () => {
  appLogger.info('Terminating DB connection...');
  await prisma.$disconnect();
  appLogger.info('DB connection terminated. Exiting...');
  process.exit(0);
});
