import { OrderStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const getOrderQueryDto = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(30),
  status: z.nativeEnum(OrderStatus).optional(),
});

const createOrderDto = z.object({});
const updateOrderDto = createOrderDto;

export class GetOrderQueryDto extends createZodDto(getOrderQueryDto) {}
export class CreateOrderDto extends createZodDto(createOrderDto) {}
