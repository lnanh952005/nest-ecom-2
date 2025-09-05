import { NotFoundException } from '@nestjs/common';

export const OrderNotFoundException = new NotFoundException(
  'Error.OrderNotFound',
);

export const CartItemNotFoundException = new NotFoundException(
  'Error.CartItemNotFound',
);
