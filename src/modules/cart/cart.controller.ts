import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ZodSerializerDto } from 'nestjs-zod';

import {
  AddSkuToCartDto,
  DeleteCartItemQueryDto,
  UpdateCartItemDto,
} from 'src/modules/cart/dtos/cart.request';
import { User } from 'src/decorators/user.decorator';
import { Message } from 'src/decorators/message.decorator';
import { CartService } from 'src/modules/cart/cart.service';
import { CartListDto } from 'src/modules/cart/dtos/cart.response';

@Controller('cart')
export class CartController {
  constructor(private cartItemService: CartService) {}

  @Get()
  @ZodSerializerDto(CartListDto)
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
  async addSkuToCart(
    @Body() body: AddSkuToCartDto,
    @User('userId') userId: number,
  ) {
    return await this.cartItemService.addSkuToCart({ data: body, userId });
  }

  @Put(':id')
  async updateById(
    @Param('id') cartItemId: string,
    @Body() body: UpdateCartItemDto,
    @User('userId') userId: number,
  ) {
    return this.cartItemService.updateById({
      data: body,
      cartItemId: +cartItemId,
      userId
    });
  }

  @Delete()
  @Message('delete successfully')
  async deleteById(
    @Query() query: DeleteCartItemQueryDto,
    @User('userId') userId: number,
  ) {
    await this.cartItemService.deleteById({
      ids: query.ids,
      userId,
    });
  }
}
