import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Hono } from 'hono';
import { prisma } from '@utils/prisma';
import { signToken } from '@utils/jwt';


export const users = new Hono();

users.post('/register', async (c) => {
  const { firstName, lastName, email, password } = await c.req.json();

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


users.post('/login', async (c) => {
  const { email, password } = await c.req.json();

  const existing = await prisma.person.findUnique({
    where: { email },
    include: { password: true }
  });

  if (!existing || !existing.password) return c.json({ error: 'Invalid credentials' }, 401);

  const valid = await bcrypt.compare(password, existing.password.hash);
  if (!valid) return c.json({ error: 'Invalid credentials' }, 401);

  const token = signToken({ id: existing.id, role: existing.role, email: existing.email });

  return c.json({ message: 'Login success', role: existing.role, token });
});

users.post('/create-admin', async (c) => {
  const auth = c.req.header('Authorization');
  console.log('=== AUTH', auth);
  if (!auth?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401);

  const token = auth.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key') as {
    id: number;
    role: string;
  };

  if (decoded.role !== 'SUPER_ADMIN') {
    return c.json({ error: 'Forbidden — requires SUPER_ADMIN role' }, 403);
  }

  const { firstName, lastName, email, password } = await c.req.json();
  const hash = await bcrypt.hash(password, 10);
  const pass = await prisma.password.create({ data: { hash } });

  const admin = await prisma.person.create({
    data: { firstName, lastName, email, passwordId: pass.id, role: 'ADMIN' }
  });

  return c.json({ message: 'Admin created', admin });
});
