import bcrypt from 'bcrypt';
import z from 'zod';
import { Hono } from 'hono';
import { prisma } from '@utils/prisma';
import { signToken } from '@utils/jwt';
import { logger } from '@utils/logger';
import { createPersonSchema, getPersonSchema, updatePersonSchema } from '@schemas/personSchema';
import { validateMiddleware } from '@middleware/validate';
import { authMiddleware, requireRole } from '@middleware/auth';
import { Role } from '@prisma/client';

export const users = new Hono();

users.post('/register', validateMiddleware(createPersonSchema), async (c) => {
  const body = c.get('validated') as z.infer<typeof createPersonSchema>;
  const { firstName, lastName, email, password } = body;

  const existing = await prisma.person.findUnique({ where: { email } });
  if (existing){
    logger.error(`Registration failed: ${email} already exists`);
    return c.json({ error: 'Email already exists' }, 409);
  }

  const hash = await bcrypt.hash(password, 10);

  const newUser = await prisma.person.create({
    data: {
      firstName,
      lastName,
      email,
      role: 'USER',
      passwords: {
        create: [{ hash }]
      }
    }
  });

  const token = signToken({ id: newUser.id, role: newUser.role, email: newUser.email });
  logger.info(`New user registered: ${email}`);

  return c.json({ message: 'User registered', token });
});

users.post('/login', validateMiddleware(getPersonSchema), async (c) => {
  const body = c.get('validated') as z.infer<typeof getPersonSchema>;
  const { email, password, extended } = body;

  const person = await prisma.person.findUnique({
    where: { email },
    select: { id: true, email: true, role: true }
  });
  if (!person) {
    logger.error(`Login failed: ${email} not found`);
    return c.json({ error: 'Invalid email' }, 401);
  }

  const latest = await prisma.password.findFirst({
    where: { personId: person.id },
    orderBy: { createdAt: 'desc' },
    select: { hash: true }
  });
  if (!latest) {
    logger.error(`Login failed: ${email} has no password set`);
    return c.json({ error: 'No password set' }, 401);
  }

  const valid = await bcrypt.compare(password, latest.hash);
  if (!valid) {
    logger.error(`Login failed: ${email} invalid password`);
    return c.json({ error: 'Invalid password' }, 401);
  }

  const token = signToken({ id: person.id, role: person.role, email: person.email }, extended ? 60 * 60 * 24 * 30 : undefined);
  logger.info(`User logged in: ${email}`);

  return c.json({ message: 'Login success', role: person.role, token });
});

users.use('*', authMiddleware);

users.get('/', requireRole(Role.SUPER_ADMIN), async (c) => {
  const allUsers = await prisma.person.findMany({
    orderBy: { id: 'asc' }
  });

  logger.info(`Returning all users (${allUsers.length})`);

  return c.json(allUsers);
});

users.post(
  '/create-admin',
  requireRole(Role.SUPER_ADMIN),
  validateMiddleware(createPersonSchema),
  async (c) => {
    const body = c.get('validated') as z.infer<typeof createPersonSchema>;
    const { firstName, lastName, email, password } = body;

    const existing = await prisma.person.findUnique({ where: { email } });
    if (existing) {
      logger.error(`Admin creation failed: ${email} already exists`);
      return c.json({ error: 'Admin already exists' }, 409);
    }
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

    logger.info(`New admin created: ${email}`);

    return c.json({ message: 'Admin created', admin });
  }
);

users.put(
  '/:id',
  requireRole(Role.SUPER_ADMIN),
  validateMiddleware(updatePersonSchema),
  async (c) => {
    const body = c.get('validated') as z.infer<typeof updatePersonSchema>;
    const id = Number(c.req.param('id'));

    try {
      const existing = await prisma.person.findUnique({ where: { id } });
      if (!existing) {
        logger.error(`Update failed: user with id ${id} not found`);
        return c.json({ error: 'User not found' }, 404);
      }

      if (body.email && body.email !== existing.email) {
        const emailInUse = await prisma.person.findUnique({
          where: { email: body.email }
        });
        if (emailInUse) {
          logger.error(`Update failed: email ${body.email} already in use`);
          return c.json({ error: 'Email already in use' }, 409);
        }
      }

      const updated = await prisma.person.update({
        where: { id },
        data: {
          firstName: body.firstName ?? existing.firstName,
          lastName: body.lastName ?? existing.lastName,
          email: body.email ?? existing.email,
          role: body.role ?? existing.role
        }
      });

      logger.info(`User ${id} updated successfully`);
      return c.json({ message: 'User updated successfully', user: updated });
    } catch (error) {
      logger.error('Error updating user', error);
      return c.json({ error: 'Failed to update user' }, 500);
    }
  }
);

users.delete('/:id', requireRole(Role.SUPER_ADMIN), async (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) {
    logger.error(`Invalid user ID: ${c.req.param('id')}`);
    return c.json({ error: 'Invalid user ID' }, 400);
  }

  const person = await prisma.person.findUnique({ where: { id } });
  if (!person) {
    logger.error(`User ${id} not found`);
    return c.json({ error: `User ${id} not found` }, 404);
  }

  await prisma.person.delete({ where: { id } });
  logger.info(`User ${id} deleted`);

  return c.json({ message: `User ${id} deleted successfully` });
});
