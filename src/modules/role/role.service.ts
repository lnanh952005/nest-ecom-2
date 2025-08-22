import { Injectable } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import {
  RoleAlreadyExistedException,
  RoleNotFoundException,
} from 'src/modules/role/role.error';
import {
  CreateRoleDtoType,
  UpdateRoleDtoType,
} from 'src/modules/role/role.type';
import { RoleRepository } from 'src/modules/share/repositories/role.repository';
import { isUniqueConstraintPrismaError } from 'src/modules/share/utils/prismaError.util';

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  async findAll() {
    return await this.roleRepository.findAll();
  }

  async findById(id: number) {
    return await this.roleRepository
      .getDetailById(id)
      .catch(() => {
        throw RoleNotFoundException;
      });
  }

  async findByName(name: RoleEnum) {
    return await this.roleRepository.findByName(name);
  }

  async create(data: CreateRoleDtoType) {
    try {
      return await this.roleRepository.create(data);
    } catch (error) {
      throw RoleAlreadyExistedException;
    }
  }

  async updateById({ id, data }: { id: number; data: UpdateRoleDtoType }) {
    try {
      const result = await this.roleRepository.updateById({ id, data });
      return {
        ...result,
      };
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw RoleAlreadyExistedException;
      }
      throw RoleNotFoundException;
    }
  }

  async deleteById(id: number) {
    try {
      await this.roleRepository.deleteById(id);
    } catch (error) {
      throw RoleNotFoundException;
    }
  }
}
