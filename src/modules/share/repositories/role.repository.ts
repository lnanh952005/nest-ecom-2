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

  async findById({
    id,
    includePermission = false,
  }: {
    id: number;
    includePermission?: boolean;
  }): Promise<any> {
    if (includePermission) {
      return await this.prismaService.role.findUniqueOrThrow({
        where: {
          id,
          deletedAt: null,
        },
        include: {
          permissionRoles: {
            include: {
              permission: true,
            },
          },
        },
      });
    }
    return await this.prismaService.role.findUniqueOrThrow({
      where: {
        id,
        deletedAt: null,
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
      if (data.permissionIds) {
        const [permissions] = await Promise.all([
          tx.permission.findMany({
            where: {
              id: {
                in: data.permissionIds,
              },
            },
          }),
          tx.permissionRole.deleteMany({
            where: {
              roleId: id,
            },
          }),
        ]);
        await tx.permissionRole.createMany({
          data: permissions.map((e) => ({ permissionId: e.id, roleId: id })),
        });
      }
      return await tx.role.update({
        where: {
          id,
        },
        data: {
          name: data.name,
          desc: data.desc,
        },
        include: {
          permissionRoles: {
            include: {
              permission: true,
            },
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
