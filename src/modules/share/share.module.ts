import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '@user/user.module';

import { AuthModule } from '@auth/auth.module';
import { EmailService } from 'src/modules/share/services/email.service';
import { S3Service } from 'src/modules/share/services/s3.service';
import { EnvService } from './services/env.service';
import { PasswordEncoderService } from './services/passwordEncoder.service';
import { PrismaService } from './services/prisma.service';
import { TokenService } from './services/token.service';

const Service = [
  PrismaService,
  PasswordEncoderService,
  TokenService,
  EnvService,
  EmailService,
  S3Service,
];

@Global()
@Module({
  imports: [JwtModule, UserModule, AuthModule],
  providers: [...Service],
  exports: [...Service],
})
export class ShareModule {}
