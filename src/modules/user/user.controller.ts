import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';
import {
  userListResDto,
  userResDto,
} from 'src/modules/user/dtos/user.response';
import { UpdateUserDtoType } from 'src/modules/user/user.type';
import { updateUserDto } from 'src/modules/user/dtos/user.request';

@Controller('users')
export class UserController {
  constructor(private userSerice: UserService) {}

  @Get()
  @UseInterceptors(new ValidationInterceptor({ serialize: userListResDto }))
  async findAll() {
    return await this.userSerice.findAll();
  }

  @Get(':id')
  @UseInterceptors(new ValidationInterceptor({ serialize: userResDto }))
  async findById(@Param('id') id: string) {
    return await this.userSerice.findByIdOrEmail({ id: +id });
  }

  @Patch(':id')
  @UseInterceptors(new ValidationInterceptor({ validate: updateUserDto }))
  async updateById(@Param('id') id: string, @Body() body: UpdateUserDtoType) {
    return await this.userSerice.updateById({ id: +id, data: body });
  }
}
