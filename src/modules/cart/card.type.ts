import z from 'zod';
import {
  cartItemListResDto,
  cartItemResDto,
} from 'src/modules/cart/dtos/cart.response';
import {
  addSkuToCartDto,
  deleteCartItemDto,
  updateCartItemDto,
} from 'src/modules/cart/dtos/cart.request';

export type AddSkuToCartDtoType = z.infer<typeof addSkuToCartDto>;
export type UpdateCartItemDtoType = z.infer<typeof updateCartItemDto>;
export type DeleteCartItemDtoType = z.infer<typeof deleteCartItemDto>;

export type CartItemResDtoType = z.infer<typeof cartItemResDto>;
export type CartItemListResDtoType = z.infer<typeof cartItemListResDto>;
