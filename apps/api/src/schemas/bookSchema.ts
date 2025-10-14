import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  author: z.string().min(2, 'Author must be at least 2 characters'),
  description: z.string().max(1000).optional(),
  genre: z.string().max(100).optional(),
  year: z
    .number({ error: 'Year must be a number' })
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),
  rating: z
    .number({ error: 'Rating must be a number' })
    .min(0)
    .max(5)
    .optional(),
  price: z
    .number({ error: 'Price must be a number' })
    .positive('Price must be positive')
    .optional(),
  sku: z.string().max(50).optional(),
  covers: z.array(z.string()).optional()
});

export const updateBookSchema = createBookSchema.partial();
