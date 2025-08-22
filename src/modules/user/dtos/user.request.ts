import z from 'zod';
import { UserStatus } from '@prisma/client';

export const createUserDto = z.strictObject({
  email: z.string().email(),
  password: z.string().min(6).max(30),
  name: z.string(),
  avatar: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  status: z.nativeEnum(UserStatus),
  roleId: z.number(),
});

export const updateUserDto = createUserDto;
