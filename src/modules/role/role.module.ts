import { Module } from '@nestjs/common';
import { RoleController } from 'src/modules/role/role.controller';

import { RoleService } from 'src/modules/role/role.service';

@Module({
    controllers: [RoleController],
    providers: [RoleService],
})
export class RoleModule {};