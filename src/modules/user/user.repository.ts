import { Injectable } from '@nestjs/common';

import { RegisterDto } from '@auth/dtos/auth.request';
import { PrismaService } from '../share/services/prisma.service';
import { UpdateProfileDto } from '@profile/dtos/profile.request';
import { CreateUserDto, UpdateUserDto } from '@user/dtos/user.request';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findAll({ limit, page }: { page: number; limit: number }) {
    const [items, totalItems] = await Promise.all([
      this.prismaService.user.findMany({
        where: { deletedAt: null },
        include: { role: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.user.count({
        where: { deletedAt: null },
      }),
    ]);
    return {
      items,
      totalItems,
    };
  }

  async findByIdOrEmail({
    unique,
  }: {
    unique: { email: string } | { id: number };
  }) {
    return await this.prismaService.user.findUniqueOrThrow({
      where: unique,
    });
  }

  getUserDetailById(id: number) {
    return this.prismaService.user.findUniqueOrThrow({
      where: { id },
      include: {
        role: true,
      },
    });
  }

  async isPhoneNumberExisting(phoneNumber: string) {
    await this.prismaService.user.findUniqueOrThrow({
      where: {
        phoneNumber,
      },
    });
  }

  async isEmailExisting(email: string) {
    await this.prismaService.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
  }

  register(data: Omit<RegisterDto, 'code'> & { roleId: number }) {
    return this.prismaService.user.create({
      data,
    });
  }

  create(data: CreateUserDto) {
    return this.prismaService.user.create({
      data,
    });
  }

  async updateById({
    id,
    data,
  }: {
    id: number;
    data: UpdateUserDto | { totpSecret: string | null } | { password: string };
  }) {
    return await this.prismaService.user.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async updateByEmail({
    email,
    data,
  }: {
    email: string;
    data: UpdateUserDto | { totpSecret: string | null } | { password: string };
  }) {
    return await this.prismaService.user.update({
      where: { email },
      data: {
        ...data,
      },
    });
  }

  updateProfile({ data, id }: { id: number; data: UpdateProfileDto }) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteById(id: number) {
    await this.prismaService.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
