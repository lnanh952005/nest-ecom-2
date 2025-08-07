import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';
import {
  userListResDto,
  userResDto,
} from 'src/modules/user/dtos/user.response';
import {
  CreateUserDtoType,
  UpdateUserDtoType,
} from 'src/modules/user/user.type';
import {
  createUserDto,
  updateUserDto,
} from 'src/modules/user/dtos/user.request';
import { User } from 'src/decorators/user.decorator';
import { Message } from 'src/decorators/message.decorator';
import { AccessTokenPayload } from 'src/modules/auth/auth.type';
import { UserNotFoundException } from 'src/modules/auth/auth.error';

@Controller('users')
export class UserController {
  constructor(private userSerice: UserService) {}

  @Get()
  @UseInterceptors(new ValidationInterceptor({ serialize: userListResDto }))
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '30',
  ) {
    return await this.userSerice.findAll({ limit: +limit, page: +page });
  }

  @Post()
  @UseInterceptors(new ValidationInterceptor({ validate: createUserDto }))
  async create(
    @Body() body: CreateUserDtoType,
    @User('roleId') roleId: number,
  ) {
    return await this.userSerice.create({ roleId, data: body });
  }

  @Get(':id')
  @UseInterceptors(new ValidationInterceptor({ serialize: userResDto }))
  async findById(@Param('id') id: string) {
    return await this.userSerice.findByIdOrEmail({ id: +id });
  }

  @Patch(':id')
  @UseInterceptors(new ValidationInterceptor({ validate: updateUserDto }))
  async updateById(
    @Param('id') id: string,
    @User() user: AccessTokenPayload,
    @Body() body: UpdateUserDtoType,
  ) {
    const { roleId, userId } = user;
    return await this.userSerice.updateById({
      id: +id,
      roleId,
      userId,
      data: body,
    });
  }

  @Delete(':id')
  @Message('delete successfully')
  async deleteById(@Param('id') id: string, @User() user: AccessTokenPayload) {
    const { roleId, userId } = user;
    await this.userSerice.deleteById({ id: +id, userId, roleId }).catch(() => {
      throw UserNotFoundException;
    });
  }
}
