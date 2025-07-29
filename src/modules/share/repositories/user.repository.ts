import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from '../services/prisma.service';
import { UpdateUser } from 'src/modules/user/user.dto';

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

  async updateByid(id: number, updateUser: UpdateUser) {
    await this.prismaService.user.update({
      where: { id },
      data: {
        ...updateUser,
      },
    });
  }

  async createUser(
    user:
      | (Prisma.Without<
          Prisma.UserCreateInput,
          Prisma.UserUncheckedCreateInput
        > &
          Prisma.UserUncheckedCreateInput)
      | (Prisma.Without<
          Prisma.UserUncheckedCreateInput,
          Prisma.UserCreateInput
        > &
          Prisma.UserCreateInput),
  ) {
    return await this.prismaService.user.create({
      data: user,
    });
  }
}
