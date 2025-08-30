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

import { AccessTokenPayload } from '@auth/auth.type';
import {
  CreateProductDto,
  GetProductManangementQueryDto,
  UpdateProductDto,
} from '@product/dtos/product.request';
import {
  ProductDetailResDto,
  ProductListResDto,
} from '@product/dtos/product.response';
import { ProductManagementService } from '@product/services/productManagement.service';
import { ZodSerializerDto } from 'nestjs-zod';
import { Message } from 'src/decorators/message.decorator';
import { User } from 'src/decorators/user.decorator';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';

@Controller('product-management/products')
export class ProductManagementController {
  constructor(private productManagementService: ProductManagementService) {}

  @Get()
  @ZodSerializerDto(ProductListResDto)
  async findAll(
    @Query() query: GetProductManangementQueryDto,
    @User() user: AccessTokenPayload,
  ) {
    return await this.productManagementService.findAll({
      query,
      userId: user.userId,
      roleId: user.roleId,
      languageId: I18nContext.current()?.lang as string,
    });
  }

  @Get(':id')
  @ZodSerializerDto(ProductDetailResDto)
  async findById(@Param('id') id: string, @User() user: AccessTokenPayload) {
    return this.productManagementService.findById({
      id: +id,
      languageId: I18nContext.current()?.lang as string,
      userId: user.userId,
      roleId: user.roleId,
    });
  }

  @Post()
  async create(@Body() body: CreateProductDto, @User('userId') userId: number) {
    return await this.productManagementService.create({
      data: body,
      userId,
    });
  }

  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
    @User() user: AccessTokenPayload,
  ) {
    return await this.productManagementService.updateById({
      id: +id,
      data: body,
      userId: user.userId,
      roleId: user.roleId,
    });
  }

  @Delete(':id')
  @Message('delete successfully')
  async deleteById(@Param('id') id: string, @User() user: AccessTokenPayload) {
    await this.productManagementService.deleteById({
      id: +id,
      userId: user.userId,
      roleId: user.roleId,
    });
  }
}
