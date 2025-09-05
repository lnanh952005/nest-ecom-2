import z from 'zod';
import { createZodDto } from 'nestjs-zod';

import { orderSchema } from '@order/order.schema';
import { paginationSchema } from '@auth/auth.schema';
import { productSkuSnapshotSchema } from '@product/product.schema';

const orderDetailDto = orderSchema.extend({
  productSkuSnapshots: z.array(productSkuSnapshotSchema),
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
