import { Module } from '@nestjs/common';
import { RoleRepository } from '@role/role.repository';
import { RoleController } from 'src/modules/role/role.controller';

import { RoleService } from 'src/modules/role/role.service';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleRepository],
})
export class RoleModule {}
