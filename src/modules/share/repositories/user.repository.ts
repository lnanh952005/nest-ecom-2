import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async findById(id: number) {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async isPhoneNumberExisting(phoneNumber: string) {
    return await this.prismaService.user.findUnique({
      where: {
        phoneNumber,
      },
    });
  }

  async create(
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>,
    include?: Prisma.UserInclude<DefaultArgs>,
  ) {
    return await this.prismaService.user.create({
      data: {
        ...data,
      },
      include: {
        ...include,
      },
    });
  }

  async updateById({
    id,
    data,
  }: {
    id: number;
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
  }) {
    return await this.prismaService.user.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }
}
