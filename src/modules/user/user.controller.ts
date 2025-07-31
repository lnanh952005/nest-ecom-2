import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UpdateUser } from './user.dto';
import { UserService } from './user.service';
import { userListSerialization, userSerialization } from './user.model';

@Controller('users')
export class UserController {
  constructor(private userSerice: UserService) {}

  @Get()
  async findAll() {
    return userListSerialization.parse(await this.userSerice.findAll());
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return userSerialization.parse(await this.userSerice.findById(+id));
  }

  @Patch(':id')
  async updateById(@Param('id') id: string, @Body() body: UpdateUser) {
    return await this.userSerice.updateById({ id: +id, data: body });
  }
}
