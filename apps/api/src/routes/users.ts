import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import z from 'zod';
import { Hono } from 'hono';
import { prisma } from '@utils/prisma';
import { signToken } from '@utils/jwt';
import { createPersonSchema, getPersonSchema } from '@schemas/personSchema';
import { validateMiddleware } from '@middleware/validate';
import { authMiddleware, requireRole } from '@middleware/auth';
import { Role } from '@prisma/client';

export const users = new Hono();

users.post('/register', validateMiddleware(createPersonSchema), async (c) => {
  const body = c.get('validated') as z.infer<typeof createPersonSchema>;
  const { firstName, lastName, email, password } = body;

  const existing = await prisma.person.findUnique({ where: { email } });
  if (existing) return c.json({ error: 'Email already exists' }, 400);

  const hash = await bcrypt.hash(password, 10);
  const pass = await prisma.password.create({ data: { hash } });

  const newUser = await prisma.person.create({
    data: { firstName, lastName, email, passwordId: pass.id, role: 'USER' }
  });

  const token = signToken({ id: newUser.id, role: newUser.role, email: newUser.email });

  return c.json({ message: 'User registered', token });
});

users.post('/login', validateMiddleware(getPersonSchema), async (c) => {
  const body = c.get('validated') as z.infer<typeof getPersonSchema>;
  const { email, password } = body;

  const existing = await prisma.person.findUnique({
    where: { email },
    include: { password: true }
  });

  if (!existing || !existing.password) return c.json({ error: 'Invalid email' }, 401);

  const valid = await bcrypt.compare(password, existing.password.hash);
  if (!valid) return c.json({ error: 'Invalid password' }, 401);

  const token = signToken({ id: existing.id, role: existing.role, email: existing.email });

  return c.json({ message: 'Login success', role: existing.role, token });
});

users.post('/create-admin', validateMiddleware(createPersonSchema), async (c) => {
  const auth = c.req.header('Authorization');
  if (!auth?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401);

  const token = auth.split(' ')[1];
  const secret = process.env['JWT_SECRET'];
  if (!secret || !token) return c.json({ error: 'Unauthorized: wrong token or JWT secret' }, 401);
  let decoded: { id: number; role: string };
  try {
    decoded = jwt.verify(token, secret) as unknown as { id: number; role: string };
  } catch {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  if (decoded.role !== Role.SUPER_ADMIN) {
    return c.json({ error: 'Forbidden — requires SUPER_ADMIN role' }, 403);
  }

  const body = c.get('validated') as z.infer<typeof createPersonSchema>;
  const { firstName, lastName, email, password } = body;
  const existing = await prisma.person.findUnique({ where: { email } });
  if (existing) return c.json({ error: 'Email already exists' }, 400);
  const hash = await bcrypt.hash(password, 10);
  const pass = await prisma.password.create({ data: { hash } });

  const admin = await prisma.person.create({
    data: { firstName, lastName, email, passwordId: pass.id, role: 'ADMIN' }
  });

  return c.json({ message: 'Admin created', admin });
});

users.use('*', authMiddleware);

users.delete('/:id', requireRole(Role.ADMIN), async (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return c.json({ error: 'Invalid user ID' }, 400);

  const person = await prisma.person.findUnique({
    where: { id },
    select: { passwordId: true }
  });

  if (!person) return c.json({ error: `User ${id} not found` }, 404);

  await prisma.person.delete({ where: { id } });

  if (person.passwordId) {
    await prisma.password.deleteMany({ where: { id: person.passwordId } });
  }

  return c.json({ message: `User ${id} deleted successfully` });
});
