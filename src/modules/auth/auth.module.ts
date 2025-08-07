import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { GoogleService } from './services/google.service';
import { TwoFactorAuthService } from './services/twoFactorAuth.service';
import { VerificationCodeService } from './services/verificationCode.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleService,
    TwoFactorAuthService,
    VerificationCodeService,
  ],
})
export class AuthModule {}
