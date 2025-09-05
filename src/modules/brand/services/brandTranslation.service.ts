import { I18nContext } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import {
  BrandNotFoundException,
  BrandTranslationAlreadyExistsException,
  BrandTranslationNotFoundException,
} from 'src/modules/brand/brand.error';
import { LanguageNotFoundException } from 'src/modules/language/language.error';
import { BrandRepository } from '@brand/repositories/brand.repository';
import { isUniqueConstraintPrismaError } from 'src/modules/share/utils/prismaError.util';
import { BrandTranslationRepository } from '@brand/repositories/brandTranslation.repository';
import {
  CreateBrandTranslationDto,
  UpdateBrandTranslationDto,
} from '@brand/dtos/brand.request';
import { LanguageRepository } from '@language/language.repository';

@Injectable()
export class BrandTranslationService {
  constructor(
    private brandRepository: BrandRepository,
    private languageRepository: LanguageRepository,
    private BrandTranslationRepository: BrandTranslationRepository,
  ) {}

  async create(data: CreateBrandTranslationDto) {
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
    data: UpdateBrandTranslationDto;
  }) {
    await this.brandRepository
      .findById({
        id: data.brandId,
        languageId: 'all',
      })
      .catch(() => {
        throw BrandNotFoundException;
      });
    await this.languageRepository.findById(data.languageId).catch(() => {
      throw LanguageNotFoundException;
    });
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
