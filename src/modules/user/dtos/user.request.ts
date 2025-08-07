import z from 'zod';
import { UserStatus } from '@prisma/client';

const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  password: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  avatar: z.string().nullable(),
  totpSecret: z.string().nullable(),
  status: z.nativeEnum(UserStatus),
  roleId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserDto = z.strictObject({
  email: z.string().email(),
  password: z.string().min(6).max(30),
  name: z.string(),
  phoneNumber: z.string().optional(),
  avatar: z.string().optional(),
  status: z.nativeEnum(UserStatus),
  roleId: z.number(),
});

export const updateUserDto = z.strictObject({
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  avatar: z.string().optional(),
  status: z.nativeEnum(UserStatus).optional(),
  roleId: z.number().optional(),
});
