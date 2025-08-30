import {
  Body,
  Controller,
  Get,
  Post,
  Put
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';

import { User } from 'src/decorators/user.decorator';
import { ProfileDto } from '@profile/dtos/profile.response';
import { ProfileService } from 'src/modules/profile/profile.service';
import { ChangePasswordDto, UpdateProfileDto } from '@profile/dtos/profile.request';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('profile')
  @ZodSerializerDto(ProfileDto)
  async getProfile(@User('userId') userId: number) {
    return await this.profileService.getProfile(+userId);
  }

  @Put()
  async updateProfile(
    @Body() body: UpdateProfileDto,
    @User('userId') id: number,
  ) {
    return await this.profileService.updateProfile({ id, data: body });
  }

  @Post('change-password')
  async changePassword(
    @Body() body: ChangePasswordDto,
    @User('userId') id: number,
  ) {
    return await this.profileService.changePassword({ id, data: body });
  }
}
