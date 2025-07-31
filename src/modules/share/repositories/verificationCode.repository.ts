import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class VerificationCodeRepository {
  constructor(private prismaService: PrismaService) {}

  async findByEmailAndCodeAndType(
    data: Pick<
      Prisma.VerificationCodeWhereUniqueInput,
      'email' | 'type' | 'code'
    >,
  ) {
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
    where: Prisma.VerificationCodeWhereUniqueInput;
    create: Prisma.XOR<
      Prisma.VerificationCodeCreateInput,
      Prisma.VerificationCodeUncheckedCreateInput
    >;
    update: Prisma.XOR<
      Prisma.VerificationCodeUpdateInput,
      Prisma.VerificationCodeUncheckedUpdateInput
    >;
  }) {
    return await this.prismaService.verificationCode.upsert({
      where: {
        ...where,
      },
      create: {
        ...create,
      },
      update: {
        ...update,
      },
    });
  }
}
