import { Module } from '@nestjs/common';

import { ProductService } from 'src/modules/product/services/product.service';
import { ProductRepository } from 'src/modules/share/repositories/product.repository';
import { ProductController } from 'src/modules/product/controllers/product.controller';
import { ProductTranslationService } from 'src/modules/product/services/productTranslation.service';
import { ProductTranslationRepository } from 'src/modules/share/repositories/productTranslation.repository';
import { ProductTranslationController } from 'src/modules/product/controllers/productTranslation.controller';
import { ProductManagementController } from '@product/controllers/productManagement.controller';
import { ProductManagementService } from '@product/services/productManagement.service';

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
    ProductRepository,
    ProductTranslationRepository,
  ],
})
export class ProductModule {}
