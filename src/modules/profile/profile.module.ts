import { Module } from '@nestjs/common';
import { ProfileController } from 'src/modules/profile/profile.controller';
import { ProfileService } from 'src/modules/profile/profile.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
