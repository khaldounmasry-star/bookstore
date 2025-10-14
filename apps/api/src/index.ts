import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import rateLimiter from 'hono-rate-limit';

import { books }  from '@routes/books';
import { users }  from '@routes/users';
import { misc }  from '@routes/misc';
import { prisma } from '@utils/prisma';

const app = new Hono();

app.use('*', cors());
app.use('*', logger());
app.use('*', rateLimiter({ windowMs: 60 * 1000, max: 100 }));
app.use('*', secureHeaders());

app.route('/books', books);
app.route('/users', users);
app.route('/', misc);

app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json(
    { error: 'Internal Server Error', message: err.message },
    500
  );
});

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});

process.on('SIGINT', async () => {
  console.log('Terminating DB connection...');
  await prisma.$disconnect();
  process.exit(0);
});
