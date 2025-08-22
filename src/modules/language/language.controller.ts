import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { Message } from 'src/decorators/message.decorator';
import { LanguageService } from './language.service';
import {
  CreateLanguageDtoType,
  UpdateLanguageDtoType,
} from '@language/language.type';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';
import { createLanguageDto, updateLanguageDto } from '@language/dtos/language.request';

@Controller('languages')
export class LanguageController {
  constructor(private languageService: LanguageService) {}

  @Get()
  async findAll() {
    return await this.languageService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.languageService.findById(id);
  }

  @Post()
  @UseInterceptors(new ValidationInterceptor({ validate: createLanguageDto }))
  async create(@Body() body: CreateLanguageDtoType) {
    return await this.languageService.create(body);
  }

  @Put(':id')
  @UseInterceptors(new ValidationInterceptor({ validate: updateLanguageDto }))
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateLanguageDtoType,
  ) {
    return await this.languageService.updateById({ id, data: body });
  }

  @Delete(':id')
  @HttpCode(200)
  @Message('delete successfully')
  async deleteById(@Param('id') id: string) {
    await this.languageService.deleteById(id);
  }
}
