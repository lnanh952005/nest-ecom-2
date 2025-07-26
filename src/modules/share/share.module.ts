import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PasswordEncoderService } from './passwordEncoder.service';

@Global()
@Module({
  providers: [PrismaService, PasswordEncoderService],
  exports: [PrismaService, PasswordEncoderService],
})
export class ShareModule {}
