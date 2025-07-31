import { VerificationType } from '@prisma/client';
import z from 'zod';

export const loginSchema = z.strictObject({
  email: z.string().email(),
  password: z.string(),
});

export const registerSchema = loginSchema.extend({
  name: z.string(),
  code: z.string().length(6),
});

export const refreshSchema = z.strictObject({
  token: z.string(),
});

export const sendOtpSchema = z.strictObject({
  email: z.string().email(),
  type: z.nativeEnum(VerificationType),
});

export const forgotPasswordSchema = z.strictObject({
  email: z.string().email(),
  code: z.string(),
  newPassword: z.string().min(6).max(30),
});

export const profileSerialization = z.object({
  email: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  avatar: z.string().nullable(),
});
