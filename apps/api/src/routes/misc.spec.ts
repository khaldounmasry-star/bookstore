import { Hono } from 'hono';
import { misc } from './misc';
import { prisma } from '@utils/prisma';
import { logger } from '@utils/logger';

jest.mock('@utils/prisma', () => ({
  prisma: { $queryRaw: jest.fn() }
}));

jest.mock('@utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}));

describe('misc routes', () => {
  const app = new Hono().route('/', misc);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET "/" should return the health text message', async () => {
    const res = await app.request('/');
    const text = await res.text();

    expect(res.status).toBe(200);
    expect(text).toContain('Bookstore API is running');
    expect(logger.info).toHaveBeenCalledWith('Health check endpoint hit');
  });

  it('GET /health should return JSON with database OK', async () => {
    (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([{ '1': 1 }]);

    const res = await app.request('/health');
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.server).toBe('OK');
    expect(data.database).toBe('OK');
    expect(typeof data.timestamp).toBe('string');
    expect(logger.info).toHaveBeenCalledWith('Database health check passed');
  });

  it('GET /health should handle database error', async () => {
    (prisma.$queryRaw as jest.Mock).mockRejectedValueOnce(new Error('DB fail'));

    const res = await app.request('/health');
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.database).toBe('ERROR');
    expect(logger.error).toHaveBeenCalledWith(
      'Database health check failed:',
      expect.any(Error)
    );
  });

  it('GET /nonexistent should return 404', async () => {
    const res = await app.request('/notfound');
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe('Route not found');
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Route not found:')
    );
  });
});
