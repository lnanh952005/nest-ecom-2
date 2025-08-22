import { Module } from '@nestjs/common';
import { CartController } from 'src/modules/cart/cart.controller';
import { CartService } from 'src/modules/cart/cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
