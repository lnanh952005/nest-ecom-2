import { RoleEnum } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import {
  RoleAlreadyExistedException,
  RoleNotFoundException,
} from 'src/modules/role/role.error';
import { CreateRoleDto, UpdateRoleDto } from '@role/dtos/role.request';
import { RoleRepository } from 'src/modules/share/repositories/role.repository';
import { isUniqueConstraintPrismaError } from 'src/modules/share/utils/prismaError.util';

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  async findAll() {
    return await this.roleRepository.findAll();
  }

  async findById(id: number) {
    return await this.roleRepository.getDetailById(id).catch(() => {
      throw RoleNotFoundException;
    });
  }

  async findByName(name: RoleEnum) {
    return await this.roleRepository.findByName(name);
  }

  async create(data: CreateRoleDto) {
    try {
      return await this.roleRepository.create(data);
    } catch (error) {
      throw RoleAlreadyExistedException;
    }
  }

  async updateById({ id, data }: { id: number; data: UpdateRoleDto }) {
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
