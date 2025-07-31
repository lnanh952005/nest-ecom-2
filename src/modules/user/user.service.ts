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

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async updateById({ id, data }: { id: number; data: UpdateUser }) {
    if (data.phoneNumber) {
      const isPhone = await this.userRepository.isPhoneNumberExisting(
        data.phoneNumber,
      );
      if (isPhone) {
        throw new ConflictException('phone number already existed');
      }
    }
    if (data.password) {
      data.password = await this.passwordEncoderService.hash(data.password);
    }
    if (data.roleId) {
      const role = await this.roleRepository.findById(data.roleId);
      if (!role) {
        throw new BadRequestException('role not found');
      }
    }
    await this.userRepository.updateById({ id, data: data });
  }
}
