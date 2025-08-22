import { Injectable } from '@nestjs/common';
import {
  CreateBrandDtoType,
  UpdateBrandDtoType,
} from 'src/modules/brand/brand.type';
import { PrismaService } from 'src/modules/share/services/prisma.service';

@Injectable()
export class BrandRepository {
  constructor(private prismaService: PrismaService) {}

  async findById({ id, languageId }: { id: number; languageId: string }) {
    return await this.prismaService.brand.findUniqueOrThrow({
      where: { id },
      include: {
        brandTranslations: {
          where: languageId == 'all' ? {} : { languageId },
        },
      },
    });
  }

  async findAll({
    page,
    limit,
    languageId,
  }: {
    page: number;
    limit: number;
    languageId: string;
  }) {
    const [items, totalItems] = await Promise.all([
      this.prismaService.brand.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { deletedAt: null },
        include: {
          brandTranslations: {
            where: languageId == 'all' ? {} : { languageId },
          },
        },
      }),
      this.prismaService.brand.count({
        where: { deletedAt: null },
      }),
    ]);
    return {
      items,
      totalItems,
    };
  }

  async create(data: CreateBrandDtoType) {
    return await this.prismaService.brand.create({
      data: data,
    });
  }

  async updateById({ data, id }: { id: number; data: UpdateBrandDtoType }) {
    return await this.prismaService.brand.update({
      where: { id },
      data,
    });
  }

  async deleteById(id: number) {
    await this.prismaService.brand.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
