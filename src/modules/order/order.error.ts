import { NotFoundException } from '@nestjs/common';

export const OrderNotFoundException = new NotFoundException(
  'Error.OrderNotFound',
);
