import { Injectable } from '@nestjs/common';

import {
  LanguageExistedException,
  LanguageNotFoundException,
} from './language.error';
import {
  CreateLanguageDto,
  UpdateLanguageDto,
} from '@language/dtos/language.request';
import { LanguageRepository } from '@language/language.repository';

@Injectable()
export class LanguageService {
  constructor(private languageRepository: LanguageRepository) {}

  async create({ id, name }: CreateLanguageDto) {
    try {
      return await this.languageRepository.create({ id, name });
    } catch (error) {
      throw LanguageExistedException;
    }
  }

  async findAll() {
    return await this.languageRepository.findAll();
  }

  async findById(id: string) {
    try {
      return await this.languageRepository.findById(id);
    } catch (error) {
      throw LanguageNotFoundException;
    }
  }

  async updateById({ id, data }: { id: string; data: UpdateLanguageDto }) {
    try {
      return await this.languageRepository.updateById({ id, data });
    } catch (error) {
      throw LanguageNotFoundException;
    }
  }

  async deleteById(id: string) {
    try {
      await this.languageRepository.deleteById(id);
    } catch (error) {
      throw LanguageNotFoundException;
    }
  }
}
