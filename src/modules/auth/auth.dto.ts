import z from 'zod';
import { createZodDto } from 'nestjs-zod';

const loginSchema = z.strictObject({
  email: z.string().email(),
  password: z.string(),
});

const registerSchema = loginSchema.extend({
  name: z.string(),
  phoneNumber: z.string(),
});

const refreshTokenSchema = z.strictObject({
  token: z.string(),
});

export class LoginDto extends createZodDto(loginSchema) {}
export class RegisterDto extends createZodDto(registerSchema) {}
export class RefreshTokenDto extends createZodDto(refreshTokenSchema) {}

export type LoginType = z.infer<typeof loginSchema>;
export type RegisterType = z.infer<typeof registerSchema>;
export type RefreshTokenType = z.infer<typeof refreshTokenSchema>;
