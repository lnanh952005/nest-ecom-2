import { Module } from '@nestjs/common';

import { LanguageModule } from '@language/language.module';
import { BrandRepository } from '@brand/repositories/brand.repository';
import { BrandService } from 'src/modules/brand/services/brand.service';
import { BrandController } from 'src/modules/brand/controllers/brand.controller';
import { BrandTranslationRepository } from '@brand/repositories/brandTranslation.repository';
import { BrandTranslationService } from 'src/modules/brand/services/brandTranslation.service';
import { BrandTranslationController } from 'src/modules/brand/controllers/brandTranslation.controller';

@Module({
  controllers: [BrandController, BrandTranslationController],
  providers: [
    BrandService,
    BrandTranslationService,
    // repository
    BrandRepository,
    BrandTranslationRepository,
  ],
  imports: [LanguageModule],
})
export class BrandModule {}
