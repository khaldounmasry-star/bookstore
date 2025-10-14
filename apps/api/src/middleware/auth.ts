import { verifyToken } from '@utils/jwt';
import type { Context, Next } from 'hono';

export const authMiddleware = async (c: Context, next: Next) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = header.split(' ')[1];
  const decoded = token ? verifyToken(token) : undefined;
  if (!decoded) return c.json({ error: 'Invalid token' }, 401);

  c.set('user', decoded);
  await next();
};

export const requireRole = (role: 'ADMIN' | 'SUPER_ADMIN') => {
  return async (c: Context, next: Next) => {
    const user = c.get('user');
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const allowed =
      user.role === 'SUPER_ADMIN' ||
      (role === 'ADMIN' && user.role === 'ADMIN');

    if (!allowed) {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    await next();
  };
};
