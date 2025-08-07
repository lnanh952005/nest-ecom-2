import z from 'zod';
import { UserStatus } from '@prisma/client';

export const userResDto = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  avatar: z.string().nullable(),
  status: z.nativeEnum(UserStatus),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  role: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export const userListResDto = z.object({
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  items: z.array(
    userResDto.pick({
      id: true,
      email: true,
      name: true,
      status: true,
      role: true,
    }),
  ),
});
