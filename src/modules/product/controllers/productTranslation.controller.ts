import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import {
  CreateProductTranslationDto,
  UpdateProductTranslationDto,
} from '@product/dtos/product.request';
import { Message } from 'src/decorators/message.decorator';
import { ProductTranslationService } from 'src/modules/product/services/productTranslation.service';

@Controller('product-translations')
export class ProductTranslationController {
  constructor(private productTranslationService: ProductTranslationService) {}
  @Get()
  async findAll() {}

  @Post()
  async create(@Body() body: CreateProductTranslationDto) {
    return this.productTranslationService.create(body);
  }

  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateProductTranslationDto,
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
