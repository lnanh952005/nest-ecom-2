import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import multer from 'multer';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/decorators/public.decorator';
import { MediaService } from 'src/modules/media/media.service';
import { EnvService } from 'src/modules/share/services/env.service';
import { createFileName } from 'src/modules/share/utils/helper.util';

@Controller('media')
export class MediaController {
  constructor(
    private envService: EnvService,
    private mediaService: MediaService,
  ) {}

  @Get('static/:file')
  @Public()
  getImage(@Param('file') filename: string, @Res() res: Response) {
    res
      .status(200)
      .sendFile(`${this.envService.UPLOAD_DIR}/${filename}`, (error) => {
        res.status(404).json({
          statusCode: 404,
          message: 'image not found',
        });
      });
  }

  @Post('image-upload')
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: multer.diskStorage({
        destination: 'upload',
        filename(req, file, cb) {
          const fileName = createFileName(file.originalname);
          cb(null, fileName);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 2,
      },
      fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg|webp)$/)) {
          return cb(
            new multer.MulterError(
              'LIMIT_UNEXPECTED_FILE',
              'Only image files are allowed!',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
    return await this.mediaService.uploadImage(files);
  }

  @Post('image-upload-presignedUrl')
  @HttpCode(200)
  @Public()
  async getPresignedUrl(@Body() body: { filename: string }) {
    return await this.mediaService.getPresignedUrl(body.filename);
  }
}
