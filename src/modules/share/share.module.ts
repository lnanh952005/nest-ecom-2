import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PasswordEncoderService } from './passwordEncoder.service';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { EnvService } from './env.service';

@Global()
@Module({
  imports: [JwtModule],
  providers: [PrismaService, PasswordEncoderService, TokenService,EnvService],
  exports: [PrismaService, PasswordEncoderService, TokenService,EnvService],
})
export class ShareModule {}
