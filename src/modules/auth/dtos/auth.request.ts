import z from 'zod';
import { VerificationType } from '@prisma/client';

export const loginDto = z.strictObject({
  email: z.string().email(),
  password: z.string(),
  totpCode: z.string().length(6).optional(), // 2FA totp code
  // code: z.string().length(6).optional(), // otp code
});

export const registerDto = loginDto.extend({
  name: z.string(),
  code: z.string().length(6),
});
export const refreshTokenDto = z.strictObject({
  token: z.string(),
});
export const sendOtpDto = z.strictObject({
  email: z.string().email(),
  type: z.nativeEnum(VerificationType),
});

export const forgotPasswordDto = z.strictObject({
  email: z.string().email(),
  code: z.string(),
  newPassword: z.string().min(6).max(30),
});

export const disable2FaDto = z.strictObject({
  totpCode: z.string().length(6),
});

export const reset2FaDto = z.strictObject({
  email: z.string().email(),
  code: z.string().length(6),
});
