import z from 'zod';
import { cartItemSchema } from '@share/schemas/cartItem.schema';

export const addSkuToCartDto = cartItemSchema
  .pick({
    skuId: true,
    quantity: true,
  })
  .strict();

export const updateCartItemDto = addSkuToCartDto;

export const deleteCartItemDto = z.strictObject({
  id: z.array(z.number())
})
