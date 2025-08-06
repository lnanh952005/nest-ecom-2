import { Injectable } from '@nestjs/common';
import {
  CreatePermissionDtoType,
  UpdatePermissionDtoType,
} from 'src/modules/permission/permission.type';
import { PrismaService } from '../services/prisma.service';

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
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.permission.count({
        where: {
          deletedAt: null,
        },
      }),
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

  async updateById({
    data,
    id,
  }: {
    id: number;
    data: UpdatePermissionDtoType;
  }) {
    return await this.prismaService.permission.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async create(data: CreatePermissionDtoType) {
    return await this.prismaService.permission.create({
      data: { ...data },
    });
  }

  async deleteById(id: number) {
    await this.prismaService.permission.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
