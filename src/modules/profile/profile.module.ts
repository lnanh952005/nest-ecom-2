import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { ProfileController } from 'src/modules/profile/profile.controller';
import { ProfileService } from 'src/modules/profile/profile.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [UserModule]
})
export class ProfileModule {}
