import z from 'zod';
import { userSerialization } from '../user/user.model';
import { VerificationType } from 'generated/prisma';

export const loginSchema = z.strictObject({
  email: z.string().email(),
  password: z.string(),
});

export const registerSchema = loginSchema.extend({
  name: z.string(),
  phoneNumber: z.string(),
  code: z.string().length(6)
});

export const refreshSchema = z.strictObject({
  token: z.string(),
});

export const sendOtpSchema = z.strictObject({
  email: z.string().email(),
  type: z.nativeEnum(VerificationType),
});

export const profileSerialization = userSerialization.omit({
  createdAt: true,
  updatedAt: true,
  status: true,
  roleId: true,
});
