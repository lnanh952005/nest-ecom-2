import { Injectable } from '@nestjs/common';
import { GetOrderQueryDto } from '@order/dtos/order.request';
import { OrderRepository } from '@share/repositories/order.repository';

@Injectable()
export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  getAll({ data, userId }: { userId: number; data: GetOrderQueryDto }) {
    return this.orderRepository.getAll({
      userId,
      data,
    });
  }
}
