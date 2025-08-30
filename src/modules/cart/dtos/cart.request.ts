import z from 'zod';
import { cartItemSchema } from '@share/schemas/cart.schema';
import { createZodDto } from 'nestjs-zod';

const addSkuToCartDto = cartItemSchema
  .pick({
    skuId: true,
    quantity: true,
  })
  .strict();

const updateCartItemDto = addSkuToCartDto;

const deleteCartItemDto = z.strictObject({
  id: z.array(z.number()),
});

export class AddSkuToCartDto extends createZodDto(addSkuToCartDto){}
export class UpdateCartItemDto extends createZodDto(updateCartItemDto){}
