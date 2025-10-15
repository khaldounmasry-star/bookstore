import z from 'zod';
import { Hono } from 'hono';
import { Prisma, Role } from '@prisma/client';
import { authMiddleware, requireRole } from '@middleware/auth';
import { validateMiddleware } from '@middleware/validate';
import { prisma } from '@utils/prisma';
import { createBookSchema, updateBookSchema } from '@schemas/bookSchema';
import { createCoverInput, updateCoverInput } from '@schemas/coverSchema';

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
    if (Number.isNaN(id)) return c.json({ error: 'Invalid book ID' }, 400);

    const body = c.get('validated') as z.infer<typeof updateBookSchema>;
    const data = Object.fromEntries(
      Object.entries(body).filter(([_, v]) => v !== undefined)
    );

    try {
      const updated = await prisma.book.update({ where: { id }, data });
      return c.json({ message: 'Book updated', book: updated });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        return c.json({ error: `Book ${id} not found` }, 404);
      }
      throw e;
    }
  }
);

books.delete('/:id',
  requireRole(Role.ADMIN),
  async (c) => {
    const id = Number(c.req.param('id'));
    if (Number.isNaN(id)) return c.json({ error: 'Invalid book ID' }, 400);

    try {
      await prisma.cover.deleteMany({ where: { bookId: id } });
      await prisma.book.delete({ where: { id } });

      return c.json({ message: `Book ${id} deleted` });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        return c.json({ error: `Book ${id} not found` }, 404);
      }
      throw e;
    }
});

books.post('/:id/covers', requireRole(Role.ADMIN), async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'Invalid book ID' }, 400);

  const parsed = createCoverInput.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  const book = await prisma.book.findUnique({ where: { id }, select: { id: true } });
  if (!book) return c.json({ error: `Book ${id} not found` }, 404);

  const urls = parsed.data.imageUrls ?? (parsed.data.imageUrl ? [parsed.data.imageUrl] : []);

  const created = await Promise.all(
    urls.map((imageUrl) =>
      prisma.cover.create({
        data: { imageUrl, bookId: id }
      })
    )
  );

  return c.json({ message: `Added ${created.length} cover(s)`, covers: created });
});

books.put('/covers/:coverId', requireRole(Role.ADMIN), async (c) => {
  const coverId = Number(c.req.param('coverId'));
  if (Number.isNaN(coverId)) return c.json({ error: 'Invalid cover ID' }, 400);

  const parsed = updateCoverInput.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);

  try {
    const updated = await prisma.cover.update({
      where: { id: coverId },
      data: { imageUrl: parsed.data.imageUrl }
    });
    return c.json({ message: 'Cover updated', cover: updated });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return c.json({ error: `Cover ${coverId} not found` }, 404);
    }
    throw e;
  }
});

books.delete('/covers/:coverId', requireRole(Role.ADMIN), async (c) => {
  const coverId = Number(c.req.param('coverId'));
  if (Number.isNaN(coverId)) return c.json({ error: 'Invalid cover ID' }, 400);

  try {
    await prisma.cover.delete({ where: { id: coverId } });
    return c.json({ message: `Cover ${coverId} deleted` });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return c.json({ error: `Cover ${coverId} not found` }, 404);
    }
    throw e;
  }
});
