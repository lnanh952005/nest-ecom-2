import { Module } from '@nestjs/common';

import { ProductService } from 'src/modules/product/services/product.service';
import { ProductRepository } from '@product/repositories/product.repository';
import { ProductController } from 'src/modules/product/controllers/product.controller';
import { ProductTranslationService } from 'src/modules/product/services/productTranslation.service';
import { ProductTranslationRepository } from '@product/repositories/productTranslation.repository';
import { ProductTranslationController } from 'src/modules/product/controllers/productTranslation.controller';
import { ProductManagementController } from '@product/controllers/productManagement.controller';
import { ProductManagementService } from '@product/services/productManagement.service';
import { SkuRepository } from '@product/repositories/sku.repository';

@Module({
  controllers: [
    ProductController,
    ProductTranslationController,
    ProductManagementController,
  ],
  providers: [
    ProductService,
    ProductTranslationService,
    ProductManagementService,
    // repository
    ProductRepository,
    ProductTranslationRepository,
    SkuRepository,
  ],
  exports: [SkuRepository],
})
export class ProductModule {}
