import { createZodDto } from 'nestjs-zod';
import {
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  sendOtpSchema,
} from './auth.model';

export class LoginDto extends createZodDto(loginSchema) {}
export class RegisterDto extends createZodDto(registerSchema) {}
export class RefreshTokenDto extends createZodDto(refreshSchema) {}
export class SendOtpDto extends createZodDto(sendOtpSchema) {}
export class ForgotPasswordDto extends createZodDto(forgotPasswordSchema) {}
