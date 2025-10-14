import { Hono } from 'hono';
import { prisma } from '../utils';

export const books = new Hono();

books.get('/', async (c) => {
  const allBooks = await prisma.book.findMany({
    include: { covers: true },
    orderBy: { id: 'asc' },
  });
  return c.json(allBooks);
});

books.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const book = await prisma.book.findUnique({
    where: { id },
    include: { covers: true },
  });
  if (!book) return c.json({ error: 'Book not found' }, 404);
  return c.json(book);
});

// SEARCH books
books.get('/search/query', async (c) => {
  const q = c.req.query('q');
  const limit = Number(c.req.query('limit') ?? 10);
  const offset = Number(c.req.query('offset') ?? 0);

  const found = await prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: q ?? '', mode: 'insensitive' } },
        { author: { contains: q ?? '', mode: 'insensitive' } },
      ],
    },
    include: { covers: true },
    take: limit,
    skip: offset,
  });

  return c.json(found);
});
