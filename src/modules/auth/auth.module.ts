import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from './service/email.service';
import { GoogleService } from './service/google.service';
import { VerificationCodeService } from './service/verificationCode.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    GoogleService,
    VerificationCodeService,
  ],
})
export class AuthModule {}
