import z from 'zod';

import { paginationSchema } from '@share/schemas/auth.schema';
import { cartItemSchema } from '@share/schemas/cartItem.schema';
import {
  productTranslationSchema,
  skuShema,
} from '@share/schemas/product.schema';

export const cartItemResDto = cartItemSchema.extend({
  sku: skuShema.extend({
    productTranslations: z.array(productTranslationSchema),
  }),
});

export const cartItemListResDto = paginationSchema.extend({
  items: z.array(
    cartItemResDto.omit({
      createdAt: true,
      updatedAt: true,
    }),
  ),
});