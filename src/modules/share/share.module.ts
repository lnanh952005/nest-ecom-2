import { JwtModule } from '@nestjs/jwt';
import { Global, Module } from '@nestjs/common';

import { EnvService } from './services/env.service';
import { TokenService } from './services/token.service';
import { PrismaService } from './services/prisma.service';
import { UserRepository } from './repositories/user.repository';
import { RoleRepository } from './repositories/role.repository';
import { PasswordEncoderService } from './services/passwordEncoder.service';
import { VerificationCodeRepository } from './repositories/verificationCode.repository';
import { RefreshTokenRepository } from './repositories/refreshToken.repository';
import { DeviceRepository } from './repositories/device.repository';
import { LanguageRepository } from './repositories/language.repository';
import { PermissionRepository } from 'src/modules/share/repositories/permission.repository';
import { EmailService } from 'src/modules/share/services/email.service';

const Service = [
  PrismaService,
  PasswordEncoderService,
  TokenService,
  EnvService,
  EmailService
];
const Repository = [
  UserRepository,
  PermissionRepository,
  RoleRepository,
  VerificationCodeRepository,
  RefreshTokenRepository,
  DeviceRepository,
  LanguageRepository
];

@Global()
@Module({
  imports: [JwtModule],
  providers: [...Service, ...Repository],
  exports: [...Service, ...Repository],
})
export class ShareModule {}
