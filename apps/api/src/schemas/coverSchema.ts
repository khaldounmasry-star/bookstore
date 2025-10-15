import { z } from 'zod';

export const createCoverInput = z.object({
  imageUrl: z.url().optional(),
  imageUrls: z.array(z.url()).min(1).optional()
}).refine((v) => !!v.imageUrl || (v.imageUrls && v.imageUrls.length > 0), {
  message: 'Provide imageUrl or imageUrls[]'
});

export const updateCoverInput = z.object({
  imageUrl: z.url()
});
