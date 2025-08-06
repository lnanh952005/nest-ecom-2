import { Injectable } from '@nestjs/common';
import {
  CreateUserDtoType,
  UpdateUserDtoType,
} from 'src/modules/user/user.type';
import { PrismaService } from '../services/prisma.service';
import { UpdateProfileDtoType } from 'src/modules/profile/profile.type';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async findByIdOrEmail(unique: { email: string } | { id: number }) {
    return await this.prismaService.user.findUnique({
      where: {
        ...unique,
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
    data: CreateUserDtoType | (CreateUserDtoType & { avatar: string }),
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
}
