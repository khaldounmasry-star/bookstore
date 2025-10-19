import { z } from 'zod';

export const createPersonSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name too long'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name too long'),
  email: z
    .email('Invalid email format')
    .max(255, 'Email too long'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(24, 'Password too long'),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).default('USER')
});

export const getPersonSchema = z.object({
  email: z
    .email('Invalid email format')
    .max(255, 'Email too long'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(24, 'Password too long')
});

export const updatePersonSchema = createPersonSchema
  .partial()
  .extend({
    id: z.number().positive().optional()
  });

export const updatePasswordSchema = z.object({
  id: z.number().positive(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});
