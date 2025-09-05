import { Injectable } from '@nestjs/common';

import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '@permission/dtos/permission.request';
import { PrismaService } from '@share/services/prisma.service';

@Injectable()
export class PermissionRepository {
  constructor(private prismaService: PrismaService) {}

  async findById(id: number) {
    return await this.prismaService.permission.findUnique({
      where: { id },
    });
  }

  async findAll({ limit, page }: { page: number; limit: number }) {
    const [items, totalItems] = await Promise.all([
      this.prismaService.permission.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.permission.count(),
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    return {
      page,
      limit,
      totalPages,
      totalItems,
      items,
    };
  }

  async create(data: CreatePermissionDto) {
    return await this.prismaService.permission.create({
      data: { ...data },
    });
  }

  async updateById({ data, id }: { id: number; data: UpdatePermissionDto }) {
    return await this.prismaService.permission.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async deleteById(id: number) {
    await this.prismaService.permission.delete({
      where: { id },
    });
  }
}
