import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Message } from 'src/decorators/message.decorator';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';
import {
  CreateCategoryTranslationDtoType,
  UpdateCategoryTranslationDtoType,
} from 'src/modules/category/category.type';
import {
  createCategoryTranslationDto,
  updateCategoryTranslationDto,
} from 'src/modules/category/dtos/category.request';
import { CategoryTranslationService } from 'src/modules/category/services/categoryTranslation.service';

@Controller('categoryTranslations')
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

  @Post()
  @UseInterceptors(
    new ValidationInterceptor({ validate: createCategoryTranslationDto }),
  )
  async create(@Body() body: CreateCategoryTranslationDtoType) {
    return await this.categoryTranslationService.create(body);
  }

  @Patch(':id')
  @UseInterceptors(
    new ValidationInterceptor({ validate: updateCategoryTranslationDto }),
  )
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateCategoryTranslationDtoType,
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
