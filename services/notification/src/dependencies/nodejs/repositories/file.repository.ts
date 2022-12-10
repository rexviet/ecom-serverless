import { Readable } from 'stream';
import { IFileDS } from '../data-sources/file.ds';

export interface IFileRepository {
  getFile(bucketName: string, fileKey: string): Promise<Readable>;
}

export class FileRepositoryImpl implements IFileRepository {
  constructor(private readonly fileDS: IFileDS) {}

  public async getFile(bucketName: string, fileKey: string): Promise<Readable> {
    return this.fileDS.getFile(bucketName, fileKey);
  }
}
