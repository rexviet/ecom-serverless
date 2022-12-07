import { IFileDS } from '../data-sources/file.ds';

export interface IFileRepository {
  upload(fileData: Buffer, fileName: string, contentType: string): Promise<void>;
}

export class FileRepositoryImpl implements IFileRepository {
  constructor(private readonly fileDS: IFileDS) {}

  public async upload(fileData: Buffer, fileName: string, contentType: string): Promise<void> {
    return this.fileDS.upload(fileData, fileName, contentType);
  }
}
