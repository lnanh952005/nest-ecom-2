import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';

import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '@permission/dtos/permission.request';
import {
  PermissionDetailDto,
  PermissionListDto,
} from '@permission/dtos/permission.response';
import { ZodSerializerDto } from 'nestjs-zod';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get(':id')
  @ZodSerializerDto(PermissionDetailDto)
  async findById(@Param('id') id: string) {
    return await this.permissionService.findById(+id);
  }

  @Get()
  @ZodSerializerDto(PermissionListDto)
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.permissionService.findAll({ page: +page, limit: +limit });
  }

  @Post()
  async create(@Body() body: CreatePermissionDto) {
    return await this.permissionService.create(body);
  }

  @Put(':id')
  async updateById(@Param('id') id: string, @Body() body: UpdatePermissionDto) {
    return await this.permissionService.updateById({ id: +id, data: body });
  }
}
