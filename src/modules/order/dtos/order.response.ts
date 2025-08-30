import z from 'zod';
import { createZodDto } from 'nestjs-zod';

import { orderSchema } from '@share/schemas/order.schema';
import { paginationSchema } from '@share/schemas/auth.schema';
import { productSkuSnapshotSchema } from '@share/schemas/product.schema';

const orderDetailDto = orderSchema.extend({
  productSkuSnapShots: z.array(productSkuSnapshotSchema),
});

const orderListDto = paginationSchema.extend({
  items: z.array(
    orderDetailDto.omit({
      createdAt: true,
      updatedAt: true,
    }),
  ),
});

export class OrderDetailDto extends createZodDto(orderDetailDto) {}
export class OrderListDto extends createZodDto(orderListDto) {}
