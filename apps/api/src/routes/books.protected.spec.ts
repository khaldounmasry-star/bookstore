import { Hono } from 'hono';
import { books } from './books';
import { prisma } from '@utils/prisma';
import { logger } from '@utils/logger';

jest.mock('@utils/prisma', () => ({
  prisma: {
    book: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn()
    },
    cover: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn()
    }
  }
}));

jest.mock('@utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}));
jest.mock('@middleware/auth', () => ({
  authMiddleware: jest.fn((_c, next) => next()),
  requireRole: jest.fn(() => (_c, next) => next())
}));

describe('books routes (protected endpoints)', () => {
  const app = new Hono().route('/books', books);

  afterEach(() => jest.clearAllMocks());

  describe('POST /books', () => {
    it('creates a new book', async () => {
      const fakeBook = { id: 1, title: 'New Book', author: 'Admin', price: 9.99 };
      (prisma.book.create as jest.Mock).mockResolvedValue(fakeBook);

      const res = await app.request('/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Book',
          author: 'Admin',
          price: 9.99
        })
      });

      const data = await res.json();
      expect(res.status).toBe(200);
      expect(data.book).toEqual(fakeBook);
      expect(prisma.book.create).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Created book'));
    });
  });

  describe('PUT /books/:id', () => {
    it('updates a book successfully', async () => {
      const updatedBook = { id: 1, title: 'Updated Book', author: 'Admin' };
      (prisma.book.update as jest.Mock).mockResolvedValue(updatedBook);

      const res = await app.request('/books/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Book' })
      });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.book).toEqual(updatedBook);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Updated book'));
    });

    it('returns 400 if invalid ID', async () => {
      const res = await app.request('/books/abc', {
        method: 'PUT',
        body: JSON.stringify({ title: 'Oops' })
      });

      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe('Invalid book ID');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid book ID'));
    });

    it('returns 404 when book not found', async () => {
      const { Prisma } = jest.requireActual('@prisma/client');
      const err = new Prisma.PrismaClientKnownRequestError('not found', { code: 'P2025', clientVersion: '6.x' });
      (prisma.book.update as jest.Mock).mockRejectedValue(err);

      const res = await app.request('/books/99', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Nope' })
      });
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.error).toContain('not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Book 99 not found'));
    });
  });

  describe('DELETE /books/:id', () => {
    it('deletes a book and its covers', async () => {
      (prisma.cover.deleteMany as jest.Mock).mockResolvedValue({});
      (prisma.book.delete as jest.Mock).mockResolvedValue({ id: 1 });

      const res = await app.request('/books/1', { method: 'DELETE' });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toContain('deleted');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Deleted book'));
    });

    it('returns 404 when deleting missing book', async () => {
      const { Prisma } = jest.requireActual('@prisma/client');
      const err = new Prisma.PrismaClientKnownRequestError('missing', { code: 'P2025', clientVersion: '6.x' });
      (prisma.book.delete as jest.Mock).mockRejectedValue(err);

      const res = await app.request('/books/999', { method: 'DELETE' });
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.error).toContain('not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Book 999 not found'));
    });
  });

  describe('POST /books/:id/covers', () => {
    it('creates one or more covers', async () => {
      (prisma.book.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.cover.create as jest.Mock).mockResolvedValue({ id: 10, imageUrl: 'http://image.com/x.png' });

      const res = await app.request('/books/1/covers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: 'http://image.com/x.png' })
      });

      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toContain('Added');
      expect(prisma.cover.create).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Added'));
    });

    it('returns 400 if invalid ID', async () => {
      const res = await app.request('/books/abc/covers', { method: 'POST' });

      await res.json();

      expect(res.status).toBe(400);
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid book ID'));
    });

    it('returns 404 if book not found', async () => {
      (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);
      const res = await app.request('/books/1/covers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: 'http://image.com/x.png' })
      });

      await res.json();

      expect(res.status).toBe(404);
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Book 1 not found'));
    });
  });

  describe('PUT /books/covers/:coverId', () => {
    it('updates a cover successfully', async () => {
      const imageUrl = 'https://new.com/image.png';
      (prisma.cover.update as jest.Mock).mockResolvedValue({ id: 5, imageUrl });

      const res = await app.request('/books/covers/5', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.cover.imageUrl).toBe(imageUrl);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Updated cover'));
    });

    it('returns 400 if invalid ID', async () => {
      const res = await app.request('/books/covers/abc', { method: 'PUT' });

      await res.json();

      expect(res.status).toBe(400);
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid cover ID'));
    });
  });

  describe('DELETE /books/covers/:coverId', () => {
    it('deletes a cover', async () => {
      (prisma.cover.delete as jest.Mock).mockResolvedValue({ id: 77 });

      const res = await app.request('/books/covers/77', { method: 'DELETE' });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toContain('deleted');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Deleted cover'));
    });

    it('returns 404 when cover not found', async () => {
      const { Prisma } = jest.requireActual('@prisma/client');
      const err = new Prisma.PrismaClientKnownRequestError('missing', { code: 'P2025', clientVersion: '6.x' });
      (prisma.cover.delete as jest.Mock).mockRejectedValue(err);

      const res = await app.request('/books/covers/99', { method: 'DELETE' });
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.error).toContain('not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Cover 99 not found'));
    });
  });
});
