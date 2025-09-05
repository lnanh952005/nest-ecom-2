import { Injectable } from '@nestjs/common';
import {
  CategoryNotFoundException,
  CategoryTranslationAlreadyExistsException,
  CategoryTranslationNotFoundException,
} from 'src/modules/category/category.error';
import { LanguageNotFoundException } from 'src/modules/language/language.error';
import { CategoryRepository } from '@category/repositories/category.repository';

import { isUniqueConstraintPrismaError } from 'src/modules/share/utils/prismaError.util';
import { CategoryTranslationRepository } from '@category/repositories/categoryTranslation.repository';
import {
  CreateCategoryTranslationDto,
  UpdateCategoryTranslationDto,
} from '@category/dtos/category.request';
import { LanguageRepository } from '@language/language.repository';

@Injectable()
export class CategoryTranslationService {
  constructor(
    private categoryRepository: CategoryRepository,
    private languageRepository: LanguageRepository,
    private categoryTranslationRepository: CategoryTranslationRepository,
  ) {}

  async findAll({ languageId }: { languageId: string }) {
    return await this.categoryTranslationRepository.findAll({ languageId });
  }

  async findById(id: number) {
    try {
      return this.categoryTranslationRepository.findById(id);
    } catch (error) {
      throw CategoryTranslationNotFoundException;
    }
  }

  async create(data: CreateCategoryTranslationDto) {
    if (data.categoryId) {
      await this.categoryRepository
        .findById({ id: data.categoryId, languageId: 'all' })
        .catch(() => {
          throw CategoryNotFoundException;
        });
    }
    if (data.languageId) {
      await this.languageRepository.findById(data.languageId).catch(() => {
        throw LanguageNotFoundException;
      });
    }
    try {
      return await this.categoryTranslationRepository.create(data);
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw CategoryTranslationAlreadyExistsException;
      }
    }
  }

  async updateById({
    data,
    id,
  }: {
    id: number;
    data: UpdateCategoryTranslationDto;
  }) {
    if (data.categoryId) {
      await this.categoryRepository
        .findById({ id: data.categoryId, languageId: 'all' })
        .catch(() => {
          throw CategoryNotFoundException;
        });
    }
    if (data.languageId) {
      await this.languageRepository.findById(data.languageId).catch(() => {
        throw LanguageNotFoundException;
      });
    }
    try {
      return await this.categoryTranslationRepository.updateById({ id, data });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw CategoryTranslationAlreadyExistsException;
      }
      throw CategoryTranslationNotFoundException;
    }
  }

  async deleteById(id: number) {
    try {
      await this.categoryTranslationRepository.deleteById(id);
    } catch (error) {
      throw CategoryTranslationNotFoundException;
    }
  }
}
