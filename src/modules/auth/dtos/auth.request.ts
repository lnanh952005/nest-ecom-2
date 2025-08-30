import z from 'zod';
import { VerificationCodeType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';

const registerDto = z.strictObject({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  code: z.string().length(6),
});

const loginDto = registerDto
  .pick({
    email: true,
    password: true,
  })
  .extend({
    totpCode: z.string().length(6).optional(), // 2FA totp code
    // code: z.string().length(6).optional(), // otp code
  });

const refreshTokenDto = z.strictObject({
  token: z.string(),
});

const sendOtpDto = z.strictObject({
  email: z.string().email(),
  type: z.nativeEnum(VerificationCodeType),
});

const forgotPasswordDto = z.strictObject({
  email: z.string().email(),
  code: z.string(),
  newPassword: z.string().min(6).max(30),
});

const disable2FaDto = z.strictObject({
  totpCode: z.string().length(6),
});

const reset2FaDto = z.strictObject({
  email: z.string().email(),
  code: z.string().length(6),
});

export class RegisterDto extends createZodDto(registerDto) {}
export class LoginDto extends createZodDto(loginDto) {}
export class RefreshTokenDto extends createZodDto(refreshTokenDto) {}
export class SendOtpDto extends createZodDto(sendOtpDto) {}
export class ForgotPasswordDto extends createZodDto(forgotPasswordDto) {}
export class Disable2FaDto extends createZodDto(disable2FaDto) {}
export class Reset2FaDto extends createZodDto(reset2FaDto) {}
