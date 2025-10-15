/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodError, z } from 'zod';
import { validateMiddleware } from '@middleware/validate';
import { logger } from '@utils/logger';

jest.mock('@utils/logger', () => ({
  logger: {
    error: jest.fn()
  }
}));

describe('validateMiddleware', () => {
  const schema = z.object({
    name: z.string().min(2),
    age: z.number().int().positive()
  });

  let next: jest.Mock;
  let c: any;

  beforeEach(() => {
    next = jest.fn();
    c = {
      req: {
        json: jest.fn(),
        param: jest.fn(),
        url: 'http://localhost:3000?name=John&age=30'
      },
      set: jest.fn(),
      json: jest.fn().mockReturnValue('json_response')
    };
  });

  afterEach(() => jest.clearAllMocks());

  it('calls next() and sets validated data when valid JSON', async () => {
    c.req.json.mockResolvedValue({ name: 'John', age: 30 });
    const middleWare = validateMiddleware(schema, 'json');

    await middleWare(c, next);

    expect(c.set).toHaveBeenCalledWith('validated', { name: 'John', age: 30 });
    expect(next).toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('sanitizes HTML from input', async () => {
    c.req.json.mockResolvedValue({ name: '<b>Ali</b>', age: 22 });
    const middleWare = validateMiddleware(schema, 'json');

    await middleWare(c, next);

    const sanitized = c.set.mock.calls[0][1];
    expect(sanitized.name).toBe('Ali');
  });

  it('returns 400 and logs when ZodError is thrown', async () => {
    c.req.json.mockResolvedValue({ name: 'A', age: -1 });
    const middleWare = validateMiddleware(schema, 'json');

    await middleWare(c, next);

    expect(logger.error).toHaveBeenCalledWith(
      'Validation error:',
      expect.any(ZodError)
    );
    expect(c.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'ValidationError' }),
      400
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('parses query params correctly', async () => {
    const middleWare = validateMiddleware(
      z.object({
        name: z.string(),
        age: z.string().transform(Number).pipe(z.number().int().positive())
      }),
      'query'
    );

    c.req.url = 'http://localhost:3000?name=John&age=30';
    await middleWare(c, next);

    expect(c.set).toHaveBeenCalledWith(
      'validated',
      expect.objectContaining({ name: 'John', age: 30 })
    );
  });

  it('rethrows unexpected errors', async () => {
    const middleWare = validateMiddleware(schema);
    const err = new Error('boom');
    c.req.json.mockRejectedValue(err);

    await expect(middleWare(c, next)).rejects.toThrow('boom');
  });
});
