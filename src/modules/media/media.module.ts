import { Module } from '@nestjs/common';
import { MediaController } from 'src/modules/media/media.controller';
import { MediaService } from 'src/modules/media/media.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
