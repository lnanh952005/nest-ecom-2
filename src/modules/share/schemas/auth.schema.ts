import z from 'zod';
import { HttpMethod, VerificationCodeType } from '@prisma/client';

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
});

export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  desc: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const permissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  desc: z.string().nullable(),
  path: z.string(),
  method: z.nativeEnum(HttpMethod),
  module: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const deviceSchema = z.object({
  id: z.number(),
  ip: z.string(),
  userAgent: z.string(),
  isActive: z.boolean(),
  userId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const verificationCodeSchema = z.object({
  id: z.number(),
  email: z.string(),
  code: z.string(),
  type: z.nativeEnum(VerificationCodeType),
  createdAt: z.date(),
  expireAt: z.date(),
});
