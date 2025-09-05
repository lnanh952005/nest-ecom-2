import { SkuAlreadyOutOfStockException } from '@cart/cart.error';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@share/services/prisma.service';
import { CartItemNotFoundException } from '@order/order.error';
import { ProductNotFoundException } from '@product/product.error';
import { CreateOrderDto, GetOrderQueryDto } from '@order/dtos/order.request';

@Injectable()
export class OrderRepository {
  constructor(private prismaService: PrismaService) {}

  async getAll({ userId, data }: { userId: number; data: GetOrderQueryDto }) {
    const { limit, page, status } = data;
    const $items = this.prismaService.order.findMany({
      where: { userId, status },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        productSkuSnapshots: true,
      },
    });
    const $totalItems = this.prismaService.order.count({
      where: { userId, status },
    });
    const [items, totalItems] = await Promise.all([$items, $totalItems]);
    return {
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      items,
    };
  }

  getOrderDetail({ orderId, userId }: { orderId: number; userId: number }) {
    return this.prismaService.order.findUniqueOrThrow({
      where: {
        id: orderId,
        userId,
        deletedAt: null,
      },
      include: {
        productSkuSnapshots: {
          include: {
            productTranslations: true,
          },
        },
        orderDetail: true,
        shop: true,
        payment: true,
      },
    });
  }

  cancelOrder({ orderId, userId }: { orderId: number; userId: number }) {
    return this.prismaService.order.update({
      where: {
        id: orderId,
        userId,
        deletedAt: null,
      },
      data: {
        status: 'CANCELLED',
      },
    });
  }

  /**
   * 1. kiem tra xem tat ca cartItemIds co ton tai trong DB khong
   * 2. kiem tra so luong mua co lon hon so luong ton kho khong
   * 3. kiem tra xem tat ca san pham mua co san pham nao bi xoa hay an khong
   * 4. kiem tra xem ca skuId trong cartItem gui len co thuoc ve shopId gui len k
   * 5. tao order
   * 6. xoa cartItem
   */
  async createOrder({
    data,
    userId,
  }: {
    userId: number;
    data: CreateOrderDto;
  }) {
    const cartItemIds = data.orders.map((e) => e.cartItemIds).flat();

    const cartItems = await this.prismaService.cartItem.findMany({
      where: {
        id: {
          in: cartItemIds,
        },
        userId,
      },
      include: {
        sku: {
          include: {
            product: {
              include: {
                productTranslations: true,
              },
            },
          },
        },
      },
    });
    if (cartItems.length != cartItemIds.length) {
      throw CartItemNotFoundException;
    }

    const isOutOfStock = cartItems.some((e) => e.sku.stock < e.quantity);
    if (isOutOfStock) {
      throw SkuAlreadyOutOfStockException;
    }

    const isExist = cartItems.some(
      (e) =>
        e.sku.product.publishedAt == null ||
        e.sku.product.publishedAt > new Date(),
    );
    if (isExist) {
      throw ProductNotFoundException;
    }

    const cartItemMap = new Map<number, (typeof cartItems)[number][]>();

    cartItems.map((cartItem) => {
      const shopId = cartItem.sku.product.createdBy;
      if (!cartItemMap.has(shopId)) {
        cartItemMap.set(shopId, []);
      }
      cartItemMap.get(shopId)?.push(cartItem);
    });

    const cartItemArray = Array.from(cartItemMap, ([key, value]) => ({
      shopId: key,
      cartItems: value,
    }));

    const $result = cartItemArray.map(async ({ shopId, cartItems }) => {
      const order = await this.prismaService.order.create({
        data: {
          status: 'PENDING_PAYMENT',
          payment: {
            create: {
              status: 'PENDING',
            },
          },
          shop: {
            connect: {
              id: shopId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
          productSkuSnapshots: {
            create: cartItems.map((cartItem) => ({
              image: cartItem.sku.image,
              productName: cartItem.sku.product.name,
              quantity: cartItem.quantity,
              skuPrice: cartItem.sku.price,
              skuValue: cartItem.sku.value,
              productTranslations: {
                connect: cartItem.sku.product.productTranslations.map(
                  (trans) => ({
                    id: trans.id,
                  }),
                ),
              },
              sku: {
                connect: {
                  id: cartItem.skuId,
                },
              },
              product: {
                connect: {
                  id: cartItem.sku.productId,
                },
              },
            })),
          },
          products: {
            connect: cartItems.map((cartItem) => ({
              id: cartItem.sku.product.id,
            })),
          },
        },
      });

      await this.prismaService.cartItem.deleteMany({
        where: {
          id: {
            in: cartItems.map((cartItem) => cartItem.id),
          },
        },
      });
      return order;
    });

    return await this.prismaService.$transaction(async (tx) => {
      return await Promise.all($result);
    });
  }
}
