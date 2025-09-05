import z from 'zod';
import { cartItemSchema } from '@cart/cart.schema';
import { createZodDto } from 'nestjs-zod';

const addSkuToCartDto = cartItemSchema
  .pick({
    skuId: true,
    quantity: true,
  })
  .strict();

const updateCartItemDto = addSkuToCartDto;

const deleteCartItemQueryDto = z.strictObject({
  ids: z.string().transform((arg) => arg.split(',').map((e) => +e)),
});

export class AddSkuToCartDto extends createZodDto(addSkuToCartDto) {}
export class UpdateCartItemDto extends createZodDto(updateCartItemDto) {}
export class DeleteCartItemQueryDto extends createZodDto(
  deleteCartItemQueryDto,
) {}
