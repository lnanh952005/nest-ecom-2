import z from 'zod';
import { OrderStatus } from '@prisma/client';

export const orderSchema = z.object({
  id: z.number(),
  userId: z.number().nullable(),
  shopId: z.number().nullable(),
  status: z.nativeEnum(OrderStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});
