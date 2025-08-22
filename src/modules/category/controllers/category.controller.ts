import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Message } from 'src/decorators/message.decorator';
import { Public } from 'src/decorators/public.decorator';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';
import {
  CreateCategoryDtoType,
  UpdateCategoryDtoType,
} from 'src/modules/category/category.type';
import {
  createCategoryDto,
  updateCategoryDto,
} from 'src/modules/category/dtos/category.request';
import {
  categoryListResDto,
  categoryResDto,
} from 'src/modules/category/dtos/category.response';
import { CategoryService } from 'src/modules/category/services/category.service';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @Public()
  @UseInterceptors(new ValidationInterceptor({ serialize: categoryListResDto }))
  async findAll(@Query('parentCategoryId') parentCategoryId: string) {

    return await this.categoryService.findAll({
      parentCategoryId: +parentCategoryId || undefined,
      languageId: I18nContext.current()?.lang as string
    });
  }

  @Get(':id')
  @Public()
  @UseInterceptors(new ValidationInterceptor({ serialize: categoryResDto }))
  async findById(@Param('id') id: string) {
    return await this.categoryService.findById({
      id: +id,
      languageId: I18nContext.current()?.lang as string,
    });
  }

  @Post()
  @UseInterceptors(new ValidationInterceptor({ validate: createCategoryDto }))
  async create(@Body() body: CreateCategoryDtoType) {
    return await this.categoryService.create(body);
  }

  @Put(':id')
  @UseInterceptors(new ValidationInterceptor({ validate: updateCategoryDto }))
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateCategoryDtoType,
  ) {
    return await this.categoryService.updateById({ id: +id, data: body });
  }

  @Delete(':id')
  @Message('delete successfully')
  async deleteById(@Param('id') id: string) {
    await this.categoryService.deleteById(+id);
  }
}
