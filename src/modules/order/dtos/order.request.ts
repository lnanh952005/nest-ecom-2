import { OrderStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const getOrderQueryDto = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(30),
  status: z.nativeEnum(OrderStatus).optional(),
});

// const createOrderDto = z
//   .array(
//     z.object({
//       // shopId: z.number(),
//       cartItemIds: z.array(z.number()).nonempty(),
//       receiver: z.object({
//         name: z.string(),
//         phoneNumber: z.string().max(20),
//         address: z.string(),
//       }),
//     }),
//   )
//   .min(1);

const createOrderDto = z.strictObject({
  receiver: z.object({
    name: z.string(),
    phoneNumber: z.string().max(20),
    address: z.string(),
  }),
  orders: z.array(
    z.object({
      cartItemIds: z.array(z.number()).nonempty(),
    }),
  ),
});

const updateOrderDto = createOrderDto;

export class GetOrderQueryDto extends createZodDto(getOrderQueryDto) {}
export class CreateOrderDto extends createZodDto(createOrderDto) {}
export class UpdateOrderDto extends createZodDto(updateOrderDto) {}
