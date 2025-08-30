import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { UserService } from './user.service';
import { User } from 'src/decorators/user.decorator';
import { Message } from 'src/decorators/message.decorator';
import { AccessTokenPayload } from 'src/modules/auth/auth.type';
import { UserNotFoundException } from 'src/modules/auth/auth.error';
import { UserDetailDto, UserListDto } from '@user/dtos/user.response';
import { CreateUserDto, UpdateUserDto } from '@user/dtos/user.request';

@Controller('users')
export class UserController {
  constructor(private userSerice: UserService) {}

  @Get()
  @ZodSerializerDto(UserListDto)
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '30',
  ) {
    return await this.userSerice.findAll({ limit: +limit, page: +page });
  }

  @Post()
  async create(@Body() body: CreateUserDto, @User('roleId') roleId: number) {
    return await this.userSerice.create({ roleId, data: body });
  }

  @Get(':id')
  @ZodSerializerDto(UserDetailDto)
  async getUserDetailById(@Param('id') id: string) {
    return await this.userSerice.getUserDetailById(+id);
  }

  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @User() user: AccessTokenPayload,
    @Body() body: UpdateUserDto,
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
