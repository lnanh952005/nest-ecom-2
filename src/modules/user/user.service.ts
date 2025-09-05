import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PasswordEncoderService } from '../share/services/passwordEncoder.service';
import { RoleRepository } from '../role/role.repository';
import {
  CannotUpdateOrDeleteYourSelfException,
  DoNotHavePermissionToCreateOrUpdateRoleException,
} from 'src/modules/user/user.error';
import { PhoneNumberAlreadyExistsException } from 'src/modules/profile/profile.error';
import {
  EmailExistedException,
  EmailNotFoundException,
} from 'src/modules/auth/auth.error';
import { RoleNotFoundException } from 'src/modules/role/role.error';
import { CreateUserDto, UpdateUserDto } from '@user/dtos/user.request';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private passwordEncoderService: PasswordEncoderService,
  ) {}

  async findAll({ limit, page }: { page: number; limit: number }) {
    const { items, totalItems } = await this.userRepository.findAll({
      limit,
      page,
    });
    return {
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      items,
    };
  }

  async getUserDetailById(id: number) {
    return await this.userRepository.getUserDetailById(id).catch(() => {
      throw EmailNotFoundException;
    });
  }

  async create({ data, roleId }: { roleId: number; data: CreateUserDto }) {
    if (data.roleId < roleId) {
      throw DoNotHavePermissionToCreateOrUpdateRoleException;
    }
    await this.userRepository.isEmailExisting(data.email).catch(() => {
      throw EmailExistedException;
    });
    if (data.phoneNumber) {
      await this.userRepository
        .isPhoneNumberExisting(data.phoneNumber)
        .catch(() => {
          throw PhoneNumberAlreadyExistsException;
        });
    }
    return await this.userRepository.create({
      email: data.email,
      name: data.name,
      password: await this.passwordEncoderService.hash(data.password),
      roleId: data.roleId,
      status: data.status,
      avatar: data.avatar,
      phoneNumber: data.phoneNumber,
    });
  }

  async updateById({
    id,
    data,
    roleId,
    userId,
  }: {
    id: number;
    roleId: number;
    userId: number;
    data: UpdateUserDto;
  }) {
    if (id == userId) {
      throw CannotUpdateOrDeleteYourSelfException;
    }
    const user = await this.userRepository
      .findByIdOrEmail({ unique: { id } })
      .catch(() => {
        throw EmailExistedException;
      });

    if (user.roleId < roleId) {
      throw DoNotHavePermissionToCreateOrUpdateRoleException;
    }
    if (data.roleId && data.roleId < roleId) {
      throw DoNotHavePermissionToCreateOrUpdateRoleException;
    }
    if (data.phoneNumber) {
      await this.userRepository
        .isPhoneNumberExisting(data.phoneNumber)
        .catch(() => {
          throw PhoneNumberAlreadyExistsException;
        });
    }
    if (data.roleId) {
      await this.roleRepository.findById(data.roleId).catch(() => {
        throw RoleNotFoundException;
      });
    }
    return await this.userRepository.updateById({
      id,
      data,
    });
  }

  async deleteById({
    id,
    roleId,
    userId,
  }: {
    id: number;
    userId: number;
    roleId: number;
  }) {
    if (userId == id) {
      throw CannotUpdateOrDeleteYourSelfException;
    }
    const user = await this.userRepository
      .findByIdOrEmail({ unique: { id } })
      .catch(() => {
        throw EmailNotFoundException;
      });
    if (user.roleId < roleId) {
      throw DoNotHavePermissionToCreateOrUpdateRoleException;
    }
    await this.userRepository.deleteById(id);
  }
}
