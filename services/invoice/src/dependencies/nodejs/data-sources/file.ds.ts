import { S3 } from 'aws-sdk';
import { IS3Options } from '../common/s3Options';

export interface IFileDS {
  upload(fileData: Buffer, fileName: string, contentType: string): Promise<void>;
}

export class S3FileDSImpl implements IFileDS {
  constructor(private readonly s3Client: S3, private readonly options: IS3Options) {}

  public async upload(fileData: Buffer, fileName: string, contentType: string): Promise<void> {
    const params: S3.PutObjectRequest = {
      Bucket: this.options.bucketName,
      Key: fileName,
      Body: fileData,
      ContentType: contentType,
    };

    await this.s3Client.upload(params).promise();
    return;
  }
}
