import { Injectable } from '@nestjs/common';
import {
  CreateBrandTranslationDtoType,
  UpdateBrandTranslationDtoType,
} from 'src/modules/brand/brand.type';
import { PrismaService } from 'src/modules/share/services/prisma.service';

@Injectable()
export class BrandTranslationRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateBrandTranslationDtoType) {
    return await this.prismaService.brandTranslation.create({
      data,
    });
  }

  async findById(id: number) {
    return await this.prismaService.brandTranslation.findUniqueOrThrow({
      where: { id },
    });
  }

  async findAll({ page, limit }: { page: number; limit: number }) {
    const [items, totalItems] = await Promise.all([
      this.prismaService.brandTranslation.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.brandTranslation.count(),
    ]);
    return { items, totalItems };
  }

  async updateById({
    data,
    id,
  }: {
    id: number;
    data: UpdateBrandTranslationDtoType;
  }) {
    return await this.prismaService.brandTranslation.update({
      where: { id },
      data,
    });
  }

  async deleteById(id: number) {
    await this.prismaService.brandTranslation.delete({
      where: { id },
    });
  }
}
