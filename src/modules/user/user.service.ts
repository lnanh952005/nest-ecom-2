import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from '../share/repositories/user.repository';
import { UpdateUser } from './user.dto';
import { PasswordEncoderService } from '../share/services/passwordEncoder.service';
import { RoleRepository } from '../share/repositories/role.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private passwordEncoderService: PasswordEncoderService,
  ) {}

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findById(id: number) {
    return await this.userRepository.findById(id);
  }

  async updateById(id: number, updateUser: UpdateUser) {
    if (updateUser.phoneNumber) {
      const isPhone = await this.userRepository.isPhoneNumberExisting(
        updateUser.phoneNumber,
      );
      if (isPhone) {
        throw new ConflictException('phone number already existed');
      }
    }
    if (updateUser.password) {
      updateUser.password = await this.passwordEncoderService.hash(
        updateUser.password,
      );
    }
    if (updateUser.roleId) {
      const role = await this.roleRepository.findById(updateUser.roleId);
      if (!role) {
        throw new BadRequestException('role not found');
      }
    }
    await this.userRepository.updateByid(id, updateUser);
  }
}
