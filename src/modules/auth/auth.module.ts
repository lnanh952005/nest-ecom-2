import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { GoogleService } from './services/google.service';
import { TwoFactorAuthService } from './services/twoFactorAuth.service';
import { VerificationCodeService } from './services/verificationCode.service';
import { UserModule } from '@user/user.module';
import { RoleModule } from '@role/role.module';
import { RefreshTokenRepository } from '@auth/repositories/refreshToken.repository';

import { DeviceRepository } from '@auth/repositories/device.repository';
import { VerificationCodeRepository } from '@auth/repositories/verificationCode.repository';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleService,
    TwoFactorAuthService,
    VerificationCodeService,
    // repository
    DeviceRepository,
    RefreshTokenRepository,
    VerificationCodeRepository,
  ],
  imports: [UserModule, RoleModule],
  exports: [VerificationCodeRepository],
})
export class AuthModule {}
