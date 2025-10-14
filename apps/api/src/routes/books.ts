import { Hono } from 'hono';
import { authMiddleware, requireRole } from '@middleware/auth';
import { prisma } from '../utils';

export const books = new Hono();

books.get('/', async (c) => {
  const allBooks = await prisma.book.findMany({
    include: { covers: true },
    orderBy: { id: 'asc' }
  });
  return c.json(allBooks);
});

books.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const book = await prisma.book.findUnique({
    where: { id },
    include: { covers: true }
  });
  if (!book) return c.json({ error: 'Book not found' }, 404);
  return c.json(book);
});

books.get('/search/query', async (c) => {
  const q = c.req.query('q');
  const limit = Number(c.req.query('limit') ?? 10);
  const offset = Number(c.req.query('offset') ?? 0);

  const found = await prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: q ?? '', mode: 'insensitive' } },
        { author: { contains: q ?? '', mode: 'insensitive' } }
      ]
    },
    include: { covers: true },
    take: limit,
    skip: offset
  });

  return c.json(found);
});

books.use('*', authMiddleware);

books.post('/', requireRole('ADMIN'), async (c) => {
  const body = await c.req.json();

  const newBook = await prisma.book.create({
    data: {
      title: body.title,
      author: body.author,
      description: body.description,
      genre: body.genre,
      year: body.year,
      rating: body.rating,
      price: body.price,
      sku: body.sku,
      covers: {
        create: (body.covers || []).map((url: string) => ({ imageUrl: url }))
      }
    }
  });

  return c.json({ message: 'Book created', book: newBook });
});

books.put('/:id', requireRole('ADMIN'), async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();

  const updated = await prisma.book.update({
    where: { id },
    data: {
      title: body.title,
      author: body.author,
      description: body.description,
      genre: body.genre,
      year: body.year,
      rating: body.rating,
      price: body.price,
      sku: body.sku
    }
  });

  return c.json({ message: 'Book updated', book: updated });
});

books.delete('/:id', requireRole('ADMIN'), async (c) => {
  const id = Number(c.req.param('id'));

  await prisma.cover.deleteMany({ where: { bookId: id } });
  await prisma.book.delete({ where: { id } });

  return c.json({ message: `Book ${id} deleted` });
});
