import z from 'zod';
import { HttpMethod } from '@prisma/client';

export const createPermissionDto = z.strictObject({
  name: z.string(),
  path: z.string(),
  method: z.nativeEnum(HttpMethod),
  moduel: z.string(),
});

export const updatePermissionDto = z.strictObject({
  name: z.string().optional(),
  path: z.string().optional(),
  method: z.nativeEnum(HttpMethod).optional(),
  moduel: z.string().optional(),
});
