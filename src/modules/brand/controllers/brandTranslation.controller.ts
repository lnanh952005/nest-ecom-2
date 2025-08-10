import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';
import {
  CreateBrandTranslationDtoType,
  UpdateBrandTranslationDtoType,
} from 'src/modules/brand/brand.type';
import {
  createBrandTranslationDto,
  updateBrandTranslationDto,
} from 'src/modules/brand/dtos/brand.request';
import { BrandTranslationService } from 'src/modules/brand/services/brandTranslation.service';

@Controller('brandTranslations')
export class BrandTranslationController {
  constructor(private brandTranslationService: BrandTranslationService) {}

  @Post()
  @UseInterceptors(
    new ValidationInterceptor({ validate: createBrandTranslationDto }),
  )
  async create(@Body() body: CreateBrandTranslationDtoType) {
    return await this.brandTranslationService.create(body);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.brandTranslationService.findAll({ page: +page, limit: +limit });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.brandTranslationService.findById(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    new ValidationInterceptor({ validate: updateBrandTranslationDto }),
  )
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateBrandTranslationDtoType,
  ) {
    return await this.brandTranslationService.updateById({
      id: +id,
      data: body,
    });
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return this.brandTranslationService.deleteById(+id);
  }
}
