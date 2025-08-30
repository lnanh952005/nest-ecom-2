import { Injectable } from '@nestjs/common';
import {
  CreateCategoryTranslationDto,
  UpdateCategoryTranslationDto,
} from '@category/dtos/category.request';
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

  create(data: CreateCategoryTranslationDto) {
    return this.prismaService.categoryTranslation.create({
      data,
    });
  }

  updateById({ data, id }: { id: number; data: UpdateCategoryTranslationDto }) {
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
