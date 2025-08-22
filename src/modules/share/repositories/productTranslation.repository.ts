import { Injectable } from '@nestjs/common';
import {
  CreateProductTranslationDtoType,
  UpdateProductTranslationDtoType,
} from 'src/modules/product/product.type';
import { PrismaService } from 'src/modules/share/services/prisma.service';

@Injectable()
export class ProductTranslationRepository {
  constructor(private prismaService: PrismaService) {}

  findById({ id, languageId }: { id: number; languageId: string }) {
    return this.prismaService.productTranslation.findUniqueOrThrow({
      where: languageId == 'all' ? { id } : { id, languageId },
      include: {
        language: {
          include: {
            brandTranslations: {
              where: languageId == 'all' ? {} : { languageId },
            },
            categoryTranslations: {
              where: languageId == 'all' ? {} : { languageId },
            },
          },
        },
      },
    });
  }

  create(data: CreateProductTranslationDtoType) {
    return this.prismaService.productTranslation.create({
      data,
    });
  }

  updateById({
    data,
    id,
  }: {
    id: number;
    data: UpdateProductTranslationDtoType;
  }) {
    return this.prismaService.productTranslation.update({
      where: { id },
      data,
    });
  }

  deleteById(id: number) {
    return this.prismaService.productTranslation.delete({
      where: { id },
    });
  }
}
