import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from '../share/repositories/user.repository';
import { PasswordEncoderService } from '../share/services/passwordEncoder.service';
import { RoleRepository } from '../share/repositories/role.repository';
import { UpdateUserDtoType } from 'src/modules/user/user.type';

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

  async findByIdOrEmail(unique: { id: number } | { email: string }) {
    return await this.userRepository.findByIdOrEmail(unique);
  }

  async resetPassword(newPassword: string) {}

  async updateById({ id, data }: { id: number; data: UpdateUserDtoType }) {
    if (data.phoneNumber) {
      const isPhone = await this.userRepository.isPhoneNumberExisting(
        data.phoneNumber,
      );
      if (isPhone) {
        throw new ConflictException('phone number already existed');
      }
    }
    // if (data.password) {
    //   data.password = await this.passwordEncoderService.hash(data.password);
    // }
    if (data.roleId) {
      const role = await this.roleRepository.findById(data.roleId);
      if (!role) {
        throw new BadRequestException('role not found');
      }
    }
    await this.userRepository.updateByIdOrEmail({ unique: { id }, data: data });
  }
}
