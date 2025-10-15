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

  const newUser = await prisma.person.create({
    data: {
      firstName,
      lastName,
      email,
      role: 'USER',
      passwords: {
        create: [{ hash }] // new schema: Password has personId FK
      }
    }
  });

  const token = signToken({ id: newUser.id, role: newUser.role, email: newUser.email });
  return c.json({ message: 'User registered', token });
});

users.post('/login', validateMiddleware(getPersonSchema), async (c) => {
  const body = c.get('validated') as z.infer<typeof getPersonSchema>;
  const { email, password } = body;

  const person = await prisma.person.findUnique({
    where: { email },
    select: { id: true, email: true, role: true }
  });
  if (!person) return c.json({ error: 'Invalid email' }, 401);

  const latest = await prisma.password.findFirst({
    where: { personId: person.id },
    orderBy: { createdAt: 'desc' },
    select: { hash: true }
  });
  if (!latest) return c.json({ error: 'No password set' }, 401);

  const valid = await bcrypt.compare(password, latest.hash);
  if (!valid) return c.json({ error: 'Invalid password' }, 401);

  const token = signToken({ id: person.id, role: person.role, email: person.email });
  return c.json({ message: 'Login success', role: person.role, token });
});

users.use('*', authMiddleware);

users.post(
  '/create-admin',
  requireRole(Role.SUPER_ADMIN),
  validateMiddleware(createPersonSchema),
  async (c) => {
    const body = c.get('validated') as z.infer<typeof createPersonSchema>;
    const { firstName, lastName, email, password } = body;

    const existing = await prisma.person.findUnique({ where: { email } });
    if (existing) return c.json({ error: 'Email already exists' }, 400);

    const hash = await bcrypt.hash(password, 10);

    const admin = await prisma.person.create({
      data: {
        firstName,
        lastName,
        email,
        role: 'ADMIN',
        passwords: {
          create: [{ hash }]
        }
      }
    });

    return c.json({ message: 'Admin created', admin });
  }
);

users.delete('/:id', requireRole(Role.SUPER_ADMIN), async (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return c.json({ error: 'Invalid user ID' }, 400);

  const person = await prisma.person.findUnique({ where: { id } });
  if (!person) return c.json({ error: `User ${id} not found` }, 404);

  await prisma.person.delete({ where: { id } });

  return c.json({ message: `User ${id} deleted successfully` });
});
