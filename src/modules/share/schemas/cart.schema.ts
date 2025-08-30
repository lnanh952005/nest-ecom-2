import z from 'zod';

export const cartItemSchema = z.object({
  id: z.number(),
  quantity: z.number(),
  skuId: z.number(),
  userId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
