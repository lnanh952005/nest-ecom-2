import fs from 'fs';
import mime from 'mime-types';
import { Upload } from '@aws-sdk/lib-storage';
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { EnvService } from 'src/modules/share/services/env.service';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3: S3;
  constructor(private envService: EnvService) {
    this.s3 = new S3({
      endpoint: this.envService.S3_ENDPOINT,
      region: this.envService.S3_REGION,
      credentials: {
        accessKeyId: this.envService.S3_ACCESS_KEY,
        secretAccessKey: this.envService.S3_SECRET_KEY,
      },
    });
  }

  async uploadFile({
    contentType,
    filename,
    filepath,
  }: {
    filename: string;
    filepath: string;
    contentType: string;
  }) {
    try {
      const parallelUploads3 = new Upload({
        client: this.s3,
        params: {
          Bucket: this.envService.S3_BUCKET_NAME,
          Key: 'images/' + filename,
          Body: fs.readFileSync(filepath),
          ContentType: contentType,
        },

        // optional tags
        tags: [
          /*...*/
        ],

        // additional optional fields show default values below:

        // (optional) concurrency configuration
        queueSize: 4,

        // (optional) size of each part, in bytes, at least 5MB
        partSize: 1024 * 1024 * 5,

        // (optional) when true, do not automatically call AbortMultipartUpload when
        // a multipart upload fails to complete. You should then manually handle
        // the leftover parts.
        leavePartsOnError: false,
      });

      parallelUploads3.on('httpUploadProgress', (progress) => {
        console.log(progress);
      });

      return parallelUploads3.done();
    } catch (e) {
      console.log(e);
    }
  }

  getPresignedUrl(filename: string) {
    const command = new PutObjectCommand({
      Key: filename,
      Bucket: this.envService.S3_BUCKET_NAME,
      ContentType: mime.lookup(filename) || 'application/octet-stream',
    });
    return getSignedUrl(this.s3, command, { expiresIn: 10 });
  }
}
