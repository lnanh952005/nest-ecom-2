import {
  SkuAlreadyOutOfStockException,
  SkuNotFoundException,
} from '@cart/cart.error';
import { Injectable } from '@nestjs/common';
import { CreateOrderDto, GetOrderQueryDto } from '@order/dtos/order.request';
import { PrismaService } from '@share/services/prisma.service';

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

  getOrderDetail({ id, userId }: { id: number; userId: number }) {
    return this.prismaService.order.findUniqueOrThrow({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        productSkuSnapshots: true,
      },
    });
  }

  cancelOrder({ id, userId }: { id: number; userId: number }) {
    return this.prismaService.order.update({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      data: {
        status: 'CANCELLED',
      },
    });
  }

  async createOrder({
    data,
    userId,
  }: {
    userId: number;
    data: CreateOrderDto;
  }) {
    const cartItems = await this.prismaService.cartItem.findMany({
      where: {
        id: {
          in: [],
        },
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
      throw SkuNotFoundException;
    }
    // return this.prismaService.order.create({
    //   data: {
    //     userId,
    //   },
    // });
  }
}
