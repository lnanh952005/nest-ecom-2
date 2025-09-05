import { Injectable } from '@nestjs/common';
import {
  PermissionAlreadyExistedException,
  PermissionNotFoundException,
} from './permission.error';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '@permission/dtos/permission.request';

import { isUniqueConstraintPrismaError } from 'src/modules/share/utils/prismaError.util';
import { PermissionRepository } from '@permission/permission.repository';

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

  async create(data: CreatePermissionDto) {
    try {
      return await this.permissionRepository.create({
        ...data,
      });
    } catch (error) {
      throw PermissionAlreadyExistedException;
    }
  }

  async updateById({ data, id }: { id: number; data: UpdatePermissionDto }) {
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
