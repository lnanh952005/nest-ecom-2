import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors
} from '@nestjs/common';
import { ValidationInterceptor } from 'src/interceptors/validation.interceptor';
import {
  createPermissionDto,
  updatePermissionDto,
} from 'src/modules/permission/dtos/permission.request';
import { permissionListResDto } from 'src/modules/permission/dtos/permission.response';
import {
  CreatePermissionDtoType,
  UpdatePermissionDtoType,
} from 'src/modules/permission/permission.type';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.permissionService.findById(+id);
  }

  @Get()
  @UseInterceptors(
    new ValidationInterceptor({ serialize: permissionListResDto }),
  )
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.permissionService.findAll({ page: +page, limit: +limit });
  }

  @Post()
  @UseInterceptors(new ValidationInterceptor({ validate: createPermissionDto }))
  async create(@Body() body: CreatePermissionDtoType) {
    return await this.permissionService.create(body);
  }

  @Put(':id')
  @UseInterceptors(new ValidationInterceptor({ validate: updatePermissionDto }))
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdatePermissionDtoType,
  ) {
    return await this.permissionService.updateById({ id: +id, data: body });
  }
}
