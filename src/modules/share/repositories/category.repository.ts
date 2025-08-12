import { Injectable } from '@nestjs/common';
import {
  CreateCategoryDtoType,
  UpdateCategoryDtoType,
} from 'src/modules/category/category.type';
import { PrismaService } from 'src/modules/share/services/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private prismaService: PrismaService) {}

  findAll({
    parentCategoryId,
    languageId,
  }: {
    parentCategoryId?: number;
    languageId: string;
  }) {
    return this.prismaService.category.findMany({
      where: {
        parentCategoryId,
        deletedAt: null,
      },
      include: {
        categoryTranslations: {
          where: languageId == 'all' ? {} : { languageId },
        },
      },
    });
  }

  findById({ id, languageId }: { id: number; languageId: string }) {
    return this.prismaService.category.findUniqueOrThrow({
      where: { id, deletedAt: null },
      include: {
        categoryTranslations: {
          where: languageId == 'all' ? {} : { languageId },
        },
      },
    });
  }

  create(data: CreateCategoryDtoType) {
    return this.prismaService.category.create({
      data,
    });
  }

  updateById({ data, id }: { id: number; data: UpdateCategoryDtoType }) {
    return this.prismaService.category.update({
      where: { id },
      data,
    });
  }

  deleteById(id: number) {
    return this.prismaService.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
