import { Injectable } from '@nestjs/common';
import { Prisma, RoleEnum, User } from '@prisma/client';

import {
  CreateRoleDtoType,
  UpdateRoleDtoType,
} from 'src/modules/role/role.type';
import { PrismaService } from 'src/modules/share/services/prisma.service';

@Injectable()
export class RoleRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateRoleDtoType) {
    return await this.prismaService.role.create({
      data,
    });
  }

  async findAll() {
    return await this.prismaService.role.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findById(id: number) {
    return await this.prismaService.role.findUniqueOrThrow({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async getDetailById(id: number) {
    return await this.prismaService.role.findUniqueOrThrow({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        permissions: true,
      },
    });
  }

  async findByName(name: RoleEnum) {
    return await this.prismaService.role.findUnique({
      where: {
        name,
        deletedAt: null,
      },
    });
  }

  async updateById({ id, data }: { id: number; data: UpdateRoleDtoType }) {
    return await this.prismaService.$transaction(async (tx) => {
      const permission = await this.prismaService.permission.findMany({
        where: {
          id: {
            in: data.permissionIds,
          },
        },
      });
      return await tx.role.update({
        where: {
          id,
        },
        data: {
          name: data.name,
          desc: data.desc,
          permissions: {
            set: permission,
          },
        },
      });
    });
  }

  async deleteById(id: number) {
    await this.prismaService.role.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
