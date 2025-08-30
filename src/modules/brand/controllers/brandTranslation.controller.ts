import {
  CreateBrandTranslationDto,
  UpdateBrandTranslationDto,
} from '@brand/dtos/brand.request';
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
} from '@nestjs/common';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';

import { BrandTranslationService } from 'src/modules/brand/services/brandTranslation.service';

@Controller('brand-translations')
export class BrandTranslationController {
  constructor(private brandTranslationService: BrandTranslationService) {}

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

  @Post()
  async create(@Body() body: CreateBrandTranslationDto) {
    return await this.brandTranslationService.create(body);
  }

  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateBrandTranslationDto,
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
