import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { Message } from 'src/decorators/message.decorator';
import { RoleService } from 'src/modules/role/role.service';
import { RoleDetailDto, RoleListDto } from '@role/dtos/role.response';
import { CreateRoleDto, UpdateRoleDto } from '@role/dtos/role.request';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  @ZodSerializerDto(RoleListDto)
  async findAll() {
    return await this.roleService.findAll();
  }

  @Get(':id')
  @ZodSerializerDto(RoleDetailDto)
  async findById(@Param('id') id: string) {
    return await this.roleService.findById(+id);
  }

  @Post()
  async create(@Body() body: CreateRoleDto) {
    return await this.roleService.create(body);
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() body: UpdateRoleDto) {
    return await this.roleService.updateById({ id: +id, data: body });
  }

  @Delete(':id')
  @Message('delete successfully')
  async deleteById(@Param('id') id: string) {
    await this.roleService.deleteById(+id);
  }
}
