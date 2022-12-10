import { S3 } from 'aws-sdk';
import { GetObjectRequest } from 'aws-sdk/clients/s3';
import { Readable } from 'stream';
import { IS3Options } from '../common/s3Options';

export interface IFileDS {
  getFile(bucketName: string, fileKey: string): Promise<Readable>;
}

export class S3FileDSImpl implements IFileDS {
  constructor(private readonly s3Client: S3, private readonly options: IS3Options) {}

  public async getFile(bucketName: string, fileKey: string): Promise<Readable> {
    const params: GetObjectRequest = {
      Bucket: bucketName,
      Key: fileKey,
    };
    return this.s3Client.getObject(params).createReadStream();
  }
}
