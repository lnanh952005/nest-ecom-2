import z from 'zod';
import {
  changePasswordDto,
  updateProfileDto,
} from 'src/modules/profile/dtos/profile.request';

export type UpdateProfileDtoType = z.infer<typeof updateProfileDto>;
export type ChangePasswordDtoType = z.infer<typeof changePasswordDto>;
