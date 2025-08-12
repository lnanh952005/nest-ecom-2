import { Injectable } from '@nestjs/common';
import {
  CreateCategoryDtoType,
  CreateCategoryTranslationDtoType,
  UpdateCategoryDtoType,
  UpdateCategoryTranslationDtoType,
} from 'src/modules/category/category.type';
import { PrismaService } from 'src/modules/share/services/prisma.service';

@Injectable()
export class CategoryTranslationRepository {
  constructor(private prismaService: PrismaService) {}

  findAll({ languageId }: { languageId: string }) {
    return this.prismaService.categoryTranslation.findMany({
      where: languageId == 'all' ? {} : { languageId },
    });
  }

  findById(id: number) {
    return this.prismaService.categoryTranslation.findUniqueOrThrow({
      where: { id },
    });
  }

  create(data: CreateCategoryTranslationDtoType) {
    return this.prismaService.categoryTranslation.create({
      data,
    });
  }

  updateById({
    data,
    id,
  }: {
    id: number;
    data: UpdateCategoryTranslationDtoType;
  }) {
    return this.prismaService.categoryTranslation.update({
      where: { id },
      data,
    });
  }

  deleteById(id: number) {
    return this.prismaService.category.delete({
      where: { id },
    });
  }
}
