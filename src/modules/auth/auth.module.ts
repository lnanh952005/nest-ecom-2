import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from './services/email.service';
import { GoogleService } from './services/google.service';
import { VerificationCodeService } from './services/verificationCode.service';
import { TwoFactorAuthService } from './services/twoFactorAuth.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    GoogleService,
    TwoFactorAuthService,
    VerificationCodeService,
  ],
})
export class AuthModule {}
