import { ZodSerializerDto } from 'nestjs-zod';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import { User } from 'src/decorators/user.decorator';
import { OrderDetailDto, OrderListDto } from '@order/dtos/order.response';
import { OrderService } from 'src/modules/order/order.service';
import { CreateOrderDto, GetOrderQueryDto } from '@order/dtos/order.request';

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

  @Get(':id')
  @ZodSerializerDto(OrderDetailDto)
  getOrderDetail(@Param('id') orderId: string, @User('userId') userId: number) {
    return this.orderService.getOrderDetail({
      orderId: +orderId,
      userId: userId,
    });
  }

  @Post()
  createOrder(@Body() body: CreateOrderDto, @User('userId') userId: number) {
    return this.orderService.createOrder({ data: body, userId });
  }

  @Put(':id')
  cancelOrder(@Param('id') orderId: string, @User('userId') userId: number) {
    return this.orderService.cancelOrder({
      orderId: +orderId,
      userId,
    });
  }
}
