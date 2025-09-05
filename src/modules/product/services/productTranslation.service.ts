import { Injectable } from '@nestjs/common';
import {
  ProductTranslationAlreadyExistsException,
  ProductTranslationNotFoundException,
} from 'src/modules/product/product.error';

import {
  isUniqueConstraintPrismaError,
  RecordNotFoundException,
} from 'src/modules/share/utils/prismaError.util';
import { ProductTranslationRepository } from '@product/repositories/productTranslation.repository';
import {
  CreateProductTranslationDto,
  UpdateProductTranslationDto,
} from '@product/dtos/product.request';

@Injectable()
export class ProductTranslationService {
  constructor(
    private productTranslationRepository: ProductTranslationRepository,
  ) {}

  async findAll() {}

  async findById({ id, languageId }: { id: number; languageId: string }) {
    try {
      return await this.productTranslationRepository.findById({
        id,
        languageId,
      });
    } catch (error) {
      throw ProductTranslationNotFoundException;
    }
  }

  async create(data: CreateProductTranslationDto) {
    try {
      return this.productTranslationRepository.create(data);
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw ProductTranslationAlreadyExistsException;
      }
      throw RecordNotFoundException;
    }
  }

  async updateById({
    data,
    id,
  }: {
    id: number;
    data: UpdateProductTranslationDto;
  }) {
    try {
      return this.productTranslationRepository.updateById({ id, data });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw ProductTranslationAlreadyExistsException;
      }
      throw ProductTranslationNotFoundException;
    }
  }

  async deleteById(id: number) {
    try {
      return await this.productTranslationRepository.deleteById(id);
    } catch (error) {
      throw ProductTranslationNotFoundException;
    }
  }
}
