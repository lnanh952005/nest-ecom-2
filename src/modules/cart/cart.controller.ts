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
import { User } from 'src/decorators/user.decorator';
import { Message } from 'src/decorators/message.decorator';
import { CartService } from 'src/modules/cart/cart.service';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';
import {
  AddSkuToCartDto,
  UpdateCartItemDto,
} from 'src/modules/cart/dtos/cart.request';
import { ZodSerializerDto } from 'nestjs-zod';
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
  async addToCart(
    @Body() body: AddSkuToCartDto,
    @User('userId') userId: number,
  ) {
    return await this.cartItemService.addToCart({ data: body, userId });
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() body: UpdateCartItemDto) {
    return this.cartItemService.updateById({ data: body, id: +id });
  }

  @Delete(':ids')
  @Message('delete successfully')
  async deleteById(@Param('ids') ids: string, @User('userId') userId: number) {
    await this.cartItemService.deleteById({
      ids: ids.split(',').map((e) => +e),
      userId,
    });
  }
}
