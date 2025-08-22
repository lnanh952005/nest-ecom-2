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
  UsePipes,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

import {
  createProductDto,
  getProductManagementQueryDto,
  updateProductDto,
} from '@product/dtos/product.request';
import {
  CreateProductDtoType,
  GetProductManagementQueryDtoType,
  UpdateProductDtoType,
} from '@product/product.type';
import {
  productListResDto,
  productResDto,
} from '@product/dtos/product.response';
import { AccessTokenPayload } from '@auth/auth.type';
import { User } from 'src/decorators/user.decorator';
import { Message } from 'src/decorators/message.decorator';
import { QueryValidationPipe } from 'src/pipes/queryValidation.pipe';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';
import { ProductManagementService } from '@product/services/productManagement.service';

@Controller('product-management/products')
export class ProductManagementController {
  constructor(private productManagementService: ProductManagementService) {}

  @Get()
  @UsePipes(new QueryValidationPipe(getProductManagementQueryDto))
  @UseInterceptors(new ValidationInterceptor({ serialize: productListResDto }))
  async findAll(
    @Query() query: GetProductManagementQueryDtoType,
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
  @UseInterceptors(new ValidationInterceptor({ serialize: productResDto }))
  async findById(@Param('id') id: string, @User() user: AccessTokenPayload) {
    return this.productManagementService.findById({
      id: +id,
      languageId: I18nContext.current()?.lang as string,
      userId: user.userId,
      roleId: user.roleId,
    });
  }

  @Post()
  @UseInterceptors(new ValidationInterceptor({ validate: createProductDto }))
  async create(
    @Body() body: CreateProductDtoType,
    @User('userId') userId: number,
  ) {
    return await this.productManagementService.create({
      data: body,
      userId,
    });
  }

  @Put(':id')
  @UseInterceptors(new ValidationInterceptor({ validate: updateProductDto }))
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateProductDtoType,
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
