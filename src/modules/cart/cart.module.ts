import { CartRepository } from '@cart/cart.repository';
import { Module } from '@nestjs/common';
import { ProductModule } from '@product/product.module';
import { CartController } from 'src/modules/cart/cart.controller';
import { CartService } from 'src/modules/cart/cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService, CartRepository],
  imports: [ProductModule],
})
export class CartModule {}
