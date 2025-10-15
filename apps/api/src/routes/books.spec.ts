import { Hono } from 'hono';
import { books } from './books';
import { prisma } from '@utils/prisma';
import { logger } from '@utils/logger';

jest.mock('@utils/prisma', () => ({
  prisma: {
    book: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
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

describe('books routes (public endpoints)', () => {
  const app = new Hono().route('/books', books);

  afterEach(() => jest.clearAllMocks());

  describe('GET /books/search', () => {
    it('returns books matching search query', async () => {
      (prisma.book.findMany as jest.Mock).mockResolvedValue([
        { id: 1, title: 'Test Book', author: 'John Doe' }
      ]);

      const res = await app.request('/books/search?q=Test');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(prisma.book.findMany).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Found'));
    });
  });

  describe('GET /books/filter', () => {
    it('returns filtered books successfully', async () => {
      (prisma.book.findMany as jest.Mock).mockResolvedValue([
        { id: 1, title: 'SciFi Book', genre: 'Sci-Fi' }
      ]);

      const res = await app.request('/books/filter?genre=Sci-Fi&sort=title&order=asc');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.count).toBe(1);
      expect(data.results[0].genre).toBe('Sci-Fi');
    });

    it('returns 400 for invalid sort field', async () => {
      const res = await app.request('/books/filter?sort=invalid');
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain('Invalid sort field');
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Invalid sort field'));
    });

    it('returns 400 for invalid sort order', async () => {
      const res = await app.request('/books/filter?order=sideways');
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain('Invalid order');
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Invalid sort order'));
    });

    it('handles Prisma errors gracefully', async () => {
      (prisma.book.findMany as jest.Mock).mockRejectedValueOnce(new Error('DB fail'));

      const res = await app.request('/books/filter');
      const data = await res.json();

      expect(res.status).toBe(500);
      expect(data.error).toBe('Failed to retrieve books');
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error filtering books'),
        expect.any(Object)
      );
    });
  });

  describe('GET /books', () => {
    it('returns all books', async () => {
      (prisma.book.findMany as jest.Mock).mockResolvedValue([
        { id: 1, title: 'A Book', author: 'Alice' },
        { id: 2, title: 'B Book', author: 'Bob' }
      ]);

      const res = await app.request('/books');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Returning all books'));
    });
  });

  describe('GET /books/:id', () => {
    it('returns book when found', async () => {
      (prisma.book.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        title: 'Found Book',
        covers: []
      });

      const res = await app.request('/books/1');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.title).toBe('Found Book');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Returning book'));
    });

    it('returns 404 when book not found', async () => {
      (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await app.request('/books/999');
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.error).toBe('Book not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Book 999 not found'));
    });
  });
});
