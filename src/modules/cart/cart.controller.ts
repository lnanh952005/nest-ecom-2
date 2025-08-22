import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Message } from 'src/decorators/message.decorator';
import { User } from 'src/decorators/user.decorator';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';
import {
  AddSkuToCartDtoType,
  UpdateCartItemDtoType,
} from 'src/modules/cart/card.type';
import { CartService } from 'src/modules/cart/cart.service';
import {
  addSkuToCartDto,
  updateCartItemDto,
} from 'src/modules/cart/dtos/cart.request';

@Controller('cart')
export class CartController {
  constructor(private cartItemService: CartService) {}

  @Get()
  async getCart(
    @Query('page') page = '1',
    @Query('limit') limit = '30',
    @User('userId') userId: number,
  ) {
    return await this.cartItemService.getCard({
      languageId: I18nContext.current()?.lang as string,
      page: +page,
      limit: +limit,
      userId,
    });
  }

  @Post()
  @UseInterceptors(new ValidationInterceptor({ validate: addSkuToCartDto }))
  async addToCart(
    @Body() body: AddSkuToCartDtoType,
    @User('userId') userId: number,
  ) {
    return await this.cartItemService.addToCart({ data: body, userId });
  }

  @Put(':id')
  @UseInterceptors(new ValidationInterceptor({ validate: updateCartItemDto }))
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateCartItemDtoType,
  ) {
    return this.cartItemService.updateById({ data: body, id: +id });
  }

  @Delete(':ids')
  @Message("delete successfully")
  async deleteById(@Param('ids') ids: string, @User('userId') userId: number) {
    await this.cartItemService.deleteById({
      ids: ids.split(',').map((e) => +e),
      userId,
    });
  }
}
