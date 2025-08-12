import { Module } from '@nestjs/common';
import { CategoryController } from 'src/modules/category/controllers/category.controller';
import { CategoryTranslationController } from 'src/modules/category/controllers/categoryTranslation.controller';
import { CategoryService } from 'src/modules/category/services/category.service';
import { CategoryTranslationService } from 'src/modules/category/services/categoryTranslation.service';

@Module({
  controllers: [CategoryController, CategoryTranslationController],
  providers: [CategoryService, CategoryTranslationService],
})
export class CategoryModule {}
