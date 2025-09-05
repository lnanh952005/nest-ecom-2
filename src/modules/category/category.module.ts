import { CategoryRepository } from '@category/repositories/category.repository';
import { Module } from '@nestjs/common';
import { CategoryTranslationRepository } from '@category/repositories/categoryTranslation.repository';
import { CategoryController } from 'src/modules/category/controllers/category.controller';
import { CategoryTranslationController } from 'src/modules/category/controllers/categoryTranslation.controller';
import { CategoryService } from 'src/modules/category/services/category.service';
import { CategoryTranslationService } from 'src/modules/category/services/categoryTranslation.service';
import { LanguageModule } from '@language/language.module';

@Module({
  controllers: [CategoryController, CategoryTranslationController],
  providers: [
    CategoryService,
    CategoryTranslationService,
    // repository
    CategoryRepository,
    CategoryTranslationRepository,
  ],
  imports: [LanguageModule],
})
export class CategoryModule {}
