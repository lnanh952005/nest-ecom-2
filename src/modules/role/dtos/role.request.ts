import z from 'zod';
import { RoleEnum } from '@prisma/client';

const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  desc: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const createRoleDto = z.strictObject({
  name: z.nativeEnum(RoleEnum),
  desc: z.string().optional(),
});

export const updateRoleDto = z.strictObject({
  name: z.nativeEnum(RoleEnum).optional(),
  desc: z.string().optional(),
  permissionIds: z.array(z.number()).optional(),
});
