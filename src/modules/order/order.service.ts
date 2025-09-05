import { Injectable } from '@nestjs/common';
import { CreateOrderDto, GetOrderQueryDto } from '@order/dtos/order.request';
import { OrderNotFoundException } from '@order/order.error';
import { OrderProducer } from '@order/order.producer';
import { OrderRepository } from '@order/order.repository';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private orderProducer: OrderProducer,
  ) {}

  getAll({ data, userId }: { userId: number; data: GetOrderQueryDto }) {
    return this.orderRepository.getAll({
      userId,
      data,
    });
  }

  async getOrderDetail({
    orderId,
    userId,
  }: {
    orderId: number;
    userId: number;
  }) {
    return await this.orderRepository
      .getOrderDetail({ orderId, userId })
      .catch(() => {
        throw OrderNotFoundException;
      });
  }

  async createOrder({
    data,
    userId,
  }: {
    userId: number;
    data: CreateOrderDto;
  }) {
    return await this.orderRepository.createOrder({
      data,
      userId,
    });
    // await this.orderProducer.addCancelPaymentJob(1);
  }

  async cancelOrder({ orderId, userId }: { orderId: number; userId: number }) {
    try {
      return await this.orderRepository.cancelOrder({ orderId, userId });
    } catch (error) {
      throw OrderNotFoundException;
    }
  }
}
