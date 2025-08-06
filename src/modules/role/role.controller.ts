import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Message } from 'src/decorators/message.decorator';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';
import {
  createRoleDto,
  updateRoleDto,
} from 'src/modules/role/dtos/role.request';
import {
  roleListResDto,
  roleResDto,
} from 'src/modules/role/dtos/role.response';
import { RoleService } from 'src/modules/role/role.service';
import {
  CreateRoleDtoType,
  UpdateRoleDtoType,
} from 'src/modules/role/role.type';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  @UseInterceptors(new ValidationInterceptor({ serialize: roleListResDto }))
  async findAll() {
    return await this.roleService.findAll();
  }

  @Post()
  @UseInterceptors(
    new ValidationInterceptor({
      validate: createRoleDto,
      serialize: roleResDto,
    }),
  )
  async create(@Body() body: CreateRoleDtoType) {
    return await this.roleService.create(body);
  }

  @Get(':id')
  @UseInterceptors(new ValidationInterceptor({ serialize: roleResDto }))
  async findById(@Param('id') id: string) {
    return await this.roleService.findById(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    new ValidationInterceptor({
      validate: updateRoleDto,
      serialize: roleResDto,
    }),
  )
  async updateById(@Param('id') id: string, @Body() body: UpdateRoleDtoType) {
    return await this.roleService.updateById({ id: +id, data: body });
  }

  @Delete(':id')
  @Message('delete successfully')
  async deleteById(@Param('id') id: string) {
    await this.roleService.deleteById(+id);
  }
}
