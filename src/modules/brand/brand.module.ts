import { Module } from '@nestjs/common';

import { BrandService } from 'src/modules/brand/services/brand.service';
import { BrandController } from 'src/modules/brand/controllers/brand.controller';
import { BrandTranslationService } from 'src/modules/brand/services/brandTranslation.service';
import { BrandTranslationController } from 'src/modules/brand/controllers/brandTranslation.controller';

@Module({
  controllers: [BrandController, BrandTranslationController],
  providers: [BrandService, BrandTranslationService],
})
export class BrandModule {}
