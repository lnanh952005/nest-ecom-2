import { SkuAlreadyOutOfStockException } from '@cart/cart.error';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@share/services/prisma.service';
import { CartItemNotFoundException } from '@order/order.error';
import { ProductNotFoundException } from '@product/product.error';
import { CreateOrderDto, GetOrderQueryDto } from '@order/dtos/order.request';
import { OrderProducer } from '@order/order.producer';

@Injectable()
export class OrderRepository {
  constructor(
    private prismaService: PrismaService,
    private orderProducer: OrderProducer,
  ) {}

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

  async cancelOrder({ orderId, userId }: { orderId: number; userId: number }) {
    const cancelOrder = await this.prismaService.order.update({
      where: {
        id: orderId,
        userId,
        deletedAt: null,
      },
      data: {
        status: 'CANCELLED',
      },
      include: {
        productSkuSnapshots: true,
      },
    });

    await Promise.all(
      cancelOrder.productSkuSnapshots.map(async (skuSnapShot) => {
        if (skuSnapShot.skuId) {
          await this.prismaService.sku.update({
            where: {
              id: skuSnapShot.skuId,
            },
            data: {
              stock: {
                increment: skuSnapShot.quantity,
              },
            },
          });
        }
      }),
    );
    return cancelOrder;
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

    const cartItemsInDb = await this.prismaService.cartItem.findMany({
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
    if (cartItemsInDb.length != cartItemIds.length) {
      throw CartItemNotFoundException;
    }

    const isOutOfStock = cartItemsInDb.some((e) => e.sku.stock < e.quantity);
    if (isOutOfStock) {
      throw SkuAlreadyOutOfStockException;
    }

    const isExist = cartItemsInDb.some(
      (e) =>
        e.sku.product.publishedAt == null ||
        e.sku.product.publishedAt > new Date(),
    );
    if (isExist) {
      throw ProductNotFoundException;
    }

    const cartItemMap = new Map<number, (typeof cartItemsInDb)[number][]>();

    cartItemsInDb.map((cartItem) => {
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

    const result = await this.prismaService.$transaction(async (tx) => {
      const $result = cartItemArray.map(async ({ shopId, cartItems }) => {
        const payment = await tx.payment.create({
          data: {
            status: 'PENDING',
          },
        });

        const order = await tx.order.create({
          data: {
            status: 'PENDING_PAYMENT',
            payment: {
              connect: {
                id: payment.id,
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
            products: {
              connect: cartItems.map((cartItem) => ({
                id: cartItem.sku.product.id,
              })),
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
          },
        });

        await Promise.all(
          cartItems.map(async (cartItem) => {
            await tx.sku.update({
              where: {
                id: cartItem.skuId,
              },
              data: {
                stock: {
                  decrement: cartItem.quantity,
                },
              },
            });
          }),
        );

        await tx.cartItem.deleteMany({
          where: {
            id: {
              in: cartItems.map((cartItem) => cartItem.id),
            },
          },
        });

        await this.orderProducer.addCancelPaymentJob(payment.id);
        return order;
      });

      return await Promise.all($result);
    });
    return result;
  }
}
