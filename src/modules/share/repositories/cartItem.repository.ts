import { Injectable } from '@nestjs/common';
import { PrismaService } from '@share/services/prisma.service';
import {
  AddSkuToCartDtoType,
  UpdateCartItemDtoType
} from 'src/modules/cart/card.type';

@Injectable()
export class CartRepository {
  constructor(private prismaService: PrismaService) {}

  async findAll({
    page,
    limit,
    userId,
    languageId,
  }: {
    page: number;
    limit: number;
    userId: number;
    languageId: string;
  }) {
    const [items, totalItems] = await Promise.all([
      this.prismaService.cartItem.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { userId },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          sku: {
            include: {
              product: {
                include: {
                  productTranslations: {
                    where: {
                      languageId: languageId == 'all' ? {} : languageId,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prismaService.cartItem.count({
        where: {
          userId,
        },
      }),
    ]);
    return {
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      items,
    };
  }

  create({ data, userId }: { data: AddSkuToCartDtoType; userId: number }) {
    return this.prismaService.cartItem.create({
      data: {
        quantity: data.quantity,
        userId,
        skuId: data.skuId,
      },
    });
  }

  updateById({ data, id }: { id: number; data: UpdateCartItemDtoType }) {
    return this.prismaService.cartItem.update({
      where: {
        id,
      },
      data: {
        skuId: data.skuId,
        quantity: data.quantity,
      },
    });
  }

  async deleteById({ userId, ids }: { userId: number; ids: number[] }) {
    await this.prismaService.cartItem.deleteMany({
      where: {
        id: {
          in: ids,
        },
        userId,
      },
    });
  }
}
