import { Injectable } from '@nestjs/common';
import { EmailNotFoundException } from 'src/modules/auth/auth.error';
import {
  PasswordIsIncorrectException,
  PhoneNumberAlreadyExistsException,
} from 'src/modules/profile/profile.error';
import {
  ChangePasswordDtoType,
  UpdateProfileDtoType,
} from 'src/modules/profile/profile.type';
import { UserRepository } from 'src/modules/share/repositories/user.repository';
import { PasswordEncoderService } from 'src/modules/share/services/passwordEncoder.service';

@Injectable()
export class ProfileService {
  constructor(
    private userRepository: UserRepository,
    private passwordEncoderService: PasswordEncoderService,
  ) {}

  async getProfile(id: number) {
    return await this.userRepository.findByIdOrEmail({ id });
  }

  async changePassword({
    data,
    id,
  }: {
    id: number;
    data: ChangePasswordDtoType;
  }) {
    const user = await this.userRepository.findByIdOrEmail({ id });
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

    return await this.userRepository.updateByIdOrEmail({
      unique: { id: user.id },
      data: {
        password: await this.passwordEncoderService.hash(data.newPassword),
      },
    });
  }

  async updateProfile({
    data,
    id,
  }: {
    id: number;
    data: UpdateProfileDtoType;
  }) {
    try {
      return await this.userRepository.updateByIdOrEmail({
        unique: { id },
        data: {
          ...data,
        },
      });
    } catch (error) {
      throw PhoneNumberAlreadyExistsException;
    }
  }
}
