import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { Message } from 'src/decorators/message.decorator';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';
import {
  createProductTranslationDto,
  updateProductTranslationDto,
} from 'src/modules/product/dtos/product.request';
import {
  CreateProductTranslationDtoType,
  UpdateProductTranslationDtoType,
} from 'src/modules/product/product.type';
import { ProductTranslationService } from 'src/modules/product/services/productTranslation.service';

@Controller('product-translations')
export class ProductTranslationController {
  constructor(private productTranslationService: ProductTranslationService) {}
  @Get()
  async findAll() {}

  @Post()
  @UseInterceptors(
    new ValidationInterceptor({ validate: createProductTranslationDto }),
  )
  async create(@Body() body: CreateProductTranslationDtoType) {
    return this.productTranslationService.create(body);
  }

  @Put(':id')
  @UseInterceptors(
    new ValidationInterceptor({ validate: updateProductTranslationDto }),
  )
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateProductTranslationDtoType,
  ) {
    return await this.productTranslationService.updateById({
      id: +id,
      data: body,
    });
  }

  @Delete(':id')
  @Message('delete successfully')
  async deleteById(@Param('id') id: string) {
    await this.productTranslationService.deleteById(+id);
  }
}
