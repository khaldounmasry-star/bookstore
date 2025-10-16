import z from 'zod';
import { Hono } from 'hono';
import { Prisma, Role } from '@prisma/client';
import { authMiddleware, requireRole } from '@middleware/auth';
import { validateMiddleware } from '@middleware/validate';
import { prisma } from '@utils/prisma';
import { logger } from '@utils/logger';
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

  logger.info(`Found ${found.length} books for search query '${q}' ( limit: ${limit}, offset: ${offset} )`);

  return c.json(found);
});

books.get('/filter', async (c) => {
  const genre = c.req.query('genre');
  const sort = c.req.query('sort') ?? 'title';
  const order = c.req.query('order') ?? 'asc';
  const limit = Number(c.req.query('limit') ?? 10);
  const offset = Number(c.req.query('offset') ?? 0);

  logger.info('Incoming /books/filter request', {
    query: { genre, sort, order, limit, offset }
  });

  try {
    const validSortFields = ['title', 'price', 'rating'];
    const validOrder = ['asc', 'desc'];

    if (!validSortFields.includes(sort)) {
      logger.warn(`Invalid sort field: ${sort}`);

      return c.json(
        { error: `Invalid sort field. Use one of: ${validSortFields.join(', ')}` },
        400
      );
    }

    if (!validOrder.includes(order)) {
      logger.warn(`Invalid sort order: ${order}`);

      return c.json({ error: 'Invalid order. Use asc or desc.' }, 400);
    }

    const where = genre ? { genre } : {};

    const books = await prisma.book.findMany({
      where,
      orderBy: { [sort]: order },
      skip: offset,
      take: limit,
      include: {
        covers: { take: 1, orderBy: { id: 'asc' } }
      }
    });

    const genres = await prisma.book.findMany({
      distinct: ['genre'],
      select: { genre: true }
    });

    logger.info(`Retrieved ${books.length} book(s)`, {
      genre: genre || 'all',
      sort,
      order,
      limit,
      offset
    });

    return c.json({ count: books.length, results: books, genres: genres.map(g => g.genre) });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(`Error filtering books: ${message}`, { err });

    return c.json({ error: 'Failed to retrieve books' }, 500);
  }
});

books.get('/', async (c) => {
  const allBooks = await prisma.book.findMany({
    include: { covers: true },
    orderBy: { id: 'asc' }
  });
  logger.info(`Returning all books (${allBooks.length})`);
  return c.json(allBooks);
});

books.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const book = await prisma.book.findUnique({
    where: { id },
    include: { covers: true }
  });
  if (!book) {
    logger.error(`Book ${id} not found`);
    return c.json({ error: 'Book not found' }, 404);
  }
  logger.info(`Returning book ${book.title}`);
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

    logger.info(`Created book ${newBook.title}`);

    return c.json({ message: 'Book created', book: newBook });
});

books.put('/:id',
  requireRole(Role.ADMIN),
  validateMiddleware(updateBookSchema),
  async (c) => {
    const id = Number(c.req.param('id'));
    if (Number.isNaN(id)) {
      logger.error(`Invalid book ID: ${c.req.param('id')}`);
      return c.json({ error: 'Invalid book ID' }, 400);
    }

    const body = c.get('validated') as z.infer<typeof updateBookSchema>;
    const data = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined)
    );

    try {
      const updated = await prisma.book.update({ where: { id }, data });
      logger.info(`Updated book ${updated.title}`);

      return c.json({ message: 'Book updated', book: updated });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        logger.error(`Book ${id} not found for update`);
        return c.json({ error: `Book ${id} not found` }, 404);
      }
      logger.error(`Error updating book ${id}: ${e}`);
      throw e;
    }
  }
);

books.delete('/:id',
  requireRole(Role.ADMIN),
  async (c) => {
    const id = Number(c.req.param('id'));
    if (Number.isNaN(id)) {
      logger.error(`Invalid book ID: ${c.req.param('id')}`);
      return c.json({ error: 'Invalid book ID' }, 400);
    }

    try {
      await prisma.cover.deleteMany({ where: { bookId: id } });
      await prisma.book.delete({ where: { id } });

      logger.info(`Deleted book ${id}`);

      return c.json({ message: `Book ${id} deleted` });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        logger.error(`Book ${id} not found for deletion`);
        return c.json({ error: `Book ${id} not found` }, 404);
      }
      logger.error(`Error deleting book ${id}: ${e}`);
      throw e;
    }
});

books.post('/:id/covers', requireRole(Role.ADMIN), async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) {
    logger.error(`Invalid book ID: ${c.req.param('id')}`);
    return c.json({ error: 'Invalid book ID' }, 400);
  }

  const parsed = createCoverInput.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) {
    logger.error(`Invalid cover input for book ${id}: ${JSON.stringify(parsed.error.flatten())}`);
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const book = await prisma.book.findUnique({ where: { id }, select: { id: true } });
  if (!book) {
    logger.error(`Book ${id} not found`);
    return c.json({ error: `Book ${id} not found` }, 404);
  }

  const urls = parsed.data.imageUrls ?? (parsed.data.imageUrl ? [parsed.data.imageUrl] : []);

  const created = await Promise.all(
    urls.map((imageUrl) =>
      prisma.cover.create({
        data: { imageUrl, bookId: id }
      })
    )
  );

  logger.info(`Added ${created.length} cover(s) to book ${id}`);

  return c.json({ message: `Added ${created.length} cover(s)`, covers: created });
});

books.put('/covers/:coverId', requireRole(Role.ADMIN), async (c) => {
  const coverId = Number(c.req.param('coverId'));
  if (Number.isNaN(coverId)){
    logger.error(`Invalid cover ID: ${c.req.param('coverId')}`);
    return c.json({ error: 'Invalid cover ID' }, 400);
  }

  const parsed = updateCoverInput.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success){
    logger.error(`Invalid cover input for cover ${coverId}: ${JSON.stringify(parsed.error.flatten())}`);
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  try {
    const updated = await prisma.cover.update({
      where: { id: coverId },
      data: { imageUrl: parsed.data.imageUrl }
    });
    logger.info(`Updated cover ${coverId}`);

    return c.json({ message: 'Cover updated', cover: updated });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      logger.error(`Cover ${coverId} not found for update`);
      return c.json({ error: `Cover ${coverId} not found` }, 404);
    }
    logger.error(`Error updating cover ${coverId}: ${e}`);
    throw e;
  }
});

books.delete('/covers/:coverId', requireRole(Role.ADMIN), async (c) => {
  const coverId = Number(c.req.param('coverId'));
  if (Number.isNaN(coverId)){
    logger.error(`Invalid cover ID: ${c.req.param('coverId')}`);
    return c.json({ error: 'Invalid cover ID' }, 400);
  }

  try {
    await prisma.cover.delete({ where: { id: coverId } });
    logger.info(`Deleted cover ${coverId}`);

    return c.json({ message: `Cover ${coverId} deleted` });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      logger.error(`Cover ${coverId} not found for deletion`);
      return c.json({ error: `Cover ${coverId} not found` }, 404);
    }
    logger.error(`Error deleting cover ${coverId}: ${e}`);
    throw e;
  }
});
