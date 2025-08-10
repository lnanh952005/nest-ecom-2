import fs from 'fs/promises';
import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/modules/share/services/s3.service';
import { createFileName } from 'src/modules/share/utils/helper.util';
@Injectable()
export class MediaService {
  constructor(private s3Service: S3Service) {}

  async uploadImage(files: Express.Multer.File[]) {
    const result = await Promise.all(
      files.map(async (f) => {
        const res = await this.s3Service.uploadFile({
          filepath: f.path,
          contentType: f.mimetype,
          filename: f.filename,
        });
        return { url: res?.Location };
      }),
    );

    await Promise.all(files.map((f) => fs.unlink(f.path)));
    return result;
  }

  async getPresignedUrl(filename: string) {
    const newFilename = createFileName(filename);
    const presignedUrl = await this.s3Service.getPresignedUrl(newFilename);
    const url = presignedUrl.split('?')[0];
    return {
      url,
      presignedUrl,
    };
  }
}
