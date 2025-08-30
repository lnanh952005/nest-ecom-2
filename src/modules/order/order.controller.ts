import { ZodSerializerDto } from 'nestjs-zod';
import { Controller, Get, Query } from '@nestjs/common';

import { User } from 'src/decorators/user.decorator';
import { GetOrderQueryDto } from '@order/dtos/order.request';
import { OrderService } from 'src/modules/order/order.service';
import { OrderListDto } from '@order/dtos/order.response';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @ZodSerializerDto(OrderListDto)
  async getAll(
    @Query() query: GetOrderQueryDto,
    @User('userId') userId: number,
  ) {
    return await this.orderService.getAll({ data: query, userId });
  }
}
