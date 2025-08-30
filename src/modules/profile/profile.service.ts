import { Injectable } from '@nestjs/common';
import {
  ChangePasswordDto,
  UpdateProfileDto,
} from '@profile/dtos/profile.request';
import {
  PasswordIsIncorrectException,
  PhoneNumberAlreadyExistsException,
} from 'src/modules/profile/profile.error';
import { EmailNotFoundException } from 'src/modules/auth/auth.error';
import { UserRepository } from 'src/modules/share/repositories/user.repository';
import { PasswordEncoderService } from 'src/modules/share/services/passwordEncoder.service';

@Injectable()
export class ProfileService {
  constructor(
    private userRepository: UserRepository,
    private passwordEncoderService: PasswordEncoderService,
  ) {}

  async getProfile(id: number) {
    return await this.userRepository.findByIdOrEmail({ unique: { id } });
  }

  async changePassword({ data, id }: { id: number; data: ChangePasswordDto }) {
    const user = await this.userRepository.findByIdOrEmail({ unique: { id } });
    if (!user) {
      throw EmailNotFoundException;
    }

    const isMatching = await this.passwordEncoderService.compare(
      data.password,
      user.password,
    );

    if (!isMatching) {
      throw PasswordIsIncorrectException;
    }

    return await this.userRepository.updateById({
      id: user.id,
      data: {
        password: await this.passwordEncoderService.hash(data.newPassword),
      },
    });
  }

  async updateProfile({ data, id }: { id: number; data: UpdateProfileDto }) {
    try {
      return await this.userRepository.updateProfile({
        id,
        data,
      });
    } catch (error) {
      throw PhoneNumberAlreadyExistsException;
    }
  }
}
