import { Injectable } from '@nestjs/common';
import { VerificationCodeType } from '@prisma/client';
import { PrismaService } from '@share/services/prisma.service';

@Injectable()
export class VerificationCodeRepository {
  constructor(private prismaService: PrismaService) {}

  async findByEmailAndCodeAndType(data: {
    email: string;
    type: VerificationCodeType;
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
    where: { email: string; type: VerificationCodeType };
    create: {
      email: string;
      type: VerificationCodeType;
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
