import { Hono } from 'hono';
import { prisma } from '../utils';
import bcrypt from 'bcrypt';

export const users = new Hono();

// REGISTER
users.post('/register', async (c) => {
  const { firstName, lastName, email, password } = await c.req.json();
  const hash = await bcrypt.hash(password, 10);

  const pass = await prisma.password.create({ data: { hash } });
  const newUser = await prisma.person.create({
    data: { firstName, lastName, email, passwordId: pass.id },
  });

  return c.json(newUser);
});

// LOGIN
users.post('/login', async (c) => {
  const { email, password } = await c.req.json();
  const existing = await prisma.person.findUnique({
    where: { email },
    include: { password: true },
  });

  if (!existing || !existing.password) return c.json({ error: 'Invalid credentials' }, 401);

  const valid = await bcrypt.compare(password, existing.password.hash);
  if (!valid) return c.json({ error: 'Invalid credentials' }, 401);

  return c.json({ message: 'Login success', user: existing });
});
