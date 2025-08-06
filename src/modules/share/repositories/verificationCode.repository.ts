import { Injectable } from '@nestjs/common';
import { VerificationType } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class VerificationCodeRepository {
  constructor(private prismaService: PrismaService) {}

  async findByEmailAndCodeAndType(data: {
    email: string;
    type: VerificationType;
    code: string;
  }) {
    return await this.prismaService.verificationCode.findUnique({
      where: {
        email: data.email,
        code: data.code,
        type: data.type,
      },
    });
  }

  async deleteById(id: number) {
    await this.prismaService.verificationCode.delete({
      where: {
        id,
      },
    });
  }

  async upsertVerificationCode({
    where,
    create,
    update,
  }: {
    where: { email: string; type: VerificationType };
    create: {
      email: string;
      type: VerificationType;
      code: string;
      expireAt: Date;
    };
    update: {
      code: string;
      expireAt: Date;
    };
  }) {
    return await this.prismaService.verificationCode.upsert({
      where,
      create,
      update,
    });
  }
}
