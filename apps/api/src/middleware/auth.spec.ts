/* eslint-disable @typescript-eslint/no-explicit-any */
import { authMiddleware, requireRole } from '@middleware/auth';
import { verifyToken } from '@utils/jwt';
import { logger } from '@utils/logger';

jest.mock('@utils/jwt', () => ({
  verifyToken: jest.fn()
}));

jest.mock('@utils/logger', () => ({
  logger: {
    error: jest.fn()
  }
}));

describe('authMiddleware', () => {
  let c: any;
  let next: jest.Mock;

  beforeEach(() => {
    next = jest.fn();
    c = {
      req: { header: jest.fn() },
      json: jest.fn().mockReturnValue('json_response'),
      set: jest.fn()
    };
  });

  afterEach(() => jest.clearAllMocks());

  it('returns 401 if no Authorization header', async () => {
    c.req.header.mockReturnValue(undefined);

    await authMiddleware(c, next);

    expect(logger.error).toHaveBeenCalledWith(
      'Unauthorised access attempt without user context'
    );
    expect(c.json).toHaveBeenCalledWith({ error: 'Unauthorised' }, 401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 if invalid token', async () => {
    c.req.header.mockReturnValue('Bearer badtoken');
    (verifyToken as jest.Mock).mockReturnValue(null);

    await authMiddleware(c, next);

    expect(logger.error).toHaveBeenCalledWith('Invalid token');
    expect(c.json).toHaveBeenCalledWith({ error: 'Invalid token' }, 401);
    expect(next).not.toHaveBeenCalled();
  });

  it('sets user and calls next on valid token', async () => {
    const user = { id: 1, role: 'ADMIN' };
    c.req.header.mockReturnValue('Bearer goodtoken');
    (verifyToken as jest.Mock).mockReturnValue(user);

    await authMiddleware(c, next);

    expect(c.set).toHaveBeenCalledWith('user', user);
    expect(next).toHaveBeenCalled();
  });
});

describe('requireRole', () => {
  let c: any;
  let next: jest.Mock;

  beforeEach(() => {
    next = jest.fn();
    c = {
      get: jest.fn(),
      json: jest.fn().mockReturnValue('json_response')
    };
  });

  afterEach(() => jest.clearAllMocks());

  it('returns 401 if no user in context', async () => {
    c.get.mockReturnValue(undefined);
    const mw = requireRole('ADMIN');
    await mw(c, next);

    expect(logger.error).toHaveBeenCalledWith(
      'Unauthorised access attempt without user context'
    );
    expect(c.json).toHaveBeenCalledWith({ error: 'Unauthorised' }, 401);
    expect(next).not.toHaveBeenCalled();
  });

  it('allows ADMIN when role = ADMIN', async () => {
    c.get.mockReturnValue({ id: 2, role: 'ADMIN' });
    const mw = requireRole('ADMIN');
    await mw(c, next);

    expect(next).toHaveBeenCalled();
  });

  it('allows SUPER_ADMIN for any role', async () => {
    c.get.mockReturnValue({ id: 1, role: 'SUPER_ADMIN' });
    const mw = requireRole('ADMIN');
    await mw(c, next);

    expect(next).toHaveBeenCalled();
  });

  it('forbids USER for ADMIN route', async () => {
    c.get.mockReturnValue({ id: 3, role: 'USER' });
    const mw = requireRole('ADMIN');
    await mw(c, next);

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Forbidden access attempt')
    );
    expect(c.json).toHaveBeenCalledWith(
      { error: 'Forbidden: Higher user role required' },
      403
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('forbids ADMIN for SUPER_ADMIN route', async () => {
    c.get.mockReturnValue({ id: 5, role: 'ADMIN' });
    const mw = requireRole('SUPER_ADMIN');
    await mw(c, next);

    expect(c.json).toHaveBeenCalledWith(
      { error: 'Forbidden: Higher user role required' },
      403
    );
    expect(next).not.toHaveBeenCalled();
  });
});
