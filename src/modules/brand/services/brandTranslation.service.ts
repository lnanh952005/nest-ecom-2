import { Injectable } from '@nestjs/common';
import {
  BrandNotFoundException,
  BrandTranslationAlreadyExistsException,
  BrandTranslationNotFoundException,
} from 'src/modules/brand/brand.error';
import {
  CreateBrandTranslationDtoType,
  UpdateBrandTranslationDtoType,
} from 'src/modules/brand/brand.type';
import { LanguageNotFoundException } from 'src/modules/language/language.error';
import { BrandRepository } from 'src/modules/share/repositories/brand.repository';
import { LanguageRepository } from 'src/modules/share/repositories/language.repository';
import { isUniqueConstraintPrismaError } from 'src/modules/share/utils/prismaError.util';
import { BrandTranslationRepository } from 'src/modules/share/repositories/brandTranslation.repository';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class BrandTranslationService {
  constructor(
    private brandRepository: BrandRepository,
    private languageRepository: LanguageRepository,
    private BrandTranslationRepository: BrandTranslationRepository,
  ) {}

  async create(data: CreateBrandTranslationDtoType) {
    await this.brandRepository
      .findById({
        id: data.brandId,
        languageId: I18nContext.current()?.lang as string,
      })
      .catch(() => {
        throw BrandNotFoundException;
      });
    await this.languageRepository.findById(data.languageId).catch(() => {
      throw LanguageNotFoundException;
    });
    try {
      return await this.BrandTranslationRepository.create(data);
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandTranslationAlreadyExistsException;
      }
    }
  }

  async findAll({ limit, page }: { page: number; limit: number }) {
    const { items, totalItems } = await this.BrandTranslationRepository.findAll(
      { page, limit },
    );
    return {
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      items,
    };
  }

  async findById(id: number) {
    try {
      return await this.BrandTranslationRepository.findById(id);
    } catch (error) {
      throw BrandTranslationNotFoundException;
    }
  }

  async updateById({
    id,
    data,
  }: {
    id: number;
    data: UpdateBrandTranslationDtoType;
  }) {
    if (data.brandId) {
      await this.brandRepository
        .findById({
          id: data.brandId,
          languageId: I18nContext.current()?.lang as string,
        })
        .catch(() => {
          throw BrandNotFoundException;
        });
    }
    if (data.languageId) {
      await this.languageRepository.findById(data.languageId).catch(() => {
        throw LanguageNotFoundException;
      });
    }
    try {
      return await this.BrandTranslationRepository.updateById({ id, data });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandTranslationAlreadyExistsException;
      }
    }
  }

  async deleteById(id: number) {
    try {
      await this.BrandTranslationRepository.deleteById(id);
    } catch (error) {
      throw BrandTranslationNotFoundException;
    }
  }
}
