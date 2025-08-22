import { Body, Controller, Get, Post, Put, UseInterceptors } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';
import {
  changePasswordDto,
  updateProfileDto,
} from 'src/modules/profile/dtos/profile.request';
import { profileResDto } from 'src/modules/profile/dtos/profile.response';
import { ProfileService } from 'src/modules/profile/profile.service';
import {
  ChangePasswordDtoType,
  UpdateProfileDtoType,
} from 'src/modules/profile/profile.type';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('profile')
  @UseInterceptors(new ValidationInterceptor({ serialize: profileResDto }))
  async getProfile(@User('userId') userId: number) {
    return await this.profileService.getProfile(+userId);
  }

  @Put()
  @UseInterceptors(
    new ValidationInterceptor({
      validate: updateProfileDto,
      serialize: profileResDto,
    }),
  )
  async updateProfile(
    @Body() body: UpdateProfileDtoType,
    @User('userId') id: number,
  ) {
    return await this.profileService.updateProfile({ id, data: body });
  }

  @Post('change-password')
  @UseInterceptors(
    new ValidationInterceptor({
      validate: changePasswordDto,
      serialize: profileResDto,
    }),
  )
  async changePassword(
    @Body() body: ChangePasswordDtoType,
    @User('userId') id: number,
  ) {
    return await this.profileService.changePassword({ id, data: body });
  }
}
