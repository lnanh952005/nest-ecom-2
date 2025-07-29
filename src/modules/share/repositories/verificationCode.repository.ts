import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
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
    create:
      | (Prisma.Without<
          Prisma.VerificationCodeCreateInput,
          Prisma.VerificationCodeUncheckedCreateInput
        > &
          Prisma.VerificationCodeUncheckedCreateInput)
      | (Prisma.Without<
          Prisma.VerificationCodeUncheckedCreateInput,
          Prisma.VerificationCodeCreateInput
        > &
          Prisma.VerificationCodeCreateInput);
    update:
      | (Prisma.Without<
          Prisma.VerificationCodeUpdateInput,
          Prisma.VerificationCodeUncheckedUpdateInput
        > &
          Prisma.VerificationCodeUncheckedUpdateInput)
      | (Prisma.Without<
          Prisma.VerificationCodeUncheckedUpdateInput,
          Prisma.VerificationCodeUpdateInput
        > &
          Prisma.VerificationCodeUpdateInput);
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
