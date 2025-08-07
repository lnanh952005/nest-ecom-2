import { Injectable } from '@nestjs/common';
import {
  CreateUserDtoType,
  UpdateUserDtoType,
} from 'src/modules/user/user.type';
import { PrismaService } from '../services/prisma.service';
import { UpdateProfileDtoType } from 'src/modules/profile/profile.type';
import { RegisterDtoType } from 'src/modules/auth/auth.type';

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
    includeRole = false,
  }: {
    unique: { email: string } | { id: number };
    includeRole?: boolean;
  }) {
    return await this.prismaService.user.findUniqueOrThrow({
      where: {
        ...unique,
      },
      include: includeRole ? { role: true } : {},
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

  async create(
    data:
      | (Omit<RegisterDtoType, 'code'> & { roleId: number })
      | CreateUserDtoType,
  ) {
    return await this.prismaService.user.create({
      data: {
        ...data,
      },
    });
  }

  async updateByIdOrEmail({
    unique,
    data,
  }: {
    unique: { id: number } | { email: string };
    data:
      | UpdateUserDtoType
      | { totpSecret: string | null }
      | { password: string }
      | UpdateProfileDtoType;
  }) {
    return await this.prismaService.user.update({
      where: { ...unique },
      data: {
        ...data,
      },
    });
  }

  async deleteById(id: number) {
    await this.prismaService.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
