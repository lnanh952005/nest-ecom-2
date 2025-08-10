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
import { Message } from 'src/decorators/message.decorator';
import { Public } from 'src/decorators/public.decorator';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';
import {
  CreateBrandDtoType,
  UpdateBrandDtoType,
} from 'src/modules/brand/brand.type';
import {
  createBrandDto,
  updateBrandDto,
} from 'src/modules/brand/dtos/brand.request';
import {
  brandListResDto,
  brandResDto,
} from 'src/modules/brand/dtos/brand.response';
import { BrandService } from 'src/modules/brand/services/brand.service';

@Controller('brands')
export class BrandController {
  constructor(
    private brandService: BrandService
  ) {}

  @Get()
  @Public()
  @UseInterceptors(new ValidationInterceptor({ serialize: brandListResDto }))
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.brandService.findAll({ page: +page, limit: +limit});
  }

  @Get(':id')
  @Public()
  async findById(@Param('id') id: string) {
    return await this.brandService.findById(+id);
  }

  @Post()
  @UseInterceptors(
    new ValidationInterceptor({
      validate: createBrandDto,
      serialize: brandResDto,
    }),
  )
  async create(@Body() body: CreateBrandDtoType) {
    return await this.brandService.create(body);
  }

  @Patch(':id')
  @UseInterceptors(
    new ValidationInterceptor({
      validate: updateBrandDto,
      serialize: brandResDto,
    }),
  )
  async updateById(@Param('id') id: string, @Body() body: UpdateBrandDtoType) {
    return await this.brandService.updateById({ id: +id, data: body });
  }

  @Delete(':id')
  @Message('delete successfully')
  async deleteById(@Param('id') id: string) {
    await this.brandService.deleteById(+id);
  }
}
