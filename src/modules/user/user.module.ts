import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from '@user/user.repository';
import { RoleModule } from '@role/role.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
  imports: [RoleModule],
})
export class UserModule {}
