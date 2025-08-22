import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

import {
  productListResDto,
  productResDto,
} from 'src/modules/product/dtos/product.response';
import { Public } from 'src/decorators/public.decorator';
import { QueryValidationPipe } from 'src/pipes/queryValidation.pipe';
import { GetProductQueryDtoType } from 'src/modules/product/product.type';
import { getProductQueryDto } from 'src/modules/product/dtos/product.request';
import { ProductService } from 'src/modules/product/services/product.service';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';

@Controller('products')
@Public()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @UsePipes(new QueryValidationPipe(getProductQueryDto))
  // @UseInterceptors(new ValidationInterceptor({ serialize: productListResDto }))
  async findAll(@Query() query: GetProductQueryDtoType) {
    return await this.productService.findAll({
      query,
      languageId: I18nContext.current()?.lang as string,
    });
  }

  @Get(':id')
  // @UseInterceptors(new ValidationInterceptor({ serialize: productResDto }))
  async findById(@Param('id') id: string) {
    return await this.productService.findById({
      id: +id,
      languageId: I18nContext.current()?.lang as string,
    });
  }
}
