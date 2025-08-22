import { Injectable } from '@nestjs/common';
import {
  ProductTranslationAlreadyExistsException,
  ProductTranslationNotFoundException,
} from 'src/modules/product/product.error';
import {
  CreateProductTranslationDtoType,
  UpdateProductTranslationDtoType,
} from 'src/modules/product/product.type';
import {
  isUniqueConstraintPrismaError,
  RecordNotFoundException,
} from 'src/modules/share/utils/prismaError.util';
import { ProductTranslationRepository } from 'src/modules/share/repositories/productTranslation.repository';

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

  async create(data: CreateProductTranslationDtoType) {
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
    data: UpdateProductTranslationDtoType;
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
