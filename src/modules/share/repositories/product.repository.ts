import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import {
  CreateProductDtoType,
  GetProductManagementQueryDtoType,
  GetProductQueryDtoType,
  UpdateProductDtoType,
} from 'src/modules/product/product.type';
import { PrismaService } from 'src/modules/share/services/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private prismaService: PrismaService) {}

  async findAll({
    languageId,
    query,
    isPublish,
  }: {
    query: GetProductManagementQueryDtoType | GetProductQueryDtoType;
    languageId: string;
    isPublish: boolean | undefined;
  }) {
    const where: Prisma.ProductWhereInput = {
      createdBy: query.createdBy,
      name: {
        search: query.name,
        mode: 'insensitive',
      },
      basePrice: {
        gte: query.minPrice,
        lte: query.maxPrice,
      },
      brandId: {
        in: query.brandIds,
      },
    };
    if (isPublish == true) {
      where.publishedAt = { lte: new Date() };
    } else if (isPublish == false) {
      where.OR = [{ publishedAt: null }, { publishedAt: { gt: new Date() } }];
    }

    const orderBy:
      | Prisma.ProductOrderByWithRelationInput
      | Prisma.ProductOrderByWithRelationInput[] = {};

    if (query.sortBy == 'createdAt') {
      orderBy.createdAt = query.orderBy;
    } else if (query.sortBy == 'price') {
      orderBy.basePrice = query.orderBy;
    } else if (query.sortBy == 'sale') {
      orderBy.orders = {
        _count: query.orderBy,
      };
    }
    const [items, totalItems] = await Promise.all([
      this.prismaService.product.findMany({
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        where,
        orderBy,
        include: {
          productTranslations: {
            where: languageId == 'all' ? {} : { languageId },
          },
          orders: {
            where: {
              status: 'DELIVERED',
            },
          },
          categories: {
            where: {
              id: {
                in: query.categoryIds,
              },
            },
          },
          brand: true,
          skus: true,
          variants: {
            include: {
              variantOptions: true,
            },
          },
        },
      }),
      this.prismaService.product.count({
        where,
      }),
    ]);
    return {
      items,
      totalItems,
    };
  }

  findById({ id, languageId }: { id: number; languageId: string }) {
    return this.prismaService.product.findUniqueOrThrow({
      where: {
        id,
        publishedAt: {
          lte: new Date(),
        },
      },
      include: {
        productTranslations: {
          where: languageId == 'all' ? {} : { languageId },
        },
        skus: true,
        brand: {
          include: {
            brandTranslations: {
              where: languageId == 'all' ? {} : { languageId },
            },
          },
        },
        categories: {
          include: {
            categoryTranslations: {
              where: languageId == 'all' ? {} : { languageId },
            },
          },
        },
        variants: {
          include: {
            variantOptions: true,
          },
        },
      },
    });
  }

  async create({
    createdBy,
    data,
  }: {
    data: CreateProductDtoType;
    createdBy: number;
  }) {
    return await this.prismaService.$transaction(async (tx) => {
      const {
        categoryIds,
        skus: skusData,
        variants: variantsData,
        ...productData
      } = data;

      const categories = await tx.category.findMany({
        where: {
          id: {
            in: categoryIds,
          },
        },
      });

      const product = await tx.product.create({
        data: {
          ...productData,
          skus: {
            createMany: {
              data: skusData.map((e) => e),
            },
          },
          categories: {
            connect: categories.map((e) => ({ id: e.id })),
          },
          createdBy,
          updatedBy: createdBy,
        },
      });

      await Promise.all(
        variantsData.map(async (e) => {
          return tx.variant.create({
            data: {
              name: e.name,
              productId: product.id,
              variantOptions: {
                createMany: {
                  data: e.options.map((e) => ({
                    value: e,
                  })),
                  skipDuplicates: true,
                },
              },
            },
            include: {
              variantOptions: true,
            },
          });
        }),
      );

      return {
        ...product,
        variants: variantsData,
      };
    });
  }

  async updateById({
    data,
    id,
    updatedBy,
  }: {
    id: number;
    data: UpdateProductDtoType;
    updatedBy: number;
  }) {
    const {
      skus: skusData,
      variants: variantsData,
      categoryIds,
      ...productData
    } = data;

    return await this.prismaService.$transaction(async (tx) => {
      const categories = await tx.category.findMany({
        where: {
          id: {
            in: categoryIds,
          },
        },
      });

      const product = await tx.product.update({
        where: { id },
        data: {
          ...productData,
          updatedBy,
          skus: {
            deleteMany: {
              productId: id,
            },
            createMany: {
              data: skusData.map((e) => e),
              skipDuplicates: true,
            },
          },
          categories: {
            set: categories.map((e) => ({ id: e.id })),
          },
        },
      });

      await Promise.all([
        tx.variant.deleteMany({
          where: {
            productId: product.id,
          },
        }),
        ...variantsData.map(async (e) => {
          await tx.variant.create({
            data: {
              name: e.name,
              productId: product.id,
              variantOptions: {
                createMany: {
                  data: e.options.map((i) => ({
                    value: i,
                  })),
                },
              },
            },
          });
        }),
      ]);
      return product;
    });
  }

  async deleteById(id: number) {
    await this.prismaService.product.delete({
      where: { id },
    });
  }

  existsById(id: number) {
    return this.prismaService.product.findUniqueOrThrow({
      where: { id },
    });
  }
}
