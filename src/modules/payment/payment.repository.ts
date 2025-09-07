import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@share/services/prisma.service';
import { WebhookPaymentDto } from 'src/modules/payment/payment.request';
import { PaymentProducer } from 'src/modules/payment/payment.producer';
@Injectable()
export class PaymentRepository {
  constructor(
    private prismaService: PrismaService,
    private paymentProducer: PaymentProducer,
  ) {}

  /**
   * 1. them thong tin giao dich vao db
   * 2. kiem tra noi dung chuyen khoang va tong so tien co dung khong
   * 3. cap nhat trang thai don hang
   */
  async receiver(data: WebhookPaymentDto) {
    let amountIn = 0;
    let amountOut = 0;
    if (data.transferType == 'in') {
      amountIn = data.transferAmount;
    } else {
      amountOut = data.transferAmount;
    }

    const paymentTransaction = await this.prismaService.paymentTransaction
      .findUniqueOrThrow({
        where: {
          id: data.id,
        },
      })
      .catch(() => {
        throw new BadRequestException('payment transaction already exists');
      });
    const paymentId = data.code
      ? Number(data.code.split('DH')[1])
      : Number(data.content?.split('DH')[1]);

    if (isNaN(paymentId)) {
      throw new BadRequestException('can not get payment id from content');
    }

    const payment = await this.prismaService.payment
      .findUniqueOrThrow({
        where: {
          id: paymentId,
        },
        include: {
          orders: {
            include: {
              productSkuSnapshots: true,
            },
          },
        },
      })
      .catch(() => {
        throw new BadRequestException('Cannot find payment');
      });

    const totalPrice = payment.orders.reduce((acc, order) => {
      const orderTotal = order.productSkuSnapshots.reduce(
        (totalPrice, productSku) => {
          return totalPrice + productSku.skuPrice * productSku.quantity;
        },
        0,
      );
      return acc + orderTotal;
    }, 0);

    if (totalPrice != data.transferAmount) {
      throw new BadRequestException(
        `price not match, expected ${totalPrice} but got ${data.transferAmount}`,
      );
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.paymentTransaction.create({
        data: {
          id: data.id,
          gateway: data.gateway,
          transactionDate: data.transactionDate,
          accountNumber: data.accountNumber,
          subAccount: data.subAccount,
          amountOut,
          amountIn,
          accumulated: data.accumulated,
          code: data.code,
          transactionContent: data.content,
          referenceNumber: data.referenceCode,
          body: data.description,
        },
      });

      await tx.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: 'SUCCESS',
        },
      });

      await tx.order.updateMany({
        where: {
          id: {
            in: payment.orders.map((e) => e.id),
          },
        },
        data: {
          status: 'PENDING_PICKUP',
        },
      });

      await this.paymentProducer.removeJob(payment.id);
    });
    return payment;
  }

  async cancelPaymentAndOrder(paymentId: number) {
    const payment = await this.prismaService.payment.findUniqueOrThrow({
      where: {
        id: paymentId,
      },
      include: {
        orders: {
          include: {
            productSkuSnapshots: true,
          },
        },
      },
    });

    await this.prismaService.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        status: 'FAILED',
      },
    });

    await this.prismaService.$transaction(async (tx) => {
      const $updatedOrders = Promise.all(
        payment.orders.map(async (order) => {
          await this.prismaService.order.updateMany({
            where: {
              id: {
                in: payment.orders.map((order) => order.id),
              },
              status: 'PENDING_PAYMENT',
            },
            data: {
              status: 'CANCELLED',
            },
          });
        }),
      );

      const productSkuSnapshots = payment.orders
        .map((order) => order.productSkuSnapshots)
        .flat();

      const $updatedSku = Promise.all(
        productSkuSnapshots.map(async (skuSnapshot) => {
          if (skuSnapshot.skuId) {
            await this.prismaService.sku.update({
              where: {
                id: skuSnapshot.skuId,
              },
              data: {
                stock: {
                  increment: skuSnapshot.quantity,
                },
              },
            });
          }
        }),
      );

      await Promise.all([$updatedOrders, $updatedSku]);
    });
  }
}
