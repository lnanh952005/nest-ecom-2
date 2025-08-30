import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { LanguageService } from './language.service';
import { Message } from 'src/decorators/message.decorator';
import {
  CreateLanguageDto,
  UpdateLanguageDto,
} from '@language/dtos/language.request';

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
  async create(@Body() body: CreateLanguageDto) {
    return await this.languageService.create(body);
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() body: UpdateLanguageDto) {
    return await this.languageService.updateById({ id, data: body });
  }

  @Delete(':id')
  @HttpCode(200)
  @Message('delete successfully')
  async deleteById(@Param('id') id: string) {
    await this.languageService.deleteById(id);
  }
}
