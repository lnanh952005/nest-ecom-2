import { Injectable } from '@nestjs/common';
import { isUniqueConstraintPrismaError } from 'src/modules/share/utils/prismaError.util';
import { PermissionRepository } from '../share/repositories/permission.repository';
import { PaginationType } from '../share/types';
import {
  PermissionAlreadyExistedException,
  PermissionNotFoundException,
} from './permission.error';
import {
  CreatePermissionDtoType,
  UpdatePermissionDtoType,
} from 'src/modules/permission/permission.type';

@Injectable()
export class PermissionService {
  constructor(private permissionRepository: PermissionRepository) {}

  async findById(id: number) {
    try {
      return await this.permissionRepository.findById(id);
    } catch (error) {
      throw PermissionNotFoundException;
    }
  }

  async findAll(data: { page: number; limit: number }) {
    return await this.permissionRepository.findAll(data);
  }

  async create(data: CreatePermissionDtoType) {
    try {
      return await this.permissionRepository.create({
        ...data,
      });
    } catch (error) {
      throw PermissionAlreadyExistedException;
    }
  }

  async updateById({
    data,
    id,
  }: {
    id: number;
    data: UpdatePermissionDtoType;
  }) {
    try {
      return await this.permissionRepository.updateById({ id, data });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw PermissionAlreadyExistedException;
      }
      throw PermissionNotFoundException;
    }
  }

  async deleteById(id: number) {
    try {
      await this.permissionRepository.deleteById(id);
    } catch (error) {
      throw PermissionNotFoundException;
    }
  }
}
