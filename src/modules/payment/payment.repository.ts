import { parse } from 'date-fns';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@share/services/prisma.service';
import { WebhookPaymentDto } from 'src/modules/payment/payment.request';
@Injectable()
export class PaymentRepository {
  constructor(private prismaService: PrismaService) {}

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
    await this.prismaService.paymentTransaction.create({
      data: {
        gateway: data.gateway,
        transactionDate: parse(
          data.transactionDate,
          'yyyy-MM-dd HH:mm:ss',
          new Date(),
        ),
        accountNumber: data.accountNumber,
        amountOut,
        amountIn,
        accumulated: data.accumulated,
        code: data.code,
        transactionContent: data.content,
        referenceNumber: data.referenceCode,
        body: data.description,
      },
    });
    const paymentId = data.code
      ? Number(data.code.split('DH')[1])
      : Number(data.content?.split('DH')[1]);

    if (isNaN(paymentId)) {
      throw new BadRequestException('can not get payment id from content');
    }

    const payment = await this.prismaService.payment
      .findFirstOrThrow({
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
    const { orders } = payment;

    const totalPrice = orders.reduce((acc, order) => {
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

    await this.prismaService.$transaction([
      this.prismaService.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: 'SUCCESS',
        },
      }),
      this.prismaService.order.updateMany({
        where: {
          id: {
            in: orders.map((e) => e.id),
          },
        },
        data: {
          status: 'PENDING_PICKUP',
        },
      }),
    ]);
  }
}
