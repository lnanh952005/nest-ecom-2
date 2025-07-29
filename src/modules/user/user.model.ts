import z from 'zod';
import { UserStatus } from 'generated/prisma';

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

export const createUserSchema = userSchema
  .extend({
    email: z.string().email(),
    password: z.string().min(6).max(30),
    avatar: z.string().optional(),
    totpSecret: z.string().optional(),
  })
  .omit({
    createdAt: true,
    updatedAt: true,
  }).strict();

export const updateUserSchema = createUserSchema.omit({
  email: true,
}).strict();

export const userSerialization = userSchema.omit({
  password: true,
  totpSecret: true,
});

export const userListSerialization = z.array(userSerialization);
