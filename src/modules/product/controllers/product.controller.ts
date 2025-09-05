import { Controller, Get, Param, Query } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

import { ZodSerializerDto } from 'nestjs-zod';
import { Public } from 'src/decorators/public.decorator';
import { GetProductQueryDto } from 'src/modules/product/dtos/product.request';
import { ProductDetailResDto, ProductListResDto } from 'src/modules/product/dtos/product.response';
import { ProductService } from 'src/modules/product/services/product.service';

@Controller('products')
@Public()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @ZodSerializerDto(ProductListResDto)
  async findAll(@Query() query: GetProductQueryDto) {
    return await this.productService.findAll({
      query,
      languageId: I18nContext.current()?.lang as string,
    });
  }

  @Get(':id')
  @ZodSerializerDto(ProductDetailResDto)
  async findById(@Param('id') id: string) {
    return await this.productService.findById({
      id: +id,
      languageId: I18nContext.current()?.lang as string,
    });
  }
}
