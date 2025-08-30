import {
  CreateCategoryTranslationDto,
  UpdateCategoryTranslationDto,
} from '@category/dtos/category.request';
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
import { I18nContext } from 'nestjs-i18n';
import { Message } from 'src/decorators/message.decorator';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';

import { CategoryTranslationService } from 'src/modules/category/services/categoryTranslation.service';

@Controller('category-translations')
export class CategoryTranslationController {
  constructor(private categoryTranslationService: CategoryTranslationService) {}

  @Get()
  async findAll() {
    return await this.categoryTranslationService.findAll({
      languageId: I18nContext.current()?.lang as string,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.categoryTranslationService.findById(+id);
  }

  async create(@Body() body: CreateCategoryTranslationDto) {
    return await this.categoryTranslationService.create(body);
  }

  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateCategoryTranslationDto,
  ) {
    return await this.categoryTranslationService.updateById({
      id: +id,
      data: body,
    });
  }

  @Delete(':id')
  @Message('delete successfully')
  async deleteById(@Param('id') id: string) {
    await this.categoryTranslationService.deleteById(+id);
  }
}
