import { Hono } from 'hono';
import { users } from './users';
import { prisma } from '@utils/prisma';
import { logger } from '@utils/logger';
import bcrypt from 'bcrypt';

jest.mock('@utils/prisma', () => ({
  prisma: {
    person: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn()
    },
    password: {
      findFirst: jest.fn()
    }
  }
}));

jest.mock('@utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => 'hashed_pw'),
  compare: jest.fn(() => true)
}));

jest.mock('@utils/jwt', () => ({
  signToken: jest.fn(() => 'mocked.jwt.token')
}));


jest.mock('@middleware/auth', () => ({
  authMiddleware: jest.fn((_c, next) => next()),
  requireRole: jest.fn(() => (_c, next) => next())
}));

describe('users routes', () => {
  const app = new Hono().route('/users', users);

  afterEach(() => jest.clearAllMocks());

  describe('POST /register', () => {
    it('registers a new user successfully', async () => {
      (prisma.person.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.person.create as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'user@mail.com',
        role: 'USER'
      });

      const res = await app.request('/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Admin',
          lastName: 'Badmin',
          email: 'user@mail.com',
          password: '123456'
        })
      });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.token).toBe('mocked.jwt.token');
      expect(prisma.person.create).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('registered'));
    });

    it('fails if email exists', async () => {
      (prisma.person.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

      const res = await app.request('/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Admin',
          lastName: 'Badmin',
          email: 'dup@mail.com',
          password: '123456'
        })
      });

      const data = await res.json();
      expect(res.status).toBe(409);
      expect(data.error).toContain('exists');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('already exists'));
    });
  });


  describe('POST /login', () => {
    it('logs in successfully', async () => {
      (prisma.person.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'u@mail.com',
        role: 'USER'
      });
      (prisma.password.findFirst as jest.Mock).mockResolvedValue({ hash: 'hashed_pw' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const res = await app.request('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'u@mail.com',
          password: '123456'
        })
      });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toBe('Login success');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('logged in'));
    });

    it('fails if user not found', async () => {
      (prisma.person.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await app.request('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'no@mail.com',
          password: '123456'
        })
      });

      const data = await res.json();
      expect(res.status).toBe(401);
      expect(data.error).toBe('Invalid email');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('not found'));
    });

    it('fails if no password set', async () => {
      (prisma.person.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: 'x@mail.com' });
      (prisma.password.findFirst as jest.Mock).mockResolvedValue(null);

      const res = await app.request('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'x@mail.com',
          password: '123456'
        })
      });

      const data = await res.json();
      expect(res.status).toBe(401);
      expect(data.error).toContain('No password set');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('no password set'));
    });

    it('fails if password invalid', async () => {
      (prisma.person.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: 'x@mail.com' });
      (prisma.password.findFirst as jest.Mock).mockResolvedValue({ hash: 'wrong' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const res = await app.request('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'x@mail.com',
          password: '123456'
        })
      });

      const data = await res.json();
      expect(res.status).toBe(401);
      expect(data.error).toBe('Invalid password');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('invalid password'));
    });
  });


  describe('POST /create-admin', () => {
    it('creates a new admin successfully', async () => {
      (prisma.person.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.person.create as jest.Mock).mockResolvedValue({
        id: 10,
        email: 'admin@mail.com',
        role: 'ADMIN'
      });

      const res = await app.request('/users/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Admin',
          lastName: 'admin',
          email: 'admin@mail.com',
          password: '123456'
        })
      });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toContain('Admin created');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('admin created'));
    });

    it('fails if email exists', async () => {
      (prisma.person.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

      const res = await app.request('/users/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Ad',
          lastName: 'Min',
          email: 'existing@mail.com',
          password: '123456'
        })
      });
      const data = await res.json();

      expect(res.status).toBe(409);
      expect(data.error).toContain('exists');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('already exists'));
    });
  });

  describe('PUT /users/:id', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('updates a user successfully', async () => {
      (prisma.person.findUnique as jest.Mock)
        .mockResolvedValueOnce({
          id: 66,
          firstName: 'Old',
          lastName: 'Name',
          email: 'old@mail.com',
          role: 'USER',
        })
        .mockResolvedValueOnce(null);

      (prisma.person.update as jest.Mock).mockResolvedValue({
        id: 66,
        firstName: 'Nancy',
        lastName: 'Smith',
        email: 'nancys@mail.com',
        role: 'USER',
      });

      const res = await app.request('/users/66', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Nancy',
          lastName: 'Smith',
          email: 'nancys@mail.com',
        }),
      });

      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toBe('User updated successfully');
      expect(data.user).toMatchObject({
        id: 66,
        firstName: 'Nancy',
        lastName: 'Smith',
        email: 'nancys@mail.com',
      });
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('User 66 updated successfully')
      );
    });

    it('updates a user successfully', async () => {
      (prisma.person.findUnique as jest.Mock).mockResolvedValue({
        id: 66,
        firstName: 'Old',
        lastName: 'Name',
        email: 'old@mail.com',
        role: 'USER',
      });

      (prisma.person.update as jest.Mock).mockResolvedValue({
        id: 66,
        firstName: 'Nancy',
        lastName: 'Smith',
        email: 'nancys@mail.com',
        role: 'USER',
      });

      const res = await app.request('/users/66', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Nancy',
          lastName: 'Smith',
          email: 'nancys@mail.com',
        }),
      });

      await res.json();

      expect(res.status).toBe(409);
    });


    it('returns 404 when user not found', async () => {
      (prisma.person.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await app.request('/users/123', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@mail.com',
        }),
      });

      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.error).toContain('User not found');
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Update failed: user with id 123 not found')
      );
    });

    it('returns 400 for invalid input', async () => {
      const res = await app.request('/users/66', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'not-an-email',
        }),
      });

      const data = await res.json();
      expect(res.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('handles unexpected errors gracefully', async () => {
      (prisma.person.findUnique as jest.Mock).mockResolvedValue({
        id: 99,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@mail.com',
        role: 'USER',
      });
      (prisma.person.update as jest.Mock).mockRejectedValue(new Error('DB error'));

      const res = await app.request('/users/99', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: 'Broken' }),
      });

      const data = await res.json();
      expect(res.status).toBe(500);
      expect(data.error).toContain('Failed to update user');
    });
  });

  describe('DELETE /users/:id', () => {
    it('deletes a user successfully', async () => {
      (prisma.person.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.person.delete as jest.Mock).mockResolvedValue({ id: 1 });

      const res = await app.request('/users/1', { method: 'DELETE' });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.message).toContain('deleted');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('deleted'));
    });

    it('returns 400 for invalid ID', async () => {
      const res = await app.request('/users/abc', { method: 'DELETE' });
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe('Invalid user ID');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid user ID'));
    });

    it('returns 404 if user not found', async () => {
      (prisma.person.findUnique as jest.Mock).mockResolvedValue(null);
      const res = await app.request('/users/999', { method: 'DELETE' });
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.error).toContain('not found');
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('not found'));
    });
  });

  describe('GET /users', () => {
    it('returns all users', async () => {
      (prisma.person.findMany as jest.Mock).mockResolvedValue([
        { id: 1, firstName: 'personA', lastName: 'personAA', email: 'personA@gmail.com' },
        { id: 1, firstName: 'personB', lastName: 'personBB', email: 'personB@gmail.com' },
      ]);

      const res = await app.request('/users');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Returning all users (2)'));
    });
  });
});
