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
import { ZodSerializerDto } from 'nestjs-zod';

import { Public } from 'src/decorators/public.decorator';
import { Message } from 'src/decorators/message.decorator';
import { BrandService } from 'src/modules/brand/services/brand.service';
import { BrandDetailDto, BrandListDto } from '@brand/dtos/brand.response';
import { CreateBrandDto, UpdateBrandDto } from '@brand/dtos/brand.request';

@Controller('brands')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get()
  @Public()
  @ZodSerializerDto(BrandListDto)
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.brandService.findAll({ page: +page, limit: +limit });
  }

  @Get(':id')
  @Public()
  @ZodSerializerDto(BrandDetailDto)
  async findById(@Param('id') id: string) {
    return await this.brandService.findById(+id);
  }

  @Post()
  async create(@Body() body: CreateBrandDto) {
    return await this.brandService.create(body);
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() body: UpdateBrandDto) {
    return await this.brandService.updateById({ id: +id, data: body });
  }

  @Delete(':id')
  @Message('delete successfully')
  async deleteById(@Param('id') id: string) {
    await this.brandService.deleteById(+id);
  }
}
