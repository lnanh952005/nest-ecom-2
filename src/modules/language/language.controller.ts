import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { LanguageService } from './language.service';
import { Message } from 'src/decorators/message.decorator';
import { CreateLanguageDtoType, UpdateLanguageDtoType } from './dtos/language.request';


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
  async create(@Body() body: CreateLanguageDtoType) {
    return await this.languageService.create(body);
  }

  @Patch(':id')
  async updateById(@Param('id') id: string, @Body() body: UpdateLanguageDtoType) {
    return await this.languageService.updateById({ id, data:body });
  }

  @Delete(':id')
  @HttpCode(200)
  @Message("delete successfully")
  async deleteById(@Param('id') id: string) {
    await this.languageService.deleteById(id);
  }
}
