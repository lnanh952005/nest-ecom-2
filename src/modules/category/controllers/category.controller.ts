import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@category/dtos/category.request';
import {
  CategoryDetailDto,
  CategoryListDto,
} from '@category/dtos/category.response';
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

import { Public } from 'src/decorators/public.decorator';
import { Message } from 'src/decorators/message.decorator';

import { CategoryService } from 'src/modules/category/services/category.service';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @Public()
  @ZodSerializerDto(CategoryListDto)
  async findAll(@Query('parentCategoryId') parentCategoryId: string) {
    return await this.categoryService.findAll({
      parentCategoryId: +parentCategoryId || undefined,
      languageId: I18nContext.current()?.lang as string,
    });
  }

  @Get(':id')
  @Public()
  @ZodSerializerDto(CategoryDetailDto)
  async findById(@Param('id') id: string) {
    return await this.categoryService.findById({
      id: +id,
      languageId: I18nContext.current()?.lang as string,
    });
  }

  @Post()
  async create(@Body() body: CreateCategoryDto) {
    return await this.categoryService.create(body);
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    return await this.categoryService.updateById({ id: +id, data: body });
  }

  @Delete(':id')
  @Message('delete successfully')
  async deleteById(@Param('id') id: string) {
    await this.categoryService.deleteById(+id);
  }
}
