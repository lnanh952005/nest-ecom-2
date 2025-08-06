import z from 'zod';
import { UserStatus } from '@prisma/client';

export const userResDto = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  avatar: z.string().nullable(),
  totpSecret: z.string().nullable(),
  status: z.nativeEnum(UserStatus),
  roleId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userListResDto = z.array(
  userResDto.pick({
    id: true,
    email: true,
    name: true,
    status: true,
    roleId: true,
  }),
);
