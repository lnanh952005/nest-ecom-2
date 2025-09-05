import { Injectable } from '@nestjs/common';
import { PrismaService } from '@share/services/prisma.service';
import {
  AddSkuToCartDto,
  UpdateCartItemDto,
} from 'src/modules/cart/dtos/cart.request';
import { CartDetailDto } from 'src/modules/cart/dtos/cart.response';

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
    const items = await this.prismaService.cartItem.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        userId,
        sku: {
          product: {
            publishedAt: {
              lte: new Date(),
              not: null,
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        sku: {
          include: {
            product: {
              include: {
                user: true,
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
    });
    const groupMap = new Map<number, CartDetailDto>();
    for (const e of items) {
      const shopId = e.sku.product.createdBy;
      if (!groupMap.has(shopId)) {
        groupMap.set(shopId, {
          shop: {
            id: shopId,
            avatar: e.sku.product.user.avatar,
            name: e.sku.product.user.name,
          },
          cartItems: [],
        });
      }
      groupMap.get(shopId)?.cartItems.push(e);
    }
    const sortedGroup = Array.from(groupMap.values());

    const skip = (page - 1) * limit;
    const result = sortedGroup.slice(skip, skip + limit);

    return {
      page,
      limit,
      totalPages: Math.ceil(sortedGroup.length / limit),
      totalItems: sortedGroup.length,
      items: result,
    };
  }

  findBySkuId({ skuId, userId }: { skuId: number; userId: number }) {
    return this.prismaService.cartItem.findFirstOrThrow({
      where: {
        skuId,
        userId,
      },
      include: {
        sku: true,
      },
    });
  }

  addSkuToCart({ data, userId }: { data: AddSkuToCartDto; userId: number }) {
    return this.prismaService.cartItem.upsert({
      where: {
        userId_skuId: {
          userId,
          skuId: data.skuId,
        },
      },
      update: {
        quantity: {
          increment: data.quantity,
        },
      },
      create: {
        quantity: data.quantity,
        userId,
        skuId: data.skuId,
      },
    });
  }

  updateById({
    data,
    cartItemId,
  }: {
    cartItemId: number;
    data: UpdateCartItemDto;
  }) {
    return this.prismaService.cartItem.update({
      where: {
        id: cartItemId,
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
