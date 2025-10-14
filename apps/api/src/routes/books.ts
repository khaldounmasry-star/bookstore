import z from 'zod';
import { Hono } from 'hono';
import { authMiddleware, requireRole } from '@middleware/auth';
import { validateMiddleware } from '@middleware/validate';
import { prisma } from '@utils/prisma';
import { createBookSchema, updateBookSchema } from '@schemas/bookSchema';
import { Role } from '@prisma/client';

export const books = new Hono();

books.get('/search', async (c) => {
  const qRaw = c.req.query('q');
  const q = qRaw?.trim().replace(/[^\p{L}\p{N}\s'-]/gu, '');
  const limit = Number(c.req.query('limit') ?? 10);
  const offset = Number(c.req.query('offset') ?? 0);

  const found = await prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: q ?? '' } },
        { author: { contains: q ?? '' } },
        { description: { contains: q ?? '' } },
        { genre: { contains: q ?? '' } }
      ]
    },
    include: {
      covers: {
        take: 1,
        orderBy: { id: 'asc' }
      }
    },
    take: limit,
    skip: offset
  });

  return c.json(found);
});

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

books.use('*', authMiddleware);

books.post('/',
  requireRole(Role.ADMIN),
  validateMiddleware(createBookSchema),
  async (c) => {
    const body = c.get('validated') as z.infer<typeof createBookSchema>;

    const newBook = await prisma.book.create({
      data: {
        title: body.title,
        author: body.author,
        description: body.description ?? '',
        genre: body.genre ?? '',
        year: body.year ?? null,
        rating: body.rating ?? null,
        price: body.price ?? null,
        sku: body.sku ?? '',
        ...(body.covers?.length
          ? { covers: { create: body.covers.map((url) => ({ imageUrl: url })) } }
          : {})
      }
    });

    return c.json({ message: 'Book created', book: newBook });
});

books.put('/:id',
  requireRole(Role.ADMIN),
  validateMiddleware(updateBookSchema),
  async (c) => {
    const id = Number(c.req.param('id'));
    const body = c.get('validated') as z.infer<typeof updateBookSchema>;

    const data = Object.fromEntries(
      Object.entries(body).filter(([_, v]) => v !== undefined)
    );

    const updated = await prisma.book.update({
      where: { id },
      data
    });

    return c.json({ message: 'Book updated', book: updated });
});

books.delete('/:id', requireRole(Role.ADMIN), async (c) => {
  const id = Number(c.req.param('id'));

  await prisma.cover.deleteMany({ where: { bookId: id } });
  await prisma.book.delete({ where: { id } });

  return c.json({ message: `Book ${id} deleted` });
});
