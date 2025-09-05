import z from 'zod';
import { createZodDto } from 'nestjs-zod';

import {
  productSchema,
  productTranslationSchema,
  skuShema,
} from '@product/product.schema';
import { userSchema } from '@user/user.schema';
import { cartItemSchema } from '@cart/cart.schema';
import { paginationSchema } from '@auth/auth.schema';

const cartDetailDto = z.object({
  shop: userSchema.pick({
    id: true,
    name: true,
    avatar: true,
  }),
  cartItems: z.array(
    cartItemSchema.extend({
      sku: skuShema
        .omit({
          createdAt: true,
          updatedAt: true,
        })
        .extend({
          product: productSchema
            .omit({
              createdAt: true,
              updatedAt: true,
            })
            .extend({
              productTranslations: z.array(
                productTranslationSchema.omit({
                  createdAt: true,
                  updatedAt: true,
                }),
              ),
            }),
        }),
    }),
  ),
});

const cartListDto = paginationSchema.extend({
  items: z.array(cartDetailDto),
});

export class CartDetailDto extends createZodDto(cartDetailDto) {}
export class CartListDto extends createZodDto(cartListDto) {}
