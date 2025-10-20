import jwt from 'jsonwebtoken';
import { signToken, verifyToken } from '@utils/jwt';
import { logger } from '@utils/logger';
import { Role } from '@prisma/client';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'signed.jwt.token'),
  verify: jest.fn(() => ({ id: 1, email: 'test@mail.com' }))
}));

jest.mock('@utils/logger', () => ({
  logger: {
    error: jest.fn()
  }
}));

describe('JWT utils', () => {
  afterEach(() => jest.clearAllMocks());

  it('signToken calls jwt.sign with correct params', () => {
    const payload = { id: 1, email: 'a@b.com', role: Role.USER  };
    const token = signToken(payload);
    expect(token).toBe('signed.jwt.token');
    expect(jwt.sign).toHaveBeenCalledWith(
      payload,
      expect.anything(),
      expect.objectContaining({ expiresIn: expect.any(Number) })
    );
  });

  it('verifyToken returns decoded payload', () => {
    const result = verifyToken('signed.jwt.token');
    expect(result).toMatchObject({ id: 1, email: 'test@mail.com' });
    expect(jwt.verify).toHaveBeenCalled();
  });

  it('verifyToken returns null and logs on error', () => {
    (jwt.verify as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    const result = verifyToken('bad.token');
    expect(result).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(
      'JWT verification error:',
      'Invalid token'
    );
  });
});
