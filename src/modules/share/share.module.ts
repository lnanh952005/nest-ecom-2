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

const Service = [
  PrismaService,
  PasswordEncoderService,
  TokenService,
  EnvService,
];
const Repository = [
  UserRepository,
  RoleRepository,
  VerificationCodeRepository,
  RefreshTokenRepository,
  DeviceRepository
];

@Global()
@Module({
  imports: [JwtModule],
  providers: [...Service, ...Repository],
  exports: [...Service, ...Repository],
})
export class ShareModule {}
