import z from 'zod';
import { UserStatus } from '@prisma/client';

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  password: z.string(),
  name: z.string(),
  phoneNumber: z.string().nullable(),
  avatar: z.string().nullable(),
  totpSecret: z.string().nullable(),
  status: z.nativeEnum(UserStatus),
  roleId: z.number(),

  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
});

export const userTranslationSchema = z.object({
  id: z.number(),
  address: z.string(),
  desc: z.string(),
  userId: z.number(),
  languageId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
