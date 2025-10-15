import { verifyToken } from '@utils/jwt';
import { logger } from '@utils/logger';

import type { Context, Next } from 'hono';

export const authMiddleware = async (c: Context, next: Next) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    logger.error('Unauthorised access attempt without user context');
    return c.json({ error: 'Unauthorised' }, 401);
  }

  const token = header.split(' ')[1];
  const decoded = token ? verifyToken(token) : undefined;
  if (!decoded) {
    logger.error('Invalid token');
    return c.json({ error: 'Invalid token' }, 401);
  }

  c.set('user', decoded);
  return next();
};

export const requireRole = (role: 'ADMIN' | 'SUPER_ADMIN') => {
  return async (c: Context, next: Next) => {
    const user = c.get('user');
    if (!user){
      logger.error('Unauthorised access attempt without user context');
      return c.json({ error: 'Unauthorised' }, 401);
    }

    const allowed =
      user.role === 'SUPER_ADMIN' ||
      (role === 'ADMIN' && user.role === 'ADMIN');

    if (!allowed) {
      logger.error(`Forbidden access attempt by user ${user.id} with role ${user.role}`);
      return c.json({ error: 'Forbidden: Higher user role required' }, 403);
    }

    return next();
  };
};
